import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, mobileNumber, schoolName, percentage10th, preferredStream, preferredLocation, budget, hostelRequired } = body;

    if (!name || !email || !password || !mobileNumber) {
      return NextResponse.json(
        { error: 'Name, email, password, and mobile number are required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        mobileNumber,
        role: 'STUDENT',
        schoolName: schoolName || null,
        percentage10th: percentage10th ? parseFloat(percentage10th) : null,
        preferredStream: preferredStream || null,
        preferredLocation: preferredLocation || null,
        budget: budget ? parseFloat(budget) : null,
        hostelRequired: hostelRequired === true,
      },
    });

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { message: 'User registered successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
