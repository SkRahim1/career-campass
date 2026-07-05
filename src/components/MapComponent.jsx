import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

export default function MapComponent({ address, name, landmark }) {
  const query = encodeURIComponent(`${name.split(',')[0]}, ${address}`);
  const mapUrl = `https://maps.google.com/maps?q=${query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-slate-850 dark:text-slate-100 font-bold text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Campus Location</span>
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{address}</p>
          {landmark && (
            <p className="text-xs text-indigo-700 dark:text-indigo-300">
              <span className="font-semibold">Nearby Landmark:</span> {landmark}
            </p>
          )}
        </div>
        
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-sm shrink-0 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions</span>
        </a>
      </div>

      {/* Map Iframe */}
      <div className="relative h-64 w-full rounded-xl overflow-hidden border border-slate-150 dark:border-slate-800 shadow-inner">
        {address ? (
          <iframe
            title={`Map for ${name}`}
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            src={mapUrl}
            className="absolute inset-0 grayscale dark:invert dark:opacity-85 contrast-125"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="absolute inset-0 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center text-center p-4">
            <MapPin className="w-12 h-12 text-slate-400 dark:text-slate-700 animate-bounce" />
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Location details unavailable</p>
          </div>
        )}
      </div>
    </div>
  );
}
