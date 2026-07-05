'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, CheckSquare, PlusCircle, Bell, UserX, BarChart3, Star, Landmark, Trash2, Heart, Megaphone, Send, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');

  // Metrics state
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Updates state
  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);

  // Publish Update Form state
  const [updateForm, setUpdateForm] = useState({
    title: '',
    category: 'INTERMEDIATE',
    content: '',
    isPinned: false
  });
  const [updateMsg, setUpdateMsg] = useState('');

  // Add College Form state
  const [collegeForm, setCollegeForm] = useState({
    name: '',
    ownership: 'PRIVATE',
    category: 'JUNIOR_COLLEGE',
    establishedYear: '',
    description: '',
    address: '',
    nearbyLandmark: '',
    phone: '',
    email: '',
    website: '',
    genderType: 'CO_ED',
    hasHostel: false,
    hasTransport: false,
    hasLibrary: false,
    hasLabs: false,
    hasSports: false,
    hasPlayground: false,
    hasWifi: false,
    hasSmartClassroom: false,
    hasCctv: false,
    hasComputerLabs: false,
    hasCafeteria: false
  });
  const [streamsList, setStreamsList] = useState([
    { streamName: 'MPC', annualFee: '35000', minQualification: '10th Class', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: '' }
  ]);
  const [collegeMsg, setCollegeMsg] = useState('');

  useEffect(() => {
    if (user && user.role === 'SUPER_ADMIN') {
      fetchMetrics();
      fetchReviews();
      fetchUpdates();
    }
  }, [user]);

  const fetchMetrics = async () => {
    setMetricsLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMetricsLoading(false);
    }
  };

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchUpdates = async () => {
    setUpdatesLoading(true);
    try {
      const res = await fetch('/api/admission-updates');
      if (res.ok) {
        const data = await res.json();
        setUpdates(data.updates || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatesLoading(false);
    }
  };

  // Moderation Handlers
  const handleApproveReview = async (reviewId) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, isApproved: true })
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isApproved: true } : r));
        fetchMetrics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews?reviewId=${reviewId}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        fetchMetrics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Publish Update Handlers
  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePublishUpdate = async (e) => {
    e.preventDefault();
    setUpdateMsg('');
    try {
      const res = await fetch('/api/admission-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateForm)
      });
      const data = await res.json();
      if (res.ok) {
        setUpdateMsg('Admission update published successfully!');
        setUpdateForm({ title: '', category: 'INTERMEDIATE', content: '', isPinned: false });
        fetchUpdates();
      } else {
        setUpdateMsg(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUpdate = async (updateId) => {
    if (!confirm('Are you sure you want to delete this update?')) return;
    try {
      const res = await fetch(`/api/admission-updates?id=${updateId}`, { method: 'DELETE' });
      if (res.ok) {
        setUpdates(prev => prev.filter(u => u.id !== updateId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add College Handlers
  const handleCollegeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCollegeForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStreamChange = (index, field, value) => {
    setStreamsList(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addStreamField = () => {
    setStreamsList(prev => [
      ...prev,
      { streamName: 'MPC', annualFee: '35000', minQualification: '10th Class', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: '' }
    ]);
  };

  const removeStreamField = (index) => {
    if (streamsList.length <= 1) return;
    setStreamsList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    setCollegeMsg('');
    try {
      const payload = {
        ...collegeForm,
        streams: streamsList,
        gallery: [
          { imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80' }
        ]
      };
      
      const res = await fetch('/api/colleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setCollegeMsg('College profile created successfully!');
        setCollegeForm({
          name: '', ownership: 'PRIVATE', category: 'JUNIOR_COLLEGE', establishedYear: '',
          description: '', address: '', nearbyLandmark: '', phone: '', email: '', website: '',
          genderType: 'CO_ED', hasHostel: false, hasTransport: false, hasLibrary: false,
          hasLabs: false, hasSports: false, hasPlayground: false, hasWifi: false,
          hasSmartClassroom: false, hasCctv: false, hasComputerLabs: false, hasCafeteria: false
        });
        setStreamsList([{ streamName: 'MPC', annualFee: '35000', minQualification: '10th Class', requiredMarks: 'Pass', admissionType: 'DIRECT', reservationInfo: '' }]);
        fetchMetrics();
      } else {
        setCollegeMsg(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-slate-950 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex-grow bg-slate-950 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] bg-radial-gradient">
        <UserX className="w-16 h-16 text-slate-700 mb-4" />
        <h2 className="text-2xl font-bold text-slate-200">Access Denied</h2>
        <p className="text-slate-500 max-w-sm mt-2 mb-6">You do not have the credentials to view the administrator controls panel.</p>
        <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition">
          Log In as Admin
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'analytics', label: 'Dashboard Stats', icon: BarChart3 },
    { id: 'reviews', label: 'Review Moderation', icon: CheckSquare },
    { id: 'updates', label: 'Admission updates', icon: Bell },
    { id: 'add-college', label: 'Add New College', icon: PlusCircle }
  ];

  return (
    <div className="bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10 bg-radial-gradient bg-grid-pattern flex-grow text-left">
      
      {/* Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-extrabold text-slate-100 font-display">Super Admin Dashboard</h1>
        </div>
        <p className="text-slate-400 text-sm">
          Publish admission announcements, moderate student reviews, review analytical metrics, and expand directories.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-900 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/10'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Control Tab Panels */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md">
        
        {/* Tab 1: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-4">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <span>Application KPIs</span>
            </h2>

            {metricsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : !metrics ? (
              <p className="text-slate-500 text-xs">Error loading metrics data.</p>
            ) : (
              <div className="space-y-8">
                {/* Visual Counters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-slate-950 border border-slate-805 rounded-2xl p-6 text-center space-y-2">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide">Colleges Listed</span>
                    <p className="text-slate-200 text-3xl font-extrabold">{metrics.totalColleges}</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 text-center space-y-2">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide">Registered Students</span>
                    <p className="text-slate-200 text-3xl font-extrabold">{metrics.totalStudents}</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-850 rounded-2xl p-6 text-center space-y-2">
                    <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wide">Total Reviews</span>
                    <p className="text-slate-200 text-3xl font-extrabold">{metrics.totalReviews}</p>
                  </div>
                </div>

                {/* Popular lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  {/* Saved Ranking */}
                  <div className="space-y-4">
                    <h3 className="text-slate-100 font-bold text-sm flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-400 fill-current" />
                      <span>Most Bookmarked Colleges</span>
                    </h3>
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 divide-y divide-slate-900/60">
                      {metrics.mostSavedColleges.length === 0 ? (
                        <p className="text-slate-500 text-xs py-4 text-center">No bookmarks recorded yet.</p>
                      ) : (
                        metrics.mostSavedColleges.map((c, idx) => (
                          <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-300">{c.name}</span>
                            <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-bold">{c.count} saves</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Rating ranking */}
                  <div className="space-y-4">
                    <h3 className="text-slate-100 font-bold text-sm flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>Highest Rated Colleges</span>
                    </h3>
                    <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 divide-y divide-slate-900/60">
                      {metrics.topRatedColleges.length === 0 ? (
                        <p className="text-slate-500 text-xs py-4 text-center">No ratings approved yet.</p>
                      ) : (
                        metrics.topRatedColleges.map((c, idx) => (
                          <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-300">{c.name}</span>
                            <div className="flex items-center gap-1.5 font-bold text-yellow-400">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>{c.rating}</span>
                              <span className="text-slate-500 text-[10px] font-normal">({c.reviewsCount} reviews)</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reviews Moderation */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-4">
              <CheckSquare className="w-5 h-5 text-purple-400" />
              <span>Reviews Queue & Moderation</span>
            </h2>

            {reviewsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-slate-500 text-xs py-8 text-center">No student reviews written in the system yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-850">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                      <th className="p-4">Student</th>
                      <th className="p-4">College</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Comment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {reviews.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-950/20 transition">
                        <td className="p-4">
                          <p className="font-bold text-slate-200">{r.user?.name}</p>
                          <p className="text-[10px] text-slate-500">{r.user?.email}</p>
                        </td>
                        <td className="p-4 font-semibold text-slate-300">{r.college?.name}</td>
                        <td className="p-4 font-bold text-yellow-400 flex items-center gap-0.5 mt-1.5">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{r.rating}</span>
                        </td>
                        <td className="p-4 text-slate-400 max-w-xs truncate" title={r.reviewText}>
                          {r.reviewText}
                        </td>
                        <td className="p-4 font-bold">
                          {r.isApproved ? (
                            <span className="text-emerald-400">Approved</span>
                          ) : (
                            <span className="text-orange-400">Pending</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-center">
                            {!r.isApproved && (
                              <button
                                onClick={() => handleApproveReview(r.id)}
                                className="bg-emerald-600/25 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-emerald-500/20 text-[10px] font-bold transition cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReview(r.id)}
                              className="text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 p-1.5 rounded-lg border border-red-500/20 transition cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Admission Updates News */}
        {activeTab === 'updates' && (
          <div className="space-y-8">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-4">
              <Bell className="w-5 h-5 text-purple-400" />
              <span>Publish Admission update</span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Form */}
              <form onSubmit={handlePublishUpdate} className="lg:col-span-1 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Megaphone className="w-4 h-4 text-purple-400" />
                  <span>Create Announcement</span>
                </h3>
                {updateMsg && (
                  <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs p-2.5 rounded-xl">
                    {updateMsg}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Announcement Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={updateForm.title}
                    onChange={handleUpdateChange}
                    placeholder="e.g. TS POLYCET 2026 Registration"
                    className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Category</label>
                  <select
                    name="category"
                    value={updateForm.category}
                    onChange={handleUpdateChange}
                    className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none text-xs"
                  >
                    <option value="INTERMEDIATE">Intermediate (11th/12th)</option>
                    <option value="POLYTECHNIC">Polytechnic (Diploma)</option>
                    <option value="ITI">ITI Trades</option>
                    <option value="SCHOLARSHIP">Scholarships</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Content Body</label>
                  <textarea
                    name="content"
                    rows="4"
                    required
                    value={updateForm.content}
                    onChange={handleUpdateChange}
                    placeholder="Write details of the circular announcement..."
                    className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPinned"
                    name="isPinned"
                    checked={updateForm.isPinned}
                    onChange={handleUpdateChange}
                    className="w-3.5 h-3.5 bg-slate-900 border-slate-800 rounded text-indigo-600 focus:ring-0"
                  />
                  <label htmlFor="isPinned" className="text-xs text-slate-400 cursor-pointer select-none">Pin notification to top</label>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Alert</span>
                </button>
              </form>

              {/* Feed manager list */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Manage Published Updates</h3>
                {updatesLoading ? (
                  <div className="flex justify-center items-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  </div>
                ) : updates.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-8">No announcements published.</p>
                ) : (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 divide-y divide-slate-900/60 max-h-96 overflow-y-auto">
                    {updates.map((u) => (
                      <div key={u.id} className="py-3 flex justify-between items-start gap-4 text-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-200 flex items-center gap-1.5">
                            <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-medium">{u.category}</span>
                            {u.isPinned && <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1 py-0.5 rounded font-bold">Pinned</span>}
                            <span>{u.title}</span>
                          </p>
                          <p className="text-slate-500 text-[10px] line-clamp-1">{u.content}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteUpdate(u.id)}
                          className="text-slate-500 hover:text-red-400 p-1 rounded transition cursor-pointer shrink-0"
                          title="Delete announcement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Add New College Profile */}
        {activeTab === 'add-college' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-4">
              <PlusCircle className="w-5 h-5 text-purple-400" />
              <span>Create College Profile</span>
            </h2>

            <form onSubmit={handleCreateCollege} className="space-y-8">
              {collegeMsg && (
                <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs p-3 rounded-xl max-w-xl">
                  {collegeMsg}
                </div>
              )}

              {/* 1. Basic specifications */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">1. Basic Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">College Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={collegeForm.name}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Methodist Junior College"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Ownership</label>
                    <select
                      name="ownership"
                      value={collegeForm.ownership}
                      onChange={handleCollegeChange}
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                    >
                      <option value="GOVERNMENT">Government Only</option>
                      <option value="PRIVATE">Private Only</option>
                      <option value="AIDED">Aided</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Course Category</label>
                    <select
                      name="category"
                      value={collegeForm.category}
                      onChange={handleCollegeChange}
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                    >
                      <option value="JUNIOR_COLLEGE">Junior College (11th & 12th)</option>
                      <option value="POLYTECHNIC">Polytechnic Diploma</option>
                      <option value="ITI">ITI Trade College</option>
                      <option value="DIPLOMA">Diploma</option>
                      <option value="VOCATIONAL">Vocational</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Established Year</label>
                    <input
                      type="number"
                      name="establishedYear"
                      value={collegeForm.establishedYear}
                      onChange={handleCollegeChange}
                      placeholder="e.g. 1995"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Gender Demographics</label>
                    <select
                      name="genderType"
                      value={collegeForm.genderType}
                      onChange={handleCollegeChange}
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                    >
                      <option value="CO_ED">Co-Education</option>
                      <option value="BOYS">Boys Only</option>
                      <option value="GIRLS">Girls Only</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-slate-300">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    required
                    value={collegeForm.description}
                    onChange={handleCollegeChange}
                    placeholder="Provide a brief historical and academic description of the institution..."
                    className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>

              {/* 2. Contact and Location specifications */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">2. Contact & Address Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={collegeForm.address}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Abids, Hyderabad, TS 500001"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Nearby Landmark</label>
                    <input
                      type="text"
                      name="nearbyLandmark"
                      value={collegeForm.nearbyLandmark}
                      onChange={handleCollegeChange}
                      placeholder="e.g. Near GPO"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Contact Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={collegeForm.phone}
                      onChange={handleCollegeChange}
                      placeholder="e.g. 040-12345678"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Contact Email</label>
                    <input
                      type="email"
                      name="email"
                      value={collegeForm.email}
                      onChange={handleCollegeChange}
                      placeholder="e.g. info@college.com"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Website URL</label>
                    <input
                      type="url"
                      name="website"
                      value={collegeForm.website}
                      onChange={handleCollegeChange}
                      placeholder="e.g. https://www.college.com"
                      className="block w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Facilities flags */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-850 pb-2">3. Facilities Checkmarks</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300 bg-slate-950 p-5 rounded-2xl border border-slate-850">
                  {[
                    { key: 'hasHostel', label: 'Hostel' },
                    { key: 'hasTransport', label: 'Transport Bus' },
                    { key: 'hasLibrary', label: 'Library' },
                    { key: 'hasLabs', label: 'Labs' },
                    { key: 'hasSports', label: 'Sports' },
                    { key: 'hasPlayground', label: 'Playground' },
                    { key: 'hasWifi', label: 'Wi-Fi' },
                    { key: 'hasSmartClassroom', label: 'Smart Classrooms' },
                    { key: 'hasCctv', label: 'CCTV' },
                    { key: 'hasComputerLabs', label: 'Computer Labs' },
                    { key: 'hasCafeteria', label: 'Cafeteria Canteen' },
                  ].map((fac) => (
                    <div key={fac.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`form-${fac.key}`}
                        name={fac.key}
                        checked={collegeForm[fac.key]}
                        onChange={handleCollegeChange}
                        className="w-3.5 h-3.5 bg-slate-900 border-slate-800 rounded text-purple-600 focus:ring-0"
                      />
                      <label htmlFor={`form-${fac.key}`} className="select-none cursor-pointer">{fac.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Stream sub-form */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">4. Stream Fee configurations</h3>
                  <button
                    type="button"
                    onClick={addStreamField}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1 rounded-lg text-[10px] transition cursor-pointer"
                  >
                    + Add Stream
                  </button>
                </div>

                <div className="space-y-4">
                  {streamsList.map((s, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 relative">
                      {streamsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStreamField(idx)}
                          className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition cursor-pointer text-xs"
                        >
                          Remove
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-400">Stream Name</label>
                          <select
                            value={s.streamName}
                            onChange={(e) => handleStreamChange(idx, 'streamName', e.target.value)}
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                          >
                            <option value="MPC">MPC</option>
                            <option value="BiPC">BiPC</option>
                            <option value="MEC">MEC</option>
                            <option value="CEC">CEC</option>
                            <option value="HEC">HEC</option>
                            <option value="Polytechnic">Polytechnic</option>
                            <option value="ITI">ITI</option>
                            <option value="Vocational">Vocational</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-400">Annual Fee (₹)</label>
                          <input
                            type="number"
                            required
                            value={s.annualFee}
                            onChange={(e) => handleStreamChange(idx, 'annualFee', e.target.value)}
                            placeholder="e.g. 35000"
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-400">Admission Mode</label>
                          <select
                            value={s.admissionType}
                            onChange={(e) => handleStreamChange(idx, 'admissionType', e.target.value)}
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                          >
                            <option value="DIRECT">Direct Admission</option>
                            <option value="MERIT_BASED">Merit Based Selection</option>
                            <option value="COUNSELLING">Central Counselling</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-slate-400">Required Marks</label>
                          <input
                            type="text"
                            value={s.requiredMarks}
                            onChange={(e) => handleStreamChange(idx, 'requiredMarks', e.target.value)}
                            placeholder="e.g. Pass or 75% GPA"
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="font-semibold text-slate-400">Reservation / Quota Info</label>
                          <input
                            type="text"
                            value={s.reservationInfo}
                            onChange={(e) => handleStreamChange(idx, 'reservationInfo', e.target.value)}
                            placeholder="e.g. Standard State quotas apply"
                            className="block w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl text-xs shadow-md transition cursor-pointer"
              >
                Create College Profile
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
