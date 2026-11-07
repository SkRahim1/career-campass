const { PrismaClient } = require('@prisma/client');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Read .env.local file to get Firebase config keys
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const config = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length === 2) {
    const key = parts[0].trim();
    const val = parts[1].trim();
    if (key.startsWith('NEXT_PUBLIC_FIREBASE_')) {
      const configKey = key.replace('NEXT_PUBLIC_FIREBASE_', '')
        .toLowerCase()
        .replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      config[configKey] = val;
    }
  }
});

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
};

console.log('Configured Firebase Config project ID:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Cloud Firestore using Client SDK...');
  
  // -- SEED COLLEGES --
  console.log('Fetching colleges from SQLite...');
  const sqliteColleges = await prisma.college.findMany({
    include: {
      streams: true,
      gallery: true,
      reviews: {
        include: {
          user: true
        }
      }
    }
  });

  console.log(`Found ${sqliteColleges.length} colleges. Seeding to Firestore...`);
  for (const college of sqliteColleges) {
    const { streams, gallery, reviews, ...collegeData } = college;
    const docData = {
      ...collegeData,
      streams: streams.map(s => ({
        streamName: s.streamName,
        annualFee: s.annualFee,
        minQualification: s.minQualification,
        requiredMarks: s.requiredMarks,
        admissionType: s.admissionType,
        reservationInfo: s.reservationInfo
      })),
      gallery: gallery.map(g => g.imageUrl),
      averageRating: collegeData.averageRating || 4.0,
      totalReviews: reviews.length
    };
    await setDoc(doc(db, 'colleges', String(college.id)), docData);
    
    // Seed reviews
    for (const r of reviews) {
      await setDoc(doc(db, 'reviews', String(r.id)), {
        id: r.id,
        collegeId: r.collegeId,
        userId: String(r.userId),
        rating: r.rating,
        reviewText: r.reviewText,
        isApproved: r.isApproved,
        createdAt: r.createdAt.toISOString(),
        userName: r.user.name
      });
    }
  }
  console.log('Colleges and reviews seeded.');

  // -- SEED CAREERS --
  console.log('Fetching careers from SQLite...');
  const sqliteCareers = await prisma.career.findMany();
  console.log(`Found ${sqliteCareers.length} careers. Seeding to Firestore...`);
  for (const career of sqliteCareers) {
    await setDoc(doc(db, 'careers', career.slug), career);
  }
  console.log('Careers seeded.');

  // -- SEED SCHOLARSHIPS --
  console.log('Fetching scholarships from SQLite...');
  const sqliteScholarships = await prisma.scholarship.findMany();
  console.log(`Found ${sqliteScholarships.length} scholarships. Seeding to Firestore...`);
  for (const scholarship of sqliteScholarships) {
    await setDoc(doc(db, 'scholarships', String(scholarship.id)), scholarship);
  }
  console.log('Scholarships seeded.');

  // -- SEED ADMISSION UPDATES --
  console.log('Fetching admission updates from SQLite...');
  const sqliteUpdates = await prisma.admissionUpdate.findMany();
  console.log(`Found ${sqliteUpdates.length} updates. Seeding to Firestore...`);
  for (const update of sqliteUpdates) {
    await setDoc(doc(db, 'admission-updates', String(update.id)), {
      ...update,
      publishedDate: update.publishedDate.toISOString()
    });
  }
  console.log('Admission updates seeded.');

  // Seed profile document templates for default users
  console.log('Seeding default profiles into "users" collection...');
  
  const adminProfile = {
    uid: 'admin-default-uid',
    name: 'Super Admin',
    email: 'admin@career365compass.com',
    role: 'SUPER_ADMIN',
    mobileNumber: '9999999999'
  };
  await setDoc(doc(db, 'users', adminProfile.uid), adminProfile);

  const studentProfile = {
    uid: 'student-default-uid',
    name: 'Rahul Kumar',
    email: 'rahul@gmail.com',
    role: 'STUDENT',
    mobileNumber: '9876543210',
    schoolName: 'Zilla Parishad High School, Hyderabad',
    percentage10th: 88.5,
    preferredStream: 'MPC',
    preferredLocation: 'Madhapur',
    budget: 35000,
    hostelRequired: false,
    savedColleges: []
  };
  await setDoc(doc(db, 'users', studentProfile.uid), studentProfile);
  console.log('Default user profiles seeded.');

  console.log('\nFirestore Client seeding complete successfully!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error seeding Firebase:', err);
  process.exit(1);
});
