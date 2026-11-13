import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { COMPETITIVE_EXAMS_DATA } from '@/data/competitiveExamsData';

const EXAMS_COLLECTION = 'competitive-exams';

/**
 * Retrieve all competitive exams.
 * Queries Firestore first; falls back to bundled static dataset if Firestore is empty or fails.
 */
export async function getAllCompetitiveExams() {
  try {
    const colRef = collection(db, EXAMS_COLLECTION);
    const snap = await getDocs(colRef);
    
    if (!snap.empty) {
      const list = [];
      snap.forEach(d => {
        list.push({ id: d.id, ...d.data() });
      });
      // Sort by status (APPLICATIONS_OPEN first) then by name
      return list.sort((a, b) => {
        if (a.status === 'APPLICATIONS_OPEN' && b.status !== 'APPLICATIONS_OPEN') return -1;
        if (b.status === 'APPLICATIONS_OPEN' && a.status !== 'APPLICATIONS_OPEN') return 1;
        return a.name.localeCompare(b.name);
      });
    }
  } catch (err) {
    console.warn('Firestore fetch failed for competitive exams, falling back to bundled dataset:', err);
  }
  
  return [...COMPETITIVE_EXAMS_DATA];
}

/**
 * Retrieve a single competitive exam by its slug.
 */
export async function getCompetitiveExamBySlug(slug) {
  try {
    const colRef = collection(db, EXAMS_COLLECTION);
    const q = query(colRef, where('slug', '==', slug));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...d.data() };
    }
  } catch (err) {
    console.warn(`Firestore lookup failed for slug '${slug}', falling back to bundled dataset:`, err);
  }
  
  const found = COMPETITIVE_EXAMS_DATA.find(e => e.slug === slug);
  return found || null;
}

/**
 * Add a new competitive exam to Cloud Firestore.
 */
export async function addCompetitiveExamToFirestore(examData) {
  try {
    const slug = examData.slug || examData.shortCode.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const docData = {
      ...examData,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = doc(db, EXAMS_COLLECTION, slug);
    await setDoc(docRef, docData);
    return { success: true, id: slug };
  } catch (err) {
    console.error('Error adding competitive exam to Firestore:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Update an existing competitive exam in Firestore.
 */
export async function updateCompetitiveExamInFirestore(id, updates) {
  try {
    const docRef = doc(db, EXAMS_COLLECTION, String(id));
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (err) {
    console.error('Error updating competitive exam in Firestore:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete a competitive exam from Firestore.
 */
export async function deleteCompetitiveExamFromFirestore(id) {
  try {
    const docRef = doc(db, EXAMS_COLLECTION, String(id));
    await deleteDoc(docRef);
    return { success: true };
  } catch (err) {
    console.error('Error deleting competitive exam from Firestore:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Seeds default competitive exams to Firestore if needed.
 */
export async function seedDefaultCompetitiveExamsToFirestore() {
  try {
    for (const exam of COMPETITIVE_EXAMS_DATA) {
      const docRef = doc(db, EXAMS_COLLECTION, exam.slug);
      await setDoc(docRef, {
        ...exam,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
    return { success: true, count: COMPETITIVE_EXAMS_DATA.length };
  } catch (err) {
    console.error('Error seeding competitive exams to Firestore:', err);
    return { success: false, error: err.message };
  }
}
