import React from 'react';
import CollegeDetailClient from './CollegeDetailClient';
import prisma from '@/lib/prisma';

// This is executed on the server at build time
export async function generateStaticParams() {
  try {
    const colleges = await prisma.college.findMany({
      select: { id: true }
    });
    return colleges.map((c) => ({
      id: String(c.id)
    }));
  } catch (err) {
    console.error('Error generating static parameters for colleges:', err);
    return [];
  }
}

export default async function CollegePage({ params }) {
  const { id } = await params;
  return <CollegeDetailClient id={id} />;
}
