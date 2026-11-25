'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle, Compass, Phone } from 'lucide-react';

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  // Extract redirect target and optional prefilled identifier client-side safely
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const target = params.get('redirect');
      if (target && target.startsWith('/')) {
        setRedirectPath(target);
      }
      const prefillId = params.get('identifier');
      if (prefillId) {
        setIdentifier(prefillId);
      }
    }
  }, []);

  const getRedirectTarget = (role) => {
    if (redirectPath) {
      return redirectPath;
    }
    if (role === 'SUPER_ADMIN') return '/admin';
    if (role === 'COLLEGE_ADMIN') return '/college-portal';
    return '/profile';
  };

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push(getRedirectTarget(user.role));
    }
  }, [user, router, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const loggedInUser = await login(identifier, password);
      router.push(getRedirectTarget(loggedInUser.role));
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-grid-pattern bg-radial-gradient transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          <Compass className="w-8 h-8 text-indigo-400 animate-spin-slow" />
          <span>Career365Compass</span>
        </Link>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Welcome Back</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Sign in to access saved colleges, compare options, and track recommendations.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl py-8 px-6 sm:px-10 shadow-xl space-y-6 text-slate-800 dark:text-slate-100">
          {redirectPath && (
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-indigo-300">
              <Compass className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
              <span>Please sign in or create an account to access this feature.</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-400 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Address or Mobile Number */}
            <div className="space-y-1.5">
              <label htmlFor="identifier" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address or 10-Digit Mobile Number
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  {/^[6-9]\d{0,9}$/.test(identifier) ? (
                    <Phone className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                </div>
                <input
                  id="identifier"
                  type="text"
                  required
                  placeholder="name@example.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                You can sign in with your registered email or 10-digit mobile number.
              </p>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('To reset your password, please contact administrator support at support@career365compass.com or create a new student account.');
                  }}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-sm transition"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/10 transition cursor-pointer"
            >
              <span>{submitting ? 'Signing In...' : 'Sign In'}</span>
              <LogIn className="w-4 h-4" />
            </button>
          </form>

          {/* College Portal Quick Link */}
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-center space-y-1">
            <p className="font-bold text-slate-200">Are you a College Representative?</p>
            <Link href="/college-portal" className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1">
              <span>Go to College Self-Registration & Portal</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="text-center text-xs text-slate-400 border-t border-slate-800/60 pt-4">
            <span>Don't have an account? </span>
            <Link 
              href={redirectPath ? `/register?redirect=${encodeURIComponent(redirectPath)}` : "/register"} 
              className="font-bold text-indigo-400 hover:text-indigo-300 transition flex items-center justify-center gap-0.5 mt-1"
            >
              <span>Create an Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
