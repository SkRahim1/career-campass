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
      description: `Complete guide for ${exam.name} (${exam.shortCode}). Check college admission eligibility criteria, step-by-step application process, syllabus, and official updates for Telangana entrance exams and competitive exams after 12th.`,
      keywords: [
        exam.shortCode,
        exam.name,
        'Competitive exams after 12th',
        'Telangana entrance exams',
        'College admission eligibility',
        'How to apply',
        'Syllabus',
        'Telangana entrance tests'
      ],
      alternates: {
        canonical: `/competitive-exams/${slug}`,
      },
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
