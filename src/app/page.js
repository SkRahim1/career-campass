import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import CollegeCard from '@/components/CollegeCard';
import CareerCard from '@/components/CareerCard';
import ScholarshipCard from '@/components/ScholarshipCard';
import { Compass, BookOpen, GraduationCap, Award, HelpCircle, ArrowRight, CheckCircle2, Star, Building2, Flame, MapPin, ShieldCheck, Milestone, Sparkles } from 'lucide-react';

export const revalidate = 0; // Disable cache for fresh local database updates

export default async function LandingPage() {
  const updates = await prisma.admissionUpdate.findMany({
    take: 3,
    orderBy: { publishedDate: 'desc' }
  });

  const rawColleges = await prisma.college.findMany({
    take: 3,
    include: {
      streams: true,
      reviews: {
        where: { isApproved: true },
        select: { rating: true }
      }
    }
  });

  const colleges = rawColleges.map(college => {
    const totalReviews = college.reviews.length;
    const averageRating = totalReviews > 0 
      ? parseFloat((college.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)) 
      : 4.0;
    return { ...college, averageRating, totalReviews };
  });

  const scholarships = await prisma.scholarship.findMany({
    take: 3
  });

  const careers = await prisma.career.findMany({
    take: 3
  });

  const faqs = [
    {
      q: "What options do I have after completing the 10th class?",
      a: "After the 10th class, you can choose several paths: 2-year Intermediate (MPC, BiPC, MEC, CEC, HEC streams), 3-year Polytechnic Diploma (Engineering streams), 2-year ITI (vocational trades), or specialized vocational diplomas."
    },
    {
      q: "How can I apply for admission in Telangana government colleges?",
      a: "Admissions into Government Junior Colleges are typically based on merit (10th GPA) and seat availability. For Polytechnic (Diploma) courses, you must qualify in the TS POLYCET exam. ITI admissions are conducted via a centralized online portal based on 10th marks."
    },
    {
      q: "What is the difference between MPC, BiPC, and MEC streams?",
      a: "MPC (Mathematics, Physics, Chemistry) leads to engineering, computer science, and technical fields. BiPC (Biology, Physics, Chemistry) leads to medicine, pharmacy, and agriculture. MEC (Maths, Economics, Commerce) is perfect for chartered accountancy, finance, and business administration."
    },
    {
      q: "Are scholarships available for Polytechnic and ITI courses?",
      a: "Yes! The Government of Telangana offers Post-Matric scholarships (ePASS) covering college tuition (RTF) and maintenance fees (MTF) for eligible SC, ST, BC, and minority students."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Career Compass",
    "url": "https://www.careercompass.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.careercompass.com/colleges?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 bg-grid-pattern bg-radial-gradient text-left">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section - Compressed margins on mobile */}
      <section className="relative pt-12 pb-6 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
        {updates.length > 0 && (
          <div className="inline-flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-50/10 border border-indigo-200/50 dark:border-indigo-550/20 text-indigo-650 dark:text-indigo-300 px-4 py-1.5 rounded-full text-[11px] font-semibold animate-pulse">
            <Flame className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400 shrink-0" />
            <span className="truncate max-w-xs sm:max-w-md">
              <span className="font-extrabold uppercase mr-1.5">Latest:</span>
              {updates[0].title}
            </span>
          </div>
        )}

        {/* Powered by Excellence Voices branding badge */}
        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 px-4 py-2 rounded-2xl shadow-sm text-xs font-semibold">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold tracking-wide">Powered by</span>
          <a href="https://excellencevoices.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-90 transition cursor-pointer">
            {/* Visual voice wave graph */}
            <div className="flex gap-0.5 items-center">
              <span className="w-0.5 h-3 rounded-full bg-[#0d2d59] dark:bg-indigo-400" />
              <span className="w-0.5 h-4.5 rounded-full bg-[#eba925]" />
              <span className="w-0.5 h-2.5 rounded-full bg-[#0d2d59] dark:bg-indigo-400" />
              <span className="w-0.5 h-5 rounded-full bg-[#eba925]" />
              <span className="w-0.5 h-3 rounded-full bg-[#0d2d59] dark:bg-indigo-400" />
            </div>
            <span className="font-extrabold tracking-tight text-sm">
              <span className="text-[#0d2d59] dark:text-slate-200">Excellence </span>
              <span className="text-[#eba925]">Voices</span>
            </span>
          </a>
        </div>

        <h1 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-slate-100 dark:via-indigo-200 dark:to-indigo-400 max-w-4xl leading-tight font-display">
          Understand Your Educational Choices After Class 10
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base max-w-2xl leading-relaxed">
          Transitioning from school can be confusing. Career Compass is a verified guidance portal designed specifically to help 10th-class students in Telangana make confident next-step decisions.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
          <Link href="#portal-guide" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-2xl shadow-md transition text-center cursor-pointer text-xs">
            Read Guidance Guide
          </Link>
          <Link href="/colleges" className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-800 dark:hover:border-slate-700 font-bold px-8 py-3 rounded-2xl transition text-center cursor-pointer text-xs">
            Find Colleges
          </Link>
        </div>
      </section>

      {/* Section 1: Detailed Portal Explanation - Compressed margins on mobile */}
      <section id="portal-guide" className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50/50 dark:bg-indigo-50/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Information Charter</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
              A Platform Dedicated to Transparency & Objectivity
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
              Most search platforms are driven by paid sponsorships and advertisements, which promote expensive private institutions. 
              <strong> Career Compass has zero ads and zero sponsorships</strong>. We exist purely to detail government and affordable educational avenues for high school graduates in Hyderabad, ensuring you know all options—regardless of budget.
            </p>
          </div>

          {/* Three Pillars Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-slate-850">
            <div className="space-y-2">
              <h4 className="font-bold text-indigo-650 dark:text-indigo-400 text-xs uppercase tracking-wider">100% Free & Verified</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-normal">
                Every college profile, fee scale, and hostel configuration is vetted against state department lists before publishing. No inflated metrics.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-indigo-655 dark:text-indigo-400 text-xs uppercase tracking-wider">Comprehensive Pathways</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-normal">
                We cover standard 2-year Intermediate programs, 3-year engineering polytechnic diplomas, ITI skills trades, and vocational courses under one roof.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-indigo-655 dark:text-indigo-400 text-xs uppercase tracking-wider">Welfare & Financial Aid</h4>
              <p className="text-slate-605 dark:text-slate-400 text-xs leading-relaxed font-normal">
                Dedicated guides explaining Telangana post-matric ePASS rules, minority scholarships, seat reservation quotas, and fee-exemption certificates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Pathways Comparison */}
      <section className="py-8 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            Compare Pathways
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">Which Educational Route Fits You?</h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs max-w-lg mx-auto">Learn the core differences between Intermediate, Polytechnic, and ITI systems.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Intermediate */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 hover:border-indigo-500/10 transition shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[9px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-extrabold uppercase">
                Academic (2 Years)
              </span>
              <span className="text-xs text-slate-500 font-bold">Class 11 & 12</span>
            </div>
            <h3 className="text-slate-900 dark:text-slate-100 font-bold text-base">Junior College (Intermediate)</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Standard academic route focusing on theory and competitive exam prep (JEE, NEET, CLAT). Excellent if you plan to do standard graduation degrees afterwards.
            </p>
            <div className="border-t border-slate-200 dark:border-slate-850 pt-3 text-[10px] text-slate-500 space-y-1">
              <p><strong className="text-slate-500 dark:text-slate-400">Major Streams:</strong> MPC, BiPC, MEC, CEC, HEC</p>
              <p><strong className="text-slate-500 dark:text-slate-400">Next Step:</strong> B.Tech, MBBS, B.Sc, B.Com, LLB</p>
            </div>
          </div>

          {/* Card 2: Polytechnic */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 hover:border-indigo-500/10 transition shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[9px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-extrabold uppercase">
                Technical (3 Years)
              </span>
              <span className="text-xs text-slate-500 font-bold">Engineering Diploma</span>
            </div>
            <h3 className="text-slate-900 dark:text-slate-100 font-bold text-base">Polytechnic Diploma</h3>
            <p className="text-slate-605 dark:text-slate-404 text-xs leading-relaxed">
              Applied engineering training. Perfect if you prefer hands-on machine/coding laboratory works and wish to join job sectors early or enter B.Tech 2nd-year directly.
            </p>
            <div className="border-t border-slate-200 dark:border-slate-850 pt-3 text-[10px] text-slate-500 space-y-1">
              <p><strong className="text-slate-500 dark:text-slate-400">Major Streams:</strong> Mechanical, Electrical, Civil, CS</p>
              <p><strong className="text-slate-500 dark:text-slate-400">Next Step:</strong> B.Tech 2nd Yr (Lateral Entry) / Technical Jobs</p>
            </div>
          </div>

          {/* Card 3: ITI */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 hover:border-indigo-500/10 transition shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[9px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-extrabold uppercase">
                Skill Trades (1-2 Years)
              </span>
              <span className="text-xs text-slate-500 font-bold">Vocation Certificate</span>
            </div>
            <h3 className="text-slate-900 dark:text-slate-100 font-bold text-base">ITI (Industrial Training Institute)</h3>
            <p className="text-slate-606 dark:text-slate-404 text-xs leading-relaxed">
              Rapid trade skill training program. Focused entirely on immediate employment in manufacturing sectors, workshops, railways, or self-employment fields.
            </p>
            <div className="border-t border-slate-200 dark:border-slate-850 pt-3 text-[10px] text-slate-500 space-y-1">
              <p><strong className="text-slate-500 dark:text-slate-400">Major Streams:</strong> Electrician, Fitter, Welder, COPA</p>
              <p><strong className="text-slate-500 dark:text-slate-400">Next Step:</strong> Apprentice jobs / Railways / Industrial units</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Student Journey Map */}
      <section className="py-10 sm:py-16 bg-slate-100/50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[9px] font-extrabold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-full">
              How to Navigate
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">Your 4-Step Guidance Journey</h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs max-w-lg mx-auto">We recommend starting with career goals first before finalizing your college search.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              { step: '1', title: 'Explore Careers', desc: 'Browse our Library of 50+ professions. Learn what B.Tech, CA, or Nursing roadmaps require.' },
              { step: '2', title: 'Align Streams', desc: 'Find out whether your goal requires MPC, BiPC, or Polytechnic Diploma courses.' },
              { step: '3', title: 'Compare Colleges', desc: 'Filter colleges in Hyderabad by fee budgets and select up to 4 to compare side-by-side.' },
              { step: '4', title: 'Examine Quotas & Aid', desc: 'Read government reservation guidelines and verify ePASS scholarship websites.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative text-left shadow-sm">
                <span className="absolute right-4 top-4 w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold flex items-center justify-center">
                  {item.step}
                </span>
                <h3 className="text-slate-900 dark:text-slate-100 font-bold text-sm mt-4">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Colleges Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">Featured Colleges in Hyderabad</h2>
            <p className="text-slate-606 dark:text-slate-400 text-xs">Vetted profiles of junior colleges, polytechnics, and skill trades.</p>
          </div>
          <Link href="/colleges" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group shrink-0">
            <span>View College Directory</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <div key={college.id}>
              <CollegeCard college={college} />
            </div>
          ))}
        </div>
      </section>

      {/* Dedicated Government College Highlight banner */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900/10 via-indigo-900/25 to-purple-900/10 dark:from-indigo-900/60 dark:to-purple-900/40 border border-indigo-500/25 dark:border-indigo-500/20 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-yellow-550/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Affordable Education</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">Government Junior Colleges</h2>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              Explore list of all Government Junior Colleges in Hyderabad. Read reservation policies, documentation guidelines, fee-exemptions, and admission notifications.
            </p>
          </div>
          <Link href="/government-colleges" className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold px-6 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 transition shrink-0 shadow-md cursor-pointer text-xs">
            Browse Government Colleges
          </Link>
        </div>
      </section>

      {/* Career Options Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">Explore Future Career Options</h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs">Detailed roadmaps explaining paths to take after 10th & Intermediate.</p>
          </div>
          <Link href="/careers" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group shrink-0">
            <span>View Career Library</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careers.map((career) => (
            <div key={career.id}>
              <CareerCard career={career} />
            </div>
          ))}
        </div>
      </section>

      {/* Scholarships Section */}
      <section className="py-10 sm:py-16 bg-slate-100/30 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">Available Scholarships</h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs">Directories of financial aid packages, state ePASS grants, and merit benefits.</p>
            </div>
            <Link href="/scholarships" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 group shrink-0">
              <span>View All Scholarships</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scholarships.map((scholarship) => (
              <div key={scholarship.id}>
                <ScholarshipCard scholarship={scholarship} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <HelpCircle className="w-10 h-10 text-indigo-650 dark:text-indigo-400 mx-auto animate-bounce-short" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-display">Frequently Asked Questions</h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs">Answers to common doubts for students planning post-10th courses.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-900 rounded-2xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer transition shadow-sm">
              <summary className="flex justify-between items-center gap-4 text-slate-800 dark:text-slate-200 font-bold text-sm select-none">
                <span>{faq.q}</span>
                <span className="text-slate-400 group-open:rotate-180 transition shrink-0">▼</span>
              </summary>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mt-3 border-t border-slate-200 dark:border-slate-800/60 pt-3 font-normal">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
