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
    const category = searchParams.get('category'); // 'INTERMEDIATE', 'POLYTECHNIC', 'ITI', 'SCHOLARSHIP', 'OTHER'

    const where = {};
    if (category && category !== 'ALL') {
      where.category = category;
    }

    const updates = await prisma.admissionUpdate.findMany({
      where,
      orderBy: [
        { isPinned: 'desc' },
        { publishedDate: 'desc' }
      ]
    });
    return NextResponse.json({ updates });
  } catch (error) {
    console.error('Fetch updates error:', error);
    return NextResponse.json(
      { error: 'An error occurred fetching admission updates' },
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
    const { title, category, content, isPinned } = body;

    if (!title || !category || !content) {
      return NextResponse.json({ error: 'Title, category, and content are required' }, { status: 400 });
    }

    const newUpdate = await prisma.admissionUpdate.create({
      data: {
        title,
        category,
        content,
        isPinned: isPinned === true
      }
    });

    return NextResponse.json({ update: newUpdate, message: 'Admission update published successfully' }, { status: 201 });
  } catch (error) {
    console.error('Create update error:', error);
    return NextResponse.json(
      { error: 'An error occurred publishing the update' },
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
    const { id, title, category, content, isPinned } = body;

    if (!id) {
      return NextResponse.json({ error: 'Update ID is required' }, { status: 400 });
    }

    const updatedUpdate = await prisma.admissionUpdate.update({
      where: { id: parseInt(id) },
      data: {
        title,
        category,
        content,
        isPinned: isPinned === true
      }
    });

    return NextResponse.json({ update: updatedUpdate, message: 'Admission update modified successfully' });
  } catch (error) {
    console.error('Update update error:', error);
    return NextResponse.json(
      { error: 'An error occurred updating the notification' },
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
      return NextResponse.json({ error: 'Update ID is required' }, { status: 400 });
    }

    await prisma.admissionUpdate.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Admission update deleted successfully' });
  } catch (error) {
    console.error('Delete update error:', error);
    return NextResponse.json(
      { error: 'An error occurred deleting the update' },
      { status: 500 }
    );
  }
}
