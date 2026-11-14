'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Lock, 
  LogIn, 
  UserPlus, 
  ArrowLeft, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  ClipboardList, 
  Building2, 
  Landmark, 
  Briefcase, 
  BookOpen, 
  ArrowRightLeft, 
  Bookmark 
} from 'lucide-react';

const ICON_MAP = {
  survey: ClipboardList,
  college: Building2,
  landmark: Landmark,
  career: Briefcase,
  book: BookOpen,
  compare: ArrowRightLeft,
  bookmark: Bookmark,
  lock: Lock,
};

export default function AuthRequiredGate({
  featureName = 'this feature',
  featureDescription = 'Sign in or create a student account to unlock full access, save preferences, and receive personalized recommendations.',
  iconName = 'lock',
  redirectPath = '/',
  children
}) {
  const { user, loading } = useAuth();

  // 1. While authentication state is checking
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
          Verifying session...
        </p>
      </div>
    );
  }

  // 2. If authenticated, render protected children directly
  if (user) {
    return <>{children}</>;
  }

  // 3. If unauthenticated, render the Sign In Required gate
  const IconComponent = ICON_MAP[iconName] || Lock;
  const loginUrl = `/login?redirect=${encodeURIComponent(redirectPath)}`;
  const registerUrl = `/register?redirect=${encodeURIComponent(redirectPath)}`;

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-radial-gradient">
      <div className="max-w-md w-full rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-fadeIn transition-colors">
        
        {/* Glow & Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full rounded-[14px] bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <IconComponent className="w-8 h-8 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Text Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Sign In Required</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Access {featureName}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            {featureDescription}
          </p>
        </div>

        {/* What You Unlock */}
        <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 text-left space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <p className="font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px]">Included with your account:</p>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span>Full search & filters across 54+ verified colleges</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span>Detailed career roadmaps with salary guides</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span>Diagnostic Student Survey with instant matches</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <Link
            href={loginUrl}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-[0.98] cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </Link>

          <Link
            href={registerUrl}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition active:scale-[0.98] cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Create Free Student Account</span>
          </Link>
        </div>

        {/* Back to Home */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home Preview</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
