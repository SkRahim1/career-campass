'use client';

import React, { useState, useEffect } from 'react';
import CollegeCard from '@/components/CollegeCard';
import AuthRequiredGate from '@/components/AuthRequiredGate';
import { Search, Filter, SlidersHorizontal, ArrowRightLeft, Sparkles, Building2, HelpCircle, X, Check } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const HYDERABAD_AREAS = [
  'Abids', 'Ameerpet', 'Alwal', 'Attapur', 'Amberpet', 'Asif Nagar',
  'Banjara Hills', 'Begumpet', 'Bahadurpura', 'Balanagar', 'Bowenpally', 'Bachupally',
  'Charminar', 'Chandrayangutta', 'Chanda Nagar',
  'Dilsukhnagar',
  'ECIL',
  'Falaknuma',
  'Gachibowli',
  'Habsiguda', 'Himayatnagar', 'Hitec City',
  'Jubilee Hills', 'Jeedimetla',
  'Koti', 'Kachiguda', 'Kukatpally', 'Kondapur', 'Kothapet', 'Khairatabad', 'Karwan',
  'L.B. Nagar', 'Langar Houz',
  'Madhapur', 'Mehdipatnam', 'Malakpet', 'Mallapur', 'Manikonda', 'Masab Tank', 'Marredpally',
  'Nampally', 'Nacharam', 'Nanakramguda', 'Nizampet', 'Narsingi',
  'Somajiguda', 'Saroornagar', 'Santoshnagar', 'Sainikpuri', 'Sanathnagar', 'Shaikpet', 'Safilguda',
  'Tarnaka', 'Tolichowki',
  'Uppal',
  'Vidyanagar', 'Yousufguda'
].sort();

export default function CollegesSearchPage() {
  const [allColleges, setAllColleges] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [area, setArea] = useState('ALL');
  const [ownership, setOwnership] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [stream, setStream] = useState('ALL');
  const [genderType, setGenderType] = useState('ALL');
  const [feeMax, setFeeMax] = useState('150000');
  
  // Mobile drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Facilities flags
  const [facilities, setFacilities] = useState({
    hostel: false,
    transport: false,
    library: false,
    labs: false,
    wifi: false,
    sports: false,
  });

  // Comparison State
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  // Fetch all colleges once on mount
  useEffect(() => {
    async function fetchAllColleges() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'colleges'));
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setAllColleges(list);
        setColleges(list);
      } catch (err) {
        console.error('Error fetching colleges from Firestore:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllColleges();
  }, []);

  // Filter colleges client-side when dependency changes
  useEffect(() => {
    if (allColleges.length === 0) return;
    
    let filtered = [...allColleges];

    // Search term
    if (search.trim() !== '') {
      const term = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(term) ||
        c.address.toLowerCase().includes(term) ||
        (c.nearbyLandmark && c.nearbyLandmark.toLowerCase().includes(term))
      );
    }

    // Area
    if (area !== 'ALL') {
      filtered = filtered.filter(c => c.address.toLowerCase().includes(area.toLowerCase()));
    }

    // Ownership
    if (ownership !== 'ALL') {
      filtered = filtered.filter(c => c.ownership === ownership);
    }

    // Category
    if (category !== 'ALL') {
      filtered = filtered.filter(c => c.category === category);
    }

    // Stream
    if (stream !== 'ALL') {
      filtered = filtered.filter(c => c.streams && c.streams.some(s => s.streamName === stream));
    }

    // GenderType
    if (genderType !== 'ALL') {
      filtered = filtered.filter(c => c.genderType === genderType);
    }

    // FeeMax
    if (feeMax) {
      const maxFee = parseInt(feeMax);
      filtered = filtered.filter(c => {
        if (!c.streams || c.streams.length === 0) return true;
        const minFee = Math.min(...c.streams.map(s => s.annualFee));
        return minFee <= maxFee;
      });
    }

    // Facilities
    Object.keys(facilities).forEach(key => {
      if (facilities[key]) {
        const dbKey = 'has' + key.charAt(0).toUpperCase() + key.slice(1);
        filtered = filtered.filter(c => !!c[dbKey]);
      }
    });

    setColleges(filtered);
  }, [allColleges, search, area, ownership, category, stream, genderType, feeMax, facilities]);

  const handleFacilityChange = (name) => {
    setFacilities(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleCompareSelect = (collegeId, e) => {
    e.stopPropagation();
    setSelectedForCompare(prev => {
      if (prev.includes(collegeId)) {
        return prev.filter(id => id !== collegeId);
      } else {
        if (prev.length >= 4) {
          alert('You can compare a maximum of 4 colleges.');
          return prev;
        }
        return [...prev, collegeId];
      }
    });
  };

  const clearFilters = () => {
    setSearch('');
    setArea('ALL');
    setOwnership('ALL');
    setCategory('ALL');
    setStream('ALL');
    setGenderType('ALL');
    setFeeMax('100000');
    setFacilities({
      hostel: false,
      transport: false,
      library: false,
      labs: false,
      wifi: false,
      sports: false,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (area !== 'ALL') count++;
    if (ownership !== 'ALL') count++;
    if (category !== 'ALL') count++;
    if (stream !== 'ALL') count++;
    if (genderType !== 'ALL') count++;
    if (feeMax !== '100000') count++;
    Object.values(facilities).forEach(val => {
      if (val) count++;
    });
    return count;
  };

  // Shared Filters Elements to avoid duplicates
  const renderFilterFields = () => (
    <div className="space-y-6 text-left">
      {/* Area */}
      <div className="space-y-2">
        <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider block">Area / Locality</label>
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
        >
          <option value="ALL">All Areas (50+ Locations)</option>
          {HYDERABAD_AREAS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider block">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
        >
          <option value="ALL">All Categories</option>
          <option value="JUNIOR_COLLEGE">Junior College (11th & 12th)</option>
          <option value="POLYTECHNIC">Polytechnic (Diploma)</option>
          <option value="ITI">ITI Trade Courses</option>
        </select>
      </div>

      {/* Stream */}
      <div className="space-y-2">
        <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider block">Stream / Course</label>
        <select
          value={stream}
          onChange={(e) => setStream(e.target.value)}
          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
        >
          <option value="ALL">All Streams</option>
          <option value="MPC">MPC (Maths, Physics, Chemistry)</option>
          <option value="BiPC">BiPC (Biology, Physics, Chemistry)</option>
          <option value="MEC">MEC (Maths, Economics, Commerce)</option>
          <option value="CEC">CEC (Civics, Economics, Commerce)</option>
          <option value="HEC">HEC (History, Economics, Civics)</option>
          <option value="Polytechnic">Polytechnic</option>
          <option value="ITI">ITI</option>
          <option value="Vocational">Vocational</option>
        </select>
      </div>

      {/* Ownership */}
      <div className="space-y-2">
        <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider block">Ownership</label>
        <select
          value={ownership}
          onChange={(e) => setOwnership(e.target.value)}
          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
        >
          <option value="ALL">All Ownerships</option>
          <option value="GOVERNMENT">Government Only</option>
          <option value="PRIVATE">Private Only</option>
          <option value="AIDED">Government-Aided</option>
        </select>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider block">Gender Demographics</label>
        <select
          value={genderType}
          onChange={(e) => setGenderType(e.target.value)}
          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
        >
          <option value="ALL">Co-Ed / Boys / Girls</option>
          <option value="CO_ED">Co-Education</option>
          <option value="BOYS">Boys Only</option>
          <option value="GIRLS">Girls Only</option>
        </select>
      </div>

      {/* Fee Range Slider */}
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
          <span>Max Fee Budget</span>
          <span className="text-indigo-650 dark:text-indigo-400 font-extrabold">₹{parseInt(feeMax).toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="1000"
          max="150000"
          step="5000"
          value={feeMax}
          onChange={(e) => setFeeMax(e.target.value)}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-650 dark:accent-indigo-500"
        />
        <div className="flex justify-between text-[8px] text-slate-400 dark:text-slate-500">
          <span>₹1,000</span>
          <span>₹1,50,000</span>
        </div>
      </div>

      {/* Facilities Checkbox Grid */}
      <div className="space-y-3 border-t border-slate-150 dark:border-slate-850 pt-4">
        <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider block">Campus Facilities</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(facilities).map((key) => {
            const isActive = facilities[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleFacilityChange(key)}
                className={`py-2 px-3 rounded-xl border text-[10px] font-bold text-center transition cursor-pointer flex items-center justify-between ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-305 dark:border-indigo-500/35 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-800'
                }`}
              >
                <span className="capitalize">{key}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-405 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <AuthRequiredGate
      featureName="Junior & Polytechnic Colleges Search"
      featureDescription="Sign in or register to search 54+ verified colleges, compare fee structures, and check campus facilities across Hyderabad."
      iconName="college"
      redirectPath="/colleges"
    >
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10 bg-radial-gradient flex-grow relative text-left">
      
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-8 h-8 text-indigo-650 dark:text-indigo-400" />
          <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 font-display">College Directory</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl font-normal">
          Search and filter junior colleges, polytechnics, and ITIs in Hyderabad. Pin items to the side-by-side comparison sheet.
        </p>
      </div>

      {/* Search Bar Block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-md">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by college name, landmark, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-10 pr-4 text-xs text-slate-705 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition shadow-inner"
          />
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
        </div>

        {/* Desktop Filter Reset */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          {getActiveFiltersCount() > 0 && (
            <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-150 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded shadow-xs">
              Active Filters: {getActiveFiltersCount()}
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-indigo-650 hover:text-indigo-700 dark:text-indigo-405 dark:hover:text-indigo-300 font-bold transition px-3 py-1 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filters Sidebar (Hidden on mobile) */}
        <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-6 lg:sticky lg:top-24 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-850 pb-4">
            <h2 className="text-slate-850 dark:text-slate-100 font-extrabold text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Filters</span>
            </h2>
          </div>
          {renderFilterFields()}
        </div>

        {/* Directory Grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          ) : colleges.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center space-y-2 max-w-lg mx-auto shadow-xs">
              <Sparkles className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 className="text-slate-700 dark:text-slate-350 font-bold text-lg">No colleges match your criteria</h3>
              <p className="text-xs text-slate-500">Try relaxing search parameters, adjusting budget limits, or clearing facilities.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college) => (
                <CollegeCard
                  key={college.id}
                  college={college}
                  showCompare={true}
                  isCompared={selectedForCompare.includes(college.id)}
                  onCompareToggle={(e) => handleCompareSelect(college.id, e)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Floating Filters Trigger Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition text-xs cursor-pointer"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-white text-indigo-600 w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-[10px]">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay & Sheet */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm">
          {/* Overlay click closer */}
          <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)} />
          
          {/* Sliding Sheet */}
          <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-6 w-full max-h-[80vh] overflow-y-auto relative z-10 space-y-6 shadow-2xl transition">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-850 pb-4">
              <h2 className="text-slate-850 dark:text-slate-100 font-extrabold text-sm flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Filters</span>
              </h2>
              <div className="flex gap-4 items-center">
                <button
                  onClick={clearFilters}
                  className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-xs text-white hover:text-white font-bold bg-indigo-600 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
            
            {/* Filter Fields Content */}
            {renderFilterFields()}
          </div>
        </div>
      )}

      {/* Floating Comparison Control Bar */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-indigo-500/50 shadow-xl shadow-indigo-500/5 rounded-full px-6 py-4 flex items-center justify-between gap-6 backdrop-blur-md max-w-md w-full animate-bounce-short">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-350">
              Comparing <span className="font-extrabold text-indigo-400">{selectedForCompare.length}</span>/4 colleges
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedForCompare([])}
              className="text-[10px] text-slate-400 hover:text-slate-200 font-bold px-2.5 py-1.5 cursor-pointer"
            >
              Clear
            </button>
            <Link
              href={`/compare?ids=${selectedForCompare.join(',')}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-md transition flex items-center gap-1 cursor-pointer"
            >
              <span>Compare Now</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}
      </div>
    </AuthRequiredGate>
  );
}
