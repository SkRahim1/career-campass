import React from 'react';
import { Calendar, DollarSign, ExternalLink, Award, FileText } from 'lucide-react';

export default function ScholarshipCard({ scholarship }) {
  const docs = typeof scholarship.requiredDocuments === 'string'
    ? JSON.parse(scholarship.requiredDocuments)
    : (scholarship.requiredDocuments || []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isExpired = scholarship.lastDate && new Date(scholarship.lastDate) < new Date();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:border-indigo-500/40 hover:shadow-indigo-500/5 hover:shadow-lg transition duration-305 flex flex-col justify-between h-full group">
      <div className="space-y-4">
        {/* Header Title */}
        <div className="flex items-start justify-between gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-150 dark:border-indigo-500/20 shrink-0 shadow-xs">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          {scholarship.lastDate && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
              isExpired 
                ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20' 
                : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20'
            }`}>
              {isExpired ? 'Expired' : 'Active'}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-slate-850 dark:text-slate-100 font-bold text-base leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
            {scholarship.name}
          </h3>
          
          {/* Income Limit */}
          {scholarship.incomeCriteria && (
            <p className="text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-1 bg-indigo-50/50 dark:bg-indigo-500/5 px-2.5 py-1.5 rounded-lg border border-indigo-150 dark:border-indigo-500/10 w-max shadow-xs">
              <DollarSign className="w-3.5 h-3.5" />
              <span><span className="font-semibold">Income limit:</span> {scholarship.incomeCriteria}</span>
            </p>
          )}

          {/* Eligibility */}
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            {scholarship.eligibility}
          </p>
        </div>

        {/* Required Docs */}
        {docs.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              <span>Required Documents</span>
            </span>
            <div className="flex flex-wrap gap-1">
              {docs.slice(0, 3).map((doc, idx) => (
                <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-300 border border-slate-150 dark:border-transparent px-2.5 py-1 rounded-md">
                  {doc}
                </span>
              ))}
              {docs.length > 3 && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium px-1 mt-0.5">+{docs.length - 3} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer info and Apply Link */}
      <div className="border-t border-slate-150 dark:border-slate-800/60 mt-5 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          <Calendar className="w-4 h-4 text-slate-405 dark:text-slate-500 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide block leading-none">Last Date</span>
            <span className={`font-bold ${isExpired ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
              {formatDate(scholarship.lastDate)}
            </span>
          </div>
        </div>

        {scholarship.officialWebsite && (
          <a
            href={scholarship.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-600 dark:bg-indigo-600/10 dark:hover:bg-indigo-600 text-indigo-650 dark:text-indigo-400 hover:text-white dark:hover:text-white border border-indigo-150 dark:border-indigo-500/20 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <span>Apply Now</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
