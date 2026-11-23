import React from 'react';
import prisma from '@/lib/prisma';
import ExamDetailClient from './ExamDetailClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const exam = await prisma.competitiveExam.findUnique({
      where: { slug }
    });
    if (!exam) return { title: 'Exam Not Found | Career 365 Compass' };

    const title = `${exam.shortCode} - ${exam.name} | Eligibility, How & Where to Apply`;
    const description = `Complete guide for ${exam.name} (${exam.shortCode}) on Career 365 Compass (Career365Compass). Check college admission eligibility criteria, step-by-step application process, syllabus, and official updates for Telangana entrance exams and competitive exams after 12th.`;
    const canonicalUrl = `/competitive-exams/${slug}/`;
    
    return {
      title,
      description,
      keywords: [
        'Career 365 Compass',
        'Career365Compass',
        exam.shortCode,
        exam.name,
        'Competitive exams after 12th',
        'Telangana entrance exams',
        'College admission eligibility',
        'How to apply',
        'Syllabus',
        'Telangana entrance tests',
        'TS POLYCET 2026',
        'TG EAPCET'
      ],
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${exam.shortCode} Exam Guide & Eligibility | Career 365 Compass`,
        siteName: 'Career 365 Compass',
        description,
        url: `https://career365compass.in${canonicalUrl}`,
        type: 'article',
        images: [
          {
            url: '/images/portal-features.jpg',
            width: 1200,
            height: 630,
            alt: `${exam.name} Examination Guide - Career 365 Compass`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${exam.shortCode} Guide | Career 365 Compass`,
        description,
        images: ['/images/portal-features.jpg'],
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
  let exam = null;
  try {
    const rawExam = await prisma.competitiveExam.findUnique({
      where: { slug }
    });
    if (rawExam) {
      exam = {
        ...rawExam,
        howToApplySteps: typeof rawExam.howToApplySteps === 'string' ? JSON.parse(rawExam.howToApplySteps) : rawExam.howToApplySteps,
        documentsRequired: typeof rawExam.documentsRequired === 'string' ? JSON.parse(rawExam.documentsRequired) : rawExam.documentsRequired,
        examPattern: typeof rawExam.examPattern === 'string' ? JSON.parse(rawExam.examPattern) : rawExam.examPattern,
      };
    }
  } catch (err) {
    console.error('Error fetching exam for SSG:', err);
  }
  return <ExamDetailClient slug={slug} initialExam={exam} />;
}

