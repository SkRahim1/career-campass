import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/jwt';

async function getStudentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  const payload = await verifyJWT(token);
  return payload;
}

export async function GET() {
  try {
    const student = await getStudentUser();
    if (!student) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const savedList = await prisma.savedCollege.findMany({
      where: { userId: student.userId },
      include: {
        college: {
          include: {
            streams: true,
            reviews: {
              where: { isApproved: true },
              select: { rating: true }
            }
          }
        }
      }
    });

    const formattedColleges = savedList.map(item => {
      const college = item.college;
      const totalReviews = college.reviews.length;
      const averageRating = totalReviews > 0
        ? parseFloat((college.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
        : 0;

      return {
        ...college,
        averageRating,
        totalReviews
      };
    });

    return NextResponse.json({ savedColleges: formattedColleges });
  } catch (error) {
    console.error('Fetch saved colleges error:', error);
    return NextResponse.json(
      { error: 'An error occurred fetching bookmarked colleges' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const student = await getStudentUser();
    if (!student) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to save colleges' }, { status: 401 });
    }

    const body = await request.json();
    const { collegeId } = body;

    if (!collegeId) {
      return NextResponse.json({ error: 'College ID is required' }, { status: 400 });
    }

    const collegeIdVal = parseInt(collegeId);

    // Check if college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeIdVal }
    });

    if (!collegeExists) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    // Upsert / save
    const savedRecord = await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId: student.userId,
          collegeId: collegeIdVal
        }
      },
      update: {},
      create: {
        userId: student.userId,
        collegeId: collegeIdVal
      }
    });

    return NextResponse.json({ savedRecord, message: 'College saved successfully' }, { status: 201 });
  } catch (error) {
    console.error('Save college error:', error);
    return NextResponse.json(
      { error: 'An error occurred saving the college' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const student = await getStudentUser();
    if (!student) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get('collegeId');

    if (!collegeId) {
      return NextResponse.json({ error: 'College ID is required' }, { status: 400 });
    }

    const collegeIdVal = parseInt(collegeId);

    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId: student.userId,
          collegeId: collegeIdVal
        }
      }
    });

    return NextResponse.json({ message: 'College removed from bookmarks' });
  } catch (error) {
    console.error('Remove saved college error:', error);
    return NextResponse.json(
      { error: 'An error occurred removing from bookmarks' },
      { status: 500 }
    );
  }
}
