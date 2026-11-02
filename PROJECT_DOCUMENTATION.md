# Career Compass - Project Documentation

Career Compass is a verified educational guidance portal designed specifically for 10th-class graduates in Hyderabad, Telangana. The platform provides transparent, objective, and verified information regarding Intermediate streams, Polytechnic diplomas, ITI trade programs, welfare scholarships, and government reservation quotas.

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

### 4. Admin Dashboard Panel
Allows administrators (using the `SUPER_ADMIN` role) to manage the portal client-side:
- View database-wide registration, college, and review statistics in-memory.
- Moderate and approve/reject user reviews.
- Publish pinned admission alerts and counseling timelines.
- Add new college listings to the directory.

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
