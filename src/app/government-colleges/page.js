import React from 'react';
import prisma from '@/lib/prisma';
import CollegeCard from '@/components/CollegeCard';
import AuthRequiredGate from '@/components/AuthRequiredGate';
import { Star, ShieldAlert, FileText, Landmark, ClipboardList, Coins } from 'lucide-react';

export default async function GovernmentCollegesPage() {
  // Fetch government colleges from SQLite
  const rawColleges = await prisma.college.findMany({
    where: { ownership: 'GOVERNMENT' },
    include: {
      streams: true,
      reviews: {
        where: { isApproved: true },
        select: { rating: true }
      }
    }
  });

  const colleges = rawColleges.map(c => {
    const totalReviews = c.reviews.length;
    const averageRating = totalReviews > 0
      ? parseFloat((c.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 0;
    return { ...c, averageRating, totalReviews };
  });

  const requiredDocuments = [
    '10th Class Memo / GPA Sheet (Original + 3 copies)',
    'Transfer Certificate (TC) from school',
    'Study & Bonafide Certificate (Class 6th to 10th)',
    'Caste Certificate (issued by Meeseva, if applicable)',
    'Income Certificate (issued after April 1st of admission year for fee concessions)',
    'Aadhaar Card copy',
    'Passport size photos (4 copies)',
    'Physical Disability / Sports / NCC Certificate (if seeking quota benefits)'
  ];

  return (
    <AuthRequiredGate
      featureName="Government Colleges Directory"
      featureDescription="Sign in or register to explore state-funded junior colleges, reservation guidelines, and free hostel facilities."
      iconName="landmark"
      redirectPath="/government-colleges"
    >
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12 bg-radial-gradient text-left">
      
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Landmark className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 font-display">Government Colleges</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
          Complete, verified index of state-funded junior colleges, polytechnics, and ITIs in Hyderabad. Accessible, affordable, and quality education.
        </p>
      </div>

      {/* Reservation & Document Guidelines Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md">
        
        {/* Left Column: Reservation Info & Admission */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Telangana State Reservation Quotas</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Admissions to state government junior and technical colleges strictly follow the official guidelines of the Telangana Government:
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-inner">
              <p className="text-slate-700 dark:text-slate-300"><span className="font-bold text-slate-800 dark:text-slate-400">Scheduled Castes (SC):</span> 15%</p>
              <p className="text-slate-700 dark:text-slate-300"><span className="font-bold text-slate-800 dark:text-slate-400">Scheduled Tribes (ST):</span> 6%</p>
              <p className="text-slate-700 dark:text-slate-300"><span className="font-bold text-slate-800 dark:text-slate-400">Backward Classes (BC):</span> 29%</p>
              <p className="text-slate-700 dark:text-slate-300"><span className="font-bold text-slate-800 dark:text-slate-400">EWS (General Category):</span> 10%</p>
              <p className="text-slate-700 dark:text-slate-300"><span className="font-bold text-slate-800 dark:text-slate-400">NCC / Sports Quota:</span> 2%</p>
              <p className="text-slate-700 dark:text-slate-300"><span className="font-bold text-slate-800 dark:text-slate-400">Physically Challenged:</span> 3%</p>
            </div>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-300 italic">Note: 33% of seats in all categories are reserved for girl candidates.</p>
          </div>

          <div className="space-y-3 border-t border-slate-150 dark:border-slate-800 pt-6">
            <h2 className="text-lg font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
              <Coins className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Fee Exemptions & Scholarships</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Government colleges offer education at nominal registration charges (typically ₹500 to ₹1,500 annually). Additionally:
              <br />
              <span className="font-bold text-indigo-600 dark:text-indigo-300 mt-1 block">
                • Students eligible for the ePASS Post-Matric Scholarship receive 100% Tuition Fee Reimbursement (RTF) and monthly maintenance allowances (MTF).
              </span>
            </p>
          </div>
        </div>

        {/* Right Column: Required Documents Checklist */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850/80 rounded-2xl p-6 space-y-4 shadow-inner">
          <h2 className="text-lg font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Required Documents Checklist</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Ensure you have these certificates ready during your physical document verification session:
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            {requiredDocuments.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">✓</span>
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* College Listings */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">List of Government Colleges</h2>
        {colleges.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-455 dark:text-slate-500 text-sm shadow-xs">
            No government colleges found in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <div key={college.id}>
                <CollegeCard college={college} />
              </div>
            ))}
          </div>
        )}
      </div>

      </div>
    </AuthRequiredGate>
  );
}
