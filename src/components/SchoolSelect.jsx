'use client';

import React, { useState, useEffect } from 'react';
import { School, ChevronDown, PlusCircle } from 'lucide-react';
import { getSchoolsList } from '@/lib/schoolsService';

export default function SchoolSelect({
  value = '',
  onChange,
  required = false,
  id = 'schoolSelect',
  name = 'schoolName',
  placeholder = '-- Select Your School --',
  className = ''
}) {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');
  const [customSchool, setCustomSchool] = useState('');
  const [isOther, setIsOther] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadSchools() {
      try {
        const list = await getSchoolsList(false);
        if (isMounted) {
          setSchools(list);
        }
      } catch (err) {
        console.error('Failed to load schools for dropdown:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadSchools();
    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronize internal state when external value changes or schools load
  useEffect(() => {
    if (!value) {
      setSelectedOption('');
      setCustomSchool('');
      setIsOther(false);
      return;
    }

    if (schools.length > 0) {
      const match = schools.find(
        (s) => s.name.trim().toLowerCase() === value.trim().toLowerCase()
      );
      if (match) {
        setSelectedOption(match.name);
        setIsOther(false);
        setCustomSchool('');
      } else {
        setSelectedOption('OTHER');
        setIsOther(true);
        setCustomSchool(value);
      }
    } else {
      // Prior to schools loading
      setCustomSchool(value);
    }
  }, [value, schools]);

  const handleSelectChange = (e) => {
    const val = e.target.value;
    setSelectedOption(val);

    if (val === 'OTHER') {
      setIsOther(true);
      if (onChange) onChange(customSchool || '');
    } else {
      setIsOther(false);
      if (onChange) onChange(val);
    }
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomSchool(val);
    if (onChange) onChange(val);
  };

  return (
    <div className={`space-y-2 text-left ${className}`}>
      <div className="relative">
        <select
          id={id}
          name={name}
          required={required && !isOther}
          value={selectedOption}
          onChange={handleSelectChange}
          disabled={loading}
          className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm transition appearance-none cursor-pointer disabled:opacity-50"
        >
          <option value="" className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            {loading ? 'Loading schools list...' : placeholder}
          </option>
          
          {schools.map((school) => (
            <option key={school.id || school.name} value={school.name} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
              {school.name} {school.district ? `(${school.district})` : ''}
            </option>
          ))}

          <option value="OTHER" className="bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-semibold">
            + Other (My school is not listed)
          </option>
        </select>

        {/* Left School Icon */}
        <div className="absolute left-3.5 top-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
          <School className="w-4 h-4" />
        </div>

        {/* Right Arrow */}
        <div className="absolute right-3.5 top-3.5 pointer-events-none text-slate-400 dark:text-slate-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* If "Other" selected, allow custom typing */}
      {isOther && (
        <div className="animate-fadeIn relative pt-1">
          <div className="relative">
            <input
              type="text"
              required={required}
              placeholder="Please type your School Name"
              value={customSchool}
              onChange={handleCustomChange}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-indigo-500/50 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs sm:text-sm transition"
            />
            <PlusCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 absolute left-3.5 top-3" />
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400/80 mt-1 pl-1">
            Specify your school name so our mentors can recognize your school during counselling.
          </p>
        </div>
      )}
    </div>
  );
}
