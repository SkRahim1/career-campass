'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Compass, 
  X, 
  LogIn, 
  UserPlus, 
  ClipboardList, 
  Building2, 
  BookOpen, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function HomeAuthModal() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // If auth state is still resolving or user is already signed in, do nothing
    if (loading || user) {
      setIsOpen(false);
      return;
    }

    // Check if dismissed in this browser session
    const isDismissed = sessionStorage.getItem('cc_home_modal_dismissed');
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('cc_home_modal_dismissed', 'true');
  };

  if (!isOpen || user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl text-left space-y-6 overflow-hidden animate-scaleUp"
        role="dialog"
        aria-modal="true"
      >
        {/* Background glow decoration */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar with badge and close button */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Welcome to Career Compass 365</span>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Heading & Intro */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            Sign In to Unlock{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Personalized Guidance
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Please sign in to take the Class 10 student survey, search verified colleges, and explore customized career roadmaps.
          </p>
        </div>

        {/* Key Features Quick List */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0">
              <ClipboardList className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">25-Question Class 10 Survey</p>
              <p className="text-[11px] text-slate-400">Discover matching colleges based on your stream and budget</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-purple-600/20 text-purple-400 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Search 54+ Verified Colleges</p>
              <p className="text-[11px] text-slate-400">Fees, facilities, streams, and student ratings across Hyderabad</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="p-2 rounded-lg bg-pink-600/20 text-pink-400 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">50+ Career Roadmaps</p>
              <p className="text-[11px] text-slate-400">Clear eligibility, salary ranges, and step-by-step guides</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link
            href="/login"
            onClick={handleDismiss}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition active:scale-[0.98] cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>

          <Link
            href="/register"
            onClick={handleDismiss}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm transition active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-purple-400" />
            <span>Create Free Student Account</span>
          </Link>
        </div>

        {/* Cancel / Browse Preview Link */}
        <div className="text-center pt-1 border-t border-slate-800/60">
          <button
            onClick={handleDismiss}
            className="text-xs text-slate-400 hover:text-slate-200 transition font-medium cursor-pointer"
          >
            Maybe later, browse preview first →
          </button>
        </div>

      </div>
    </div>
  );
}
