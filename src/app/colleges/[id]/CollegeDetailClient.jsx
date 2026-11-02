'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MapComponent from '@/components/MapComponent';
import { Star, MapPin, Phone, Mail, Globe, Landmark, GraduationCap, ClipboardCheck, Dumbbell, ShieldAlert, Sparkles, Send } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

export default function CollegeDetailClient({ id }) {
  const { user } = useAuth();
  const router = useRouter();
  
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Review Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchCollegeDetails();
  }, [id]);

  const fetchCollegeDetails = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'colleges', String(id));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collegeData = docSnap.data();
        
        // Fetch approved reviews from firestore
        const q = query(
          collection(db, 'reviews'),
          where('collegeId', '==', parseInt(id)),
          where('isApproved', '==', true)
        );
        const reviewsSnap = await getDocs(q);
        const collegeReviews = [];
        reviewsSnap.forEach((d) => {
          const r = d.data();
          collegeReviews.push({
            id: d.id,
            ...r,
            user: { name: r.userName || 'Anonymous Student' }
          });
        });
        
        setCollege({
          id: docSnap.id,
          ...collegeData,
          reviews: collegeReviews,
          totalReviews: collegeReviews.length
        });
      } else {
        console.error('College not found in Firestore');
      }
    } catch (err) {
      console.error('Error fetching college details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText) {
      setReviewError('Please write your review comment');
      return;
    }

    setReviewError('');
    setReviewMessage('');
    setSubmittingReview(true);

    try {
      const newReview = {
        collegeId: parseInt(id),
        userId: user.uid,
        userName: user.name || 'Anonymous Student',
        rating: rating,
        reviewText: reviewText,
        isApproved: false, // Requires admin moderation
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'reviews'), newReview);
      setReviewMessage('Your review has been submitted successfully and is pending administrator approval.');
      setReviewText('');
      setRating(5);
    } catch (err) {
      console.error(err);
      setReviewError(err.message || 'An error occurred submitting the review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-950 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="flex-grow bg-slate-950 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <ShieldAlert className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-2xl font-bold text-slate-200">College not found</h2>
        <p className="text-slate-500 max-w-sm mt-2 mb-6">The requested college ID does not exist in our directory databases.</p>
        <Link href="/colleges" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition">
          Back to Directory
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'streams', label: 'Streams & Fees' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'location', label: 'Location' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'reviews', label: `Reviews (${college.totalReviews || 0})` },
  ];

  const jsonLd = college ? {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": college.name,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": college.address,
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    },
    "description": college.description,
    "telephone": college.phone || undefined,
    "url": college.website || undefined
  } : null;

  return (
    <div className="bg-slate-950 bg-grid-pattern bg-radial-gradient flex-grow">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      {/* College Banner Cover */}
      <div className="relative h-64 sm:h-96 w-full bg-slate-950 overflow-hidden">
        {college.coverImageUrl ? (
          <img
            src={college.coverImageUrl}
            alt={college.name}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      </div>

      {/* College Header Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-10 space-y-8 pb-20">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row gap-6 items-start md:items-center">
          
          {/* Logo */}
          <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center p-2 shadow-inner overflow-hidden">
            {college.logoUrl ? (
              <img src={college.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Landmark className="w-12 h-12 text-indigo-400" />
            )}
          </div>

          {/* Core Info */}
          <div className="space-y-3 flex-grow">
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[9px] font-extrabold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                {college.ownership}
              </span>
              <span className="text-[9px] font-extrabold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-full">
                {college.category.replace('_', ' ')}
              </span>
              {college.establishedYear && (
                <span className="text-[9px] font-extrabold uppercase bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">
                  Estd {college.establishedYear}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display leading-tight">{college.name}</h1>
            
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{college.address}</span>
              </p>
              <div className="flex items-center gap-1">
                <div className="flex items-center text-yellow-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold ml-1">{college.averageRating || '4.0'}</span>
                </div>
                <span className="text-slate-500">({college.totalReviews || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-900 pb-2 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab contents panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md min-h-[300px]">
          
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8 text-left">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-100">About the College</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{college.description}</p>
              </div>

              <div className="border-t border-slate-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Columns */}
                <div className="space-y-4">
                  <h3 className="text-slate-100 font-bold text-sm">Contact & Location Links</h3>
                  <div className="space-y-2 text-xs text-slate-300">
                    {college.phone && (
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-indigo-400" /> {college.phone}</p>
                    )}
                    {college.email && (
                      <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-400" /> {college.email}</p>
                    )}
                    {college.website && (
                      <a href={college.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-indigo-400 hover:underline">
                        <Globe className="w-4 h-4" /> {college.website.replace('http://', '').replace('https://', '')}
                      </a>
                    )}
                    {college.address && college.name && (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${college.name.split(',')[0]}, ${college.address}`)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 hover:underline transition font-semibold"
                      >
                        <MapPin className="w-4 h-4 text-emerald-400" /> View on Google Maps (Directions)
                      </a>
                    )}
                  </div>
                </div>

                {/* Admission Info summary */}
                <div className="space-y-4">
                  <h3 className="text-slate-100 font-bold text-sm">General Parameters</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <p><span className="font-semibold text-slate-500">Gender Demographics:</span> {college.genderType === 'CO_ED' ? 'Co-Educational' : college.genderType}</p>
                    <p><span className="font-semibold text-slate-500">Hostel Facility:</span> {college.hasHostel ? 'Available' : 'Not Available'}</p>
                    <p><span className="font-semibold text-slate-500">Bus Transport:</span> {college.hasTransport ? 'Available' : 'Not Available'}</p>
                    <p><span className="font-semibold text-slate-500">Wi-Fi:</span> {college.hasWifi ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Streams & Fees */}
          {activeTab === 'streams' && (
            <div className="space-y-6 text-left">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <span>Offered Streams & Annual Fees</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {college.streams?.map((s, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-slate-100 font-bold text-base">{s.streamName}</h4>
                      <span className="text-sm font-extrabold text-indigo-400">₹{s.annualFee.toLocaleString('en-IN')} / yr</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 border-t border-slate-800/60 pt-2">
                      <p><span className="font-semibold text-slate-500">Min Qualification:</span> {s.minQualification}</p>
                      <p><span className="font-semibold text-slate-500">Required Marks:</span> {s.requiredMarks}</p>
                      <p><span className="font-semibold text-slate-500">Admission Mode:</span> {s.admissionType.replace('_', ' ')}</p>
                    </div>
                    {s.reservationInfo && (
                      <p className="text-[10px] text-slate-500 leading-normal border-t border-slate-800/60 pt-2 italic">
                        <span className="font-semibold not-italic">Quota/Rules:</span> {s.reservationInfo}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Admission Process */}
          {activeTab === 'admissions' && (
            <div className="space-y-8 text-left max-w-3xl">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-indigo-400" />
                <span>Step-by-Step Admission Process</span>
              </h3>

              <div className="space-y-6 relative border-l border-slate-800 pl-6 ml-3">
                {/* Step 1 */}
                <div className="relative">
                  <span className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-indigo-600 border border-slate-900 text-xs font-bold flex items-center justify-center text-white">1</span>
                  <h4 className="font-bold text-slate-200 text-sm">Check Eligibility criteria</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Ensure you satisfy the qualification requirements, TS POLYCET eligibility rules, or minimum mark caps for your preferred stream.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <span className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-indigo-600 border border-slate-900 text-xs font-bold flex items-center justify-center text-white">2</span>
                  <h4 className="font-bold text-slate-200 text-sm">Prepare Required Documents</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Gather Class 10 memo sheets, Meeseva caste/income certificates, school bonafides (Class 6-10), and Transfer Certificates (TC).
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <span className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-indigo-600 border border-slate-900 text-xs font-bold flex items-center justify-center text-white">3</span>
                  <h4 className="font-bold text-slate-200 text-sm">Application submission</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Apply directly at the college administrative block (for private direct admissions) or submit counselling web choices on state portals (like TS POLYCET or board portals).
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <span className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-indigo-600 border border-slate-900 text-xs font-bold flex items-center justify-center text-white">4</span>
                  <h4 className="font-bold text-slate-200 text-sm">Admission Confirmation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Once allotted or approved, undergo certificate validation at the center and pay nominal admission charges to lock your seat.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Facilities */}
          {activeTab === 'facilities' && (
            <div className="space-y-6 text-left">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-indigo-400" />
                <span>Campus Infrastructure & Facilities</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                {[
                  { key: 'hasHostel', label: 'Hostel facility' },
                  { key: 'hasTransport', label: 'Transport Bus' },
                  { key: 'hasLibrary', label: 'Central Library' },
                  { key: 'hasLabs', label: 'Scientific Laboratories' },
                  { key: 'hasSports', label: 'Sports Equipment' },
                  { key: 'hasPlayground', label: 'Playground Field' },
                  { key: 'hasWifi', label: 'Campus Wi-Fi' },
                  { key: 'hasSmartClassroom', label: 'Smart Classrooms' },
                  { key: 'hasCctv', label: 'CCTV Security' },
                  { key: 'hasComputerLabs', label: 'Computer Labs' },
                  { key: 'hasCafeteria', label: 'Cafeteria Canteen' },
                ].map((fac, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex items-center justify-between font-semibold ${
                      college[fac.key]
                        ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-300'
                        : 'bg-slate-950/40 border-slate-900/60 text-slate-500'
                    }`}
                  >
                    <span>{fac.label}</span>
                    <span>{college[fac.key] ? '✓' : '✗'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Location */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              <MapComponent
                address={college.address}
                name={college.name}
                landmark={college.nearbyLandmark}
              />
            </div>
          )}

          {/* Tab 6: Gallery */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 text-left">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>College Photo Gallery</span>
              </h3>

              {college.gallery?.length === 0 ? (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
                  No images uploaded.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {college.gallery?.map((img, idx) => (
                    <div key={idx} className="relative h-48 rounded-xl overflow-hidden border border-slate-800 group shadow-sm bg-slate-950">
                      <img
                        src={img}
                        alt={`${college.name} view`}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 7: Reviews */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left items-start">
              
              {/* Left Side: Reviews list */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-lg font-bold text-slate-100">Student Reviews</h3>
                
                {college.reviews?.length === 0 ? (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
                    No reviews published yet for this college. Be the first to write a review!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {college.reviews?.map((r, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-inner">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
                            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-medium text-[10px]">Student</span>
                            <span>{r.user?.name || 'Anonymous User'}</span>
                          </div>
                          
                          {/* Stars */}
                          <div className="flex items-center text-yellow-400">
                            {[...Array(5)].map((_, starIdx) => (
                              <Star
                                key={starIdx}
                                className={`w-3.5 h-3.5 ${
                                  starIdx < r.rating ? 'fill-current' : 'text-slate-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-normal">{r.reviewText}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Write Review Form */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-md hover:border-indigo-500/10 transition w-full">
                <h3 className="text-sm font-extrabold text-slate-100 flex items-center gap-1.5 border-b border-slate-850 pb-3">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span>Write a Campus Review</span>
                </h3>
                
                {user ? (
                  user.role === 'SUPER_ADMIN' ? (
                    <p className="text-xs text-slate-500">Administrator accounts cannot submit reviews.</p>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-5">
                      {reviewMessage && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl p-3 text-xs">
                          {reviewMessage}
                        </div>
                      )}
                      {reviewError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-xs">
                          {reviewError}
                        </div>
                      )}

                      {/* Rating select stars with hover triggers */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Your Rating</label>
                        <div className="flex gap-2 text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled = star <= (hoverRating || rating);
                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="focus:outline-none cursor-pointer hover:scale-125 transition-transform duration-150"
                              >
                                <Star className={`w-7 h-7 ${isFilled ? 'fill-current' : 'text-slate-800'}`} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Review text */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          <label>Your Feedback Comment</label>
                          <span className={reviewText.length > 500 ? 'text-red-500 font-bold' : ''}>{reviewText.length}/500</span>
                        </div>
                        <textarea
                          rows="4"
                          maxLength="500"
                          placeholder="Tell prospective students what you liked or disliked about this college (e.g. teaching, hostels, placements)..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="block w-full px-3.5 py-3 bg-slate-950 border border-slate-850 rounded-2xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs transition leading-relaxed"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                      </button>
                      
                      <p className="text-[9px] text-slate-500 italic leading-snug">
                        * In compliance with anti-spam rules, your review will go live after administrator validation.
                      </p>
                    </form>
                  )
                ) : (
                  <div className="space-y-3 text-center py-4">
                    <p className="text-xs text-slate-400">Please sign in to submit a review and rating.</p>
                    <Link href="/login" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                      Log In
                    </Link>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
