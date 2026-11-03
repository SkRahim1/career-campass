'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthRequiredGate from '@/components/AuthRequiredGate';
import { 
  ClipboardList, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  User, 
  School, 
  Phone, 
  MapPin, 
  Compass, 
  GraduationCap, 
  BookOpen, 
  HelpCircle, 
  Building2, 
  Send, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Star,
  X
} from 'lucide-react';

export default function SurveyPage() {
  const { user, updateProfile } = useAuth();
  const [currentSection, setCurrentSection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [suggestedColleges, setSuggestedColleges] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Form State initialized
  const [formData, setFormData] = useState({
    // Section 1: Student Information
    q1_fullName: user?.name || '',
    q2_schoolName: user?.schoolName || '',
    q3_classSection: '10th - ',
    q4_mobileNumber: user?.mobileNumber || '',
    q5_location: user?.preferredLocation || '',

    // Section 2: Career Aspirations
    q6_careerGoal: '',
    q7_careerReason: '',
    q8_decisionInfluence: '',
    q9_enjoyedSubjects: '',
    q10_clearCareerGoal: '',

    // Section 3: Education After Class 10
    q11_pathAfter10th: '',
    q12_intermediateStream: user?.preferredStream || '',
    q13_streamReason: '',
    q14_streamOpportunitiesAwareness: '',

    // Section 4: Entrance Examinations
    q15_entranceExamsAwareness: '',
    q16_entranceExamsKnown: '',
    q17_planningEntranceExam: '',
    q18_needExamGuidance: '',

    // Section 5: College Preferences
    q19_collegesAwareness: '',
    q20_collegeTypePreference: '',
    q21_studyLocationPreference: '',
    q22_annualBudget: '',

    // Section 6: Career Guidance
    q23_govtScholarshipInfoInterest: '',
    q24_guidanceAreas: [], // Multi-select array
    q25_biggestConfusion: '' // Long answer
  });

  const sections = [
    { id: 1, title: 'Student Information', description: 'Basic details to personalize your guidance', icon: User },
    { id: 2, title: 'Career Aspirations', description: 'Your future dreams, interests, and motivations', icon: Compass },
    { id: 3, title: 'Education After Class 10', description: 'Streams, diplomas, and course preferences', icon: GraduationCap },
    { id: 4, title: 'Entrance Examinations', description: 'POLYCET, APRJC, and competitive exam readiness', icon: BookOpen },
    { id: 5, title: 'College Preferences', description: 'College types, budget, and location preferences', icon: Building2 },
    { id: 6, title: 'Career Guidance & Concerns', description: 'Specific areas where you want guidance', icon: HelpCircle }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMsg('');
  };

  const handleMultiSelectToggle = (field, option) => {
    setFormData(prev => {
      const currentList = prev[field] || [];
      const updatedList = currentList.includes(option)
        ? currentList.filter(item => item !== option)
        : [...currentList, option];
      return { ...prev, [field]: updatedList };
    });
    setErrorMsg('');
  };

  // Section Validation
  const validateCurrentSection = () => {
    if (currentSection === 1) {
      if (!formData.q1_fullName.trim()) return 'Please enter your Full Name.';
      if (!formData.q2_schoolName.trim()) return 'Please enter your School Name.';
      if (!formData.q3_classSection.trim() || formData.q3_classSection === '10th - ') return 'Please enter your Class and Section.';
      if (!formData.q5_location.trim()) return 'Please enter your Location / Area.';
      // Note: Mobile number (Q4) is optional contact details as requested.
    } else if (currentSection === 2) {
      if (!formData.q6_careerGoal) return 'Please select what you want to become in the future (Q6).';
      if (!formData.q7_careerReason) return 'Please tell us why you are interested in this career (Q7).';
      if (!formData.q8_decisionInfluence) return 'Please select who influences your career decision most (Q8).';
      if (!formData.q9_enjoyedSubjects) return 'Please select which subjects you enjoy most (Q9).';
      if (!formData.q10_clearCareerGoal) return 'Please indicate if you have a clear career goal (Q10).';
    } else if (currentSection === 3) {
      if (!formData.q11_pathAfter10th) return 'Please select what you would like to pursue after Class 10 (Q11).';
      if (!formData.q12_intermediateStream) return 'Please select your preferred stream (Q12).';
      if (!formData.q13_streamReason) return 'Please select why you want to choose this stream (Q13).';
      if (!formData.q14_streamOpportunitiesAwareness) return 'Please indicate your awareness of career opportunities (Q14).';
    } else if (currentSection === 4) {
      if (!formData.q15_entranceExamsAwareness) return 'Please answer Q15 about entrance exams.';
      if (!formData.q16_entranceExamsKnown) return 'Please answer Q16 about which exams you have heard about.';
      if (!formData.q17_planningEntranceExam) return 'Please answer Q17 about planning to write entrance exams.';
      if (!formData.q18_needExamGuidance) return 'Please answer Q18 about entrance examination guidance.';
    } else if (currentSection === 5) {
      if (!formData.q19_collegesAwareness) return 'Please answer Q19 about colleges awareness.';
      if (!formData.q20_collegeTypePreference) return 'Please answer Q20 about college type preference.';
      if (!formData.q21_studyLocationPreference) return 'Please answer Q21 about preferred study location.';
      if (!formData.q22_annualBudget) return 'Please answer Q22 about your annual education budget.';
    } else if (currentSection === 6) {
      if (!formData.q23_govtScholarshipInfoInterest) return 'Please answer Q23 about scholarships information.';
      if (formData.q24_guidanceAreas.length === 0) return 'Please select at least one area where you need guidance (Q24).';
      // Q25 is long answer - recommended
    }
    return null;
  };

  const handleNext = () => {
    const error = validateCurrentSection();
    if (error) {
      setErrorMsg(error);
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }
    setErrorMsg('');
    setCurrentSection(prev => Math.min(prev + 1, sections.length));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setErrorMsg('');
    setCurrentSection(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateCurrentSection();
    if (error) {
      setErrorMsg(error);
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const { collection, addDoc, serverTimestamp, doc, updateDoc, getDocs } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');

      const surveySubmission = {
        ...formData,
        submittedAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        userId: user?.uid || null,
        userEmail: user?.email || null,
        source: 'web_student_survey'
      };

      // 1. Try to record in 'surveys' collection
      try {
        await addDoc(collection(db, 'surveys'), surveySubmission);
      } catch (firestoreErr) {
        console.warn('Could not write to surveys collection directly:', firestoreErr);
      }

      // 2. If user is logged in, mark survey as completed and update their preferences
      if (user?.uid) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, {
            hasCompletedSurvey: true,
            schoolName: formData.q2_schoolName || user.schoolName || null,
            preferredStream: formData.q12_intermediateStream || user.preferredStream || null,
            preferredLocation: formData.q5_location || user.preferredLocation || null,
            careerGoal: formData.q6_careerGoal || null,
            surveyResponses: { ...formData }
          });

          if (updateProfile) {
            await updateProfile({
              hasCompletedSurvey: true,
              schoolName: formData.q2_schoolName,
              preferredStream: formData.q12_intermediateStream,
              preferredLocation: formData.q5_location,
              careerGoal: formData.q6_careerGoal
            });
          }
        } catch (profileErr) {
          console.warn('Could not update user document:', profileErr);
        }
      }

      // 3. Fetch college recommendations based on stream and location
      try {
        const colSnap = await getDocs(collection(db, 'colleges'));
        const allCols = [];
        colSnap.forEach(d => allCols.push({ id: d.id, ...d.data() }));

        const stream = (formData.q12_intermediateStream || '').toUpperCase();
        let matched = allCols.filter(c => {
          if (stream && stream !== 'NOT SURE') {
            return c.streams?.some(s => s.streamName?.toUpperCase().includes(stream));
          }
          return false;
        });

        if (formData.q5_location) {
          const locMatched = matched.filter(c => 
            (c.address || '').toLowerCase().includes(formData.q5_location.toLowerCase())
          );
          if (locMatched.length > 0) {
            matched = [...locMatched, ...matched.filter(c => !locMatched.includes(c))];
          }
        }

        const topColleges = (matched.length > 0 ? matched : allCols).slice(0, 3);
        setSuggestedColleges(topColleges);
      } catch (cErr) {
        console.warn('Could not query colleges:', cErr);
      }

      setSubmitted(true);
      setShowPopup(true);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } catch (err) {
      console.error('Error submitting survey:', err);
      // Fallback: still show the completion screen & recommendations so student is not stuck
      setSubmitted(true);
      setShowPopup(true);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form for the next student to fill one-by-one!
  const handleResetForNextStudent = () => {
    setFormData({
      q1_fullName: '',
      q2_schoolName: '',
      q3_classSection: '10th - ',
      q4_mobileNumber: '',
      q5_location: '',
      q6_careerGoal: '',
      q7_careerReason: '',
      q8_decisionInfluence: '',
      q9_enjoyedSubjects: '',
      q10_clearCareerGoal: '',
      q11_pathAfter10th: '',
      q12_intermediateStream: '',
      q13_streamReason: '',
      q14_streamOpportunitiesAwareness: '',
      q15_entranceExamsAwareness: '',
      q16_entranceExamsKnown: '',
      q17_planningEntranceExam: '',
      q18_needExamGuidance: '',
      q19_collegesAwareness: '',
      q20_collegeTypePreference: '',
      q21_studyLocationPreference: '',
      q22_annualBudget: '',
      q23_govtScholarshipInfoInterest: '',
      q24_guidanceAreas: [],
      q25_biggestConfusion: ''
    });
    setCurrentSection(1);
    setSubmitted(false);
    setShowPopup(false);
    setSuggestedColleges([]);
    setErrorMsg('');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Helper component for single-choice option pill/card (Mobile-First Touch Target)
  const OptionCard = ({ field, value, label, isSelected }) => (
    <button
      type="button"
      onClick={() => handleInputChange(field, value)}
      className={`w-full min-h-[48px] p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer select-none active:scale-[0.98] ${
        isSelected
          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/40'
          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      <span className="text-xs sm:text-sm font-medium leading-snug">{label}</span>
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition ${
        isSelected ? 'border-indigo-500 bg-indigo-600 text-white shadow-xs' : 'border-slate-700 bg-slate-950'
      }`}>
        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
      </div>
    </button>
  );

  // Helper for compact 3-column option cards (Yes/No/Maybe) on mobile
  const CompactOptionCard = ({ field, value, label, isSelected }) => (
    <button
      type="button"
      onClick={() => handleInputChange(field, value)}
      className={`w-full min-h-[46px] p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-center transition-all duration-150 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 cursor-pointer select-none active:scale-[0.98] ${
        isSelected
          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/40'
          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      <span className="text-xs sm:text-sm font-bold">{label}</span>
      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
        isSelected ? 'border-indigo-500 bg-indigo-600 text-white' : 'border-slate-700 bg-slate-950'
      }`}>
        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
      </div>
    </button>
  );

  // Helper for multi-select option (Mobile-First Touch Target)
  const MultiOptionCard = ({ field, value, label, isSelected }) => (
    <button
      type="button"
      onClick={() => handleMultiSelectToggle(field, value)}
      className={`w-full min-h-[48px] p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer select-none active:scale-[0.98] ${
        isSelected
          ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-md shadow-purple-500/10 ring-1 ring-purple-500/40'
          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
      }`}
    >
      <span className="text-xs sm:text-sm font-medium leading-snug">{label}</span>
      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition ${
        isSelected ? 'border-purple-500 bg-purple-600 text-white shadow-xs' : 'border-slate-700 bg-slate-950'
      }`}>
        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </div>
    </button>
  );

  if (submitted) {
    return (
      <AuthRequiredGate
        featureName="Class 10 Student Survey"
        featureDescription="Sign in or register to take the 25-Question Class 10 diagnostic survey and get personalized college suggestions."
        iconName="survey"
        redirectPath="/survey"
      >
        <div className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full text-center space-y-8 bg-grid-pattern bg-radial-gradient flex-grow">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-extrabold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full">
              Survey Completed Successfully
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-display">
              Thank You, {formData.q1_fullName}!
            </h1>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Your responses have been recorded securely. Our guidance system uses this information to help design your educational journey after Class 10.
            </p>
          </div>

          {/* Personalized Insights Summary */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 text-left space-y-3 text-xs">
            <p className="font-bold text-slate-300 flex items-center gap-1.5 uppercase text-[10px] tracking-wider text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Survey Snapshot</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Aspirations:</span>
                <span className="text-slate-200 font-bold">{formData.q6_careerGoal || 'Exploring options'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Preferred Stream:</span>
                <span className="text-slate-200 font-bold">{formData.q12_intermediateStream || 'General Guidance'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Path After 10th:</span>
                <span className="text-slate-200 font-bold">{formData.q11_pathAfter10th || 'Intermediate'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Annual Budget:</span>
                <span className="text-slate-200 font-bold">{formData.q22_annualBudget || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setShowPopup(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>View College Suggestions Popup</span>
            </button>
            <Link
              href="/colleges"
              className="bg-slate-950 hover:bg-slate-850 text-slate-200 border border-slate-800 font-bold p-3.5 rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>Browse All Colleges</span>
            </Link>
          </div>

          {/* Fill Next Student Response Button */}
          <div className="border-t border-slate-800/80 pt-6">
            <button
              onClick={handleResetForNextStudent}
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold text-xs p-3 rounded-xl hover:bg-indigo-950/30 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Fill Survey for Next Student (One by One)</span>
            </button>
            <p className="text-[10px] text-slate-500 mt-1">
              Use this if multiple students in your school or classroom are taking turns.
            </p>
          </div>
        </div>

        {/* ============================================================
            College Suggestions Popup Modal (Auto-pops up right after submit!)
        ============================================================ */}
        {showPopup && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-left relative overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Top decorative gradient bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              {/* Close Button */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="space-y-2 pr-8">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant College Suggestions</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-display">
                  Great job, {formData.q1_fullName || 'Student'}!
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Based on your goal to become a <strong className="text-purple-300">{formData.q6_careerGoal || 'Professional'}</strong> and your preferred stream <strong className="text-indigo-300">{formData.q12_intermediateStream || 'your choice'}</strong>, here are top college recommendations in Hyderabad matching your profile:
                </p>
              </div>

              {/* Suggested Colleges List */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Top College Matches for You</span>
                </h3>

                {suggestedColleges.length === 0 ? (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 text-xs">
                    Loading recommended colleges...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {suggestedColleges.map((col) => {
                      const feeStream = col.streams?.find(s => 
                        s.streamName?.toUpperCase().includes((formData.q12_intermediateStream || '').toUpperCase())
                      ) || col.streams?.[0];

                      return (
                        <div 
                          key={col.id}
                          className="bg-slate-950 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-4 transition flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] uppercase font-extrabold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                {col.ownership || 'COLLEGE'}
                              </span>
                              <span className="text-slate-400 text-[10px] font-semibold flex items-center gap-0.5">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span>{col.averageRating || '4.0'}</span>
                              </span>
                            </div>
                            <h4 className="text-slate-100 font-bold text-sm leading-snug">
                              {col.name}
                            </h4>
                            <p className="text-slate-500 text-[11px] flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                              <span>{col.address || 'Hyderabad, Telangana'}</span>
                            </p>
                          </div>

                          <div className="sm:text-right shrink-0 flex sm:flex-col justify-between items-center sm:items-end gap-2 border-t sm:border-t-0 border-slate-900 pt-2 sm:pt-0">
                            {feeStream && (
                              <div className="text-left sm:text-right">
                                <span className="text-[9px] text-slate-500 block uppercase">Annual Fee:</span>
                                <span className="text-emerald-400 font-extrabold text-xs">
                                  ₹{feeStream.annualFee ? feeStream.annualFee.toLocaleString('en-IN') : 'Nominal'} / yr
                                </span>
                              </div>
                            )}
                            <Link
                              href={`/colleges/${col.id}`}
                              className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                            >
                              View College →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons in Modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href="/colleges"
                  onClick={() => setShowPopup(false)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-xl transition text-xs text-center shadow-md flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Explore All Colleges</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold p-3 rounded-xl transition text-xs text-center cursor-pointer"
                >
                  Close & View Summary
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </AuthRequiredGate>
    );
  }

  return (
    <AuthRequiredGate
      featureName="Class 10 Student Survey"
      featureDescription="Sign in or register to take the 25-Question Class 10 diagnostic survey and get personalized college suggestions."
      iconName="survey"
      redirectPath="/survey"
    >
      <div className="bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8 bg-grid-pattern bg-radial-gradient flex-grow text-left">
      
      {/* First-time Student Welcome Banner */}
      {user && !user.hasCompletedSurvey && (
        <div className="bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-sm">
          <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-left text-xs">
            <p className="text-slate-100 font-bold">
              Welcome to Career Compass 365, {user.name}!
            </p>
            <p className="text-slate-300 leading-relaxed">
              As a newly registered student, please fill out this quick 5-minute survey. Your responses unlock tailored college suggestions and admission alerts right after completion.
            </p>
          </div>
        </div>
      )}

      {/* Survey Title & Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3.5 py-1 rounded-full text-xs font-semibold">
          <ClipboardList className="w-4 h-4" />
          <span>Class 10 Student Survey • 25 Questions · 5–7 Minutes</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-display">
          Discover Your Path. Design Your Future.
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          This survey aims to understand your interests, future goals and educational preferences after Class 10. Your responses will help us provide better career guidance and college information.
        </p>
      </div>

      {/* Progress Bar & Section Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
          <div>
            <span className="text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              Section {currentSection} of {sections.length}:
            </span>
            <h2 className="text-slate-100 font-extrabold text-base flex items-center gap-2 mt-0.5">
              <span>{sections[currentSection - 1].title}</span>
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">{sections[currentSection - 1].description}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-indigo-400 font-bold text-sm">
              {Math.round((currentSection / sections.length) * 100)}% Complete
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-300"
            style={{ width: `${(currentSection / sections.length) * 100}%` }}
          />
        </div>

        {/* Section Indicators */}
        <div className="grid grid-cols-6 gap-1.5 pt-1">
          {sections.map(s => (
            <div 
              key={s.id} 
              className={`h-1.5 rounded-full transition ${
                s.id < currentSection 
                  ? 'bg-emerald-500' 
                  : s.id === currentSection 
                    ? 'bg-indigo-500' 
                    : 'bg-slate-800'
              }`} 
            />
          ))}
        </div>
      </div>

      {/* Error Alert if validation fails */}
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3 text-xs text-red-400 shadow-sm animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Content Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        
        {/* ============================================================
            SECTION 1: Student Information (Q1 - Q5)
        ============================================================ */}
        {currentSection === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-400">Section 1</span>
              <h3 className="text-lg font-bold text-slate-100 mt-1">Student Information</h3>
              <p className="text-xs text-slate-400 mt-0.5">Please provide your school and basic contact details.</p>
            </div>

            {/* Q1: Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                1. Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Kumar"
                  value={formData.q1_fullName}
                  onChange={(e) => handleInputChange('q1_fullName', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm transition"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Q2: School Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                2. School Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. ZP High School, Uppal / Govt High School"
                  value={formData.q2_schoolName}
                  onChange={(e) => handleInputChange('q2_schoolName', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm transition"
                />
                <School className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Q3: Class and Section */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                3. Class and Section <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. 10th - A / 10th - B"
                  value={formData.q3_classSection}
                  onChange={(e) => handleInputChange('q3_classSection', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm transition"
                />
                <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Q4: Mobile Number (Optional) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-200">
                  4. Mobile Number
                </label>
                <span className="text-[10px] text-slate-500 italic">Optional Contact Detail</span>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="e.g. 9876543210 (For updates & notifications)"
                  value={formData.q4_mobileNumber}
                  onChange={(e) => handleInputChange('q4_mobileNumber', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm transition"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Q5: Location / Area */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                5. Location / Area <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Charminar, Kukatpally, Secunderabad, Dilsukhnagar"
                  value={formData.q5_location}
                  onChange={(e) => handleInputChange('q5_location', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm transition"
                />
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            SECTION 2: Career Aspirations (Q6 - Q10)
        ============================================================ */}
        {currentSection === 2 && (
          <div className="space-y-8">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-400">Section 2</span>
              <h3 className="text-lg font-bold text-slate-100 mt-1">Career Aspirations</h3>
              <p className="text-xs text-slate-400 mt-0.5">Tell us about what inspires you and where you see yourself.</p>
            </div>

            {/* Q6 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                6. What do you want to become in the future? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Doctor',
                  'Engineer',
                  'Teacher / Professor',
                  'IAS / IPS Officer',
                  'Police / Defence Officer',
                  'Lawyer',
                  'Business Owner / Entrepreneur',
                  'Software Developer / IT Professional',
                  'Scientist',
                  'Accountant / Finance Professional',
                  'Sports Professional',
                  'Designer / Artist',
                  'Government Employee',
                  'Other',
                  'Not decided yet'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q6_careerGoal"
                    value={opt}
                    label={opt}
                    isSelected={formData.q6_careerGoal === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q7 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                7. Why are you interested in this career? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Personal interest',
                  'Passion',
                  'Good salary',
                  'Job security',
                  'Family suggestion',
                  'Other',
                  'Not sure'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q7_careerReason"
                    value={opt}
                    label={opt}
                    isSelected={formData.q7_careerReason === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q8 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                8. Who influences your career decisions the most? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  'Myself',
                  'Parents',
                  'Teachers',
                  'Friends',
                  'Relatives',
                  'Others'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q8_decisionInfluence"
                    value={opt}
                    label={opt}
                    isSelected={formData.q8_decisionInfluence === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q9 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                9. Which subjects do you enjoy the most? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  'Mathematics',
                  'Science',
                  'English',
                  'Social Studies',
                  'Computer Science',
                  'Languages',
                  'Other'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q9_enjoyedSubjects"
                    value={opt}
                    label={opt}
                    isSelected={formData.q9_enjoyedSubjects === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q10 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                10. Do you already have a clear career goal? <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {[
                  'Yes',
                  'No',
                  'I have a few options but need guidance'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q10_clearCareerGoal"
                    value={opt}
                    label={opt}
                    isSelected={formData.q10_clearCareerGoal === opt}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            SECTION 3: Education After Class 10 (Q11 - Q14)
        ============================================================ */}
        {currentSection === 3 && (
          <div className="space-y-8">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-400">Section 3</span>
              <h3 className="text-lg font-bold text-slate-100 mt-1">Education After Class 10</h3>
              <p className="text-xs text-slate-400 mt-0.5">Streams, polytechnic, and immediate educational path.</p>
            </div>

            {/* Q11 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                11. What would you like to pursue after Class 10? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Intermediate (11th and 12th)',
                  'Polytechnic Diploma',
                  'ITI',
                  'Vocational Courses',
                  'Other Professional Courses',
                  'Not decided yet'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q11_pathAfter10th"
                    value={opt}
                    label={opt}
                    isSelected={formData.q11_pathAfter10th === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q12 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                12. Which Intermediate stream would you prefer? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  'MPC',
                  'BiPC',
                  'MEC',
                  'CEC',
                  'HEC',
                  'Vocational',
                  'Not sure'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q12_intermediateStream"
                    value={opt}
                    label={opt}
                    isSelected={formData.q12_intermediateStream === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q13 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                13. Why do you want to choose this stream? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Related to my career goal',
                  'Personal interest',
                  'Parents\' suggestion',
                  'Teachers\' suggestion',
                  'Friends\' choice',
                  'I don\'t know enough about the streams'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q13_streamReason"
                    value={opt}
                    label={opt}
                    isSelected={formData.q13_streamReason === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q14 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                14. Do you know what career opportunities are available in your preferred stream? <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {[
                  'Yes, completely',
                  'I know a little',
                  'No, I need guidance'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q14_streamOpportunitiesAwareness"
                    value={opt}
                    label={opt}
                    isSelected={formData.q14_streamOpportunitiesAwareness === opt}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            SECTION 4: Entrance Examinations (Q15 - Q18)
        ============================================================ */}
        {currentSection === 4 && (
          <div className="space-y-8">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-400">Section 4</span>
              <h3 className="text-lg font-bold text-slate-100 mt-1">Entrance Examinations</h3>
              <p className="text-xs text-slate-400 mt-0.5">POLYCET, residential schools, and competitive tests.</p>
            </div>

            {/* Q15 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                15. Have you heard about entrance examinations for admission after Class 10? <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {[
                  'Yes',
                  'No',
                  'I have heard about some'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q15_entranceExamsAwareness"
                    value={opt}
                    label={opt}
                    isSelected={formData.q15_entranceExamsAwareness === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q16 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                16. Which entrance examinations have you heard about? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'POLYCET',
                  'TG APRJC CET',
                  'Other residential junior college entrance examinations',
                  'College-specific entrance examinations',
                  'None of these'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q16_entranceExamsKnown"
                    value={opt}
                    label={opt}
                    isSelected={formData.q16_entranceExamsKnown === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q17 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                17. Are you planning to write any entrance examination? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {[
                  'Yes',
                  'No',
                  'Not sure'
                ].map(opt => (
                  <CompactOptionCard
                    key={opt}
                    field="q17_planningEntranceExam"
                    value={opt}
                    label={opt}
                    isSelected={formData.q17_planningEntranceExam === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q18 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                18. Would you like guidance about entrance examinations, eligibility and preparation? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {[
                  'Yes',
                  'No',
                  'Maybe'
                ].map(opt => (
                  <CompactOptionCard
                    key={opt}
                    field="q18_needExamGuidance"
                    value={opt}
                    label={opt}
                    isSelected={formData.q18_needExamGuidance === opt}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            SECTION 5: College Preferences (Q19 - Q22)
        ============================================================ */}
        {currentSection === 5 && (
          <div className="space-y-8">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-400">Section 5</span>
              <h3 className="text-lg font-bold text-slate-100 mt-1">College Preferences</h3>
              <p className="text-xs text-slate-400 mt-0.5">Budget, locations, and type of institution.</p>
            </div>

            {/* Q19 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                19. Do you know any colleges where you can study after Class 10? <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {[
                  'Yes, many',
                  'I know a few',
                  'No, I need help finding colleges'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q19_collegesAwareness"
                    value={opt}
                    label={opt}
                    isSelected={formData.q19_collegesAwareness === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q20 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                20. What type of college would you prefer? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Government Junior College',
                  'Government Residential College',
                  'Private Junior College',
                  'Corporate Junior College',
                  'Polytechnic College',
                  'Any good college'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q20_collegeTypePreference"
                    value={opt}
                    label={opt}
                    isSelected={formData.q20_collegeTypePreference === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q21 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                21. Where would you prefer to study? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Near my home',
                  'Anywhere in Hyderabad',
                  'Anywhere in Telangana',
                  'Outside Telangana',
                  'Anywhere in India'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q21_studyLocationPreference"
                    value={opt}
                    label={opt}
                    isSelected={formData.q21_studyLocationPreference === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q22 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                22. What is your preferred annual education budget? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Below ₹10,000',
                  '₹10,000–₹25,000',
                  '₹25,000–₹50,000',
                  '₹50,000–₹1,00,000',
                  'Above ₹1,00,000',
                  'Prefer government / scholarship-supported education',
                  'Not sure'
                ].map(opt => (
                  <OptionCard
                    key={opt}
                    field="q22_annualBudget"
                    value={opt}
                    label={opt}
                    isSelected={formData.q22_annualBudget === opt}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            SECTION 6: Career Guidance (Q23 - Q25)
        ============================================================ */}
        {currentSection === 6 && (
          <div className="space-y-8">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-400">Section 6</span>
              <h3 className="text-lg font-bold text-slate-100 mt-1">Career Guidance & Next Steps</h3>
              <p className="text-xs text-slate-400 mt-0.5">Let us know how we can best support your aspirations.</p>
            </div>

            {/* Q23 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-200">
                23. Would you like information about government colleges, scholarships and fee reimbursement schemes? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {[
                  'Yes',
                  'No',
                  'Maybe'
                ].map(opt => (
                  <CompactOptionCard
                    key={opt}
                    field="q23_govtScholarshipInfoInterest"
                    value={opt}
                    label={opt}
                    isSelected={formData.q23_govtScholarshipInfoInterest === opt}
                  />
                ))}
              </div>
            </div>

            {/* Q24 - MULTI SELECT */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-200">
                  24. Which areas do you need guidance in? <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded font-bold">
                  Select all that apply
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Choosing the right stream',
                  'Understanding career options',
                  'Finding government colleges',
                  'Finding private colleges',
                  'College eligibility and admission',
                  'Entrance examinations',
                  'Scholarships',
                  'Future job opportunities'
                ].map(opt => (
                  <MultiOptionCard
                    key={opt}
                    field="q24_guidanceAreas"
                    value={opt}
                    label={opt}
                    isSelected={formData.q24_guidanceAreas.includes(opt)}
                  />
                ))}
              </div>
            </div>

            {/* Q25 - LONG ANSWER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-200">
                  25. What is your biggest confusion or concern about your future after Class 10?
                </label>
                <span className="text-[10px] text-slate-500">Long Answer</span>
              </div>
              <textarea
                rows={4}
                value={formData.q25_biggestConfusion}
                onChange={(e) => handleInputChange('q25_biggestConfusion', e.target.value)}
                placeholder="Share your doubts freely, e.g. 'I am confused whether to choose MPC or Polytechnic', or 'I am worried about private college fee expenses'..."
                className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm leading-relaxed transition"
              />
              <p className="text-[10px] text-slate-500">
                Your responses will be kept confidential and used solely for educational guidance and college discovery.
              </p>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons - Mobile-First Floating Dock */}
        <div className="sticky bottom-0 z-20 bg-slate-950/95 backdrop-blur-md -mx-4 -mb-6 p-4 border-t border-slate-800/80 sm:static sm:bg-transparent sm:backdrop-blur-none sm:mx-0 sm:mb-0 sm:p-0 sm:border-t sm:border-slate-800 sm:pt-6 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2.5 sm:gap-4 shadow-lg sm:shadow-none">
          <div>
            {currentSection > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Section</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentSection < sections.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition cursor-pointer active:scale-95"
              >
                <span>Continue: {sections[currentSection].title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-500/25 transition cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting Responses...' : 'Submit Survey'}</span>
              </button>
            )}
          </div>
        </div>

      </form>

      {/* Footer Advisory */}
      <div className="text-center text-[11px] text-slate-500 space-y-1">
        <p>Participation is voluntary. Please complete the survey with your parent&apos;s or guardian&apos;s awareness.</p>
        <p className="font-semibold text-slate-400">Career Compass 365 • Discover Your Path. Design Your Future.</p>
      </div>

      </div>
    </AuthRequiredGate>
  );
}
