import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/jwt';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'An error occurred checking session' },
      { status: 500 }
    );
  }
}

// Student Profile updates (PUT /api/auth/me)
export async function PUT(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, mobileNumber, schoolName, percentage10th, preferredStream, preferredLocation, budget, hostelRequired } = body;

    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        name,
        mobileNumber,
        schoolName,
        percentage10th: percentage10th ? parseFloat(percentage10th) : null,
        preferredStream,
        preferredLocation,
        budget: budget ? parseFloat(budget) : null,
        hostelRequired: hostelRequired === true,
      }
    });

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json({ user: userWithoutPassword, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'An error occurred updating profile' },
      { status: 500 }
    );
  }
}
