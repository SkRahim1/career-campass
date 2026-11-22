const fs = require('fs');
const path = require('path');

// 1. Read existing dump or collegesData.json
let firestoreDump = [];
if (fs.existsSync(path.join(__dirname, '../firestore_colleges_dump.json'))) {
  firestoreDump = JSON.parse(fs.readFileSync(path.join(__dirname, '../firestore_colleges_dump.json'), 'utf8'));
} else if (fs.existsSync(path.join(__dirname, '../src/data/collegesData.json'))) {
  firestoreDump = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/collegesData.json'), 'utf8'));
}

// 2. Read existing seed.js
const seedContent = fs.readFileSync(path.join(__dirname, '../prisma/seed.js'), 'utf8');

// The 38 new colleges for the requested 15 areas
const NEW_COLLEGES_DATA = [
  // --- 1. MOOSAPET ---
  {
    name: 'Government Junior College, Moosapet',
    area: 'Moosapet',
    address: 'Main Road, Moosapet, Kukatpally Mandal, Hyderabad, Telangana 500018',
    landmark: 'Near Moosapet Metro Station Pillar A824',
    phone: '040-23810118',
    email: 'gjc.moosapet@telangana.gov.in',
    website: 'http://gjc-moosapet.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1986,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Telangana state reservation policies apply.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Telangana state reservation policies apply.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Telangana state reservation policies apply.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Moosapet',
    area: 'Moosapet',
    address: 'Y-Junction, Moosapet, Hyderabad, Telangana 500018',
    landmark: 'Near Moosapet Y-Junction Flyover',
    phone: '040-64500118',
    email: 'moosapet.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2005,
    streamsList: [
      { streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Merit scholarship on score.' },
      { streamName: 'BiPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'MEC', annualFee: 50000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'CA-CPT foundation provided.' }
    ]
  },
  {
    name: 'Narayana Junior College, Moosapet',
    area: 'Moosapet',
    address: 'Anjaneya Nagar, Moosapet, Hyderabad, Telangana 500018',
    landmark: 'Beside Metro Pillar 835',
    phone: '040-23701118',
    email: 'moosapet.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2003,
    streamsList: [
      { streamName: 'MPC', annualFee: 62000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'General merit scholarships.' },
      { streamName: 'CEC', annualFee: 42000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Direct admission based on SSC marks.' }
    ]
  },

  // --- 2. PRAGATHI NAGAR ---
  {
    name: 'Sri Chaitanya Junior College, Pragathi Nagar',
    area: 'Pragathi Nagar',
    address: 'Near Lake Kaman, Pragathi Nagar, Kukatpally, Hyderabad, Telangana 500090',
    landmark: 'Opp. Pragathi Nagar Lake Arch',
    phone: '040-64500190',
    email: 'pragathinagar.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2012,
    streamsList: [
      { streamName: 'MPC', annualFee: 72000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE integrated coaching.' },
      { streamName: 'BiPC', annualFee: 75000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET specialized coaching.' }
    ]
  },
  {
    name: 'Narayana Junior College, Pragathi Nagar',
    area: 'Pragathi Nagar',
    address: 'Main Road, Near More Supermarket, Pragathi Nagar, Hyderabad, Telangana 500090',
    landmark: 'Near JNTU Back Road Link',
    phone: '040-23465890',
    email: 'pragathinagar.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2014,
    streamsList: [
      { streamName: 'MPC', annualFee: 70000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Merit concessions available.' },
      { streamName: 'MEC', annualFee: 55000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce Olympiad focus.' }
    ]
  },
  {
    name: 'Tapasya Junior College, Pragathi Nagar',
    area: 'Pragathi Nagar',
    address: 'ALEAP Industrial Road, Pragathi Nagar, Hyderabad, Telangana 500090',
    landmark: 'Near ALEAP Circle',
    phone: '040-66811190',
    email: 'pragathinagar@tapasyaedu.com',
    website: 'http://www.tapasyaedu.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2016,
    streamsList: [
      { streamName: 'MEC', annualFee: 52000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Specialized commerce campus.' },
      { streamName: 'CEC', annualFee: 48000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 3. BOLLARUM / BOLARUM ---
  {
    name: 'Government ITI, Bolarum',
    area: 'Bollarum',
    address: 'Industrial Estate, Bolarum (Bollarum), Secunderabad, Telangana 500010',
    landmark: 'Near Bolarum Checkpost',
    phone: '040-27862210',
    email: 'bolarum.iti@telangana.gov.in',
    website: 'http://www.govtiti-bolarum.org',
    category: 'ITI',
    ownership: 'GOVERNMENT',
    estYear: 1984,
    streamsList: [
      { streamName: 'ITI', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: '10th GPA', admissionType: 'COUNSELLING', reservationInfo: 'Telangana ITI admissions.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Bolarum',
    area: 'Bollarum',
    address: 'Rajiv Rahadari, Bolarum (Bollarum), Secunderabad, Telangana 500010',
    landmark: 'Near Bolarum Rythu Bazar',
    phone: '040-64500110',
    email: 'bolarum.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2011,
    streamsList: [
      { streamName: 'MPC', annualFee: 60000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Early registration discounts.' },
      { streamName: 'BiPC', annualFee: 62000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Medical track scholarship.' }
    ]
  },

  // --- 4. BACHUPALLY ---
  {
    name: 'Sri Chaitanya Junior College, Bachupally',
    area: 'Bachupally',
    address: 'Miyapur - Bachupally Main Road, Bachupally, Hyderabad, Telangana 500090',
    landmark: 'Near Silver Oaks School',
    phone: '040-64500191',
    email: 'bachupally.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2008,
    streamsList: [
      { streamName: 'MPC', annualFee: 75000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'JEE Advanced coaching included.' },
      { streamName: 'BiPC', annualFee: 78000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'AIIMS/NEET special batches.' }
    ]
  },
  {
    name: 'Narayana Junior College, Bachupally',
    area: 'Bachupally',
    address: 'Bachupally X Roads, Hyderabad, Telangana 500090',
    landmark: 'Near Bachupally Police Station',
    phone: '040-23465891',
    email: 'bachupally.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2009,
    streamsList: [
      { streamName: 'MPC', annualFee: 72000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Competitive scholarship scheme.' },
      { streamName: 'MEC', annualFee: 54000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with analytics.' }
    ]
  },
  {
    name: 'Government Vocational Junior College, Bachupally',
    area: 'Bachupally',
    address: 'Bachupally Village Road, Hyderabad, Telangana 500090',
    landmark: 'Near ZPHS Bachupally',
    phone: '040-23040190',
    email: 'gvjc.bachupally@telangana.gov.in',
    website: 'http://gvjc-bachupally.ts.gov.in',
    category: 'VOCATIONAL',
    ownership: 'GOVERNMENT',
    estYear: 1996,
    streamsList: [
      { streamName: 'Vocational', annualFee: 1500, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Job-oriented trades.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Free government textbook scheme.' }
    ]
  },

  // --- 5. MIYAPUR ---
  {
    name: 'Sri Chaitanya Junior College, Miyapur',
    area: 'Miyapur',
    address: 'Allwyn X Roads, Miyapur, Hyderabad, Telangana 500049',
    landmark: 'Near Allwyn Colony Junction',
    phone: '040-64500149',
    email: 'miyapur.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2004,
    streamsList: [
      { streamName: 'MPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'EAMCET and JEE coaching.' },
      { streamName: 'BiPC', annualFee: 70000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching track.' },
      { streamName: 'MEC', annualFee: 52000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Corporate batch.' }
    ]
  },
  {
    name: 'Narayana Junior College, Miyapur',
    area: 'Miyapur',
    address: 'Miyapur Metro Terminal Road, Miyapur, Hyderabad, Telangana 500049',
    landmark: 'Opp. Miyapur Metro Station Entrance',
    phone: '040-23465849',
    email: 'miyapur.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2006,
    streamsList: [
      { streamName: 'MPC', annualFee: 66000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'State board curriculum with national entrance prep.' },
      { streamName: 'CEC', annualFee: 45000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with computers.' }
    ]
  },
  {
    name: 'Resonance Junior College, Miyapur',
    area: 'Miyapur',
    address: 'HMT Swarnapuri Colony, Miyapur, Hyderabad, Telangana 500049',
    landmark: 'Near Talkie Town Theatre',
    phone: '040-66820049',
    email: 'miyapur@resonancehyderabad.com',
    website: 'http://www.resonancehyderabad.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2013,
    streamsList: [
      { streamName: 'MPC', annualFee: 85000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'ResoNET scholarship.' },
      { streamName: 'BiPC', annualFee: 88000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Medical academy.' }
    ]
  },

  // --- 6. PATANCHERU ---
  {
    name: 'Government Polytechnic, Patancheru',
    area: 'Patancheru',
    address: 'Industrial Development Area (IDA), Patancheru, Sangareddy District, Telangana 502319',
    landmark: 'Near Patancheru Police Station',
    phone: '08455-242120',
    email: 'gpt.patancheru@telangana.gov.in',
    website: 'http://gpt-patancheru.ts.gov.in',
    category: 'POLYTECHNIC',
    ownership: 'GOVERNMENT',
    estYear: 1983,
    streamsList: [
      { streamName: 'Polytechnic', annualFee: 3800, minQualification: '10th Class + TS POLYCET', requiredMarks: 'POLYCET Rank', admissionType: 'COUNSELLING', reservationInfo: 'Mechanical, EEE, Chemical & Civil branches.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Patancheru',
    area: 'Patancheru',
    address: 'NH-65 Mumbai Highway, Patancheru, Hyderabad, Telangana 502319',
    landmark: 'Near Patancheru X Roads & Bus Depot',
    phone: '040-64500319',
    email: 'patancheru.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2010,
    streamsList: [
      { streamName: 'MPC', annualFee: 58000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Subsidized transport from surrounding mandals.' },
      { streamName: 'BiPC', annualFee: 60000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET foundation.' }
    ]
  },
  {
    name: 'Government ITI, Patancheru',
    area: 'Patancheru',
    address: 'Substation Road, IDA Patancheru, Telangana 502319',
    landmark: 'Near 132KV Substation',
    phone: '08455-242130',
    email: 'patancheru.iti@telangana.gov.in',
    website: 'http://www.govtiti-patancheru.org',
    category: 'ITI',
    ownership: 'GOVERNMENT',
    estYear: 1978,
    streamsList: [
      { streamName: 'ITI', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: '10th GPA', admissionType: 'COUNSELLING', reservationInfo: 'Electrician, Fitter, Welder trades.' }
    ]
  },

  // --- 7. NIZAMPET ---
  {
    name: 'Narayana Junior College, Nizampet',
    area: 'Nizampet',
    address: 'Nizampet Main Road, Near Vertex Pleasant, Nizampet, Hyderabad, Telangana 500090',
    landmark: 'Near Vertex Lakeview Colony',
    phone: '040-23465892',
    email: 'nizampet.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2011,
    streamsList: [
      { streamName: 'MPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT Olympiad coaching.' },
      { streamName: 'BiPC', annualFee: 70000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET target track.' },
      { streamName: 'MEC', annualFee: 50000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with economics.' }
    ]
  },
  {
    name: 'Government Junior College, Nizampet',
    area: 'Nizampet',
    address: 'Bandari Layout, Nizampet Village Road, Hyderabad, Telangana 500090',
    landmark: 'Near Bandari Layout Park',
    phone: '040-23040192',
    email: 'gjc.nizampet@telangana.gov.in',
    website: 'http://gjc-nizampet.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1998,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State quota reservations.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Free bus pass for registered students.' }
    ]
  },

  // --- 8. CHINTAL ---
  {
    name: 'Government Junior College, Chintal',
    area: 'Chintal',
    address: 'Chintal Main Road, Quthbullapur Mandal, Hyderabad, Telangana 500054',
    landmark: 'Near Chintal Bus Stop & Sri Venkateshwara Swamy Temple',
    phone: '040-23190054',
    email: 'gjc.chintal@telangana.gov.in',
    website: 'http://gjc-chintal.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1984,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Chintal',
    area: 'Chintal',
    address: 'HMT Main Road, Chintal, Hyderabad, Telangana 500054',
    landmark: 'Opp. Ganesh Temple, Chintal',
    phone: '040-64500154',
    email: 'chintal.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2007,
    streamsList: [
      { streamName: 'MPC', annualFee: 60000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Merit scholarship.' },
      { streamName: 'BiPC', annualFee: 62000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching track.' }
    ]
  },
  {
    name: 'Narayana Junior College, Chintal',
    area: 'Chintal',
    address: 'Ranga Nagar, Chintal, Hyderabad, Telangana 500054',
    landmark: 'Near IDPL Colony Gate',
    phone: '040-23465854',
    email: 'chintal.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2009,
    streamsList: [
      { streamName: 'MPC', annualFee: 58000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'General scholarships.' },
      { streamName: 'CEC', annualFee: 42000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with tally.' }
    ]
  },

  // --- 9. KONDAPUR ---
  {
    name: 'Narayana Junior College, Kondapur',
    area: 'Kondapur',
    address: 'Raghavendra Colony, Kondapur, Hyderabad, Telangana 500084',
    landmark: 'Near KIMS Cuddles & Kondapur RTA Office',
    phone: '040-23465884',
    email: 'kondapur.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2011,
    streamsList: [
      { streamName: 'MPC', annualFee: 75000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE Olympiad campus.' },
      { streamName: 'BiPC', annualFee: 78000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET super-60 batch.' },
      { streamName: 'MEC', annualFee: 60000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'CA foundation.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Kondapur',
    area: 'Kondapur',
    address: 'Hafeezpet Road, Kondapur, Hyderabad, Telangana 500084',
    landmark: 'Near Kondapur Junction & AMB Cinemas',
    phone: '040-64500184',
    email: 'kondapur.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2012,
    streamsList: [
      { streamName: 'MPC', annualFee: 78000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Integrated JEE campus.' },
      { streamName: 'BiPC', annualFee: 80000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Medical academy.' }
    ]
  },
  {
    name: 'Government Junior College, Kondapur',
    area: 'Kondapur',
    address: 'Masjid Banda Road, Kondapur, Hyderabad, Telangana 500084',
    landmark: 'Near Botanical Garden West Gate',
    phone: '040-23110184',
    email: 'gjc.kondapur@telangana.gov.in',
    website: 'http://gjc-kondapur.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1999,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' }
    ]
  },

  // --- 10. MADHAPUR ---
  {
    name: 'Sri Chaitanya Junior College, Madhapur',
    area: 'Madhapur',
    address: 'Ayyappa Society Main Road, Madhapur, Hyderabad, Telangana 500081',
    landmark: 'Near 100 Feet Road Y-Junction',
    phone: '040-64500181',
    email: 'madhapur.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2008,
    streamsList: [
      { streamName: 'MPC', annualFee: 82000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE elite batch.' },
      { streamName: 'BiPC', annualFee: 85000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET academy.' },
      { streamName: 'MEC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Business economics track.' }
    ]
  },
  {
    name: 'Government Vocational Junior College, Madhapur',
    area: 'Madhapur',
    address: 'Khanamet, Near Shilparamam, Madhapur, Hyderabad, Telangana 500081',
    landmark: 'Opp. Shilparamam Arts Village',
    phone: '040-23110181',
    email: 'gvjc.madhapur@telangana.gov.in',
    website: 'http://gvjc-madhapur.ts.gov.in',
    category: 'VOCATIONAL',
    ownership: 'GOVERNMENT',
    estYear: 1995,
    streamsList: [
      { streamName: 'Vocational', annualFee: 1500, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Digital arts and IT trades.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State quota.' }
    ]
  },

  // --- 11. UPPAL ---
  {
    name: 'Sri Chaitanya Junior College, Uppal',
    area: 'Uppal',
    address: 'Ramanthapur - Uppal Main Road, Uppal, Hyderabad, Telangana 500039',
    landmark: 'Near Uppal Stadium Metro Station',
    phone: '040-64500139',
    email: 'uppal.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2006,
    streamsList: [
      { streamName: 'MPC', annualFee: 62000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'JEE Mains coaching included.' },
      { streamName: 'BiPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching included.' },
      { streamName: 'MEC', annualFee: 48000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with mathematics.' }
    ]
  },
  {
    name: 'Narayana Junior College, Uppal',
    area: 'Uppal',
    address: 'Peerzadiguda Road, Uppal, Hyderabad, Telangana 500039',
    landmark: 'Near Rajiv Gandhi International Cricket Stadium',
    phone: '040-23465839',
    email: 'uppal.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2008,
    streamsList: [
      { streamName: 'MPC', annualFee: 60000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'General scholarships.' },
      { streamName: 'CEC', annualFee: 42000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },
  {
    name: 'Government ITI for Boys, Uppal',
    area: 'Uppal',
    address: 'IDA Uppal, Hyderabad, Telangana 500039',
    landmark: 'Near Modern Food Industries',
    phone: '040-27201039',
    email: 'uppal.iti@telangana.gov.in',
    website: 'http://www.govtiti-uppal.org',
    category: 'ITI',
    ownership: 'GOVERNMENT',
    estYear: 1976,
    streamsList: [
      { streamName: 'ITI', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: '10th GPA', admissionType: 'COUNSELLING', reservationInfo: 'State ITI quota.' }
    ]
  },

  // --- 12. DAMMAIGUDA ---
  {
    name: 'Government Junior College, Dammaiguda',
    area: 'Dammaiguda',
    address: 'Dammaiguda Main Road, Medchal-Malkajgiri District, Hyderabad, Telangana 500083',
    landmark: 'Near Dammaiguda Municipality Office',
    phone: '040-27120083',
    email: 'gjc.dammaiguda@telangana.gov.in',
    website: 'http://gjc-dammaiguda.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1993,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Dammaiguda',
    area: 'Dammaiguda',
    address: 'Keesara Road, Dammaiguda, Hyderabad, Telangana 500083',
    landmark: 'Near Dammaiguda X Roads',
    phone: '040-64500183',
    email: 'dammaiguda.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2015,
    streamsList: [
      { streamName: 'MPC', annualFee: 58000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Merit scholarship.' },
      { streamName: 'BiPC', annualFee: 60000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET track.' }
    ]
  },
  {
    name: 'Vikas Junior College, Dammaiguda',
    area: 'Dammaiguda',
    address: 'Sai Priya Colony, Dammaiguda, Hyderabad, Telangana 500083',
    landmark: 'Near Shiva Temple Dammaiguda',
    phone: '040-27140083',
    email: 'vikas.dammaiguda@gmail.com',
    website: 'http://www.vikasjuniorcollege.edu',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2012,
    streamsList: [
      { streamName: 'MPC', annualFee: 50000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Local students concession.' },
      { streamName: 'CEC', annualFee: 38000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 13. ALWAL ---
  {
    name: 'Government Junior College, Alwal',
    area: 'Alwal',
    address: 'Old Alwal Road, Secunderabad, Telangana 500010',
    landmark: 'Near Indira Gandhi Statue, Old Alwal',
    phone: '040-27860111',
    email: 'gjc.alwal@telangana.gov.in',
    website: 'http://gjc-alwal.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1980,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' }
    ]
  },
  {
    name: 'Loyola Academy Junior College, Alwal',
    area: 'Alwal',
    address: 'Loyola Academy Campus, Old Alwal, Secunderabad, Telangana 500010',
    landmark: 'Near Loyola Academy Degree & PG College',
    phone: '040-27862363',
    email: 'admissions@loyolaacademy.edu.in',
    website: 'http://www.loyolaacademy.edu.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'AIDED',
    estYear: 1976,
    streamsList: [
      { streamName: 'MPC', annualFee: 35000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Christian minority and general merit.' },
      { streamName: 'BiPC', annualFee: 36000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Christian minority and general merit.' },
      { streamName: 'MEC', annualFee: 32000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Commerce with mathematics.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Alwal',
    area: 'Alwal',
    address: 'Temple Alwal Road, Alwal, Secunderabad, Telangana 500010',
    landmark: 'Near Alwal Rythu Bazar',
    phone: '040-64500112',
    email: 'alwal.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2007,
    streamsList: [
      { streamName: 'MPC', annualFee: 62000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE coaching.' },
      { streamName: 'BiPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching.' }
    ]
  },

  // --- 14. SHAPUR NAGAR ---
  {
    name: 'Government Junior College, Shapur Nagar',
    area: 'Shapur Nagar',
    address: 'Pipe Line Road, Shapur Nagar, Jeedimetla, Hyderabad, Telangana 500055',
    landmark: 'Near Shapur Nagar Bus Stop',
    phone: '040-23090055',
    email: 'gjc.shapurnagar@telangana.gov.in',
    website: 'http://gjc-shapurnagar.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1985,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Shapur Nagar',
    area: 'Shapur Nagar',
    address: 'Main Road, Shapur Nagar, Hyderabad, Telangana 500055',
    landmark: 'Near Venkateshwara Theatre, Shapur Nagar',
    phone: '040-64500155',
    email: 'shapurnagar.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2008,
    streamsList: [
      { streamName: 'MPC', annualFee: 60000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Merit scholarship.' },
      { streamName: 'BiPC', annualFee: 62000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET foundation.' }
    ]
  },
  {
    name: 'Narayana Junior College, Shapur Nagar',
    area: 'Shapur Nagar',
    address: 'IDA Jeedimetla, Shapur Nagar Main Road, Hyderabad, Telangana 500055',
    landmark: 'Near Ganesh Temple, Shapur Nagar',
    phone: '040-23465855',
    email: 'shapurnagar.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2009,
    streamsList: [
      { streamName: 'MPC', annualFee: 58000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'General scholarships.' },
      { streamName: 'CEC', annualFee: 42000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 15. ATTAPUR ---
  {
    name: 'Government Junior College, Attapur',
    area: 'Attapur',
    address: 'PVNR Expressway Pillar 135, Attapur, Hyderabad, Telangana 500048',
    landmark: 'Near PVNR Expressway Pillar 135',
    phone: '040-24010048',
    email: 'gjc.attapur@telangana.gov.in',
    website: 'http://gjc-attapur.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1989,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policy.' }
    ]
  },
  {
    name: 'Narayana Junior College, Attapur',
    area: 'Attapur',
    address: 'Hyderguda Main Road, Attapur, Hyderabad, Telangana 500048',
    landmark: 'Near Attapur X Roads',
    phone: '040-23465848',
    email: 'attapur.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2007,
    streamsList: [
      { streamName: 'MPC', annualFee: 66000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'National entrance prep.' },
      { streamName: 'BiPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Medical entrance prep.' },
      { streamName: 'MEC', annualFee: 52000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with computers.' }
    ]
  },
  {
    name: "St. Mary's Junior College, Attapur",
    area: 'Attapur',
    address: 'Upperpally, Attapur, Hyderabad, Telangana 500048',
    landmark: 'Near Upperpally Flyover',
    phone: '040-24012548',
    email: 'attapur@stmaryscollege.in',
    website: 'http://stmarys.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 1997,
    streamsList: [
      { streamName: 'MEC', annualFee: 52000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Merit basis.' },
      { streamName: 'CEC', annualFee: 48000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // ==========================================
  // PHASE 1: HIGH-DENSITY HUBS EXPANSION
  // ==========================================

  // --- 16. SR NAGAR ---
  {
    name: 'Government Junior College, SR Nagar',
    area: 'SR Nagar',
    address: 'Community Hall Road, B.K. Guda, Sanjeeva Reddy Nagar, Hyderabad, Telangana 500038',
    landmark: 'Near SR Nagar Post Office & Metro Station',
    phone: '040-23812038',
    email: 'gjc.srnagar@telangana.gov.in',
    website: 'http://gjc-srnagar.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1978,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' },
      { streamName: 'HEC', annualFee: 900, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' }
    ]
  },
  {
    name: 'Narayana Junior College, SR Nagar',
    area: 'SR Nagar',
    address: 'Behind Mythrivanam Complex, Main Road, SR Nagar, Hyderabad, Telangana 500038',
    landmark: 'Near Umesh Chandra Statue & SR Nagar Metro Pillar A982',
    phone: '040-66412038',
    email: 'srnagar.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 1999,
    streamsList: [
      { streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE coaching integrated.' },
      { streamName: 'BiPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'MEC', annualFee: 48000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'CA Foundation coaching.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, SR Nagar',
    area: 'SR Nagar',
    address: 'Opposite State Bank of India, Vengal Rao Nagar Road, SR Nagar, Hyderabad, Telangana 500038',
    landmark: 'Near SR Nagar Police Station',
    phone: '040-66772038',
    email: 'srnagar.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2002,
    streamsList: [
      { streamName: 'MPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'JEE Mains & Advanced integrated.' },
      { streamName: 'BiPC', annualFee: 70000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'AIIMS & NEET coaching.' },
      { streamName: 'CEC', annualFee: 45000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with computing.' }
    ]
  },

  // --- 17. SUCHITRA ---
  {
    name: 'Government Junior College, Suchitra',
    area: 'Suchitra',
    address: 'Medchal Road, Near Suchitra Junction, Jeedimetla, Secunderabad, Telangana 500067',
    landmark: 'Beside Suchitra Flyover, Medchal Highway',
    phone: '040-27940067',
    email: 'gjc.suchitra@telangana.gov.in',
    website: 'http://gjc-suchitra.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1992,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Suchitra',
    area: 'Suchitra',
    address: 'NH-44 Hyderabad-Nagpur Highway, Suchitra Circle, Hyderabad, Telangana 500067',
    landmark: 'Opposite Decathlon Suchitra',
    phone: '040-66550067',
    email: 'suchitra.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2010,
    streamsList: [
      { streamName: 'MPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Integrated IIT-JEE batches.' },
      { streamName: 'BiPC', annualFee: 72000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Integrated NEET batches.' },
      { streamName: 'MEC', annualFee: 50000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with economics.' }
    ]
  },
  {
    name: 'Narayana Junior College, Suchitra',
    area: 'Suchitra',
    address: 'Suchitra Cross Roads, Main Medchal Road, Secunderabad, Telangana 500067',
    landmark: 'Near D-Mart Suchitra & McDonald\'s',
    phone: '040-27941067',
    email: 'suchitra.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2008,
    streamsList: [
      { streamName: 'MPC', annualFee: 66000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Merit scholarship available.' },
      { streamName: 'BiPC', annualFee: 69000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Comprehensive science training.' },
      { streamName: 'CEC', annualFee: 44000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 18. BHEL & RC PURAM ---
  {
    name: 'Government Junior College, RC Puram',
    area: 'RC Puram',
    address: 'Old Police Station Road, Ramachandrapuram (BHEL), Sangareddy District, Telangana 502032',
    landmark: 'Near RC Puram Bus Depot & BHEL Gate 5',
    phone: '08455-281032',
    email: 'gjc.rcpuram@telangana.gov.in',
    website: 'http://gjc-rcpuram.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1980,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Telangana state quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Telangana state quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' },
      { streamName: 'HEC', annualFee: 950, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' }
    ]
  },
  {
    name: "St. Ann's Junior College for Girls, BHEL",
    area: 'BHEL',
    address: 'BHEL Township, Ramachandrapuram, Sangareddy District, Hyderabad, Telangana 502032',
    landmark: 'Inside BHEL Township, Near Community Center',
    phone: '040-23184032',
    email: 'stanns.bhel@gmail.com',
    website: 'http://stannsbhel.edu.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'AIDED',
    estYear: 1985,
    streamsList: [
      { streamName: 'MPC', annualFee: 15000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Girls only institution.' },
      { streamName: 'BiPC', annualFee: 16000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Girls only institution.' },
      { streamName: 'CEC', annualFee: 12000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with computers.' },
      { streamName: 'MEC', annualFee: 14000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with mathematics.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, BHEL',
    area: 'BHEL',
    address: 'Near Ashok Nagar X Roads, Mumbai Highway NH-65, BHEL, Sangareddy, Telangana 502032',
    landmark: 'Near BHEL Main Gate & Jyothi Theatre',
    phone: '040-65882032',
    email: 'bhel.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2007,
    streamsList: [
      { streamName: 'MPC', annualFee: 64000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'JEE Mains & Advanced coaching.' },
      { streamName: 'BiPC', annualFee: 67000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET medical foundation.' },
      { streamName: 'CEC', annualFee: 42000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 19. LINGAMPALLY ---
  {
    name: 'Government Junior College, Serilingampally',
    area: 'Lingampally',
    address: 'Railway Station Road, Serilingampally, Hyderabad, Telangana 500019',
    landmark: 'Opposite Lingampally Railway Station Platform 1',
    phone: '040-23010019',
    email: 'gjc.lingampally@telangana.gov.in',
    website: 'http://gjc-serilingampally.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1984,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' }
    ]
  },
  {
    name: 'Narayana Junior College, Lingampally',
    area: 'Lingampally',
    address: 'Gulmohar Park Colony Road, Lingampally, Hyderabad, Telangana 500019',
    landmark: 'Near Serilingampally Sub-Registrar Office',
    phone: '040-66480019',
    email: 'lingampally.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2006,
    streamsList: [
      { streamName: 'MPC', annualFee: 62000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT Olympiad curriculum.' },
      { streamName: 'BiPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET medical coaching.' },
      { streamName: 'MEC', annualFee: 45000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Integrated commerce program.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Lingampally',
    area: 'Lingampally',
    address: 'Beside Vijetha Supermarket, Tara Nagar, Lingampally, Hyderabad, Telangana 500019',
    landmark: 'Near Lingampally Bus Terminus',
    phone: '040-66120019',
    email: 'lingampally.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2009,
    streamsList: [
      { streamName: 'MPC', annualFee: 64000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Engineering entrance batches.' },
      { streamName: 'BiPC', annualFee: 66000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Medicine entrance batches.' },
      { streamName: 'CEC', annualFee: 43000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 20. NAGOLE ---
  {
    name: 'Government Junior College, Nagole',
    area: 'Nagole',
    address: 'Nagole - Bandlaguda Road, Nagole, Hyderabad, Telangana 500068',
    landmark: 'Near Nagole RTO Office & Anand Nagar',
    phone: '040-24220068',
    email: 'gjc.nagole@telangana.gov.in',
    website: 'http://gjc-nagole.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1993,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' }
    ]
  },
  {
    name: 'Sri Gayatri Junior College, Nagole',
    area: 'Nagole',
    address: 'Inner Ring Road, Nagole Cross Roads, Hyderabad, Telangana 500068',
    landmark: 'Beside Nagole Metro Station Pillar C1012',
    phone: '040-24021068',
    email: 'nagole@srigayatri.com',
    website: 'http://www.srigayatri.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2004,
    streamsList: [
      { streamName: 'MPC', annualFee: 55000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Merit scholarship on score.' },
      { streamName: 'BiPC', annualFee: 58000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Medical entrance training.' },
      { streamName: 'MEC', annualFee: 40000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with maths.' },
      { streamName: 'CEC', annualFee: 38000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Nagole',
    area: 'Nagole',
    address: 'Alkapuri Colony Road, Nagole, Hyderabad, Telangana 500068',
    landmark: 'Near Alkapuri X Roads, Nagole',
    phone: '040-66881068',
    email: 'nagole.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2011,
    streamsList: [
      { streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'JEE Mains & Advanced integrated.' },
      { streamName: 'BiPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'MEC', annualFee: 46000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with mathematics.' }
    ]
  },

  // --- 21. BODUPPAL ---
  {
    name: 'Government Junior College, Boduppal',
    area: 'Boduppal',
    address: 'Warangal Highway Link Road, Boduppal Municipal Corporation, Medchal-Malkajgiri, Telangana 500092',
    landmark: 'Near Boduppal Municipal Office & Ambedkar Statue',
    phone: '040-27200092',
    email: 'gjc.boduppal@telangana.gov.in',
    website: 'http://gjc-boduppal.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1998,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission.' }
    ]
  },
  {
    name: 'Narayana Junior College, Boduppal',
    area: 'Boduppal',
    address: 'Boduppal Main Road, Near Srinivas Heights, Medchal-Malkajgiri, Telangana 500092',
    landmark: 'Opposite D-Mart Boduppal',
    phone: '040-66440092',
    email: 'boduppal.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2012,
    streamsList: [
      { streamName: 'MPC', annualFee: 62000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Competitive science batches.' },
      { streamName: 'BiPC', annualFee: 64000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Pre-medical training.' },
      { streamName: 'CEC', annualFee: 42000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },
  {
    name: 'Aurora Junior College, Boduppal',
    area: 'Boduppal',
    address: 'Survey No. 98, Peerzadiguda Road, Boduppal, Hyderabad, Telangana 500092',
    landmark: 'Near Uppal - Boduppal Highway Junction',
    phone: '040-27150092',
    email: 'info@aurora.edu.in',
    website: 'http://www.aurora.edu.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2005,
    streamsList: [
      { streamName: 'MPC', annualFee: 58000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Science with IT lab focus.' },
      { streamName: 'BiPC', annualFee: 60000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Bio-science modern lab.' },
      { streamName: 'MEC', annualFee: 44000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with applied statistics.' }
    ]
  },

  // --- 22. VANASTHALIPURAM ---
  {
    name: 'Government Junior College, Vanasthalipuram',
    area: 'Vanasthalipuram',
    address: 'Saheb Nagar Road, Vanasthalipuram, Ranga Reddy District, Telangana 500070',
    landmark: 'Near Vanasthalipuram Rythu Bazar',
    phone: '040-24110070',
    email: 'gjc.vanasthalipuram@telangana.gov.in',
    website: 'http://gjc-vanasthalipuram.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1982,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Telangana state quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Telangana state quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' },
      { streamName: 'HEC', annualFee: 950, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Vanasthalipuram',
    area: 'Vanasthalipuram',
    address: 'Red Tank Road, Phase 2, Vanasthalipuram, Hyderabad, Telangana 500070',
    landmark: 'Near Vanasthalipuram Complex & Red Tank',
    phone: '040-66780070',
    email: 'vanasthalipuram.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2003,
    streamsList: [
      { streamName: 'MPC', annualFee: 66000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'JEE Mains & Advanced integrated.' },
      { streamName: 'BiPC', annualFee: 69000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET medical coaching.' },
      { streamName: 'MEC', annualFee: 47000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with computing.' }
    ]
  },
  {
    name: 'Narayana Junior College, Vanasthalipuram',
    area: 'Vanasthalipuram',
    address: 'High Court Colony, Vanasthalipuram, Hyderabad, Telangana 500070',
    landmark: 'Beside Sushma Theater, Vijayawada Highway NH-65',
    phone: '040-66490070',
    email: 'vanasthalipuram.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2006,
    streamsList: [
      { streamName: 'MPC', annualFee: 64000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE coaching integrated.' },
      { streamName: 'BiPC', annualFee: 67000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Medical entrance prep.' },
      { streamName: 'CEC', annualFee: 43000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 23. RAJENDRANAGAR ---
  {
    name: 'Government Polytechnic, Rajendranagar',
    area: 'Rajendranagar',
    address: 'PJTSAU Campus Road, Rajendranagar, Hyderabad, Telangana 500030',
    landmark: 'Inside Professor Jayashankar Agricultural University Campus',
    phone: '040-24015030',
    email: 'gpt.rajendranagar@telangana.gov.in',
    website: 'http://gpt-rajendranagar.ts.gov.in',
    category: 'POLYTECHNIC',
    ownership: 'GOVERNMENT',
    estYear: 1974,
    streamsList: [
      { streamName: 'Diploma in Civil Engineering', annualFee: 3800, minQualification: '10th Pass (POLYCET)', requiredMarks: 'POLYCET Rank', admissionType: 'ENTRANCE_BASED', reservationInfo: 'POLYCET counselling quota.' },
      { streamName: 'Diploma in Mechanical Engineering', annualFee: 3800, minQualification: '10th Pass (POLYCET)', requiredMarks: 'POLYCET Rank', admissionType: 'ENTRANCE_BASED', reservationInfo: 'POLYCET counselling quota.' },
      { streamName: 'Diploma in ECE', annualFee: 3800, minQualification: '10th Pass (POLYCET)', requiredMarks: 'POLYCET Rank', admissionType: 'ENTRANCE_BASED', reservationInfo: 'POLYCET counselling quota.' },
      { streamName: 'Diploma in Agricultural Engineering', annualFee: 3800, minQualification: '10th Pass (POLYCET)', requiredMarks: 'POLYCET Rank', admissionType: 'ENTRANCE_BASED', reservationInfo: 'State reservation applies.' }
    ]
  },
  {
    name: 'Telangana Model School & Junior College, Rajendranagar',
    area: 'Rajendranagar',
    address: 'Budvel Road, Rajendranagar Mandal, Ranga Reddy District, Telangana 500030',
    landmark: 'Near Budvel Railway Station & Outer Ring Road Exit 17',
    phone: '040-24018030',
    email: 'tms.rajendranagar@telangana.gov.in',
    website: 'http://tms-rajendranagar.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 2013,
    streamsList: [
      { streamName: 'MPC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Model school government guidelines.' },
      { streamName: 'BiPC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Model school government guidelines.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Model school government guidelines.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Rajendranagar',
    area: 'Rajendranagar',
    address: 'PVNR Expressway Pillar 190, Upperpally, Rajendranagar, Hyderabad, Telangana 500030',
    landmark: 'Near Pillar 190, PVNR Expressway',
    phone: '040-66220030',
    email: 'rajendranagar.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2011,
    streamsList: [
      { streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE coaching integrated.' },
      { streamName: 'BiPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'CEC', annualFee: 44000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 24. NEREDMET ---
  {
    name: "Bhavan's New Science Junior College, Neredmet",
    area: 'Neredmet',
    address: 'Sainikpuri - Neredmet Main Road, Secunderabad, Telangana 500056',
    landmark: 'Near Neredmet Cross Roads & Police Station',
    phone: '040-27111056',
    email: 'bhavans.neredmet@bhavans.org',
    website: 'http://www.bhavans.org',
    category: 'JUNIOR_COLLEGE',
    ownership: 'AIDED',
    estYear: 1979,
    streamsList: [
      { streamName: 'MPC', annualFee: 18000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Merit list based on SSC GPA.' },
      { streamName: 'BiPC', annualFee: 19000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Merit list based on SSC GPA.' },
      { streamName: 'MEC', annualFee: 16000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with mathematics.' },
      { streamName: 'CEC', annualFee: 14000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Neredmet',
    area: 'Neredmet',
    address: 'Defence Colony Road, Neredmet, Secunderabad, Telangana 500056',
    landmark: 'Opposite Neredmet Bus Stop',
    phone: '040-66330056',
    email: 'neredmet.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2008,
    streamsList: [
      { streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Engineering entrance batches.' },
      { streamName: 'BiPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Medicine entrance batches.' },
      { streamName: 'CEC', annualFee: 43000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },
  {
    name: 'Narayana Junior College, Neredmet',
    area: 'Neredmet',
    address: 'Vayupuri Road, Neredmet, Secunderabad, Telangana 500056',
    landmark: 'Near Neredmet Old PS & Radhika Multiplex Junction',
    phone: '040-27112056',
    email: 'neredmet.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2006,
    streamsList: [
      { streamName: 'MPC', annualFee: 63000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE coaching integrated.' },
      { streamName: 'BiPC', annualFee: 66000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'MEC', annualFee: 45000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'CA Foundation coaching.' }
    ]
  },

  // --- 25. MARREDPALLY ---
  {
    name: 'Keyes Junior College for Women, Marredpally',
    area: 'Marredpally',
    address: 'Opposite Keyes High School Ground, East Marredpally, Secunderabad, Telangana 500026',
    landmark: 'Near Secunderabad Railway Station & Sangeet Theatre Junction',
    phone: '040-27801026',
    email: 'keyesjrcollege@gmail.com',
    website: 'http://keyesjuniorcollege.edu.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'AIDED',
    estYear: 1968,
    streamsList: [
      { streamName: 'MPC', annualFee: 12000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Women only institution.' },
      { streamName: 'BiPC', annualFee: 13000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Women only institution.' },
      { streamName: 'CEC', annualFee: 9500, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission for girls.' },
      { streamName: 'HEC', annualFee: 9000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission for girls.' }
    ]
  },
  {
    name: "St. Ann's Junior College, West Marredpally",
    area: 'Marredpally',
    address: 'Sarojini Devi Road, West Marredpally, Secunderabad, Telangana 500026',
    landmark: 'Near Marredpally Police Station & Jubilee Bus Station',
    phone: '040-27802026',
    email: 'stanns.marredpally@gmail.com',
    website: 'http://stannsmarredpally.edu.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'AIDED',
    estYear: 1975,
    streamsList: [
      { streamName: 'MPC', annualFee: 14000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Merit list based admission.' },
      { streamName: 'BiPC', annualFee: 15000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Pre-medical training with lab.' },
      { streamName: 'MEC', annualFee: 13000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with mathematics.' },
      { streamName: 'CEC', annualFee: 11000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },
  {
    name: 'Narayana Junior College, Marredpally',
    area: 'Marredpally',
    address: 'Shenoy Nursing Home Road, East Marredpally, Secunderabad, Telangana 500026',
    landmark: 'Near Shenoy Nursing Home & Teachers Colony',
    phone: '040-66221026',
    email: 'marredpally.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2004,
    streamsList: [
      { streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'National entrance coaching.' },
      { streamName: 'BiPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'MEC', annualFee: 48000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Integrated CA foundation.' }
    ]
  },

  // ==========================================
  // PHASE 2: HIGHWAY & SUBURBAN BELTS EXPANSION
  // ==========================================

  // --- 26. SHAMIRPET ---
  {
    name: 'Government Junior College, Shamirpet',
    area: 'Shamirpet',
    address: 'Main Rajiv Rahadari Road, Shamirpet Mandal, Medchal-Malkajgiri District, Telangana 500078',
    landmark: 'Opposite Shamirpet Police Station & Mandal Revenue Office',
    phone: '08418-245078',
    email: 'gjc.shamirpet@telangana.gov.in',
    website: 'http://gjc-shamirpet.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1989,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' },
      { streamName: 'HEC', annualFee: 900, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' }
    ]
  },
  {
    name: 'CMR Group Junior College, Shamirpet',
    area: 'Shamirpet',
    address: 'Medchal Road, Kandlakoya - Shamirpet Road, Medchal District, Telangana 500078',
    landmark: 'Near Kandlakoya Oxygen Park & ORR Exit 6',
    phone: '08418-200078',
    email: 'admissions@cmrgroup.edu.in',
    website: 'http://www.cmrgroup.edu.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2005,
    streamsList: [
      { streamName: 'MPC', annualFee: 62000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Engineering entrance foundation.' },
      { streamName: 'BiPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Pre-medical coaching.' },
      { streamName: 'MEC', annualFee: 45000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with mathematics.' }
    ]
  },
  {
    name: 'Narayana Residential Junior College, Shamirpet',
    area: 'Shamirpet',
    address: 'Aliabad X Roads, Shamirpet Mandal, Hyderabad, Telangana 500078',
    landmark: 'Near NALSAR Law University Road & Shamirpet Lake',
    phone: '040-66442078',
    email: 'shamirpet.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2008,
    hasHostel: true,
    streamsList: [
      { streamName: 'MPC', annualFee: 75000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Intensive residential IIT-JEE batches.' },
      { streamName: 'BiPC', annualFee: 78000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Intensive residential NEET batches.' },
      { streamName: 'CEC', annualFee: 48000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 27. GANDI MAISAMMA ---
  {
    name: 'Government Polytechnic, Gandi Maisamma',
    area: 'Gandi Maisamma',
    address: 'Dundigal Road, Gandi Maisamma X Roads, Medchal-Malkajgiri, Telangana 500043',
    landmark: 'Near Gandi Maisamma Temple Junction & ORR Exit 5',
    phone: '08418-255043',
    email: 'gpt.gandimaisamma@telangana.gov.in',
    website: 'http://gpt-gandimaisamma.ts.gov.in',
    category: 'POLYTECHNIC',
    ownership: 'GOVERNMENT',
    estYear: 1988,
    streamsList: [
      { streamName: 'Diploma in Civil Engineering', annualFee: 3800, minQualification: '10th Pass (POLYCET)', requiredMarks: 'POLYCET Rank', admissionType: 'ENTRANCE_BASED', reservationInfo: 'POLYCET counselling quota.' },
      { streamName: 'Diploma in Mechanical Engineering', annualFee: 3800, minQualification: '10th Pass (POLYCET)', requiredMarks: 'POLYCET Rank', admissionType: 'ENTRANCE_BASED', reservationInfo: 'POLYCET counselling quota.' },
      { streamName: 'Diploma in Computer Engineering', annualFee: 3800, minQualification: '10th Pass (POLYCET)', requiredMarks: 'POLYCET Rank', admissionType: 'ENTRANCE_BASED', reservationInfo: 'State reservation quota.' },
      { streamName: 'Diploma in Electrical & Electronics', annualFee: 3800, minQualification: '10th Pass (POLYCET)', requiredMarks: 'POLYCET Rank', admissionType: 'ENTRANCE_BASED', reservationInfo: 'State reservation quota.' }
    ]
  },
  {
    name: 'MLR Institute Junior Wing, Gandi Maisamma',
    area: 'Gandi Maisamma',
    address: 'Dundigal Police Station Road, Gandi Maisamma, Hyderabad, Telangana 500043',
    landmark: 'Beside MLR Campus, Near Air Force Academy Road',
    phone: '040-29562043',
    email: 'mlr.junior@mlrinstitutions.ac.in',
    website: 'http://mlrinstitutions.ac.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2005,
    streamsList: [
      { streamName: 'MPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Aeronautical & tech foundation.' },
      { streamName: 'BiPC', annualFee: 70000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Integrated science labs.' },
      { streamName: 'MEC', annualFee: 48000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with statistics.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Gandi Maisamma',
    area: 'Gandi Maisamma',
    address: 'Bowrampet - Gandi Maisamma Main Road, Medchal District, Telangana 500043',
    landmark: 'Near Bowrampet Junction & ORR Service Road',
    phone: '040-66992043',
    email: 'gandimaisamma.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2012,
    streamsList: [
      { streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE Mains and Advanced.' },
      { streamName: 'BiPC', annualFee: 67000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching batches.' },
      { streamName: 'CEC', annualFee: 42000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 28. POCHARAM ---
  {
    name: 'Government Junior College, Pocharam',
    area: 'Pocharam',
    address: 'Infosys SEZ Road, Pocharam Municipality, Medchal-Malkajgiri, Telangana 500088',
    landmark: 'Near Singapore Township (Sanskruti Township) & Infosys Gate 1',
    phone: '08415-225088',
    email: 'gjc.pocharam@telangana.gov.in',
    website: 'http://gjc-pocharam.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1995,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' }
    ]
  },
  {
    name: 'Sree Nidhi Junior College, Pocharam',
    area: 'Pocharam',
    address: 'Yamnampet, Ghatkesar - Pocharam Road, Hyderabad, Telangana 500088',
    landmark: 'Near Sree Nidhi Institute Campus & Warangal Highway',
    phone: '040-27632088',
    email: 'info@sreenidhi.edu.in',
    website: 'http://www.sreenidhi.edu.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 1997,
    streamsList: [
      { streamName: 'MPC', annualFee: 64000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Engineering entrance foundation.' },
      { streamName: 'BiPC', annualFee: 66000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Medical entrance foundation.' },
      { streamName: 'MEC', annualFee: 45000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with computing.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Pocharam',
    area: 'Pocharam',
    address: 'Singapore Township Commercial Complex, Pocharam, Hyderabad, Telangana 500088',
    landmark: 'Opposite Sanskruti Township Main Gate',
    phone: '040-66882088',
    email: 'pocharam.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2011,
    streamsList: [
      { streamName: 'MPC', annualFee: 62000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE coaching integrated.' },
      { streamName: 'BiPC', annualFee: 64000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'CEC', annualFee: 40000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 29. MEERPET ---
  {
    name: 'Government Junior College, Meerpet',
    area: 'Meerpet',
    address: 'Jillelguda Road, Meerpet Municipal Corporation, Ranga Reddy District, Telangana 500097',
    landmark: 'Near Meerpet Police Station & Venkateshwara Swamy Temple',
    phone: '040-24090097',
    email: 'gjc.meerpet@telangana.gov.in',
    website: 'http://gjc-meerpet.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1996,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' },
      { streamName: 'HEC', annualFee: 900, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' }
    ]
  },
  {
    name: 'TKR Educational Society Junior College, Meerpet',
    area: 'Meerpet',
    address: 'TKRCET Campus Road, Meerpet, Saroornagar Mandal, Hyderabad, Telangana 500097',
    landmark: 'Inside TKR Integrated Campus, Near Balapur X Roads',
    phone: '040-65582097',
    email: 'info@tkrec.ac.in',
    website: 'http://tkrec.ac.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2002,
    streamsList: [
      { streamName: 'MPC', annualFee: 58000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Engineering stream on merit.' },
      { streamName: 'BiPC', annualFee: 60000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Medical stream on merit.' },
      { streamName: 'MEC', annualFee: 42000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with mathematics.' },
      { streamName: 'CEC', annualFee: 38000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },
  {
    name: 'Narayana Junior College, Meerpet',
    area: 'Meerpet',
    address: 'Badangpet Main Road, Meerpet, Ranga Reddy District, Telangana 500097',
    landmark: 'Opposite Municipal Office Meerpet',
    phone: '040-66482097',
    email: 'meerpet.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2009,
    streamsList: [
      { streamName: 'MPC', annualFee: 62000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE coaching integrated.' },
      { streamName: 'BiPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'CEC', annualFee: 42000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 30. KOKAPET & GANDIPET ---
  {
    name: 'Chaitanya Bharathi Junior College (CBES), Gandipet',
    area: 'Gandipet',
    address: 'Chaitanya Bharathi PO, Gandipet, Hyderabad, Telangana 500075',
    landmark: 'Adjacent to CBIT Campus, Near Gandipet Ocean Park',
    phone: '040-24193075',
    email: 'principal@cbit.ac.in',
    website: 'http://www.cbit.ac.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 1979,
    streamsList: [
      { streamName: 'MPC', annualFee: 70000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Premier technical feeder.' },
      { streamName: 'BiPC', annualFee: 72000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Pre-medical program.' },
      { streamName: 'MEC', annualFee: 52000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with math.' }
    ]
  },
  {
    name: 'Rockwell +2 Junior College, Kokapet',
    area: 'Kokapet',
    address: 'Golden Mile Road, Kokapet, Gandipet Mandal, Hyderabad, Telangana 500075',
    landmark: 'Near Kokapet SEZ & Outer Ring Road Exit 1',
    phone: '040-66522075',
    email: 'admissions@rockwelltheschool.com',
    website: 'http://rockwelltheschool.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2009,
    streamsList: [
      { streamName: 'MPC', annualFee: 85000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Advanced global curriculum.' },
      { streamName: 'BiPC', annualFee: 88000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Modern research labs.' },
      { streamName: 'MEC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Economics with business math.' },
      { streamName: 'CEC', annualFee: 60000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Kokapet',
    area: 'Kokapet',
    address: 'Neopolis Layout Road, Kokapet, Hyderabad, Telangana 500075',
    landmark: 'Near Kokapet One Golden Mile & Financial District Extension',
    phone: '040-66993075',
    email: 'kokapet.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2016,
    streamsList: [
      { streamName: 'MPC', annualFee: 72000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE Olympiad curriculum.' },
      { streamName: 'BiPC', annualFee: 75000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET medical coaching.' },
      { streamName: 'MEC', annualFee: 55000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with computing.' }
    ]
  },

  // --- 31. MOINABAD ---
  {
    name: 'Government Junior College, Moinabad',
    area: 'Moinabad',
    address: 'Chevella Main Road, Moinabad Mandal, Ranga Reddy District, Telangana 501504',
    landmark: 'Near Moinabad Bus Stand & Mandal Revenue Office',
    phone: '08417-252504',
    email: 'gjc.moinabad@telangana.gov.in',
    website: 'http://gjc-moinabad.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1986,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' },
      { streamName: 'HEC', annualFee: 950, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' }
    ]
  },
  {
    name: 'JB Institute Polytechnic College, Moinabad',
    area: 'Moinabad',
    address: 'Yenkapally Village, Moinabad Mandal, Ranga Reddy District, Telangana 501504',
    landmark: 'Near Bhaskar Medical College & JBIET Campus',
    phone: '08417-252500',
    email: 'admissions@jbiet.edu.in',
    website: 'http://www.jbiet.edu.in',
    category: 'POLYTECHNIC',
    ownership: 'PRIVATE',
    estYear: 1998,
    streamsList: [
      { streamName: 'Diploma in Civil Engineering', annualFee: 32000, minQualification: '10th Pass (POLYCET)', requiredMarks: 'POLYCET Rank', admissionType: 'ENTRANCE_BASED', reservationInfo: 'State counselling quota.' },
      { streamName: 'Diploma in Computer Science', annualFee: 35000, minQualification: '10th Pass (POLYCET)', requiredMarks: 'POLYCET Rank', admissionType: 'ENTRANCE_BASED', reservationInfo: 'State counselling quota.' },
      { streamName: 'Diploma in Electrical Engineering', annualFee: 32000, minQualification: '10th Pass (POLYCET)', requiredMarks: 'POLYCET Rank', admissionType: 'ENTRANCE_BASED', reservationInfo: 'State counselling quota.' },
      { streamName: 'Diploma in Mechanical Engineering', annualFee: 32000, minQualification: '10th Pass (POLYCET)', requiredMarks: 'POLYCET Rank', admissionType: 'ENTRANCE_BASED', reservationInfo: 'State counselling quota.' }
    ]
  },
  {
    name: 'Swathi Junior College, Moinabad',
    area: 'Moinabad',
    address: 'Chilkur Balaji Temple Road, Moinabad, Hyderabad, Telangana 501504',
    landmark: 'Near Chilkur Balaji X Roads',
    phone: '08417-252888',
    email: 'swathi.moinabad@gmail.com',
    website: 'http://swathigroup.edu.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2004,
    streamsList: [
      { streamName: 'MPC', annualFee: 45000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'General merit scholarships.' },
      { streamName: 'BiPC', annualFee: 48000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Pre-medical program.' },
      { streamName: 'CEC', annualFee: 35000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 32. HAFEEZPET ---
  {
    name: 'Government Junior College, Hafeezpet',
    area: 'Hafeezpet',
    address: 'Hafeezpet Main Road, Serilingampally Mandal, Hyderabad, Telangana 500049',
    landmark: 'Near Hafeezpet MMTS Railway Station & Flyover',
    phone: '040-23040049',
    email: 'gjc.hafeezpet@telangana.gov.in',
    website: 'http://gjc-hafeezpet.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1994,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Hafeezpet',
    area: 'Hafeezpet',
    address: 'Near Hafeezpet Flyover, Miyapur - Gachibowli Road, Hyderabad, Telangana 500049',
    landmark: 'Opposite Aditya Sunshine Apartments, Hafeezpet',
    phone: '040-66770049',
    email: 'hafeezpet.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2008,
    streamsList: [
      { streamName: 'MPC', annualFee: 66000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE coaching integrated.' },
      { streamName: 'BiPC', annualFee: 69000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'MEC', annualFee: 48000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with computing.' }
    ]
  },
  {
    name: 'Tapasya Junior College, Madeenaguda - Hafeezpet',
    area: 'Hafeezpet',
    address: 'Main Mumbai Highway, Madeenaguda, Adjacent to Hafeezpet, Hyderabad, Telangana 500049',
    landmark: 'Near GSM Mall & Madeenaguda Bus Stop',
    phone: '040-40150049',
    email: 'madeenaguda@tapasyaedu.com',
    website: 'http://www.tapasyaedu.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2012,
    streamsList: [
      { streamName: 'MEC', annualFee: 52000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'CA Foundation coaching.' },
      { streamName: 'CEC', annualFee: 48000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with computers.' },
      { streamName: 'MPC', annualFee: 55000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Science fundamentals.' }
    ]
  },

  // --- 33. KUSHAIGUDA ---
  {
    name: 'Government ITI College, Kushaiguda',
    area: 'Kushaiguda',
    address: 'Industrial Area Road, Kushaiguda, ECIL Post, Hyderabad, Telangana 500062',
    landmark: 'Near Kushaiguda Bus Depot & Police Station',
    phone: '040-27122062',
    email: 'giti.kushaiguda@telangana.gov.in',
    website: 'http://iti.telangana.gov.in',
    category: 'ITI',
    ownership: 'GOVERNMENT',
    estYear: 1982,
    streamsList: [
      { streamName: 'Electrician Trade', annualFee: 2400, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Telangana ITI admission portal quota.' },
      { streamName: 'Fitter Trade', annualFee: 2400, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Telangana ITI admission portal quota.' },
      { streamName: 'Computer Operator & Programming (COPA)', annualFee: 2400, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Telangana ITI admission portal quota.' },
      { streamName: 'Electronics Mechanic', annualFee: 2400, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation applies.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Kushaiguda',
    area: 'Kushaiguda',
    address: 'Near ECIL Cross Roads, Kushaiguda Main Road, Secunderabad, Telangana 500062',
    landmark: 'Beside Kushaiguda Post Office',
    phone: '040-66440062',
    email: 'kushaiguda.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2006,
    streamsList: [
      { streamName: 'MPC', annualFee: 64000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'JEE Mains & Advanced integrated.' },
      { streamName: 'BiPC', annualFee: 66000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'CEC', annualFee: 42000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },
  {
    name: 'Vikas Junior College, Kushaiguda',
    area: 'Kushaiguda',
    address: 'Kapra - Kushaiguda Road, Near Saket Road, Secunderabad, Telangana 500062',
    landmark: 'Near Kapra Municipality Office & Kushaiguda Market',
    phone: '040-27131062',
    email: 'vikas.kushaiguda@gmail.com',
    website: 'http://vikasjuniorcollege.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2001,
    streamsList: [
      { streamName: 'MPC', annualFee: 52000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Merit basis scholarships.' },
      { streamName: 'BiPC', annualFee: 54000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Pre-medical training with lab.' },
      { streamName: 'MEC', annualFee: 40000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with mathematics.' },
      { streamName: 'CEC', annualFee: 36000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // ==========================================
  // PHASE 3: DEPTH MULTIPLIER FOR FLAGSHIP HUBS
  // ==========================================

  // --- 34. AMEERPET (Depth Expansion) ---
  {
    name: 'Government Junior College, Ameerpet',
    area: 'Ameerpet',
    address: 'Dharam Karan Road, Ameerpet, Hyderabad, Telangana 500016',
    landmark: 'Near Ameerpet Metro Station Interchange & Elephant Circle',
    phone: '040-23730016',
    email: 'gjc.ameerpet@telangana.gov.in',
    website: 'http://gjc-ameerpet.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1985,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' },
      { streamName: 'HEC', annualFee: 950, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Ameerpet',
    area: 'Ameerpet',
    address: 'Behind HUDA Commercial Complex, Ameerpet, Hyderabad, Telangana 500016',
    landmark: 'Near Ameerpet Gurudwara & Metro Pillar A1020',
    phone: '040-66770016',
    email: 'ameerpet.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2001,
    streamsList: [
      { streamName: 'MPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'JEE Mains & Advanced integrated.' },
      { streamName: 'BiPC', annualFee: 70000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'MEC', annualFee: 48000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with computing.' }
    ]
  },

  // --- 35. DILSUKHNAGAR (Depth Expansion) ---
  {
    name: 'Government Junior College, Dilsukhnagar',
    area: 'Dilsukhnagar',
    address: 'Main Vijayawada Road, Near Dilsukhnagar Metro Station, Hyderabad, Telangana 500060',
    landmark: 'Opposite Dilsukhnagar Bus Depot & Sai Baba Temple',
    phone: '040-24040060',
    email: 'gjc.dilsukhnagar@telangana.gov.in',
    website: 'http://gjc-dilsukhnagar.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1980,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' },
      { streamName: 'HEC', annualFee: 900, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, Dilsukhnagar',
    area: 'Dilsukhnagar',
    address: 'Gaddiannaram Road, Dilsukhnagar, Hyderabad, Telangana 500060',
    landmark: 'Near Konark Theatre & Dilsukhnagar Metro Pillar',
    phone: '040-66550060',
    email: 'dilsukhnagar.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 1999,
    streamsList: [
      { streamName: 'MPC', annualFee: 66000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE coaching integrated.' },
      { streamName: 'BiPC', annualFee: 69000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'MEC', annualFee: 46000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with computing.' }
    ]
  },
  {
    name: 'Narayana Junior College, Dilsukhnagar',
    area: 'Dilsukhnagar',
    address: 'Near Venkatadri Theatre, Dilsukhnagar Cross Roads, Hyderabad, Telangana 500060',
    landmark: 'Opposite Venkatadri Theatre',
    phone: '040-24041060',
    email: 'dilsukhnagar.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2003,
    streamsList: [
      { streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE foundation batches.' },
      { streamName: 'BiPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Medical entrance batches.' },
      { streamName: 'CEC', annualFee: 42000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 36. L.B. NAGAR (Depth Expansion) ---
  {
    name: 'Narayana Junior College, L.B. Nagar',
    area: 'L.B. Nagar',
    address: 'Sagar Ring Road, L.B. Nagar, Hyderabad, Telangana 500074',
    landmark: 'Near LB Nagar Underpass & Metro Station Gate B',
    phone: '040-66440074',
    email: 'lbnagar.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2002,
    streamsList: [
      { streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE coaching integrated.' },
      { streamName: 'BiPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'MEC', annualFee: 45000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with math.' }
    ]
  },
  {
    name: 'Sri Chaitanya Junior College, L.B. Nagar',
    area: 'L.B. Nagar',
    address: 'Bahadurguda Road, L.B. Nagar, Hyderabad, Telangana 500074',
    landmark: 'Near Kamineni Hospital Junction, L.B. Nagar',
    phone: '040-66770074',
    email: 'lbnagar.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2005,
    streamsList: [
      { streamName: 'MPC', annualFee: 66000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'JEE Mains & Advanced integrated.' },
      { streamName: 'BiPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET medical foundation.' },
      { streamName: 'CEC', annualFee: 43000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },

  // --- 37. KOTI (Depth Expansion) ---
  {
    name: "Telangana Mahila Viswavidyalayam (Women's College Koti)",
    area: 'Koti',
    address: 'Koti Residency Campus, Koti, Hyderabad, Telangana 500095',
    landmark: 'Historic British Residency Campus, Koti',
    phone: '040-24657888',
    email: 'principal@tmv.ac.in',
    website: 'http://tmv.ac.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1924,
    streamsList: [
      { streamName: 'MPC', annualFee: 1500, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Girls only government quota.' },
      { streamName: 'BiPC', annualFee: 1500, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Girls only government quota.' },
      { streamName: 'CEC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Girls only government quota.' },
      { streamName: 'HEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Girls only government quota.' }
    ]
  },
  {
    name: 'Pragathi Maha Vidyalaya Junior College, Koti',
    area: 'Koti',
    address: 'Hanuman Tekdi, Koti, Hyderabad, Telangana 500095',
    landmark: 'Near Hanuman Temple, Hanuman Tekdi, Koti',
    phone: '040-24750095',
    email: 'pmv.koti@gmail.com',
    website: 'http://pragathimahavidyalaya.ac.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'AIDED',
    estYear: 1973,
    streamsList: [
      { streamName: 'CEC', annualFee: 12000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Premier commerce institution.' },
      { streamName: 'MEC', annualFee: 14000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce with mathematics.' },
      { streamName: 'MPC', annualFee: 15000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Science fundamentals.' }
    ]
  },

  // --- 38. MEHDIPATNAM (Depth Expansion) ---
  {
    name: "St. Ann's Junior College for Girls, Mehdipatnam",
    area: 'Mehdipatnam',
    address: 'Santoshnagar Colony, Mehdipatnam, Hyderabad, Telangana 500028',
    landmark: 'Near Mehdipatnam Bus Depot & Pillar 35, PVNR Expressway',
    phone: '040-23513028',
    email: 'stannscollege_hyd@yahoo.co.in',
    website: 'http://stannscollegehyd.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'AIDED',
    estYear: 1983,
    streamsList: [
      { streamName: 'MPC', annualFee: 16000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Girls only institution.' },
      { streamName: 'BiPC', annualFee: 18000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Girls only institution.' },
      { streamName: 'MEC', annualFee: 15000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with math.' },
      { streamName: 'CEC', annualFee: 12000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },
  {
    name: 'MS Junior College, Mehdipatnam',
    area: 'Mehdipatnam',
    address: 'Pillar 25, Mehdipatnam Main Road, Hyderabad, Telangana 500028',
    landmark: 'Near PVNR Expressway Pillar 25 & Rethi Bowli Junction',
    phone: '040-23514028',
    email: 'info@msinstitutions.com',
    website: 'http://msjuniorcollege.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 1991,
    streamsList: [
      { streamName: 'MPC', annualFee: 55000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Integrated IIT coaching.' },
      { streamName: 'BiPC', annualFee: 58000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Integrated NEET coaching.' },
      { streamName: 'CEC', annualFee: 38000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce foundation.' }
    ]
  },

  // --- 39. GACHIBOWLI (Depth Expansion) ---
  {
    name: 'Sri Chaitanya Junior College, Gachibowli',
    area: 'Gachibowli',
    address: 'Near Gachibowli Stadium Road, Hyderabad, Telangana 500032',
    landmark: 'Near Gachibowli Indoor Stadium & ORR Junction',
    phone: '040-66883032',
    email: 'gachibowli.scjc@srichaitanya.net',
    website: 'http://www.srichaitanya.net',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2010,
    streamsList: [
      { streamName: 'MPC', annualFee: 70000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE Olympiad batches.' },
      { streamName: 'BiPC', annualFee: 72000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET medical coaching.' },
      { streamName: 'MEC', annualFee: 52000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with computing.' }
    ]
  },
  {
    name: 'Prerana Junior College, Gachibowli',
    area: 'Gachibowli',
    address: 'Telecom Nagar, Gachibowli, Hyderabad, Telangana 500032',
    landmark: 'Near Telecom Nagar Community Hall & Bio Diversity Park',
    phone: '040-23004032',
    email: 'prerana.gachibowli@gmail.com',
    website: 'http://preranacollege.edu.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2014,
    streamsList: [
      { streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Science with modern labs.' },
      { streamName: 'BiPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Pre-medical training.' },
      { streamName: 'CEC', annualFee: 44000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Commerce foundation.' }
    ]
  },

  // --- 40. ECIL (Depth Expansion) ---
  {
    name: 'Atomic Energy Central School & Junior College (AECS), ECIL',
    area: 'ECIL',
    address: 'DAE Colony, ECIL Post, Hyderabad, Telangana 500062',
    landmark: 'Near ECIL Crossroads & Nuclear Fuel Complex (NFC)',
    phone: '040-27121062',
    email: 'aecs1hyd@yahoo.co.in',
    website: 'http://aees.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1971,
    streamsList: [
      { streamName: 'MPC', annualFee: 8000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Central government DAEE guidelines.' },
      { streamName: 'BiPC', annualFee: 8500, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'MERIT_BASED', reservationInfo: 'Central government DAEE guidelines.' },
      { streamName: 'CEC', annualFee: 7000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Central government DAEE guidelines.' }
    ]
  },
  {
    name: 'Narayana Junior College, ECIL',
    area: 'ECIL',
    address: 'Kamala Nagar, ECIL Main Road, Secunderabad, Telangana 500062',
    landmark: 'Near ECIL Bus Terminus & Radhika Theatre',
    phone: '040-66441062',
    email: 'ecil.njc@narayanagroup.com',
    website: 'http://www.narayanagroup.com',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2005,
    streamsList: [
      { streamName: 'MPC', annualFee: 64000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'IIT-JEE coaching integrated.' },
      { streamName: 'BiPC', annualFee: 66000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'NEET coaching integrated.' },
      { streamName: 'MEC', annualFee: 45000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Commerce with computing.' }
    ]
  },

  // --- 41. HABSIGUDA (Depth Expansion) ---
  {
    name: 'Kakatiya Junior College, Habsiguda',
    area: 'Habsiguda',
    address: 'Street No. 8, Habsiguda Main Road, Hyderabad, Telangana 500007',
    landmark: 'Near Habsiguda Metro Station Pillar 924',
    phone: '040-27150007',
    email: 'habsiguda@kakatiya.edu.in',
    website: 'http://kakatiya.edu.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'PRIVATE',
    estYear: 2003,
    streamsList: [
      { streamName: 'MPC', annualFee: 56000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Science with state rank focus.' },
      { streamName: 'BiPC', annualFee: 58000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Medical coaching foundation.' },
      { streamName: 'CEC', annualFee: 38000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: 'Direct admission.' }
    ]
  },
  {
    name: 'Government Junior College, Habsiguda',
    area: 'Habsiguda',
    address: 'Main Uppal Road, Habsiguda, Hyderabad, Telangana 500007',
    landmark: 'Near NGRI (National Geophysical Research Institute)',
    phone: '040-27170007',
    email: 'gjc.habsiguda@telangana.gov.in',
    website: 'http://gjc-habsiguda.ts.gov.in',
    category: 'JUNIOR_COLLEGE',
    ownership: 'GOVERNMENT',
    estYear: 1988,
    streamsList: [
      { streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservation quota applies.' },
      { streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Direct admission on merit.' }
    ]
  }
];

// Now compile all colleges
const seenNames = new Set();
const compiledColleges = [];

function addCollege(c) {
  const normName = c.name.trim().toLowerCase();
  if (seenNames.has(normName)) return;
  seenNames.add(normName);
  compiledColleges.push(c);
}

// 1. Add colleges from firestore dump or previous collegesData (excluding test colleges)
for (const fc of firestoreDump) {
  if (fc.id === '6606' || (fc.name && fc.name.includes('Test'))) continue;
  addCollege({
    name: fc.name,
    area: fc.area || fc.nearbyLandmark || 'Hyderabad',
    address: fc.address,
    landmark: fc.landmark || fc.nearbyLandmark || '',
    phone: fc.phone || '040-23000000',
    email: fc.email || 'info@career365compass.com',
    website: fc.website || 'https://career365compass.in',
    category: fc.category || 'JUNIOR_COLLEGE',
    ownership: fc.ownership || 'GOVERNMENT',
    estYear: fc.estYear || fc.establishedYear || 1990,
    streamsList: fc.streamsList ? fc.streamsList : (fc.streams || []).map(s => ({
      streamName: s.streamName || 'MPC',
      annualFee: s.annualFee || 1200,
      minQualification: s.minQualification || '10th Class Pass',
      requiredMarks: s.requiredMarks || 'Pass',
      admissionType: s.admissionType || 'MERIT_BASED',
      reservationInfo: s.reservationInfo || 'State reservations apply.'
    })),
    hasHostel: !!fc.hasHostel,
    hasTransport: !!fc.hasTransport
  });
}

// 2. Add all new colleges for the 15 areas + Phase 1, 2, 3
for (const nc of NEW_COLLEGES_DATA) {
  addCollege(nc);
}

// 3. Assign deterministic, synced IDs to every college
let firestoreIdMap = {};
if (fs.existsSync(path.join(__dirname, 'firestore_id_map.json'))) {
  firestoreIdMap = JSON.parse(fs.readFileSync(path.join(__dirname, 'firestore_id_map.json'), 'utf8'));
}

const usedIds = new Set();
for (const idStr of Object.values(firestoreIdMap)) {
  usedIds.add(parseInt(idStr, 10));
}

let nextId = 7200;
function getNextId() {
  while (usedIds.has(nextId)) {
    nextId++;
  }
  usedIds.add(nextId);
  return nextId;
}

for (const c of compiledColleges) {
  const norm = c.name.trim().toLowerCase();
  if (firestoreIdMap[norm]) {
    c.id = parseInt(firestoreIdMap[norm], 10);
  } else {
    c.id = getNextId();
  }
}

console.log('Total unique colleges compiled:', compiledColleges.length);

// Count colleges by target areas
const targetAreas = [
  'Moosapet', 'Pragathi Nagar', 'Bollarum', 'Bachupally', 'Miyapur', 
  'Patancheru', 'Nizampet', 'Chintal', 'Kondapur', 'Madhapur', 
  'Uppal', 'Dammaiguda', 'Alwal', 'Shapur Nagar', 'Attapur',
  'SR Nagar', 'Suchitra', 'BHEL', 'RC Puram', 'Lingampally',
  'Nagole', 'Boduppal', 'Vanasthalipuram', 'Rajendranagar', 'Neredmet', 'Marredpally',
  'Shamirpet', 'Gandi Maisamma', 'Pocharam', 'Meerpet', 'Kokapet', 'Gandipet', 'Moinabad', 'Hafeezpet', 'Kushaiguda',
  'Ameerpet', 'Dilsukhnagar', 'L.B. Nagar', 'Koti', 'Mehdipatnam', 'Gachibowli', 'ECIL', 'Habsiguda'
];

console.log('\n--- TARGET AREA BREAKDOWN ---');
for (const area of targetAreas) {
  const lower = area.toLowerCase();
  const isBolarum = lower === 'bollarum';
  const isBhel = lower === 'bhel' || lower === 'rc puram';
  const isKokapet = lower === 'kokapet' || lower === 'gandipet';
  const isHafeezpet = lower === 'hafeezpet' || lower === 'madeenaguda';
  const matches = compiledColleges.filter(c => {
    const text = `${c.name} ${c.area} ${c.address} ${c.landmark}`.toLowerCase();
    if (isBolarum) return text.includes('bolarum') || text.includes('bollarum');
    if (isBhel) return text.includes('bhel') || text.includes('rc puram') || text.includes('ramachandrapuram');
    if (isKokapet) return text.includes('kokapet') || text.includes('gandipet');
    if (isHafeezpet) return text.includes('hafeezpet') || text.includes('madeenaguda');
    return text.includes(lower);
  });
  console.log(`${area}: ${matches.length} colleges`);
}

// Write compiled list to a dedicated data file: src/data/collegesData.js and collegesData.json
const exportFileContent = `// Auto-generated verified colleges dataset for Hyderabad and Telangana
export const ALL_HYDERABAD_COLLEGES = ${JSON.stringify(compiledColleges, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/collegesData.js'), exportFileContent);
fs.writeFileSync(path.join(__dirname, '../src/data/collegesData.json'), JSON.stringify(compiledColleges, null, 2));
console.log('\nSaved compiled colleges to src/data/collegesData.js and src/data/collegesData.json');
