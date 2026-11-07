'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  PlusCircle,
  Bell,
  UserX,
  BarChart3,
  Star,
  Landmark,
  Trash2,
  Heart,
  Megaphone,
  Send,
  HelpCircle,
  ClipboardList,
  Download,
  Eye,
  X,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Phone,
  Mail,
  Building2,
  Search,
  Filter,
  Globe,
  MapPin,
  Sparkles,
  Radio,
  School
} from 'lucide-react';
import Link from 'next/link';
import { 
  getSchoolsList, 
  addSchoolToFirestore, 
  deleteSchoolFromFirestore, 
  toggleSchoolActiveStatus, 
  seedDefaultSchoolsToFirestore 
} from '@/lib/schoolsService';

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

  // Schools state
  const [schools, setSchools] = useState([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [schoolSearch, setSchoolSearch] = useState('');
  const [schoolCategoryFilter, setSchoolCategoryFilter] = useState('ALL');
  const [schoolMsg, setSchoolMsg] = useState('');
  const [showAddSchoolForm, setShowAddSchoolForm] = useState(false);
  const [newSchool, setNewSchool] = useState({
    name: '',
    district: 'Hyderabad',
    location: '',
    category: 'Government High School',
    medium: 'English & Telugu',
    udiseCode: ''
  });

  // Registered Colleges & Approvals state
  const [adminColleges, setAdminColleges] = useState([]);
  const [adminCollegesLoading, setAdminCollegesLoading] = useState(true);
  const [collegeFilter, setCollegeFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  const [collegeSearch, setCollegeSearch] = useState('');
  const [selectedReviewCollege, setSelectedReviewCollege] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [approvalMsg, setApprovalMsg] = useState('');

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
    district: 'Hyderabad',
    affiliation: 'Board of Intermediate Education, Telangana (TSBIE)',
    boardCode: '',
    establishedYear: '',
    description: '',
    address: '',
    nearbyLandmark: '',
    phone: '',
    whatsappNumber: '',
    email: '',
    website: '',
    genderType: 'CO_ED',
    principalName: '',
    principalDesignation: 'Principal',
    principalMessage: '',
    admissionStartDate: '',
    admissionEndDate: '',
    admissionProcedure: 'Direct walk-in or online counseling with SSC memo.',
    applicationLink: '',
    scholarships: 'Fee concessions available for meritorious students (>9.0 GPA), SC/ST/BC welfare, and sports quota.',
    prospectusUrl: '',
    hasHostel: false,
    hasTransport: false,
    hasLibrary: true,
    hasLabs: true,
    hasSports: false,
    hasPlayground: false,
    hasWifi: true,
    hasSmartClassroom: false,
    hasCctv: true,
    hasComputerLabs: true,
    hasCafeteria: false,
    facilityNotes: '',
    isLive: true,
    verifiedBadge: true
  });
  const [streamsList, setStreamsList] = useState([
    { streamName: 'MPC', annualFee: '35000', minQualification: '10th Class', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: '' }
  ]);
  const [collegeMsg, setCollegeMsg] = useState('');
  const [createdCollegeSuccess, setCreatedCollegeSuccess] = useState(null);

  useEffect(() => {
    if (user && user.role === 'SUPER_ADMIN') {
      fetchMetrics();
      fetchReviews();
      fetchUpdates();
      fetchSurveys();
      fetchCollegesList();
      fetchSchools();
    }
  }, [user]);

  const fetchSchools = async () => {
    setSchoolsLoading(true);
    try {
      const list = await getSchoolsList(true);
      setSchools(list);
    } catch (err) {
      console.error('Error fetching schools:', err);
    } finally {
      setSchoolsLoading(false);
    }
  };

  const handleAddSchool = async (e) => {
    e.preventDefault();
    if (!newSchool.name.trim()) {
      alert('Please enter school name');
      return;
    }
    try {
      await addSchoolToFirestore({
        ...newSchool,
        createdBy: user?.email || 'admin@career365compass.com'
      });
      setSchoolMsg(`"${newSchool.name}" successfully added to the school directory!`);
      setTimeout(() => setSchoolMsg(''), 4000);
      setNewSchool({
        name: '',
        district: 'Hyderabad',
        location: '',
        category: 'Government High School',
        medium: 'English & Telugu',
        udiseCode: ''
      });
      setShowAddSchoolForm(false);
      await fetchSchools();
    } catch (err) {
      console.error('Error adding school:', err);
      alert('Error adding school: ' + err.message);
    }
  };

  const handleDeleteSchool = async (schoolId, schoolName) => {
    if (!confirm(`Are you sure you want to delete "${schoolName}"?`)) return;
    try {
      await deleteSchoolFromFirestore(schoolId);
      setSchoolMsg(`"${schoolName}" deleted.`);
      setTimeout(() => setSchoolMsg(''), 3000);
      await fetchSchools();
    } catch (err) {
      console.error('Error deleting school:', err);
      alert('Failed to delete school: ' + err.message);
    }
  };

  const handleToggleSchoolStatus = async (schoolId, currentActive) => {
    try {
      await toggleSchoolActiveStatus(schoolId, currentActive);
      await fetchSchools();
    } catch (err) {
      console.error('Error toggling school status:', err);
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleSeedDefaultSchools = async () => {
    if (!confirm('Populate verified high schools for Hyderabad & Telangana into Firestore?')) return;
    try {
      setSchoolsLoading(true);
      const added = await seedDefaultSchoolsToFirestore(user?.email || 'admin@career365compass.com');
      setSchoolMsg(`Successfully populated ${added.length} verified schools into Firestore!`);
      setTimeout(() => setSchoolMsg(''), 4000);
      await fetchSchools();
    } catch (err) {
      console.error('Error seeding schools:', err);
      alert('Failed to seed schools: ' + err.message);
    } finally {
      setSchoolsLoading(false);
    }
  };

  const fetchCollegesList = async () => {
    setAdminCollegesLoading(true);
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const snap = await getDocs(collection(db, 'colleges'));
      const list = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      // Sort: PENDING first, then by createdAt / id desc
      list.sort((a, b) => {
        const aPending = a.status === 'PENDING' || (!a.isApproved && a.registeredByEmail);
        const bPending = b.status === 'PENDING' || (!b.isApproved && b.registeredByEmail);
        if (aPending && !bPending) return -1;
        if (!aPending && bPending) return 1;
        return (b.createdAt || 0) > (a.createdAt || 0) ? 1 : -1;
      });
      setAdminColleges(list);
    } catch (err) {
      console.error('Error fetching admin colleges list:', err);
    } finally {
      setAdminCollegesLoading(false);
    }
  };

  const handleApproveCollege = async (collegeId) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await updateDoc(doc(db, 'colleges', String(collegeId)), {
        status: 'APPROVED',
        isApproved: true,
        verified: true,
        isLive: true,
        approvedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
      });
      setApprovalMsg('College approved and published live to Student Directory!');
      setTimeout(() => setApprovalMsg(''), 4000);
      fetchCollegesList();
      fetchMetrics();
      if (selectedReviewCollege && selectedReviewCollege.id === collegeId) {
        setSelectedReviewCollege(prev => ({ ...prev, status: 'APPROVED', isApproved: true, verified: true, isLive: true }));
      }
    } catch (err) {
      console.error('Error approving college:', err);
      alert('Error approving college: ' + err.message);
    }
  };

  const handleToggleCollegeLive = async (collegeId, currentLiveStatus) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const newLive = !currentLiveStatus;
      await updateDoc(doc(db, 'colleges', String(collegeId)), {
        isLive: newLive,
        status: newLive ? 'APPROVED' : 'UNPUBLISHED',
        isApproved: newLive,
        publishedAt: newLive ? new Date().toISOString() : null
      });
      setApprovalMsg(newLive ? 'College is now PUBLISHED LIVE on Student Directory!' : 'College has been UNPUBLISHED (taken offline).');
      setTimeout(() => setApprovalMsg(''), 4500);
      fetchCollegesList();
      fetchMetrics();
      if (selectedReviewCollege && selectedReviewCollege.id === collegeId) {
        setSelectedReviewCollege(prev => ({
          ...prev,
          isLive: newLive,
          status: newLive ? 'APPROVED' : 'UNPUBLISHED',
          isApproved: newLive
        }));
      }
    } catch (err) {
      console.error('Error toggling college live status:', err);
      alert('Error updating live status: ' + err.message);
    }
  };

  const handleRejectCollege = async (collegeId, remarks) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await updateDoc(doc(db, 'colleges', String(collegeId)), {
        status: 'REJECTED',
        isApproved: false,
        verified: false,
        isLive: false,
        rejectionRemarks: remarks || 'Institutional details need revision',
        rejectedAt: new Date().toISOString()
      });
      setApprovalMsg('College marked as rejected / revisions requested.');
      setTimeout(() => setApprovalMsg(''), 4000);
      setShowRejectInput(false);
      setRejectionNote('');
      fetchCollegesList();
      fetchMetrics();
      if (selectedReviewCollege && selectedReviewCollege.id === collegeId) {
        setSelectedReviewCollege(prev => ({ ...prev, status: 'REJECTED', isApproved: false, verified: false, isLive: false }));
      }
    } catch (err) {
      console.error('Error rejecting college:', err);
      alert('Error rejecting college: ' + err.message);
    }
  };

  const handleToggleCollegeVerify = async (collegeId, currentVerified) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await updateDoc(doc(db, 'colleges', String(collegeId)), {
        verified: !currentVerified
      });
      fetchCollegesList();
      fetchMetrics();
    } catch (err) {
      console.error('Error toggling college verification:', err);
    }
  };

  const handleDeleteCollege = async (collegeId) => {
    if (!window.confirm('Are you sure you want to delete this college profile permanently?')) return;
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await deleteDoc(doc(db, 'colleges', String(collegeId)));
      fetchCollegesList();
      fetchMetrics();
      setSelectedReviewCollege(null);
    } catch (err) {
      console.error('Error deleting college:', err);
      alert('Error deleting college: ' + err.message);
    }
  };

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
    link.setAttribute('download', `career365compass_student_surveys_${new Date().toISOString().slice(0, 10)}.csv`);
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
    setCreatedCollegeSuccess(null);
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
      const nextId = maxId > 0 ? maxId + 1 : 6580;

      const isLiveNow = collegeForm.isLive !== false;
      const willBeVerified = isLiveNow && collegeForm.verifiedBadge !== false;

      const payload = {
        id: String(nextId),
        name: collegeForm.name.trim(),
        ownership: collegeForm.ownership,
        category: collegeForm.category,
        district: collegeForm.district || 'Hyderabad',
        affiliation: collegeForm.affiliation || 'Board of Intermediate Education, Telangana (TSBIE)',
        boardCode: collegeForm.boardCode ? collegeForm.boardCode.trim() : '',
        establishedYear: collegeForm.establishedYear ? parseInt(collegeForm.establishedYear) : null,
        description: collegeForm.description.trim(),
        address: collegeForm.address.trim(),
        nearbyLandmark: collegeForm.nearbyLandmark ? collegeForm.nearbyLandmark.trim() : '',
        phone: collegeForm.phone.trim(),
        whatsappNumber: collegeForm.whatsappNumber ? collegeForm.whatsappNumber.trim() : collegeForm.phone.trim(),
        email: collegeForm.email ? collegeForm.email.trim() : '',
        website: collegeForm.website ? collegeForm.website.trim() : '',
        genderType: collegeForm.genderType,
        principalName: collegeForm.principalName ? collegeForm.principalName.trim() : '',
        principalDesignation: collegeForm.principalDesignation ? collegeForm.principalDesignation.trim() : 'Principal',
        principalMessage: collegeForm.principalMessage ? collegeForm.principalMessage.trim() : '',
        admissions: {
          startDate: collegeForm.admissionStartDate || '',
          endDate: collegeForm.admissionEndDate || '',
          procedure: collegeForm.admissionProcedure || 'Direct walk-in or online counseling with SSC memo.',
          applyLink: collegeForm.applicationLink || ''
        },
        scholarships: collegeForm.scholarships || 'Merit-based fee concessions for >9.0 GPA, SC/ST/BC welfare, and sports quota.',
        documents: collegeForm.prospectusUrl ? [
          { title: 'Official Prospectus & Fee Structure', url: collegeForm.prospectusUrl }
        ] : [],
        facilities: {
          hostel: !!collegeForm.hasHostel,
          transport: !!collegeForm.hasTransport,
          library: !!collegeForm.hasLibrary,
          labs: !!collegeForm.hasLabs,
          sports: !!collegeForm.hasSports,
          playground: !!collegeForm.hasPlayground,
          wifi: !!collegeForm.hasWifi,
          smartClassrooms: !!collegeForm.hasSmartClassroom,
          cctv: !!collegeForm.hasCctv,
          computerLabs: !!collegeForm.hasComputerLabs,
          cafeteria: !!collegeForm.hasCafeteria,
          notes: collegeForm.facilityNotes || ''
        },
        // Facility flags directly at root for backward compatibility
        hasHostel: !!collegeForm.hasHostel,
        hasTransport: !!collegeForm.hasTransport,
        hasLibrary: !!collegeForm.hasLibrary,
        hasLabs: !!collegeForm.hasLabs,
        hasSports: !!collegeForm.hasSports,
        hasPlayground: !!collegeForm.hasPlayground,
        hasWifi: !!collegeForm.hasWifi,
        hasSmartClassroom: !!collegeForm.hasSmartClassroom,
        hasCctv: !!collegeForm.hasCctv,
        hasComputerLabs: !!collegeForm.hasComputerLabs,
        hasCafeteria: !!collegeForm.hasCafeteria,
        streams: streamsList.map(s => ({
          streamName: s.streamName,
          annualFee: parseFloat(s.annualFee) || 0,
          minQualification: s.minQualification || '10th Class',
          requiredMarks: s.requiredMarks || 'Pass',
          admissionType: s.admissionType || 'DIRECT',
          reservationInfo: s.reservationInfo || ''
        })),
        gallery: [
          'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80'
        ],
        coverImageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
        averageRating: 4.5,
        totalReviews: 0,
        // Live status & verification fields:
        isLive: isLiveNow,
        status: isLiveNow ? 'APPROVED' : 'DRAFT',
        isApproved: isLiveNow,
        verified: willBeVerified,
        createdBy: 'SUPER_ADMIN',
        createdAt: new Date().toISOString(),
        approvedAt: isLiveNow ? new Date().toISOString() : null,
        publishedAt: isLiveNow ? new Date().toISOString() : null
      };

      await setDoc(doc(db, 'colleges', String(nextId)), payload);

      setCreatedCollegeSuccess({
        id: String(nextId),
        name: payload.name,
        isLive: isLiveNow,
        verified: willBeVerified
      });

      setCollegeMsg(isLiveNow 
        ? `College "${payload.name}" created and published LIVE on the Student Portal!` 
        : `College "${payload.name}" saved as draft (offline).`
      );

      // Reset form to clean defaults
      setCollegeForm({
        name: '', ownership: 'PRIVATE', category: 'JUNIOR_COLLEGE', district: 'Hyderabad',
        affiliation: 'Board of Intermediate Education, Telangana (TSBIE)', boardCode: '',
        establishedYear: '', description: '', address: '', nearbyLandmark: '', phone: '',
        whatsappNumber: '', email: '', website: '', genderType: 'CO_ED', principalName: '',
        principalDesignation: 'Principal', principalMessage: '', admissionStartDate: '',
        admissionEndDate: '', admissionProcedure: 'Direct walk-in or online counseling with SSC memo.',
        applicationLink: '', scholarships: 'Fee concessions available for meritorious students (>9.0 GPA), SC/ST/BC welfare, and sports quota.',
        prospectusUrl: '', hasHostel: false, hasTransport: false, hasLibrary: true, hasLabs: true,
        hasSports: false, hasPlayground: false, hasWifi: true, hasSmartClassroom: false,
        hasCctv: true, hasComputerLabs: true, hasCafeteria: false, facilityNotes: '',
        isLive: true, verifiedBadge: true
      });
      setStreamsList([
        { streamName: 'MPC', annualFee: '35000', minQualification: '10th Class', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: '' }
      ]);

      fetchCollegesList();
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

  const pendingColleges = adminColleges.filter(
    (c) => c.status === 'PENDING' || (!c.isApproved && c.registeredByEmail)
  );
  const pendingCount = pendingColleges.length;

  const tabs = [
    { id: 'analytics', label: 'Dashboard Stats', icon: BarChart3 },
    {
      id: 'colleges-approvals',
      label: pendingCount > 0 ? `College Approvals (${pendingCount})` : 'College Approvals & Directory',
      icon: Building2,
      badge: pendingCount
    },
    { id: 'schools', label: `Schools Directory (${schools.length})`, icon: School },
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
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center space-y-1.5">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide">Colleges Listed</span>
                    <p className="text-slate-200 text-2xl sm:text-3xl font-extrabold">{metrics.totalColleges}</p>
                  </div>
                  <div
                    onClick={() => setActiveTab('colleges-approvals')}
                    className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 text-center space-y-1.5 cursor-pointer hover:border-amber-500 transition"
                  >
                    <span className="text-amber-400 text-[10px] uppercase font-bold tracking-wide">Pending Verifications</span>
                    <p className="text-amber-400 text-2xl sm:text-3xl font-extrabold">{pendingCount}</p>
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
            <div className="border-b border-slate-850 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-purple-400" />
                  <span>Create & Publish College Profile</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Super Admin Direct Entry. Add any junior college, polytechnic, or vocational institution with full stream fees, facilities, and publish LIVE immediately on the public Student Portal.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('colleges-approvals')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span>View College Directory</span>
              </button>
            </div>

            {/* Created Success Banner with direct live links */}
            {createdCollegeSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-xs text-emerald-300 space-y-3 shadow-lg animate-fade-in">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="font-bold text-emerald-200 text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>College Profile Successfully Created!</span>
                    </p>
                    <p className="text-slate-300">
                      <strong>{createdCollegeSuccess.name}</strong> (ID: <code className="text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded">{createdCollegeSuccess.id}</code>) has been saved to the database.
                    </p>
                    <p className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                      <span>{createdCollegeSuccess.isLive ? 'PUBLISHED LIVE on Student Search Directory & Comparison Tool.' : 'Saved as Offline Draft.'}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setCreatedCollegeSuccess(null)}
                    className="text-slate-400 hover:text-white text-base leading-none cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-500/20">
                  <Link
                    href={`/colleges/${createdCollegeSuccess.id}`}
                    target="_blank"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
                  >
                    <span>View Live on Public Student Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setActiveTab('colleges-approvals')}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Manage in College Directory</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCreatedCollegeSuccess(null)}
                    className="px-3 py-2 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
                  >
                    + Add Another College
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateCollege} className="space-y-8">
              {collegeMsg && !createdCollegeSuccess && (
                <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs p-3 rounded-xl max-w-xl">
                  {collegeMsg}
                </div>
              )}

              {/* 1. Basic specifications */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">1. Institutional Identity & Demographics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">College Name <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={collegeForm.name}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Methodist Junior College"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Ownership Type</label>
                    <select
                      name="ownership"
                      value={collegeForm.ownership}
                      onChange={handleCollegeChange}
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
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
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="JUNIOR_COLLEGE">Junior College (11th & 12th)</option>
                      <option value="POLYTECHNIC">Polytechnic Diploma</option>
                      <option value="ITI">ITI Trade College</option>
                      <option value="DIPLOMA">Diploma</option>
                      <option value="VOCATIONAL">Vocational</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">District</label>
                    <select
                      name="district"
                      value={collegeForm.district}
                      onChange={handleCollegeChange}
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Medchal-Malkajgiri">Medchal-Malkajgiri</option>
                      <option value="Ranga Reddy">Ranga Reddy</option>
                      <option value="Sangareddy">Sangareddy</option>
                      <option value="Warangal">Warangal</option>
                      <option value="Nizamabad">Nizamabad</option>
                      <option value="Karimnagar">Karimnagar</option>
                      <option value="Nalgonda">Nalgonda</option>
                      <option value="Khammam">Khammam</option>
                      <option value="Mahabubnagar">Mahabubnagar</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Affiliation & Board</label>
                    <input
                      type="text"
                      name="affiliation"
                      value={collegeForm.affiliation}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Board of Intermediate Education, Telangana (TSBIE)"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Board / College Code</label>
                    <input
                      type="text"
                      name="boardCode"
                      value={collegeForm.boardCode}
                      onChange={handleCollegeChange}
                      placeholder="e.g. TS-HYD-5021"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Established Year</label>
                    <input
                      type="number"
                      name="establishedYear"
                      value={collegeForm.establishedYear}
                      onChange={handleCollegeChange}
                      placeholder="e.g. 1995"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Gender Demographics</label>
                    <select
                      name="genderType"
                      value={collegeForm.genderType}
                      onChange={handleCollegeChange}
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="CO_ED">Co-Education</option>
                      <option value="BOYS">Boys Only</option>
                      <option value="GIRLS">Girls Only</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-slate-300">Description <span className="text-red-400">*</span></label>
                  <textarea
                    name="description"
                    rows="3"
                    required
                    value={collegeForm.description}
                    onChange={handleCollegeChange}
                    placeholder="Provide a brief historical and academic description of the institution..."
                    className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  ></textarea>
                </div>
              </div>

              {/* 2. Contact and Location specifications */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">2. Campus Address & Admissions Helpline</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Street Address <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={collegeForm.address}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Abids, Hyderabad, TS 500001"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Nearby Landmark / Area</label>
                    <input
                      type="text"
                      name="nearbyLandmark"
                      value={collegeForm.nearbyLandmark}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Near GPO / Metro Station"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Official Phone Number <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      name="phone"
                      required
                      value={collegeForm.phone}
                      onChange={handleCollegeChange}
                      placeholder="e.g. 040-12345678 or 9876543210"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-emerald-400 flex items-center gap-1">
                      <span>WhatsApp Admissions Desk</span>
                      <span className="text-[10px] text-slate-500 font-normal">(Direct Student Chat)</span>
                    </label>
                    <input
                      type="text"
                      name="whatsappNumber"
                      value={collegeForm.whatsappNumber}
                      onChange={handleCollegeChange}
                      placeholder="e.g. +91 98765 43210"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Contact Email</label>
                    <input
                      type="email"
                      name="email"
                      value={collegeForm.email}
                      onChange={handleCollegeChange}
                      placeholder="e.g. admissions@college.edu.in"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Official Website URL</label>
                    <input
                      type="url"
                      name="website"
                      value={collegeForm.website}
                      onChange={handleCollegeChange}
                      placeholder="e.g. https://www.college.edu.in"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Leadership & Authorized Representative */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">3. Institutional Leadership & Principal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Principal / Head of Institution Name</label>
                    <input
                      type="text"
                      name="principalName"
                      value={collegeForm.principalName}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Dr. K. Radhakrishna, M.Sc., Ph.D."
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Designation / Role</label>
                    <input
                      type="text"
                      name="principalDesignation"
                      value={collegeForm.principalDesignation}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Principal / Campus Director"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2 text-xs">
                    <label className="font-semibold text-slate-300">Principal Message / Institutional Motto</label>
                    <input
                      type="text"
                      name="principalMessage"
                      value={collegeForm.principalMessage}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Committed to academic excellence and nurturing future technocrats and civil servants."
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Admissions, Key Dates & Scholarships */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">4. Admissions Key Dates, Scholarships & Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Application Cycle Start Date</label>
                    <input
                      type="date"
                      name="admissionStartDate"
                      value={collegeForm.admissionStartDate}
                      onChange={handleCollegeChange}
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Application Last Date / Deadline</label>
                    <input
                      type="date"
                      name="admissionEndDate"
                      value={collegeForm.admissionEndDate}
                      onChange={handleCollegeChange}
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-slate-300">Admission Procedure & Walk-in Instructions</label>
                    <input
                      type="text"
                      name="admissionProcedure"
                      value={collegeForm.admissionProcedure}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Direct walk-in with SSC 10th Marks Memo, Transfer Certificate, and 3 passport photos."
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-slate-300">Online Application / Admission Form URL</label>
                    <input
                      type="url"
                      name="applicationLink"
                      value={collegeForm.applicationLink}
                      onChange={handleCollegeChange}
                      placeholder="e.g. https://www.college.edu.in/admissions/apply"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-slate-300">Available Scholarships & Concessions</label>
                    <textarea
                      name="scholarships"
                      rows="2"
                      value={collegeForm.scholarships}
                      onChange={handleCollegeChange}
                      placeholder="e.g. 50% tuition waiver for >9.5 GPA in 10th class, Telangana ePASS post-matric reimbursement, sports concessions."
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    ></textarea>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-slate-300">College Prospectus / Brochure PDF URL</label>
                    <input
                      type="url"
                      name="prospectusUrl"
                      value={collegeForm.prospectusUrl}
                      onChange={handleCollegeChange}
                      placeholder="e.g. https://www.college.edu.in/brochure-2026.pdf"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Facilities flags */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">5. Campus Facilities & Infrastructure</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300 bg-slate-950 p-5 rounded-2xl border border-slate-850">
                  {[
                    { key: 'hasHostel', label: 'Hostel' },
                    { key: 'hasTransport', label: 'Transport Bus' },
                    { key: 'hasLibrary', label: 'Library' },
                    { key: 'hasLabs', label: 'Science Labs' },
                    { key: 'hasSports', label: 'Sports' },
                    { key: 'hasPlayground', label: 'Playground' },
                    { key: 'hasWifi', label: 'Campus Wi-Fi' },
                    { key: 'hasSmartClassroom', label: 'Smart Classrooms' },
                    { key: 'hasCctv', label: 'CCTV Surveillance' },
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
                        className="w-4 h-4 bg-slate-900 border-slate-800 rounded text-purple-600 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor={`form-${fac.key}`} className="select-none cursor-pointer">{fac.label}</label>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-slate-300">Facility Description / Notes</label>
                  <input
                    type="text"
                    name="facilityNotes"
                    value={collegeForm.facilityNotes}
                    onChange={handleCollegeChange}
                    placeholder="e.g. AC computer labs with 100+ terminals, RO purified water, separate hostel for girls."
                    className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* 6. Stream sub-form */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">6. Academic Streams & Fee Configurations</h3>
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
                            <option value="MPC">MPC (Maths, Physics, Chem)</option>
                            <option value="BiPC">BiPC (Biology, Physics, Chem)</option>
                            <option value="MEC">MEC (Maths, Econ, Commerce)</option>
                            <option value="CEC">CEC (Civics, Econ, Commerce)</option>
                            <option value="HEC">HEC (History, Econ, Civics)</option>
                            <option value="Polytechnic">Polytechnic Engineering</option>
                            <option value="ITI">ITI Technical Trade</option>
                            <option value="Vocational">Vocational Intermediate</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-400">Annual Tuition Fee (₹) <span className="text-red-400">*</span></label>
                          <input
                            type="number"
                            required
                            value={s.annualFee}
                            onChange={(e) => handleStreamChange(idx, 'annualFee', e.target.value)}
                            placeholder="e.g. 35000"
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-400">Admission Mode</label>
                          <select
                            value={s.admissionType}
                            onChange={(e) => handleStreamChange(idx, 'admissionType', e.target.value)}
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
                          >
                            <option value="DIRECT">Direct Walk-in Admission</option>
                            <option value="MERIT_BASED">Merit-Based (SSC Marks)</option>
                            <option value="COUNSELLING">State Central Counselling</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-400">Required Marks / Cutoff</label>
                          <input
                            type="text"
                            value={s.requiredMarks}
                            onChange={(e) => handleStreamChange(idx, 'requiredMarks', e.target.value)}
                            placeholder="e.g. Pass or 7.5 GPA"
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="font-semibold text-slate-400">Reservation / Quota Info</label>
                          <input
                            type="text"
                            value={s.reservationInfo}
                            onChange={(e) => handleStreamChange(idx, 'reservationInfo', e.target.value)}
                            placeholder="e.g. Standard Telangana state quotas apply"
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. PUBLICATION & LIVE STATUS TOGGLE */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">7. Publication & Live Status</h3>
                
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-950 to-emerald-950/20 border border-purple-500/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Radio className={`w-4 h-4 ${collegeForm.isLive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                        <h4 className="text-sm font-bold text-slate-100">Publish LIVE Immediately on Student Portal</h4>
                      </div>
                      <p className="text-xs text-slate-400 max-w-xl">
                        When enabled, this college will immediately appear on the public Student Search Directory (<code className="text-purple-300">/colleges</code>), College Comparison tool, and its public profile will be live right away.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        name="isLive"
                        checked={collegeForm.isLive}
                        onChange={handleCollegeChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      <span className="ml-3 text-xs font-bold text-slate-200">
                        {collegeForm.isLive ? 'LIVE' : 'DRAFT'}
                      </span>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-850">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-slate-200">Grant Verified Institution Badge</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Displays the green verified shield on the college listing card and public profile.
                      </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        name="verifiedBadge"
                        checked={collegeForm.verifiedBadge}
                        onChange={handleCollegeChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      <span className="ml-3 text-xs font-bold text-slate-200">
                        {collegeForm.verifiedBadge ? 'Verified' : 'Unverified'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  type="submit"
                  className={`w-full sm:w-auto font-bold py-3.5 px-8 rounded-xl text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2 ${
                    collegeForm.isLive
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
                  }`}
                >
                  {collegeForm.isLive ? (
                    <>
                      <Radio className="w-4 h-4 text-emerald-200 animate-pulse" />
                      <span>Create College Profile & Publish LIVE to Student Portal</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Save College Profile as Draft (Offline)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('colleges-approvals')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel / Back to Directory
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab: College Directory & Approvals */}
        {activeTab === 'colleges-approvals' && (
          <div className="space-y-6">
            <div className="border-b border-slate-850 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  <span>College Directory & Institutional Approvals</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify self-registered colleges, inspect representative credentials, review fee structures, and approve profiles to go live on the Student Portal.
                </p>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('add-college')}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Add New College</span>
                </button>

                <button
                  onClick={fetchCollegesList}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer"
                >
                  Refresh List
                </button>
              </div>
            </div>

            {/* Notification alert banner */}
            {approvalMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{approvalMsg}</span>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Filter pills */}
              <div className="flex overflow-x-auto gap-2 scrollbar-none pb-1">
                {[
                  { id: 'ALL', label: `All (${adminColleges.length})` },
                  { id: 'PENDING', label: `Pending Verification (${pendingCount})`, highlight: pendingCount > 0 },
                  { id: 'APPROVED', label: `Approved & Live (${adminColleges.filter(c => c.status === 'APPROVED' || c.isApproved).length})` },
                  { id: 'REJECTED', label: `Rejected (${adminColleges.filter(c => c.status === 'REJECTED').length})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCollegeFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      collegeFilter === f.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : f.highlight
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search college, principal, email..."
                  value={collegeSearch}
                  onChange={(e) => setCollegeSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-purple-500"
                />
              </div>
            </div>

            {/* Colleges List */}
            {adminCollegesLoading ? (
              <div className="py-12 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : adminColleges.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
                No colleges registered in database.
              </div>
            ) : (
              <div className="space-y-3">
                {adminColleges
                  .filter((c) => {
                    if (collegeFilter === 'PENDING') return c.status === 'PENDING' || (!c.isApproved && c.registeredByEmail);
                    if (collegeFilter === 'APPROVED') return c.status === 'APPROVED' || c.isApproved;
                    if (collegeFilter === 'REJECTED') return c.status === 'REJECTED';
                    return true;
                  })
                  .filter((c) => {
                    if (!collegeSearch.trim()) return true;
                    const q = collegeSearch.toLowerCase();
                    return (
                      (c.name && c.name.toLowerCase().includes(q)) ||
                      (c.email && c.email.toLowerCase().includes(q)) ||
                      (c.principalName && c.principalName.toLowerCase().includes(q)) ||
                      (c.district && c.district.toLowerCase().includes(q))
                    );
                  })
                  .map((col) => {
                    const isPending = col.status === 'PENDING' || (!col.isApproved && col.registeredByEmail);
                    const isApproved = col.status === 'APPROVED' || col.isApproved;
                    const isRejected = col.status === 'REJECTED';

                    return (
                      <div
                        key={col.id}
                        className={`bg-slate-950 border rounded-2xl p-4 sm:p-5 transition space-y-4 ${
                          isPending
                            ? 'border-amber-500/40 bg-amber-500/[0.02]'
                            : isApproved
                            ? 'border-slate-800 hover:border-slate-700'
                            : 'border-red-500/30 bg-red-500/[0.02]'
                        }`}
                      >
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-slate-100 text-sm sm:text-base">{col.name}</h3>
                              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                {col.ownership} • {col.category?.replace('_', ' ')}
                              </span>
                              {col.verified && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3" />
                                  <span>Verified Badge</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 flex items-center gap-2">
                              <span>📍 {col.address || col.district || 'Hyderabad'}</span>
                              {col.boardCode && <span>• Board Code: {col.boardCode}</span>}
                            </p>
                          </div>

                          {/* Status Pill */}
                          <div className="shrink-0">
                            {isPending ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Pending Verification</span>
                              </span>
                            ) : isApproved ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approved & Live</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Rejected / Needs Revision</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-850 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Representative</span>
                            <p className="text-slate-200 font-medium">
                              {col.principalName || col.registeredByName || 'Official Rep'}
                            </p>
                            <p className="text-slate-400 text-[11px]">{col.principalDesignation || 'Authorised Contact'}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Contact Details</span>
                            <p className="text-slate-200">{col.email || col.registeredByEmail || 'No email'}</p>
                            <p className="text-slate-400 text-[11px]">{col.phone || col.whatsappNumber || 'No phone'}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Academic Streams & Affiliation</span>
                            <p className="text-slate-200 font-medium">
                              {col.streams?.map(s => s.streamName).join(', ') || 'No streams set'}
                            </p>
                            <p className="text-slate-400 text-[11px] truncate">{col.affiliation || 'TSBIE'}</p>
                          </div>
                        </div>

                        {/* Rejection remarks notice if present */}
                        {col.rejectionRemarks && (
                          <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                            <strong>Super Admin Remarks:</strong> {col.rejectionRemarks}
                          </div>
                        )}

                        {/* Actions Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-900">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedReviewCollege(col)}
                              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-purple-400" />
                              <span>Review Full Dossier</span>
                            </button>

                            <Link
                              href={`/colleges/${col.id}`}
                              target="_blank"
                              className="px-3 py-1.5 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1"
                            >
                              <span>Public Page</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Toggle Live / Offline Button */}
                            {col.isLive !== false && isApproved ? (
                              <button
                                onClick={() => handleToggleCollegeLive(col.id, true)}
                                className="px-2.5 py-1.5 bg-slate-900 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 border border-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                                title="Temporarily take this college offline from Student Directory"
                              >
                                <span>Pause / Unpublish</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleCollegeLive(col.id, false)}
                                className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                                title="Make this college live on Student Directory"
                              >
                                <Radio className="w-3 h-3 text-emerald-400" />
                                <span>Make Live</span>
                              </button>
                            )}

                            {/* Approve Button if not approved */}
                            {!isApproved && (
                              <button
                                onClick={() => handleApproveCollege(col.id)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve & Publish Live</span>
                              </button>
                            )}

                            {/* Reject / Request revisions Button */}
                            {!isRejected && (
                              <button
                                onClick={() => {
                                  const reason = prompt('Enter rejection / revision remarks for the college representative:');
                                  if (reason) handleRejectCollege(col.id, reason);
                                }}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer"
                              >
                                Reject / Revision
                              </button>
                            )}

                            {/* Toggle Verified Badge */}
                            <button
                              onClick={() => handleToggleCollegeVerify(col.id, col.verified)}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl text-xs transition cursor-pointer"
                              title="Toggle Verified Badge"
                            >
                              {col.verified ? 'Unverify' : 'Verify'}
                            </button>

                            {/* Delete College */}
                            <button
                              onClick={() => handleDeleteCollege(col.id)}
                              className="text-slate-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-900 transition cursor-pointer"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* Tab: Schools Directory Management */}
        {activeTab === 'schools' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
                  <School className="w-5 h-5 text-indigo-400" />
                  <span>High Schools Directory</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Add and manage 10th-grade high schools. All active schools added here will immediately be available as a select dropdown for students in registration, profile settings, and diagnostic surveys.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAddSchoolForm(!showAddSchoolForm)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{showAddSchoolForm ? 'Close Form' : '+ Add New School'}</span>
                </button>

                <button
                  onClick={handleSeedDefaultSchools}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  title="Batch load standard verified Telangana high schools into Firestore"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Seed Verified TS Schools</span>
                </button>
              </div>
            </div>

            {schoolMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{schoolMsg}</span>
              </div>
            )}

            {/* Quick KPI Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Schools</p>
                <p className="text-xl font-extrabold text-white">{schools.length}</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Govt High Schools</p>
                <p className="text-xl font-extrabold text-emerald-400">
                  {schools.filter((s) => (s.category || '').toLowerCase().includes('government')).length}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">ZPHS Schools</p>
                <p className="text-xl font-extrabold text-blue-400">
                  {schools.filter((s) => (s.category || '').toLowerCase().includes('zilla') || (s.name || '').includes('ZPHS')).length}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Model & Private</p>
                <p className="text-xl font-extrabold text-purple-400">
                  {schools.filter((s) => !(s.category || '').toLowerCase().includes('government') && !(s.category || '').toLowerCase().includes('zilla') && !(s.name || '').includes('ZPHS')).length}
                </p>
              </div>
            </div>

            {/* Add School Collapsible / Card Form */}
            {showAddSchoolForm && (
              <form onSubmit={handleAddSchool} className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-indigo-400" />
                    <span>Add New School to Student Dropdown</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddSchoolForm(false)}
                    className="text-slate-500 hover:text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* School Name */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      School Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Govt High School, Aliya or ZPHS Uppal"
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* School Category */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Category / School Type
                    </label>
                    <select
                      value={newSchool.category}
                      onChange={(e) => setNewSchool({ ...newSchool, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Government High School">Government High School</option>
                      <option value="Zilla Parishad High School (ZPHS)">Zilla Parishad High School (ZPHS)</option>
                      <option value="Telangana Model School">Telangana Model School</option>
                      <option value="KGBV / Residential School">KGBV / Residential School</option>
                      <option value="Private / Aided School">Private / Aided School</option>
                      <option value="Private / Unaided School">Private / Unaided School</option>
                      <option value="CBSE / ICSE School">CBSE / ICSE School</option>
                    </select>
                  </div>

                  {/* District */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">District</label>
                    <select
                      value={newSchool.district}
                      onChange={(e) => setNewSchool({ ...newSchool, district: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Medchal-Malkajgiri">Medchal-Malkajgiri</option>
                      <option value="Ranga Reddy">Ranga Reddy</option>
                      <option value="Sangareddy">Sangareddy</option>
                      <option value="Vikarabad">Vikarabad</option>
                      <option value="Nizamabad">Nizamabad</option>
                      <option value="Warangal">Warangal</option>
                      <option value="Other District">Other District</option>
                    </select>
                  </div>

                  {/* Location / Area */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Area / Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gunfoundry, Uppal, Secunderabad"
                      value={newSchool.location}
                      onChange={(e) => setNewSchool({ ...newSchool, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Medium */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Medium of Instruction
                    </label>
                    <select
                      value={newSchool.medium}
                      onChange={(e) => setNewSchool({ ...newSchool, medium: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="English & Telugu">English & Telugu</option>
                      <option value="English Medium">English Medium</option>
                      <option value="Telugu Medium">Telugu Medium</option>
                      <option value="Urdu & English">Urdu & English</option>
                      <option value="English, Urdu & Telugu">English, Urdu & Telugu</option>
                    </select>
                  </div>

                  {/* U-DISE Code */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      U-DISE Code <span className="text-[10px] text-slate-500">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 36200100101"
                      value={newSchool.udiseCode}
                      onChange={(e) => setNewSchool({ ...newSchool, udiseCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={() => setShowAddSchoolForm(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
                  >
                    Save School to Directory
                  </button>
                </div>
              </form>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'ALL', label: `All (${schools.length})` },
                  { key: 'GOVT', label: 'Government' },
                  { key: 'ZPHS', label: 'ZPHS' },
                  { key: 'MODEL', label: 'Model / KGBV' },
                  { key: 'PRIVATE', label: 'Private / Aided' }
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setSchoolCategoryFilter(f.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      schoolCategoryFilter === f.key
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[260px]">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by school name, area, or code..."
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Schools List */}
            {schoolsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            ) : schools.length === 0 ? (
              <div className="text-center py-12 bg-slate-950 border border-slate-800 rounded-2xl p-8 space-y-3">
                <School className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-slate-200 font-bold text-sm">No Schools Found</h4>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Click the button below to automatically load the standard verified high schools for Hyderabad and Telangana.
                </p>
                <button
                  onClick={handleSeedDefaultSchools}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Seed Verified Telangana Schools</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {schools
                  .filter((s) => {
                    if (schoolCategoryFilter === 'GOVT') {
                      return (s.category || '').toLowerCase().includes('government');
                    }
                    if (schoolCategoryFilter === 'ZPHS') {
                      return (s.category || '').toLowerCase().includes('zilla') || (s.name || '').includes('ZPHS');
                    }
                    if (schoolCategoryFilter === 'MODEL') {
                      return (s.category || '').toLowerCase().includes('model') || (s.category || '').toLowerCase().includes('kgbv');
                    }
                    if (schoolCategoryFilter === 'PRIVATE') {
                      return (s.category || '').toLowerCase().includes('private');
                    }
                    return true;
                  })
                  .filter((s) => {
                    if (!schoolSearch.trim()) return true;
                    const q = schoolSearch.toLowerCase();
                    return (
                      (s.name || '').toLowerCase().includes(q) ||
                      (s.district || '').toLowerCase().includes(q) ||
                      (s.location || '').toLowerCase().includes(q) ||
                      (s.udiseCode || '').toLowerCase().includes(q)
                    );
                  })
                  .map((school) => {
                    const isGovt = (school.category || '').toLowerCase().includes('government');
                    const isZphs = (school.category || '').toLowerCase().includes('zilla') || (school.name || '').includes('ZPHS');
                    const isModel = (school.category || '').toLowerCase().includes('model') || (school.category || '').toLowerCase().includes('kgbv');

                    const categoryBadgeClass = isGovt
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : isZphs
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : isModel
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                    return (
                      <div
                        key={school.id || school.name}
                        className={`p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          school.isActive === false ? 'opacity-60 bg-slate-950/40' : ''
                        }`}
                      >
                        <div className="space-y-1 flex-grow">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-slate-100 text-sm">{school.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryBadgeClass}`}>
                              {school.category || 'School'}
                            </span>
                            {school.udiseCode && (
                              <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded">
                                U-DISE: {school.udiseCode}
                              </span>
                            )}
                            {school.isActive === false && (
                              <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-900/40 px-2 py-0.5 rounded-full">
                                Inactive (Hidden from students)
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                            {school.location && <span>{school.location}</span>}
                            {school.district && (
                              <>
                                <span>•</span>
                                <span className="text-slate-300">{school.district}</span>
                              </>
                            )}
                            {school.medium && (
                              <>
                                <span>•</span>
                                <span className="text-indigo-400">{school.medium}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleToggleSchoolStatus(school.id, school.isActive ?? true)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                              school.isActive !== false
                                ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            }`}
                            title={school.isActive !== false ? 'Deactivate school' : 'Activate school'}
                          >
                            {school.isActive !== false ? 'Deactivate' : 'Activate'}
                          </button>

                          <button
                            onClick={() => handleDeleteSchool(school.id, school.name)}
                            className="p-1.5 text-slate-600 hover:text-red-400 rounded-lg hover:bg-slate-900 transition cursor-pointer"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* FULL DOSSIER REVIEW MODAL */}
      {selectedReviewCollege && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  <span>Institutional Dossier Review</span>
                </h3>
                <p className="text-xs text-slate-400">ID: {selectedReviewCollege.id} • Registered: {selectedReviewCollege.createdAt ? new Date(selectedReviewCollege.createdAt).toLocaleDateString() : 'Initial Seed'}</p>
              </div>
              <button
                onClick={() => setSelectedReviewCollege(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Profile Overview */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-base font-extrabold text-white">{selectedReviewCollege.name}</h4>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {selectedReviewCollege.ownership} • {selectedReviewCollege.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{selectedReviewCollege.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-900">
                  <p><strong className="text-slate-300">Address:</strong> {selectedReviewCollege.address}</p>
                  <p><strong className="text-slate-300">District:</strong> {selectedReviewCollege.district}</p>
                  <p><strong className="text-slate-300">Affiliation:</strong> {selectedReviewCollege.affiliation}</p>
                  <p><strong className="text-slate-300">Board Code:</strong> {selectedReviewCollege.boardCode || 'N/A'}</p>
                </div>
              </div>

              {/* Representative & Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-300 block uppercase text-[10px]">Authorised Representative</span>
                  <p className="text-slate-200 font-semibold">{selectedReviewCollege.principalName || 'Not specified'}</p>
                  <p className="text-slate-400">{selectedReviewCollege.principalDesignation || 'Principal'}</p>
                  {selectedReviewCollege.principalMessage && (
                    <p className="text-slate-400 italic text-[11px] pt-1">&ldquo;{selectedReviewCollege.principalMessage}&rdquo;</p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-slate-300 block uppercase text-[10px]">Official Contact Desk</span>
                  <p className="text-slate-200">Email: {selectedReviewCollege.email}</p>
                  <p className="text-slate-200">Phone: {selectedReviewCollege.phone}</p>
                  <p className="text-emerald-400 font-medium">WhatsApp: {selectedReviewCollege.whatsappNumber || 'None'}</p>
                  {selectedReviewCollege.website && (
                    <a href={selectedReviewCollege.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline block pt-1">
                      Website: {selectedReviewCollege.website}
                    </a>
                  )}
                </div>
              </div>

              {/* Streams & Fees Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Streams & Fee Structures</h4>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-850 text-slate-400 bg-slate-900/50">
                        <th className="p-2.5">Stream Name</th>
                        <th className="p-2.5">Annual Tuition</th>
                        <th className="p-2.5">Admission Fee</th>
                        <th className="p-2.5">Eligibility Marks</th>
                        <th className="p-2.5">Intake</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {selectedReviewCollege.streams?.map((s, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold text-slate-200">{s.streamName}</td>
                          <td className="p-2.5 text-emerald-400 font-semibold">₹{Number(s.annualFee || 0).toLocaleString('en-IN')}</td>
                          <td className="p-2.5 text-slate-300">₹{Number(s.admissionFee || 0).toLocaleString('en-IN')}</td>
                          <td className="p-2.5 text-slate-400">{s.requiredMarks || 'Pass'}</td>
                          <td className="p-2.5 text-slate-400">{s.intakeSeats || '120'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Facilities Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase">Campus Facilities</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedReviewCollege.hasHostel && <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-full font-medium">✓ Hostel</span>}
                  {selectedReviewCollege.hasTransport && <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-full font-medium">✓ Transport Buses</span>}
                  {selectedReviewCollege.hasLibrary && <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-full font-medium">✓ Library</span>}
                  {selectedReviewCollege.hasLabs && <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-full font-medium">✓ Science Labs</span>}
                  {selectedReviewCollege.hasWifi && <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-full font-medium">✓ Wi-Fi</span>}
                  {selectedReviewCollege.hasSports && <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-indigo-300 rounded-full font-medium">✓ Sports Ground</span>}
                </div>
              </div>

              {/* Documents & Downloads */}
              {selectedReviewCollege.documents && selectedReviewCollege.documents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase">Attached Documents</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedReviewCollege.documents.map((d, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{d.title}</span>
                        {d.url ? (
                          <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            <span>Download PDF</span>
                          </a>
                        ) : (
                          <span className="text-slate-600">No URL</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedReviewCollege(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Dossier
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const reason = prompt('Enter rejection / revision remarks for this college:');
                    if (reason) handleRejectCollege(selectedReviewCollege.id, reason);
                  }}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Reject / Request Revision
                </button>

                {selectedReviewCollege.isApproved && selectedReviewCollege.isLive !== false ? (
                  <button
                    onClick={() => handleToggleCollegeLive(selectedReviewCollege.id, true)}
                    className="px-4 py-2 bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 border border-slate-700 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Pause / Unpublish Profile</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleApproveCollege(selectedReviewCollege.id)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Publish LIVE to Directory</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
