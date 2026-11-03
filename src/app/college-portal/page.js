'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import {
  Building2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Plus,
  Trash2,
  Save,
  Eye,
  FileText,
  MapPin,
  Phone,
  Mail,
  Globe,
  Sparkles,
  DollarSign,
  Award,
  BookOpen,
  Wifi,
  Bus,
  Home,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  User,
  Lock,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

export default function CollegePortalPage() {
  const { user, login, registerCollege, updateCollegeProfile, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  // Mode for unauthenticated users: 'LOGIN' | 'REGISTER'
  const [authMode, setAuthMode] = useState('REGISTER');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Self Registration Form state
  const [regForm, setRegForm] = useState({
    // Representative
    representativeName: '',
    designation: 'Principal',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    whatsappNumber: '',
    // College
    name: '',
    shortName: '',
    ownership: 'PRIVATE', // GOVERNMENT, PRIVATE, AIDED
    category: 'JUNIOR_COLLEGE', // JUNIOR_COLLEGE, POLYTECHNIC, ITI, VOCATIONAL
    address: '',
    district: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    nearbyLandmark: '',
    website: '',
    affiliation: 'Board of Intermediate Education, Telangana (TSBIE)',
    boardCode: '',
    recognitionDetails: 'Recognized by Govt of Telangana'
  });

  // College Data in Dashboard
  const [collegeData, setCollegeData] = useState(null);
  const [loadingCollege, setLoadingCollege] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [saveStatus, setSaveStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // New Stream / Course Modal / Inline Form
  const [newStream, setNewStream] = useState({
    streamName: 'MPC',
    courseType: 'Intermediate',
    annualFee: 35000,
    admissionFee: 5000,
    otherCharges: 2000,
    minQualification: '10th Class Pass',
    requiredMarks: '60% or Grade B+',
    admissionType: 'DIRECT',
    intakeSeats: 120,
    medium: 'English'
  });

  // New Document Input
  const [newDoc, setNewDoc] = useState({ title: '', type: 'PROSPECTUS', url: '' });

  // New Scholarship Input
  const [newScholarship, setNewScholarship] = useState({ title: '', description: '', eligibility: '' });

  // New Gallery Image Input
  const [galleryInput, setGalleryInput] = useState('');

  // Fetch college profile when logged in
  useEffect(() => {
    async function loadCollege() {
      if (user && user.role === 'COLLEGE_ADMIN' && user.collegeId) {
        setLoadingCollege(true);
        try {
          const docRef = doc(db, 'colleges', String(user.collegeId));
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setCollegeData({ id: snap.id, ...snap.data() });
          } else {
            console.error('College document not found for ID:', user.collegeId);
          }
        } catch (err) {
          console.error('Error fetching college profile:', err);
        } finally {
          setLoadingCollege(false);
        }
      }
    }
    loadCollege();
  }, [user]);

  // Handle Representative Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);
    try {
      const loggedUser = await login(loginEmail, loginPassword);
      if (loggedUser && loggedUser.role !== 'COLLEGE_ADMIN' && loggedUser.role !== 'SUPER_ADMIN') {
        setAuthError('This portal is reserved for College Representatives. Please log in through the Student portal.');
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please verify institutional credentials.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle College Self-Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    if (!regForm.name || !regForm.email || !regForm.phone || !regForm.representativeName) {
      setAuthError('Please fill in all required institutional details');
      return;
    }

    setAuthError('');
    setAuthSubmitting(true);
    try {
      await registerCollege(
        {
          representativeName: regForm.representativeName,
          designation: regForm.designation,
          email: regForm.email,
          password: regForm.password,
          phone: regForm.phone,
          mobileNumber: regForm.whatsappNumber || regForm.phone
        },
        {
          name: regForm.name,
          shortName: regForm.shortName,
          ownership: regForm.ownership,
          category: regForm.category,
          address: regForm.address,
          district: regForm.district,
          state: regForm.state,
          pincode: regForm.pincode,
          nearbyLandmark: regForm.nearbyLandmark,
          website: regForm.website,
          affiliation: regForm.affiliation,
          boardCode: regForm.boardCode,
          recognitionDetails: regForm.recognitionDetails,
          phone: regForm.phone,
          whatsappNumber: regForm.whatsappNumber || regForm.phone
        }
      );
    } catch (err) {
      setAuthError(err.message || 'Failed to register institution. Please try again.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Save changes to Firestore
  const handleSaveCollege = async () => {
    if (!collegeData || !collegeData.id) return;
    setSaving(true);
    setSaveStatus('');
    try {
      await updateCollegeProfile(collegeData.id, collegeData);
      setSaveStatus('Changes saved successfully! Your profile is synchronized.');
      setTimeout(() => setSaveStatus(''), 4000);
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('Error saving profile changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Streams helpers
  const handleAddStream = () => {
    if (!newStream.streamName) return;
    const updatedStreams = [...(collegeData.streams || []), { ...newStream }];
    setCollegeData({ ...collegeData, streams: updatedStreams });
    setNewStream({
      streamName: 'CEC',
      courseType: 'Intermediate',
      annualFee: 30000,
      admissionFee: 4000,
      otherCharges: 1500,
      minQualification: '10th Class Pass',
      requiredMarks: '55% or Grade C',
      admissionType: 'DIRECT',
      intakeSeats: 60,
      medium: 'English'
    });
  };

  const handleRemoveStream = (idxToRemove) => {
    const updatedStreams = collegeData.streams.filter((_, idx) => idx !== idxToRemove);
    setCollegeData({ ...collegeData, streams: updatedStreams });
  };

  // Documents helpers
  const handleAddDoc = () => {
    if (!newDoc.title || !newDoc.url) return;
    const updatedDocs = [...(collegeData.documents || []), { ...newDoc }];
    setCollegeData({ ...collegeData, documents: updatedDocs });
    setNewDoc({ title: '', type: 'PROSPECTUS', url: '' });
  };

  const handleRemoveDoc = (idxToRemove) => {
    const updatedDocs = collegeData.documents.filter((_, idx) => idx !== idxToRemove);
    setCollegeData({ ...collegeData, documents: updatedDocs });
  };

  // Scholarships helpers
  const handleAddScholarship = () => {
    if (!newScholarship.title) return;
    const updated = [...(collegeData.scholarships || []), { ...newScholarship }];
    setCollegeData({ ...collegeData, scholarships: updated });
    setNewScholarship({ title: '', description: '', eligibility: '' });
  };

  const handleRemoveScholarship = (idxToRemove) => {
    const updated = collegeData.scholarships.filter((_, idx) => idx !== idxToRemove);
    setCollegeData({ ...collegeData, scholarships: updated });
  };

  // Gallery helpers
  const handleAddGalleryImage = () => {
    if (!galleryInput) return;
    const updated = [...(collegeData.gallery || []), galleryInput.trim()];
    setCollegeData({ ...collegeData, gallery: updated });
    setGalleryInput('');
  };

  const handleRemoveGalleryImage = (idxToRemove) => {
    const updated = (collegeData.gallery || []).filter((_, idx) => idx !== idxToRemove);
    setCollegeData({ ...collegeData, gallery: updated });
  };

  // Facility toggle helper
  const handleFacilityToggle = (field) => {
    setCollegeData({
      ...collegeData,
      [field]: !collegeData[field]
    });
  };

  // Calculate profile completeness score
  const calculateCompleteness = () => {
    if (!collegeData) return 0;
    let score = 0;
    if (collegeData.name) score += 10;
    if (collegeData.description && collegeData.description.length > 30) score += 10;
    if (collegeData.address && collegeData.phone) score += 10;
    if (collegeData.website) score += 10;
    if (collegeData.logoUrl) score += 10;
    if (collegeData.coverImageUrl) score += 10;
    if (collegeData.streams && collegeData.streams.length > 0) score += 15;
    if (collegeData.hasHostel || collegeData.hasLibrary || collegeData.hasLabs) score += 10;
    if (collegeData.documents && collegeData.documents.length > 0) score += 10;
    if (collegeData.affiliation) score += 5;
    return Math.min(100, score);
  };

  // ==========================================
  // VIEW 1: UNAUTHENTICATED OR NON-COLLEGE ADMIN
  // ==========================================
  if (authLoading || (user && user.role === 'COLLEGE_ADMIN' && loadingCollege)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-400">Loading College Management Portal...</p>
        </div>
      </div>
    );
  }

  // If user is logged in as Super Admin, show shortcut or allow them to view portal
  const isSuperAdmin = user && user.role === 'SUPER_ADMIN';

  if (!user || (user.role !== 'COLLEGE_ADMIN' && !isSuperAdmin)) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 bg-grid-pattern bg-radial-gradient pb-20">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span>Institutional Partner Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-300">
            College Self-Registration & Portal
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            Publish your admission notifications, showcase streams (MPC, BiPC, MEC, CEC, HEC), detail transparent fee structures, and receive direct WhatsApp admission enquiries from 10,000+ Class 10 graduates across Hyderabad.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg mt-6">
            <button
              onClick={() => { setAuthMode('REGISTER'); setAuthError(''); }}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                authMode === 'REGISTER'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Register New Institution
            </button>
            <button
              onClick={() => { setAuthMode('LOGIN'); setAuthError(''); }}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                authMode === 'LOGIN'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              College Sign In
            </button>
          </div>
        </div>

        {/* Auth Container Card */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
            {authError && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* TAB A: REGISTER INSTITUTION */}
            {authMode === 'REGISTER' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-8">
                {/* 1. Authorised Representative Section */}
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-400" />
                      <span>Authorised Representative Credentials</span>
                    </h2>
                    <p className="text-xs text-slate-400">Principal, Director, or College Admissions In-charge.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Representative Full Name *</label>
                      <input
                        type="text"
                        required
                        value={regForm.representativeName}
                        onChange={(e) => setRegForm({ ...regForm, representativeName: e.target.value })}
                        placeholder="Dr. K. Ramesh"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Designation / Role *</label>
                      <input
                        type="text"
                        required
                        value={regForm.designation}
                        onChange={(e) => setRegForm({ ...regForm, designation: e.target.value })}
                        placeholder="Principal / Admissions Director"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Official Institutional Email *</label>
                      <input
                        type="email"
                        required
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        placeholder="admissions@college.edu.in"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile / Admissions Phone *</label>
                      <input
                        type="tel"
                        required
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Admissions Number *</label>
                      <input
                        type="tel"
                        value={regForm.whatsappNumber}
                        onChange={(e) => setRegForm({ ...regForm, whatsappNumber: e.target.value })}
                        placeholder="+91 98765 43210 (For student direct chat)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Official Website URL</label>
                      <input
                        type="url"
                        value={regForm.website}
                        onChange={(e) => setRegForm({ ...regForm, website: e.target.value })}
                        placeholder="https://www.college.edu.in"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Portal Password *</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="At least 6 characters"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        value={regForm.confirmPassword}
                        onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                        placeholder="Repeat your password"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. College Institutional Details */}
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-2">
                    <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span>College Registration & Institutional Details</span>
                    </h2>
                    <p className="text-xs text-slate-400">Institutional credentials verified by Career Compass Super Admin.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Full College / Institution Name *</label>
                      <input
                        type="text"
                        required
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        placeholder="e.g., St. Joseph Junior College, Falaknuma"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">College Ownership Type *</label>
                      <select
                        value={regForm.ownership}
                        onChange={(e) => setRegForm({ ...regForm, ownership: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                      >
                        <option value="PRIVATE">Private (Un-aided)</option>
                        <option value="GOVERNMENT">Government Institution</option>
                        <option value="AIDED">Private Aided</option>
                        <option value="AUTONOMOUS">Autonomous College</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Category *</label>
                      <select
                        value={regForm.category}
                        onChange={(e) => setRegForm({ ...regForm, category: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                      >
                        <option value="JUNIOR_COLLEGE">Junior College (Intermediate)</option>
                        <option value="POLYTECHNIC">Polytechnic (3-Yr Diploma)</option>
                        <option value="ITI">ITI Trade Institute</option>
                        <option value="VOCATIONAL">Vocational & Skill Academy</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Address & Location *</label>
                      <input
                        type="text"
                        required
                        value={regForm.address}
                        onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                        placeholder="Plot No., Street, Area (e.g., Falaknuma, Charminar, Hyderabad)"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">District / City *</label>
                      <input
                        type="text"
                        required
                        value={regForm.district}
                        onChange={(e) => setRegForm({ ...regForm, district: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Nearby Landmark</label>
                      <input
                        type="text"
                        value={regForm.nearbyLandmark}
                        onChange={(e) => setRegForm({ ...regForm, nearbyLandmark: e.target.value })}
                        placeholder="Opp. Falaknuma Palace Gate"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Affiliation / Board Details *</label>
                      <input
                        type="text"
                        required
                        value={regForm.affiliation}
                        onChange={(e) => setRegForm({ ...regForm, affiliation: e.target.value })}
                        placeholder="e.g., TSBIE, SBTET, AICTE"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Board / College Code</label>
                      <input
                        type="text"
                        value={regForm.boardCode}
                        onChange={(e) => setRegForm({ ...regForm, boardCode: e.target.value })}
                        placeholder="e.g., TSBIE-HYD-5022"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {authSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting Institutional Application...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Register Institution & Enter Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-slate-500 mt-3">
                    By registering, you certify that you are an authorised representative of this institution. Super Admin verifies all listings prior to public student indexing.
                  </p>
                </div>
              </form>
            )}

            {/* TAB B: SIGN IN */}
            {authMode === 'LOGIN' && (
              <form onSubmit={handleLoginSubmit} className="space-y-6 max-w-md mx-auto py-4">
                <div className="text-center space-y-1 pb-2">
                  <h2 className="text-xl font-bold text-slate-100">College Representative Sign In</h2>
                  <p className="text-xs text-slate-400">Access your institution dashboard to manage profile and admissions.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Institutional Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="admissions@college.edu.in"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {authSubmitting ? 'Signing In...' : 'Sign In to College Dashboard'}
                </button>
              </form>
            )}
          </div>

          {/* Overview of what colleges can manage */}
          <div className="mt-12 space-y-4">
            <h3 className="text-center text-xs font-extrabold uppercase tracking-widest text-slate-400">
              What Colleges Manage Inside the Dashboard
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { label: 'Basic Profile', desc: 'Name, address, photos, website' },
                { label: 'Streams', desc: 'MPC, BiPC, MEC, CEC, HEC' },
                { label: 'Courses', desc: 'Intermediate, Vocational, Diploma' },
                { label: 'Fees Structure', desc: 'Tuition, admission & lab fees' },
                { label: 'Eligibility', desc: 'Required marks & cutoffs' },
                { label: 'Facilities', desc: 'Hostel, transport, labs, library' },
                { label: 'Direct WhatsApp', desc: 'Instant student admission leads' },
                { label: 'Documents', desc: 'Prospectus & brochures download' }
              ].map((feat, i) => (
                <div key={i} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 space-y-1">
                  <p className="font-bold text-slate-200">{feat.label}</p>
                  <p className="text-[11px] text-slate-400">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: LOGGED IN COLLEGE DASHBOARD
  // ==========================================
  if (!collegeData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <Building2 className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-bold text-slate-200">College Profile Linked to Account Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 max-w-md">
          Please contact Super Admin or register your college profile from the registration tab.
        </p>
        <button
          onClick={logout}
          className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    );
  }

  const completeness = calculateCompleteness();
  const isApproved = collegeData.status === 'APPROVED' || collegeData.isApproved;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20">
      {/* Top Institutional Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-100 leading-tight">
                  {collegeData.name}
                </h1>
                {isApproved ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified & Live</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Clock className="w-3 h-3" />
                    <span>Pending Super Admin Verification</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Representative: <span className="text-slate-300 font-medium">{collegeData.principalName || user.name}</span> ({collegeData.principalDesignation || user.designation || 'Principal'})
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setPreviewOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Preview as Student</span>
            </button>

            <button
              onClick={handleSaveCollege}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>

        {/* Verification Status Notification Bar */}
        {!isApproved ? (
          <div className="bg-amber-500/10 border-t border-amber-500/20 px-4 sm:px-6 py-2.5 text-xs text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0 text-amber-400" />
              <span>
                <strong>Institutional Status: Verification Pending.</strong> Your profile has been submitted and is in queue with Super Admin. You can continue updating your streams, fees, documents, and facilities.
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border-t border-emerald-500/20 px-4 sm:px-6 py-2 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                <strong>Your institution is Live!</strong> Students can view your profile, explore streams, download brochures, and contact your WhatsApp helpline.
              </span>
            </div>
            <Link
              href={`/colleges/${collegeData.id}`}
              className="underline text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] flex items-center gap-1"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Save feedback banner */}
        {saveStatus && (
          <div className="bg-indigo-500/20 border-t border-indigo-500/30 px-4 py-2 text-xs text-indigo-200 text-center font-medium animate-fade-in">
            {saveStatus}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl scrollbar-none">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Layers },
            { id: 'profile', label: 'Basic Profile', icon: Building2 },
            { id: 'streams', label: 'Streams & Courses', icon: GraduationCap },
            { id: 'fees', label: 'Fees Structure', icon: DollarSign },
            { id: 'eligibility', label: 'Eligibility & Criteria', icon: Award },
            { id: 'facilities', label: 'Campus Facilities', icon: Wifi },
            { id: 'contact', label: 'Contact & Helpline', icon: Phone },
            { id: 'admissions', label: 'Admissions & Dates', icon: BookOpen },
            { id: 'scholarships', label: 'Scholarships', icon: Sparkles },
            { id: 'documents', label: 'Documents & Brochures', icon: FileText },
            { id: 'gallery', label: 'Campus Photos', icon: Upload }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                <p className="text-xs text-slate-400 font-semibold uppercase">Profile Completeness</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-indigo-400">{completeness}%</span>
                  <span className="text-xs text-slate-500">{completeness === 100 ? 'Ready' : 'Incomplete'}</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completeness}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                <p className="text-xs text-slate-400 font-semibold uppercase">Streams Offered</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-slate-100">
                    {collegeData.streams ? collegeData.streams.length : 0}
                  </span>
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-[11px] text-slate-500">
                  {collegeData.streams?.map((s) => s.streamName).join(', ') || 'None added'}
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                <p className="text-xs text-slate-400 font-semibold uppercase">Active Documents</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-slate-100">
                    {collegeData.documents ? collegeData.documents.length : 0}
                  </span>
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-[11px] text-slate-500">Prospectus, fee circulars</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                <p className="text-xs text-slate-400 font-semibold uppercase">Verification Status</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-extrabold ${isApproved ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isApproved ? 'Approved & Live' : 'Under Review'}
                  </span>
                  {isApproved ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5 text-amber-400" />}
                </div>
                <p className="text-[11px] text-slate-500">Super Admin control center</p>
              </div>
            </div>

            {/* Quick Checklist */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-200">Management Setup Checklist</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    title: 'Institutional Profile Details',
                    done: !!(collegeData.name && collegeData.address && collegeData.phone),
                    tab: 'profile'
                  },
                  {
                    title: 'Intermediate Streams (MPC, BiPC, CEC, etc.)',
                    done: collegeData.streams && collegeData.streams.length > 0,
                    tab: 'streams'
                  },
                  {
                    title: 'Transparent Fees Breakdown',
                    done: collegeData.streams?.some((s) => s.annualFee > 0),
                    tab: 'fees'
                  },
                  {
                    title: 'Campus Facilities (Hostel, Transport, Labs)',
                    done: !!(collegeData.hasHostel || collegeData.hasLibrary || collegeData.hasLabs),
                    tab: 'facilities'
                  },
                  {
                    title: 'Admissions WhatsApp Helpline',
                    done: !!collegeData.whatsappNumber,
                    tab: 'contact'
                  },
                  {
                    title: 'Prospectus or Brochure Document',
                    done: collegeData.documents && collegeData.documents.length > 0,
                    tab: 'documents'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveTab(item.tab)}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 cursor-pointer transition"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0"></div>
                      )}
                      <span className={item.done ? 'text-slate-200 font-medium' : 'text-slate-400'}>{item.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BASIC PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Basic Profile & Institutional Identity</span>
              </h2>
              <p className="text-xs text-slate-400">Institutional names, photos, website, and principal information.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">College Full Name</label>
                <input
                  type="text"
                  value={collegeData.name || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ownership Type</label>
                <select
                  value={collegeData.ownership || 'PRIVATE'}
                  onChange={(e) => setCollegeData({ ...collegeData, ownership: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="PRIVATE">Private (Un-aided)</option>
                  <option value="GOVERNMENT">Government Institution</option>
                  <option value="AIDED">Private Aided</option>
                  <option value="AUTONOMOUS">Autonomous College</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Established Year</label>
                <input
                  type="number"
                  value={collegeData.establishedYear || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, establishedYear: parseInt(e.target.value) || '' })}
                  placeholder="2005"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Description & Highlights</label>
                <textarea
                  rows={4}
                  value={collegeData.description || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, description: e.target.value })}
                  placeholder="Provide an engaging overview of your institution, academic track record, student mentoring, and college culture."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Principal / Head Name</label>
                <input
                  type="text"
                  value={collegeData.principalName || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, principalName: e.target.value })}
                  placeholder="Dr. K. Ramesh"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Principal Designation</label>
                <input
                  type="text"
                  value={collegeData.principalDesignation || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, principalDesignation: e.target.value })}
                  placeholder="Principal & Academic Director"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Principal's Welcome Message to Class 10 Students</label>
                <textarea
                  rows={2}
                  value={collegeData.principalMessage || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, principalMessage: e.target.value })}
                  placeholder="Inspiring quote or message from the Principal to prospective applicants."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Campus Full Address</label>
                <input
                  type="text"
                  value={collegeData.address || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">District / City</label>
                <input
                  type="text"
                  value={collegeData.district || 'Hyderabad'}
                  onChange={(e) => setCollegeData({ ...collegeData, district: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nearby Landmark</label>
                <input
                  type="text"
                  value={collegeData.nearbyLandmark || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, nearbyLandmark: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">College Logo Image URL</label>
                <input
                  type="url"
                  value={collegeData.logoUrl || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, logoUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Banner Image URL</label>
                <input
                  type="url"
                  value={collegeData.coverImageUrl || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, coverImageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Website</label>
                <input
                  type="url"
                  value={collegeData.website || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, website: e.target.value })}
                  placeholder="https://www.college.edu.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Affiliation & Board Recognition</label>
                <input
                  type="text"
                  value={collegeData.affiliation || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, affiliation: e.target.value })}
                  placeholder="TSBIE / SBTET / AICTE"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STREAMS & COURSES */}
        {activeTab === 'streams' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                    <span>Manage Streams & Offered Courses</span>
                  </h2>
                  <p className="text-xs text-slate-400">Intermediate Streams (MPC, BiPC, MEC, CEC, HEC), Vocational & Diplomas.</p>
                </div>
              </div>

              {/* Streams Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collegeData.streams?.map((s, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-100 text-base">{s.streamName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {s.courseType || 'Intermediate'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Medium: {s.medium || 'English'} • Intake: {s.intakeSeats || 120} seats</p>
                      </div>
                      <button
                        onClick={() => handleRemoveStream(idx)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-slate-900 transition cursor-pointer"
                        title="Delete Stream"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-slate-900/60 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Annual Fee</span>
                        <span className="font-bold text-emerald-400">₹{Number(s.annualFee || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Admission Fee</span>
                        <span className="font-bold text-slate-200">₹{Number(s.admissionFee || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Other Charges</span>
                        <span className="font-bold text-slate-400">₹{Number(s.otherCharges || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-1">
                      <p><strong className="text-slate-300">Eligibility:</strong> {s.requiredMarks || 'Pass in SSC'}</p>
                      <p><strong className="text-slate-300">Admission Mode:</strong> {s.admissionType || 'Direct'}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Stream Box */}
              <div className="border border-dashed border-indigo-500/30 rounded-xl p-4 bg-indigo-500/5 space-y-3">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Stream / Course</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Stream Name</label>
                    <select
                      value={newStream.streamName}
                      onChange={(e) => setNewStream({ ...newStream, streamName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    >
                      <option value="MPC">MPC (Maths, Physics, Chem)</option>
                      <option value="BiPC">BiPC (Biology, Physics, Chem)</option>
                      <option value="MEC">MEC (Maths, Economics, Comm)</option>
                      <option value="CEC">CEC (Civics, Econ, Comm)</option>
                      <option value="HEC">HEC (History, Econ, Civics)</option>
                      <option value="MBiPC">MBiPC (Maths, Bio, Phys, Chem)</option>
                      <option value="Polytechnic Diploma">Polytechnic Diploma</option>
                      <option value="Vocational ITI">Vocational / ITI Trade</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Annual Tuition (₹)</label>
                    <input
                      type="number"
                      value={newStream.annualFee}
                      onChange={(e) => setNewStream({ ...newStream, annualFee: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Admission Fee (₹)</label>
                    <input
                      type="number"
                      value={newStream.admissionFee}
                      onChange={(e) => setNewStream({ ...newStream, admissionFee: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Intake Seats</label>
                    <input
                      type="number"
                      value={newStream.intakeSeats}
                      onChange={(e) => setNewStream({ ...newStream, intakeSeats: parseInt(e.target.value) || 60 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddStream}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Stream to Profile</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FEES STRUCTURE */}
        {activeTab === 'fees' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Fees Structure & Payment Guidelines</span>
              </h2>
              <p className="text-xs text-slate-400">Detailed fee breakdown, hostel charges, and installment terms.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 font-semibold">Stream</th>
                    <th className="py-2.5 font-semibold">Tuition Fee / Year</th>
                    <th className="py-2.5 font-semibold">Admission (One-Time)</th>
                    <th className="py-2.5 font-semibold">Lab & Other</th>
                    <th className="py-2.5 font-semibold">Total Estimated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {collegeData.streams?.map((s, idx) => {
                    const total = (Number(s.annualFee) || 0) + (Number(s.admissionFee) || 0) + (Number(s.otherCharges) || 0);
                    return (
                      <tr key={idx} className="hover:bg-slate-950/40">
                        <td className="py-3 font-bold text-slate-200">{s.streamName}</td>
                        <td className="py-3 text-emerald-400 font-semibold">₹{Number(s.annualFee || 0).toLocaleString('en-IN')}</td>
                        <td className="py-3 text-slate-300">₹{Number(s.admissionFee || 0).toLocaleString('en-IN')}</td>
                        <td className="py-3 text-slate-400">₹{Number(s.otherCharges || 0).toLocaleString('en-IN')}</td>
                        <td className="py-3 font-extrabold text-indigo-400">₹{total.toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-200">Hostel & Additional Fee Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hostel & Mess Fee (₹/Year if available)</label>
                  <input
                    type="number"
                    value={collegeData.hostelFee || ''}
                    onChange={(e) => setCollegeData({ ...collegeData, hostelFee: parseInt(e.target.value) || 0 })}
                    placeholder="e.g. 60000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Installments Allowed</label>
                  <input
                    type="text"
                    value={collegeData.feePaymentTerms || ''}
                    onChange={(e) => setCollegeData({ ...collegeData, feePaymentTerms: e.target.value })}
                    placeholder="e.g. 2 or 3 installments accepted; 10% waiver on single lump-sum payment."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ELIGIBILITY & CRITERIA */}
        {activeTab === 'eligibility' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Eligibility Marks & Admission Criteria</span>
              </h2>
              <p className="text-xs text-slate-400">Minimum 10th Class GPA, subject requirements, and reservation guidelines.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">General Minimum 10th Marks / GPA</label>
                <input
                  type="text"
                  value={collegeData.minMarksRequired || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, minMarksRequired: e.target.value })}
                  placeholder="e.g., 6.0 GPA (SSC) or 60% (CBSE)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Admission Mode</label>
                <select
                  value={collegeData.primaryAdmissionMode || 'DIRECT'}
                  onChange={(e) => setCollegeData({ ...collegeData, primaryAdmissionMode: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="DIRECT">Direct Admission (First-Come Basis)</option>
                  <option value="MERIT_BASED">Merit-Based (SSC Marks Rank)</option>
                  <option value="TS_POLYCET">TS POLYCET Counselling (Diploma)</option>
                  <option value="DOST">Degree Online Services, Telangana (DOST)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reservation Policy & Quotas</label>
                <textarea
                  rows={3}
                  value={collegeData.reservationPolicy || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, reservationPolicy: e.target.value })}
                  placeholder="Details on SC/ST/BC/EWS quotas, minority status concessions, or sports quota reservations."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FACILITIES */}
        {activeTab === 'facilities' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-indigo-400" />
                <span>Campus Facilities & Infrastructure</span>
              </h2>
              <p className="text-xs text-slate-400">Toggle campus amenities and add specific details for students.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { field: 'hasHostel', label: 'Hostel Facility', detailField: 'hostelDetails', placeholder: 'Separate Boys & Girls hostelling, AC/Non-AC' },
                { field: 'hasTransport', label: 'Transport / Bus Fleet', detailField: 'transportDetails', placeholder: '15 buses covering Kukatpally, Charminar, Uppal' },
                { field: 'hasLabs', label: 'Scientific Laboratories', detailField: 'labsDetails', placeholder: 'Physics, Chemistry, Botany & Zoology Labs' },
                { field: 'hasLibrary', label: 'Central Library', detailField: 'libraryDetails', placeholder: '10,000+ books, study room, reading chairs' },
                { field: 'hasComputerLabs', label: 'Computer Labs', detailField: 'computerLabsDetails', placeholder: '100+ Systems with High-speed Internet' },
                { field: 'hasSports', label: 'Sports & Games', detailField: 'sportsDetails', placeholder: 'Cricket nets, Volleyball court, Chess, Carrom' },
                { field: 'hasPlayground', label: 'Playground Field', detailField: 'playgroundDetails', placeholder: 'Open turf campus ground' },
                { field: 'hasWifi', label: 'Campus Wi-Fi', detailField: 'wifiDetails', placeholder: 'High-speed campus network' },
                { field: 'hasSmartClassroom', label: 'Smart Classrooms', detailField: 'smartClassDetails', placeholder: 'Digital interactive smart projectors' },
                { field: 'hasCctv', label: 'CCTV Security', detailField: 'cctvDetails', placeholder: '24/7 security surveillance' },
                { field: 'hasCafeteria', label: 'Cafeteria / Canteen', detailField: 'cafeteriaDetails', placeholder: 'Hygienic subsidized food' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition ${
                    collegeData[item.field]
                      ? 'bg-indigo-500/10 border-indigo-500/30'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="font-bold text-xs text-slate-200">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={!!collegeData[item.field]}
                      onChange={() => handleFacilityToggle(item.field)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                  {collegeData[item.field] && (
                    <input
                      type="text"
                      value={collegeData[item.detailField] || ''}
                      onChange={(e) => setCollegeData({ ...collegeData, [item.detailField]: e.target.value })}
                      placeholder={item.placeholder}
                      className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-[11px] text-slate-200 placeholder-slate-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CONTACT & HELPLINE */}
        {activeTab === 'contact' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>Admissions Contact & Direct WhatsApp Desk</span>
              </h2>
              <p className="text-xs text-slate-400">Contact information used by students to reach your admissions counsellors.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Admissions Phone Number</label>
                <input
                  type="text"
                  value={collegeData.phone || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official WhatsApp Number (Click-to-Chat)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={collegeData.whatsappNumber || ''}
                    onChange={(e) => setCollegeData({ ...collegeData, whatsappNumber: e.target.value })}
                    placeholder="919876543210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                  />
                  {collegeData.whatsappNumber && (
                    <a
                      href={`https://wa.me/${collegeData.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello, I am interested in admission details at ' + collegeData.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2 top-2 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-md font-semibold"
                    >
                      Test Chat ↗
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email Address</label>
                <input
                  type="email"
                  value={collegeData.email || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admissions Office Timings</label>
                <input
                  type="text"
                  value={collegeData.officeTimings || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, officeTimings: e.target.value })}
                  placeholder="Mon - Sat: 9:00 AM - 5:00 PM"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Google Maps Directions / Link</label>
                <input
                  type="url"
                  value={collegeData.googleMapsUrl || ''}
                  onChange={(e) => setCollegeData({ ...collegeData, googleMapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: ADMISSIONS & DATES */}
        {activeTab === 'admissions' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Admissions Schedule & Application Procedure</span>
              </h2>
              <p className="text-xs text-slate-400">Application deadlines, counselling dates, and step-by-step guidance.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Year</label>
                <input
                  type="text"
                  value={collegeData.admissions?.academicYear || '2026-2027'}
                  onChange={(e) => setCollegeData({
                    ...collegeData,
                    admissions: { ...(collegeData.admissions || {}), academicYear: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Application Start Date</label>
                <input
                  type="date"
                  value={collegeData.admissions?.applicationStartDate || ''}
                  onChange={(e) => setCollegeData({
                    ...collegeData,
                    admissions: { ...(collegeData.admissions || {}), applicationStartDate: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Application Last Date</label>
                <input
                  type="date"
                  value={collegeData.admissions?.applicationEndDate || ''}
                  onChange={(e) => setCollegeData({
                    ...collegeData,
                    admissions: { ...(collegeData.admissions || {}), applicationEndDate: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Classes Start Date</label>
                <input
                  type="date"
                  value={collegeData.admissions?.classesStartDate || ''}
                  onChange={(e) => setCollegeData({
                    ...collegeData,
                    admissions: { ...(collegeData.admissions || {}), classesStartDate: e.target.value }
                  })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Direct Online Application URL / Form Link</label>
                <input
                  type="url"
                  value={collegeData.admissions?.applicationLink || ''}
                  onChange={(e) => setCollegeData({
                    ...collegeData,
                    admissions: { ...(collegeData.admissions || {}), applicationLink: e.target.value }
                  })}
                  placeholder="https://forms.gle/... or https://college.edu.in/apply"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: SCHOLARSHIPS */}
        {activeTab === 'scholarships' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Available Scholarships & Fee Concessions</span>
              </h2>
              <p className="text-xs text-slate-400">Merit scholarships, TS ePASS reimbursement guidance, sports and economic waivers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collegeData.scholarships?.map((sch, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 relative">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-100 text-xs">{sch.title}</h4>
                    <button
                      onClick={() => handleRemoveScholarship(idx)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">{sch.description}</p>
                  <p className="text-[11px] text-indigo-400 font-medium">Eligibility: {sch.eligibility}</p>
                </div>
              ))}
            </div>

            {/* Add Scholarship */}
            <div className="border border-dashed border-indigo-500/30 rounded-xl p-4 bg-indigo-500/5 space-y-3">
              <h4 className="text-xs font-bold text-indigo-300 uppercase">Add Scholarship / Concession</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Title (e.g. Merit Concession 9.5+ GPA)"
                  value={newScholarship.title}
                  onChange={(e) => setNewScholarship({ ...newScholarship, title: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
                <input
                  type="text"
                  placeholder="Concession description"
                  value={newScholarship.description}
                  onChange={(e) => setNewScholarship({ ...newScholarship, description: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
                <input
                  type="text"
                  placeholder="Eligibility criteria"
                  value={newScholarship.eligibility}
                  onChange={(e) => setNewScholarship({ ...newScholarship, eligibility: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <button
                type="button"
                onClick={handleAddScholarship}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Scholarship</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 10: DOCUMENTS & BROCHURES */}
        {activeTab === 'documents' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Documents, Prospectus & Brochures</span>
              </h2>
              <p className="text-xs text-slate-400">Upload or link official PDF documents for student downloads.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collegeData.documents?.map((docItem, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-200">{docItem.title}</h4>
                      <span className="text-[10px] text-slate-500 uppercase">{docItem.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {docItem.url && (
                      <a
                        href={docItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </a>
                    )}
                    <button
                      onClick={() => handleRemoveDoc(idx)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Document Box */}
            <div className="border border-dashed border-indigo-500/30 rounded-xl p-4 bg-indigo-500/5 space-y-3">
              <h4 className="text-xs font-bold text-indigo-300 uppercase">Add Document Link</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Document Title (e.g. 2026-27 Prospectus)"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
                <select
                  value={newDoc.type}
                  onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                >
                  <option value="PROSPECTUS">Prospectus</option>
                  <option value="FEE_STRUCTURE">Fee Structure Circular</option>
                  <option value="BROCHURE">College Brochure</option>
                  <option value="APPLICATION_FORM">Admission Application Form</option>
                </select>
                <input
                  type="url"
                  placeholder="PDF Download URL"
                  value={newDoc.url}
                  onChange={(e) => setNewDoc({ ...newDoc, url: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                />
              </div>
              <button
                type="button"
                onClick={handleAddDoc}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Attach Document</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 11: CAMPUS GALLERY */}
        {activeTab === 'gallery' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Campus Photo Gallery</span>
              </h2>
              <p className="text-xs text-slate-400">Classrooms, sports grounds, science labs, and campus buildings.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {collegeData.gallery?.map((imgUrl, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video">
                  <img src={imgUrl} alt={`Campus view ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Gallery URL */}
            <div className="flex gap-2">
              <input
                type="url"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                placeholder="Paste Campus Image URL (https://...)"
                className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100"
              />
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Add Image
              </button>
            </div>
          </div>
        )}
      </div>

      {/* STUDENT VIEW PREVIEW MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-slate-100 text-base">Public Student View Preview</h3>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Simulated Banner */}
            <div className="relative h-44 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 overflow-hidden flex items-end p-6 border border-slate-800">
              <div className="space-y-1 relative z-10">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {collegeData.ownership} • {collegeData.category}
                </span>
                <h2 className="text-2xl font-extrabold text-white">{collegeData.name}</h2>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{collegeData.address}</span>
                </p>
              </div>
            </div>

            {/* Streams Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase">Offered Streams & Annual Fees</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {collegeData.streams?.map((s, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-100">{s.streamName}</p>
                      <p className="text-[10px] text-slate-400">Medium: {s.medium || 'English'}</p>
                    </div>
                    <span className="font-extrabold text-emerald-400">₹{Number(s.annualFee || 0).toLocaleString('en-IN')}/yr</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities Badges */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase">Campus Facilities</h4>
              <div className="flex flex-wrap gap-2 text-xs">
                {collegeData.hasHostel && <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-full font-medium">✓ Hostel Available</span>}
                {collegeData.hasTransport && <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-full font-medium">✓ College Buses</span>}
                {collegeData.hasLibrary && <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-full font-medium">✓ Central Library</span>}
                {collegeData.hasLabs && <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-full font-medium">✓ Science Labs</span>}
                {collegeData.hasWifi && <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-full font-medium">✓ Wi-Fi</span>}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
