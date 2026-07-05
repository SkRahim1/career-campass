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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const career = await prisma.career.findUnique({
        where: { slug }
      });
      if (!career) {
        return NextResponse.json({ error: 'Career path not found' }, { status: 404 });
      }
      return NextResponse.json({ career });
    }

    const careers = await prisma.career.findMany({
      orderBy: { title: 'asc' }
    });
    return NextResponse.json({ careers });
  } catch (error) {
    console.error('Fetch careers error:', error);
    return NextResponse.json(
      { error: 'An error occurred fetching careers' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { title, slug, overview, responsibilities, skillsRequired, qualificationRequired, salaryRangeMin, salaryRangeMax, futureScope, roadmapAfter10th, roadmapAfterIntermediate } = body;

    if (!title || !slug || !overview || !roadmapAfter10th || !roadmapAfterIntermediate) {
      return NextResponse.json({ error: 'Missing required career fields' }, { status: 400 });
    }

    const newCareer = await prisma.career.create({
      data: {
        title,
        slug: slug.toLowerCase(),
        overview,
        responsibilities: typeof responsibilities === 'string' ? responsibilities : JSON.stringify(responsibilities || []),
        skillsRequired: typeof skillsRequired === 'string' ? skillsRequired : JSON.stringify(skillsRequired || []),
        qualificationRequired,
        salaryRangeMin: parseFloat(salaryRangeMin || 0),
        salaryRangeMax: parseFloat(salaryRangeMax || 0),
        futureScope,
        roadmapAfter10th,
        roadmapAfterIntermediate
      }
    });

    return NextResponse.json({ career: newCareer, message: 'Career added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Create career error:', error);
    return NextResponse.json(
      { error: 'An error occurred saving the career' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, slug, overview, responsibilities, skillsRequired, qualificationRequired, salaryRangeMin, salaryRangeMax, futureScope, roadmapAfter10th, roadmapAfterIntermediate } = body;

    if (!id) {
      return NextResponse.json({ error: 'Career ID is required' }, { status: 400 });
    }

    const updatedCareer = await prisma.career.update({
      where: { id: parseInt(id) },
      data: {
        title,
        slug: slug?.toLowerCase(),
        overview,
        responsibilities: typeof responsibilities === 'string' ? responsibilities : JSON.stringify(responsibilities),
        skillsRequired: typeof skillsRequired === 'string' ? skillsRequired : JSON.stringify(skillsRequired),
        qualificationRequired,
        salaryRangeMin: salaryRangeMin ? parseFloat(salaryRangeMin) : undefined,
        salaryRangeMax: salaryRangeMax ? parseFloat(salaryRangeMax) : undefined,
        futureScope,
        roadmapAfter10th,
        roadmapAfterIntermediate
      }
    });

    return NextResponse.json({ career: updatedCareer, message: 'Career updated successfully' });
  } catch (error) {
    console.error('Update career error:', error);
    return NextResponse.json(
      { error: 'An error occurred updating the career' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const admin = await checkAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Career ID is required' }, { status: 400 });
    }

    await prisma.career.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Career path deleted successfully' });
  } catch (error) {
    console.error('Delete career error:', error);
    return NextResponse.json(
      { error: 'An error occurred deleting the career' },
      { status: 500 }
    );
  }
}
