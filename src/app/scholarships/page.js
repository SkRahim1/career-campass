import React from 'react';
import prisma from '@/lib/prisma';
import ScholarshipCard from '@/components/ScholarshipCard';
import { Award, ShieldCheck, Info } from 'lucide-react';

export default async function ScholarshipsPage() {
  const scholarships = await prisma.scholarship.findMany({
    orderBy: { lastDate: 'asc' }
  });

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10 bg-radial-gradient text-left">
      
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-8 h-8 text-indigo-600 dark:text-indigo-405" />
          <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 font-display">Scholarships Directory</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
          Discover available state and national financial aid programs, eligibility limits, documents checklist, and direct portal links for post-10th courses.
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-start md:items-center shadow-md">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-150 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 text-left">
          <h3 className="text-slate-800 dark:text-slate-200 font-bold text-sm">Required Castes & Income Certificates</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            State scholarship schemes (like ePASS) require caste and income certificates issued by **Meeseva** within the current financial year. Make sure you apply for these certificates at least one month before college admission registrations close.
          </p>
        </div>
      </div>

      {/* Grid listing */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-805 dark:text-slate-100">Available Scholarships</h2>
        {scholarships.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 dark:text-slate-500 text-sm shadow-xs">
            No scholarships found in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scholarships.map((scholarship) => (
              <div key={scholarship.id}>
                <ScholarshipCard scholarship={scholarship} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
