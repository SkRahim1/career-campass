import React from 'react';
import Link from 'next/link';
import { Briefcase, TrendingUp, DollarSign } from 'lucide-react';

export default function CareerCard({ career }) {
  // Parse responsibilities and skills if stringified JSON
  const skills = typeof career.skillsRequired === 'string'
    ? JSON.parse(career.skillsRequired)
    : (career.skillsRequired || []);

  const formatSalary = (val) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)}L`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 hover:shadow-indigo-500/5 hover:shadow-lg transition duration-305 flex flex-col justify-between h-full group">
      <div className="space-y-4">
        {/* Header Icon */}
        <div className="flex items-center justify-between">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-150 dark:border-indigo-500/20 group-hover:bg-indigo-600/10 group-hover:border-indigo-500/40 transition shadow-xs">
            <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex items-center gap-1 text-[10px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-full">
            <TrendingUp className="w-3 h-3" />
            <span>High Growth</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-slate-850 dark:text-slate-100 font-bold text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
            <Link href={`/careers/${career.slug}`}>
              {career.title}
            </Link>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
            {career.overview}
          </p>
        </div>

        {/* Core Skills */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Core Skills</span>
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-300 border border-slate-150 dark:border-transparent px-2 py-0.5 rounded font-medium">
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium px-1">+{skills.length - 3} more</span>
            )}
          </div>
        </div>
      </div>

      {/* Salary & Actions */}
      <div className="border-t border-slate-150 dark:border-slate-800/60 mt-5 pt-4 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide block">Salary Range</span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center">
            <DollarSign className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>{formatSalary(career.salaryRangeMin)} - {formatSalary(career.salaryRangeMax)} / yr</span>
          </span>
        </div>
        
        <Link
          href={`/careers/${career.slug}`}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
        >
          <span>Roadmap</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
