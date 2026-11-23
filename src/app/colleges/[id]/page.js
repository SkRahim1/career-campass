import React from 'react';
import CollegeDetailClient from './CollegeDetailClient';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const collegeId = parseInt(id, 10);
    if (isNaN(collegeId)) return { title: 'College Profile | Career 365 Compass' };
    
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      include: { streams: true }
    });
    
    if (!college) return { title: 'College Profile | Career 365 Compass' };

    const streamsText = college.streams && college.streams.length > 0 
      ? college.streams.map(s => s.streamName).join(', ') 
      : 'MPC, BiPC, MEC, CEC';

    const title = `${college.name} - Admission Eligibility, Streams & Reviews`;
    const description = `Complete profile of ${college.name} (${college.ownership}) located in ${college.nearbyLandmark || college.address}, Hyderabad, Telangana on Career 365 Compass. Explore streams (${streamsText}), college admission eligibility, hostel facilities, and verified ratings among the best colleges in Hyderabad.`;
    const canonicalUrl = `/colleges/${id}/`;

    return {
      title,
      description,
      keywords: [
        'Career 365 Compass',
        'Career365Compass',
        college.name,
        'Best colleges in Hyderabad',
        'Degree colleges in Telangana',
        'College admission eligibility',
        `${college.address} colleges`,
        'Telangana junior college admissions',
        'Intermediate colleges in Hyderabad',
        'Polytechnic diploma Hyderabad'
      ],
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${college.name} - Admission, Streams & Fee Structure | Career 365 Compass`,
        siteName: 'Career 365 Compass',
        description,
        url: `https://career365compass.in${canonicalUrl}`,
        type: 'website',
        images: [
          {
            url: college.coverImageUrl || '/images/portal-features.jpg',
            width: 1200,
            height: 630,
            alt: `${college.name} Campus in Hyderabad - Career 365 Compass`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${college.name} | Career 365 Compass`,
        description,
        images: [college.coverImageUrl || '/images/portal-features.jpg'],
      },
    };
  } catch (err) {
    return { title: 'College Profile | Career 365 Compass' };
  }
}

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
  const collegeId = parseInt(id, 10);
  let college = null;
  if (!isNaN(collegeId)) {
    try {
      college = await prisma.college.findUnique({
        where: { id: collegeId },
        include: { streams: true }
      });
    } catch (err) {
      console.error('Error fetching college for SSG:', err);
    }
  }
  return <CollegeDetailClient id={id} initialCollege={college} />;
}

