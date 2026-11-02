import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/jwt';

// Helper to verify admin role
async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  const payload = await verifyJWT(token);
  if (!payload || payload.role !== 'SUPER_ADMIN') return null;
  return payload;
}

export async function GET() {
  try {
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    // 1. Core metrics
    const totalColleges = await prisma.college.count();
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalReviews = await prisma.review.count();

    // 2. Saved colleges count ranking
    const savedCounts = await prisma.savedCollege.groupBy({
      by: ['collegeId'],
      _count: {
        collegeId: true
      },
      orderBy: {
        _count: {
          collegeId: 'desc'
        }
      },
      take: 5
    });

    // Hydrate saved counts with college names
    const mostSavedColleges = await Promise.all(
      savedCounts.map(async (item) => {
        const college = await prisma.college.findUnique({
          where: { id: item.collegeId },
          select: { name: true }
        });
        return {
          name: college?.name || `College #${item.collegeId}`,
          count: item._count.collegeId
        };
      })
    );

    // 3. Top rated colleges
    const colleges = await prisma.college.findMany({
      include: {
        reviews: {
          where: { isApproved: true },
          select: { rating: true }
        }
      }
    });

    const ratedColleges = colleges
      .map(c => {
        const ratingSum = c.reviews.reduce((sum, r) => sum + r.rating, 0);
        const avg = c.reviews.length > 0 ? ratingSum / c.reviews.length : 0;
        return {
          id: c.id,
          name: c.name,
          rating: parseFloat(avg.toFixed(1)),
          reviewsCount: c.reviews.length
        };
      })
      .sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
      .slice(0, 5);

    return NextResponse.json({
      metrics: {
        totalColleges,
        totalStudents,
        totalReviews,
        mostSavedColleges,
        topRatedColleges: ratedColleges
      }
    });
  } catch (error) {
    console.error('Fetch admin metrics error:', error);
    return NextResponse.json(
      { error: 'An error occurred fetching dashboard metrics' },
      { status: 500 }
    );
  }
}
