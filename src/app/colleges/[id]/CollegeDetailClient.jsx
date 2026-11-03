'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MapComponent from '@/components/MapComponent';
import AuthRequiredGate from '@/components/AuthRequiredGate';
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Landmark,
  GraduationCap,
  ClipboardCheck,
  Dumbbell,
  ShieldAlert,
  Sparkles,
  Send,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Award,
  Building2,
  Clock,
  Check
} from 'lucide-react';
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

  const isVerified = college.status === 'APPROVED' || college.isApproved || college.verified;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'streams', label: 'Streams & Fees' },
    { id: 'admissions', label: 'Admissions & Dates' },
    { id: 'scholarships', label: 'Scholarships & Concessions' },
    { id: 'facilities', label: 'Campus Facilities' },
    { id: 'documents', label: 'Prospectus & Docs' },
    { id: 'location', label: 'Location' },
    { id: 'gallery', label: 'Campus Gallery' },
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
    <AuthRequiredGate
      featureName={`${college.name} Details`}
      featureDescription="Sign in or register to view full fee structures, admission cutoffs, campus facilities, and student reviews."
      iconName="landmark"
      redirectPath={`/colleges/${id}`}
    >
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
        {(!college.isApproved || college.isLive === false || college.status === 'PENDING' || college.status === 'DRAFT') && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 shrink-0 text-amber-400" />
              <div>
                <p className="font-bold">Administrative Preview Mode</p>
                <p className="text-[11px] text-amber-400/80">This institution profile is currently {college.isLive === false ? 'UNPUBLISHED (Offline)' : 'PENDING APPROVAL'}. It is not publicly visible to students in the directory until approved and made live.</p>
              </div>
            </div>
            {user?.role === 'SUPER_ADMIN' && (
              <Link href="/admin" className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition shrink-0">
                Manage in Admin →
              </Link>
            )}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-grow">
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
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[9px] font-extrabold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                  {college.ownership}
                </span>
                <span className="text-[9px] font-extrabold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-full">
                  {college.category?.replace('_', ' ')}
                </span>
                {college.establishedYear && (
                  <span className="text-[9px] font-extrabold uppercase bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">
                    Estd {college.establishedYear}
                  </span>
                )}
                {isVerified && (
                  <span className="text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified Institution</span>
                  </span>
                )}
                {college.affiliation && (
                  <span className="text-[9px] font-extrabold uppercase bg-slate-800 text-indigo-300 border border-slate-700 px-2.5 py-1 rounded-full">
                    {college.affiliation}
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

          {/* Action CTAs: Direct WhatsApp & Apply Online */}
          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 self-stretch md:self-center">
            {(college.whatsappNumber || college.phone) && (
              <a
                href={`https://wa.me/${(college.whatsappNumber || college.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I found ${college.name} on Career Compass 365. I am interested in admission details and streams offered.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Admissions Desk</span>
              </a>
            )}

            {college.admissions?.applicationLink && (
              <a
                href={college.admissions.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Apply for Admission</span>
              </a>
            )}
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
              {/* About description */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-100">About the College</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{college.description}</p>
              </div>

              {/* Principal Message card if available */}
              {(college.principalName || college.principalMessage) && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4" />
                    <span>Leadership & Authorised Representative</span>
                  </div>
                  <h4 className="text-slate-100 font-bold text-sm">
                    {college.principalName || 'Principal'} <span className="text-slate-400 font-normal">({college.principalDesignation || 'Authorised Representative'})</span>
                  </h4>
                  {college.principalMessage && (
                    <p className="text-xs text-slate-300 italic border-l-2 border-indigo-500 pl-3 py-1">
                      "{college.principalMessage}"
                    </p>
                  )}
                </div>
              )}

              <div className="border-t border-slate-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Columns */}
                <div className="space-y-4">
                  <h3 className="text-slate-100 font-bold text-sm">Contact & Location Links</h3>
                  <div className="space-y-2.5 text-xs text-slate-300">
                    {college.phone && (
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-indigo-400" /> {college.phone}</p>
                    )}
                    {college.whatsappNumber && (
                      <p className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-emerald-400" /> WhatsApp: {college.whatsappNumber}</p>
                    )}
                    {college.email && (
                      <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-indigo-400" /> {college.email}</p>
                    )}
                    {college.officeTimings && (
                      <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-400" /> Office Hours: {college.officeTimings}</p>
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
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                    <p><span className="font-semibold text-slate-500">Gender Demographics:</span> {college.genderType === 'CO_ED' ? 'Co-Educational' : college.genderType}</p>
                    <p><span className="font-semibold text-slate-500">Hostel Facility:</span> {college.hasHostel ? 'Available' : 'Not Available'}</p>
                    <p><span className="font-semibold text-slate-500">Bus Transport:</span> {college.hasTransport ? 'Available' : 'Not Available'}</p>
                    <p><span className="font-semibold text-slate-500">Wi-Fi:</span> {college.hasWifi ? 'Yes' : 'No'}</p>
                    {college.boardCode && <p><span className="font-semibold text-slate-500">Board Code:</span> {college.boardCode}</p>}
                    {college.hostelFee && <p><span className="font-semibold text-slate-500">Hostel Fee:</span> ₹{Number(college.hostelFee).toLocaleString('en-IN')}/yr</p>}
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
                <span>Offered Streams & Transparent Fee Structure</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {college.streams?.map((s, idx) => {
                  const total = (Number(s.annualFee) || 0) + (Number(s.admissionFee) || 0) + (Number(s.otherCharges) || 0);
                  return (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-slate-100 font-bold text-lg">{s.streamName}</h4>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {s.courseType || 'Intermediate'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Medium: {s.medium || 'English'} • Intake: {s.intakeSeats || 120} seats
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-indigo-400">₹{Number(s.annualFee || 0).toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-500 block uppercase">Tuition / Year</span>
                        </div>
                      </div>

                      {/* Fee Breakdown */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-850 text-xs text-center">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">Admission</span>
                          <span className="font-bold text-slate-200">₹{Number(s.admissionFee || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">Other Charges</span>
                          <span className="font-bold text-slate-200">₹{Number(s.otherCharges || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">Total Year 1</span>
                          <span className="font-extrabold text-emerald-400">₹{total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 border-t border-slate-800/60 pt-3">
                        <p><span className="font-semibold text-slate-500">Min Qualification:</span> {s.minQualification || '10th Pass'}</p>
                        <p><span className="font-semibold text-slate-500">Cutoff / Marks:</span> {s.requiredMarks || 'Pass'}</p>
                        <p><span className="font-semibold text-slate-500">Admission Mode:</span> {s.admissionType ? s.admissionType.replace('_', ' ') : 'Direct'}</p>
                        <p><span className="font-semibold text-slate-500">Duration:</span> 2 Academic Years</p>
                      </div>

                      {s.reservationInfo && (
                        <p className="text-[11px] text-slate-500 leading-normal border-t border-slate-800/60 pt-2 italic">
                          <span className="font-semibold not-italic">Quota/Rules:</span> {s.reservationInfo}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {college.feePaymentTerms && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-slate-100 uppercase text-[10px] tracking-wide block">Payment Terms & Installments</span>
                  <p>{college.feePaymentTerms}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Admissions & Dates */}
          {activeTab === 'admissions' && (
            <div className="space-y-8 text-left max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-indigo-400" />
                  <span>Admissions & Important Dates</span>
                </h3>
                {college.admissions?.applicationLink && (
                  <a
                    href={college.admissions.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Online Application</span>
                  </a>
                )}
              </div>

              {/* Key Dates Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Academic Year</span>
                  <span className="text-xs font-extrabold text-slate-200">{college.admissions?.academicYear || '2026-2027'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Application Start</span>
                  <span className="text-xs font-extrabold text-indigo-400">{college.admissions?.applicationStartDate || 'May 2026'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Application Deadline</span>
                  <span className="text-xs font-extrabold text-rose-400">{college.admissions?.applicationEndDate || 'July 2026'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Classes Commencement</span>
                  <span className="text-xs font-extrabold text-emerald-400">{college.admissions?.classesStartDate || 'July 2026'}</span>
                </div>
              </div>

              {/* Step-by-Step Procedure */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Step-by-Step Admission Procedure</h4>
                <div className="space-y-4 relative border-l border-slate-800 pl-6 ml-3">
                  {(college.admissions?.procedure || [
                    'Check eligibility criteria and cutoff GPA for chosen stream.',
                    'Prepare required certificates (10th memo, Transfer Certificate, Bonafide, Aadhaar).',
                    'Submit application online or visit admissions administrative block in person.',
                    'Confirm provisional seat allotment with verification of original documents.'
                  ]).map((step, idx) => (
                    <div key={idx} className="relative">
                      <span className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-indigo-600 border border-slate-900 text-xs font-bold flex items-center justify-center text-white">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Scholarships & Concessions */}
          {activeTab === 'scholarships' && (
            <div className="space-y-6 text-left max-w-4xl">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Available Scholarships & Fee Concessions</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(college.scholarships && college.scholarships.length > 0 ? college.scholarships : [
                  {
                    title: 'Telangana State ePASS Fee Reimbursement',
                    description: 'Full or partial tuition fee reimbursement provided by TS Government for eligible SC, ST, BC, and Minority candidates.',
                    eligibility: 'Annual parental income under ₹2 Lakhs (Urban) / ₹1.5 Lakhs (Rural).'
                  },
                  {
                    title: 'Merit Academic Fee Waiver',
                    description: 'Institution provides fee concessions for high achievers securing 9.5+ GPA in SSC Board exams.',
                    eligibility: 'SSC Grade 9.5+ or CBSE 90%+'
                  }
                ]).map((sch, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
                    <h4 className="text-slate-100 font-bold text-sm">{sch.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{sch.description}</p>
                    <p className="text-xs text-indigo-400 font-semibold pt-1">Eligibility: {sch.eligibility}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Facilities */}
          {activeTab === 'facilities' && (
            <div className="space-y-6 text-left">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-indigo-400" />
                <span>Campus Infrastructure & Facilities</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                {[
                  { key: 'hasHostel', label: 'Hostel Facility', detail: college.hostelDetails || 'Hostel accommodations with meal plans' },
                  { key: 'hasTransport', label: 'College Transport Buses', detail: college.transportDetails || 'Bus network covering prime city routes' },
                  { key: 'hasLibrary', label: 'Central Library', detail: college.libraryDetails || 'Academic textbooks and reading hall' },
                  { key: 'hasLabs', label: 'Science Laboratories', detail: college.labsDetails || 'Physics, Chemistry, and Biology labs' },
                  { key: 'hasComputerLabs', label: 'Computer & AI Labs', detail: college.computerLabsDetails || 'Digital computer stations' },
                  { key: 'hasSports', label: 'Sports & Athletics', detail: college.sportsDetails || 'Outdoor and indoor sports facilities' },
                  { key: 'hasPlayground', label: 'Playground Turf', detail: college.playgroundDetails || 'Open playground campus ground' },
                  { key: 'hasWifi', label: 'Campus Wi-Fi', detail: college.wifiDetails || 'High-speed internet network' },
                  { key: 'hasSmartClassroom', label: 'Smart Classrooms', detail: college.smartClassDetails || 'Projectors and interactive digital boards' },
                  { key: 'hasCctv', label: 'CCTV & Security', detail: college.cctvDetails || '24/7 security surveillance' },
                  { key: 'hasCafeteria', label: 'Canteen & Cafeteria', detail: college.cafeteriaDetails || 'Subsidized hygienic cafeteria' },
                ].map((fac, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-2 font-medium ${
                      college[fac.key]
                        ? 'bg-indigo-500/5 border-indigo-500/30 text-indigo-300'
                        : 'bg-slate-950/40 border-slate-900/60 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{fac.label}</span>
                      <span>{college[fac.key] ? '✓' : '✗'}</span>
                    </div>
                    {college[fac.key] && (
                      <p className="text-[11px] text-slate-400">{fac.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: Documents & Brochures */}
          {activeTab === 'documents' && (
            <div className="space-y-6 text-left max-w-4xl">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Official Documents, Prospectus & Brochures</span>
              </h3>

              {college.documents && college.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {college.documents.map((d, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-200">{d.title}</h4>
                          <span className="text-[10px] text-slate-500 uppercase">{d.type}</span>
                        </div>
                      </div>
                      {d.url ? (
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-600">Available on campus</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400 space-y-3">
                  <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                  <p>Official printed prospectus and admission forms are available directly at the admissions administrative block.</p>
                  {(college.whatsappNumber || college.phone) && (
                    <a
                      href={`https://wa.me/${(college.whatsappNumber || college.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, please share the admission prospectus and brochure for ${college.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Request Prospectus on WhatsApp</span>
                    </a>
                  )}
                </div>
              )}
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
    </AuthRequiredGate>
  );
}
