import React from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Target, 
  HeartHandshake, 
  GraduationCap, 
  Award, 
  BookOpen, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle,
  School,
  Layers,
  Lightbulb
} from 'lucide-react';

export const metadata = {
  title: 'About Us | Career Compass & Excellence Voices',
  description: 'Learn about Career Compass, co-founded with Excellence Voices by Rahim Shaikh. Discover our aim, mission, and how we empower Class 10 students with transparent educational pathways.',
};

export default function AboutPage() {
  const pillars = [
    {
      icon: Target,
      title: 'Our Aim & Vision',
      desc: 'To eradicate educational confusion and ensure no Class 10 student is left behind due to lack of guidance, social pressure, or financial barriers.',
      accent: 'from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30'
    },
    {
      icon: Users,
      title: 'Excellence Voices',
      desc: 'An inspiring youth initiative championing grassroots student mentoring, motivational workshops, and real-world career clarity across schools.',
      accent: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30'
    },
    {
      icon: HeartHandshake,
      title: 'Zero-Cost Guidance',
      desc: '100% free, unbiased, and student-first advice. We do not sell admissions or promote commercial agendas—our loyalty is solely to the student’s future.',
      accent: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
    }
  ];

  const howWeHelp = [
    {
      icon: BookOpen,
      title: 'Stream & Course Selection',
      desc: 'Comprehensive roadmaps for Intermediate (MPC, BiPC, MEC, CEC, HEC), Polytechnic Diplomas, ITI trades, and Vocational courses tailored to individual strengths.'
    },
    {
      icon: School,
      title: 'College Discovery & Cutoffs',
      desc: 'Verified database of 50+ Government, Residential, and Private Junior Colleges in Hyderabad and Telangana with fee breakdowns, facilities, and contact details.'
    },
    {
      icon: Award,
      title: 'Scholarship & Fee Reimbursement',
      desc: 'Clear, step-by-step navigation for ePASS, TS residential welfare schemes, pre/post-matric scholarships, and minority educational grants.'
    },
    {
      icon: Layers,
      title: 'Entrance Exam Preparedness',
      desc: 'In-depth guidance on POLYCET, TG APRJC CET, Gurukulam, and residential entrance examinations, eligibility rules, and prep strategies.'
    },
    {
      icon: Lightbulb,
      title: '25-Question Diagnostic Survey',
      desc: 'A groundbreaking student survey that pinpoints personal interests, family budget constraints, and post-10th confusions to provide instant college matches.'
    },
    {
      icon: MessageCircle,
      title: 'One-on-One Mentorship',
      desc: 'Direct, compassionate counseling where students and parents can speak directly to mentors to address their deepest fears about life after 10th.'
    }
  ];

  const stats = [
    { value: '54+', label: 'Colleges Profiled' },
    { value: '50+', label: 'Career Roadmaps' },
    { value: '25', label: 'Diagnostic Survey Qs' },
    { value: '100%', label: 'Free for Students' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-24">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Empowering Class 10 Students Across Telangana</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
            Discover Your Path.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Design Your Future.
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Career Compass, powered in collaboration with <strong className="text-slate-200">Excellence Voices</strong>, is dedicated to guiding 10th-grade students through the crucial transition to Intermediate, Polytechnic, and beyond with honesty, transparency, and empathy.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
            {stats.map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">
                  {s.value}
                </p>
                <p className="text-xs text-slate-400 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FOUNDER & LEADERSHIP SPOTLIGHT */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-500/10 to-purple-500/0 rounded-full blur-2xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Founder Avatar & Quick Badges */}
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 shadow-xl">
                  <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center text-center p-4">
                    <Users className="w-16 h-16 text-indigo-400 mb-2" />
                    <span className="text-xs font-bold text-slate-300 tracking-wider uppercase">Leadership</span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Mentor</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Rahim Shaikh</h3>
                <p className="text-sm font-semibold text-indigo-400 mt-0.5">Co-Founder, Excellence Voices</p>
                <p className="text-xs text-slate-400 mt-1">Lead Youth Mentor & Career Strategist</p>
              </div>

              {/* Direct Reachout Buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs pt-2">
                <a
                  href="tel:9284306159"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition active:scale-95 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call: 9284306159</span>
                </a>
                <a
                  href="https://wa.me/919284306159?text=Hello%20Rahim%2C%20I%20am%20reaching%20out%20from%20Career%20Compass%20for%20guidance."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Founder Bio & Excellence Voices Vision */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/60 border border-purple-800/60 px-3 py-1 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Message from the Co-Founder</span>
              </div>

              <blockquote className="text-base sm:text-lg text-slate-200 italic font-medium leading-relaxed border-l-4 border-indigo-500 pl-4 py-1">
                &ldquo;Every year, thousands of talented Class 10 students pick the wrong stream simply because of peer pressure or lack of awareness. At Excellence Voices and Career Compass, our aim is crystal clear: to walk beside every student, break down complex career paths into simple steps, and give them the confidence to build a future they truly love.&rdquo;
              </blockquote>

              <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
                <p>
                  As the co-founder of <strong>Excellence Voices</strong>, <strong>Rahim Shaikh</strong> has been actively involved in youth development, student outreach, and grassroots educational drives. Seeing the confusion students and parents face right after the 10th board exams, he helped shape Career Compass into a practical, localized guidance platform.
                </p>
                <p>
                  Whether a student wants to prepare for government residential colleges, crack POLYCET, explore high-paying IT careers without a conventional degree, or secure 100% fee reimbursement via government scholarships, Rahim and the mentoring team ensure no question goes unanswered.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  <span>Hyderabad, Telangana</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <a href="tel:9284306159" className="hover:text-emerald-300 transition">+91 92843 06159</a>
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <a href="mailto:support@careercompass.com" className="hover:text-indigo-300 transition">support@careercompass.com</a>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* OUR AIM & THREE PILLARS */}
        <div className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              What Is Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Aim?</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              The purpose driving Career Compass and Excellence Voices every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition backdrop-blur-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border bg-gradient-to-br ${p.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{p.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-indigo-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Guaranteed Principle</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HOW WE HELP STUDENTS */}
        <div className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Real Student Impact</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              How We Help <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Students</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              From the day 10th exam ends to your first day in college, we guide you through every choice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howWeHelp.map((h, idx) => {
              const Icon = h.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-indigo-500/40 p-6 space-y-3 transition-all hover:bg-slate-900/70"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition">
                    {h.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {h.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* EXCELLENCE VOICES COLLABORATION BANNER */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-950 border border-indigo-900/50 p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">A Movement for Students</span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Want Excellence Voices to visit your school or community?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              We conduct interactive career orientation workshops, live 25-question student diagnostics, and scholarship awareness seminars for Class 10 batches.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <a
              href="tel:9284306159"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm text-center shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Contact Rahim Shaikh</span>
            </a>
            <Link
              href="/survey"
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm text-center transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Take Diagnostic Survey</span>
            </Link>
          </div>
        </div>

        {/* CALL TO ACTION FOOTPRINT */}
        <div className="text-center space-y-6 pt-4 pb-8">
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Ready to Plan Your Next Step After Class 10?
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Take the 5-minute survey, explore verified colleges in Hyderabad, or speak with our mentors directly.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/survey"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition active:scale-95 cursor-pointer"
            >
              <span>Start 25-Question Survey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/colleges"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition"
            >
              <School className="w-4 h-4 text-purple-400" />
              <span>Explore Colleges</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
