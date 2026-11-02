'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Star, MapPin, Bookmark, Heart, Sparkles } from 'lucide-react';

export default function CollegeCard({ 
  college, 
  onBookmarkToggle, 
  isBookmarkedInitial = false,
  showCompare = false,
  isCompared = false,
  onCompareToggle
}) {
  const { user, updateProfile } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Sync bookmark state with user profile
  React.useEffect(() => {
    if (user && user.savedColleges) {
      setIsBookmarked(user.savedColleges.some(id => String(id) === String(college.id)));
    } else {
      setIsBookmarked(isBookmarkedInitial);
    }
  }, [user, college.id, isBookmarkedInitial]);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to save colleges');
      return;
    }
    setLoading(true);
    try {
      const { doc, updateDoc, arrayUnion, arrayRemove } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      const userDocRef = doc(db, 'users', user.uid);
      const collegeIntId = parseInt(college.id);
      
      if (isBookmarked) {
        // Remove from Firestore
        await updateDoc(userDocRef, {
          savedColleges: arrayRemove(collegeIntId)
        });
        
        // Update local auth context user state
        const updatedSaved = (user.savedColleges || []).filter(id => id !== collegeIntId);
        await updateProfile({ savedColleges: updatedSaved });
        
        setIsBookmarked(false);
        if (onBookmarkToggle) onBookmarkToggle(college.id, false);
      } else {
        // Add to Firestore
        await updateDoc(userDocRef, {
          savedColleges: arrayUnion(collegeIntId)
        });
        
        // Update local auth context user state
        const updatedSaved = [...(user.savedColleges || []), collegeIntId];
        await updateProfile({ savedColleges: updatedSaved });
        
        setIsBookmarked(true);
        if (onBookmarkToggle) onBookmarkToggle(college.id, true);
      }
    } catch (err) {
      console.error('Error toggling bookmark in Firestore:', err);
    } finally {
      setLoading(false);
    }
  };

  const formattedFee = college.streams && college.streams.length > 0
    ? `₹${Math.min(...college.streams.map(s => s.annualFee)).toLocaleString('en-IN')} - ₹${Math.max(...college.streams.map(s => s.annualFee)).toLocaleString('en-IN')}`
    : 'Fee on inquiry';

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 shadow-md hover:shadow-indigo-500/5 transition duration-305 flex flex-col h-full animate-fade-in">
      {/* Banner / Cover */}
      <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
        {college.coverImageUrl && !imageError ? (
          <img
            src={college.coverImageUrl}
            alt={college.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 dark:opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-650/10 to-purple-650/15 dark:from-indigo-950/60 dark:to-slate-900 flex items-center justify-center border-b border-slate-150 dark:border-slate-850">
            <Sparkles className="w-8 h-8 text-indigo-400 dark:text-indigo-700 animate-pulse" />
          </div>
        )}
        
        {/* Badges on cover */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/90 dark:bg-slate-950/80 text-indigo-650 dark:text-indigo-300 backdrop-blur-md px-2.5 py-1 rounded-full border border-indigo-150 dark:border-indigo-500/20 shadow-sm">
            {college.ownership}
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/90 dark:bg-slate-950/80 text-purple-650 dark:text-purple-300 backdrop-blur-md px-2.5 py-1 rounded-full border border-purple-150 dark:border-purple-500/20 shadow-sm">
            {college.category.replace('_', ' ')}
          </span>
        </div>
 
        {/* Compare Trigger */}
        {showCompare && (
          <button
            type="button"
            onClick={onCompareToggle}
            className={`absolute top-3 z-10 flex items-center gap-1.5 backdrop-blur-md border px-2.5 py-1.5 rounded-xl transition cursor-pointer text-[10px] font-bold ${
              user?.role !== 'SUPER_ADMIN' ? 'right-14' : 'right-3'
            } ${
              isCompared
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                : 'bg-white/80 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <input
              type="checkbox"
              checked={isCompared}
              readOnly
              className="w-3.5 h-3.5 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 rounded text-indigo-600 focus:ring-0 cursor-pointer pointer-events-none"
            />
            <span>Compare</span>
          </button>
        )}
 
        {/* Bookmark Trigger */}
        {user?.role !== 'SUPER_ADMIN' && (
          <button
            onClick={handleBookmark}
            disabled={loading}
            className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md bg-white/80 hover:bg-slate-100 dark:bg-slate-950/60 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-red-500 border border-slate-200 dark:border-slate-800/40 transition cursor-pointer shadow-sm"
          >
            <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}
      </div>
 
      {/* Profile Details */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="space-y-2">
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center text-yellow-500 dark:text-yellow-450">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold ml-1">{college.averageRating || '4.0'}</span>
            </div>
            <span className="text-slate-400 dark:text-slate-500">({college.totalReviews || 0} reviews)</span>
          </div>
 
          {/* Title */}
          <h3 className="text-slate-800 dark:text-slate-100 font-bold text-base leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
            <Link href={`/colleges/${college.id}`}>
              {college.name}
            </Link>
          </h3>
 
          {/* Location */}
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">{college.address}</span>
          </p>
 
          {/* Streams */}
          <div className="flex flex-wrap gap-1 pt-1.5">
            {college.streams?.map((s, idx) => (
              <span key={idx} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-655 dark:text-slate-300 border border-slate-150 dark:border-transparent px-2 py-0.5 rounded-md font-medium">
                {s.streamName}
              </span>
            ))}
          </div>
        </div>
 
        {/* Footer */}
        <div className="border-t border-slate-150 dark:border-slate-800/60 mt-4 pt-3 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide block">Annual Fee</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{formattedFee}</span>
          </div>
          
          <Link
            href={`/colleges/${college.id}`}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
          >
            <span>Details</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
