'use client';

import React, { useState, ChangeEventHandler, FormEventHandler } from 'react';
import ReactMarkdown from 'react-markdown';
import LocationImage from '../Components/LocationImage';

import { 
    FiMapPin, 
    FiCalendar, 
    FiDollarSign, 
    FiUsers, 
    FiHome, 
    FiCompass, 
    FiHeart,
    FiSend,
    FiInfo
} from 'react-icons/fi';

export default function TripPlanner() {
    // UI Notification States
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiResult, setAiResult] = useState<string | null>(null);

    // State to manage form inputs
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        budget: 'Moderate',
        travelers: 1,
        accommodation: 'Hotel', 
        travelStyle: 'Balanced',
        interests: ''
    });

    // Track staging variable to update the Billboard image preview smoothly
    const [previewDestination, setPreviewDestination] = useState('');

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = () => {
        setPreviewDestination(formData.destination.trim());
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage(null);
        setAiResult(null);

        try {
            const response = await fetch('http://localhost:5000/api/trips', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMessage({ type: 'success', text: data.message });
                if (data.itinerary) {
                    setAiResult(data.itinerary);
                }
                setFormData({
                    destination: '',
                    startDate: '',
                    endDate: '',
                    budget: 'Moderate',
                    travelers: 1,
                    accommodation: 'Hotel',
                    travelStyle: 'Balanced',
                    interests: ''
                });
                setPreviewDestination('');
            } else {
                setStatusMessage({ type: 'error', text: data.error || 'Something went wrong.' });
            }
        } catch (error) {
            console.error('Submission connection failed:', error);
            setStatusMessage({ type: 'error', text: '❌ Failed to connect to the backend server.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 md:px-8 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* 💰 NEW: BUDGET RANGE DECLARATION BANNER (Placed cleanly on top) */}
                <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                            <FiInfo size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Budget Range References</h3>
                            <p className="text-xs text-slate-500">Estimated cost metrics calculated per individual plan basis.</p>
                        </div>
                    </div>
                    
                    {/* Tier Badges Layout Grid */}
                    <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-center sm:text-left">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Low Tier</span>
                            <span className="text-xs font-bold text-slate-700">RM 1,000 - 2,000</span>
                        </div>
                        <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-xl px-4 py-2 text-center sm:text-left">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600">Standard</span>
                            <span className="text-xs font-bold text-emerald-700">RM 2,500 - 3,500</span>
                        </div>
                        <div className="bg-amber-50/40 border border-amber-100/60 rounded-xl px-4 py-2 text-center sm:text-left">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-600">High Tier</span>
                            <span className="text-xs font-bold text-amber-700">Above RM 4,000</span>
                        </div>
                    </div>
                </div>

                {/* 🎛️ SIDE-BY-SIDE SPLIT GRID WINDOW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                    
                    {/* LEFT COLUMN: Input Parameters Form Container */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between">
                        {/* Header Section */}
                        <div className="bg-emerald-50/50 p-6 border-b border-emerald-100">
                            <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Design Your AI Itinerary</h1>
                            <p className="text-slate-600 text-sm">Tell us about your dream trip, and our AI will craft the perfect daily schedule for you.</p>
                        </div>

                        {/* Status Banners */}
                        {statusMessage && (
                            <div className={`p-4 mx-6 mt-4 rounded-xl border text-sm font-semibold text-center ${
                                statusMessage.type === 'success' 
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                    : 'bg-rose-50 border-rose-200 text-rose-800'
                            }`}>
                                {statusMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                            <div className="space-y-6">
                                {/* Row 1: Destination & Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <FiMapPin className="text-emerald-600" /> Destination
                                        </label>
                                        <input 
                                            type="text" 
                                            name="destination"
                                            value={formData.destination}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="e.g., Penang, Malaysia" 
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <FiCalendar className="text-emerald-600" /> Start Date
                                            </label>
                                            <input 
                                                type="date" 
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                                <FiCalendar className="text-slate-400" /> End Date
                                            </label>
                                            <input 
                                                type="date" 
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Budget, Travelers, Accommodation */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <FiDollarSign className="text-emerald-600" /> Budget
                                        </label>
                                        <select 
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer text-sm"
                                        >
                                            <option value="Backpacker">Backpacker (Low Tier)</option>
                                            <option value="Moderate">Moderate (Standard)</option>
                                            <option value="Luxury">Luxury (High Tier)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <FiUsers className="text-emerald-600" /> Travelers
                                        </label>
                                        <input 
                                            type="number" 
                                            name="travelers"
                                            min="1"
                                            value={formData.travelers}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <FiHome className="text-emerald-600" /> Accommodation
                                        </label>
                                        <select 
                                            name="accommodation"
                                            value={formData.accommodation}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer text-sm"
                                        >
                                            <option value="Hotel">Hotel</option>
                                            <option value="Hostel">Hostel</option>
                                            <option value="Airbnb">Airbnb / Rental</option>
                                            <option value="Resort">Resort</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Row 3: Travel Style & Interests */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <FiCompass className="text-emerald-600" /> Travel Style
                                        </label>
                                        <select 
                                            name="travelStyle"
                                            value={formData.travelStyle}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer text-sm"
                                        >
                                            <option value="Relaxing">Relaxing (Slow-paced)</option>
                                            <option value="Balanced">Balanced</option>
                                            <option value="Action-Packed">Action-Packed (Fast-paced)</option>
                                            <option value="Cultural">Cultural Immersion</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <FiHeart className="text-emerald-600" /> Main Interests
                                        </label>
                                        <input 
                                            type="text" 
                                            name="interests"
                                            value={formData.interests}
                                            onChange={handleChange}
                                            placeholder="e.g., Food, Museums, Hiking, Nightlife" 
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button Row */}
                            <div className="pt-6 border-t border-slate-100 flex justify-end mt-6">
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer disabled:cursor-not-allowed text-sm"
                                >
                                    <FiSend size={16} />
                                    {isSubmitting ? 'Generating Schedule...' : 'Generate Itinerary'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: Interactive Live Destination BillboardSidebar Container */}
                    <div className="lg:col-span-1 min-h-75 lg:min-h-full">
                        {previewDestination ? (
                            <LocationImage query={previewDestination} />
                        ) : (
                            <div className="w-full h-full border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-6 text-center bg-white min-h-87.5">
                                <FiMapPin size={32} className="text-slate-300 mb-2" />
                                <p className="text-sm font-semibold text-slate-500">No Destination Set</p>
                                <p className="text-xs text-slate-400 mt-1 max-w-50">Type a target destination and tap outside the field to preview live imagery.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 🤖 AI Output Display Box */}
                {aiResult && (
                    <div className="bg-slate-900 text-slate-100 rounded-3xl shadow-xl border border-slate-800 p-8">
                        <div className="border-b border-slate-800 pb-4 mb-6">
                            <h2 className="text-3xl font-extrabold text-emerald-400 tracking-tight">
                                ✨ Your Itinerary Results
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">Custom-crafted schedule with active Unsplash photography streams.</p>
                        </div>
                        
                        <div className="prose prose-invert max-w-none font-sans text-sm text-slate-300 bg-slate-950 p-6 rounded-2xl border border-slate-800/60">
                            <ReactMarkdown
                                components={{
                                    p: ({ node, children }) => {
                                        const content = String(children);
                                        const tokenRegex = /\[Image Search:\s*([^\]]+)\]/;
                                        const match = content.match(tokenRegex);

                                        if (match) {
                                            const searchQuery = match[1].trim();
                                            const cleanTextContent = content.replace(tokenRegex, '').trim();

                                            return (
                                                <div className="my-6 transition-all">
                                                    {cleanTextContent && (
                                                        <p className="mb-3 leading-relaxed text-slate-300">{cleanTextContent}</p>
                                                    )}
                                                    <div className="max-w-2xl">
                                                        <LocationImage query={searchQuery} />
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return <p className="mb-4 leading-relaxed text-slate-300">{children}</p>;
                                    }
                                }}
                            >
                                {aiResult}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}