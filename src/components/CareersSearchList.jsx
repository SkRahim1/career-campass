'use client';

import React, { useState } from 'react';
import CareerCard from './CareerCard';
import { Search, Compass, ShieldAlert, Sparkles } from 'lucide-react';

export default function CareersSearchList({ initialCareers }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Categories helper to segment the 51 careers
  const categories = [
    { id: 'ALL', label: 'All Careers' },
    { id: 'TECH', label: 'Tech & IT', keywords: ['software', 'developer', 'database', 'cloud', 'cyber', 'ai', 'game', 'ux'] },
    { id: 'ENG', label: 'Engineering', keywords: ['engineer', 'aerospace', 'chemical', 'electrical', 'civil', 'mechanical'] },
    { id: 'MED', label: 'Healthcare', keywords: ['doctor', 'nurse', 'pharmacist', 'veterinarian', 'dentist', 'physiotherapist', 'dietician', 'nutritionist', 'biotech'] },
    { id: 'COMM', label: 'Finance & Mgmt', keywords: ['accountant', 'analyst', 'banker', 'secretary', 'actuary', 'product', 'hr', 'manager', 'entrepreneurship'] },
    { id: 'ART', label: 'Arts & Media', keywords: ['designer', 'animation', 'photographer', 'editor', 'sound', 'journalist', 'writer', 'hotel'] },
    { id: 'GOVT', label: 'Govt & Services', keywords: ['ias', 'ips', 'teacher', 'pilot', 'navy', 'social'] }
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter logic
  const filteredCareers = initialCareers.filter(career => {
    const titleMatch = career.title.toLowerCase().includes(searchQuery.toLowerCase());
    const overviewMatch = career.overview.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Parse skills to match them
    let skillsMatch = false;
    try {
      const skills = typeof career.skillsRequired === 'string'
        ? JSON.parse(career.skillsRequired)
        : (career.skillsRequired || []);
      skillsMatch = skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    } catch (e) {
      // ignore
    }

    const matchesSearch = titleMatch || overviewMatch || skillsMatch;

    // Filter by Category
    if (activeCategory === 'ALL') {
      return matchesSearch;
    }

    const categoryObj = categories.find(c => c.id === activeCategory);
    const matchesCategory = categoryObj?.keywords.some(keyword => {
      const titleLower = career.title.toLowerCase();
      const slugLower = career.slug.toLowerCase();
      return titleLower.includes(keyword) || slugLower.includes(keyword);
    });

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* Search & Category Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-md">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-405 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, overview, or skills (e.g. Python)..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-slate-750 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
          />
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-indigo-650 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-850 dark:hover:text-slate-250'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-650 dark:text-indigo-405" />
          <span>Browse Careers ({filteredCareers.length})</span>
        </h2>
        
        {filteredCareers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-400 dark:text-slate-500 text-sm flex flex-col items-center justify-center space-y-3 shadow-xs">
            <ShieldAlert className="w-12 h-12 text-slate-400 dark:text-slate-700" />
            <p className="font-bold text-slate-700 dark:text-slate-400">No matching careers found</p>
            <p className="text-xs text-slate-500 dark:text-slate-600">Try adjusting your search criteria or changing filter chips.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((career) => (
              <CareerCard key={career.id} career={career} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
