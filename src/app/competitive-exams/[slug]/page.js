import React from 'react';
import prisma from '@/lib/prisma';
import ExamDetailClient from './ExamDetailClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const exam = await prisma.competitiveExam.findUnique({
      where: { slug }
    });
    if (!exam) return { title: 'Exam Not Found - Career365Compass' };
    
    return {
      title: `${exam.shortCode} - ${exam.name} | Eligibility, How & Where to Apply`,
      description: `Complete guide for ${exam.name}. Check eligibility criteria, step-by-step application process, official website link, exam pattern, and syllabus for Telangana students.`,
      keywords: `${exam.shortCode}, ${exam.name}, eligibility criteria, how to apply, where to apply, syllabus, Telangana`,
    };
  } catch (err) {
    return { title: 'Competitive Exam Details - Career365Compass' };
  }
}

export async function generateStaticParams() {
  try {
    const exams = await prisma.competitiveExam.findMany({
      select: { slug: true }
    });
    return exams.map((e) => ({
      slug: e.slug
    }));
  } catch (err) {
    console.error('Error generating static params for competitive exams:', err);
    return [];
  }
}

export default async function ExamDetailPage({ params }) {
  const { slug } = await params;
  return <ExamDetailClient slug={slug} />;
}
