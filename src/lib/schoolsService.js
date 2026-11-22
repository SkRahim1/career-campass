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
  },
  {
    id: 'school_ghs_moosapet',
    name: 'Govt High School, Moosapet',
    district: 'Medchal-Malkajgiri',
    location: 'Moosapet, Kukatpally',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36211801818',
    isActive: true
  },
  {
    id: 'school_zphs_pragathi_nagar',
    name: 'ZPHS Pragathi Nagar',
    district: 'Medchal-Malkajgiri',
    location: 'Pragathi Nagar, Kukatpally',
    category: 'Zilla Parishad High School (ZPHS)',
    medium: 'Telugu & English',
    udiseCode: '36211901919',
    isActive: true
  },
  {
    id: 'school_ghs_bolarum',
    name: 'Govt High School, Bolarum',
    district: 'Hyderabad',
    location: 'Bolarum, Secunderabad',
    category: 'Government High School',
    medium: 'English & Telugu',
    udiseCode: '36202002020',
    isActive: true
  },
  {
    id: 'school_zphs_bachupally',
    name: 'ZPHS Bachupally',
    district: 'Medchal-Malkajgiri',
    location: 'Bachupally, Hyderabad',
    category: 'Zilla Parishad High School (ZPHS)',
    medium: 'Telugu & English',
    udiseCode: '36212102121',
    isActive: true
  },
  {
    id: 'school_ghs_miyapur',
    name: 'Govt High School, Miyapur',
    district: 'Medchal-Malkajgiri',
    location: 'Miyapur, Hyderabad',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36212202222',
    isActive: true
  },
  {
    id: 'school_zphs_patancheru',
    name: 'ZPHS Patancheru',
    district: 'Sangareddy',
    location: 'Patancheru, Sangareddy',
    category: 'Zilla Parishad High School (ZPHS)',
    medium: 'Telugu & English',
    udiseCode: '36232302323',
    isActive: true
  },
  {
    id: 'school_ghs_nizampet',
    name: 'Govt High School, Nizampet',
    district: 'Medchal-Malkajgiri',
    location: 'Nizampet, Hyderabad',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36212402424',
    isActive: true
  },
  {
    id: 'school_ghs_chintal',
    name: 'Govt High School, Chintal',
    district: 'Medchal-Malkajgiri',
    location: 'Chintal, Quthbullapur',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36212502525',
    isActive: true
  },
  {
    id: 'school_ghs_kondapur',
    name: 'Govt High School, Kondapur',
    district: 'Ranga Reddy',
    location: 'Kondapur, Serilingampally',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36222602626',
    isActive: true
  },
  {
    id: 'school_ghs_madhapur',
    name: 'Govt High School, Madhapur',
    district: 'Ranga Reddy',
    location: 'Madhapur, Hitec City',
    category: 'Government High School',
    medium: 'English Medium',
    udiseCode: '36222702727',
    isActive: true
  },
  {
    id: 'school_zphs_dammaiguda',
    name: 'ZPHS Dammaiguda',
    district: 'Medchal-Malkajgiri',
    location: 'Dammaiguda, Medchal-Malkajgiri',
    category: 'Zilla Parishad High School (ZPHS)',
    medium: 'Telugu & English',
    udiseCode: '36212802828',
    isActive: true
  },
  {
    id: 'school_ghs_shapur_nagar',
    name: 'Govt High School, Shapur Nagar',
    district: 'Medchal-Malkajgiri',
    location: 'Shapur Nagar, Jeedimetla',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36212902929',
    isActive: true
  },
  {
    id: 'school_ghs_attapur',
    name: 'Govt High School, Attapur',
    district: 'Ranga Reddy',
    location: 'Attapur, Rajendranagar',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36223003030',
    isActive: true
  },
  {
    id: 'school_ghs_srnagar',
    name: 'Govt High School, SR Nagar',
    district: 'Hyderabad',
    location: 'SR Nagar, Ameerpet',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36203103131',
    isActive: true
  },
  {
    id: 'school_ghs_suchitra',
    name: 'Govt High School, Suchitra',
    district: 'Medchal-Malkajgiri',
    location: 'Suchitra, Jeedimetla',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36213203232',
    isActive: true
  },
  {
    id: 'school_zphs_rcpuram',
    name: 'ZPHS Ramachandrapuram (BHEL)',
    district: 'Sangareddy',
    location: 'RC Puram, BHEL',
    category: 'Zilla Parishad High School (ZPHS)',
    medium: 'Telugu & English',
    udiseCode: '36233303333',
    isActive: true
  },
  {
    id: 'school_ghs_serilingampally',
    name: 'Govt High School, Serilingampally',
    district: 'Ranga Reddy',
    location: 'Lingampally, Serilingampally',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36223403434',
    isActive: true
  },
  {
    id: 'school_zphs_nagole',
    name: 'ZPHS Nagole',
    district: 'Medchal-Malkajgiri',
    location: 'Nagole, Uppal',
    category: 'Zilla Parishad High School (ZPHS)',
    medium: 'Telugu & English',
    udiseCode: '36213503535',
    isActive: true
  },
  {
    id: 'school_zphs_boduppal',
    name: 'ZPHS Boduppal',
    district: 'Medchal-Malkajgiri',
    location: 'Boduppal, Peerzadiguda',
    category: 'Zilla Parishad High School (ZPHS)',
    medium: 'Telugu & English',
    udiseCode: '36213603636',
    isActive: true
  },
  {
    id: 'school_ghs_vanasthalipuram',
    name: 'Govt High School, Vanasthalipuram',
    district: 'Ranga Reddy',
    location: 'Vanasthalipuram, Hayathnagar',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36223703737',
    isActive: true
  },
  {
    id: 'school_tms_rajendranagar',
    name: 'Telangana Model School, Rajendranagar',
    district: 'Ranga Reddy',
    location: 'Rajendranagar, Budvel',
    category: 'Model School',
    medium: 'English Medium',
    udiseCode: '36223803838',
    isActive: true
  },
  {
    id: 'school_ghs_neredmet',
    name: 'Govt High School, Neredmet',
    district: 'Medchal-Malkajgiri',
    location: 'Neredmet, Secunderabad',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36213903939',
    isActive: true
  },
  {
    id: 'school_keyes_marredpally',
    name: 'Keyes High School for Girls, Marredpally',
    district: 'Hyderabad',
    location: 'East Marredpally, Secunderabad',
    category: 'Aided High School',
    medium: 'English & Telugu',
    udiseCode: '36204004040',
    isActive: true
  },
  {
    id: 'school_ghs_shamirpet',
    name: 'Govt High School, Shamirpet',
    district: 'Medchal-Malkajgiri',
    location: 'Shamirpet, Rajiv Rahadari',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36214104141',
    isActive: true
  },
  {
    id: 'school_zphs_gandimaisamma',
    name: 'ZPHS Gandi Maisamma',
    district: 'Medchal-Malkajgiri',
    location: 'Gandi Maisamma, Dundigal',
    category: 'Zilla Parishad High School (ZPHS)',
    medium: 'Telugu & English',
    udiseCode: '36214204242',
    isActive: true
  },
  {
    id: 'school_zphs_pocharam',
    name: 'ZPHS Pocharam',
    district: 'Medchal-Malkajgiri',
    location: 'Pocharam, Ghatkesar',
    category: 'Zilla Parishad High School (ZPHS)',
    medium: 'Telugu & English',
    udiseCode: '36214304343',
    isActive: true
  },
  {
    id: 'school_ghs_meerpet',
    name: 'Govt High School, Meerpet',
    district: 'Ranga Reddy',
    location: 'Meerpet, Badangpet',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36224404444',
    isActive: true
  },
  {
    id: 'school_ghs_gandipet',
    name: 'Govt High School, Gandipet',
    district: 'Ranga Reddy',
    location: 'Gandipet, Kokapet',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36224504545',
    isActive: true
  },
  {
    id: 'school_zphs_moinabad',
    name: 'ZPHS Moinabad',
    district: 'Ranga Reddy',
    location: 'Moinabad, Chevella Road',
    category: 'Zilla Parishad High School (ZPHS)',
    medium: 'Telugu & English',
    udiseCode: '36224604646',
    isActive: true
  },
  {
    id: 'school_ghs_hafeezpet',
    name: 'Govt High School, Hafeezpet',
    district: 'Ranga Reddy',
    location: 'Hafeezpet, Serilingampally',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36224704747',
    isActive: true
  },
  {
    id: 'school_ghs_kushaiguda',
    name: 'Govt High School, Kushaiguda',
    district: 'Medchal-Malkajgiri',
    location: 'Kushaiguda, ECIL',
    category: 'Government High School',
    medium: 'Telugu & English',
    udiseCode: '36214804848',
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
    
    const schools = [];
    const seenNames = new Set();

    if (!snap.empty) {
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (includeInactive || data.isActive !== false) {
          schools.push({ id: docSnap.id, ...data });
          if (data.name) seenNames.add(data.name.trim().toLowerCase());
        }
      });
    }

    // Always include default verified schools if not already present
    DEFAULT_SCHOOLS.forEach((defSchool) => {
      if (!seenNames.has(defSchool.name.trim().toLowerCase())) {
        schools.push(defSchool);
        seenNames.add(defSchool.name.trim().toLowerCase());
      }
    });

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
