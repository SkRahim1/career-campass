import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

export const DEFAULT_SCHOOLS = [
  {
    id: 'school_aliya',
    name: 'Govt High School, Aliya',
    district: 'Hyderabad',
    location: 'Gunfoundry, Hyderabad',
    category: 'Government High School',
    medium: 'English & Telugu',
    udiseCode: '36200100101',
    isActive: true
  },
  {
    id: 'school_chanchalguda',
    name: 'Govt Boys High School, Chanchalguda',
    district: 'Hyderabad',
    location: 'Old City, Hyderabad',
    category: 'Government High School',
    medium: 'English, Urdu & Telugu',
    udiseCode: '36200200202',
    isActive: true
  },
  {
    id: 'school_mahbubia',
    name: 'Mahbubia Govt Girls High School',
    district: 'Hyderabad',
    location: 'Abids, Hyderabad',
    category: 'Government High School',
    medium: 'English & Urdu',
    udiseCode: '36200300303',
    isActive: true
  },
  {
    id: 'school_zphs_uppal',
    name: 'Zilla Parishad High School (ZPHS), Uppal',
    district: 'Medchal-Malkajgiri',
    location: 'Uppal, Medchal-Malkajgiri',
    category: 'Zilla Parishad High School (ZPHS)',
    medium: 'Telugu & English',
    udiseCode: '36210400404',
    isActive: true
  },
  {
    id: 'school_zphs_hayathnagar',
    name: 'Zilla Parishad High School (ZPHS), Hayathnagar',
    district: 'Ranga Reddy',
    location: 'Hayathnagar, Ranga Reddy',
    category: 'Zilla Parishad High School (ZPHS)',
    medium: 'Telugu & English',
    udiseCode: '36220500505',
    isActive: true
  },
  {
    id: 'school_zphs_shamshabad',
    name: 'Zilla Parishad High School (ZPHS), Shamshabad',
    district: 'Ranga Reddy',
    location: 'Shamshabad, Ranga Reddy',
    category: 'Zilla Parishad High School (ZPHS)',
    medium: 'Telugu & English',
    udiseCode: '36220600606',
    isActive: true
  },
  {
    id: 'school_tms_rajendranagar',
    name: 'Telangana Model School (TMS), Rajendranagar',
    district: 'Ranga Reddy',
    location: 'Rajendranagar, Ranga Reddy',
    category: 'Telangana Model School',
    medium: 'English Medium',
    udiseCode: '36220700707',
    isActive: true
  },
  {
    id: 'school_tms_medchal',
    name: 'Telangana Model School (TMS), Medchal',
    district: 'Medchal-Malkajgiri',
    location: 'Medchal, Medchal-Malkajgiri',
    category: 'Telangana Model School',
    medium: 'English Medium',
    udiseCode: '36210800808',
    isActive: true
  },
  {
    id: 'school_ghs_amberpet',
    name: 'Govt High School, Amberpet',
    district: 'Hyderabad',
    location: 'Amberpet, Hyderabad',
    category: 'Government High School',
    medium: 'English & Telugu',
    udiseCode: '36200900909',
    isActive: true
  },
  {
    id: 'school_ghs_secunderabad',
    name: 'Govt High School, Secunderabad',
    district: 'Hyderabad',
    location: 'Secunderabad',
    category: 'Government High School',
    medium: 'English & Telugu',
    udiseCode: '36201001010',
    isActive: true
  },
  {
    id: 'school_kgbv_ghatkesar',
    name: 'KGBV Residential School, Ghatkesar',
    district: 'Medchal-Malkajgiri',
    location: 'Ghatkesar, Medchal-Malkajgiri',
    category: 'KGBV / Residential School',
    medium: 'English Medium',
    udiseCode: '36211101111',
    isActive: true
  },
  {
    id: 'school_tswr_gowlidoddy',
    name: 'TSWR Centre of Excellence, Gowlidoddy',
    district: 'Hyderabad',
    location: 'Financial District, Gowlidoddy',
    category: 'Residential / Welfare School',
    medium: 'English Medium',
    udiseCode: '36201201212',
    isActive: true
  },
  {
    id: 'school_all_saints',
    name: 'All Saints High School, Abids',
    district: 'Hyderabad',
    location: 'Abids, Hyderabad',
    category: 'Private / Aided School',
    medium: 'English Medium',
    udiseCode: '36201301313',
    isActive: true
  },
  {
    id: 'school_st_patricks',
    name: "St. Patrick's High School, Secunderabad",
    district: 'Hyderabad',
    location: 'Secunderabad',
    category: 'Private / Aided School',
    medium: 'English Medium',
    udiseCode: '36201401414',
    isActive: true
  },
  {
    id: 'school_rosary_convent',
    name: 'Rosary Convent High School, Gunfoundry',
    district: 'Hyderabad',
    location: 'Gunfoundry, Hyderabad',
    category: 'Private / Aided School',
    medium: 'English Medium',
    udiseCode: '36201501515',
    isActive: true
  },
  {
    id: 'school_wesley_boys',
    name: 'Wesley Boys High School, Secunderabad',
    district: 'Hyderabad',
    location: 'Secunderabad',
    category: 'Private / Aided School',
    medium: 'English Medium',
    udiseCode: '36201601616',
    isActive: true
  },
  {
    id: 'school_little_flower',
    name: 'Little Flower High School, Chirag Ali Lane',
    district: 'Hyderabad',
    location: 'Abids, Hyderabad',
    category: 'Private / Unaided School',
    medium: 'English Medium',
    udiseCode: '36201701717',
    isActive: true
  }
];

/**
 * Fetch all schools from Firestore.
 * If Firestore has no documents, returns DEFAULT_SCHOOLS.
 */
export async function getSchoolsList(includeInactive = false) {
  try {
    const schoolsCol = collection(db, 'schools');
    const snap = await getDocs(schoolsCol);
    
    if (snap.empty) {
      return DEFAULT_SCHOOLS;
    }

    const schools = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (includeInactive || data.isActive !== false) {
        schools.push({ id: docSnap.id, ...data });
      }
    });

    if (schools.length === 0) {
      return DEFAULT_SCHOOLS;
    }

    // Sort alphabetically by school name
    return schools.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.warn('Error fetching schools from Firestore, using default schools fallback:', error);
    return DEFAULT_SCHOOLS;
  }
}

/**
 * Add a new school to Firestore
 */
export async function addSchoolToFirestore(schoolData) {
  const schoolsCol = collection(db, 'schools');
  const payload = {
    name: schoolData.name.trim(),
    district: schoolData.district || 'Hyderabad',
    location: schoolData.location ? schoolData.location.trim() : '',
    category: schoolData.category || 'Government High School',
    medium: schoolData.medium || 'English & Telugu',
    udiseCode: schoolData.udiseCode ? schoolData.udiseCode.trim() : '',
    isActive: schoolData.isActive ?? true,
    createdAt: new Date().toISOString(),
    createdBy: schoolData.createdBy || 'Super Admin'
  };

  const docRef = await addDoc(schoolsCol, payload);
  return { id: docRef.id, ...payload };
}

/**
 * Delete a school from Firestore
 */
export async function deleteSchoolFromFirestore(schoolId) {
  const schoolDoc = doc(db, 'schools', String(schoolId));
  await deleteDoc(schoolDoc);
  return true;
}

/**
 * Toggle active status of a school
 */
export async function toggleSchoolActiveStatus(schoolId, currentStatus) {
  const schoolDoc = doc(db, 'schools', String(schoolId));
  await updateDoc(schoolDoc, {
    isActive: !currentStatus,
    updatedAt: new Date().toISOString()
  });
  return !currentStatus;
}

/**
 * Seeds default schools into Firestore if empty
 */
export async function seedDefaultSchoolsToFirestore(adminEmail = 'admin@career365compass.com') {
  const schoolsCol = collection(db, 'schools');
  const existing = await getDocs(schoolsCol);
  
  const existingNames = new Set();
  existing.forEach(d => {
    const data = d.data();
    if (data.name) existingNames.add(data.name.toLowerCase());
  });

  const added = [];
  for (const s of DEFAULT_SCHOOLS) {
    if (!existingNames.has(s.name.toLowerCase())) {
      const docRef = await addDoc(schoolsCol, {
        name: s.name,
        district: s.district,
        location: s.location,
        category: s.category,
        medium: s.medium,
        udiseCode: s.udiseCode,
        isActive: true,
        createdAt: new Date().toISOString(),
        createdBy: adminEmail
      });
      added.push({ id: docRef.id, name: s.name });
    }
  }

  return added;
}
