import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/jwt';

export async function POST(request, { params }) {
  try {
    const { id: rawId } = await params;
    const collegeId = parseInt(rawId);
    if (isNaN(collegeId)) {
      return NextResponse.json({ error: 'Invalid college ID' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to write a review' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }

    const body = await request.json();
    const { rating, reviewText } = body;

    if (!rating || !reviewText) {
      return NextResponse.json({ error: 'Rating and review text are required' }, { status: 400 });
    }

    const ratingVal = parseInt(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
    }

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId }
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    // Create the review
    const newReview = await prisma.review.create({
      data: {
        collegeId,
        userId: payload.userId,
        rating: ratingVal,
        reviewText,
        isApproved: false // Requires admin approval
      }
    });

    return NextResponse.json({
      review: newReview,
      message: 'Review submitted successfully. It will be visible once approved by an admin.'
    }, { status: 201 });
  } catch (error) {
    console.error('Submit review error:', error);
    return NextResponse.json(
      { error: 'An error occurred submitting review' },
      { status: 500 }
    );
  }
}
