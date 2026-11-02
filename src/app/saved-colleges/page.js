'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import CollegeCard from '@/components/CollegeCard';
import AuthRequiredGate from '@/components/AuthRequiredGate';
import { Bookmark, Sparkles, Heart } from 'lucide-react';
import Link from 'next/link';

export default function SavedCollegesPage() {
  const { user, loading: authLoading } = useAuth();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'SUPER_ADMIN') {
      fetchSavedColleges();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSavedColleges = async () => {
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      // 1. Get user profile doc to see bookmark IDs
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const bookmarkIds = userDocSnap.exists() ? (userDocSnap.data().savedColleges || []) : [];

      if (bookmarkIds.length === 0) {
        setColleges([]);
        setLoading(false);
        return;
      }

      // 2. Fetch details for each bookmarked college ID
      const list = [];
      for (const id of bookmarkIds) {
        const collegeDocSnap = await getDoc(doc(db, 'colleges', String(id)));
        if (collegeDocSnap.exists()) {
          list.push({ id: collegeDocSnap.id, ...collegeDocSnap.data() });
        }
      }
      setColleges(list);
    } catch (err) {
      console.error('Error fetching bookmarked colleges:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkToggle = (collegeId, isBookmarked) => {
    if (!isBookmarked) {
      // Remove from state immediately on un-bookmarking
      setColleges(prev => prev.filter(c => String(c.id) !== String(collegeId)));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-950 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthRequiredGate
        featureName="Saved Colleges & Bookmarks"
        featureDescription="Sign in or register to bookmark colleges, track fee structures, and compare options later."
        iconName="bookmark"
        redirectPath="/saved-colleges"
      >
        <div />
      </AuthRequiredGate>
    );
  }

  if (user.role === 'SUPER_ADMIN') {
    return (
      <div className="flex-grow bg-slate-950 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <Heart className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-2xl font-bold text-slate-200">Admin Account</h2>
        <p className="text-slate-500 max-w-sm mt-2 mb-6">Bookmarking colleges is only available for student accounts.</p>
        <Link href="/admin" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer">
          Go to Admin Panel
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-yellow-500" />
          <h1 className="text-3xl font-extrabold text-slate-100">Saved Colleges</h1>
        </div>
        <p className="text-slate-400 text-sm">Review your bookmarked junior colleges, polytechnics, and ITIs in Hyderabad.</p>
      </div>

      {colleges.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-md">
          <Sparkles className="w-10 h-10 text-indigo-400 mx-auto" />
          <h2 className="text-lg font-bold text-slate-200">No saved colleges yet</h2>
          <p className="text-slate-500 text-xs">Browse the college directory and tap the heart icon to save colleges for future reference.</p>
          <Link href="/colleges" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer">
            Explore Colleges
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <div key={college.id}>
              <CollegeCard 
                college={college} 
                isBookmarkedInitial={true} 
                onBookmarkToggle={handleBookmarkToggle} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
