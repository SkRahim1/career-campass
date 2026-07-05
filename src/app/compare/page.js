'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRightLeft, Star, MapPin, X, Plus, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function ComparePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsParam = searchParams.get('ids') || '';
  
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (idsParam) {
      fetchColleges();
    } else {
      setColleges([]);
      setLoading(false);
    }
  }, [idsParam]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const ids = idsParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id));
      if (ids.length === 0) {
        setColleges([]);
        return;
      }

      // Fetch all colleges and filter locally by IDs (for clean architecture)
      const res = await fetch('/api/colleges');
      if (res.ok) {
        const data = await res.json();
        const list = data.colleges || [];
        const filtered = list.filter(c => ids.includes(c.id));
        setColleges(filtered);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id) => {
    const ids = idsParam.split(',').filter(item => item !== String(id));
    if (ids.length === 0) {
      router.push('/colleges');
    } else {
      router.push(`/compare?ids=${ids.join(',')}`);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-950 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (colleges.length === 0) {
    return (
      <div className="flex-grow bg-slate-950 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] bg-grid-pattern bg-radial-gradient">
        <ArrowRightLeft className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-2xl font-bold text-slate-200">No colleges chosen for comparison</h2>
        <p className="text-slate-500 max-w-sm mt-2 mb-6">Select up to 4 colleges from the search directory using the Compare check-boxes.</p>
        <Link href="/colleges" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition">
          Go to Directory
        </Link>
      </div>
    );
  }

  const facilityFields = [
    { key: 'hasHostel', label: 'Hostel' },
    { key: 'hasTransport', label: 'Transport Bus' },
    { key: 'hasLibrary', label: 'Library' },
    { key: 'hasLabs', label: 'Laboratories' },
    { key: 'hasSports', label: 'Sports Complex' },
    { key: 'hasWifi', label: 'Campus Wi-Fi' },
    { key: 'hasSmartClassroom', label: 'Smart Classrooms' },
    { key: 'hasComputerLabs', label: 'Computer Labs' },
  ];

  return (
    <div className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10 bg-radial-gradient bg-grid-pattern flex-grow">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-indigo-400" />
            <h1 className="text-3xl font-extrabold text-slate-100">Compare Colleges</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Inspect pricing, credentials, facilities, and ratings side-by-side.
          </p>
        </div>
        <Link href="/colleges" className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1">
          <Plus className="w-4 h-4" />
          <span>Add More Colleges</span>
        </Link>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        <table className="w-full text-left border-collapse text-xs">
          
          {/* Header Row */}
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900">
              <th className="p-6 text-slate-400 font-bold uppercase tracking-wider w-1/5 min-w-[150px]">Features</th>
              {colleges.map((college) => (
                <th key={college.id} className="p-6 relative min-w-[200px] align-top">
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(college.id)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-2 mt-2">
                    <span className="text-[9px] font-extrabold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                      {college.ownership}
                    </span>
                    <h3 className="text-slate-100 font-bold text-sm leading-snug">
                      <Link href={`/colleges/${college.id}`} className="hover:text-indigo-400 transition">
                        {college.name}
                      </Link>
                    </h3>
                    <p className="text-[10px] text-slate-400">{college.category.replace('_', ' ')}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body Rows */}
          <tbody className="divide-y divide-slate-800/60">
            
            {/* 1. Rating */}
            <tr>
              <td className="p-6 font-bold text-slate-400 bg-slate-900/20">Student Rating</td>
              {colleges.map((college) => (
                <td key={college.id} className="p-6">
                  <div className="flex items-center text-yellow-400 font-bold gap-1 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{college.averageRating || '4.0'}</span>
                    <span className="text-slate-500 text-xs font-normal">({college.totalReviews || 0} reviews)</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* 2. Established Year */}
            <tr>
              <td className="p-6 font-bold text-slate-400 bg-slate-900/20">Established</td>
              {colleges.map((college) => (
                <td key={college.id} className="p-6 text-slate-300 font-semibold">
                  {college.establishedYear || 'N/A'}
                </td>
              ))}
            </tr>

            {/* 3. Fee structure */}
            <tr>
              <td className="p-6 font-bold text-slate-400 bg-slate-900/20">Fee Range (Annual)</td>
              {colleges.map((college) => {
                const fees = college.streams?.map(s => s.annualFee) || [];
                const formatted = fees.length > 0
                  ? `₹${Math.min(...fees).toLocaleString()} - ₹${Math.max(...fees).toLocaleString()}`
                  : 'N/A';
                return (
                  <td key={college.id} className="p-6 text-slate-200 font-bold text-sm">
                    {formatted}
                  </td>
                );
              })}
            </tr>

            {/* 4. Streams Offered */}
            <tr>
              <td className="p-6 font-bold text-slate-400 bg-slate-900/20">Streams Offered</td>
              {colleges.map((college) => (
                <td key={college.id} className="p-6">
                  <div className="flex flex-wrap gap-1">
                    {college.streams?.map((s, idx) => (
                      <span key={idx} className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded font-medium text-[10px]">
                        {s.streamName}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* 5. Location area */}
            <tr>
              <td className="p-6 font-bold text-slate-400 bg-slate-900/20">Address / Area</td>
              {colleges.map((college) => (
                <td key={college.id} className="p-6 text-slate-400 leading-normal">
                  <div className="flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span>{college.address}</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Facilities comparison rows */}
            {facilityFields.map((f) => (
              <tr key={f.key}>
                <td className="p-6 font-bold text-slate-400 bg-slate-900/20">{f.label}</td>
                {colleges.map((college) => (
                  <td key={college.id} className="p-6 text-slate-300 font-bold">
                    {college[f.key] ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span>✓</span> <span className="font-normal text-xs text-slate-300">Yes</span>
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <span>✗</span> <span className="font-normal text-xs text-slate-500">No</span>
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}

          </tbody>
        </table>
      </div>

    </div>
  );
}

export default function ComparePage() {
  return (
    <React.Suspense fallback={
      <div className="flex-grow flex items-center justify-center bg-slate-950 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <ComparePageContent />
    </React.Suspense>
  );
}
