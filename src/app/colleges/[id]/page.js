import React from 'react';
import CollegeDetailClient from './CollegeDetailClient';
import prisma from '@/lib/prisma';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const collegeId = parseInt(id, 10);
    if (isNaN(collegeId)) return { title: 'College Profile | Career365Compass' };
    
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      include: { streams: true }
    });
    
    if (!college) return { title: 'College Profile | Career365Compass' };

    const streamsText = college.streams && college.streams.length > 0 
      ? college.streams.map(s => s.streamName).join(', ') 
      : 'MPC, BiPC, MEC, CEC';

    return {
      title: `${college.name} - Admission Eligibility, Streams & Reviews`,
      description: `Complete profile of ${college.name} (${college.ownership}) located in ${college.nearbyLandmark || college.address}, Hyderabad, Telangana. Explore streams (${streamsText}), college admission eligibility, hostel facilities, and verified ratings among the best colleges in Hyderabad.`,
      keywords: [
        college.name,
        'Best colleges in Hyderabad',
        'Degree colleges in Telangana',
        'College admission eligibility',
        `${college.address} colleges`,
        'Telangana junior college admissions'
      ],
      alternates: {
        canonical: `/colleges/${id}`,
      },
    };
  } catch (err) {
    return { title: 'College Profile | Career365Compass' };
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
  return <CollegeDetailClient id={id} />;
}
