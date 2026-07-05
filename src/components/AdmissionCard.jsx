import React from 'react';
import { Calendar, Bell, Pin } from 'lucide-react';

export default function AdmissionCard({ update }) {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'INTERMEDIATE':
        return 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      case 'POLYTECHNIC':
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'ITI':
        return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20';
      case 'SCHOLARSHIP':
        return 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20';
      default:
        return 'bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-500/20';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className={`relative bg-white dark:bg-slate-900 border ${
      update.isPinned ? 'border-indigo-500/50 shadow-indigo-500/5 shadow-md' : 'border-slate-200 dark:border-slate-800'
    } rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700/60 transition duration-300 flex flex-col justify-between h-full`}>
      {/* Pinned Ribbon */}
      {update.isPinned && (
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide">
          <Pin className="w-2.5 h-2.5 fill-current" />
          <span>Pinned</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Category Header */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getCategoryColor(update.category)}`}>
            {update.category}
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-[10px] flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(update.publishedDate)}</span>
          </span>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-slate-800 dark:text-slate-100 font-bold text-base leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-start gap-1.5">
            <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <span>{update.title}</span>
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
            {update.content}
          </p>
        </div>
      </div>
    </div>
  );
}
