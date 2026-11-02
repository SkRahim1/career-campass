'use client';

import React, { useState, useEffect } from 'react';
import AdmissionCard from '@/components/AdmissionCard';
import { Bell, Flame, Filter, Calendar } from 'lucide-react';

export default function AdmissionUpdatesPage() {
  const [updates, setUpdates] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, [category]);

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const { collection, getDocs, query, where } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      let q = collection(db, 'admission-updates');
      if (category !== 'ALL') {
        q = query(q, where('category', '==', category));
      }
      
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort pinned to top, then by date descending
      list.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.publishedDate) - new Date(a.publishedDate);
      });
      
      setUpdates(list);
    } catch (err) {
      console.error('Error fetching updates from Firestore:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'ALL', label: 'All Updates' },
    { key: 'INTERMEDIATE', label: 'Intermediate' },
    { key: 'POLYTECHNIC', label: 'Polytechnic' },
    { key: 'ITI', label: 'ITI Trades' },
    { key: 'SCHOLARSHIP', label: 'Scholarships' }
  ];

  return (
    <div className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10 bg-grid-pattern bg-radial-gradient flex-grow">
      
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-8 h-8 text-pink-400 animate-bounce" />
          <h1 className="text-3xl font-extrabold text-slate-100">Admission Updates</h1>
        </div>
        <p className="text-slate-400 text-sm max-w-xl">
          Stay informed about registration dates, counselling sessions, document verification schedules, and circulars in Hyderabad.
        </p>
      </div>

      {/* Ticker for the most important news */}
      {updates.some(u => u.isPinned) && (
        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-5 flex items-start gap-3.5 shadow-md">
          <Flame className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-left">
            <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-extrabold uppercase">Pinned Alert</span>
            <p className="text-slate-200 text-sm font-bold mt-1">
              {updates.find(u => u.isPinned)?.title}
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              {updates.find(u => u.isPinned)?.content}
            </p>
          </div>
        </div>
      )}

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
              category === cat.key
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/10'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Feed listing */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      ) : updates.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-sm">
          No updates found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {updates.map((update) => (
            <div key={update.id}>
              <AdmissionCard update={update} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
