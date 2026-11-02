import React from 'react';
import prisma from '@/lib/prisma';
import CareersSearchList from '@/components/CareersSearchList';
import { BookOpen } from 'lucide-react';

export default async function CareersLibraryPage() {
  const careers = await prisma.career.findMany({
    orderBy: { title: 'asc' }
  });

  return (
    <div className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10 bg-radial-gradient bg-grid-pattern flex-grow">
      
      {/* Title */}
      <div className="space-y-3 text-left">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-extrabold text-slate-100 font-display">Career Library</h1>
        </div>
        <p className="text-slate-400 text-sm max-w-2xl">
          Discover a diverse set of career options. Learn about qualification routes, starting salaries, required skill catalogs, and roadmap steps.
        </p>
      </div>

      {/* Search and filterable Grid component */}
      <CareersSearchList initialCareers={careers} />

    </div>
  );
}
