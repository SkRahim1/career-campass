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

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check login status on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUser({ ...userDoc.data(), uid: firebaseUser.uid });
          } else {
            // If doc doesn't exist, create a basic student profile
            const defaultProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Student User',
              email: firebaseUser.email,
              role: 'STUDENT',
              mobileNumber: firebaseUser.phoneNumber || '',
              savedColleges: [],
              hasCompletedSurvey: false
            };
            await setDoc(userDocRef, defaultProfile);
            setUser(defaultProfile);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching session:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      let profile = {};
      if (userDoc.exists()) {
        profile = userDoc.data();
      } else {
        profile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Student User',
          email: firebaseUser.email,
          role: email.includes('admin') ? 'SUPER_ADMIN' : 'STUDENT',
          savedColleges: []
        };
        await setDoc(userDocRef, profile);
      }
      
      const fullUser = { ...profile, uid: firebaseUser.uid };
      setUser(fullUser);
      router.refresh();
      return fullUser;
    } catch (err) {
      throw err;
    }
  };

  const register = async (userData) => {
    const { email, password, name, mobileNumber, schoolName, percentage10th, preferredStream, preferredLocation, budget, hostelRequired } = userData;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const newProfile = {
        uid: firebaseUser.uid,
        name: name,
        email: email,
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

      await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
      setUser(newProfile);
      router.refresh();
      return newProfile;
    } catch (err) {
      throw err;
    }
  };

  // College Representative Self-Registration
  const registerCollege = async (representativeData, collegeData) => {
    const { email, password, representativeName, designation, phone, mobileNumber } = representativeData;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Unique college document ID
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
        
        // Location
        address: collegeData.address || '',
        nearbyLandmark: collegeData.nearbyLandmark || '',
        district: collegeData.district || 'Hyderabad',
        state: collegeData.state || 'Telangana',
        pincode: collegeData.pincode || '',
        googleMapsUrl: collegeData.googleMapsUrl || '',
        
        // Representative & Official Contact
        principalName: collegeData.principalName || representativeName || '',
        principalDesignation: collegeData.principalDesignation || designation || 'Principal / Authorised Representative',
        principalMessage: collegeData.principalMessage || 'We welcome ambitious students and empower them towards academic and career excellence.',
        phone: collegeData.phone || phone || mobileNumber || '',
        email: email,
        whatsappNumber: collegeData.whatsappNumber || phone || mobileNumber || '',
        website: collegeData.website || '',
        
        // Affiliation & Recognition
        affiliation: collegeData.affiliation || 'Board of Intermediate Education, Telangana (TSBIE)',
        boardCode: collegeData.boardCode || '',
        recognitionDetails: collegeData.recognitionDetails || 'Recognized by Government of Telangana',
        
        // Visuals
        logoUrl: collegeData.logoUrl || '',
        coverImageUrl: collegeData.coverImageUrl || '',
        gallery: collegeData.gallery || [],
        
        // Demographics
        genderType: collegeData.genderType || 'CO_ED',
        
        // Initial Streams (MPC, BiPC, CEC, etc.)
        streams: collegeData.streams && collegeData.streams.length > 0 ? collegeData.streams : [
          {
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
          },
          {
            streamName: 'BiPC',
            courseType: 'Intermediate',
            annualFee: 38000,
            admissionFee: 5000,
            otherCharges: 2500,
            minQualification: '10th Class Pass',
            requiredMarks: '60% in Science',
            admissionType: 'DIRECT',
            intakeSeats: 90,
            medium: 'English'
          }
        ],

        // Facilities flags & details
        hasHostel: collegeData.hasHostel || false,
        hostelDetails: collegeData.hostelDetails || '',
        hasTransport: collegeData.hasTransport || false,
        transportDetails: collegeData.transportDetails || '',
        hasLibrary: collegeData.hasLibrary !== undefined ? collegeData.hasLibrary : true,
        libraryDetails: collegeData.libraryDetails || '',
        hasLabs: collegeData.hasLabs !== undefined ? collegeData.hasLabs : true,
        labsDetails: collegeData.labsDetails || '',
        hasSports: collegeData.hasSports || false,
        hasPlayground: collegeData.hasPlayground || false,
        hasWifi: collegeData.hasWifi || false,
        hasSmartClassroom: collegeData.hasSmartClassroom || false,
        hasCctv: collegeData.hasCctv !== undefined ? collegeData.hasCctv : true,
        hasComputerLabs: collegeData.hasComputerLabs !== undefined ? collegeData.hasComputerLabs : true,
        hasCafeteria: collegeData.hasCafeteria || false,

        // Admissions & Important Dates
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

        // Scholarships & Concessions
        scholarships: collegeData.scholarships || [
          {
            title: 'Telangana State ePASS Fee Reimbursement',
            description: 'Government fee reimbursement for eligible reservation categories (SC/ST/BC/Minority/EBC).',
            eligibility: 'As per TS Govt income criteria.'
          },
          {
            title: 'Merit Academic Scholarship',
            description: 'Concession on tuition fees for outstanding SSC/CBSE Board performance.',
            eligibility: '10th Board GPA >= 9.5 or Marks >= 90%'
          }
        ],

        // Downloadable Documents
        documents: collegeData.documents || [
          {
            title: 'College Prospectus & Guidelines',
            type: 'PROSPECTUS',
            url: ''
          },
          {
            title: 'Approved Fee Structure',
            type: 'FEE_STRUCTURE',
            url: ''
          }
        ],

        // Verification & Publishing
        status: 'PENDING', // PENDING -> APPROVED / REJECTED by Super Admin
        isApproved: false,
        verified: false,
        registeredByUid: firebaseUser.uid,
        registeredByEmail: email,
        registeredByName: representativeName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save college doc
      await setDoc(doc(db, 'colleges', collegeId), newCollege);

      // Save user profile linked to college
      const userProfile = {
        uid: firebaseUser.uid,
        name: representativeName,
        email: email,
        mobileNumber: phone || mobileNumber || '',
        designation: designation || 'Principal / Authorised Representative',
        role: 'COLLEGE_ADMIN',
        collegeId: collegeId,
        collegeName: collegeData.name,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      setUser(userProfile);
      router.refresh();
      return { user: userProfile, college: newCollege };
    } catch (err) {
      throw err;
    }
  };

  // Update College Data
  const updateCollegeProfile = async (collegeId, collegeData) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    try {
      const collegeDocRef = doc(db, 'colleges', String(collegeId));
      const payload = {
        ...collegeData,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(collegeDocRef, payload);
      return payload;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfile = async (profileData) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, profileData);
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err;
    }
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
