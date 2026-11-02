import React from 'react';
import prisma from '@/lib/prisma';
import AuthRequiredGate from '@/components/AuthRequiredGate';
import { ArrowLeft, Briefcase, Award, TrendingUp, CheckSquare, Compass, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

// SEO Metadata Generator
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const career = await prisma.career.findUnique({
    where: { slug }
  });
  if (!career) return { title: 'Career Not Found' };
  
  return {
    title: `${career.title} Career Roadmap After 10th - Career Compass`,
    description: `Complete guide on how to become a ${career.title} in India. Discover salary ranges, required qualifications, and roadmap details after Class 10 and Intermediate.`,
    keywords: `${career.title} roadmap, career after 10th, how to become ${career.title}`,
  };
}

export async function generateStaticParams() {
  try {
    const careers = await prisma.career.findMany({
      select: { slug: true }
    });
    return careers.map((c) => ({
      slug: c.slug
    }));
  } catch (err) {
    console.error('Error generating static params for careers:', err);
    return [];
  }
}

export default async function CareerDetailPage({ params }) {
  const { slug } = await params;
  const career = await prisma.career.findUnique({
    where: { slug }
  });

  if (!career) {
    return (
      <div className="flex-grow bg-slate-950 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] bg-radial-gradient">
        <ShieldAlert className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-2xl font-bold text-slate-200">Career profile not found</h2>
        <p className="text-slate-500 max-w-sm mt-2 mb-6">The requested career roadmap does not exist in our library databases.</p>
        <Link href="/careers" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition">
          Back to Career Library
        </Link>
      </div>
    );
  }

  // Parse arrays
  const responsibilities = typeof career.responsibilities === 'string'
    ? JSON.parse(career.responsibilities)
    : (career.responsibilities || []);

  const skills = typeof career.skillsRequired === 'string'
    ? JSON.parse(career.skillsRequired)
    : (career.skillsRequired || []);

  const formatSalary = (val) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} Lakhs`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${career.title} Roadmap`,
    "description": career.overview,
    "provider": {
      "@type": "Organization",
      "name": "Career Compass",
      "sameAs": "https://www.careercompass.com"
    }
  };

  return (
    <AuthRequiredGate
      featureName={`${career.title} Career Roadmap`}
      featureDescription={`Sign in or create a free student account to explore the comprehensive roadmap, required qualifications, and salary insights for ${career.title}.`}
      iconName="career"
      redirectPath={`/careers/${slug}`}
    >
      <div className="bg-slate-950 bg-grid-pattern bg-radial-gradient flex-grow py-16 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Back Link */}
        <Link href="/careers" className="inline-flex items-center gap-1 text-slate-400 hover:text-indigo-400 text-xs font-bold transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Career Library</span>
        </Link>

        {/* Header Block */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-md">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                Roadmap Guide
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 font-display leading-tight">{career.title}</h1>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xl">{career.overview}</p>
          </div>

          {/* Salary Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 w-full sm:w-64 space-y-2 shrink-0">
            <span className="text-[10px] text-slate-500 uppercase tracking-wide font-extrabold">Starting Salary scale</span>
            <div className="space-y-1">
              <p className="text-slate-200 font-extrabold text-base">
                {formatSalary(career.salaryRangeMin)} - {formatSalary(career.salaryRangeMax)}
              </p>
              <span className="text-[9px] text-slate-500 block">Annual average scale in India</span>
            </div>
            
            {/* Visual Bar representation */}
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-3/4 rounded-full" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Requirements & Skills */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Qualification */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-slate-100 font-bold text-xs uppercase tracking-wide">Min Qualification</h3>
              <p className="text-slate-300 text-xs leading-relaxed font-semibold">{career.qualificationRequired}</p>
            </div>

            {/* Skills */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-slate-100 font-bold text-xs uppercase tracking-wide">Key Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span key={idx} className="bg-slate-950 text-slate-300 px-2.5 py-1 rounded-md text-[10px] border border-slate-850">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Future Scope */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-slate-100 font-bold text-xs uppercase tracking-wide flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Future Scope</span>
              </h3>
              <p className="text-slate-400 text-[11px] leading-relaxed">{career.futureScope}</p>
            </div>
          </div>

          {/* Right Column: Roadmap Timeline Details */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Responsibilities */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-slate-100 font-bold text-sm flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-400" />
                <span>Key Responsibilities</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                {responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                    <span className="leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline Roads */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <h3 className="text-slate-100 font-bold text-sm flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-400" />
                <span>Educational Milestones Roadmap</span>
              </h3>

              <div className="space-y-6 relative border-l border-slate-800 pl-6 ml-3">
                {/* Milestone 1 */}
                <div className="relative space-y-1 text-left">
                  <span className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-slate-950 border border-indigo-500/40 text-indigo-400 text-xs font-bold flex items-center justify-center">10</span>
                  <h4 className="font-bold text-slate-200 text-sm">Milestones Immediately After Class 10</h4>
                  <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-line bg-slate-950 p-4 rounded-xl border border-slate-800/80 mt-2 font-normal">
                    {career.roadmapAfter10th}
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="relative space-y-1 text-left">
                  <span className="absolute -left-9 top-0.5 w-6 h-6 rounded-full bg-slate-950 border border-indigo-500/40 text-indigo-400 text-xs font-bold flex items-center justify-center">12</span>
                  <h4 className="font-bold text-slate-200 text-sm">Milestones After Intermediate (11th & 12th) / Diploma</h4>
                  <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-line bg-slate-950 p-4 rounded-xl border border-slate-800/80 mt-2 font-normal">
                    {career.roadmapAfterIntermediate}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
      </div>
    </AuthRequiredGate>
  );
}
