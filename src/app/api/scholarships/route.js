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
    const scholarships = await prisma.scholarship.findMany({
      orderBy: { lastDate: 'asc' }
    });
    return NextResponse.json({ scholarships });
  } catch (error) {
    console.error('Fetch scholarships error:', error);
    return NextResponse.json(
      { error: 'An error occurred fetching scholarships' },
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
    const { name, eligibility, requiredDocuments, incomeCriteria, lastDate, officialWebsite } = body;

    if (!name || !eligibility) {
      return NextResponse.json({ error: 'Name and eligibility criteria are required' }, { status: 400 });
    }

    const newScholarship = await prisma.scholarship.create({
      data: {
        name,
        eligibility,
        requiredDocuments: typeof requiredDocuments === 'string' ? requiredDocuments : JSON.stringify(requiredDocuments || []),
        incomeCriteria,
        lastDate,
        officialWebsite
      }
    });

    return NextResponse.json({ scholarship: newScholarship, message: 'Scholarship created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Create scholarship error:', error);
    return NextResponse.json(
      { error: 'An error occurred saving the scholarship' },
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
    const { id, name, eligibility, requiredDocuments, incomeCriteria, lastDate, officialWebsite } = body;

    if (!id) {
      return NextResponse.json({ error: 'Scholarship ID is required' }, { status: 400 });
    }

    const updatedScholarship = await prisma.scholarship.update({
      where: { id: parseInt(id) },
      data: {
        name,
        eligibility,
        requiredDocuments: typeof requiredDocuments === 'string' ? requiredDocuments : JSON.stringify(requiredDocuments),
        incomeCriteria,
        lastDate,
        officialWebsite
      }
    });

    return NextResponse.json({ scholarship: updatedScholarship, message: 'Scholarship updated successfully' });
  } catch (error) {
    console.error('Update scholarship error:', error);
    return NextResponse.json(
      { error: 'An error occurred updating the scholarship' },
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
      return NextResponse.json({ error: 'Scholarship ID is required' }, { status: 400 });
    }

    await prisma.scholarship.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Scholarship deleted successfully' });
  } catch (error) {
    console.error('Delete scholarship error:', error);
    return NextResponse.json(
      { error: 'An error occurred deleting the scholarship' },
      { status: 500 }
    );
  }
}
