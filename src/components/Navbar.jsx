'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Compass, Bookmark, GraduationCap, User, LogOut, LayoutDashboard, Bell, Sun, Moon, Building2, BookOpen, Award, ChevronRight, ClipboardList, Info, Trophy } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-sm dark:shadow-lg transition-colors">
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center shrink-0 mr-2 xl:mr-4">
              <Link href="/" className="flex items-center gap-1.5 xl:gap-2 font-extrabold text-base xl:text-lg 2xl:text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 hover:opacity-90 transition shrink-0 whitespace-nowrap">
                <Compass className="w-5 h-5 xl:w-6 xl:h-6 text-indigo-500 dark:text-indigo-400 animate-spin-slow shrink-0" />
                <span className="font-display">Career365Compass</span>
              </Link>
            </div>

            {/* Desktop Navigation Links (Properly responsive across 1024px to 4K) */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-3.5 shrink min-w-0">
              <Link href="/colleges" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-xs xl:text-sm whitespace-nowrap shrink-0 px-1.5 py-1">
                <span className="hidden 2xl:inline">Explore </span>Colleges
              </Link>
              <Link href="/government-colleges" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-xs xl:text-sm whitespace-nowrap shrink-0 px-1.5 py-1">
                Govt<span className="hidden xl:inline"> Colleges</span>
              </Link>
              <Link href="/competitive-exams" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-semibold text-xs xl:text-sm flex items-center gap-1 text-indigo-600 dark:text-indigo-300 whitespace-nowrap shrink-0 px-1.5 py-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span><span className="hidden xl:inline">Competitive </span>Exams</span>
              </Link>
              <Link href="/careers" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-xs xl:text-sm whitespace-nowrap shrink-0 px-1.5 py-1">
                Career<span className="hidden xl:inline"> Library</span>
              </Link>
              <Link href="/scholarships" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-xs xl:text-sm whitespace-nowrap shrink-0 px-1.5 py-1">
                Scholarships
              </Link>
              <Link href="/admission-updates" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-xs xl:text-sm flex items-center gap-1 whitespace-nowrap shrink-0 px-1.5 py-1">
                <Bell className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400 shrink-0" />
                <span>Updates</span>
              </Link>
              <Link href="/college-portal" className="text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 px-2 py-1 xl:px-2.5 xl:py-1 rounded-full transition flex items-center gap-1 whitespace-nowrap shrink-0">
                <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span><span className="hidden 2xl:inline">College </span>Portal</span>
              </Link>
              <Link href="/survey" className="hover:opacity-90 transition font-bold text-xs flex items-center gap-1 text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 px-2 py-1 xl:px-2.5 xl:py-1 rounded-full shadow-xs whitespace-nowrap shrink-0">
                <ClipboardList className="w-3.5 h-3.5 text-purple-500 animate-pulse shrink-0" />
                <span>Survey</span>
              </Link>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center gap-1.5 xl:gap-3 shrink-0 ml-1 xl:ml-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 xl:p-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:border-transparent dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition cursor-pointer shrink-0"
                aria-label="Toggle Theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
              </button>
              
              {user ? (
                <div className="flex items-center gap-2 xl:gap-3 shrink-0">
                  {user.role === 'SUPER_ADMIN' ? (
                    <Link href="/admin" className="flex items-center gap-1 bg-purple-650/10 dark:bg-purple-600/20 hover:bg-purple-650/20 dark:hover:bg-purple-600/30 text-purple-600 dark:text-purple-305 border border-purple-550/20 dark:border-purple-500/30 px-2.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition shadow-sm whitespace-nowrap shrink-0">
                      <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                      <span>Admin<span className="hidden xl:inline"> Panel</span></span>
                    </Link>
                  ) : user.role === 'COLLEGE_ADMIN' ? (
                    <Link href="/college-portal" className="flex items-center gap-1.5 bg-indigo-650/10 dark:bg-indigo-600/20 hover:bg-indigo-650/20 dark:hover:bg-indigo-600/30 text-indigo-600 dark:text-indigo-305 border border-indigo-555/20 dark:border-indigo-500/30 px-2.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition shadow-sm whitespace-nowrap shrink-0">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="max-w-[120px] truncate">{user.collegeName || 'Portal'}</span>
                    </Link>
                  ) : (
                    <>
                      <Link href="/saved-colleges" className="flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition text-xs xl:text-sm whitespace-nowrap shrink-0">
                        <Bookmark className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                        <span className="hidden xl:inline">Bookmarks</span>
                      </Link>
                      <Link href="/profile" className="flex items-center gap-1.5 bg-indigo-650/10 dark:bg-indigo-600/20 hover:bg-indigo-650/20 dark:hover:bg-indigo-600/30 text-indigo-600 dark:text-indigo-305 border border-indigo-555/20 dark:border-indigo-500/30 px-2.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition shadow-sm whitespace-nowrap shrink-0">
                        <User className="w-3.5 h-3.5 shrink-0" />
                        <span className="max-w-[100px] truncate">{user.name}</span>
                      </Link>
                    </>
                  )}
                  <button
                    onClick={logout}
                    className="flex items-center gap-1 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition text-xs xl:text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden xl:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 xl:gap-2.5 shrink-0">
                  <Link href="/login" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition font-semibold text-xs xl:text-sm whitespace-nowrap shrink-0 px-2 py-1">
                    Sign In
                  </Link>
                  <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold tracking-wide shadow-md hover:shadow-indigo-500/20 transition cursor-pointer whitespace-nowrap shrink-0">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile / Tablet Menu Button (shown on screens < 1024px) */}
            <div className="lg:hidden flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:border-transparent dark:hover:bg-slate-700 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition cursor-pointer"
                aria-label="Toggle Theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
              </button>
              <button
                onClick={toggleMenu}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus:outline-none cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dimmed Screen Overlay when Mobile Menu is Open */}
      {isOpen && (
        <div 
          onClick={toggleMenu}
          className="lg:hidden fixed inset-0 z-[98] bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Mobile Menu Drawer Panel - Decoupled & Opaque */}
      {isOpen && (
        <div className="lg:hidden fixed inset-y-0 right-0 z-[99] w-[85%] max-w-[380px] h-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-850 shadow-2xl flex flex-col p-6 space-y-6 animate-slide-in overflow-y-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-2 border-b border-slate-150 dark:border-slate-900">
            <Link href="/" onClick={toggleMenu} className="flex items-center gap-2 font-extrabold text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              <Compass className="w-5 h-5 text-indigo-500 dark:text-indigo-450 animate-spin-slow animate-spin-slow" />
              <span>Career365Compass</span>
            </Link>
            
            {/* Close Button */}
            <button
              onClick={toggleMenu}
              className="p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Links Card Deck (Extremely Premium Layout) */}
          <div className="flex-grow flex flex-col space-y-4 justify-start pt-2">
            
            {/* 1. Explore Colleges */}
            <Link
              href="/colleges"
              onClick={toggleMenu}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/20 dark:bg-slate-900/60 dark:hover:bg-indigo-900/10 border border-slate-150 dark:border-slate-850 hover:border-indigo-500/20 dark:hover:border-indigo-500/25 transition group text-left"
            >
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">Explore Colleges</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Junior & Poly institutes in Hyderabad</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* 2. Govt Colleges */}
            <Link
              href="/government-colleges"
              onClick={toggleMenu}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/20 dark:bg-slate-900/60 dark:hover:bg-emerald-900/10 border border-slate-150 dark:border-slate-850 hover:border-emerald-500/20 dark:hover:border-emerald-500/25 transition group text-left"
            >
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-405 group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">Government Colleges</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Reservation guidelines, fees & ePASS</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* 3. Competitive Exams */}
            <Link
              href="/competitive-exams"
              onClick={toggleMenu}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 hover:border-indigo-400 transition group text-left"
            >
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-xs text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition flex items-center gap-1.5">
                  <span>Competitive Exams</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">New</span>
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">POLYCET, APRJC, NDA & JEE guides</p>
              </div>
              <ChevronRight className="w-4 h-4 text-indigo-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* 3. Career Roadmaps */}
            <Link
              href="/careers"
              onClick={toggleMenu}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/20 dark:bg-slate-900/60 dark:hover:bg-purple-900/10 border border-slate-150 dark:border-slate-850 hover:border-purple-500/20 dark:hover:border-purple-500/25 transition group text-left"
            >
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-650 dark:text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200 group-hover:text-purple-650 dark:group-hover:text-purple-400 transition">Career Library</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">50+ roadmap guides post class-10</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* 4. Scholarships */}
            <Link
              href="/scholarships"
              onClick={toggleMenu}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/20 dark:bg-slate-900/60 dark:hover:bg-amber-900/10 border border-slate-150 dark:border-slate-850 hover:border-amber-500/20 dark:hover:border-amber-500/25 transition group text-left"
            >
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200 group-hover:text-amber-650 dark:group-hover:text-amber-400 transition">Scholarships</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">State & central financial aid directories</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>
 
            {/* 5. Updates */}
            <Link
              href="/admission-updates"
              onClick={toggleMenu}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 hover:bg-pink-50/20 dark:bg-slate-900/60 dark:hover:bg-pink-900/10 border border-slate-150 dark:border-slate-850 hover:border-pink-500/20 dark:hover:border-pink-500/25 transition group text-left"
            >
              <div className="p-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-500 dark:text-pink-400 group-hover:scale-105 transition-transform shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition">Admission Updates</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Live notifications & counseling bulletins</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* 6. Student Survey */}
            <Link
              href="/survey"
              onClick={toggleMenu}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 transition group text-left shadow-xs"
            >
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white group-hover:scale-105 transition-transform shrink-0">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-xs text-indigo-700 dark:text-indigo-300 transition">Student Survey</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Class 10 guidance survey (28 questions)</p>
              </div>
              <ChevronRight className="w-4 h-4 text-indigo-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* College Portal */}
            <Link
              href="/college-portal"
              onClick={toggleMenu}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-indigo-50/60 hover:bg-indigo-50 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800/60 transition group text-left"
            >
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white group-hover:scale-105 transition-transform shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-xs text-indigo-700 dark:text-indigo-300 transition">College Portal</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Institutional self-registration & dashboard</p>
              </div>
              <ChevronRight className="w-4 h-4 text-indigo-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* 7. About Us */}
            <Link
              href="/about"
              onClick={toggleMenu}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/20 dark:bg-slate-900/60 dark:hover:bg-indigo-900/10 border border-slate-150 dark:border-slate-850 hover:border-indigo-500/20 dark:hover:border-indigo-500/25 transition group text-left"
            >
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">About Us</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Our aim, Excellence Voices & Directors</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>

          </div>

          {/* Footer of menu: User details & Actions */}
          <div className="border-t border-slate-200 dark:border-slate-900 pt-5 space-y-4">
            {user ? (
              <div className="space-y-4 text-left">
                {/* Active user status card */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase">Active Profile</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                  </div>
                  <Link
                    href={user.role === 'SUPER_ADMIN' ? '/admin' : user.role === 'COLLEGE_ADMIN' ? '/college-portal' : '/profile'}
                    onClick={toggleMenu}
                    className="bg-indigo-600/10 dark:bg-indigo-600/20 hover:bg-indigo-600/20 dark:hover:bg-indigo-600/30 text-indigo-650 dark:text-indigo-305 px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
                  >
                    {user.role === 'SUPER_ADMIN' ? 'Admin Panel' : user.role === 'COLLEGE_ADMIN' ? 'College Portal' : 'Settings'}
                  </Link>
                </div>

                <div className="flex justify-between items-center gap-4 px-1">
                  {user.role !== 'SUPER_ADMIN' && (
                    <Link
                      href="/saved-colleges"
                      onClick={toggleMenu}
                      className="flex items-center gap-1.5 text-slate-505 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-bold"
                    >
                      <Bookmark className="w-4 h-4 text-yellow-500" />
                      <span>Bookmarks</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="flex items-center gap-1.5 text-red-500 hover:text-red-650 dark:text-red-405 dark:hover:text-red-300 text-xs font-bold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-red-500 dark:text-red-405" />
                    <span>Logout Session</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  onClick={toggleMenu}
                  href="/login"
                  className="block text-center border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 py-3.5 rounded-2xl text-xs font-bold transition shadow-sm"
                >
                  Sign In to Account
                </Link>
                <Link
                  onClick={toggleMenu}
                  href="/register"
                  className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-2xl text-xs font-bold shadow-md transition"
                >
                  Create Student Profile
                </Link>
              </div>
            )}
            
            {/* Tagline */}
            <p className="text-[9px] text-slate-500 dark:text-slate-600 text-center">
              Career365Compass • Verified Counselling Portal
            </p>
          </div>

        </div>
      )}
    </>
  );
}
