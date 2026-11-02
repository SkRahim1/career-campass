'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import CollegeCard from '@/components/CollegeCard';
import { User, Settings, Sparkles, Save, GraduationCap, DollarSign, Home, Percent, Smartphone, Award, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, loading: authLoading, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    schoolName: '',
    percentage10th: 75,
    preferredStream: 'MPC',
    preferredLocation: '',
    budget: 45000,
    hostelRequired: false,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [recsLoading, setRecsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        mobileNumber: user.mobileNumber || '',
        schoolName: user.schoolName || '',
        percentage10th: user.percentage10th || 75,
        preferredStream: user.preferredStream || 'MPC',
        preferredLocation: user.preferredLocation || '',
        budget: user.budget || 45000,
        hostelRequired: user.hostelRequired || false,
      });
      fetchRecommendations();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const setStream = (streamName) => {
    setFormData(prev => ({ ...prev, preferredStream: streamName }));
  };

  const setHostel = (required) => {
    setFormData(prev => ({ ...prev, hostelRequired: required }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await updateProfile({
        ...formData,
        percentage10th: formData.percentage10th ? parseFloat(formData.percentage10th) : null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
      });
      setMessage('Profile preferences updated successfully!');
      fetchRecommendations();
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const fetchRecommendations = async () => {
    setRecsLoading(true);
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      const querySnapshot = await getDocs(collection(db, 'colleges'));
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      
      const matched = list.filter(college => {
        const offersStream = college.streams?.some(
          s => s.streamName.toUpperCase() === formData.preferredStream.toUpperCase()
        );
        if (!offersStream) return false;

        if (formData.budget) {
          const hasAffordableStream = college.streams?.some(
            s => s.streamName.toUpperCase() === formData.preferredStream.toUpperCase() && 
                 s.annualFee <= parseFloat(formData.budget)
          );
          if (!hasAffordableStream) return false;
        }

        if (formData.hostelRequired && !college.hasHostel) {
          return false;
        }

        return true;
      }).map(college => {
        let matchPercentage = 70;
        
        if (formData.preferredLocation && 
            (college.address.toLowerCase().includes(formData.preferredLocation.toLowerCase()) || 
             college.nearbyLandmark?.toLowerCase().includes(formData.preferredLocation.toLowerCase()))) {
          matchPercentage += 20;
        }

        if (college.averageRating >= 4.5) {
          matchPercentage += 10;
        }

        return {
          ...college,
          matchPercentage: Math.min(matchPercentage, 100)
        };
      }).sort((a, b) => b.matchPercentage - a.matchPercentage);

      setRecommendations(matched.slice(0, 3));
    } catch (err) {
      console.error('Error fetching recommendations from Firestore:', err);
    } finally {
      setRecsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-950 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-grow bg-slate-950 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] bg-radial-gradient bg-grid-pattern">
        <User className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-2xl font-bold text-slate-200">Sign in to view your profile</h2>
        <p className="text-slate-500 max-w-sm mt-2 mb-6">Create a profile to save colleges, compare options, and track recommendations.</p>
        <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition cursor-pointer">
          Sign In
        </Link>
      </div>
    );
  }

  const streams = [
    { id: 'MPC', label: 'MPC', type: 'Intermediate' },
    { id: 'BiPC', label: 'BiPC', type: 'Intermediate' },
    { id: 'MEC', label: 'MEC', type: 'Intermediate' },
    { id: 'CEC', label: 'CEC', type: 'Intermediate' },
    { id: 'HEC', label: 'HEC', type: 'Intermediate' },
    { id: 'Polytechnic', label: 'Polytechnic', type: 'Diploma' },
    { id: 'ITI', label: 'ITI', type: 'Trades' },
    { id: 'Vocational', label: 'Vocational', type: 'Courses' },
  ];

  return (
    <div className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12 bg-grid-pattern bg-radial-gradient flex-grow">
      
      {/* Title */}
      <div className="space-y-3 text-left">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-400" />
          <h1 className="text-3xl font-extrabold text-slate-100 font-display">Student Profile</h1>
        </div>
        <p className="text-slate-400 text-sm">
          Update your academic credentials and preferences to customize your college discovery feed.
        </p>
      </div>

      {/* Pending Survey Banner for New Students */}
      {user && !user.hasCompletedSurvey && (
        <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-pink-900/30 border border-purple-500/30 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg text-left">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] uppercase font-extrabold tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              Action Recommended
            </span>
            <h3 className="text-slate-100 font-extrabold text-base">
              Take the Class 10 Educational Guidance Survey
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Complete your 25-question student survey to unlock instant college suggestions, stream eligibility roadmaps, and scholarship updates tailored to your career goal.
            </p>
          </div>
          <Link
            href="/survey"
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-90 text-white font-extrabold px-6 py-3 rounded-2xl text-xs transition shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Start Survey (5–7 min)</span>
            <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Profile Form */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md text-left">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-6 border-b border-slate-850 pb-4">
            <Settings className="w-5 h-5 text-indigo-400" />
            <span>Profile Details & Preferences</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {message && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl p-3 text-xs">
                {message}
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-xs">
                {error}
              </div>
            )}

            {/* Section A: Contact Details */}
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>1. Personal Credentials</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1.5 relative">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 pl-10 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 text-xs transition"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-1.5 relative">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Mobile Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="mobileNumber"
                      required
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 pl-10 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 text-xs transition"
                    />
                    <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section B: Academic Parameters */}
            <div className="space-y-6 border-t border-slate-850 pt-6">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>2. Academic Background</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* School Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">10th School Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      placeholder="e.g. ZP High School, Uppal"
                      className="block w-full px-4 py-3 pl-10 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs transition"
                    />
                    <BookOpen className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* 10th Marks Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5 text-indigo-400" />
                      <span>10th Score</span>
                    </span>
                    <span className="text-indigo-400 font-extrabold text-xs">{formData.percentage10th}% / GPA</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="100"
                    step="0.5"
                    name="percentage10th"
                    value={formData.percentage10th}
                    onChange={handleChange}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500">
                    <span>35% (Pass)</span>
                    <span>100% (Perfect)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section C: Preferred Stream selection grid */}
            <div className="space-y-4 border-t border-slate-850 pt-6">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>3. Preferred Educational Path</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {streams.map((stream) => {
                  const isSelected = formData.preferredStream === stream.id;
                  return (
                    <button
                      key={stream.id}
                      type="button"
                      onClick={() => setStream(stream.id)}
                      className={`p-4 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 select-none ${
                        isSelected
                          ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-550/5'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-350'
                      }`}
                    >
                      <span className="font-extrabold text-sm block">{stream.id}</span>
                      <span className="text-[9px] uppercase tracking-wide opacity-60 block">{stream.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section D: Budget & Preferences */}
            <div className="space-y-6 border-t border-slate-850 pt-6">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                <span>4. Admission & Budget Preferences</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Budget Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    <span>Annual Fee Budget</span>
                    <span className="text-indigo-400 font-extrabold text-xs">₹{parseInt(formData.budget).toLocaleString()} / yr</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="150000"
                    step="2000"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[8px] text-slate-500">
                    <span>₹1,000</span>
                    <span>₹1,50,000</span>
                  </div>
                </div>

                {/* Preferred Location */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Preferred Location Area</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="preferredLocation"
                      value={formData.preferredLocation}
                      onChange={handleChange}
                      placeholder="e.g. Madhapur, Uppal, Secunderabad"
                      className="block w-full px-4 py-3 pl-10 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-650 focus:outline-none focus:border-indigo-500 text-xs transition"
                    />
                    <Home className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Hostel requirement toggle cards */}
              <div className="space-y-2.5">
                <label className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Hostel Accommodation</label>
                <div className="grid grid-cols-2 gap-3 max-w-xs">
                  <button
                    type="button"
                    onClick={() => setHostel(true)}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      formData.hostelRequired
                        ? 'bg-indigo-650/15 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <span>Required</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHostel(false)}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      !formData.hostelRequired
                        ? 'bg-indigo-650/15 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <span>Not Required</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 text-xs"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Recommendations Panel */}
        <div className="space-y-6 text-left">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <span>Personalized Matches</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Based on your preferred stream ({formData.preferredStream}), fee budget ({formData.budget ? `₹${parseFloat(formData.budget).toLocaleString()}` : 'No limit'}), and hostel requirement ({formData.hostelRequired ? 'Yes' : 'No'}), these are the best colleges in Hyderabad:
            </p>

            {recsLoading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs">
                No matching colleges found. Try increasing your fee budget or modifying filters.
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((college) => (
                  <div key={college.id} className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 hover:border-indigo-500/30 transition group flex flex-col justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                          {college.matchPercentage}% Match
                        </span>
                        <span className="text-[9px] font-semibold text-slate-500">
                          {college.ownership}
                        </span>
                      </div>
                      <h4 className="text-slate-100 font-bold text-sm leading-snug group-hover:text-indigo-400 transition">
                        <Link href={`/colleges/${college.id}`}>
                          {college.name}
                        </Link>
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2">
                        {college.address}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-slate-800/60 pt-2 text-[10px]">
                      <span className="font-bold text-slate-350">
                        ₹{college.streams.find(s => s.streamName.toUpperCase() === formData.preferredStream.toUpperCase())?.annualFee.toLocaleString('en-IN') || 'TBD'} / yr
                      </span>
                      <Link href={`/colleges/${college.id}`} className="text-indigo-400 hover:text-indigo-300 font-bold">
                        View Profile →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
