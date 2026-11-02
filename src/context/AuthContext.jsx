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
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
