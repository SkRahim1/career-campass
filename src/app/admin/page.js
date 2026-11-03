'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, CheckSquare, PlusCircle, Bell, UserX, BarChart3, Star, Landmark, Trash2, Heart, Megaphone, Send, HelpCircle, ClipboardList, Download, Eye, X, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  // Metrics state
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Updates state
  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);

  // Survey responses state
  const [surveys, setSurveys] = useState([]);
  const [surveysLoading, setSurveysLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveySearch, setSurveySearch] = useState('');

  // Publish Update Form state
  const [updateForm, setUpdateForm] = useState({
    title: '',
    category: 'INTERMEDIATE',
    content: '',
    isPinned: false
  });
  const [updateMsg, setUpdateMsg] = useState('');

  // Add College Form state
  const [collegeForm, setCollegeForm] = useState({
    name: '',
    ownership: 'PRIVATE',
    category: 'JUNIOR_COLLEGE',
    establishedYear: '',
    description: '',
    address: '',
    nearbyLandmark: '',
    phone: '',
    email: '',
    website: '',
    genderType: 'CO_ED',
    hasHostel: false,
    hasTransport: false,
    hasLibrary: false,
    hasLabs: false,
    hasSports: false,
    hasPlayground: false,
    hasWifi: false,
    hasSmartClassroom: false,
    hasCctv: false,
    hasComputerLabs: false,
    hasCafeteria: false
  });
  const [streamsList, setStreamsList] = useState([
    { streamName: 'MPC', annualFee: '35000', minQualification: '10th Class', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: '' }
  ]);
  const [collegeMsg, setCollegeMsg] = useState('');

  useEffect(() => {
    if (user && user.role === 'SUPER_ADMIN') {
      fetchMetrics();
      fetchReviews();
      fetchUpdates();
      fetchSurveys();
    }
  }, [user]);

  const fetchSurveys = async () => {
    setSurveysLoading(true);
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const snap = await getDocs(collection(db, 'surveys'));
      const list = [];
      snap.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      list.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
      setSurveys(list);
    } catch (err) {
      console.error('Error fetching surveys:', err);
    } finally {
      setSurveysLoading(false);
    }
  };

  const exportSurveysToCSV = () => {
    if (surveys.length === 0) return;
    const headers = [
      'Submission Date',
      'Full Name',
      'School Name',
      'Class & Section',
      'Mobile Number',
      'Location / Area',
      'Career Goal',
      'Career Reason',
      'Influenced By',
      'Favorite Subjects',
      'Clear Goal?',
      'Path After 10th',
      'Intermediate Stream',
      'Stream Reason',
      'Career Opps Awareness',
      'Heard Entrance Exams?',
      'Exams Known',
      'Planning Entrance Exam?',
      'Need Exam Guidance?',
      'Colleges Awareness',
      'College Type Pref',
      'Study Location Pref',
      'Annual Budget',
      'Govt Scholarship Interest',
      'Guidance Areas',
      'Biggest Concern / Confusion'
    ];

    const rows = surveys.map(s => [
      s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '',
      `"${(s.q1_fullName || '').replace(/"/g, '""')}"`,
      `"${(s.q2_schoolName || '').replace(/"/g, '""')}"`,
      `"${(s.q3_classSection || '').replace(/"/g, '""')}"`,
      `"${(s.q4_mobileNumber || '').replace(/"/g, '""')}"`,
      `"${(s.q5_location || '').replace(/"/g, '""')}"`,
      `"${(s.q6_careerGoal || '').replace(/"/g, '""')}"`,
      `"${(s.q7_careerReason || '').replace(/"/g, '""')}"`,
      `"${(s.q8_decisionInfluence || '').replace(/"/g, '""')}"`,
      `"${(s.q9_enjoyedSubjects || '').replace(/"/g, '""')}"`,
      `"${(s.q10_clearCareerGoal || '').replace(/"/g, '""')}"`,
      `"${(s.q11_pathAfter10th || '').replace(/"/g, '""')}"`,
      `"${(s.q12_intermediateStream || '').replace(/"/g, '""')}"`,
      `"${(s.q13_streamReason || '').replace(/"/g, '""')}"`,
      `"${(s.q14_streamOpportunitiesAwareness || '').replace(/"/g, '""')}"`,
      `"${(s.q15_entranceExamsAwareness || '').replace(/"/g, '""')}"`,
      `"${(s.q16_entranceExamsKnown || '').replace(/"/g, '""')}"`,
      `"${(s.q17_planningEntranceExam || '').replace(/"/g, '""')}"`,
      `"${(s.q18_needExamGuidance || '').replace(/"/g, '""')}"`,
      `"${(s.q19_collegesAwareness || '').replace(/"/g, '""')}"`,
      `"${(s.q20_collegeTypePreference || '').replace(/"/g, '""')}"`,
      `"${(s.q21_studyLocationPreference || '').replace(/"/g, '""')}"`,
      `"${(s.q22_annualBudget || '').replace(/"/g, '""')}"`,
      `"${(s.q23_govtScholarshipInfoInterest || '').replace(/"/g, '""')}"`,
      `"${((s.q24_guidanceAreas || []).join('; ')).replace(/"/g, '""')}"`,
      `"${(s.q25_biggestConfusion || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `career_compass_365_student_surveys_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchMetrics = async () => {
    setMetricsLoading(true);
    try {
      const { collection, getDocs, query, where } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      const collegesSnap = await getDocs(collection(db, 'colleges'));
      const reviewsSnap = await getDocs(collection(db, 'reviews'));
      const usersSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'STUDENT')));
      const surveysSnap = await getDocs(collection(db, 'surveys'));

      const totalColleges = collegesSnap.size;
      const totalReviews = reviewsSnap.size;
      const totalStudents = usersSnap.size;
      const totalSurveys = surveysSnap.size;

      // Calculate bookmark counts
      const bookmarkCounts = {};
      usersSnap.forEach((doc) => {
        const saved = doc.data().savedColleges || [];
        saved.forEach(id => {
          bookmarkCounts[id] = (bookmarkCounts[id] || 0) + 1;
        });
      });

      const collegesList = [];
      collegesSnap.forEach((doc) => {
        collegesList.push({ id: doc.id, ...doc.data() });
      });

      const mostSavedColleges = Object.keys(bookmarkCounts)
        .map(id => {
          const col = collegesList.find(c => String(c.id) === String(id));
          return {
            name: col ? col.name : `College #${id}`,
            count: bookmarkCounts[id]
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate highest rated
      const collegeRatings = {};
      reviewsSnap.forEach((doc) => {
        const r = doc.data();
        if (r.isApproved) {
          if (!collegeRatings[r.collegeId]) {
            collegeRatings[r.collegeId] = { sum: 0, count: 0 };
          }
          collegeRatings[r.collegeId].sum += r.rating;
          collegeRatings[r.collegeId].count += 1;
        }
      });

      const topRatedColleges = Object.keys(collegeRatings)
        .map(id => {
          const col = collegesList.find(c => String(c.id) === String(id));
          const avg = collegeRatings[id].sum / collegeRatings[id].count;
          return {
            name: col ? col.name : `College #${id}`,
            rating: avg.toFixed(1),
            reviewsCount: collegeRatings[id].count
          };
        })
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

      setMetrics({
        totalColleges,
        totalReviews,
        totalStudents,
        totalSurveys,
        mostSavedColleges,
        topRatedColleges
      });
    } catch (err) {
      console.error('Error fetching admin metrics:', err);
    } finally {
      setMetricsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const reviewsSnap = await getDocs(collection(db, 'reviews'));
      const collegesSnap = await getDocs(collection(db, 'colleges'));

      const cols = {};
      collegesSnap.forEach((doc) => {
        cols[doc.id] = doc.data().name;
      });

      const list = [];
      reviewsSnap.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          ...data,
          college: { name: cols[String(data.collegeId)] || `College #${data.collegeId}` },
          user: { name: data.userName, email: 'Student Account' }
        });
      });
      setReviews(list);
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchUpdates = async () => {
    setUpdatesLoading(true);
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const updatesSnap = await getDocs(collection(db, 'admission-updates'));
      const list = [];
      updatesSnap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setUpdates(list);
    } catch (err) {
      console.error('Error fetching admission updates:', err);
    } finally {
      setUpdatesLoading(false);
    }
  };

  // Moderation Handlers
  const handleApproveReview = async (reviewId) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await updateDoc(doc(db, 'reviews', reviewId), { isApproved: true });
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isApproved: true } : r));
      fetchMetrics();
    } catch (err) {
      console.error('Error approving review:', err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await deleteDoc(doc(db, 'reviews', reviewId));
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      fetchMetrics();
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  // Publish Update Handlers
  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePublishUpdate = async (e) => {
    e.preventDefault();
    setUpdateMsg('');
    try {
      const { collection, addDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      const newUpdate = {
        title: updateForm.title,
        category: updateForm.category,
        content: updateForm.content,
        isPinned: !!updateForm.isPinned,
        publishedDate: new Date().toISOString()
      };
      await addDoc(collection(db, 'admission-updates'), newUpdate);

      setUpdateMsg('Admission update published successfully!');
      setUpdateForm({ title: '', category: 'INTERMEDIATE', content: '', isPinned: false });
      fetchUpdates();
    } catch (err) {
      console.error('Error publishing update:', err);
      setUpdateMsg(`Error: ${err.message}`);
    }
  };

  const handleDeleteUpdate = async (updateId) => {
    if (!confirm('Are you sure you want to delete this update?')) return;
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await deleteDoc(doc(db, 'admission-updates', updateId));
      setUpdates(prev => prev.filter(u => u.id !== updateId));
    } catch (err) {
      console.error('Error deleting update:', err);
    }
  };

  // Add College Handlers
  const handleCollegeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCollegeForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStreamChange = (index, field, value) => {
    setStreamsList(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addStreamField = () => {
    setStreamsList(prev => [
      ...prev,
      { streamName: 'MPC', annualFee: '35000', minQualification: '10th Class', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: '' }
    ]);
  };

  const removeStreamField = (index) => {
    if (streamsList.length <= 1) return;
    setStreamsList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    setCollegeMsg('');
    try {
      const { collection, getDocs, doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      // Get next numeric ID
      const collegesSnap = await getDocs(collection(db, 'colleges'));
      let maxId = 0;
      collegesSnap.forEach((doc) => {
        const idNum = parseInt(doc.id);
        if (!isNaN(idNum) && idNum > maxId) maxId = idNum;
      });
      const nextId = maxId + 1;

      const payload = {
        id: nextId,
        ...collegeForm,
        establishedYear: collegeForm.establishedYear ? parseInt(collegeForm.establishedYear) : null,
        streams: streamsList.map(s => ({
          streamName: s.streamName,
          annualFee: parseFloat(s.annualFee),
          minQualification: s.minQualification,
          requiredMarks: s.requiredMarks,
          admissionType: s.admissionType,
          reservationInfo: s.reservationInfo
        })),
        gallery: [
          'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80'
        ],
        averageRating: 4.0,
        totalReviews: 0
      };

      await setDoc(doc(db, 'colleges', String(nextId)), payload);

      setCollegeMsg('College profile created successfully!');
      setCollegeForm({
        name: '', ownership: 'PRIVATE', category: 'JUNIOR_COLLEGE', establishedYear: '',
        description: '', address: '', nearbyLandmark: '', phone: '', email: '', website: '',
        genderType: 'CO_ED', hasHostel: false, hasTransport: false, hasLibrary: false,
        hasLabs: false, hasSports: false, hasPlayground: false, hasWifi: false,
        hasSmartClassroom: false, hasCctv: false, hasComputerLabs: false, hasCafeteria: false
      });
      setStreamsList([{ streamName: 'MPC', annualFee: '35000', minQualification: '10th Class', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: '' }]);
      fetchMetrics();
    } catch (err) {
      console.error('Error creating college profile:', err);
      setCollegeMsg(`Error: ${err.message}`);
    }
  };

  if (authLoading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-950 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex-grow bg-slate-950 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] bg-radial-gradient">
        <UserX className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-2xl font-bold text-slate-200">Access Denied</h2>
        <p className="text-slate-500 max-w-sm mt-2 mb-6">You do not have the credentials to view the administrator controls panel.</p>
        <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition">
          Log In as Admin
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'analytics', label: 'Dashboard Stats', icon: BarChart3 },
    { id: 'surveys', label: `Survey Responses (${surveys.length})`, icon: ClipboardList },
    { id: 'reviews', label: 'Review Moderation', icon: CheckSquare },
    { id: 'updates', label: 'Admission updates', icon: Bell },
    { id: 'add-college', label: 'Add New College', icon: PlusCircle }
  ];

  return (
    <div className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10 bg-radial-gradient bg-grid-pattern flex-grow text-left">
      
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-extrabold text-slate-100 font-display">Super Admin Dashboard</h1>
        </div>
        <p className="text-slate-400 text-sm">
          Publish admission announcements, moderate student reviews, review analytical metrics, and expand directories.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-900 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Control Tab Panels */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md">
        
        {/* Tab 1: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-4">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span>Application KPIs</span>
            </h2>

            {metricsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : !metrics ? (
              <p className="text-slate-500 text-xs">Error loading metrics data.</p>
            ) : (
              <div className="space-y-8">
                {/* Visual Counters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center space-y-1.5">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide">Colleges Listed</span>
                    <p className="text-slate-200 text-2xl sm:text-3xl font-extrabold">{metrics.totalColleges}</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center space-y-1.5">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide">Registered Students</span>
                    <p className="text-slate-200 text-2xl sm:text-3xl font-extrabold">{metrics.totalStudents}</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center space-y-1.5">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide">Survey Responses</span>
                    <p className="text-purple-400 text-2xl sm:text-3xl font-extrabold">{metrics.totalSurveys ?? 0}</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center space-y-1.5">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide">Total Reviews</span>
                    <p className="text-slate-200 text-2xl sm:text-3xl font-extrabold">{metrics.totalReviews}</p>
                  </div>
                </div>

                {/* Popular lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  {/* Saved Ranking */}
                  <div className="space-y-4">
                    <h3 className="text-slate-100 font-bold text-sm flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-400 fill-current" />
                      <span>Most Bookmarked Colleges</span>
                    </h3>
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 divide-y divide-slate-900/60">
                      {metrics.mostSavedColleges.length === 0 ? (
                        <p className="text-slate-500 text-xs py-4 text-center">No bookmarks recorded yet.</p>
                      ) : (
                        metrics.mostSavedColleges.map((c, idx) => (
                          <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-300">{c.name}</span>
                            <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold">{c.count} saves</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Rating ranking */}
                  <div className="space-y-4">
                    <h3 className="text-slate-100 font-bold text-sm flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>Highest Rated Colleges</span>
                    </h3>
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 divide-y divide-slate-900/60">
                      {metrics.topRatedColleges.length === 0 ? (
                        <p className="text-slate-500 text-xs py-4 text-center">No ratings approved yet.</p>
                      ) : (
                        metrics.topRatedColleges.map((c, idx) => (
                          <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-300">{c.name}</span>
                            <div className="flex items-center gap-1.5 font-bold text-yellow-400">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>{c.rating}</span>
                              <span className="text-slate-500 text-[10px] font-normal">({c.reviewsCount} reviews)</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Survey Responses */}
        {activeTab === 'surveys' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-purple-400" />
                  <span>Class 10 Student Survey Responses</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  View and export all 25-question student career and education survey submissions.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={exportSurveysToCSV}
                  disabled={surveys.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={fetchSurveys}
                  className="bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 font-bold px-3 py-2.5 rounded-xl text-xs transition cursor-pointer"
                  title="Refresh"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {/* Filter / Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <input
                type="text"
                placeholder="Search by student name, school, career, or area..."
                value={surveySearch}
                onChange={(e) => setSurveySearch(e.target.value)}
                className="w-full sm:w-80 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
              />
              <span className="text-xs text-slate-500 font-semibold self-start sm:self-center">
                Total Submissions: <strong className="text-purple-400">{surveys.length}</strong>
              </span>
            </div>

            {surveysLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : surveys.length === 0 ? (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-12 text-center space-y-2">
                <ClipboardList className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-slate-300 font-bold text-sm">No survey responses recorded yet.</p>
                <p className="text-slate-500 text-xs">Share the survey link with 10th-class students to start collecting guidance data.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                      <th className="p-4">Student</th>
                      <th className="p-4">School & Class</th>
                      <th className="p-4">Career Goal</th>
                      <th className="p-4">Preferred Stream</th>
                      <th className="p-4">Annual Budget</th>
                      <th className="p-4">Submitted</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {surveys
                      .filter(s => {
                        if (!surveySearch.trim()) return true;
                        const term = surveySearch.toLowerCase();
                        return (
                          (s.q1_fullName || '').toLowerCase().includes(term) ||
                          (s.q2_schoolName || '').toLowerCase().includes(term) ||
                          (s.q5_location || '').toLowerCase().includes(term) ||
                          (s.q6_careerGoal || '').toLowerCase().includes(term)
                        );
                      })
                      .map((s) => (
                        <tr key={s.id} className="hover:bg-slate-950/20 transition">
                          <td className="p-4">
                            <p className="font-bold text-slate-200">{s.q1_fullName || 'N/A'}</p>
                            <p className="text-[10px] text-slate-500">{s.q5_location || ''} {s.q4_mobileNumber ? `• ${s.q4_mobileNumber}` : ''}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-slate-300">{s.q2_schoolName || 'N/A'}</p>
                            <span className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-bold">
                              {s.q3_classSection || '10th'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                              {s.q6_careerGoal || 'Undecided'}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">
                              {s.q12_intermediateStream || 'N/A'}
                            </span>
                          </td>
                          <td className="p-4 text-slate-300 font-medium">
                            {s.q22_annualBudget || 'N/A'}
                          </td>
                          <td className="p-4 text-slate-500 text-[10px]">
                            {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : 'Recent'}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedSurvey(s)}
                              className="bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold px-3 py-1.5 rounded-lg text-[11px] transition flex items-center gap-1 mx-auto cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View (25 Qs)</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Modal Dialog to View Full 25 Questions */}
            {selectedSurvey && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-left">
                  
                  {/* Modal Header */}
                  <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
                        Class 10 Guidance Profile
                      </span>
                      <h3 className="text-xl font-bold text-slate-100 mt-1">
                        {selectedSurvey.q1_fullName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {selectedSurvey.q2_schoolName} • {selectedSurvey.q3_classSection} • {selectedSurvey.q5_location}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedSurvey(null)}
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Sections Breakdown */}
                  <div className="space-y-6 text-xs text-slate-300">
                    
                    {/* Section 1 */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                      <h4 className="font-bold text-indigo-400 uppercase text-[10px] tracking-wider">Section 1: Student Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-slate-400">
                        <p><strong className="text-slate-200">1. Full Name:</strong> {selectedSurvey.q1_fullName}</p>
                        <p><strong className="text-slate-200">2. School:</strong> {selectedSurvey.q2_schoolName}</p>
                        <p><strong className="text-slate-200">3. Class & Section:</strong> {selectedSurvey.q3_classSection}</p>
                        <p><strong className="text-slate-200">4. Mobile:</strong> {selectedSurvey.q4_mobileNumber || 'Not provided'}</p>
                        <p className="col-span-2"><strong className="text-slate-200">5. Location:</strong> {selectedSurvey.q5_location}</p>
                      </div>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                      <h4 className="font-bold text-indigo-400 uppercase text-[10px] tracking-wider">Section 2: Career Aspirations</h4>
                      <div className="space-y-1.5 text-slate-400">
                        <p><strong className="text-slate-200">6. Future Goal:</strong> <span className="text-purple-300 font-bold">{selectedSurvey.q6_careerGoal}</span></p>
                        <p><strong className="text-slate-200">7. Why interested:</strong> {selectedSurvey.q7_careerReason}</p>
                        <p><strong className="text-slate-200">8. Decision influence:</strong> {selectedSurvey.q8_decisionInfluence}</p>
                        <p><strong className="text-slate-200">9. Enjoyed subjects:</strong> {selectedSurvey.q9_enjoyedSubjects}</p>
                        <p><strong className="text-slate-200">10. Clear goal:</strong> {selectedSurvey.q10_clearCareerGoal}</p>
                      </div>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                      <h4 className="font-bold text-indigo-400 uppercase text-[10px] tracking-wider">Section 3: Education After Class 10</h4>
                      <div className="space-y-1.5 text-slate-400">
                        <p><strong className="text-slate-200">11. Path after 10th:</strong> {selectedSurvey.q11_pathAfter10th}</p>
                        <p><strong className="text-slate-200">12. Preferred stream:</strong> <span className="text-indigo-300 font-bold">{selectedSurvey.q12_intermediateStream}</span></p>
                        <p><strong className="text-slate-200">13. Reason for stream:</strong> {selectedSurvey.q13_streamReason}</p>
                        <p><strong className="text-slate-200">14. Opportunities awareness:</strong> {selectedSurvey.q14_streamOpportunitiesAwareness}</p>
                      </div>
                    </div>

                    {/* Section 4 */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                      <h4 className="font-bold text-indigo-400 uppercase text-[10px] tracking-wider">Section 4: Entrance Examinations</h4>
                      <div className="space-y-1.5 text-slate-400">
                        <p><strong className="text-slate-200">15. Heard about exams:</strong> {selectedSurvey.q15_entranceExamsAwareness}</p>
                        <p><strong className="text-slate-200">16. Exams known:</strong> {selectedSurvey.q16_entranceExamsKnown}</p>
                        <p><strong className="text-slate-200">17. Planning to write:</strong> {selectedSurvey.q17_planningEntranceExam}</p>
                        <p><strong className="text-slate-200">18. Need exam guidance:</strong> {selectedSurvey.q18_needExamGuidance}</p>
                      </div>
                    </div>

                    {/* Section 5 */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                      <h4 className="font-bold text-indigo-400 uppercase text-[10px] tracking-wider">Section 5: College Preferences</h4>
                      <div className="space-y-1.5 text-slate-400">
                        <p><strong className="text-slate-200">19. Colleges awareness:</strong> {selectedSurvey.q19_collegesAwareness}</p>
                        <p><strong className="text-slate-200">20. College type preference:</strong> {selectedSurvey.q20_collegeTypePreference}</p>
                        <p><strong className="text-slate-200">21. Study location preference:</strong> {selectedSurvey.q21_studyLocationPreference}</p>
                        <p><strong className="text-slate-200">22. Annual budget:</strong> <span className="text-emerald-400 font-bold">{selectedSurvey.q22_annualBudget}</span></p>
                      </div>
                    </div>

                    {/* Section 6 */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-3">
                      <h4 className="font-bold text-indigo-400 uppercase text-[10px] tracking-wider">Section 6: Career Guidance</h4>
                      <p><strong className="text-slate-200">23. Govt scholarships interest:</strong> {selectedSurvey.q23_govtScholarshipInfoInterest}</p>
                      <div>
                        <strong className="text-slate-200 block mb-1">24. Guidance areas needed:</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {(selectedSurvey.q24_guidanceAreas || []).map((area, idx) => (
                            <span key={idx} className="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                              ✓ {area}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-slate-900 pt-2">
                        <strong className="text-slate-200 block mb-1">25. Biggest confusion / concern:</strong>
                        <p className="bg-slate-900/60 p-3 rounded-xl border border-slate-850 text-slate-300 italic leading-relaxed">
                          &quot;{selectedSurvey.q25_biggestConfusion || 'No specific confusion noted.'}&quot;
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setSelectedSurvey(null)}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer"
                    >
                      Close Window
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Reviews Moderation */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-4">
              <CheckSquare className="w-5 h-5 text-purple-400" />
              <span>Reviews Queue & Moderation</span>
            </h2>

            {reviewsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-slate-500 text-xs py-8 text-center">No student reviews written in the system yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-850">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                      <th className="p-4">Student</th>
                      <th className="p-4">College</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Comment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {reviews.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-950/20 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-200">{r.user?.name}</p>
                          <p className="text-[10px] text-slate-500">{r.user?.email}</p>
                        </td>
                        <td className="p-4 font-semibold text-slate-300">{r.college?.name}</td>
                        <td className="p-4 font-bold text-yellow-400 flex items-center gap-0.5 mt-1.5">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{r.rating}</span>
                        </td>
                        <td className="p-4 text-slate-400 max-w-xs truncate" title={r.reviewText}>
                          {r.reviewText}
                        </td>
                        <td className="p-4 font-bold">
                          {r.isApproved ? (
                            <span className="text-emerald-400">Approved</span>
                          ) : (
                            <span className="text-orange-400">Pending</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-center">
                            {!r.isApproved && (
                              <button
                                onClick={() => handleApproveReview(r.id)}
                                className="bg-emerald-600/25 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-emerald-500/20 text-[10px] font-bold transition cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReview(r.id)}
                              className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 p-1.5 rounded-lg border border-red-500/20 transition cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Admission Updates News */}
        {activeTab === 'updates' && (
          <div className="space-y-8">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-4">
              <Bell className="w-5 h-5 text-purple-400" />
              <span>Publish Admission update</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Form */}
              <form onSubmit={handlePublishUpdate} className="lg:col-span-1 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Megaphone className="w-4 h-4 text-purple-400" />
                  <span>Create Announcement</span>
                </h3>
                {updateMsg && (
                  <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs p-2.5 rounded-xl">
                    {updateMsg}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Announcement Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={updateForm.title}
                    onChange={handleUpdateChange}
                    placeholder="e.g. TS POLYCET 2026 Registration"
                    className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Category</label>
                  <select
                    name="category"
                    value={updateForm.category}
                    onChange={handleUpdateChange}
                    className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none text-xs"
                  >
                    <option value="INTERMEDIATE">Intermediate (11th/12th)</option>
                    <option value="POLYTECHNIC">Polytechnic (Diploma)</option>
                    <option value="ITI">ITI Trades</option>
                    <option value="SCHOLARSHIP">Scholarships</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Content Body</label>
                  <textarea
                    name="content"
                    rows="4"
                    required
                    value={updateForm.content}
                    onChange={handleUpdateChange}
                    placeholder="Write details of the circular announcement..."
                    className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPinned"
                    name="isPinned"
                    checked={updateForm.isPinned}
                    onChange={handleUpdateChange}
                    className="w-3.5 h-3.5 bg-slate-900 border-slate-800 rounded text-indigo-600 focus:ring-0"
                  />
                  <label htmlFor="isPinned" className="text-xs text-slate-400 cursor-pointer select-none">Pin notification to top</label>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Alert</span>
                </button>
              </form>

              {/* Feed manager list */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Manage Published Updates</h3>
                {updatesLoading ? (
                  <div className="flex justify-center items-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  </div>
                ) : updates.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-8">No announcements published.</p>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 divide-y divide-slate-900/60 max-h-96 overflow-y-auto">
                    {updates.map((u) => (
                      <div key={u.id} className="py-3 flex justify-between items-start gap-4 text-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-200 flex items-center gap-1.5">
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-medium">{u.category}</span>
                            {u.isPinned && <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1 py-0.5 rounded font-bold">Pinned</span>}
                            <span>{u.title}</span>
                          </p>
                          <p className="text-slate-500 text-[10px] line-clamp-1">{u.content}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteUpdate(u.id)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded transition cursor-pointer shrink-0"
                          title="Delete announcement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Add New College Profile */}
        {activeTab === 'add-college' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-4">
              <PlusCircle className="w-5 h-5 text-purple-400" />
              <span>Create College Profile</span>
            </h2>

            <form onSubmit={handleCreateCollege} className="space-y-8">
              {collegeMsg && (
                <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs p-3 rounded-xl max-w-xl">
                  {collegeMsg}
                </div>
              )}

              {/* 1. Basic specifications */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">1. Basic Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">College Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={collegeForm.name}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Methodist Junior College"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Ownership</label>
                    <select
                      name="ownership"
                      value={collegeForm.ownership}
                      onChange={handleCollegeChange}
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                    >
                      <option value="GOVERNMENT">Government Only</option>
                      <option value="PRIVATE">Private Only</option>
                      <option value="AIDED">Aided</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Course Category</label>
                    <select
                      name="category"
                      value={collegeForm.category}
                      onChange={handleCollegeChange}
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                    >
                      <option value="JUNIOR_COLLEGE">Junior College (11th & 12th)</option>
                      <option value="POLYTECHNIC">Polytechnic Diploma</option>
                      <option value="ITI">ITI Trade College</option>
                      <option value="DIPLOMA">Diploma</option>
                      <option value="VOCATIONAL">Vocational</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Established Year</label>
                    <input
                      type="number"
                      name="establishedYear"
                      value={collegeForm.establishedYear}
                      onChange={handleCollegeChange}
                      placeholder="e.g. 1995"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Gender Demographics</label>
                    <select
                      name="genderType"
                      value={collegeForm.genderType}
                      onChange={handleCollegeChange}
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                    >
                      <option value="CO_ED">Co-Education</option>
                      <option value="BOYS">Boys Only</option>
                      <option value="GIRLS">Girls Only</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-slate-300">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    required
                    value={collegeForm.description}
                    onChange={handleCollegeChange}
                    placeholder="Provide a brief historical and academic description of the institution..."
                    className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>

              {/* 2. Contact and Location specifications */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">2. Contact & Address Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={collegeForm.address}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Abids, Hyderabad, TS 500001"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Nearby Landmark</label>
                    <input
                      type="text"
                      name="nearbyLandmark"
                      value={collegeForm.nearbyLandmark}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Near GPO"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Contact Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={collegeForm.phone}
                      onChange={handleCollegeChange}
                      placeholder="e.g. 040-12345678"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Contact Email</label>
                    <input
                      type="email"
                      name="email"
                      value={collegeForm.email}
                      onChange={handleCollegeChange}
                      placeholder="e.g. info@college.com"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Website URL</label>
                    <input
                      type="url"
                      name="website"
                      value={collegeForm.website}
                      onChange={handleCollegeChange}
                      placeholder="e.g. https://www.college.com"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Facilities flags */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">3. Facilities Checkmarks</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300 bg-slate-950 p-5 rounded-2xl border border-slate-850">
                  {[
                    { key: 'hasHostel', label: 'Hostel' },
                    { key: 'hasTransport', label: 'Transport Bus' },
                    { key: 'hasLibrary', label: 'Library' },
                    { key: 'hasLabs', label: 'Labs' },
                    { key: 'hasSports', label: 'Sports' },
                    { key: 'hasPlayground', label: 'Playground' },
                    { key: 'hasWifi', label: 'Wi-Fi' },
                    { key: 'hasSmartClassroom', label: 'Smart Classrooms' },
                    { key: 'hasCctv', label: 'CCTV' },
                    { key: 'hasComputerLabs', label: 'Computer Labs' },
                    { key: 'hasCafeteria', label: 'Cafeteria Canteen' },
                  ].map((fac) => (
                    <div key={fac.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`form-${fac.key}`}
                        name={fac.key}
                        checked={collegeForm[fac.key]}
                        onChange={handleCollegeChange}
                        className="w-3.5 h-3.5 bg-slate-900 border-slate-800 rounded text-purple-600 focus:ring-0"
                      />
                      <label htmlFor={`form-${fac.key}`} className="select-none cursor-pointer">{fac.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Stream sub-form */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">4. Stream Fee configurations</h3>
                  <button
                    type="button"
                    onClick={addStreamField}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1 rounded-lg text-[10px] transition cursor-pointer"
                  >
                    + Add Stream
                  </button>
                </div>

                <div className="space-y-4">
                  {streamsList.map((s, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 relative">
                      {streamsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStreamField(idx)}
                          className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition cursor-pointer text-xs"
                        >
                          Remove
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-400">Stream Name</label>
                          <select
                            value={s.streamName}
                            onChange={(e) => handleStreamChange(idx, 'streamName', e.target.value)}
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                          >
                            <option value="MPC">MPC</option>
                            <option value="BiPC">BiPC</option>
                            <option value="MEC">MEC</option>
                            <option value="CEC">CEC</option>
                            <option value="HEC">HEC</option>
                            <option value="Polytechnic">Polytechnic</option>
                            <option value="ITI">ITI</option>
                            <option value="Vocational">Vocational</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-400">Annual Fee (₹)</label>
                          <input
                            type="number"
                            required
                            value={s.annualFee}
                            onChange={(e) => handleStreamChange(idx, 'annualFee', e.target.value)}
                            placeholder="e.g. 35000"
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-400">Admission Mode</label>
                          <select
                            value={s.admissionType}
                            onChange={(e) => handleStreamChange(idx, 'admissionType', e.target.value)}
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                          >
                            <option value="DIRECT">Direct Admission</option>
                            <option value="MERIT_BASED">Merit Based Selection</option>
                            <option value="COUNSELLING">Central Counselling</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-400">Required Marks</label>
                          <input
                            type="text"
                            value={s.requiredMarks}
                            onChange={(e) => handleStreamChange(idx, 'requiredMarks', e.target.value)}
                            placeholder="e.g. Pass or 75% GPA"
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="font-semibold text-slate-400">Reservation / Quota Info</label>
                          <input
                            type="text"
                            value={s.reservationInfo}
                            onChange={(e) => handleStreamChange(idx, 'reservationInfo', e.target.value)}
                            placeholder="e.g. Standard State quotas apply"
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl text-xs shadow-md transition cursor-pointer"
              >
                Create College Profile
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
