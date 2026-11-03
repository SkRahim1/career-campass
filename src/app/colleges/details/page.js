'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CollegeDetailClient from '../[id]/CollegeDetailClient';

function CollegeDetailsInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <div className="min-h-[60vh] bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        No college ID specified in query.
      </div>
    );
  }

  return <CollegeDetailClient id={id} />;
}

export default function CollegeDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CollegeDetailsInner />
    </Suspense>
  );
}
