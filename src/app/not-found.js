'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CollegeDetailClient from './colleges/[id]/CollegeDetailClient';

/**
 * Universal GitHub Pages SPA Fallback for Next.js Static Export.
 * If a visitor navigates to a dynamically created college like `/colleges/7217`
 * that was created after the latest static build, this component intercepts
 * the path, extracts the college ID, and dynamically renders the full
 * CollegeDetailClient from Firestore without showing a 404.
 */
export default function NotFound() {
  const [resolving, setResolving] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      // Match /colleges/:id or /colleges/:id/
      const match = pathname.match(/\/colleges\/([^\/]+)\/?$/);
      if (match && match[1] && match[1] !== 'details') {
        window.location.replace(`/colleges/details?id=${encodeURIComponent(match[1])}`);
        return;
      }
      setResolving(false);
    }
  }, []);

  if (resolving) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 font-display">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          The requested page could not be found or has been moved. Explore verified junior colleges in Hyderabad on Career 365 Compass.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/colleges"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            Explore Colleges
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
