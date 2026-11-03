# Career Compass 365 - Project Documentation

Career Compass 365 is a verified educational guidance portal designed specifically for 10th-class graduates in Hyderabad, Telangana. The platform provides transparent, objective, and verified information regarding Intermediate streams, Polytechnic diplomas, ITI trade programs, welfare scholarships, and government reservation quotas.

---

## 🏗️ Architecture & Technology Stack

The project is built using a modern, serverless, and highly scalable static architecture:

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16 (App Router)** | Client-side routing, modular components, and React Context. |
| **Design & UI** | **Tailwind CSS & Lucide Icons** | harmonized dark mode palette, smooth gradients, and micro-animations. |
| **Authentication** | **Firebase Authentication** | Secure Email/Password registration, login, and session persistence. |
| **Database** | **Cloud Firestore** | Serverless client-side document database for reviews, updates, user bookmarks, and statistics. |
| **Pre-rendering** | **SQLite (via Prisma)** | Local build-time database used to extract page parameters during static HTML generation. |
| **Deployment** | **GitHub Pages** | Free static hosting, utilizing Next.js `output: 'export'` under `/career-campass` base path. |

---

## 🏛️ Tri-Portal System Architecture

Career Compass 365 is organized into three interconnected portals:

### 1. Student Portal (Public-Facing Platform)
- **Directory & Exploration**: Class 10 graduates browse and filter Junior Colleges, Polytechnics, and ITIs across Hyderabad.
- **Stream Discovery**: In-depth guidance for Intermediate streams (MPC, BiPC, MEC, CEC, HEC), vocational certifications, and 3-year technical diplomas.
- **Transparent Profiles**: Institutional fees breakdown (Tuition, Admission, Lab, Hostel), cutoffs, eligibility criteria, and facility checklists.
- **Admissions & Direct WhatsApp Enquiry**: Instant click-to-chat WhatsApp admissions desk link with prefilled enquiry messages, key application dates, and direct application links.
- **Documents & Downloads**: Instant download access to official College Prospectuses, Approved Fee Structure circulars, and brochures.
- **Side-by-Side Comparison**: Compare up to 4 institutions side-by-side on fees, facilities, established year, and affiliation.
- **25-Question Diagnostic Survey**: Personalized recommendation engine mapping stream preferences, budgets, and location proximity.

### 2. College Portal (Self-Registration & Institutional Management Dashboard)
- **Self-Registration for Institutions (`/college-portal`)**:
  - Authorised representative registration using institutional email, password, mobile number, and designation.
  - Institutional credentials: College name, short code, ownership (Government / Private / Aided / Autonomous), category, campus address, landmark, website, board affiliation (TSBIE, SBTET, AICTE), and board code.
- **Institutional Management Dashboard (10 Core Sections)**:
  1. **Basic Profile**: Campus name, description, logo, cover banner, photo gallery, website, principal message.
  2. **Streams & Courses**: Management of intermediate streams (MPC, BiPC, MEC, CEC, HEC) and technical diplomas with duration, medium, and intake seats.
  3. **Fees Structure**: Tuition fees, admission fees, other charges, hostel fees, and installment terms.
  4. **Eligibility Criteria**: Minimum 10th marks / GPA cutoffs, subject prerequisites, and reservation quotas.
  5. **Campus Facilities**: Infrastructure toggles (Hostels, Transport buses, Laboratories, Library, Wi-Fi, Cafeteria, CCTV) with custom route and capacity notes.
  6. **Contact & Helpline**: Phone numbers, admissions mobile, official email, admissions office hours, and WhatsApp admissions helpline.
  7. **Admissions & Key Dates**: Academic year, application start & end dates, counseling schedule, classes start date, and 4-step procedure builder.
  8. **Scholarships & Concessions**: State ePASS fee reimbursement eligibility, merit waivers, and sports quota concessions.
  9. **Documents & Brochures**: Link/upload Prospectus PDF, Fee structure circular, and printable application forms.
  10. **Student View Preview**: Instant real-time preview of how the institution's public profile renders to prospective students.
- **Verification Workflow**: Newly registered institutions receive `PENDING` verification status, keeping them safe in draft mode until vetted by Super Admin.

### 3. Super Admin Portal (Platform Control Centre - `/admin`)
- **Direct College Creation & Instant Publishing (`Add New College`)**:
  - Full institutional profile builder for Super Admins to add any junior college, polytechnic, or vocational institute.
  - Comprehensive data capture: Institutional identity, ownership, category, district, board affiliation (TSBIE/SBTET), code, principal contact, WhatsApp admissions desk helpline, key dates, scholarships, and custom facility notes.
  - Dynamic stream repeater: Stream fees (MPC, BiPC, MEC, CEC, HEC, etc.), admission modes, cutoffs, and quota details.
  - **"Publish LIVE Immediately on Student Portal" Toggle**: Allows admins to publish directly to the public directory with an official "Verified Institution" badge, or save as an offline draft.
  - Real-time celebratory success card with 1-click links to view the live college page on the Student Portal (`/colleges/[id]`) or manage it in the directory.
- **Institutional Approvals & Directory Control (`College Directory & Approvals`)**:
  - Filter colleges by `Pending Verification`, `Approved & Live`, or `Rejected`.
  - Comprehensive **Dossier Review Modal** inspecting institutional credentials, representative information, fee schedules, documents, and contact details.
  - **1-Click "Approve & Publish Live"**: Instantly activates the institution on the public Student Portal with a "Verified Institution" badge.
  - **1-Click "Pause / Unpublish"**: Instantly takes any live college offline into draft status.
  - **1-Click "Reject / Request Revision"**: Sends actionable feedback notes to the institution.
  - **Verification Badge Toggle** and permanent deletion controls.
  - Direct `+ Add New College` shortcut button in the directory header.
- **Student Reviews Moderation**: Approve or discard submitted student ratings and testimonials.
- **Admissions Announcement Publisher**: Post real-time notifications, entrance exam alerts (POLYCET, APRJC), and counseling updates.
- **Survey Analytics & CSV Export**: Real-time analysis of student responses with 1-click formatted CSV download for school drives.

---

## 🚀 Key Features

### 1. Unified Pathways Catalog
Detailed guidance outlining the differences between:
- **Junior Colleges (Intermediate)**: MPC, BiPC, CEC, MEC, and HEC streams.
- **Polytechnic Colleges**: 3-year Engineering and Technical diplomas.
- **ITI Trades**: 1-2 year skill-based vocational certificates.

### 2. Side-by-Side College Compare
Allows students to select up to **4 colleges** from the search directory and compare their:
- Affiliation credentials and established year.
- Stream-wise annual fee structures.
- Campus facilities (Wi-Fi, Library, Transport, Hostel, Labs, Smart Classrooms).
- Student ratings and review queues.

### 3. Personalized Recommendation Engine
Queries Firestore to generate customized matches based on the student's profile settings:
- Preferred stream (e.g. MPC vs. ITI).
- Annual tuition fee budget (dynamic cost filtering).
- Location proximity and hostel boarding requirement.

### 5. 25-Question Diagnostic Student Survey & Sequential Filling
- Comprehensive 6-section diagnostic survey for 10th-grade students to pinpoint interests, financial budgets, and future career questions.
- Sequential "one-by-one" submission support for school drives and educational camps.
- Instant personalized college recommendations matching student's chosen stream and location in a real-time modal popup.
- Admin dashboard tab with search filter and instant CSV export for reporting.

### 6. About Us, Leadership & Excellence Voices Initiative
- **Rahim Shaikh**: Co-founder of **Excellence Voices** & Lead Youth Mentor at Career Compass 365 (Contact: `+91 92843 06159`).
- **Our Aim**: Zero educational confusion, unbiased guidance, and equal access to higher education for every Class 10 student regardless of socioeconomic background.
- **How We Help**: Stream roadmaps, verified college discovery, government scholarship & fee reimbursement navigation (ePASS/Gurukulam), entrance exam preparation (POLYCET, TG APRJC CET), and one-on-one counseling.

---

## 🗄️ Database Collections (Cloud Firestore)

### `colleges`
Stores vetted profiles of educational institutions.
```json
{
  "id": "6526",
  "name": "Government Junior College, Falaknuma",
  "ownership": "GOVERNMENT",
  "category": "JUNIOR_COLLEGE",
  "address": "Falaknuma, Hyderabad, Telangana 500053",
  "establishedYear": 1978,
  "hasHostel": false,
  "hasTransport": true,
  "streams": [
    {
      "streamName": "MPC",
      "annualFee": 1200,
      "minQualification": "10th Class Pass"
    }
  ]
}
```

### `careers`
Stores comprehensive roadmaps for various post-10th career options.
```json
{
  "slug": "aerospace-engineer",
  "title": "Aerospace Engineer",
  "description": "Designing, testing, and building aircraft, spacecraft, and missiles.",
  "pathway": "10th -> MPC Intermediate -> B.Tech (Aerospace Engineering) -> M.Tech / Job",
  "salary": "₹5,00,000 - ₹20,00,000 per year"
}
```

### `users`
Tracks registered student details and bookmarks.
```json
{
  "uid": "user-auth-uid",
  "name": "Rahul Kumar",
  "email": "rahul@gmail.com",
  "role": "STUDENT",
  "schoolName": "ZP High School",
  "percentage10th": 85.0,
  "preferredStream": "MPC",
  "budget": 45000,
  "savedColleges": [6526, 6527]
}
```

---

## 🛠️ Workflows

### Seeding Data to Firestore
To copy all initial SQLite data into Firestore:
```powershell
node scripts/seed-firebase-client.js
```

### Building & Deploying Static Frontend
To build and deploy the app directly to GitHub Pages:
```powershell
npm run build
# Manual force push to gh-pages branch
git init
git remote add origin https://github.com/SkRahim1/career-campass.git
git checkout -b gh-pages
git add .
git commit -m "Deploy static pages"
git push origin gh-pages --force
```
