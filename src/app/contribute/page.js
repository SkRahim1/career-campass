'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Globe,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Award,
  ArrowRight,
  PlusCircle,
  Radio,
  FileText
} from 'lucide-react';

const TELANGANA_DISTRICTS = [
  'Hyderabad',
  'Medchal-Malkajgiri',
  'Ranga Reddy',
  'Sangareddy',
  'Warangal',
  'Hanamkonda',
  'Nizamabad',
  'Karimnagar',
  'Nalgonda',
  'Khammam',
  'Mahabubnagar',
  'Siddipet',
  'Jagtial',
  'Mancherial',
  'Bhadradri Kothagudem',
  'Suryapet',
  'Kamareddy',
  'Yadadri Bhuvanagiri',
  'Wanaparthy',
  'Nagarkurnool',
  'Jogulamba Gadwal',
  'Narayanpet',
  'Vikarabad',
  'Medak',
  'Jangaon',
  'Jayashankar Bhupalpally',
  'Mulugu',
  'Mahabubabad',
  'Peddapalli',
  'Rajanna Sircilla',
  'Komaram Bheem Asifabad',
  'Adilabad',
  'Nirmal'
];

const COMMON_STREAMS = [
  { id: 'MPC', name: 'MPC (Maths, Physics, Chem)', defaultFee: '35000' },
  { id: 'BiPC', name: 'BiPC (Biology, Physics, Chem)', defaultFee: '38000' },
  { id: 'MEC', name: 'MEC (Maths, Econ, Commerce)', defaultFee: '30000' },
  { id: 'CEC', name: 'CEC (Civics, Econ, Commerce)', defaultFee: '28000' },
  { id: 'HEC', name: 'HEC (History, Econ, Civics)', defaultFee: '25000' },
  { id: 'Polytechnic', name: 'Polytechnic Diploma', defaultFee: '25000' },
  { id: 'ITI', name: 'ITI Technical Trade', defaultFee: '15000' },
  { id: 'Vocational', name: 'Vocational Intermediate', defaultFee: '20000' }
];

export default function ContributeCollegePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    ownership: 'PRIVATE',
    category: 'JUNIOR_COLLEGE',
    district: 'Hyderabad',
    address: '',
    pincode: '',
    nearbyLandmark: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    website: '',
    description: '',
    affiliation: 'Board of Intermediate Education, Telangana (TSBIE)',
    fieldNotes: '',
    publicAttribution: true,
    volunteerName: '',
    volunteerMobile: '',
    hasHostel: false,
    hasTransport: false,
    hasLibrary: true,
    hasLabs: true,
    hasWifi: false,
    hasSports: false,
    hasSmartClassroom: false,
    hasCctv: true,
    hasComputerLabs: true,
    hasCafeteria: false
  });

  const [selectedStreams, setSelectedStreams] = useState([
    { streamName: 'MPC', annualFee: '35000', enabled: true },
    { streamName: 'BiPC', annualFee: '38000', enabled: true },
    { streamName: 'MEC', annualFee: '30000', enabled: false },
    { streamName: 'CEC', annualFee: '28000', enabled: false },
    { streamName: 'HEC', annualFee: '25000', enabled: false },
    { streamName: 'Polytechnic', annualFee: '25000', enabled: false },
    { streamName: 'ITI', annualFee: '15000', enabled: false },
    { streamName: 'Vocational', annualFee: '20000', enabled: false }
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        volunteerName: prev.volunteerName || user.name || '',
        volunteerMobile: prev.volunteerMobile || user.mobileNumber || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleStream = (streamName) => {
    setSelectedStreams(prev =>
      prev.map(s => s.streamName === streamName ? { ...s, enabled: !s.enabled } : s)
    );
  };

  const handleStreamFeeChange = (streamName, fee) => {
    setSelectedStreams(prev =>
      prev.map(s => s.streamName === streamName ? { ...s, annualFee: fee } : s)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in with your student account to submit a college.');
      return;
    }

    if (!form.name.trim() || !form.address.trim() || !form.phone.trim()) {
      setError('Please fill in all mandatory fields: College Name, Campus Address, and Contact Phone.');
      return;
    }

    const cleanVolunteerMobile = (form.volunteerMobile || '').trim().replace(/[\s\-\+]/g, '');
    const tenDigitVolunteerMobile = cleanVolunteerMobile.length === 12 && cleanVolunteerMobile.startsWith('91')
      ? cleanVolunteerMobile.slice(2)
      : cleanVolunteerMobile;

    if (!tenDigitVolunteerMobile) {
      setError('Please enter your mobile number as a volunteer contributor.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(tenDigitVolunteerMobile)) {
      setError('Please enter a valid 10-digit Indian mobile number (e.g. 9848012345) for volunteer verification.');
      return;
    }

    const activeStreams = selectedStreams.filter(s => s.enabled);
    if (activeStreams.length === 0) {
      setError('Please select at least one stream/course offered by this college.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const { collection, getDocs, doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      // Get next numeric ID or fallback
      let nextId = 6600;
      try {
        const snap = await getDocs(collection(db, 'colleges'));
        let maxId = 0;
        snap.forEach(d => {
          const num = parseInt(d.id);
          if (!isNaN(num) && num > maxId) maxId = num;
        });
        nextId = maxId > 0 ? maxId + 1 : 6600;
      } catch (err) {
        nextId = Date.now();
      }

      const collegeId = String(nextId);
      const contributorDisplayName = form.publicAttribution
        ? (form.volunteerName?.trim() || user.name || user.email?.split('@')[0] || 'Community Volunteer')
        : 'Anonymous Volunteer';

      const payload = {
        id: collegeId,
        name: form.name.trim(),
        ownership: form.ownership,
        category: form.category,
        district: form.district,
        address: form.address.trim(),
        pincode: form.pincode.trim() || (form.address.match(/\b(50\d{4})\b/) ? form.address.match(/\b(50\d{4})\b/)[1] : ''),
        nearbyLandmark: form.nearbyLandmark.trim(),
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${form.name.trim().split(',')[0]}, ${form.address.trim()}`)}`,
        phone: form.phone.trim(),
        whatsappNumber: form.whatsappNumber.trim() || form.phone.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        affiliation: form.affiliation.trim(),
        description: form.description.trim() || `Verified institution in ${form.district}, Telangana offering intermediate and technical courses.`,
        fieldNotes: form.fieldNotes.trim(),
        facilities: {
          hostel: !!form.hasHostel,
          transport: !!form.hasTransport,
          library: !!form.hasLibrary,
          labs: !!form.hasLabs,
          wifi: !!form.hasWifi,
          sports: !!form.hasSports,
          smartClassrooms: !!form.hasSmartClassroom,
          cctv: !!form.hasCctv,
          computerLabs: !!form.hasComputerLabs,
          cafeteria: !!form.hasCafeteria
        },
        hasHostel: !!form.hasHostel,
        hasTransport: !!form.hasTransport,
        hasLibrary: !!form.hasLibrary,
        hasLabs: !!form.hasLabs,
        hasWifi: !!form.hasWifi,
        hasSports: !!form.hasSports,
        hasSmartClassroom: !!form.hasSmartClassroom,
        hasCctv: !!form.hasCctv,
        hasComputerLabs: !!form.hasComputerLabs,
        hasCafeteria: !!form.hasCafeteria,
        streams: activeStreams.map(s => ({
          streamName: s.streamName,
          annualFee: parseFloat(s.annualFee) || 0,
          minQualification: '10th Class',
          requiredMarks: 'Pass',
          admissionType: 'DIRECT'
        })),
        gallery: [
          'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80'
        ],
        coverImageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
        averageRating: 4.5,
        totalReviews: 0,
        // Status & Moderation Fields
        status: 'PENDING',
        isApproved: false,
        isLive: false,
        verified: false,
        // Community Attribution
        sourceType: 'COMMUNITY_CONTRIBUTION',
        contributedByName: contributorDisplayName,
        contributedByEmail: user.email || '',
        contributedByPhone: tenDigitVolunteerMobile,
        contributedByMobile: tenDigitVolunteerMobile,
        contributedByUid: user.uid,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'colleges', collegeId), payload);

      // Also persist volunteer mobile to user account if missing
      if (user?.uid && !user.mobileNumber) {
        try {
          const { updateDoc } = await import('firebase/firestore');
          await updateDoc(doc(db, 'users', user.uid), {
            mobileNumber: tenDigitVolunteerMobile
          });
        } catch (uErr) {
          console.warn('Could not update user mobile number in profile:', uErr);
        }
      }

      setSuccessData({
        id: collegeId,
        name: payload.name,
        district: payload.district,
        contributedByName: contributorDisplayName,
        contributedByMobile: tenDigitVolunteerMobile
      });

      // Reset form
      setForm({
        name: '', ownership: 'PRIVATE', category: 'JUNIOR_COLLEGE', district: 'Hyderabad',
        address: '', pincode: '', nearbyLandmark: '', phone: '', whatsappNumber: '', email: '',
        website: '', description: '', affiliation: 'Board of Intermediate Education, Telangana (TSBIE)',
        fieldNotes: '', publicAttribution: true,
        volunteerName: user?.name || '',
        volunteerMobile: user?.mobileNumber || tenDigitVolunteerMobile,
        hasHostel: false, hasTransport: false,
        hasLibrary: true, hasLabs: true, hasWifi: false, hasSports: false, hasSmartClassroom: false,
        hasCctv: true, hasComputerLabs: true, hasCafeteria: false
      });
    } catch (err) {
      console.error('Error submitting college:', err);
      setError(`Failed to submit college: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-left transition-colors">
      
      {/* Header Banner */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Community Volunteer Contributor Program</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
          Contribute a College to Career365Compass
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Help 10th class students across Telangana discover verified educational avenues. Any registered student or community volunteer can catalog colleges here. All contributions are reviewed by Super Admin and credited directly in your name on the live portal!
        </p>
      </div>

      {/* Guest Notice if not logged in */}
      {!user && !authLoading && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-slate-800 dark:text-slate-200 space-y-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                Already have a Student Account? No Extra Registration Needed!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                You do not need to register again to add colleges. Simply sign in with your regular student account to submit institutions and earn your Community Volunteer badge.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/login?redirect=/contribute"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <span>Sign In with Your Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/register?redirect=/contribute"
              className="px-5 py-2.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              <span>Create Free Account (30 seconds)</span>
            </Link>
          </div>
        </div>
      )}

      {/* Celebratory Success Banner */}
      {successData && (
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-4 shadow-lg animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <p className="font-bold text-emerald-200 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>College Successfully Submitted for Admin Verification!</span>
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thank you! <strong>{successData.name}</strong> ({successData.district}) has been logged in the Admin Verification queue.
              </p>
              <p className="text-xs text-emerald-400 font-medium">
                Super Admin will verify the phone numbers and fee structure. Once approved, it will be published live with credit: <strong className="text-white">“Contributed by {successData.contributedByName}”</strong>.
              </p>
            </div>
            <button
              onClick={() => setSuccessData(null)}
              className="text-slate-400 hover:text-white text-base leading-none cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-emerald-500/20">
            <Link
              href="/profile"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <span>View My Submissions in Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setSuccessData(null)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              + Add Another College
            </button>
          </div>
        </div>
      )}

      {/* Main Contribution Form */}
      {user && (
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 w-full">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Identity */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
            <h2 className="font-bold text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>1. College Identity & Location</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  College Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Government Junior College or St. Joseph's Junior College"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 text-xs sm:text-sm transition"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">District <span className="text-red-500">*</span></label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleInputChange}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500 text-xs sm:text-sm transition cursor-pointer"
                >
                  {TELANGANA_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Ownership Type</label>
                <select
                  name="ownership"
                  value={form.ownership}
                  onChange={handleInputChange}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500 text-xs sm:text-sm transition cursor-pointer"
                >
                  <option value="GOVERNMENT">Government College (Free / Nominal Fee)</option>
                  <option value="PRIVATE">Private College</option>
                  <option value="AIDED">Government-Aided</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Course Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:border-purple-500 text-xs sm:text-sm transition cursor-pointer"
                >
                  <option value="JUNIOR_COLLEGE">Junior College (11th & 12th)</option>
                  <option value="POLYTECHNIC">Polytechnic Engineering Diploma</option>
                  <option value="ITI">ITI Technical Trade</option>
                  <option value="VOCATIONAL">Vocational Intermediate</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Affiliation Board</label>
                <input
                  type="text"
                  name="affiliation"
                  value={form.affiliation}
                  onChange={handleInputChange}
                  placeholder="e.g. Board of Intermediate Education, Telangana (TSBIE)"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 text-xs sm:text-sm transition"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Campus Street Address & Area <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={form.address}
                  onChange={handleInputChange}
                  placeholder="e.g. Near Bus Stand, Main Road, Falaknuma, Hyderabad"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 text-xs sm:text-sm transition"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Postal PIN Code (6 digits)</label>
                <input
                  type="text"
                  name="pincode"
                  maxLength={6}
                  value={form.pincode}
                  onChange={handleInputChange}
                  placeholder="e.g. 500053"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 text-xs sm:text-sm font-mono transition"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Nearby Landmark</label>
                <input
                  type="text"
                  name="nearbyLandmark"
                  value={form.nearbyLandmark}
                  onChange={handleInputChange}
                  placeholder="e.g. Opposite Post Office / Near Metro Station"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 text-xs sm:text-sm transition"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Numbers */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
            <h2 className="font-bold text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>2. Helpline & Admissions Contacts</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Official Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. 040-24381234 or 9848012345"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 text-xs sm:text-sm transition"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span>WhatsApp Helpline</span>
                  <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={form.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 9848012345"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm transition"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">College Email Address (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                  placeholder="e.g. principal@college.edu.in"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 text-xs sm:text-sm transition"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Official Website (Optional)</label>
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleInputChange}
                  placeholder="e.g. https://www.college.edu.in"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 text-xs sm:text-sm transition"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Offered Streams & Annual Fees */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <h2 className="font-bold text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>3. Streams Offered & Approximate Annual Tuition Fee (₹)</span>
              </h2>
              <span className="text-[11px] text-slate-500">Select all that apply</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {selectedStreams.map(s => (
                <div
                  key={s.streamName}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    s.enabled
                      ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800/80 shadow-xs'
                      : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-850 opacity-70'
                  }`}
                >
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={s.enabled}
                      onChange={() => toggleStream(s.streamName)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{s.streamName}</span>
                  </label>

                  {s.enabled && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-slate-400 text-[10px]">₹/yr</span>
                      <input
                        type="number"
                        value={s.annualFee}
                        onChange={(e) => handleStreamFeeChange(s.streamName, e.target.value)}
                        className="w-24 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-purple-500 text-right"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Facilities Available */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
            <h2 className="font-bold text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>4. Campus Facilities</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
              {[
                { key: 'hasHostel', label: 'Hostel' },
                { key: 'hasTransport', label: 'College Bus' },
                { key: 'hasLibrary', label: 'Library' },
                { key: 'hasLabs', label: 'Science Labs' },
                { key: 'hasWifi', label: 'Wi-Fi' },
                { key: 'hasSports', label: 'Sports / Ground' },
                { key: 'hasSmartClassroom', label: 'Smart Class' },
                { key: 'hasCctv', label: 'CCTV Security' },
                { key: 'hasComputerLabs', label: 'Computer Lab' },
                { key: 'hasCafeteria', label: 'Canteen' }
              ].map(fac => (
                <label
                  key={fac.key}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer select-none transition ${
                    form[fac.key]
                      ? 'bg-indigo-50/60 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    name={fac.key}
                    checked={form[fac.key]}
                    onChange={handleInputChange}
                    className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <span>{fac.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Section 5: Volunteer Contributor Details & Recognition */}
          <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 shadow-xs">
            <h2 className="font-bold text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>5. Volunteer Contributor Details & Recognition</span>
            </h2>

            <div className="space-y-4 text-xs">
              {/* Volunteer Contact & Identity Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50/70 via-indigo-50/40 to-purple-50/70 dark:from-purple-950/30 dark:via-indigo-950/20 dark:to-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-3">
                <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Volunteer Scout Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      Volunteer Full Name
                    </label>
                    <input
                      type="text"
                      name="volunteerName"
                      value={form.volunteerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Kumar"
                      className="block w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 text-xs sm:text-sm transition"
                    />
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Account: {user?.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>
                        Volunteer Mobile Number <span className="text-red-500">*</span>
                      </span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
                        Required
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="tel"
                        name="volunteerMobile"
                        required
                        maxLength={10}
                        value={form.volunteerMobile}
                        onChange={handleInputChange}
                        placeholder="e.g. 9848012345"
                        className="block w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 text-xs sm:text-sm font-mono transition"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Mandatory for Admin verification only. Kept strictly confidential and never displayed on public college profiles or directories (only your name is credited).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/60 space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="publicAttribution"
                    checked={form.publicAttribution}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
                    Display my name as the Community Contributor once verified
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
                  When enabled, this college profile will publicly display: <span className="text-purple-600 dark:text-purple-300 font-semibold">“🤝 Community Contributed by {form.volunteerName?.trim() || user?.name || 'You'} · Verified by Super Admin”</span>.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Field Notes / Campus Review (Optional)
                </label>
                <textarea
                  name="fieldNotes"
                  rows="3"
                  value={form.fieldNotes}
                  onChange={handleInputChange}
                  placeholder="Share any special insights for Class 10 students (e.g. good faculty for MPC, bus routes from Mehdipatnam, fee concessions for high scorers, etc.)"
                  className="block w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-500 text-xs sm:text-sm transition"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-purple-500/20 transition cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? 'Submitting to Admin Queue...' : 'Submit College for Admin Verification'}</span>
            </button>

            <Link
              href="/colleges"
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm font-semibold transition text-center cursor-pointer"
            >
              Cancel / Back to Directory
            </Link>
          </div>
        </form>
      )}

    </div>
  );
}
