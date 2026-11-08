import React from 'react';
import Link from 'next/link';
import { Compass, Mail, Phone, MapPin, Database } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-900 pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100 text-lg">
              <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Career365Compass</span>
            </div>
            <p className="text-sm leading-relaxed">
              A comprehensive career guidance and college discovery platform designed specifically for 10th class students. Find Intermediate streams, Polytechnic diplomas, ITI courses, and scholarships in Hyderabad.
            </p>
            <div className="flex items-center gap-2 text-xs bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg w-max shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>An Excellence Voices Initiative</span>
            </div>
          </div>

          {/* Directory Links */}
          <div>
            <h3 className="text-slate-800 dark:text-slate-100 font-semibold text-sm tracking-wider uppercase mb-4">Directories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/colleges" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Search Junior Colleges</Link>
              </li>
              <li>
                <Link href="/government-colleges" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Government Colleges</Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Career Library</Link>
              </li>
              <li>
                <Link href="/scholarships" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Scholarships Directory</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-slate-800 dark:text-slate-100 font-semibold text-sm tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-semibold text-indigo-600 dark:text-indigo-400">About Us & Vision</Link>
              </li>
              <li>
                <Link href="/college-portal" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-bold text-indigo-600 dark:text-indigo-400">College Portal (Registration)</Link>
              </li>
              <li>
                <Link href="/survey" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Student Survey (25 Qs)</Link>
              </li>
              <li>
                <Link href="/admission-updates" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Admission Updates</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Student Login</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Create Profile</Link>
              </li>
            </ul>
          </div>

          {/* Leadership & Directors */}
          <div>
            <h3 className="text-slate-800 dark:text-slate-100 font-semibold text-sm tracking-wider uppercase mb-4">Leadership & Directors</h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-0.5 border-b border-slate-200 dark:border-slate-850 pb-2.5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-100">Rahim Shaikh</p>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Director</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Co-founder, Excellence Voices</p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <a href="tel:9284306159" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-slate-700 dark:text-slate-300">+91 92843 06159</a>
                </div>
              </div>

              <div className="space-y-0.5 border-b border-slate-200 dark:border-slate-850 pb-2.5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-100">Raviteja Pendem</p>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Director</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Director</p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <a href="tel:6304300983" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-slate-700 dark:text-slate-300">+91 63043 00983</a>
                </div>
              </div>

              <div className="space-y-0.5 border-b border-slate-200 dark:border-slate-850 pb-2.5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-100">Lakshya Rana</p>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Director</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Director</p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <a href="tel:8125318601" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium text-slate-700 dark:text-slate-300">+91 81253 18601</a>
                </div>
              </div>

              <div className="pt-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <a href="mailto:support@career365compass.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate text-slate-600 dark:text-slate-400">support@career365compass.com</a>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span>Hyderabad, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-900 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left text-slate-400 dark:text-slate-500">
            <span>© {new Date().getFullYear()} Career365Compass. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span>
              A product of{' '}
              <a 
                href="https://renvixteach.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-303 font-semibold hover:underline transition cursor-pointer"
              >
                Renvix Technologies
              </a>
            </span>
          </div>
          <div className="flex gap-6 text-slate-500 dark:text-slate-400">
            <Link href="#" className="hover:text-slate-800 dark:hover:text-slate-200 transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-800 dark:hover:text-slate-200 transition">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-850 dark:hover:text-slate-200 transition">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
