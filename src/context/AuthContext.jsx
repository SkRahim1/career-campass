'use client';

/**
 * SECURITY NOTE — Auth Flow:
 * - `onAuthStateChanged` is the SOLE source of truth for user identity and role.
 * - localStorage is used ONLY as a performance cache for name/email pre-fill.
 *   It NEVER determines role, permissions, or authentication state.
 * - Roles are always read from Firestore documents; they are never inferred from
 *   email patterns or derived from localStorage on mount.
 * - New user registrations default to role 'STUDENT'.
 *   College representatives are assigned role 'PENDING_COLLEGE_ADMIN' until
 *   an admin approves them.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// Pre-configured default demo accounts for reference/display purposes.
// NOTE: Passwords have been removed from this export — they must NOT appear in
// the client bundle. All login (including demo accounts) goes through Firebase Auth.
export const DEFAULT_ACCOUNTS = {
  'rahul@gmail.com': {
    email: 'rahul@gmail.com',
    role: 'STUDENT',
    uid: 'student-default-uid',
    name: 'Rahul Kumar',
    mobileNumber: '9876543210',
    schoolName: 'Zilla Parishad High School, Hyderabad',
    percentage10th: 88.5,
    preferredStream: 'MPC',
    preferredLocation: 'Madhapur',
    budget: 35000,
    hostelRequired: false,
    savedColleges: ['6526', '6527', '6528'],
    hasCompletedSurvey: true
  },
  'admin@career365compass.com': {
    email: 'admin@career365compass.com',
    role: 'SUPER_ADMIN',
    uid: 'admin-default-uid',
    name: 'Super Admin',
    mobileNumber: '9999999999'
  },
  'college@career365compass.com': {
    email: 'college@career365compass.com',
    role: 'COLLEGE_ADMIN',
    uid: 'college-default-uid',
    name: 'Dr. K. V. Rao',
    designation: 'Principal & Admissions In-charge',
    mobileNumber: '9848012345',
    collegeId: '6526',
    collegeName: 'Government Junior College, Falaknuma'
  },
  'admissions@college.edu.in': {
    email: 'admissions@college.edu.in',
    role: 'COLLEGE_ADMIN',
    uid: 'college-default-uid',
    name: 'Dr. K. V. Rao',
    designation: 'Principal & Admissions In-charge',
    mobileNumber: '9848012345',
    collegeId: '6526',
    collegeName: 'Government Junior College, Falaknuma'
  }
};

// --- FIX H4: Module-level rate-limiter state (not persisted to localStorage) ---
let _loginFailedAttempts = 0;
let _loginWindowStart = 0;
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 60 * 1000; // 60 seconds

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Firebase onAuthStateChanged is the SOLE source of truth for user state.
  //    localStorage is NOT used to set user role or authenticate on mount.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          let profile = null;
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              profile = { ...userDoc.data(), uid: firebaseUser.uid };
            }
          } catch (fsErr) {
            console.warn('Firestore session lookup warning (falling back gracefully):', fsErr.message);
          }

          // FIX H1: If no Firestore document exists, default role is 'STUDENT'.
          // Role is NEVER inferred from email patterns.
          if (!profile) {
            const cleanEmail = (firebaseUser.email || '').toLowerCase();
            profile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || cleanEmail.split('@')[0] || 'Student User',
              email: firebaseUser.email,
              role: 'STUDENT',
              mobileNumber: firebaseUser.phoneNumber || '',
              savedColleges: [],
              hasCompletedSurvey: false
            };
          }

          setUser(profile);
          // Cache only non-sensitive display data for pre-fill purposes
          if (typeof window !== 'undefined') {
            localStorage.setItem('career365_user', JSON.stringify({
              name: profile.name,
              email: profile.email
            }));
          }
        } else {
          // Firebase says no authenticated user — always clear user state.
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('career365_user');
          }
        }
      } catch (err) {
        console.warn('Session resolution caught warning:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Login — all accounts (including demo) authenticated via Firebase Auth.
  //    FIX H4: Client-side rate limiting on failed attempts.
  //    FIX M4: Generic error messages to prevent user enumeration.
  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // FIX H4: Rate limit check
    const now = Date.now();
    if (now - _loginWindowStart > LOGIN_WINDOW_MS) {
      // Window has expired — reset counters
      _loginFailedAttempts = 0;
      _loginWindowStart = now;
    }
    if (_loginFailedAttempts >= LOGIN_MAX_ATTEMPTS) {
      throw new Error('Too many failed login attempts. Please wait before trying again.');
    }

    // All accounts (including demo) go through Firebase Auth
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const firebaseUser = userCredential.user;

      // Reset rate-limit counter on success
      _loginFailedAttempts = 0;
      _loginWindowStart = 0;

      let profile = null;
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          profile = userDoc.data();
        } else {
          // FIX H1: No email-based role inference; default to 'STUDENT'
          profile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || cleanEmail.split('@')[0],
            email: firebaseUser.email,
            role: 'STUDENT',
            savedColleges: []
          };
          try {
            await setDoc(doc(db, 'users', firebaseUser.uid), profile);
          } catch (writeErr) {
            console.warn('Could not write user profile to Firestore:', writeErr.message);
          }
        }
      } catch (firestoreErr) {
        console.warn('Firestore user fetch failed, using minimal fallback profile:', firestoreErr.message);
        // FIX H1: Fallback also defaults to 'STUDENT', never email-inferred role
        profile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || cleanEmail.split('@')[0],
          email: firebaseUser.email,
          role: 'STUDENT',
          savedColleges: []
        };
      }

      const fullUser = { ...profile, uid: firebaseUser.uid };
      setUser(fullUser);
      // Cache only display data, not role
      if (typeof window !== 'undefined') {
        localStorage.setItem('career365_user', JSON.stringify({
          name: fullUser.name,
          email: fullUser.email
        }));
      }
      router.refresh();
      return fullUser;
    } catch (err) {
      // FIX M4: Generic error for auth/user-not-found and auth/wrong-password
      // so we don't reveal whether an email address exists in the system.
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        _loginFailedAttempts++;
        if (_loginWindowStart === 0) _loginWindowStart = Date.now();
        throw new Error('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please wait a moment before trying again.');
      } else if (err.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.');
      }
      // Re-throw rate-limit errors from above without incrementing counter
      if (err.message === 'Too many failed login attempts. Please wait before trying again.') {
        throw err;
      }
      _loginFailedAttempts++;
      if (_loginWindowStart === 0) _loginWindowStart = Date.now();
      throw new Error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  // 3. Student Registration
  //    FIX H6: Do NOT silently sign in on email-already-in-use; re-throw a clear error.
  const register = async (userData) => {
    const { email, password, name, mobileNumber, schoolName, percentage10th, preferredStream, preferredLocation, budget, hostelRequired } = userData;
    const cleanEmail = (email || '').trim().toLowerCase();

    try {
      let firebaseUser = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        firebaseUser = userCredential.user;
      } catch (authErr) {
        if (authErr.code === 'auth/email-already-in-use') {
          // FIX H6: Do NOT attempt silent login — surface the error to the user
          throw new Error('An account with this email already exists. Please sign in instead.');
        } else {
          throw authErr;
        }
      }

      const newProfile = {
        uid: firebaseUser?.uid || 'user-' + Date.now(),
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        mobileNumber: mobileNumber || '',
        role: 'STUDENT', // FIX H1: Always 'STUDENT' for new registrations
        schoolName: schoolName || null,
        percentage10th: percentage10th ? parseFloat(percentage10th) : null,
        preferredStream: preferredStream || null,
        preferredLocation: preferredLocation || null,
        budget: budget ? parseFloat(budget) : null,
        hostelRequired: !!hostelRequired,
        savedColleges: [],
        hasCompletedSurvey: false
      };

      try {
        if (firebaseUser) {
          await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
        }
      } catch (fsErr) {
        console.warn('Firestore write warning during registration:', fsErr.message);
      }

      setUser(newProfile);
      // Cache only display data, not role
      if (typeof window !== 'undefined') {
        localStorage.setItem('career365_user', JSON.stringify({
          name: newProfile.name,
          email: newProfile.email
        }));
      }
      router.refresh();
      return newProfile;
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        throw new Error('Password must be at least 6 characters long.');
      }
      throw new Error(err.message || 'Registration failed. Please try again.');
    }
  };

  // 4. College Representative Registration
  //    FIX H2: Assigns 'PENDING_COLLEGE_ADMIN' — requires admin approval before elevated access.
  //    FIX H6: Do NOT silently sign in on email-already-in-use; re-throw a clear error.
  const registerCollege = async (representativeData, collegeData) => {
    const { email, password, representativeName, designation, phone, mobileNumber } = representativeData;
    const cleanEmail = (email || '').trim().toLowerCase();

    try {
      let firebaseUser = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        firebaseUser = userCredential.user;
      } catch (authErr) {
        if (authErr.code === 'auth/email-already-in-use') {
          // FIX H6: Do NOT attempt silent login — surface the error to the user
          throw new Error('An account with this institutional email already exists. Please sign in instead.');
        } else {
          throw authErr;
        }
      }

      const timestamp = Date.now();
      const collegeId = `col-${timestamp}`;

      const newCollege = {
        id: collegeId,
        name: collegeData.name || 'Unnamed Institution',
        shortName: collegeData.shortName || '',
        ownership: collegeData.ownership || 'PRIVATE',
        category: collegeData.category || 'JUNIOR_COLLEGE',
        description: collegeData.description || 'Welcome to our institution. Contact admissions for details on offered courses and streams.',
        establishedYear: collegeData.establishedYear ? parseInt(collegeData.establishedYear) : new Date().getFullYear(),
        address: collegeData.address || '',
        nearbyLandmark: collegeData.nearbyLandmark || '',
        district: collegeData.district || 'Hyderabad',
        state: collegeData.state || 'Telangana',
        pincode: collegeData.pincode || '',
        googleMapsUrl: collegeData.googleMapsUrl || '',
        principalName: collegeData.principalName || representativeName || '',
        principalDesignation: collegeData.principalDesignation || designation || 'Principal / Authorised Representative',
        principalMessage: collegeData.principalMessage || 'We welcome ambitious students and empower them towards academic and career excellence.',
        phone: collegeData.phone || phone || mobileNumber || '',
        email: cleanEmail,
        whatsappNumber: collegeData.whatsappNumber || phone || mobileNumber || '',
        website: collegeData.website || '',
        affiliation: collegeData.affiliation || 'Board of Intermediate Education, Telangana (TSBIE)',
        boardCode: collegeData.boardCode || '',
        recognitionDetails: collegeData.recognitionDetails || 'Recognized by Government of Telangana',
        logoUrl: collegeData.logoUrl || '',
        coverImageUrl: collegeData.coverImageUrl || '',
        gallery: collegeData.gallery || [],
        genderType: collegeData.genderType || 'CO_ED',
        streams: collegeData.streams && collegeData.streams.length > 0 ? collegeData.streams : [
          { streamName: 'MPC', courseType: 'Intermediate', annualFee: 35000, admissionFee: 5000, otherCharges: 2000, minQualification: '10th Class Pass', requiredMarks: '60% or Grade B+', admissionType: 'DIRECT', intakeSeats: 120, medium: 'English' },
          { streamName: 'BiPC', courseType: 'Intermediate', annualFee: 38000, admissionFee: 5000, otherCharges: 2500, minQualification: '10th Class Pass', requiredMarks: '60% in Science', admissionType: 'DIRECT', intakeSeats: 90, medium: 'English' }
        ],
        hasHostel: collegeData.hasHostel || false,
        hostelDetails: collegeData.hostelDetails || '',
        hasTransport: collegeData.hasTransport || false,
        transportDetails: collegeData.transportDetails || '',
        hasLibrary: collegeData.hasLibrary !== undefined ? collegeData.hasLibrary : true,
        hasLabs: collegeData.hasLabs !== undefined ? collegeData.hasLabs : true,
        hasSports: collegeData.hasSports || false,
        hasPlayground: collegeData.hasPlayground || false,
        hasWifi: collegeData.hasWifi || false,
        hasSmartClassroom: collegeData.hasSmartClassroom || false,
        hasCctv: collegeData.hasCctv !== undefined ? collegeData.hasCctv : true,
        hasComputerLabs: collegeData.hasComputerLabs !== undefined ? collegeData.hasComputerLabs : true,
        hasCafeteria: collegeData.hasCafeteria || false,
        admissions: collegeData.admissions || {
          academicYear: '2026-2027',
          applicationStartDate: '',
          applicationEndDate: '',
          counselingDate: '',
          classesStartDate: '',
          procedure: [
            'Fill and submit the institutional enquiry or registration form.',
            'Submit 10th standard Memo, Bonafide, Transfer Certificate (TC), and Aadhaar copy.',
            'Career and stream counseling with academic advisors.',
            'Fee payment and provisional admission confirmation.'
          ],
          applicationLink: ''
        },
        scholarships: collegeData.scholarships || [
          { title: 'Telangana State ePASS Fee Reimbursement', description: 'Government fee reimbursement for eligible reservation categories (SC/ST/BC/Minority/EBC).', eligibility: 'As per TS Govt income criteria.' },
          { title: 'Merit Academic Scholarship', description: 'Concession on tuition fees for outstanding SSC/CBSE Board performance.', eligibility: '10th Board GPA >= 9.5 or Marks >= 90%' }
        ],
        documents: collegeData.documents || [],
        status: 'PENDING',
        isApproved: false,
        verified: false,
        registeredByUid: firebaseUser?.uid || 'rep-' + timestamp,
        registeredByEmail: cleanEmail,
        registeredByName: representativeName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // FIX H2: College representatives start as 'PENDING_COLLEGE_ADMIN', not 'COLLEGE_ADMIN'.
      // An admin must approve them before they receive elevated access.
      const userProfile = {
        uid: firebaseUser?.uid || 'user-' + timestamp,
        name: representativeName,
        email: cleanEmail,
        mobileNumber: phone || mobileNumber || '',
        designation: designation || 'Principal / Authorised Representative',
        role: 'PENDING_COLLEGE_ADMIN',
        collegeId: collegeId,
        collegeName: collegeData.name,
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'colleges', collegeId), newCollege);
      } catch (fsErr) {
        console.warn('Firestore college document save warning:', fsErr.message);
      }

      try {
        if (firebaseUser) {
          await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
        }
      } catch (fsErr) {
        console.warn('Firestore user profile save warning:', fsErr.message);
      }

      setUser(userProfile);
      // Cache only display data, not role
      if (typeof window !== 'undefined') {
        localStorage.setItem('career365_user', JSON.stringify({
          name: userProfile.name,
          email: userProfile.email
        }));
        localStorage.setItem(`career365_college_${collegeId}`, JSON.stringify(newCollege));
      }
      router.refresh();
      return { user: userProfile, college: newCollege };
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('An account with this institutional email already exists. Please sign in instead.');
      }
      throw new Error(err.message || 'College registration failed. Please check the entered credentials.');
    }
  };

  // 5. Update College Profile Data
  const updateCollegeProfile = async (collegeId, collegeData) => {
    const payload = {
      ...collegeData,
      updatedAt: new Date().toISOString()
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(`career365_college_${collegeId}`, JSON.stringify(payload));
    }
    try {
      const collegeDocRef = doc(db, 'colleges', String(collegeId));
      await updateDoc(collegeDocRef, payload);
    } catch (err) {
      console.warn('Firestore updateCollegeProfile warning (persisted locally):', err.message);
    }
    return payload;
  };

  // 6. Logout
  const logout = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('career365_user');
      }
      setUser(null);
      await signOut(auth);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.warn('Logout warning:', err);
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('career365_user');
      }
      router.push('/');
    }
  };

  // 7. Update Student User Profile Data
  const updateProfile = async (profileData) => {
    // Security: Strip sensitive system fields to prevent client-side privilege escalation
    const sanitizedData = { ...profileData };
    delete sanitizedData.role;
    delete sanitizedData.uid;
    delete sanitizedData.email;
    delete sanitizedData.createdAt;

    const updatedUser = { ...user, ...sanitizedData };
    setUser(updatedUser);
    // Cache only display data, not role
    if (typeof window !== 'undefined') {
      localStorage.setItem('career365_user', JSON.stringify({
        name: updatedUser.name,
        email: updatedUser.email
      }));
    }

    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, sanitizedData);
      } catch (err) {
        console.warn('Firestore updateProfile warning (saved locally):', err.message);
      }
    }
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      registerCollege,
      updateCollegeProfile,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
