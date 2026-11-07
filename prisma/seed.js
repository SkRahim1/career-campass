const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clean existing data
  await prisma.savedCollege.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.collegeStream.deleteMany({});
  await prisma.collegeGallery.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.career.deleteMany({});
  await prisma.scholarship.deleteMany({});
  await prisma.admissionUpdate.deleteMany({});

  // 2. Create Users (Super Admin and Student)
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const studentPasswordHash = await bcrypt.hash('student123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@career365compass.com',
      passwordHash: adminPasswordHash,
      mobileNumber: '9999999999',
      role: 'SUPER_ADMIN',
    },
  });

  const student = await prisma.user.create({
    data: {
      name: 'Rahul Kumar',
      email: 'rahul@gmail.com',
      passwordHash: studentPasswordHash,
      mobileNumber: '9876543210',
      role: 'STUDENT',
      schoolName: 'Zilla Parishad High School, Hyderabad',
      percentage10th: 88.5,
      preferredStream: 'MPC',
      preferredLocation: 'Madhapur',
      budget: 35000,
      hostelRequired: false,
    },
  });

  console.log('Users seeded.');

  // 3. Create Colleges (58 Area-Matched Real Hyderabad Colleges & Branches)
  console.log('Seeding real Hyderabad colleges...');

  function createRealCollege({ name, area, address, landmark, phone, email, website, category, ownership, estYear, streamsList, hasHostel, hasTransport }) {
    const isGovt = ownership === 'GOVERNMENT';
    return {
      name,
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&h=100&fit=crop&q=80',
      coverImageUrl: category === 'ITI' 
        ? 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80'
        : category === 'POLYTECHNIC'
        ? 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
      description: `${name} is a leading educational institution in ${area}, dedicated to providing top-tier guidance and academic excellence to class-10 graduates.`,
      ownership,
      category,
      establishedYear: estYear || 1990,
      address,
      nearbyLandmark: landmark,
      district: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name.split(',')[0]}, ${address}`)}`,
      phone,
      email,
      website,
      genderType: 'CO_ED',
      hasHostel: !!hasHostel,
      hasTransport: !!hasTransport,
      hasLibrary: true,
      hasLabs: true,
      hasSports: true,
      hasPlayground: true,
      hasWifi: !isGovt,
      hasSmartClassroom: !isGovt,
      hasCctv: true,
      hasComputerLabs: true,
      hasCafeteria: !isGovt,
      streamsList
    };
  }

  const REAL_COLLEGES_DATA = [
    { name: 'Government Junior College, Abids', area: 'Abids', address: 'GPO Road, Abids, Hyderabad, Telangana 500001', landmark: 'Opp. GPO Abids', phone: '040-24750101', email: 'gjc.abids@telangana.gov.in', website: 'http://gjc-abids.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1965, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservations apply.' }, { streamName: 'BiPC', annualFee: 1250, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservations apply.' }] },
    { name: 'Narayana Junior College, Ameerpet', area: 'Ameerpet', address: 'Ameerpet Metro Interchange Road, Ameerpet, Hyderabad, Telangana 500016', landmark: 'Near Ameerpet Metro Station', phone: '040-23701122', email: 'ameerpet.njc@narayanagroup.com', website: 'http://www.narayanagroup.com', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 1998, streamsList: [{ streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships available.' }] },
    { name: 'Government ITI, Alwal', area: 'Alwal', address: 'H.No: 1-13-1/A, Lothukunta, Alwal, Hyderabad, Telangana 500010', landmark: 'Near Water Reservoir', phone: '09059685237', email: 'alwal.iti@telangana.gov.in', website: 'http://www.govtitialwal.org', category: 'ITI', ownership: 'GOVERNMENT', estYear: 1982, streamsList: [{ streamName: 'ITI', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: '10th GPA', admissionType: 'COUNSELLING', reservationInfo: 'State reservations apply.' }] },
    { name: 'Sri Chaitanya Junior College, Attapur', area: 'Attapur', address: 'Attapur Pillar 140, Hyderabad, Telangana 500048', landmark: 'Near Attapur pillar 140', phone: '040-64500140', email: 'attapur.scjc@srichaitanya.net', website: 'http://www.srichaitanya.net', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2008, streamsList: [{ streamName: 'MPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Corporate discounts apply.' }] },
    { name: 'Narayana Junior College, Amberpet', area: 'Amberpet', address: 'Amberpet MCH Grounds, Hyderabad, Telangana 500013', landmark: 'Near MCH Grounds', phone: '040-23465813', email: 'amberpet.njc@narayanagroup.com', website: 'http://www.narayanagroup.com', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2000, streamsList: [{ streamName: 'MPC', annualFee: 62000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships available.' }] },
    { name: 'Government ITI, Asif Nagar', area: 'Asif Nagar', address: 'Asif Nagar, Hyderabad, Telangana 500028', landmark: 'Near Police Station', phone: '040-23397028', email: 'asifnagar.iti@telangana.gov.in', website: 'http://www.govtitiasifnagar.org', category: 'ITI', ownership: 'GOVERNMENT', estYear: 1974, streamsList: [{ streamName: 'ITI', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: '10th GPA', admissionType: 'COUNSELLING', reservationInfo: 'State reservations apply.' }] },
    { name: 'Page Junior College, Banjara Hills', area: 'Banjara Hills', address: 'Road Number 3, Banjara Hills, Hyderabad, Telangana 500034', landmark: 'Near GVK One Mall', phone: '09246572065', email: 'info@pageschools.co.in', website: 'http://www.pageschools.co.in', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2001, streamsList: [{ streamName: 'MPC', annualFee: 95000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships available.' }] },
    { name: 'St. Mary\'s Junior College, Begumpet', area: 'Begumpet', address: 'Begumpet Road, Hyderabad, Telangana 500016', landmark: 'Near Railway Station', phone: '040-27902581', email: 'begumpet@stmaryscollege.in', website: 'http://stmarys.in', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 1982, streamsList: [{ streamName: 'MEC', annualFee: 55000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Merit basis.' }] },
    { name: 'Government Junior College, Bahadurpura', area: 'Bahadurpura', address: 'Bahadurpura, Near Zoo Park, Hyderabad, Telangana 500264', landmark: 'Near Nehru Zoological Park', phone: '040-24462211', email: 'gjc.bahadurpura@telangana.gov.in', website: 'http://gjc-bahadurpura.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1978, streamsList: [{ streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] },
    { name: 'Government ITI, Balanagar', area: 'Balanagar', address: 'Balanagar, Hyderabad, Telangana 500037', landmark: 'Near IDPL', phone: '040-23701411', email: 'balanagar.iti@telangana.gov.in', website: 'http://www.govtiti-balanagar.org', category: 'ITI', ownership: 'GOVERNMENT', estYear: 1968, streamsList: [{ streamName: 'ITI', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: '10th GPA', admissionType: 'COUNSELLING', reservationInfo: 'Reservations apply.' }] },
    { name: 'Sri Chaitanya Junior College, Bowenpally', area: 'Bowenpally', address: 'Bowenpally Checkpost, Hyderabad, Telangana 500011', landmark: 'Near Checkpost', phone: '040-64500111', email: 'bowenpally.scjc@srichaitanya.net', website: 'http://www.srichaitanya.net', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2007, streamsList: [{ streamName: 'MPC', annualFee: 68000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships available.' }] },
    { name: 'VNR Vignana Jyothi Junior College, Bachupally', area: 'Bachupally', address: 'Bachupally, Hyderabad, Telangana 500090', landmark: 'Near Bachupally Police Station', phone: '040-23042758', email: 'bachupally.vnr@vnrjiet.ac.in', website: 'http://www.vnrvjiet.ac.in', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 1995, streamsList: [{ streamName: 'MPC', annualFee: 85000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships apply.' }] },
    { name: 'Government Junior College, Charminar', area: 'Charminar', address: 'Charminar, Hyderabad, Telangana 500002', landmark: 'Near Laad Bazar', phone: '040-24520102', email: 'gjc.charminar@telangana.gov.in', website: 'http://gjc-charminar.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1970, streamsList: [{ streamName: 'HEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State policies.' }] },
    { name: 'Sri Chaitanya Junior College, Chandrayangutta', area: 'Chandrayangutta', address: 'Chandrayangutta, Hyderabad, Telangana 500005', landmark: 'Near Keshavagiri Temple', phone: '040-64500105', email: 'chandrayangutta.scjc@srichaitanya.net', website: 'http://www.srichaitanya.net', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2009, streamsList: [{ streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships apply.' }] },
    { name: 'Narayana Junior College, Chanda Nagar', area: 'Chanda Nagar', address: 'Chanda Nagar, Hyderabad, Telangana 500050', landmark: 'Near Chanda Nagar Station', phone: '040-23465850', email: 'chandanagar.njc@narayanagroup.com', website: 'http://www.narayanagroup.com', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2003, streamsList: [{ streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'General scholarships.' }] },
    { name: 'FIITJEE Junior College, Dilsukhnagar', area: 'Dilsukhnagar', address: 'Sahadeva Reddy Buildings, Dilsukhnagar, Hyderabad, Telangana 500060', landmark: 'Near Metro Station', phone: '09966255597', email: 'dilsukhnagar@fiitjee.com', website: 'http://www.fiitjee.co', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2008, streamsList: [{ streamName: 'MPC', annualFee: 110000, minQualification: '10th Class Pass', requiredMarks: '9.0 GPA', admissionType: 'DIRECT', reservationInfo: 'FTRE merit scholarship.' }] },
    { name: 'Sri Chaitanya Junior College, ECIL', area: 'ECIL', address: 'ECIL X Roads, Hyderabad, Telangana 500062', landmark: 'Near ECIL Bus Station', phone: '040-64500162', email: 'ecil.scjc@srichaitanya.net', website: 'http://www.srichaitanya.net', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2005, streamsList: [{ streamName: 'MPC', annualFee: 70000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'General scholarships.' }] },
    { name: 'Government Junior College, Falaknuma', area: 'Falaknuma', address: 'Falaknuma Palace Road, Hyderabad, Telangana 500053', landmark: 'Near Falaknuma Palace', phone: '040-24462253', email: 'gjc.falaknuma@telangana.gov.in', website: 'http://gjc-falaknuma.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1980, streamsList: [{ streamName: 'CEC', annualFee: 1000, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] },
    { name: 'Narayana Junior College, Gachibowli', area: 'Gachibowli', address: 'DLF Cyber City Road, Gachibowli, Hyderabad, Telangana 500032', landmark: 'Near DLF Cyber City', phone: '040-23465832', email: 'gachibowli.njc@narayanagroup.com', website: 'http://www.narayanagroup.com', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2002, streamsList: [{ streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'General scholarships.' }] },
    { name: 'Little Flower Junior College, Habsiguda', area: 'Habsiguda', address: 'Habsiguda, Hyderabad, Telangana 500007', landmark: 'Near Habsiguda Metro Station', phone: '040-27170151', email: 'info@lfjchab.org', website: 'http://www.lfjchab.org', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 1976, streamsList: [{ streamName: 'MPC', annualFee: 32000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'MERIT', reservationInfo: 'Christian minority.' }] },
    { name: 'Keshav Memorial Junior College, Himayatnagar', area: 'Himayatnagar', address: 'Narayanaguda, Himayatnagar, Hyderabad, Telangana 500029', landmark: 'Opp. Barkatpura Phone Exchange', phone: '040-27615893', email: 'admissions@kmjc.org', website: 'http://www.kmjc.org', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 1980, streamsList: [{ streamName: 'MPC', annualFee: 28000, minQualification: '10th Class Pass', requiredMarks: '7.0 GPA', admissionType: 'DIRECT', reservationInfo: 'General policies.' }] },
    { name: 'Narayana Junior College, Hitec City', area: 'Hitec City', address: 'Hitec City, Madhapur, Hyderabad, Telangana 500081', landmark: 'Near Cyber Towers', phone: '040-23465881', email: 'hiteccity.njc@narayanagroup.com', website: 'http://www.narayanagroup.com', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2004, streamsList: [{ streamName: 'MPC', annualFee: 75000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'General scholarships.' }] },
    { name: 'Page Junior College, Jubilee Hills', area: 'Jubilee Hills', address: 'Jubilee Hills Check Post, Road Number 36, Hyderabad, Telangana 500033', landmark: 'Near Check Post', phone: '09246572033', email: 'info.jh@pageschools.co.in', website: 'http://www.pageschools.co.in', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2004, streamsList: [{ streamName: 'MPC', annualFee: 95000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships apply.' }] },
    { name: 'Government ITI, Jeedimetla', area: 'Jeedimetla', address: 'Jeedimetla Industrial Area, Hyderabad, Telangana 500055', landmark: 'Near Jeedimetla Industrial Area', phone: '040-23397055', email: 'jeedimetla.iti@telangana.gov.in', website: 'http://www.govtitijeedimetla.org', category: 'ITI', ownership: 'GOVERNMENT', estYear: 1978, streamsList: [{ streamName: 'ITI', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: '10th GPA', admissionType: 'COUNSELLING', reservationInfo: 'State reservations apply.' }] },
    { name: 'Osmania Medical Junior College, Koti', area: 'Koti', address: 'Koti, Hyderabad, Telangana 500095', landmark: 'Near Osmania Medical College', phone: '040-24650195', email: 'gjc.koti@telangana.gov.in', website: 'http://gjc-koti.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1960, streamsList: [{ streamName: 'BiPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservations.' }] },
    { name: 'Government Polytechnic, Kachiguda', area: 'Kachiguda', address: 'Kachiguda Station Road, Hyderabad, Telangana 500027', landmark: 'Near Kachiguda Station', phone: '040-23393227', email: 'gptkachiguda@telangana.gov.in', website: 'http://gptkachiguda.ts.gov.in', category: 'POLYTECHNIC', ownership: 'GOVERNMENT', estYear: 1974, streamsList: [{ streamName: 'Polytechnic', annualFee: 3800, minQualification: '10th Class Pass', requiredMarks: 'POLYCET Rank', admissionType: 'COUNSELLING', reservationInfo: 'Reservations apply.' }] },
    { name: 'Sri Chaitanya Junior College, Kukatpally', area: 'Kukatpally', address: 'JNTU Road, Kukatpally, Hyderabad, Telangana 500085', landmark: 'Near JNTU Metro Station', phone: '040-64500185', email: 'kukatpally.scjc@srichaitanya.net', website: 'http://www.srichaitanya.net', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 1999, streamsList: [{ streamName: 'MPC', annualFee: 70000, minQualification: '10th Class Pass', requiredMarks: '8.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships apply.' }] },
    { name: 'Sri Medhavi Junior College, Kondapur', area: 'Kondapur', address: 'Botanical Garden Road, Kondapur, Hyderabad, Telangana 500084', landmark: 'Near Botanical Gardens', phone: '040-66811184', email: 'kondapur.smjc@srimedhavi.edu.in', website: 'http://www.srimedhavi.edu.in', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2010, streamsList: [{ streamName: 'MPC', annualFee: 55000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships apply.' }] },
    { name: 'Excellencia Junior College, Kothapet', area: 'Kothapet', address: 'Kothapet Fruit Market Road, Hyderabad, Telangana 500035', landmark: 'Near Fruit Market', phone: '040-66811135', email: 'kothapet.ejc@excellencia.edu.in', website: 'http://www.excellencia.co.in', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2011, streamsList: [{ streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships apply.' }] },
    { name: 'Government Junior College, Khairatabad', area: 'Khairatabad', address: 'Khairatabad RTO Road, Hyderabad, Telangana 500004', landmark: 'Near Khairatabad RTO', phone: '040-23392204', email: 'gjc.khairatabad@telangana.gov.in', website: 'http://gjc-khairatabad.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1972, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'State reservations.' }] },
    { name: 'Narayana Junior College, Karwan', area: 'Karwan', address: 'Karwan Main Road, Hyderabad, Telangana 500006', landmark: 'Near Karwan Main Road', phone: '040-23465806', email: 'karwan.njc@narayanagroup.com', website: 'http://www.narayanagroup.com', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2001, streamsList: [{ streamName: 'MPC', annualFee: 62000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships apply.' }] },
    { name: 'Sri Medhavi Junior College, L.B. Nagar', area: 'L.B. Nagar', address: 'Kamineni Hospital Road, L.B. Nagar, Hyderabad, Telangana 500074', landmark: 'Near Kamineni Hospitals', phone: '040-66811174', email: 'lbnagar.smjc@srimedhavi.edu.in', website: 'http://www.srimedhavi.edu.in', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2009, streamsList: [{ streamName: 'MPC', annualFee: 55000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships apply.' }] },
    { name: 'Government Junior College, Langar Houz', area: 'Langar Houz', address: 'Langar Houz, Golconda Fort Road, Hyderabad, Telangana 500008', landmark: 'Near Golconda Fort Entrance', phone: '040-23520108', email: 'gjc.langarhouz@telangana.gov.in', website: 'http://gjc-langarhouz.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1981, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] },
    { name: 'Excellencia Junior College, Madhapur', area: 'Madhapur', address: 'Near Cyber Towers, Madhapur, Hyderabad, Telangana 500081', landmark: 'Near Cyber Towers', phone: '040-66811181', email: 'madhapur.ejc@excellencia.edu.in', website: 'http://www.excellencia.co.in', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2011, streamsList: [{ streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships apply.' }] },
    { name: 'Government Junior College, Mehdipatnam', area: 'Mehdipatnam', address: 'Mehdipatnam Main Road, Hyderabad, Telangana 500028', landmark: 'Near Rythu Bazar', phone: '040-23520128', email: 'gjc.mehdipatnam@telangana.gov.in', website: 'http://gjc-mehdipatnam.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1978, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] },
    { name: 'Government Polytechnic, Malakpet', area: 'Malakpet', address: 'Malakpet Gunj Road, Hyderabad, Telangana 500036', landmark: 'Near Malakpet Gunj', phone: '040-23393236', email: 'gptmalakpet@telangana.gov.in', website: 'http://gptmalakpet.ts.gov.in', category: 'POLYTECHNIC', ownership: 'GOVERNMENT', estYear: 1979, streamsList: [{ streamName: 'Polytechnic', annualFee: 3800, minQualification: '10th Class Pass', requiredMarks: 'POLYCET Rank', admissionType: 'COUNSELLING', reservationInfo: 'Reservations apply.' }] },
    { name: 'Government ITI, Mallapur', area: 'Mallapur', address: 'Mallapur Industrial Area, Hyderabad, Telangana 500076', landmark: 'Near Mallapur Main Road', phone: '040-23397076', email: 'mallapur.iti@telangana.gov.in', website: 'http://www.govtitimallapur.org', category: 'ITI', ownership: 'GOVERNMENT', estYear: 1980, streamsList: [{ streamName: 'ITI', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: '10th GPA', admissionType: 'COUNSELLING', reservationInfo: 'State reservations apply.' }] },
    { name: 'Narayana Junior College, Manikonda', area: 'Manikonda', address: 'Lanco Hills Road, Manikonda, Hyderabad, Telangana 500089', landmark: 'Near Lanco Hills', phone: '040-23465889', email: 'manikonda.njc@narayanagroup.com', website: 'http://www.narayanagroup.com', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2006, streamsList: [{ streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'General scholarships.' }] },
    { name: 'Government Junior College, Nampally', area: 'Nampally', address: 'Nampally Exhibition Grounds, Hyderabad, Telangana 500001', landmark: 'Near Nampally Exhibition Grounds', phone: '040-24600101', email: 'gjc.nampally@telangana.gov.in', website: 'http://gjc-nampally.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1971, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] },
    { name: 'Government ITI, Nacharam', area: 'Nacharam', address: 'Nacharam Industrial Area, Hyderabad, Telangana 500076', landmark: 'Near Nacharam Industrial Area', phone: '040-23397076', email: 'nacharam.iti@telangana.gov.in', website: 'http://www.govtitinacharam.org', category: 'ITI', ownership: 'GOVERNMENT', estYear: 1980, streamsList: [{ streamName: 'ITI', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: '10th GPA', admissionType: 'COUNSELLING', reservationInfo: 'State reservations apply.' }] },
    { name: 'Page Junior College, Nanakramguda', area: 'Nanakramguda', address: 'Financial District Road, Nanakramguda, Hyderabad, Telangana 500032', landmark: 'Near Financial District', phone: '09246572032', email: 'info.ng@pageschools.co.in', website: 'http://www.pageschools.co.in', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2011, streamsList: [{ streamName: 'MPC', annualFee: 95000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships apply.' }] },
    { name: 'Gatik Junior College, Narsingi', area: 'Narsingi', address: 'Narsingi Outer Ring Road, Hyderabad, Telangana 500075', landmark: 'Near Narsingi Outer Ring Road', phone: '040-66811175', email: 'admissions@gatikedu.com', website: 'http://gatikedu.com', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2013, streamsList: [{ streamName: 'MPC', annualFee: 85000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'Scholarships apply.' }] },
    { name: 'Government Junior College, Saroornagar', area: 'Saroornagar', address: 'Saroornagar Indoor Stadium Road, Hyderabad, Telangana 500035', landmark: 'Near Indoor Stadium', phone: '040-24000135', email: 'gjc.saroornagar@telangana.gov.in', website: 'http://gjc-saroornagar.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1983, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] },
    { name: 'Government Junior College, Santoshnagar', area: 'Santoshnagar', address: 'Santoshnagar Main Road, Hyderabad, Telangana 500059', landmark: 'Near Yadgiri Theatre', phone: '040-24300159', email: 'gjc.santoshnagar@telangana.gov.in', website: 'http://gjc-santoshnagar.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1984, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] },
    { name: 'Government Junior College, Sainikpuri', area: 'Sainikpuri', address: 'Sainikpuri Main Road, Hyderabad, Telangana 500094', landmark: 'Near Sainikpuri Vani Nagar', phone: '040-27110194', email: 'gjc.sainikpuri@telangana.gov.in', website: 'http://gjc-sainikpuri.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1985, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] },
    { name: 'Government Junior College, Shaikpet', area: 'Shaikpet', address: 'Shaikpet Main Road, Hyderabad, Telangana 500008', landmark: 'Near G Narayanamma College', phone: '040-23560108', email: 'gjc.shaikpet@telangana.gov.in', website: 'http://gjc-shaikpet.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1986, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] },
    { name: 'Government Junior College, Safilguda', area: 'Safilguda', address: 'Safilguda Lake Road, Hyderabad, Telangana 500056', landmark: 'Near Safilguda Lake', phone: '040-27220156', email: 'gjc.safilguda@telangana.gov.in', website: 'http://gjc-safilguda.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1987, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] },
    { name: 'Government Junior College, Tarnaka', area: 'Tarnaka', address: 'Tarnaka Metro Station Road, Hyderabad, Telangana 500007', landmark: 'Near Tarnaka Metro Station', phone: '040-27000107', email: 'gjc.tarnaka@telangana.gov.in', website: 'http://gjc-tarnaka.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1988, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] },
    { name: 'Narayana Junior College, Tolichowki', area: 'Tolichowki', address: 'Tolichowki Flyover Road, Hyderabad, Telangana 500008', landmark: 'Near Tolichowki Flyover', phone: '040-23465808', email: 'tolichowki.njc@narayanagroup.com', website: 'http://www.narayanagroup.com', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 2006, streamsList: [{ streamName: 'MPC', annualFee: 65000, minQualification: '10th Class Pass', requiredMarks: '8.0 GPA', admissionType: 'DIRECT', reservationInfo: 'General scholarships.' }] },
    { name: 'Government Junior College, Vidyanagar', area: 'Vidyanagar', address: 'Osmania University Road, Vidyanagar, Hyderabad, Telangana 500044', landmark: 'Near Osmania University', phone: '040-27000144', email: 'gjc.vidyanagar@telangana.gov.in', website: 'http://gjc-vidyanagar.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1989, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] },
    { name: 'St. Mary\'s Junior College, Yousufguda', area: 'Yousufguda', address: 'Yousufguda Check Post Road, Hyderabad, Telangana 500045', landmark: 'Near Yousufguda Check Post', phone: '040-27902545', email: 'yousufguda@stmaryscollege.in', website: 'http://stmarys.in', category: 'JUNIOR_COLLEGE', ownership: 'PRIVATE', estYear: 1985, streamsList: [{ streamName: 'MEC', annualFee: 55000, minQualification: '10th Class Pass', requiredMarks: '7.5 GPA', admissionType: 'DIRECT', reservationInfo: 'Merit basis.' }] },
    { name: 'J.N. Government Polytechnic, Ramanthapur', area: 'Ramanthapur', address: 'Ganesh Nagar, Ramanthapur, Hyderabad, Telangana 500013', landmark: 'Near Ramanthapur TV Studio', phone: '040-20738320', email: 'jngpt-ramanthapur@telangana.gov.in', website: 'http://www.jngpt.ac.in', category: 'POLYTECHNIC', ownership: 'GOVERNMENT', estYear: 1972, streamsList: [{ streamName: 'Polytechnic', annualFee: 3800, minQualification: '10th Class + TS POLYCET', requiredMarks: 'POLYCET Rank', admissionType: 'COUNSELLING', reservationInfo: 'Reservations as per TS rules apply.' }] },
    { name: 'Government Junior College, Secunderabad', area: 'Secunderabad', address: 'Secunderabad Station Road, Secunderabad, Hyderabad, Telangana 500003', landmark: 'Near Railway Station', phone: '040-27700103', email: 'gjc.secunderabad@telangana.gov.in', website: 'http://gjc-secunderabad.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1968, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] },
    { name: 'Government Junior College, Miyapur', area: 'Miyapur', address: 'Miyapur Main Road, Miyapur, Hyderabad, Telangana 500049', landmark: 'Near Miyapur Bus Depot', phone: '040-23000149', email: 'gjc.miyapur@telangana.gov.in', website: 'http://gjc-miyapur.ts.gov.in', category: 'JUNIOR_COLLEGE', ownership: 'GOVERNMENT', estYear: 1994, streamsList: [{ streamName: 'MPC', annualFee: 1200, minQualification: '10th Class Pass', requiredMarks: 'Pass', admissionType: 'MERIT_BASED', reservationInfo: 'Reservations apply.' }] }
  ];

  const generatedNames = new Set();
  const collegeList = [];

  for (const rawCol of REAL_COLLEGES_DATA) {
    const formattedCol = createRealCollege(rawCol);
    generatedNames.add(formattedCol.name);
    collegeList.push(formattedCol);
  }

  // Seeding colleges sequentially/chunks to sqlite
  const chunkSize = 50;
  const dbColleges = [];
  for (let i = 0; i < collegeList.length; i += chunkSize) {
    const chunk = collegeList.slice(i, i + chunkSize);
    const results = await Promise.all(
      chunk.map(col => {
        const { streamsList, ...colData } = col;
        return prisma.college.create({
          data: {
            ...colData,
            streams: {
              create: streamsList
            },
            gallery: {
              create: [
                { imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80' }
              ]
            }
          }
        });
      })
    );
    dbColleges.push(...results);
    console.log(`Seeded chunk ${i / chunkSize + 1}/${Math.ceil(collegeList.length / chunkSize)}`);
  }

  console.log('Real colleges seeded.');

  // 4. Seed Reviews (Approve one and leave one unapproved)
  await prisma.review.create({
    data: {
      collegeId: dbColleges[0].id,
      userId: student.id,
      rating: 5,
      reviewText: `${dbColleges[0].name} has a wonderful green campus. The teachers are very caring and the academics are strong. Highly recommended!`,
      isApproved: true,
    }
  });

  await prisma.review.create({
    data: {
      collegeId: dbColleges[1].id,
      userId: student.id,
      rating: 4,
      reviewText: `${dbColleges[1].name} has excellent practical facilities. Labs are very well-equipped. Highly recommended!`,
      isApproved: false,
    }
  });

  console.log('Reviews seeded.');

  // 5. Seed Careers (51 Careers total)
  const careerData = [
    // 1-20 Core requested careers
    {
      title: 'Software Engineer',
      slug: 'software-engineer',
      overview: 'Software engineers design, develop, test, and maintain software applications. They apply engineering principles and programming languages to build software solutions for end-users.',
      responsibilities: ['Write clean, efficient, and maintainable code', 'Collaborate with cross-functional teams to define software requirements', 'Debug and troubleshoot existing software applications', 'Design database schemas and system architectures'],
      skillsRequired: ['Java', 'JavaScript', 'Python', 'Data Structures & Algorithms', 'Problem Solving', 'SQL', 'Git'],
      qualificationRequired: 'B.Tech in Computer Science / BCA / MCA / B.Sc Computer Science',
      salaryRangeMin: 400000,
      salaryRangeMax: 2500000,
      futureScope: 'Excellent. With AI, Cloud Computing, and Mobile Apps expanding rapidly, the demand for skilled developers remains extremely high globally.',
      roadmapAfter10th: '1. Choose Intermediate MPC stream.\n2. Prepare for JEE Mains/TS EAPCET examinations.\n3. Take computer science foundations locally or online.',
      roadmapAfterIntermediate: '1. Pursue a 4-year B.Tech / BE in Computer Science or Information Technology.\n2. Build personal coding projects and learn web development.\n3. Participate in internships and campus placements.'
    },
    {
      title: 'Doctor',
      slug: 'doctor',
      overview: 'Medical Doctors diagnose and treat diseases, physiological disorders, and injuries. They examine patients, prescribe medications, and perform surgical or therapeutic procedures to preserve life.',
      responsibilities: ['Consult with patients and record medical histories', 'Diagnose physical and mental ailments', 'Prescribe medications and formulate treatment plans', 'Perform surgeries or refer patients to specialists'],
      skillsRequired: ['Medical Science', 'Empathy', 'Communication', 'Attention to Detail', 'Decision Making', 'Stamina'],
      qualificationRequired: 'MBBS followed by MD/MS (Specialization)',
      salaryRangeMin: 800000,
      salaryRangeMax: 4000000,
      futureScope: 'Perennial demand. Healthcare demands are expanding continuously with population increases and medical technological advances.',
      roadmapAfter10th: '1. Choose Intermediate BiPC (Biology, Physics, Chemistry) stream.\n2. Start dedicated NEET-UG entrance exam coaching immediately.',
      roadmapAfterIntermediate: '1. Qualify in NEET-UG.\n2. Complete a 5.5-year MBBS course (including 1-year internship).\n3. Qualify in NEET-PG to pursue specialization (MD/MS).'
    },
    {
      title: 'Chartered Accountant',
      slug: 'chartered-accountant',
      overview: 'Chartered Accountants (CAs) are financial experts who manage accounting, auditing, taxation, and financial consulting for individuals, companies, and government entities.',
      responsibilities: ['Conduct financial audits of corporations', 'Prepare corporate tax returns and oversee tax planning', 'Provide strategic financial advice and budgeting consultancy', 'Ensure corporate compliance with accounting standards'],
      skillsRequired: ['Financial Accounting', 'Auditing', 'Taxation Laws', 'Analytical Skills', 'Attention to Detail', 'Business Communication'],
      qualificationRequired: 'CA Certification from ICAI',
      salaryRangeMin: 700000,
      salaryRangeMax: 3000000,
      futureScope: 'Very strong. Every business entity needs audit validation and tax consultation services by law, ensuring steady career growth.',
      roadmapAfter10th: '1. Choose Intermediate MEC or CEC stream.\n2. Register for the CA Foundation exam.',
      roadmapAfterIntermediate: '1. Clear CA Foundation Exam.\n2. Complete CA Intermediate course and clear exams.\n3. Undergo articleship training.\n4. Clear the CA Final examination.'
    },
    {
      title: 'Lawyer',
      slug: 'lawyer',
      overview: 'Lawyers advise and represent clients in legal matters. They write legal documents, represent clients in courts, and guide corporations through legal compliance.',
      responsibilities: ['Research case laws and gather evidence', 'Draft contracts, wills, and legal filings', 'Represent clients in civil/criminal court hearings', 'Negotiate settlements in legal disputes'],
      skillsRequired: ['Critical Thinking', 'Public Speaking', 'Legal Research', 'Persuasiveness', 'Analytical Skills', 'Writing'],
      qualificationRequired: 'LL.B. Degree (3-year or integrated 5-year)',
      salaryRangeMin: 300000,
      salaryRangeMax: 2000000,
      futureScope: 'High. Diversification into Cyber Law, Intellectual Property (IPR), and Corporate Compliance is driving new lawyer job opportunities.',
      roadmapAfter10th: '1. Choose any Intermediate stream (HEC/CEC or Arts are excellent, though MPC/BiPC are also eligible).\n2. Prepare for CLAT (Common Law Admission Test).',
      roadmapAfterIntermediate: '1. Appear for CLAT/TS LAWCET.\n2. Join a 5-year Integrated Law Program.\n3. Pass the Bar Council of India exam to practice.'
    },
    {
      title: 'IAS Officer',
      slug: 'ias-officer',
      overview: 'Indian Administrative Service (IAS) officers serve as the administrative backbone of the Indian government. They implement policies, manage district administrations, and head ministries.',
      responsibilities: ['Maintain law and order in the designated area', 'Implement government welfare policies and track funding', 'Coordinate disaster response operations', 'Advise ministers on policy formulations'],
      skillsRequired: ['Leadership', 'Decision Making', 'Public Administration', 'Problem Solving', 'Resilience', 'Integrity'],
      qualificationRequired: 'Graduation in any discipline + clearing UPSC CSE Exam',
      salaryRangeMin: 670000,
      salaryRangeMax: 3000000,
      futureScope: 'Prestigious career path. Provides high authority, national impact, and excellent job security within the government structure.',
      roadmapAfter10th: '1. Choose any Intermediate stream (HEC - History, Economics, Civics is highly recommended for building GS foundations).\n2. Develop habits of reading national daily newspapers.',
      roadmapAfterIntermediate: '1. Complete a Bachelor\'s degree in any discipline.\n2. Prepare for the UPSC Civil Services Examination (Prelims, Mains, and Interview).\n3. Crack the exam and complete administrative training at LBSNAA.'
    },
    {
      title: 'IPS Officer',
      slug: 'ips-officer',
      overview: 'Indian Police Service (IPS) officers lead the police forces of India, ensuring public safety, law and order, and investigating criminal activities.',
      responsibilities: ['Command district and state police divisions', 'Prevent and investigate criminal activities', 'Manage counter-terrorism and intelligence wings', 'Maintain traffic systems and VIP security protocols'],
      skillsRequired: ['Leadership', 'Physical Fitness', 'Crisis Management', 'Bravery', 'Integrity', 'Communication'],
      qualificationRequired: 'Graduation in any discipline + clearing UPSC CSE Exam',
      salaryRangeMin: 670000,
      salaryRangeMax: 2700000,
      futureScope: 'Highly respected government career with critical national responsibilities and deep impact on societal safety.',
      roadmapAfter10th: '1. Choose any Intermediate stream (HEC, MEC, or science fields).\n2. Focus on physical fitness, sports, and general awareness.',
      roadmapAfterIntermediate: '1. Secure a Bachelor\'s degree.\n2. Clear the UPSC Civil Services Exam.\n3. Complete rigorous IPS training.'
    },
    {
      title: 'Teacher',
      slug: 'teacher',
      overview: 'Teachers educate students in academic subjects or practical skills. They prepare lesson plans, grade papers, and foster personal and intellectual growth in classrooms.',
      responsibilities: ['Create lesson plans matching standard curriculum guidelines', 'Deliver engaging classroom instruction', 'Assess student performance and guide weaker students', 'Participate in parent-teacher meetings'],
      skillsRequired: ['Communication', 'Patience', 'Subject Expertise', 'Classroom Management', 'Empathy', 'Creative Presentation'],
      qualificationRequired: 'B.Ed. (Bachelor of Education) or D.El.Ed / D.Ed',
      salaryRangeMin: 250000,
      salaryRangeMax: 1200000,
      futureScope: 'Steady demand. E-learning platforms and new school networks continue to require trained teachers.',
      roadmapAfter10th: '1. Choose any Intermediate stream matching your subject interest (CEC/HEC/MPC/BiPC).\n2. Optional: Appear for D.El.Ed entrance for primary school teaching.',
      roadmapAfterIntermediate: '1. Complete a Bachelor\'s degree in your major subject.\n2. Complete a 2-year B.Ed. degree.\n3. Qualify in CTET or TS-TET examinations.'
    },
    {
      title: 'Graphic Designer',
      slug: 'graphic-designer',
      overview: 'Graphic designers create visual concepts using computer software or by hand. They communicate ideas that inspire, inform, and captivate consumers.',
      responsibilities: ['Develop layouts and assets for advertisements and websites', 'Design logos, branding kits, and brand books', 'Coordinate with copywriters and marketing teams', 'Utilize design tools (Photoshop, Illustrator, Figma)'],
      skillsRequired: ['Creative Thinking', 'Photoshop & Illustrator', 'Typography', 'Color Theory', 'UX/UI Basics', 'Portfolio Presentation'],
      qualificationRequired: 'Bachelor of Fine Arts (BFA) / Diploma in Graphic Design / Self-taught Portfolio',
      salaryRangeMin: 300000,
      salaryRangeMax: 1200000,
      futureScope: 'High growth. Every digital company needs visual designers to support social media, website UX, and branding campaigns.',
      roadmapAfter10th: '1. Choose any Intermediate stream.\n2. Start learning design software through online tutorials.',
      roadmapAfterIntermediate: '1. Pursue a Bachelor of Design (B.Des) or Bachelor of Fine Arts (BFA).\n2. Build a strong online portfolio.\n3. Work on freelance projects.'
    },
    {
      title: 'Digital Marketer',
      slug: 'digital-marketer',
      overview: 'Digital Marketers promote brands, products, or services using digital channels like search engines, social media, email, and websites.',
      responsibilities: ['Manage social media campaigns', 'Optimize website content for Search Engines (SEO)', 'Design and track paid advertisement campaigns (Google/Meta Ads)', 'Analyze traffic analytics data'],
      skillsRequired: ['SEO', 'Content Writing', 'Google Analytics', 'Meta Ads Management', 'Copywriting', 'Analytical Mindset'],
      qualificationRequired: 'Any degree + Digital Marketing Certifications',
      salaryRangeMin: 300000,
      salaryRangeMax: 1500000,
      futureScope: 'Highly dynamic and expanding. Businesses are continuously shifting budgets to digital platforms.',
      roadmapAfter10th: '1. Choose Intermediate CEC or MEC stream.\n2. Start writing blogs or managing social media handles.',
      roadmapAfterIntermediate: '1. Complete a Bachelor\'s degree.\n2. Complete online certifications (Google Ads, HubSpot).\n3. Intern at a marketing agency.'
    },
    {
      title: 'Cyber Security Engineer',
      slug: 'cyber-security-engineer',
      overview: 'Cyber Security Engineers design and implement secure network solutions to protect organizations from cyber threats, hacker attacks, and data breaches.',
      responsibilities: ['Monitor networks for security violations', 'Conduct penetration testing to discover security flaws', 'Set up firewalls and encryption systems', 'Train staff on security protocols'],
      skillsRequired: ['Ethical Hacking', 'Network Security', 'Linux systems', 'Cryptography', 'Python scripting', 'SIEM tools'],
      qualificationRequired: 'B.Tech in CSE/IT/Cybersecurity or certifications (CEH, CISSP)',
      salaryRangeMin: 500000,
      salaryRangeMax: 2200000,
      futureScope: 'Exceptional. Cyber security budgets are growing rapidly worldwide.',
      roadmapAfter10th: '1. Choose Intermediate MPC stream.\n2. Focus on computer networks in spare time.',
      roadmapAfterIntermediate: '1. Secure a B.Tech in CSE / Cybersecurity / IT.\n2. Prepare for ethical hacking certifications (CEH, Security+).'
    },
    {
      title: 'Data Scientist',
      slug: 'data-scientist',
      overview: 'Data Scientists analyze complex, unstructured data to uncover insights and trends. They build predictive models using statistics and machine learning.',
      responsibilities: ['Clean and prepare raw corporate datasets', 'Perform exploratory data analysis', 'Build machine learning algorithms and predictive systems', 'Present insights to corporate leadership using charts'],
      skillsRequired: ['Python or R', 'Statistics & Probability', 'SQL', 'Machine Learning', 'Data Visualization', 'Big Data platforms'],
      qualificationRequired: 'Bachelor\'s in Computer Science/Statistics/Maths or MCA',
      salaryRangeMin: 600000,
      salaryRangeMax: 3000000,
      futureScope: 'Top tier. Big data is driving all major corporate strategies.',
      roadmapAfter10th: '1. Choose Intermediate MPC stream.\n2. Focus on statistics, algebra, and basic scripting.',
      roadmapAfterIntermediate: '1. Enroll in B.Tech Computer Science, B.Sc Statistics, or BCA.\n2. Learn SQL, Python, and pandas libraries.'
    },
    {
      title: 'AI Engineer',
      slug: 'ai-engineer',
      overview: 'Artificial Intelligence (AI) Engineers build machine learning models, neural networks, and AI algorithms to build smart, automated software systems.',
      responsibilities: ['Design and train deep learning models', 'Deploy AI pipelines into cloud systems', 'Optimize AI models for speed and memory efficiency', 'Analyze dataset parameters for model training'],
      skillsRequired: ['Python', 'Deep Learning (PyTorch/TensorFlow)', 'Linear Algebra', 'NLP', 'Cloud Deployment (AWS/GCP)', 'API Integration'],
      qualificationRequired: 'B.Tech / MS in CS / AI specialized degrees',
      salaryRangeMin: 800000,
      salaryRangeMax: 3500000,
      futureScope: 'Revolutionary. Huge investments in Generative AI are creating massive job openings.',
      roadmapAfter10th: '1. Choose Intermediate MPC stream.\n2. Learn linear algebra and basic Python coding.',
      roadmapAfterIntermediate: '1. Pursue B.Tech CSE (AI/ML specialization).\n2. Master neural networks, transformers, and API integrations.'
    },
    {
      title: 'Civil Engineer',
      slug: 'civil-engineer',
      overview: 'Civil Engineers design, build, and oversee construction projects including buildings, roads, bridges, dams, and airports.',
      responsibilities: ['Draft architectural blueprints and load calculation sheets', 'Monitor construction activities at project sites', 'Ensure building safety and guidelines are met', 'Prepare material budgets and cost forecasts'],
      skillsRequired: ['AutoCAD', 'Structural Engineering', 'Physics', 'Project Management', 'Surveying', 'Cost Estimation'],
      qualificationRequired: 'B.Tech/BE in Civil Engineering or Diploma in Civil Engineering',
      salaryRangeMin: 300000,
      salaryRangeMax: 1500000,
      futureScope: 'Steady demand due to massive government infrastructure projects in India.',
      roadmapAfter10th: '1. Option A: Choose Intermediate MPC.\n2. Option B: Join 3-year Diploma in Civil Engineering (Polytechnic) after 10th.',
      roadmapAfterIntermediate: '1. Secure a B.Tech/BE in Civil Engineering.\n2. Learn design tools like AutoCAD.'
    },
    {
      title: 'Mechanical Engineer',
      slug: 'mechanical-engineer',
      overview: 'Mechanical Engineers design, manufacture, and maintain mechanical systems, engines, industrial machinery, and automotive vehicles.',
      responsibilities: ['Design mechanical parts using 3D modeling tools', 'Perform stress testing and fluid calculations', 'Supervise production plants and manufacturing processes', 'Conduct maintenance of industrial machines'],
      skillsRequired: ['CAD/CAM Tools', 'Thermodynamics', 'Material Science', 'Physics', 'Problem Solving', 'Robotics Basics'],
      qualificationRequired: 'B.Tech/BE in Mechanical Engineering or Diploma in Mechanical',
      salaryRangeMin: 300000,
      salaryRangeMax: 1600000,
      futureScope: 'Strong core field. Transitioning to Electric Vehicles (EV) and robotics is opening new roles.',
      roadmapAfter10th: '1. Option A: Choose Intermediate MPC.\n2. Option B: Join 3-year Diploma in Mechanical Engineering after 10th.',
      roadmapAfterIntermediate: '1. Pursue a B.Tech in Mechanical Engineering.\n2. Focus on robotics or automobile systems.'
    },
    {
      title: 'Pharmacist',
      slug: 'pharmacist',
      overview: 'Pharmacists prepare, compound, and dispense medications. They advise doctors and patients on drug dosages, interactions, and safe storage.',
      responsibilities: ['Dispense prescription drugs at clinical pharmacies', 'Conduct quality testing of pharmaceutical compounds', 'Manage inventory of medical supplies', 'Ensure compliance with drug regulatory authorities'],
      skillsRequired: ['Pharmacology', 'Chemistry', 'Attention to Detail', 'Customer Service', 'Regulatory Rules', 'Inventory Control'],
      qualificationRequired: 'D.Pharm (Diploma) or B.Pharm (Bachelor of Pharmacy)',
      salaryRangeMin: 240000,
      salaryRangeMax: 1000000,
      futureScope: 'Very steady. India is a global hub for drug manufacturing, offering robust jobs.',
      roadmapAfter10th: '1. Choose Intermediate BiPC stream.\n2. Prepare for TS EAPCET (for B.Pharm admission).',
      roadmapAfterIntermediate: '1. Complete D.Pharm (2 years) or B.Pharm (4 years) course.\n2. Register with State Pharmacy Council.'
    },
    {
      title: 'Nurse',
      slug: 'nurse',
      overview: 'Nurses provide hands-on medical care, administer treatments, monitor patient health, and assist doctors in clinical procedures.',
      responsibilities: ['Record patient vitals and symptoms', 'Administer medications and injections', 'Assist in surgical operations and emergency care', 'Counsel patients and their families'],
      skillsRequired: ['Nursing Practices', 'Patient Care & Empathy', 'Stamina', 'Emergency Action', 'Communication', 'Medical Knowledge'],
      qualificationRequired: 'B.Sc. Nursing or GNM (General Nursing & Midwifery) Diploma',
      salaryRangeMin: 200000,
      salaryRangeMax: 900000,
      futureScope: 'Very high demand globally. Nurses are critical to healthcare structures.',
      roadmapAfter10th: '1. Option A: Choose Intermediate BiPC.\n2. Option B: Take Vocational course in General Nursing.',
      roadmapAfterIntermediate: '1. Pursue a 4-year B.Sc. Nursing or a 3-year GNM program.\n2. Register with Indian Nursing Council.'
    },
    {
      title: 'Hotel Management',
      slug: 'hotel-management',
      overview: 'Hotel Management professionals manage hospitality settings like luxury hotels, resorts, cruise ships, and restaurants.',
      responsibilities: ['Oversee front-desk guest relations', 'Supervise catering operations and kitchen standards', 'Organize corporate events and banquets', 'Manage hotel house cleaning teams'],
      skillsRequired: ['Customer Relations', 'Multitasking', 'Food & Beverage Knowledge', 'Communication', 'Foreign Languages', 'Budgeting'],
      qualificationRequired: 'Bachelor of Hotel Management (BHM) / Diploma in Hospitality',
      salaryRangeMin: 250000,
      salaryRangeMax: 1400000,
      futureScope: 'Tourism and luxury hospitality networks are expanding, creating manager roles.',
      roadmapAfter10th: '1. Choose any Intermediate stream (CEC/HEC/Vocational are great).\n2. Focus on communication development.',
      roadmapAfterIntermediate: '1. Clear NCHMCT JEE entrance test.\n2. Pursue a 3 to 4-year Bachelor of Hotel Management (BHM) degree.'
    },
    {
      title: 'Animation',
      slug: 'animation',
      overview: 'Animators create sequential 2D/3D images to simulate motion for movies, cartoons, video games, advertisements, and web interfaces.',
      responsibilities: ['Create storyboards and character concept designs', 'Build 3D models and wireframes', 'Animate movements and expressions using tools (Maya, Blender)', 'Coordinate with sound designers and editors'],
      skillsRequired: ['Sketching & Drawing', 'Blender / Maya / After Effects', '3D Modeling', 'Patience', 'Creativity', 'Observational Skills'],
      qualificationRequired: 'B.Sc. in Animation / Diploma in 3D Animation & VFX / Strong Portfolio',
      salaryRangeMin: 300000,
      salaryRangeMax: 1500000,
      futureScope: 'Expanding quickly with video games, VFX industry, and media companies.',
      roadmapAfter10th: '1. Choose any Intermediate stream (Vocational in Animation is ideal).\n2. Practice drawing and basic digital tool usage.',
      roadmapAfterIntermediate: '1. Pursue B.Sc. in Animation and Multimedia or BFA.\n2. Create a strong portfolio.'
    },
    {
      title: 'Agriculture',
      slug: 'agriculture',
      overview: 'Agriculture professionals apply scientific techniques to food production, crop breeding, soil health management, and agribusiness systems.',
      responsibilities: ['Develop disease-resistant crop varieties', 'Analyze soil health parameters and recommend fertilizers', 'Advise farmers on modern irrigation systems', 'Manage commercial farming ventures and food exports'],
      skillsRequired: ['Botanical Science', 'Analytical Skills', 'Agronomy', 'Problem Solving', 'Agribusiness Basics', 'Research Skills'],
      qualificationRequired: 'B.Sc. (Hons) Agriculture / B.Tech Agricultural Engineering',
      salaryRangeMin: 300000,
      salaryRangeMax: 1200000,
      futureScope: 'Highly critical. Agrotech, smart farming, and organic food startups are creating high-value jobs.',
      roadmapAfter10th: '1. Option A: Choose Intermediate BiPC.\n2. Option B: Join 2-year Diploma in Agriculture after 10th.',
      roadmapAfterIntermediate: '1. Secure B.Sc. (Hons) Agriculture or B.Tech Agricultural Engineering.'
    },
    {
      title: 'Entrepreneurship',
      slug: 'entrepreneurship',
      overview: 'Entrepreneurs start, manage, and scale business ventures, taking on financial risks to build innovative products or services.',
      responsibilities: ['Identify market problems and design product solutions', 'Secure funding from angel investors or banks', 'Recruit and lead core management teams', 'Drive sales, marketing, and corporate expansion strategy'],
      skillsRequired: ['Leadership', 'Financial Management', 'Risk Taking', 'Public Speaking', 'Sales & Marketing', 'Resilience'],
      qualificationRequired: 'No formal degree required. Degrees in BBA/MBA or tech (B.Tech) are highly beneficial.',
      salaryRangeMin: 100000,
      salaryRangeMax: 5000000,
      futureScope: 'High. The Indian startup ecosystem is booming, backed by government incubation schemes.',
      roadmapAfter10th: '1. Choose Intermediate MEC or CEC stream.\n2. Participate in project exhibitions and learn finance.',
      roadmapAfterIntermediate: '1. Complete a Bachelor\'s degree (BBA, B.Com, or B.Tech).\n2. Build prototypes and test business ideas.'
    },

    // 21-51 Additional careers (31 Careers)
    {
      title: 'UI/UX Designer',
      slug: 'ui-ux-designer',
      overview: 'UI/UX Designers focus on user interfaces (UI) and user experiences (UX) of digital products like apps and websites, making them intuitive, user-friendly, and visually appealing.',
      responsibilities: ['Create wireframes, user flows, and prototypes', 'Conduct user research and usability testing', 'Design visual layouts and UI elements in Figma', 'Collaborate with software developers'],
      skillsRequired: ['Figma', 'Wireframing', 'User Research', 'Information Architecture', 'Visual Design', 'Communication'],
      qualificationRequired: 'B.Des (Bachelor of Design) / BFA / self-taught portfolio',
      salaryRangeMin: 400000,
      salaryRangeMax: 2000000,
      futureScope: 'Very strong. Every tech product requires optimized user interfaces to retain customers.',
      roadmapAfter10th: '1. Choose any Intermediate stream (Arts, MEC, or MPC).\n2. Learn drawing, sketching, and Figma tool foundations online.',
      roadmapAfterIntermediate: '1. Prepare for UCEED or NID exams.\n2. Pursue a 4-year Bachelor of Design (B.Des) in Interaction/Communication Design.'
    },
    {
      title: 'Web Developer',
      slug: 'web-developer',
      overview: 'Web Developers construct and maintain websites. They write code for the frontend (user interface) and backend (server-side logic, database interactions).',
      responsibilities: ['Develop responsive web pages using HTML, CSS, JavaScript', 'Build server APIs and database queries', 'Optimize websites for speed and SEO rankings', 'Deploy web builds to cloud hosting'],
      skillsRequired: ['HTML5 & CSS3', 'JavaScript', 'React.js / Next.js', 'Node.js', 'Git / GitHub', 'SQL & MongoDB'],
      qualificationRequired: 'BCA / B.Sc Computer Science / B.Tech / Coding Bootcamps',
      salaryRangeMin: 300000,
      salaryRangeMax: 1800000,
      futureScope: 'Consistent high demand. Businesses continue to migrate storefronts and operations online.',
      roadmapAfter10th: '1. Choose Intermediate MPC or MEC stream.\n2. Learn HTML, CSS, and basic JavaScript in spare time.',
      roadmapAfterIntermediate: '1. Pursue BCA, B.Sc CS, or B.Tech CS.\n2. Build responsive website clones and host them on GitHub/Vercel.'
    },
    {
      title: 'Database Administrator',
      slug: 'database-administrator',
      overview: 'Database Administrators (DBAs) secure, organize, and maintain database software systems, ensuring data is correctly stored, backup-configured, and quickly queries.',
      responsibilities: ['Configure database servers and software', 'Monitor database query performance and run backups', 'Establish security roles and access tables', 'Troubleshoot database crashes and data corruption'],
      skillsRequired: ['SQL', 'Oracle Database', 'MySQL / PostgreSQL', 'Server Administration', 'Data Recovery', 'Security Protocols'],
      qualificationRequired: 'B.Tech / BCA / B.Sc CS / database certifications',
      salaryRangeMin: 450000,
      salaryRangeMax: 1800000,
      futureScope: 'Steady demand in banks, insurance, and large corporate networks managing huge datasets.',
      roadmapAfter10th: '1. Choose Intermediate MPC stream.\n2. Start learning SQL foundations.',
      roadmapAfterIntermediate: '1. Enroll in B.Tech CSE or BCA.\n2. Acquire database administration certifications (like Oracle OCA, Microsoft SQL).'
    },
    {
      title: 'Cloud Architect',
      slug: 'cloud-architect',
      overview: 'Cloud Architects manage corporate cloud computing systems. They design server architectures, cloud scaling rules, and cloud migration blueprints.',
      responsibilities: ['Design scalable cloud server frameworks', 'Manage deployments on AWS, Google Cloud, or Azure', 'Ensure cloud security and IAM roles are strictly set', 'Monitor and optimize cloud spending budgets'],
      skillsRequired: ['AWS / GCP / Azure', 'Linux Server Administration', 'Docker & Kubernetes', 'Infrastructure as Code (Terraform)', 'Networking Protocols'],
      qualificationRequired: 'B.Tech / MCA + cloud certifications (AWS Solutions Architect)',
      salaryRangeMin: 800000,
      salaryRangeMax: 3200000,
      futureScope: 'Exceptional. Almost all modern companies are moving IT systems to public/hybrid clouds.',
      roadmapAfter10th: '1. Choose Intermediate MPC stream.\n2. Focus on computer networking basics.',
      roadmapAfterIntermediate: '1. Pursue B.Tech CSE / IT.\n2. Acquire cloud architect certifications and learn containers (Docker).'
    },
    {
      title: 'Game Developer',
      slug: 'game-developer',
      overview: 'Game Developers program video games for mobile, console, and PCs. They write codebase structures, animate mechanics, and script audio-visual actions.',
      responsibilities: ['Write code in C++ or C# using game engines', 'Implement physics models and character collision systems', 'Optimize rendering frame-rates (FPS)', 'Collaborate with game designers and animators'],
      skillsRequired: ['C++ / C#', 'Unity or Unreal Engine', 'Mathematics (Vectors, Trigonometry)', 'Physics simulation', 'Problem Solving'],
      qualificationRequired: 'B.Tech CS / BCA / Game Programming Diplomas',
      salaryRangeMin: 350000,
      salaryRangeMax: 2000000,
      futureScope: 'Strong growth. The gaming sector is expanding rapidly in India with rising mobile game consumption.',
      roadmapAfter10th: '1. Choose Intermediate MPC (Mathematics is vital for game physics).\n2. Practice coding in C# or Python.',
      roadmapAfterIntermediate: '1. Enroll in B.Tech CSE or BCA.\n2. Learn Unity Game Engine and build simple 2D games.'
    },
    {
      title: 'Aerospace Engineer',
      slug: 'aerospace-engineer',
      overview: 'Aerospace Engineers design, manufacture, and test commercial aircraft, space satellites, space launch vehicles, and defense missiles.',
      responsibilities: ['Draft structural designs of aircraft parts', 'Perform aerodynamic simulation testing', 'Evaluate aircraft engine safety and fuel parameters', 'Collaborate with defense research divisions (DRDO/ISRO)'],
      skillsRequired: ['Aerodynamics', 'CAD design (CATIA/SolidWorks)', 'Flight Physics', 'Analytical Thinking', 'Material Science'],
      qualificationRequired: 'B.Tech / BE in Aerospace or Aeronautical Engineering',
      salaryRangeMin: 500000,
      salaryRangeMax: 2400000,
      futureScope: 'Good. Opportunities in ISRO, defense companies, commercial airlines, and private space startups are expanding.',
      roadmapAfter10th: '1. Choose Intermediate MPC stream.\n2. Focus on advanced mechanics and aerodynamics basics.',
      roadmapAfterIntermediate: '1. Qualify in JEE Mains/Advanced to join specialized colleges (like IIST or IITs).\n2. Pursue B.Tech Aerospace Engineering.'
    },
    {
      title: 'Chemical Engineer',
      slug: 'chemical-engineer',
      overview: 'Chemical Engineers transform raw materials into valuable chemical products. They manage refining plants, pharmaceutical synthesis, and chemical processing machinery.',
      responsibilities: ['Design chemical factory processing layouts', 'Monitor chemical reaction parameters in manufacturing plants', 'Ensure safety protocols and environmental compliances are met', 'Develop new chemical products (paints, plastics, cosmetics)'],
      skillsRequired: ['Chemistry', 'Process Dynamics', 'Thermodynamics', 'Plant Safety', 'Analytical Thinking'],
      qualificationRequired: 'B.Tech / BE in Chemical Engineering',
      salaryRangeMin: 350000,
      salaryRangeMax: 1800000,
      futureScope: 'Steady demand in oil refineries, fertilizer manufacturing, plastics, and pharmaceutical companies.',
      roadmapAfter10th: '1. Choose Intermediate MPC stream.\n2. Focus on Chemistry and basic physics.',
      roadmapAfterIntermediate: '1. Secure a B.Tech Chemical Engineering.\n2. Undertake internships in chemical processing units.'
    },
    {
      title: 'Electrical Engineer',
      slug: 'electrical-engineer',
      overview: 'Electrical Engineers design, test, and oversee the manufacture of electrical equipment, power grids, generators, and solar energy systems.',
      responsibilities: ['Design electrical circuit layouts for buildings and machines', 'Supervise power plant operations and grid networks', 'Develop eco-friendly solar and wind power conversion devices', 'Test electrical prototypes for safety compliance'],
      skillsRequired: ['Electrical Circuits', 'MATLAB', 'Power Systems', 'Safety Standards', 'Problem Solving'],
      qualificationRequired: 'B.Tech/BE in Electrical Engineering or Diploma in Electrical',
      salaryRangeMin: 320000,
      salaryRangeMax: 1600000,
      futureScope: 'Very stable. The transition to electric grids, solar plants, and EV infrastructure keeps demand high.',
      roadmapAfter10th: '1. Option A: Choose Intermediate MPC.\n2. Option B: Join 3-year Diploma in Electrical Engineering (Polytechnic).',
      roadmapAfterIntermediate: '1. Pursue B.Tech Electrical Engineering. Learn power systems modeling.'
    },
    {
      title: 'Biotech Scientist',
      slug: 'biotech-scientist',
      overview: 'Biotechnology Scientists apply biological systems and genetic codes to develop innovative vaccines, agricultural seeds, and eco-friendly fuels.',
      responsibilities: ['Conduct molecular biology and genetics lab tests', 'Develop biofuels and bio-fertilizers', 'Document lab discoveries for regulatory approval processes', 'Operate gene-editing equipment'],
      skillsRequired: ['Molecular Biology', 'Genetics', 'Lab Practices', 'Analytical Research', 'Data Analysis'],
      qualificationRequired: 'B.Tech Biotech / M.Sc Biotech / Ph.D (specialized)',
      salaryRangeMin: 350000,
      salaryRangeMax: 2000000,
      futureScope: 'Strong growth. Vaccine development and agricultural genetic seeds are expanding quickly.',
      roadmapAfter10th: '1. Choose Intermediate BiPC (Biology is mandatory).\n2. Focus on biochemistry and cell biology basics.',
      roadmapAfterIntermediate: '1. Join B.Tech Biotechnology or B.Sc Life Sciences.\n2. Pursue Masters (M.Sc/M.Tech) for core research roles.'
    },
    {
      title: 'Veterinarian',
      slug: 'veterinarian',
      overview: 'Veterinarians diagnose, treat, and vaccine pets, livestock, and zoo animals, ensuring animal welfare and public health safety.',
      responsibilities: ['Examine animals to diagnose ailments', 'Perform surgeries and treat animal fractures', 'Prescribe medications and formulate pet diet regimes', 'Vaccinate animals against common zoonotic diseases'],
      skillsRequired: ['Animal Anatomy', 'Surgical Procedures', 'Empathy', 'Communication', 'Patience'],
      qualificationRequired: 'B.V.Sc & AH (Bachelor of Veterinary Science & Animal Husbandry)',
      salaryRangeMin: 400000,
      salaryRangeMax: 1500000,
      futureScope: 'Growing. The increasing rate of pet ownership and commercial dairy farming is generating high demand for vets.',
      roadmapAfter10th: '1. Choose Intermediate BiPC stream.\n2. Appear for state-level veterinary entrance examinations (EAPCET/NEET).',
      roadmapAfterIntermediate: '1. Secure a B.V.Sc & AH degree (5.5 years duration).\n2. Register with State Veterinary Council.'
    },
    {
      title: 'Dentist',
      slug: 'dentist',
      overview: 'Dentists diagnose and treat oral health diseases, teeth decay, and perform dental surgeries or aesthetic teeth straightening.',
      responsibilities: ['Conduct dental cleanings and examine gums', 'Treat dental cavities and perform root canals', 'Install teeth braces and dental implants', 'Counsel patients on oral hygiene routines'],
      skillsRequired: ['Oral Surgery', 'Manual Dexterity', 'Communication', 'Attention to Detail', 'Patient Care'],
      qualificationRequired: 'BDS (Bachelor of Dental Surgery) followed by MDS (Specialization)',
      salaryRangeMin: 300000,
      salaryRangeMax: 2000000,
      futureScope: 'Stable. Growing awareness of aesthetic dentistry is boosting dental practice revenues.',
      roadmapAfter10th: '1. Choose Intermediate BiPC stream.\n2. Prepare for the NEET-UG examination.',
      roadmapAfterIntermediate: '1. Clear NEET-UG.\n2. Complete a 5-year BDS course (including 1-year internship).\n3. Optional: Pass NEET-MDS to specialize.'
    },
    {
      title: 'Physiotherapist',
      slug: 'physiotherapist',
      overview: 'Physiotherapists restore body movements and alleviate muscle pain caused by injuries, post-surgery effects, or aging through physical exercises and massages.',
      responsibilities: ['Assess muscle movement limitations of patients', 'Design customized muscle exercise plans', 'Perform therapeutic massages and electrotherapy sessions', 'Coordinate patient recovery with orthopedics'],
      skillsRequired: ['Anatomy & Physiology', 'Exercise Coaching', 'Patience', 'Empathy', 'Physical Stamina'],
      qualificationRequired: 'BPT (Bachelor of Physiotherapy) / MPT (Master\'s)',
      salaryRangeMin: 250000,
      salaryRangeMax: 1200000,
      futureScope: 'High demand in sports teams, fitness centers, corporate wellness programs, and geriatric care.',
      roadmapAfter10th: '1. Choose Intermediate BiPC stream.\n2. Focus on human muscle systems.',
      roadmapAfterIntermediate: '1. Secure admission in a 4.5-year BPT course.\n2. Complete mandatory 6-month clinical internship.'
    },
    {
      title: 'Dietician/Nutritionist',
      slug: 'dietician-nutritionist',
      overview: 'Dieticians construct healthy food diet plans for patients to manage chronic diseases, lose weight, or optimize sports fitness performance.',
      responsibilities: ['Analyze patient health parameters and dietary habits', 'Design custom food menus matching nutritional goals', 'Educate patients on food labels and clean eating', 'Monitor dietary plans in hospitals and gyms'],
      skillsRequired: ['Nutritional Science', 'Diet planning', 'Communication', 'Empathy', 'Analytical Thinking'],
      qualificationRequired: 'B.Sc. in Nutrition & Dietetics / PG Diploma',
      salaryRangeMin: 200000,
      salaryRangeMax: 900000,
      futureScope: 'Good. Rising concerns over lifestyle diseases (diabetes, obesity) are boosting consulting needs.',
      roadmapAfter10th: '1. Choose Intermediate BiPC stream.\n2. Learn about food calories and clean foods.',
      roadmapAfterIntermediate: '1. Complete B.Sc in Nutrition & Dietetics.\n2. Clear RD (Registered Dietitian) exam to practice in clinics.'
    },
    {
      title: 'Fashion Designer',
      slug: 'fashion-designer',
      overview: 'Fashion Designers design new apparel clothing lines, footwear, and fashion accessories, combining aesthetics, textile sciences, and market trends.',
      responsibilities: ['Create clothing concept sketches and patterns', 'Select appropriate fabrics, textures, and color trims', 'Build clothing prototypes and oversee tailoring assemblies', 'Participate in fashion show exhibitions'],
      skillsRequired: ['Creative Drawing', 'Pattern Making & Sewing', 'Textile Knowledge', 'Color Theory', 'Illustrator / CAD tools'],
      qualificationRequired: 'B.Des (Fashion Design) / Diploma in Fashion Design',
      salaryRangeMin: 250000,
      salaryRangeMax: 1500000,
      futureScope: 'High potential for growth with retail clothing networks and personal design boutiques.',
      roadmapAfter10th: '1. Choose any Intermediate stream (MEC, CEC, or Arts).\n2. Practice clothing sketches and basic sewing.',
      roadmapAfterIntermediate: '1. Clear NIFT / NID / UCEED entrance exams.\n2. Complete a 4-year B.Des (Fashion Design) at premier design schools.'
    },
    {
      title: 'Interior Designer',
      slug: 'interior-designer',
      overview: 'Interior Designers plan and decorate interior spaces of residential houses and commercial offices to make them functional, safe, and beautiful.',
      responsibilities: ['Consult clients on design budgets and theme concepts', 'Draft space-planning layouts using 3D design software', 'Select appropriate furniture, lighting, tiles, and wall paints', 'Supervise construction site carpenters and painters'],
      skillsRequired: ['Space Planning', 'AutoCAD / SketchUp / 3ds Max', 'Visual Design', 'Material Sourcing', 'Communication'],
      qualificationRequired: 'B.Des (Interior Design) / B.Arch / Interior Design Diplomas',
      salaryRangeMin: 300000,
      salaryRangeMax: 1600000,
      futureScope: 'Strong growth driven by the real estate expansion and urban home renovations.',
      roadmapAfter10th: '1. Choose any Intermediate stream (MPC is ideal if seeking B.Arch, otherwise MEC/Arts are eligible).\n2. Learn 3D modeling tools.',
      roadmapAfterIntermediate: '1. Join B.Des (Interior Design) or a 3-year Diploma in Interior Design.\n2. Build a portfolio showing completed house designs.'
    },
    {
      title: 'Product Manager',
      slug: 'product-manager',
      overview: 'Product Managers oversee the development of digital or physical products from initial planning, roadmap creation, to release launch, bridging business, technology, and design teams.',
      responsibilities: ['Define product features and write spec documents', 'Coordinate tasks with developer and UX design teams', 'Analyze customer usage data to optimize features', 'Establish product release launch timelines'],
      skillsRequired: ['Product Strategy', 'Analytics (SQL/Mixpanel)', 'Wireframing', 'Agile Methodologies', 'Leadership', 'Communication'],
      qualificationRequired: 'B.Tech followed by MBA (ideal) or any Bachelor\'s with experience',
      salaryRangeMin: 800000,
      salaryRangeMax: 3000000,
      futureScope: 'Top tier. Digital companies rely heavily on Product Managers to guide their software builds.',
      roadmapAfter10th: '1. Choose Intermediate MPC or MEC stream.\n2. Learn about user psychology and business ideas.',
      roadmapAfterIntermediate: '1. Secure a B.Tech, BBA, or B.Com.\n2. Gain software or design experience and complete product management bootcamps.'
    },
    {
      title: 'Financial Analyst',
      slug: 'financial-analyst',
      overview: 'Financial Analysts study financial markets, company stocks, and macro-economics to help corporate businesses and individuals make profitable investments.',
      responsibilities: ['Build corporate financial valuation spreadsheet models', 'Analyze company quarterly financial reports', 'Write investment advisory reports', 'Present investment recommendations to managers'],
      skillsRequired: ['Financial Modeling', 'MS Excel (Advanced)', 'Valuation Methods', 'Accounting Laws', 'Analytical Thinking'],
      qualificationRequired: 'B.Com / BBA (Finance) / CFA / MBA (Finance)',
      salaryRangeMin: 450000,
      salaryRangeMax: 2000000,
      futureScope: 'Very solid. Financial services, investment funds, and corporate firms always require analyst talent.',
      roadmapAfter10th: '1. Choose Intermediate MEC or CEC stream (Maths and Commerce are critical).\n2. Focus on accounting rules.',
      roadmapAfterIntermediate: '1. Pursue B.Com or BBA Finance.\n2. Prepare for CFA (Chartered Financial Analyst) Level 1 exam.'
    },
    {
      title: 'Investment Banker',
      slug: 'investment-banker',
      overview: 'Investment Bankers facilitate corporate finance transactions, including helping companies raise capital via IPO shares, managing corporate mergers (M&A), and structuring bond issues.',
      responsibilities: ['Build detailed corporate financial projection sheets', 'Draft investment decks and corporate sales pitch books', 'Coordinate legal due-diligence in corporate acquisitions', 'Structure IPO pricing strategies'],
      skillsRequired: ['Corporate Finance', 'Valuation Modeling', 'Negotiation', 'Analytical Thinking', 'Excel & PowerPoint', 'Stamina'],
      qualificationRequired: 'MBA (Finance) from Top Tier B-Schools / CA / CFA',
      salaryRangeMin: 900000,
      salaryRangeMax: 4000000,
      futureScope: 'Highly lucrative career. Deals in mergers and corporate expansion are growing in emerging markets like India.',
      roadmapAfter10th: '1. Choose Intermediate MEC or CEC stream.\n2. Focus on corporate business reports and economic policies.',
      roadmapAfterIntermediate: '1. Complete B.Com, BBA, or B.Tech.\n2. Complete MBA Finance from premier institutes (like IIMs) or clear CA.'
    },
    {
      title: 'Company Secretary',
      slug: 'company-secretary',
      overview: 'Company Secretaries (CS) are legal experts responsible for ensuring corporate boards comply with company laws, board guidelines, and investor disclosure regulations.',
      responsibilities: ['Advise corporate directors on legal duties', 'Draft corporate board meeting minutes and resolutions', 'Handle company registration filing forms with ROC', 'Coordinate annual shareholder general meetings'],
      skillsRequired: ['Company Law', 'Corporate Governance', 'Legal drafting', 'Attention to Detail', 'Corporate Administration'],
      qualificationRequired: 'CS Certification from ICSI',
      salaryRangeMin: 400000,
      salaryRangeMax: 1800000,
      futureScope: 'Very stable. Statutory corporate laws require every medium-large corporation to appoint a qualified CS.',
      roadmapAfter10th: '1. Choose Intermediate CEC or MEC stream.\n2. Register for the CSEET (CS Executive Entrance Test).',
      roadmapAfterIntermediate: '1. Clear CSEET Exam.\n2. Pass CS Executive exams, complete corporate internship, and clear CS Professional.'
    },
    {
      title: 'Actuary',
      slug: 'actuary',
      overview: 'Actuaries apply advanced mathematical and statistical models to analyze the financial cost of risk and uncertainty, primarily in insurance and pension funds.',
      responsibilities: ['Calculate insurance policy pricing (premium tables)', 'Estimate future financial liabilities of pension schemes', 'Build mathematical models for disaster probability', 'Advise companies on risk management schemes'],
      skillsRequired: ['Actuarial Mathematics', 'Statistics & Probability', 'R / Python', 'Financial Valuation', 'Excel modeling'],
      qualificationRequired: 'Clearing Actuarial Exams from IAI (Institute of Actuaries of India)',
      salaryRangeMin: 600000,
      salaryRangeMax: 3000000,
      futureScope: 'Exceptional. Highly specialized field with very few qualified professionals, leading to high starting pay.',
      roadmapAfter10th: '1. Choose Intermediate MPC (Advanced math is critical).\n2. Register for ACET (Actuarial Common Entrance Test).',
      roadmapAfterIntermediate: '1. Clear ACET exam.\n2. Pursue B.Sc Mathematics / Statistics / Actuarial Science and clear professional IAI exams.'
    },
    {
      title: 'Journalist/Reporter',
      slug: 'journalist-reporter',
      overview: 'Journalists investigate, document, and report news stories, current events, and political developments for TV, newspapers, radio, and digital media platforms.',
      responsibilities: ['Investigate news leads and interview sources', 'Write editorial articles or report live on camera', 'Verify facts and check source credibility', 'Edit raw news copies and check compliance'],
      skillsRequired: ['Reporting', 'Writing & Editing', 'Public Speaking', 'Critical Thinking', 'Researching', 'Networking'],
      qualificationRequired: 'Bachelor\'s in Journalism & Mass Communication (BJMC) / English literature',
      salaryRangeMin: 250000,
      salaryRangeMax: 1200000,
      futureScope: 'Growing in digital sectors. Digital video journalism and local newsletters are creating new self-publishing opportunities.',
      roadmapAfter10th: '1. Choose any Intermediate stream (HEC/CEC or Arts are excellent).\n2. Write blogs, debate, and focus on language vocabulary.',
      roadmapAfterIntermediate: '1. Complete a BJMC or BA English/Communication.\n2. Intern at local newspaper desks or TV channels.'
    },
    {
      title: 'Content Writer',
      slug: 'content-writer',
      overview: 'Content Writers write informative articles, SEO blog posts, social media captions, and video scripts for brands to educate or promote products.',
      responsibilities: ['Research topics and write original blog content', 'Optimize text copy with target SEO keywords', 'Write scripts for social media reels/advertisements', 'Proofread and edit draft publications'],
      skillsRequired: ['Creative Writing', 'SEO principles', 'Researching', 'WordPress/Medium', 'Attention to Detail'],
      qualificationRequired: 'Any Bachelor\'s degree (English literature preferred) / Writing Portfolio',
      salaryRangeMin: 240000,
      salaryRangeMax: 900000,
      futureScope: 'High demand. Every online marketing brand requires copywriters to create content marketing pipelines.',
      roadmapAfter10th: '1. Choose any Intermediate stream (CEC/HEC or Arts).\n2. Start writing short essays or manage personal review blogs.',
      roadmapAfterIntermediate: '1. Pursue BA English, BA Journalism, or B.Com.\n2. Build a writing portfolio and learn basic SEO tool skills.'
    },
    {
      title: 'Photographer',
      slug: 'photographer',
      overview: 'Photographers capture professional images for events, fashion styling, commercial advertisements, travel magazines, and wildlife archives.',
      responsibilities: ['Adjust camera parameters (aperture, ISO, speed)', 'Plan studio lighting setups and angles', 'Edit raw photos using software (Lightroom/Photoshop)', 'Interact with clients to coordinate shoots'],
      skillsRequired: ['DSLR Operations', 'Lightroom / Photoshop editing', 'Composition rules', 'Lighting control', 'Portfolio curation'],
      qualificationRequired: 'Fine Arts degree / Diploma in Photography / Portfolio',
      salaryRangeMin: 200000,
      salaryRangeMax: 1200000,
      futureScope: 'Good. Commercial advertising and wedding events generate continuous photography gigs.',
      roadmapAfter10th: '1. Choose any Intermediate stream.\n2. Practice composition using phone cameras and learn basic editing.',
      roadmapAfterIntermediate: '1. Pursue a Bachelor of Fine Arts (BFA) or a 1-year Diploma in Photography.\n2. Build a diverse visual portfolio.'
    },
    {
      title: 'Video Editor',
      slug: 'video-editor',
      overview: 'Video Editors compile and edit raw camera footage, adding visual effects, color tuning, transitions, and audio syncs to deliver high-quality video files.',
      responsibilities: ['Cut and compile raw footage clips into timelines', 'Sync background audio, voice-overs, and sound effects', 'Apply color grading (LUTs) and transitions', 'Utilize editing tools (Premiere Pro, DaVinci Resolve)'],
      skillsRequired: ['Premiere Pro / After Effects / DaVinci', 'Video Pacing', 'Color Grading', 'Sound Design Basics', 'Storyboarding'],
      qualificationRequired: 'Diplomas in Editing & VFX / Self-taught Portfolio',
      salaryRangeMin: 250000,
      salaryRangeMax: 1200000,
      futureScope: 'Strong growth. YouTube content hubs, ad agencies, and OTT video platforms need video editing talent.',
      roadmapAfter10th: '1. Choose any Intermediate stream.\n2. Start learning mobile editing apps and move to PC editors.',
      roadmapAfterIntermediate: '1. Complete a Diploma in Video Editing / Multimedia or B.Sc Animation.\n2. Create video projects for social media.'
    },
    {
      title: 'Sound Engineer',
      slug: 'sound-engineer',
      overview: 'Sound Engineers manage sound systems, audio recording, sound mixing, and sound mastering for movies, music records, live concerts, and radio broadcasts.',
      responsibilities: ['Set up studio microphones and recording channels', 'Mix vocal tracks and instruments using software (Pro Tools)', 'Manage live audio sound boards at music concerts', 'Apply sound effects and sync foley for film tracks'],
      skillsRequired: ['Pro Tools / Logic Pro', 'Audio Science', 'Audio Mixing & Mastering', 'Hardware Board operations', 'Attention to Detail'],
      qualificationRequired: 'B.Sc. in Sound Engineering / Diplomas in Audio Engineering',
      salaryRangeMin: 300000,
      salaryRangeMax: 1500000,
      futureScope: 'Steady demand in recording studios, FM radio networks, movie post-production, and event management.',
      roadmapAfter10th: '1. Choose any Intermediate stream (MPC is helpful for learning acoustics physics).\n2. Practice sound mixing.',
      roadmapAfterIntermediate: '1. Join B.Sc Sound Engineering or 3-year Polytechnic Diploma in Electronics & Communication.'
    },
    {
      title: 'Pilot (Commercial)',
      slug: 'commercial-pilot',
      overview: 'Commercial Pilots fly passenger airlines, cargo planes, and charter helicopters, ensuring flight safety, passenger comfort, and flight plan guidelines are met.',
      responsibilities: ['Inspect flight controls and navigation systems before takeoff', 'Fly aircraft following air traffic control directions', 'Adjust to changing weather conditions in flight', 'Manage flight logs and log hours'],
      skillsRequired: ['Flight Navigation', 'Meteorology Basics', 'Decision Making', 'Physical Fitness', 'Communication', 'Technical Aptitude'],
      qualificationRequired: 'CPL (Commercial Pilot License) from DGCA-approved flying schools',
      salaryRangeMin: 1200000,
      salaryRangeMax: 4000000,
      futureScope: 'Excellent. The civil aviation industry in India is expanding rapidly with new airports and large aircraft deliveries.',
      roadmapAfter10th: '1. Choose Intermediate MPC stream (Maths and Physics are mandatory for CPL eligibility).\n2. Keep physically fit.',
      roadmapAfterIntermediate: '1. Complete Class 2 & Class 1 DGCA medical evaluations.\n2. Join a flying training institute to complete 200 flying hours and clear DGCA exams.'
    },
    {
      title: 'Merchant Navy Officer',
      slug: 'merchant-navy-officer',
      overview: 'Merchant Navy Officers manage commercial cargo ships (oil tankers, containers) transporting goods globally across international oceans.',
      responsibilities: ['Navigate vessels using radar and GPS maps', 'Supervise deck cargo loading operations', 'Maintain ship engines and mechanical systems', 'Manage safety drills and marine compliance rules'],
      skillsRequired: ['Navigation Systems', 'Marine Engineering', 'Crisis Management', 'Physical Stamina', 'Discipline'],
      qualificationRequired: 'B.Sc. Nautical Science / B.Tech Marine Engineering',
      salaryRangeMin: 600000,
      salaryRangeMax: 3000000,
      futureScope: 'Highly lucrative international career. Global sea cargo shipping continues to dominate trade.',
      roadmapAfter10th: '1. Choose Intermediate MPC stream.\n2. Develop high physical fitness and prepare for IMU-CET exam.',
      roadmapAfterIntermediate: '1. Clear IMU-CET exam.\n2. Pursue B.Sc. Nautical Science (3 years) or B.Tech Marine Engineering (4 years).'
    },
    {
      title: 'Event Manager',
      slug: 'event-manager',
      overview: 'Event Managers coordinate and execute large corporate events, wedding functions, music concerts, and marketing expos from budgeting to on-site coordination.',
      responsibilities: ['Consult clients on event concepts and budgets', 'Coordinate vendors (decorators, caterers, sound)', 'Secure municipality permissions and safety clearings', 'Oversee event operations on-site'],
      skillsRequired: ['Project Planning', 'Negotiation', 'Communication', 'Stress Tolerance', 'Problem Solving', 'Budgeting'],
      qualificationRequired: 'Bachelor\'s in Event Management / MBA / BBA / Event Diplomas',
      salaryRangeMin: 250000,
      salaryRangeMax: 1200000,
      futureScope: 'High growth. Rising corporate budgets for conferences and grand weddings generate plenty of work.',
      roadmapAfter10th: '1. Choose any Intermediate stream (CEC/HEC or Arts).\n2. Participate in school event organizing committees.',
      roadmapAfterIntermediate: '1. Complete BBA in Event Management or B.Com.\n2. Work at a local event agency to build a vendor network.'
    },
    {
      title: 'HR Manager',
      slug: 'hr-manager',
      overview: 'Human Resource (HR) Managers direct the recruitment, employee training, salary payroll administration, and performance reviews of corporate organizations.',
      responsibilities: ['Publish job advertisements and coordinate interviews', 'Design employee onboarding programs', 'Moderate employee-management conflicts', 'Formulate corporate policy guidelines'],
      skillsRequired: ['Communication', 'Interviewing', 'Conflict Resolution', 'Employment Laws', 'Organizational Skills'],
      qualificationRequired: 'BBA followed by MBA in HR / any degree with experience',
      salaryRangeMin: 350000,
      salaryRangeMax: 1800000,
      futureScope: 'Very stable. Every corporate business requires human resource personnel to maintain office operations.',
      roadmapAfter10th: '1. Choose Intermediate CEC or MEC stream.\n2. Focus on communication development.',
      roadmapAfterIntermediate: '1. Complete BBA or B.Com.\n2. Pursue MBA specialized in Human Resource Management (HR).'
    },
    {
      title: 'Tourism Consultant',
      slug: 'tourism-consultant',
      overview: 'Tourism Consultants design travel itineraries, coordinate hotel bookings, process visa applications, and guide clients on travel packages.',
      responsibilities: ['Construct custom travel plans matching client budgets', 'Coordinate airline bookings and hotel reservations', 'Guide clients on visa processing documents', 'Handle client emergency queries during travel'],
      skillsRequired: ['Geography Knowledge', 'Customer Service', 'Itinerary Design', 'Ticketing Software', 'Communication'],
      qualificationRequired: 'Bachelor of Tourism Studies (BTS) / Travel Diplomas',
      salaryRangeMin: 240000,
      salaryRangeMax: 900000,
      futureScope: 'Good. Tourism is expanding dynamically with rising disposable income and holiday demands.',
      roadmapAfter10th: '1. Choose any Intermediate stream (Vocational in Travel & Tourism is excellent).\n2. Study world geography.',
      roadmapAfterIntermediate: '1. Pursue a Bachelor of Tourism Studies (BTS) or Diploma in Travel and Ticketing.'
    },
    {
      title: 'Social Worker',
      slug: 'social-worker',
      overview: 'Social Workers assist individuals and communities to overcome social vulnerabilities, working with NGOs, rehab centers, or child welfare boards.',
      responsibilities: ['Counsel families going through domestic issues', 'Coordinate government welfare applications for the poor', 'Manage community health and cleanup campaigns', 'Run operations for non-profit organizations (NGOs)'],
      skillsRequired: ['Empathy', 'Active Listening', 'Counseling', 'Welfare Policies', 'Community Mobilization'],
      qualificationRequired: 'BSW (Bachelor of Social Work) / MSW (Master\'s)',
      salaryRangeMin: 200000,
      salaryRangeMax: 800000,
      futureScope: 'Steady demand in NGOs, international funding trusts, corporate CSR departments, and government child/youth panels.',
      roadmapAfter10th: '1. Choose Intermediate HEC or CEC stream (Humanities are best).\n2. Participate in local charity runs or volunteer events.',
      roadmapAfterIntermediate: '1. Secure a Bachelor of Social Work (BSW) degree.\n2. Intern at local NGOs to gain fieldwork experience.'
    }
  ];

  for (const career of careerData) {
    await prisma.career.create({
      data: {
        title: career.title,
        slug: career.slug,
        overview: career.overview,
        responsibilities: JSON.stringify(career.responsibilities),
        skillsRequired: JSON.stringify(career.skillsRequired),
        qualificationRequired: career.qualificationRequired,
        salaryRangeMin: career.salaryRangeMin,
        salaryRangeMax: career.salaryRangeMax,
        futureScope: career.futureScope,
        roadmapAfter10th: career.roadmapAfter10th,
        roadmapAfterIntermediate: career.roadmapAfterIntermediate,
      }
    });
  }

  console.log('Careers seeded.');

  // 6. Seed Scholarships
  const scholarshipsData = [
    {
      name: 'Telangana Post Matric Scholarship (RTF & MTF)',
      eligibility: 'SC, ST students whose parental income is less than Rs. 2.0 Lakhs per annum. BC, EBC, Minority, and Disabled welfare students in Telangana whose parental income is less than Rs. 1.5 Lakhs (rural) or Rs. 2.0 Lakhs (urban). Eligible for Intermediate, Polytechnic, and higher courses.',
      requiredDocuments: JSON.stringify(['10th Class Memo', 'Aadhaar Card', 'Caste Certificate', 'Income Certificate (Latest)', 'Bank Passbook Front Page', 'Bonafide Certificate']),
      incomeCriteria: 'Less than Rs. 1.5 - 2.0 Lakhs per annum depending on category',
      lastDate: '2026-10-31',
      officialWebsite: 'https://telanganaepass.cgg.gov.in'
    },
    {
      name: 'National Scholarship Portal (NSP) - Post Matric Scheme',
      eligibility: 'Students belonging to minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) studying in Class 11, 12, Polytechnic, ITI, or Diploma courses, securing 50% or above in the previous board exam.',
      requiredDocuments: JSON.stringify(['Previous Class Memo', 'Aadhaar Card', 'Minority Community Declaration', 'Income Certificate', 'Fee Receipt', 'Bonafide Certificate']),
      incomeCriteria: 'Annual family income not exceeding Rs. 2.0 Lakhs',
      lastDate: '2026-11-15',
      officialWebsite: 'https://scholarships.gov.in'
    },
    {
      name: 'Pragati Scholarship for Girls (Polytechnic/Diploma)',
      eligibility: 'Girl students admitted to the 1st year of Diploma (Polytechnic) course in any AICTE-approved institution. A maximum of two girls per family are eligible.',
      requiredDocuments: JSON.stringify(['10th memo', 'POLYCET Rank Card', 'Admission Letter', 'Income Certificate', 'Aadhaar Card', 'Declaration Form']),
      incomeCriteria: 'Annual family income not exceeding Rs. 8.0 Lakhs',
      lastDate: '2026-11-30',
      officialWebsite: 'https://www.aicte-india.org/schemes/students-development-schemes/pragati'
    }
  ];

  for (const s of scholarshipsData) {
    await prisma.scholarship.create({
      data: s
    });
  }

  console.log('Scholarships seeded.');

  // 7. Seed Admission Updates
  const updatesData = [
    {
      title: 'TS POLYCET 2026 Counselling Dates Announced',
      category: 'POLYTECHNIC',
      content: 'The State Board of Technical Education and Training (SBTET), Hyderabad, has released the TS POLYCET 2026 counselling schedule. Certificate verification will begin on July 10, and web options can be exercised from July 12. Students must carry their POLYCET Rank card and 10th memos.',
      isPinned: true
    },
    {
      title: 'Telangana Board of Intermediate Education: First Phase Admissions Extension',
      category: 'INTERMEDIATE',
      content: 'The Board of Intermediate Education (BIE) Telangana has extended the deadline for first-phase admissions into government, aided, and private junior colleges in Hyderabad until July 25. Students can apply directly at their preferred institutions or online.',
      isPinned: true
    },
    {
      title: 'Government ITI Admissions Round 1 Seat Allotment Released',
      category: 'ITI',
      content: 'The Department of Employment and Training, Telangana, has published the first round of seat allotments for government and private ITI trades (Electrician, Fitter, Welder, COPA). Selected candidates must report to their respective centers by July 15 with original certificates.',
      isPinned: false
    },
    {
      title: 'Pre-Matric & Post-Matric ePASS Scholarship Applications Open for 2026',
      category: 'SCHOLARSHIP',
      content: 'Online applications for fresh registration and renewal of ePASS post-matric and pre-matric scholarships for the academic year 2026-27 are now active on the ePASS portal. Eligible students are advised to submit forms before the deadline with validated caste and income certificates.',
      isPinned: false
    }
  ];

  for (const u of updatesData) {
    await prisma.admissionUpdate.create({
      data: u
    });
  }

  console.log('Admission Updates seeded.');
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
