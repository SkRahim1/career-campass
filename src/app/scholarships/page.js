import React from 'react';
import prisma from '@/lib/prisma';
import ScholarshipCard from '@/components/ScholarshipCard';
import { Award, ShieldCheck, Info } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Scholarships for 10th & 12th Students in Telangana | ePASS, Welfare & Merit Aid',
  description: 'Explore Telangana state ePASS scholarships, Post-Matric fee reimbursement, central sector merit scholarships, and minority financial aid on Career 365 Compass (Career365Compass).',
  keywords: [
    'Career 365 Compass',
    'Career365Compass',
    'Scholarships after 10th',
    'Telangana ePASS scholarship',
    'Post matric scholarship Telangana',
    'Fee reimbursement Telangana',
    'Polytechnic scholarships',
    'MeeSeva caste income certificate scholarship',
    'NMMS scholarship Telangana',
    'Intermediate scholarships Hyderabad'
  ],
  alternates: {
    canonical: '/scholarships/',
  },
  openGraph: {
    title: 'Scholarships for 10th & 12th Students in Telangana | Career 365 Compass',
    siteName: 'Career 365 Compass',
    description: 'Find verified state and national scholarships, eligibility cutoffs, document checklists, and application portals on Career 365 Compass.',
    url: 'https://career365compass.in/scholarships/',
    type: 'website',
    images: [
      {
        url: '/images/portal-features.jpg',
        width: 1200,
        height: 630,
        alt: 'Telangana Post-10th Scholarships & Financial Aid Directory - Career 365 Compass',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scholarships in Telangana | Career 365 Compass',
    description: 'Explore state ePASS scholarships, fee reimbursement, and financial aid on Career 365 Compass.',
    images: ['/images/portal-features.jpg'],
  },
};

export default async function ScholarshipsPage() {
  const scholarships = await prisma.scholarship.findMany({
    orderBy: { lastDate: 'asc' }
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://career365compass.in/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Scholarships Directory",
            "item": "https://career365compass.in/scholarships/"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Which documents are required for Telangana ePASS Post-Matric Scholarship?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Key documents for ePASS include: SSC Hall Ticket Number and Memo, Aadhaar Card, Caste Certificate and Family Income Certificate issued through MeeSeva in the current financial year, College Admission Allotment Order, and a Nationalized Bank Passbook in the student's name."
            }
          },
          {
            "@type": "Question",
            "name": "Are Polytechnic Diploma students eligible for tuition fee reimbursement?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, students securing admission through TS POLYCET in Government and eligible Private Polytechnics who satisfy parental income limits are eligible for RTF (Reimbursement of Tuition Fees) and MTF (Maintenance Fees)."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10 bg-radial-gradient text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/" className="hover:text-indigo-400 transition">Home</Link>
        <span className="text-slate-600">/</span>
        <span className="text-slate-200">Scholarships & Financial Aid</span>
      </nav>
      
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-8 h-8 text-indigo-600 dark:text-indigo-405" />
          <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 font-display">Scholarships Directory</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-2xl">
          Discover available state and national financial aid programs, eligibility limits, documents checklist, and direct portal links for post-10th courses.
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-start md:items-center shadow-md">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl border border-indigo-150 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0 shadow-xs">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 text-left">
          <h3 className="text-slate-800 dark:text-slate-200 font-bold text-sm">Required Castes & Income Certificates</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
            State scholarship schemes (like ePASS) require caste and income certificates issued by **Meeseva** within the current financial year. Make sure you apply for these certificates at least one month before college admission registrations close.
          </p>
        </div>
      </div>

      {/* Grid listing */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-805 dark:text-slate-100">Available Scholarships</h2>
        {scholarships.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 dark:text-slate-500 text-sm shadow-xs">
            No scholarships found in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scholarships.map((scholarship) => (
              <div key={scholarship.id}>
                <ScholarshipCard scholarship={scholarship} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
