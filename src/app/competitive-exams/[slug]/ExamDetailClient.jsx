'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCompetitiveExamBySlug } from '@/lib/examsService';
import { 
  Trophy, 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  Share2, 
  Bookmark, 
  Download, 
  Check, 
  Phone, 
  Mail, 
  MapPin, 
  Award,
  BookOpen,
  Milestone,
  CheckSquare
} from 'lucide-react';

export default function ExamDetailClient({ slug }) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('eligibility'); // 'eligibility' | 'apply' | 'pattern' | 'opportunities'
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    async function fetchExam() {
      setLoading(true);
      try {
        const data = await getCompetitiveExamBySlug(slug);
        setExam(data);
      } catch (err) {
        console.error('Error fetching exam:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchExam();
  }, [slug]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  if (loading) {
    return (
      <div className="py-16 px-4 max-w-5xl mx-auto w-full space-y-8 animate-pulse text-left">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-full" />
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto text-center space-y-6">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto" />
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Examination Not Found</h1>
        <p className="text-sm text-slate-500">
          The requested competitive exam profile does not exist or has been relocated.
        </p>
        <Link 
          href="/competitive-exams"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exams Directory</span>
        </Link>
      </div>
    );
  }

  // Parse JSON data if stringified
  const steps = typeof exam.howToApplySteps === 'string'
    ? JSON.parse(exam.howToApplySteps)
    : (exam.howToApplySteps || []);

  const documents = typeof exam.documentsRequired === 'string'
    ? JSON.parse(exam.documentsRequired)
    : (exam.documentsRequired || []);

  const patternSubjects = typeof exam.examPattern === 'string'
    ? JSON.parse(exam.examPattern)
    : (exam.examPattern || []);

  const isOpen = exam.status === 'APPLICATIONS_OPEN';
  const isAfter10th = exam.stage === 'AFTER_10TH';

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8 text-left bg-radial-gradient">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Home</Link>
        <span>/</span>
        <Link href="/competitive-exams" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Competitive Exams</Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 truncate">{exam.shortCode}</span>
      </nav>

      {/* Hero Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
        
        {/* Accent Banner Line */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${
          isOpen 
            ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500' 
            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
        }`} />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2">
          
          <div className="space-y-3 max-w-3xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isAfter10th 
                  ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                  : 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
              }`}>
                <GraduationCap className="w-4 h-4" />
                <span>{isAfter10th ? 'After 10th Class' : 'After Intermediate (12th)'}</span>
              </span>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {exam.level === 'STATE' ? 'Telangana State Level' : 'National Level'}
              </span>

              {exam.badge && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{exam.badge}</span>
                </span>
              )}

              {isOpen ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Applications Active</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Upcoming Schedule</span>
                </span>
              )}
            </div>

            {/* Title & Short Code */}
            <div className="space-y-1">
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm sm:text-base font-display tracking-wide uppercase">
                {exam.shortCode}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-display tracking-tight leading-tight">
                {exam.name}
              </h1>
            </div>

            {/* Conducting Body */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <Building2 className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Conducted by: <strong className="text-slate-800 dark:text-slate-200">{exam.conductingBody}</strong></span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
              {exam.description}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 shrink-0 sm:min-w-[220px]">
            {exam.applicationPortalUrl && (
              <a
                href={exam.applicationPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-lg transition text-center"
              >
                <span>Apply on Official Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {exam.notificationPdfUrl && (
              <a
                href={exam.notificationPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Official Notification PDF</span>
              </a>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleShare}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>

              <button
                onClick={handleBookmark}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                  bookmarked
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-700 dark:text-amber-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Quick Highlights Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 border-t border-slate-150 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-150 dark:border-slate-800">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Application Deadline</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{exam.applicationEndDate || 'TBA'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-150 dark:border-slate-800">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Exam Date</span>
            <span className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">{exam.examDate || 'TBA'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-150 dark:border-slate-800">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Registration Fee</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{exam.applicationFee || 'Check notification'}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-150 dark:border-slate-800">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Exam Mode</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {exam.mode === 'ONLINE_CBT' ? 'Online (CBT)' : 'Offline (OMR Sheet)'}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-150 dark:border-slate-800 col-span-2 sm:col-span-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration & Marks</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{exam.totalMarks || '120 Marks'}</span>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2 sm:gap-4 no-scrollbar">
        <button
          onClick={() => setActiveTab('eligibility')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'eligibility'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Eligibility Criteria</span>
        </button>

        <button
          onClick={() => setActiveTab('apply')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'apply'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Where & How to Apply</span>
        </button>

        <button
          onClick={() => setActiveTab('pattern')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'pattern'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Exam Pattern & Syllabus</span>
        </button>

        <button
          onClick={() => setActiveTab('opportunities')}
          className={`py-3 px-4 font-bold text-xs sm:text-sm whitespace-nowrap border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'opportunities'
              ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Target Colleges & Careers</span>
        </button>
      </div>

      {/* Tab 1: ELIGIBILITY CRITERIA */}
      {activeTab === 'eligibility' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Official Eligibility Requirements
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Minimum Education */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Educational Qualification</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {exam.eligibilityMinEducation}
                </p>
              </div>

              {/* Age Limit */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Age Limitations & Relaxations</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {exam.eligibilityAgeLimit}
                </p>
              </div>

              {/* Minimum Marks */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Minimum Marks / GPA Required</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {exam.eligibilityMinMarks || 'Pass grade in qualifying examination.'}
                </p>
              </div>

              {/* Domicile / Local Status */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Domicile & Local Status (Telangana)</span>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {exam.eligibilityDomicile || 'Candidates must belong to Telangana / satisfy Presidential Order local candidate conditions.'}
                </p>
              </div>

            </div>

            {/* Subject Prerequisites */}
            {exam.eligibilitySubjectRequirements && (
              <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-slate-900 dark:text-slate-100">Mandatory Subjects: </span>
                  <span className="text-slate-700 dark:text-slate-300">{exam.eligibilitySubjectRequirements}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: WHERE & HOW TO APPLY */}
      {activeTab === 'apply' && (
        <div className="space-y-6">
          
          {/* Where to Apply Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Where to Apply (Official Portals & Centres)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Official Online Portal Card */}
              <div className="p-5 bg-gradient-to-br from-indigo-50/80 to-purple-50/60 dark:from-indigo-950/50 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">Primary Online Channel</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    Official Govt Portal
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{exam.name} Application Desk</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 break-all">{exam.officialWebsite}</p>
                </div>
                <a
                  href={exam.applicationPortalUrl || exam.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  <span>Open Official Application Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Offline Centres Card */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Offline & Assisted Support</span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">MeeSeva / TS Online Facilitation</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {exam.offlineCentres || 'Students without computer or internet access can visit any authorized MeeSeva or TS Online centre in Hyderabad / Telangana for assisted application filling and fee payment.'}
                </p>
                {exam.helplineContact && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>Helpline: <strong className="text-slate-800 dark:text-slate-200">{exam.helplineContact}</strong></span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* How to Apply Step-by-Step Guide */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <Milestone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                How to Apply (Step-by-Step Walkthrough)
              </h2>
            </div>

            {/* Steps Timeline */}
            <div className="space-y-4">
              {steps.map((s, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-150 dark:border-slate-800/80 transition hover:border-indigo-300 dark:hover:border-indigo-700"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {s.stepNumber || idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {s.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {s.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Documents Checklist */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Mandatory Documents Checklist Before Applying
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {documents.map((docItem, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{docItem}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 3: EXAM PATTERN & SYLLABUS */}
      {activeTab === 'pattern' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Examination Pattern & Subject Marks Breakdown
              </h2>
            </div>

            {/* Pattern Table */}
            {patternSubjects.length > 0 ? (
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold uppercase text-[11px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Subject / Section</th>
                      <th className="py-3 px-4 text-center">Number of Questions</th>
                      <th className="py-3 px-4 text-center">Total Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                    {patternSubjects.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition">
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{sub.subject}</td>
                        <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-400">{sub.questions}</td>
                        <td className="py-3 px-4 text-center font-bold text-indigo-600 dark:text-indigo-400">{sub.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Subject breakdown available in official notification.</p>
            )}

            {/* Marking Scheme and Duration Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Marking Scheme</span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{exam.markingScheme || '+1 mark per correct response.'}</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Duration</span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{exam.examDuration || '2.5 Hours'}</p>
              </div>
            </div>

            {/* Syllabus Summary */}
            {exam.syllabusSummary && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Syllabus Overview</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  {exam.syllabusSummary}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: TARGET COLLEGES & CAREERS */}
      {activeTab === 'opportunities' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Target Institutions & Academic Opportunities
              </h2>
            </div>

            <div className="space-y-5">
              
              {/* Participating Colleges */}
              {exam.targetColleges && (
                <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Admitting Colleges & Polytechnics</span>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {exam.targetColleges}
                  </p>
                </div>
              )}

              {/* Courses & Streams Offered */}
              {exam.coursesOffered && (
                <div className="p-5 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Courses & Diplomas Unlocked</span>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {exam.coursesOffered}
                  </p>
                </div>
              )}

            </div>

            {/* Quick Link to College Explorer */}
            <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Explore Participating Colleges on Career365Compass</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Search government and private colleges accepting this exam in Hyderabad.</p>
              </div>
              <Link
                href="/colleges"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
              >
                Browse Colleges Directory
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Back to All Exams Footer Link */}
      <div className="pt-4 flex justify-between items-center text-xs">
        <Link
          href="/competitive-exams"
          className="inline-flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Competitive Exams</span>
        </Link>
      </div>

    </div>
  );
}
