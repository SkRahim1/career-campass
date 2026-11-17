import React from 'react';
import prisma from '@/lib/prisma';
import CareersSearchList from '@/components/CareersSearchList';
import Link from 'next/link';
import { BookOpen, Compass, Sparkles, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Career Options After 10th & Courses After 12th | Career Library',
  description: 'Explore 50+ career options after 10th, courses after 12th, best courses after MPC, and courses after BiPC. Compare salary ranges, required entrance exams, and step-by-step career roadmaps for Telangana students.',
  keywords: [
    'Career options after 10th',
    'Courses after 12th',
    'Best courses after MPC',
    'Courses after BiPC',
    'How to choose a career after 10th',
    'Intermediate streams Telangana',
    'Career paths after 10th class',
    'Engineering vs Medical after 10th'
  ],
  alternates: {
    canonical: '/careers',
  },
  openGraph: {
    title: 'Career Options After 10th & Courses After 12th | Career365Compass',
    description: 'Comprehensive roadmaps for 50+ professions: eligibility, top courses after 12th, MPC & BiPC avenues, and salary expectations.',
  },
};

export default async function CareersLibraryPage() {
  const careers = await prisma.career.findMany({
    orderBy: { title: 'asc' }
  });

  return (
    <div className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12 bg-radial-gradient bg-grid-pattern flex-grow text-left">
      
      {/* Title & Introduction */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Verified Career Roadmaps & Guides</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 font-display">
          Career Options After 10th & Courses After 12th
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Wondering <strong className="text-indigo-300">how to choose a career after 10th</strong>? Browse over 50 structured career roadmaps. Compare entry requirements, intermediate stream prerequisites (MPC, BiPC, MEC, CEC), and discover top <strong className="text-indigo-300">courses after 12th</strong> with verified salary trajectories.
        </p>
      </div>

      {/* Quick Stream Pathways SEO Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase tracking-wide">
            <GraduationCap className="w-4 h-4" />
            <span>Best Courses After MPC</span>
          </div>
          <h2 className="text-lg font-bold text-slate-200">Engineering, Tech & Applied Science</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            MPC (Maths, Physics, Chemistry) unlocks direct pathways to B.Tech/B.E, Data Science, AI & Machine Learning, Architecture (B.Arch), Commercial Pilot, Merchant Navy, and UPSC NDA defense services.
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-300">
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">B.Tech / B.E</span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">Data Science</span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">Architecture</span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">Defense (NDA)</span>
          </div>
        </div>

        <div className="space-y-3 md:border-l md:border-slate-800 md:pl-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wide">
            <GraduationCap className="w-4 h-4" />
            <span>Courses After BiPC</span>
          </div>
          <h2 className="text-lg font-bold text-slate-200">Medicine, Pharmacy & Life Sciences</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            BiPC (Biology, Physics, Chemistry) is the primary gateway to MBBS, BDS, B.Pharm, Pharm.D, BSc Nursing, Physiotherapy, Veterinary Sciences, and Agricultural degrees (PJTSAU).
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-slate-300">
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">MBBS & BDS</span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">B.Pharmacy</span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">B.Sc Agriculture</span>
            <span className="bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">Biotechnology</span>
          </div>
        </div>
      </div>

      {/* Search and filterable Grid component */}
      <CareersSearchList initialCareers={careers} />

      {/* Guide Callout: How to choose a career after 10th */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <h2 className="text-xl font-bold text-white">Need Personalized Guidance on How to Choose a Career After 10th?</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Take our 5-minute interactive survey. We match your academic strengths and personal interests with the right stream, college options in Hyderabad, and eligible scholarships.
          </p>
        </div>
        <Link
          href="/survey"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3.5 rounded-2xl transition shrink-0 flex items-center gap-2"
        >
          <span>Take Guidance Survey</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
