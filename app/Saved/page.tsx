'use client';

import React, { useState, useEffect } from 'react';
import { FiCalendar, FiMapPin, FiTrash2, FiEye, FiX, FiBookmark } from 'react-icons/fi';

interface SavedTrip {
    id: string;
    destination: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    itineraryContent: string;
    createdAt: string;
}

export default function SavedTripsPage() {
    const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<SavedTrip | null>(null);

    // 1. Load saved trips on page mount
    useEffect(() => {
        const data = localStorage.getItem('saved_trips');
        if (data) {
            try {
                setSavedTrips(JSON.parse(data));
            } catch (err) {
                console.error("Failed to parse saved trips", err);
            }
        }
    }, []);

    // 2. Handle deleting a saved trip
    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Stop card click
        if (confirm("Are you sure you want to remove this saved trip?")) {
            const updated = savedTrips.filter(trip => trip.id !== id);
            setSavedTrips(updated);
            localStorage.setItem('saved_trips', JSON.stringify(updated));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                            <FiBookmark className="text-emerald-600" /> Saved Itineraries
                        </h1>
                        <p className="text-slate-500 text-xs mt-1">
                            Access your bookmarked AI travel plans anytime.
                        </p>
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-slate-200/60 px-3 py-1.5 rounded-full">
                        {savedTrips.length} Saved
                    </span>
                </div>

                {/* Grid Display */}
                {savedTrips.length === 0 ? (
                    <div className="w-full bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <FiBookmark size={24} />
                        </div>
                        <h3 className="text-base font-bold text-slate-800">No Saved Trips Yet</h3>
                        <p className="text-xs text-slate-400 max-w-sm">
                            Generate an AI travel itinerary on the Trip page and click "Save Itinerary" to pin it here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedTrips.map((trip) => (
                            <div 
                                key={trip.id} 
                                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group"
                            >
                                {/* Destination Image Cover */}
                                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                                    <img 
                                        src={trip.imageUrl} 
                                        alt={trip.destination}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            // Fallback image on load error
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />
                                    
                                    {/* Destination Title on Image */}
                                    <div className="absolute bottom-3 left-4 right-4 text-white">
                                        <h3 className="text-lg font-black truncate capitalize flex items-center gap-1.5">
                                            <FiMapPin className="text-emerald-400 shrink-0" size={16} /> 
                                            {trip.destination}
                                        </h3>
                                    </div>

                                    {/* Delete Button */}
                                    <button 
                                        onClick={(e) => handleDelete(trip.id, e)}
                                        className="absolute top-3 right-3 p-2 bg-slate-900/60 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-colors cursor-pointer"
                                        title="Delete Saved Trip"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>

                                {/* Content Body */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    {/* Date Range Display */}
                                    <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                        <FiCalendar className="text-emerald-600 shrink-0" size={14} />
                                        <span>
                                            {trip.startDate && trip.endDate 
                                                ? `${trip.startDate} — ${trip.endDate}`
                                                : "Dates Not Specified"}
                                        </span>
                                    </div>

                                    {/* Action Button */}
                                    <button 
                                        onClick={() => setSelectedTrip(trip)}
                                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                                    >
                                        <FiEye size={14} />
                                        View Full Itinerary
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 🔍 MODAL: Full Detail Preview Popup */}
                {selectedTrip && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-fadeIn">
                            {/* Modal Header */}
                            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-900 capitalize flex items-center gap-1.5">
                                        <FiMapPin className="text-emerald-600" /> {selectedTrip.destination}
                                    </h2>
                                    <p className="text-[11px] text-slate-400 font-medium">
                                        {selectedTrip.startDate} — {selectedTrip.endDate}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setSelectedTrip(null)}
                                    className="p-2 text-slate-400 hover:text-slate-700 bg-white rounded-full border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>

                            {/* Modal Content Details */}
                            <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-sans">
                                {selectedTrip.itineraryContent || "No itinerary text available."}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                                <button 
                                    onClick={() => setSelectedTrip(null)}
                                    className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}