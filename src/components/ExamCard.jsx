'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Calendar, 
  Clock, 
  ExternalLink, 
  ArrowRight, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  FileText,
  BadgeCheck
} from 'lucide-react';

export default function ExamCard({ exam }) {
  if (!exam) return null;

  const isOpen = exam.status === 'APPLICATIONS_OPEN';
  const isUpcoming = exam.status === 'UPCOMING';
  const isAfter10th = exam.stage === 'AFTER_10TH';

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left">
      {/* Decorative top accent gradient */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${
        isOpen 
          ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500' 
          : isAfter10th 
          ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' 
          : 'bg-gradient-to-r from-blue-500 to-cyan-500'
      }`} />

      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Stage Badge */}
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
              isAfter10th 
                ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                : 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
            }`}>
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{isAfter10th ? 'After 10th' : 'After Inter (12th)'}</span>
            </span>

            {/* Level Badge */}
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {exam.level === 'STATE' ? 'Telangana State' : 'National'}
            </span>

            {/* Custom highlight badge if present */}
            {exam.badge && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{exam.badge}</span>
              </span>
            )}
          </div>

          {/* Status Badge */}
          <div>
            {isOpen ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Apply Now</span>
              </span>
            ) : isUpcoming ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Clock className="w-3 h-3 text-amber-500" />
                <span>Upcoming</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                <span>Closed</span>
              </span>
            )}
          </div>
        </div>

        {/* Short Code & Title */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400 font-display">
              {exam.shortCode}
            </span>
          </div>
          <Link 
            href={`/competitive-exams/${exam.slug}`} 
            className="block text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition leading-snug line-clamp-2"
          >
            {exam.name}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{exam.conductingBody}</span>
          </div>
        </div>

        {/* Overview snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {exam.description}
        </p>

        {/* Key Information Box */}
        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl p-3.5 space-y-2 border border-slate-150 dark:border-slate-800/80 text-xs">
          {/* Eligibility highlight */}
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-slate-700 dark:text-slate-300">Eligibility: </span>
              <span className="text-slate-600 dark:text-slate-400 line-clamp-2">{exam.eligibilityMinEducation}</span>
            </div>
          </div>

          {/* Dates highlight */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Application Deadline</p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {exam.applicationEndDate || 'To be announced'}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Exam Date</p>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 truncate">
                {exam.examDate || 'To be announced'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
        {/* Direct official website link ("Where to Apply") */}
        {exam.officialWebsite && (
          <a
            href={exam.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            title="Open official examination portal"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {/* Details & How to Apply button */}
        <Link
          href={`/competitive-exams/${exam.slug}`}
          className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 px-4 py-2 rounded-xl transition shadow-sm hover:shadow group-hover:translate-x-0.5 transform"
        >
          <span>Eligibility & Apply</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
