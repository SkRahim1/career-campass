const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');
const { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updatePassword 
} = require('firebase/auth');

// Read Firebase config from .env.local
const envPath = path.join(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local file not found at', envPath);
  process.exit(1);
}

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

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);

async function main() {
  const [,, action, emailArg, passwordArg, extraArg] = process.argv;

  if (!action || !emailArg || !passwordArg) {
    console.log(`
Usage:
  1) Create a new Super Admin account:
     node scripts/manage-admin.js create <email> <password> [name]

  2) Promote an existing registered account to Super Admin:
     node scripts/manage-admin.js promote <email> <password>

  3) Change password of an existing admin account:
     node scripts/manage-admin.js change-password <email> <currentPassword> <newPassword>
`);
    process.exit(0);
  }

  const email = emailArg.trim().toLowerCase();
  const password = passwordArg.trim();

  if (action === 'create') {
    const name = extraArg ? extraArg.trim() : 'Super Admin';
    console.log(`Creating new Super Admin: ${email} (${name})...`);
    try {
      let user = null;
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        user = cred.user;
        console.log(`✓ Firebase Auth user created (UID: ${user.uid})`);
      } catch (authErr) {
        if (authErr.code === 'auth/email-already-in-use') {
          console.log(`Account ${email} already exists in Firebase Auth. Signing in to update role...`);
          const cred = await signInWithEmailAndPassword(auth, email, password);
          user = cred.user;
        } else {
          throw authErr;
        }
      }

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        role: 'SUPER_ADMIN',
        updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log(`✓ Firestore role set to 'SUPER_ADMIN' for UID: ${user.uid}`);
      console.log(`\n🎉 Success! You can now log in at https://career365compass.in/login with:`);
      console.log(`   Email:    ${email}`);
      console.log(`   Password: ${password}`);
    } catch (err) {
      console.error('Error creating super admin:', err.message);
      process.exit(1);
    }
  } else if (action === 'promote') {
    console.log(`Signing in as ${email} to promote to SUPER_ADMIN...`);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
      const existingData = userSnap.exists() ? userSnap.data() : {};

      await setDoc(userDocRef, {
        ...existingData,
        uid: user.uid,
        email: email,
        name: existingData.name || 'Super Admin',
        role: 'SUPER_ADMIN',
        promotedAt: new Date().toISOString()
      }, { merge: true });

      console.log(`✓ Account ${email} has been promoted to SUPER_ADMIN (UID: ${user.uid})`);
    } catch (err) {
      console.error('Error promoting account:', err.message);
      process.exit(1);
    }
  } else if (action === 'change-password') {
    const newPassword = extraArg ? extraArg.trim() : null;
    if (!newPassword) {
      console.error('Error: Please provide <newPassword> as the third argument.');
      process.exit(1);
    }
    console.log(`Signing in as ${email} to update password...`);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await updatePassword(cred.user, newPassword);
      console.log(`✓ Password for ${email} has been successfully updated.`);
    } catch (err) {
      console.error('Error changing password:', err.message);
      process.exit(1);
    }
  } else {
    console.error(`Unknown action: ${action}`);
    process.exit(1);
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
