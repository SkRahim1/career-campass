'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ExamCard from '@/components/ExamCard';
import { getAllCompetitiveExams } from '@/lib/examsService';
import { 
  Trophy, 
  Search, 
  Filter, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Building2, 
  ExternalLink,
  BookOpen,
  Info,
  Clock,
  Flame,
  Award
} from 'lucide-react';

export default function CompetitiveExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('ALL'); // 'ALL' | 'AFTER_10TH' | 'AFTER_12TH'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL'); // 'ALL' | 'STATE' | 'NATIONAL'
  const [selectedStatus, setSelectedStatus] = useState('ALL'); // 'ALL' | 'APPLICATIONS_OPEN' | 'UPCOMING'

  useEffect(() => {
    async function loadExams() {
      setLoading(true);
      try {
        const data = await getAllCompetitiveExams();
        setExams(data);
      } catch (err) {
        console.error('Failed to load competitive exams:', err);
      } finally {
        setLoading(false);
      }
    }
    loadExams();
  }, []);

  // Filter logic
  const filteredExams = exams.filter(exam => {
    // Stage
    if (selectedStage !== 'ALL' && exam.stage !== selectedStage) return false;
    
    // Category
    if (selectedCategory !== 'ALL' && exam.category !== selectedCategory) return false;
    
    // Level
    if (selectedLevel !== 'ALL' && exam.level !== selectedLevel) return false;
    
    // Status
    if (selectedStatus !== 'ALL' && exam.status !== selectedStatus) return false;
    
    // Search Term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      const matchName = exam.name?.toLowerCase().includes(term);
      const matchCode = exam.shortCode?.toLowerCase().includes(term);
      const matchBody = exam.conductingBody?.toLowerCase().includes(term);
      const matchDesc = exam.description?.toLowerCase().includes(term);
      const matchColleges = exam.targetColleges?.toLowerCase().includes(term);
      if (!matchName && !matchCode && !matchBody && !matchDesc && !matchColleges) return false;
    }

    return true;
  });

  const openCount = exams.filter(e => e.status === 'APPLICATIONS_OPEN').length;
  const post10thCount = exams.filter(e => e.stage === 'AFTER_10TH').length;
  const post12thCount = exams.filter(e => e.stage === 'AFTER_12TH').length;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10 bg-radial-gradient text-left">
      
      {/* Header & Title */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Trophy className="w-3.5 h-3.5 text-indigo-500" />
              <span>Telangana State & National Level Entrances</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-display tracking-tight">
              Competitive & Entrance Exams Directory
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
              Explore all verified entrance exams for 10th and 12th class students. Check official eligibility criteria, step-by-step application guides, official portal URLs, exam patterns, and admissions opportunities in Telangana and across India.
            </p>
          </div>

          {/* Quick Counter Cards */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 shadow-sm text-center min-w-[110px]">
              <span className="block text-2xl font-black text-indigo-600 dark:text-indigo-400">{exams.length}</span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Exams</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl px-4 py-3 shadow-sm text-center min-w-[110px]">
              <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                {openCount}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Apply Now</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 rounded-2xl px-4 py-3 shadow-sm text-center min-w-[110px]">
              <span className="block text-2xl font-black text-purple-600 dark:text-purple-400">{post10thCount}</span>
              <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">After 10th</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Notice Banner */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-pink-50/80 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border border-indigo-200/80 dark:border-indigo-800/60 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <p className="font-bold text-slate-900 dark:text-slate-100">
            Important Notice for Telangana Students (MeeSeva & ePASS Certificates)
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Most state government exams (TS POLYCET, TG APRJC CET, TSWREIS Inter CET) and subsequent ePASS fee reimbursement schemes require an active <strong>MeeSeva Caste Certificate</strong> and <strong>Income Certificate</strong> issued in the current financial year. Ensure you prepare these early to avoid last-minute application rush.
          </p>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search exams by name, short code (e.g. POLYCET, APRJC, NDA), conducting body, or target college..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Buttons / Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          {/* Stage Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              <span>Target Stage</span>
            </label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Stages (10th & 12th)</option>
              <option value="AFTER_10TH">After 10th Class ({post10thCount})</option>
              <option value="AFTER_12TH">After Intermediate / 12th ({post12thCount})</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-500" />
              <span>Field / Stream</span>
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Streams & Categories</option>
              <option value="DIPLOMA_POLYTECHNIC">Polytechnic & Diploma</option>
              <option value="RESIDENTIAL_INTER">Free Residential Junior Colleges</option>
              <option value="ENGINEERING">Engineering & Technology</option>
              <option value="MEDICAL">Medical, Dental & Ayush</option>
              <option value="DEFENSE">Defence & Armed Forces</option>
              <option value="GOVT_JOBS">Central Government Jobs</option>
              <option value="SCHOLARSHIP">Scholarship Schemes</option>
              <option value="LAW">Law (NLUs)</option>
            </select>
          </div>

          {/* Level Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Jurisdiction</span>
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Levels (State & National)</option>
              <option value="STATE">Telangana State Level</option>
              <option value="NATIONAL">National Level (India)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Application Status</span>
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="APPLICATIONS_OPEN">Applications Open Now ({openCount})</option>
              <option value="UPCOMING">Upcoming Announcements</option>
            </select>
          </div>

        </div>

      </div>

      {/* Grid of Exams */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Available Examinations</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {filteredExams.length} results
            </span>
          </h2>

          {(selectedStage !== 'ALL' || selectedCategory !== 'ALL' || selectedLevel !== 'ALL' || selectedStatus !== 'ALL' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedStage('ALL');
                setSelectedCategory('ALL');
                setSelectedLevel('ALL');
                setSelectedStatus('ALL');
                setSearchTerm('');
              }}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-72 animate-pulse" />
            ))}
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
            <Trophy className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No competitive exams found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No examinations match your current filter selections. Try clearing your search keyword or switching the category.
            </p>
            <button
              onClick={() => {
                setSelectedStage('ALL');
                setSelectedCategory('ALL');
                setSelectedLevel('ALL');
                setSelectedStatus('ALL');
                setSearchTerm('');
              }}
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition"
            >
              View All Exams
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map(exam => (
              <ExamCard key={exam.slug || exam.id} exam={exam} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
