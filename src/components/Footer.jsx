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
              <span>Career Compass</span>
            </div>
            <p className="text-sm leading-relaxed">
              A comprehensive career guidance and college discovery platform designed specifically for 10th class students. Find Intermediate streams, Polytechnic diplomas, ITI courses, and scholarships in Hyderabad.
            </p>
            <div className="flex items-center gap-2 text-xs bg-white dark:bg-slate-900/60 text-slate-750 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg w-max shadow-xs">
              <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-405" />
              <span>Database: SQLite (Online)</span>
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
                <Link href="/admission-updates" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Admission Updates</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Student Login</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Create Profile</Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Frequently Asked Questions</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-slate-800 dark:text-slate-100 font-semibold text-sm tracking-wider uppercase mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-650 dark:text-indigo-400 mt-0.5 shrink-0" />
                <span>Renvix Technologies,<br />Hyderabad, Telangana, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-650 dark:text-indigo-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-650 dark:text-indigo-400 shrink-0" />
                <span>support@careercompass.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-900 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left text-slate-400 dark:text-slate-500">
            <span>© {new Date().getFullYear()} Career Compass. All rights reserved.</span>
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
