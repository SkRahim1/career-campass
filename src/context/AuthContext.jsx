'use client';

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

// Pre-configured default demo accounts for instant zero-error login
export const DEFAULT_ACCOUNTS = {
  'rahul@gmail.com': {
    email: 'rahul@gmail.com',
    password: 'student123',
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
    password: 'admin123',
    role: 'SUPER_ADMIN',
    uid: 'admin-default-uid',
    name: 'Super Admin',
    mobileNumber: '9999999999'
  },
  'college@career365compass.com': {
    email: 'college@career365compass.com',
    password: 'college123',
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
    password: 'college123',
    role: 'COLLEGE_ADMIN',
    uid: 'college-default-uid',
    name: 'Dr. K. V. Rao',
    designation: 'Principal & Admissions In-charge',
    mobileNumber: '9848012345',
    collegeId: '6526',
    collegeName: 'Government Junior College, Falaknuma'
  }
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Check login status on mount & hydrate immediately from localStorage
  useEffect(() => {
    let activeCachedUser = null;
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('career365_user');
        if (cached) {
          activeCachedUser = JSON.parse(cached);
          setUser(activeCachedUser);
          setLoading(false);
        }
      } catch (e) {
        console.warn('Error reading cached user from localStorage:', e);
      }
    }

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

          if (!profile) {
            const cleanEmail = (firebaseUser.email || '').toLowerCase();
            const defaultAcc = DEFAULT_ACCOUNTS[cleanEmail];
            profile = defaultAcc ? { ...defaultAcc, uid: firebaseUser.uid } : {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || cleanEmail.split('@')[0] || 'Student User',
              email: firebaseUser.email,
              role: cleanEmail.includes('admin') ? 'SUPER_ADMIN' : cleanEmail.includes('college') ? 'COLLEGE_ADMIN' : 'STUDENT',
              mobileNumber: firebaseUser.phoneNumber || '',
              savedColleges: [],
              hasCompletedSurvey: false
            };
          }

          setUser(profile);
          if (typeof window !== 'undefined') {
            localStorage.setItem('career365_user', JSON.stringify(profile));
          }
        } else {
          // If no firebaseUser, check if a valid demo session is saved in localStorage
          if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('career365_user');
            if (cached) {
              try {
                const parsed = JSON.parse(cached);
                if (DEFAULT_ACCOUNTS[parsed.email?.toLowerCase()]) {
                  setUser(parsed);
                  setLoading(false);
                  return;
                }
              } catch (e) {}
            }
          }
          // Only clear user if no local session exists
          if (!activeCachedUser) {
            setUser(null);
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

  // 2. Seamless, zero-error login
  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // Check if this is a known Demo / Default account
    const defaultAcc = DEFAULT_ACCOUNTS[cleanEmail];
    if (defaultAcc) {
      if (defaultAcc.password !== cleanPassword) {
        throw new Error('Incorrect password for this demo account. Please verify credentials.');
      }

      // Try background Firebase Auth sync without letting any errors block the user
      (async () => {
        try {
          let fbUser = null;
          try {
            const userCred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
            fbUser = userCred.user;
          } catch (signInErr) {
            if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
              try {
                const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPassword);
                fbUser = newCred.user;
              } catch (createErr) {}
            }
          }

          if (fbUser) {
            try {
              const userDocRef = doc(db, 'users', fbUser.uid);
              await setDoc(userDocRef, { ...defaultAcc, uid: fbUser.uid }, { merge: true });
            } catch (fsErr) {}
          }
        } catch (bgErr) {}
      })();

      const fullUser = { ...defaultAcc };
      setUser(fullUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('career365_user', JSON.stringify(fullUser));
      }
      router.refresh();
      return fullUser;
    }

    // Custom Account Login (via Firebase Auth)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);
      const firebaseUser = userCredential.user;

      let profile = null;
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          profile = userDoc.data();
        } else {
          profile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || cleanEmail.split('@')[0],
            email: firebaseUser.email,
            role: cleanEmail.includes('admin') ? 'SUPER_ADMIN' : cleanEmail.includes('college') ? 'COLLEGE_ADMIN' : 'STUDENT',
            savedColleges: []
          };
          try {
            await setDoc(userDocRef, profile);
          } catch (writeErr) {
            console.warn('Could not write user profile to Firestore:', writeErr.message);
          }
        }
      } catch (firestoreErr) {
        console.warn('Firestore user fetch failed, using memory/fallback profile:', firestoreErr.message);
        profile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || cleanEmail.split('@')[0],
          email: firebaseUser.email,
          role: cleanEmail.includes('admin') ? 'SUPER_ADMIN' : cleanEmail.includes('college') ? 'COLLEGE_ADMIN' : 'STUDENT',
          savedColleges: []
        };
      }

      const fullUser = { ...profile, uid: firebaseUser.uid };
      setUser(fullUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('career365_user', JSON.stringify(fullUser));
      }
      router.refresh();
      return fullUser;
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please verify credentials or create a new account.');
      } else if (err.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please wait a moment before trying again.');
      } else if (err.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw new Error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  // 3. Student Registration
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
          // If already registered, attempt login
          const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
          firebaseUser = userCredential.user;
        } else {
          throw authErr;
        }
      }

      const newProfile = {
        uid: firebaseUser?.uid || 'user-' + Date.now(),
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        mobileNumber: mobileNumber || '',
        role: 'STUDENT',
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('career365_user', JSON.stringify(newProfile));
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
          const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
          firebaseUser = userCredential.user;
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

      const userProfile = {
        uid: firebaseUser?.uid || 'user-' + timestamp,
        name: representativeName,
        email: cleanEmail,
        mobileNumber: phone || mobileNumber || '',
        designation: designation || 'Principal / Authorised Representative',
        role: 'COLLEGE_ADMIN',
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('career365_user', JSON.stringify(userProfile));
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
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('career365_user', JSON.stringify(updatedUser));
    }

    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, profileData);
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
