'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import MapComponent from '@/components/MapComponent';
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
  MessageCircle,
  FileText,
  Download,
  ExternalLink,
  Calendar,
  Award,
  Building2,
  Clock,
  Check,
  Lock,
  LogIn
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';

/**
 * Formats a clean, valid WhatsApp URL with country code and pre-filled message.
 * Supports direct college mobile numbers, and seamlessly routes colleges with only
 * landlines (040...) to the verified Career365Compass Central Admissions Desk.
 */
function getCollegeWhatsApp(college) {
  if (!college) return null;

  const raw = (college.whatsappNumber || college.phone || '').trim();
  const digits = raw.replace(/[^0-9]/g, '');

  let isDirectCollege = false;
  let formattedNumber = '';

  // Landlines in Hyderabad start with '040' / '40' or are <= 8 digits
  const isLandline = digits.startsWith('040') || digits.startsWith('40') || (digits.length > 0 && digits.length <= 8);

  if (digits && !isLandline) {
    if (digits.length === 10 && /^[6-9]/.test(digits)) {
      formattedNumber = `91${digits}`;
      isDirectCollege = true;
    } else if (digits.length === 11 && digits.startsWith('0') && /^[6-9]/.test(digits.slice(1))) {
      formattedNumber = `91${digits.slice(1)}`;
      isDirectCollege = true;
    } else if (digits.length === 12 && digits.startsWith('91')) {
      formattedNumber = digits;
      isDirectCollege = true;
    }
  }

  // Fallback to verified Career365Compass Central Student Helpline (+91 92843 06159 - Rahim Shaikh / Mentor Desk)
  if (!formattedNumber) {
    formattedNumber = '919284306159';
    isDirectCollege = false;
  }

  const collegeName = college.name || 'this college';
  const message = isDirectCollege
    ? `Hello! I found ${collegeName} on Career365Compass. I am a student interested in admission details, streams offered, cutoffs, and fee structure for the 2026-2027 academic year.`
    : `Hello Career365Compass Admissions Desk! I am interested in admission details, eligibility, and fee structure for ${collegeName} (${college.address || 'Hyderabad'}). Please guide me.`;

  return {
    url: `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`,
    formattedNumber,
    isDirectCollege,
    displayNumber: isDirectCollege ? (college.whatsappNumber || college.phone) : '+91 92843 06159',
    badgeText: isDirectCollege ? 'Official College WhatsApp Desk' : 'Verified Admissions Desk',
    shortBadge: isDirectCollege ? 'Direct College Desk' : 'Central Admissions Desk'
  };
}

export default function CollegeDetailClient({ id, initialCollege }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [college, setCollege] = useState(initialCollege || null);
  const [loading, setLoading] = useState(!initialCollege);
  const [activeTab, setActiveTab] = useState('overview');
  const tabRefs = useRef({});

  // Review Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Require authentication to view detailed college profiles
  useEffect(() => {
    if (!authLoading && !user) {
      const currentPath = typeof window !== 'undefined' ? (window.location.pathname || `/colleges/${id}`) : `/colleges/${id}`;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [authLoading, user, id, router]);

  useEffect(() => {
    fetchCollegeDetails();
  }, [id]);

  // Scrollspy: update activeTab as user scrolls through sections
  useEffect(() => {
    const sectionIds = [
      'overview',
      'streams',
      'admissions',
      'scholarships',
      'facilities',
      'documents',
      'location',
      'gallery',
      'reviews'
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 220; // Top threshold to account for sticky navbar and tab bar

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollY + offset >= top) {
            setActiveTab(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smoothly center the active tab button on mobile/overflow navigation
  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      tabRefs.current[activeTab].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activeTab]);

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchCollegeDetails = async () => {
    if (!initialCollege) setLoading(true);
    try {
      const docRef = doc(db, 'colleges', String(id));
      let docSnap = await getDoc(docRef);
      let collegeData = null;
      let targetDocId = String(id);

      if (docSnap.exists()) {
        collegeData = docSnap.data();
      } else {
        // Fallback: Query by id field as string or numeric if doc ID does not match directly
        const qColStr = query(collection(db, 'colleges'), where('id', '==', String(id)));
        const qSnapStr = await getDocs(qColStr);
        if (!qSnapStr.empty) {
          collegeData = qSnapStr.docs[0].data();
          targetDocId = qSnapStr.docs[0].id;
        } else {
          const numericId = parseInt(id, 10);
          if (!isNaN(numericId)) {
            const qColNum = query(collection(db, 'colleges'), where('id', '==', numericId));
            const qSnapNum = await getDocs(qColNum);
            if (!qSnapNum.empty) {
              collegeData = qSnapNum.docs[0].data();
              targetDocId = qSnapNum.docs[0].id;
            }
          }
        }
      }

      if (collegeData) {
        // Fetch approved reviews from firestore
        const collegeNumId = parseInt(collegeData.id || targetDocId, 10);
        const q = query(
          collection(db, 'reviews'),
          where('collegeId', '==', isNaN(collegeNumId) ? targetDocId : collegeNumId),
          where('isApproved', '==', true)
        );
        let collegeReviews = [];
        try {
          const reviewsSnap = await getDocs(q);
          reviewsSnap.forEach((d) => {
            const r = d.data();
            collegeReviews.push({
              id: d.id,
              ...r,
              user: { name: r.userName || 'Anonymous Student' }
            });
          });
        } catch (e) {
          console.warn('Reviews fetch failed, continuing without reviews:', e);
        }

        setCollege((prev) => ({
          ...(prev || {}),
          id: targetDocId,
          ...collegeData,
          reviews: collegeReviews,
          totalReviews: collegeReviews.length
        }));
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

  if (loading || authLoading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-50 dark:bg-slate-950 min-h-[60vh] transition-colors">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="text-slate-500 dark:text-slate-400 text-xs tracking-wider uppercase">Loading verified college profile...</p>
        </div>
      </div>
    );
  }

  // Authentication barrier: require login to view detailed college profile
  if (!user) {
    const currentPath = typeof window !== 'undefined' ? (window.location.pathname || `/colleges/${id}`) : `/colleges/${id}`;
    const loginUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
    const registerUrl = `/register?redirect=${encodeURIComponent(currentPath)}`;

    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/60 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Sign In to View College Details
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Detailed tuition fee breakdowns, cutoff GPAs, verified admissions WhatsApp desks, contact numbers, and campus reviews are reserved for registered students & parents.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Link
              href={loginUrl}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Continue</span>
            </Link>
            <Link
              href={registerUrl}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl transition border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <span>Create Free Student Account</span>
            </Link>
          </div>
          <div className="pt-2 border-t border-slate-150 dark:border-slate-800">
            <Link
              href="/colleges"
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition"
            >
              ← Back to Colleges Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="flex-grow bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] transition-colors">
        <ShieldAlert className="w-16 h-16 text-slate-400 dark:text-slate-600 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-200">College not found</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-sm mt-2 mb-6">The requested college ID does not exist in our directory databases.</p>
        <Link href="/colleges" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition">
          Back to Directory
        </Link>
      </div>
    );
  }

  const isVerified = college.status === 'APPROVED' || college.isApproved || college.verified;
  const whatsappInfo = getCollegeWhatsApp(college);

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
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://career365compass.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Colleges in Hyderabad",
            "item": "https://career365compass.in/colleges/"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": college.name,
            "item": `https://career365compass.in/colleges/${id}/`
          }
        ]
      },
      {
        "@type": "CollegeOrUniversity",
        "@id": `https://career365compass.in/colleges/${id}/#college`,
        "name": college.name,
        "description": college.description,
        "telephone": college.phone || undefined,
        "email": college.email || undefined,
        "url": college.website || `https://career365compass.in/colleges/${id}/`,
        "image": college.coverImageUrl || undefined,
        "logo": college.logoUrl || undefined,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": college.address,
          "addressLocality": "Hyderabad",
          "addressRegion": "Telangana",
          "addressCountry": "IN"
        }
      }
    ]
  } : null;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 bg-grid-pattern min-h-screen flex-grow transition-colors">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      {/* College Banner Cover */}
      <div className="relative h-64 sm:h-96 w-full bg-slate-200 dark:bg-slate-950 overflow-hidden">
        {college.coverImageUrl ? (
          <img
            src={college.coverImageUrl}
            alt={college.name}
            className="w-full h-full object-cover opacity-80 dark:opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 via-slate-100 to-indigo-200 dark:from-indigo-950 dark:via-slate-900 dark:to-indigo-900 opacity-80 dark:opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-900/30 to-transparent" />
      </div>

      {/* College Header Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-10 space-y-8 pb-20">
        {(!college.isApproved || college.isLive === false || college.status === 'PENDING' || college.status === 'DRAFT') && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 shrink-0 text-amber-500 dark:text-amber-400" />
              <div>
                <p className="font-bold">Administrative Preview Mode</p>
                <p className="text-[11px] text-amber-600 dark:text-amber-400/80">This institution profile is currently {college.isLive === false ? 'UNPUBLISHED (Offline)' : 'PENDING APPROVAL'}. It is not publicly visible to students in the directory until approved and made live.</p>
              </div>
            </div>
            {user?.role === 'SUPER_ADMIN' && (
              <Link href="/admin" className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition shrink-0">
                Manage in Admin →
              </Link>
            )}
          </div>
        )}

        {/* Community Volunteer Recognition Banner */}
        {college.contributedByName && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 dark:from-emerald-500/15 dark:via-teal-500/10 dark:to-indigo-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  Community Contributed by <span className="underline decoration-emerald-500 font-extrabold">{college.contributedByName}</span>
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300/80">
                  This college profile was scouted & submitted by a student volunteer and verified by Career365Compass Super Admin.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Verified Volunteer Data</span>
            </span>
          </div>
        )}

        {/* Semantic Breadcrumbs for Navigation & SEO */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium">Home</Link>
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <Link href="/colleges" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium">Colleges in Hyderabad</Link>
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <span className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-xs">{college.name}</span>
        </nav>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center flex-grow">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shrink-0 flex items-center justify-center p-2 shadow-inner overflow-hidden">
              {college.logoUrl ? (
                <img src={college.logoUrl} alt={`${college.name} Logo`} className="w-full h-full object-contain" />
              ) : (
                <Landmark className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
              )}
            </div>

            {/* Core Info */}
            <div className="space-y-3 flex-grow">
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[9px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 px-2.5 py-1 rounded-full">
                  {college.ownership}
                </span>
                <span className="text-[9px] font-extrabold uppercase bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 px-2.5 py-1 rounded-full">
                  {college.category?.replace('_', ' ')}
                </span>
                {college.establishedYear && (
                  <span className="text-[9px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full">
                    Estd {college.establishedYear}
                  </span>
                )}
                {isVerified && (
                  <span className="text-[9px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Institution</span>
                  </span>
                )}
                {college.affiliation && (
                  <span className="text-[9px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full">
                    {college.affiliation}
                  </span>
                )}
                {college.contributedByName && (
                  <span className="text-[9px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                    <span>Scouted by {college.contributedByName}</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display leading-tight">{college.name}</h1>
              
              <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 items-center">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                  <span>{college.address}</span>
                </p>
                {college.pincode && (
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    PIN {college.pincode}
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <div className="flex items-center text-yellow-500 dark:text-yellow-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold ml-1">{college.averageRating || '4.0'}</span>
                  </div>
                  <span className="text-slate-400 dark:text-slate-500">({college.totalReviews || 0} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs: Direct WhatsApp & Apply Online */}
          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 self-stretch md:self-center">
            {whatsappInfo && (
              <a
                href={whatsappInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all cursor-pointer"
                title={`Chat on WhatsApp with ${college.name}`}
              >
                <MessageCircle className="w-5 h-5 fill-current shrink-0" />
                <div className="text-left">
                  <span className="block leading-tight font-extrabold">Contact on WhatsApp</span>
                  <span className="block text-[10px] text-emerald-100 font-medium">{whatsappInfo.shortBadge}</span>
                </div>
              </a>
            )}

            {college.admissions?.applicationLink && (
              <a
                href={college.admissions.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <span className="block leading-tight font-extrabold">Apply for Admission</span>
                  <span className="block text-[10px] text-indigo-200 font-medium">Official Portal</span>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Sticky Navigation Tabs */}
        <div className="sticky top-16 z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-y border-slate-200 dark:border-slate-800 transition-all shadow-sm">
          <div className="max-w-7xl mx-auto flex overflow-x-auto gap-2 scrollbar-none py-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                ref={(el) => (tabRefs.current[tab.id] = el)}
                onClick={() => scrollToSection(tab.id)}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400/40'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/90 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: Overview */}
        <div id="overview" className="scroll-mt-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-8 text-left">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Building2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">About & Institution Overview</h3>
          </div>

          {/* About description */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">About the College</h4>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{college.description}</p>
          </div>

          {/* Principal Message card if available */}
          {(college.principalName || college.principalMessage) && (
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Leadership & Authorised Representative</span>
              </div>
              <h4 className="text-slate-900 dark:text-slate-100 font-bold text-sm">
                {college.principalName || 'Principal'} <span className="text-slate-500 dark:text-slate-400 font-normal">({college.principalDesignation || 'Authorised Representative'})</span>
              </h4>
              {college.principalMessage && (
                <p className="text-xs text-slate-700 dark:text-slate-300 italic border-l-2 border-indigo-500 pl-3 py-1">
                  "{college.principalMessage}"
                </p>
              )}
            </div>
          )}

          {/* Direct WhatsApp Admissions Banner */}
          {whatsappInfo && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-100/50 dark:from-emerald-950/70 dark:via-slate-900 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm dark:shadow-lg">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-500/30">
                  <MessageCircle className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-slate-900 dark:text-slate-100 font-bold text-sm sm:text-base">Admissions WhatsApp Helpline</h4>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/30">
                      {whatsappInfo.badgeText}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Students and parents can chat directly on WhatsApp to inquire about streams, cutoffs, admission dates, and hostel availability.
                  </p>
                </div>
              </div>
              <a
                href={whatsappInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/40 transition shrink-0 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Open WhatsApp Chat</span>
              </a>
            </div>
          )}

          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Columns */}
            <div className="space-y-4">
              <h3 className="text-slate-900 dark:text-slate-100 font-bold text-sm">Contact & Location Links</h3>
              <div className="space-y-3 text-xs text-slate-800 dark:text-slate-200">
                {college.phone && (
                  <p className="flex items-center gap-2.5 font-medium">
                    <Phone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="text-slate-900 dark:text-slate-100 font-semibold">{college.phone}</span>
                  </p>
                )}
                {whatsappInfo && (
                  <p className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">WhatsApp:</span>
                    <a
                      href={whatsappInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline font-bold"
                    >
                      {whatsappInfo.displayNumber} ({whatsappInfo.shortBadge}) →
                    </a>
                  </p>
                )}
                {college.email && (
                  <p className="flex items-center gap-2.5 font-medium">
                    <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <a href={`mailto:${college.email}`} className="text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline font-semibold">{college.email}</a>
                  </p>
                )}
                {college.officeTimings && (
                  <p className="flex items-center gap-2.5 font-medium text-slate-800 dark:text-slate-200">
                    <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>Office Hours: <strong className="text-slate-900 dark:text-slate-100">{college.officeTimings}</strong></span>
                  </p>
                )}
                {college.website && (
                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline font-semibold"
                  >
                    <Globe className="w-4 h-4 shrink-0" />
                    <span>{college.website.replace('http://', '').replace('https://', '')}</span>
                  </a>
                )}
                {college.address && college.name && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${college.name.split(',')[0]}, ${college.address}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2.5 text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline transition font-semibold"
                  >
                    <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>View on Google Maps (Directions)</span>
                  </a>
                )}
              </div>
            </div>

            {/* Admission Info summary */}
            <div className="space-y-4">
              <h3 className="text-slate-900 dark:text-slate-100 font-bold text-sm">General Parameters</h3>
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p><span className="font-semibold text-slate-600 dark:text-slate-400">Gender Demographics:</span> <span className="font-bold text-slate-900 dark:text-slate-100">{college.genderType === 'CO_ED' ? 'Co-Educational' : college.genderType}</span></p>
                <p><span className="font-semibold text-slate-600 dark:text-slate-400">Hostel Facility:</span> <span className="font-bold text-slate-900 dark:text-slate-100">{college.hasHostel ? 'Available' : 'Not Available'}</span></p>
                <p><span className="font-semibold text-slate-600 dark:text-slate-400">Bus Transport:</span> <span className="font-bold text-slate-900 dark:text-slate-100">{college.hasTransport ? 'Available' : 'Not Available'}</span></p>
                <p><span className="font-semibold text-slate-600 dark:text-slate-400">Wi-Fi:</span> <span className="font-bold text-slate-900 dark:text-slate-100">{college.hasWifi ? 'Yes' : 'No'}</span></p>
                {college.boardCode && <p><span className="font-semibold text-slate-600 dark:text-slate-400">Board Code:</span> <span className="font-bold text-slate-900 dark:text-slate-100">{college.boardCode}</span></p>}
                {college.hostelFee && <p><span className="font-semibold text-slate-600 dark:text-slate-400">Hostel Fee:</span> <span className="font-bold text-slate-900 dark:text-slate-100">₹{Number(college.hostelFee).toLocaleString('en-IN')}/yr</span></p>}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Streams & Fees */}
        <div id="streams" className="scroll-mt-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 text-left">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <GraduationCap className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Offered Streams & Transparent Fee Structure</h3>
          </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.isArray(college.streams) && college.streams.map((s, idx) => {
                  const total = (Number(s.annualFee) || 0) + (Number(s.admissionFee) || 0) + (Number(s.otherCharges) || 0);
                  return (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-slate-900 dark:text-slate-100 font-bold text-lg">{s.streamName}</h4>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                              {s.courseType || 'Intermediate'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                            Medium: {s.medium || 'English'} • Intake: {s.intakeSeats || 120} seats
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">₹{Number(s.annualFee || 0).toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Tuition / Year</span>
                        </div>
                      </div>

                      {/* Fee Breakdown */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-center shadow-sm">
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block">Admission</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">₹{Number(s.admissionFee || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block">Other Charges</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">₹{Number(s.otherCharges || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block">Total Year 1</span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹{total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/60 pt-3">
                        <p><span className="font-semibold text-slate-700 dark:text-slate-300">Min Qualification:</span> {s.minQualification || '10th Pass'}</p>
                        <p><span className="font-semibold text-slate-700 dark:text-slate-300">Cutoff / Marks:</span> {s.requiredMarks || 'Pass'}</p>
                        <p><span className="font-semibold text-slate-700 dark:text-slate-300">Admission Mode:</span> {s.admissionType ? s.admissionType.replace('_', ' ') : 'Direct'}</p>
                        <p><span className="font-semibold text-slate-700 dark:text-slate-300">Duration:</span> 2 Academic Years</p>
                      </div>

                      {s.reservationInfo && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal border-t border-slate-200 dark:border-slate-800/60 pt-2 italic">
                          <span className="font-semibold not-italic text-slate-700 dark:text-slate-300">Quota/Rules:</span> {s.reservationInfo}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

          {(!Array.isArray(college.streams) || college.streams.length === 0) && (
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl p-8 text-center text-xs">
              No streams listed yet for this college. Please enquire directly with admissions for streams and intake.
            </div>
          )}

          {college.feePaymentTerms && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 uppercase text-[10px] tracking-wide block">Payment Terms & Installments</span>
              <p>{college.feePaymentTerms}</p>
            </div>
          )}
        </div>

        {/* Section 3: Admissions & Dates */}
        <div id="admissions" className="scroll-mt-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                <span>Admissions & Important Dates</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Academic year {college.admissions?.academicYear || '2026-2027'} schedule and guidelines</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {whatsappInfo && (
                <a
                  href={whatsappInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Enquire on WhatsApp</span>
                </a>
              )}
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
          </div>

          {/* Key Dates Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Academic Year</span>
              <span className="text-xs font-extrabold text-slate-900 dark:text-slate-200">{college.admissions?.academicYear || '2026-2027'}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Application Start</span>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{college.admissions?.applicationStartDate || 'May 2026'}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Application Deadline</span>
              <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400">{college.admissions?.applicationEndDate || 'July 2026'}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Classes Commencement</span>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{college.admissions?.classesStartDate || 'July 2026'}</span>
            </div>
          </div>

          {/* Step-by-Step Procedure */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Step-by-Step Admission Procedure</h4>
            {typeof college.admissions?.procedure === 'string' && college.admissions.procedure.trim() ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {college.admissions.procedure}
              </div>
            ) : (
              <div className="space-y-4 relative border-l border-slate-200 dark:border-slate-800 pl-6 ml-3">
                {(Array.isArray(college.admissions?.procedure) && college.admissions.procedure.length > 0 ? college.admissions.procedure : [
                  'Check eligibility criteria and cutoff GPA for chosen stream.',
                  'Prepare required certificates (10th memo, Transfer Certificate, Bonafide, Aadhaar).',
                  'Submit application online or visit admissions administrative block in person.',
                  'Confirm provisional seat allotment with verification of original documents.'
                ]).map((step, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-indigo-600 border border-white dark:border-slate-900 text-xs font-bold flex items-center justify-center text-white shadow-sm">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Scholarships & Concessions */}
        <div id="scholarships" className="scroll-mt-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 text-left">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Available Scholarships & Fee Concessions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {typeof college.scholarships === 'string' && college.scholarships.trim() ? (
              <div className="col-span-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
                <h4 className="text-slate-900 dark:text-slate-100 font-bold text-sm">Institutional Scholarships & Fee Concessions</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{college.scholarships}</p>
              </div>
            ) : Array.isArray(college.scholarships) && college.scholarships.length > 0 ? (
              college.scholarships.map((sch, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
                  <h4 className="text-slate-900 dark:text-slate-100 font-bold text-sm">{sch.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{sch.description}</p>
                  {sch.eligibility && <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold pt-1">Eligibility: {sch.eligibility}</p>}
                </div>
              ))
            ) : (
              [
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
              ].map((sch, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
                  <h4 className="text-slate-900 dark:text-slate-100 font-bold text-sm">{sch.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{sch.description}</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold pt-1">Eligibility: {sch.eligibility}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 5: Campus Facilities */}
        <div id="facilities" className="scroll-mt-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 text-left">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Dumbbell className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Campus Infrastructure & Facilities</h3>
          </div>

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
                    ? 'bg-indigo-50/70 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-900 dark:text-indigo-300'
                    : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-900/60 text-slate-400 dark:text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{fac.label}</span>
                  <span className={college[fac.key] ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}>{college[fac.key] ? '✓' : '✗'}</span>
                </div>
                {college[fac.key] && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">{fac.detail}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Official Documents & Brochures */}
        <div id="documents" className="scroll-mt-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 text-left">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <FileText className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Official Documents, Prospectus & Brochures</h3>
          </div>

          {Array.isArray(college.documents) && college.documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {college.documents.map((d, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-200">{d.title}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{d.type}</span>
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
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Available on campus</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400 space-y-3">
              <FileText className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
              <p>Official printed prospectus and admission forms are available directly at the admissions administrative block.</p>
              {whatsappInfo && (
                <a
                  href={`https://wa.me/${whatsappInfo.formattedNumber}?text=${encodeURIComponent(`Hi, please share the official admission prospectus, fee circular, and brochure for ${college.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Request Prospectus on WhatsApp</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Section 7: Campus Location */}
        <div id="location" className="scroll-mt-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 text-left">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <MapPin className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Campus Location & Directions</h3>
          </div>
          <MapComponent
            address={college.address}
            name={college.name}
            landmark={college.nearbyLandmark}
            pincode={college.pincode}
          />
        </div>

        {/* Section 8: Campus Photo Gallery */}
        <div id="gallery" className="scroll-mt-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 text-left">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Campus Photo Gallery</h3>
          </div>

          {!Array.isArray(college.gallery) || college.gallery.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 text-xs">
              No images uploaded.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {college.gallery.map((img, idx) => (
                <div key={idx} className="relative h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group shadow-sm bg-slate-100 dark:bg-slate-950">
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

        {/* Section 9: Reviews */}
        <div id="reviews" className="scroll-mt-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 text-left">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-slate-800">
            <Star className="w-5 h-5 text-yellow-500 dark:text-yellow-400 fill-current" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Student Reviews & Community Feedback ({college.totalReviews || 0})</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left items-start">
            
            {/* Left Side: Reviews list */}
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">All Verified Reviews</h4>
                
              {college.reviews?.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                  No reviews published yet for this college. Be the first to write a review!
                </div>
              ) : (
                <div className="space-y-4">
                  {college.reviews?.map((r, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-bold">
                          <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium text-[10px]">Student</span>
                          <span className="text-slate-900 dark:text-slate-100">{r.user?.name || 'Anonymous User'}</span>
                        </div>
                        
                        {/* Stars */}
                        <div className="flex items-center text-yellow-500 dark:text-yellow-400">
                          {[...Array(5)].map((_, starIdx) => (
                            <Star
                              key={starIdx}
                              className={`w-3.5 h-3.5 ${
                                starIdx < r.rating ? 'fill-current' : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">{r.reviewText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Write Review Form */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-3xl p-6 space-y-5 shadow-md hover:border-indigo-500/20 transition w-full">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-400 animate-pulse" />
                <span>Write a Campus Review</span>
              </h3>
              
              {user ? (
                user.role === 'SUPER_ADMIN' ? (
                  <p className="text-xs text-slate-500">Administrator accounts cannot submit reviews.</p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-5">
                    {reviewMessage && (
                      <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-xl p-3 text-xs">
                        {reviewMessage}
                      </div>
                    )}
                    {reviewError && (
                      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 rounded-xl p-3 text-xs">
                        {reviewError}
                      </div>
                    )}

                    {/* Rating select stars with hover triggers */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">Your Rating</label>
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
                              <Star className={`w-7 h-7 ${isFilled ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Review text */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                        <label>Your Feedback Comment</label>
                        <span className={reviewText.length > 500 ? 'text-red-500 font-bold' : ''}>{reviewText.length}/500</span>
                      </div>
                      <textarea
                        rows="4"
                        maxLength="500"
                        placeholder="Tell prospective students what you liked or disliked about this college (e.g. teaching, hostels, placements)..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="block w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-xs transition leading-relaxed"
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
                  <p className="text-xs text-slate-600 dark:text-slate-400">Please sign in to submit a review and rating.</p>
                  <Link href={`/login?redirect=/colleges/${id}`} className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer">
                    Log In
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom WhatsApp Action Bar */}
      {whatsappInfo && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 px-4 flex items-center gap-2.5 shadow-2xl">
          <a
            href={whatsappInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current shrink-0" />
            <span>Contact College on WhatsApp</span>
          </a>
          {college.admissions?.applicationLink && (
            <a
              href={college.admissions.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>Apply</span>
            </a>
          )}
        </div>
      )}

    </div>
  );
}
