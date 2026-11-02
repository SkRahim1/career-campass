const { PrismaClient } = require('@prisma/client');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const serviceKeyPath = path.join(__dirname, '../firebase-service-key.json');

async function main() {
  if (!fs.existsSync(serviceKeyPath)) {
    console.error('\n======================================================');
    console.error('ERROR: Firebase Service Key Not Found!');
    console.error('======================================================');
    console.error('To seed your SQLite data into Firestore, please follow these steps:');
    console.error('1. Go to Firebase Console -> Project Settings -> Service Accounts.');
    console.error('2. Click "Generate New Private Key" and download the JSON file.');
    console.error('3. Rename the downloaded file to "firebase-service-key.json".');
    console.error('4. Place it in the root folder of this project:');
    console.error('   ' + path.resolve(__dirname, '..') + '/firebase-service-key.json');
    console.error('5. Run: node scripts/seed-firebase.js\n');
    process.exit(0);
  }

  const serviceAccount = require(serviceKeyPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  const db = admin.firestore();
  const auth = admin.auth();

  console.log('Successfully connected to Firebase Admin.');
  
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
  const collegesRef = db.collection('colleges');
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
    await collegesRef.doc(String(college.id)).set(docData);
    
    // Also seed reviews into a global reviews collection
    for (const r of reviews) {
      await db.collection('reviews').doc(String(r.id)).set({
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

  // -- SEED CAREERS --
  console.log('Fetching careers from SQLite...');
  const sqliteCareers = await prisma.career.findMany();
  console.log(`Found ${sqliteCareers.length} careers. Seeding to Firestore...`);
  const careersRef = db.collection('careers');
  for (const career of sqliteCareers) {
    await careersRef.doc(career.slug).set(career);
  }

  // -- SEED SCHOLARSHIPS --
  console.log('Fetching scholarships from SQLite...');
  const sqliteScholarships = await prisma.scholarship.findMany();
  console.log(`Found ${sqliteScholarships.length} scholarships. Seeding to Firestore...`);
  const scholarshipsRef = db.collection('scholarships');
  for (const scholarship of sqliteScholarships) {
    await scholarshipsRef.doc(String(scholarship.id)).set(scholarship);
  }

  // -- SEED ADMISSION UPDATES --
  console.log('Fetching admission updates from SQLite...');
  const sqliteUpdates = await prisma.admissionUpdate.findMany();
  console.log(`Found ${sqliteUpdates.length} updates. Seeding to Firestore...`);
  const updatesRef = db.collection('admission-updates');
  for (const update of sqliteUpdates) {
    await updatesRef.doc(String(update.id)).set({
      ...update,
      publishedDate: update.publishedDate.toISOString()
    });
  }

  // -- SEED DEFAULT USERS --
  console.log('Creating default user accounts in Firebase Auth & Firestore...');
  const defaultUsers = [
    {
      uid: 'admin-default-uid',
      email: 'admin@careercompass.com',
      password: 'admin123',
      displayName: 'Super Admin',
      role: 'SUPER_ADMIN',
      mobileNumber: '9999999999'
    },
    {
      uid: 'student-default-uid',
      email: 'rahul@gmail.com',
      password: 'student123',
      displayName: 'Rahul Kumar',
      role: 'STUDENT',
      mobileNumber: '9876543210',
      schoolName: 'Zilla Parishad High School, Hyderabad',
      percentage10th: 88.5,
      preferredStream: 'MPC',
      preferredLocation: 'Madhapur',
      budget: 35000,
      hostelRequired: false,
      savedColleges: []
    }
  ];

  for (const user of defaultUsers) {
    let firebaseUser;
    try {
      firebaseUser = await auth.getUserByEmail(user.email);
      console.log(`User ${user.email} already exists in Firebase Auth.`);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        try {
          firebaseUser = await auth.createUser({
            uid: user.uid,
            email: user.email,
            password: user.password,
            displayName: user.displayName,
          });
          console.log(`Created user ${user.email} in Firebase Auth.`);
        } catch (authErr) {
          console.error(`Failed to create user auth for ${user.email}:`, authErr.message);
          continue;
        }
      } else {
        throw err;
      }
    }

    const { password, displayName, ...profileData } = user;
    await db.collection('users').doc(firebaseUser.uid).set({
      uid: firebaseUser.uid,
      name: displayName,
      email: user.email,
      ...profileData
    });
    console.log(`Saved profile for ${user.email} in Firestore.`);
  }

  console.log('\nFirebase database seeding complete!');
  process.exit(0);
}

main().catch(err => {
  console.error('Error seeding Firebase:', err);
  process.exit(1);
});
