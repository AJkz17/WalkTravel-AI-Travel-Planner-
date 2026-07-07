'use client';

import React, { useState, useEffect, useRef, ChangeEventHandler, FormEventHandler } from 'react';
import ReactMarkdown from 'react-markdown';
import LocationImage from '../Components/LocationImage';
import CurrencyConverter from '../Components/Currency';
import MapPreview from '../Components/MapPreview';


import { 
    FiMapPin, 
    FiCalendar, 
    FiDollarSign, 
    FiUsers, 
    FiHome, 
    FiCompass, 
    FiHeart,
    FiSend,
    FiChevronDown
} from 'react-icons/fi';

// 🟩 1. CREATE AN ISOLATED SHELL OUTSIDE THE MAIN COMPONENT BODY
// This isolates state boundaries naturally without requiring React.memo or child props configurations
const IsolatedMapSection = () => {
    const MapPreviewElement = MapPreview;
    return <MapPreviewElement />;
};

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

    // 🎛️ Custom Dropdowns Independent Open/Close States
    const [activeDropdown, setActiveDropdown] = useState<'budget' | 'accommodation' | 'travelStyle' | null>(null);
    
    // Core Layout References to intercept external clicks
    const formRef = useRef<HTMLFormElement>(null);
    const [previewDestination, setPreviewDestination] = useState('');

    // Mapping Labels for readable trigger buttons text
    const budgetLabels: Record<string, string> = {
        Backpacker: 'Backpacker (Low Tier)',
        Moderate: 'Moderate (Standard)',
        Luxury: 'Luxury (High Tier)'
    };

    const accommodationLabels: Record<string, string> = {
        Hotel: 'Hotel',
        Hostel: 'Hostel',
        Airbnb: 'Airbnb / Rental',
        Resort: 'Resort'
    };

    const travelStyleLabels: Record<string, string> = {
        Relaxing: 'Relaxing (Slow-paced)',
        Balanced: 'Balanced',
        'Action-Packed': 'Action-Packed (Fast-paced)',
        Cultural: 'Cultural Immersion'
    };

    // Close open dropdowns globally if clicking outside the form area
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCustomSelect = (field: 'budget' | 'accommodation' | 'travelStyle', value: string) => {
        setFormData({ ...formData, [field]: value });
        setActiveDropdown(null); // Auto-collapse list instantly upon item selection
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
            <div className="max-w-7xl mx-auto space-y-6 overflow-visible">
                
                {/* 💱 INTEGRATED CURRENCY CONVERTER & BUDGET REFERENCE */}
                <CurrencyConverter />

                {/* 🎛️ SIDE-BY-SIDE SPLIT GRID WINDOW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch overflow-visible">
                    
                    {/* LEFT COLUMN: Input Parameters Form Container */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-visible flex flex-col justify-between">
                        {/* Header Section */}
                        <div className="bg-emerald-50/50 p-6 border-b border-emerald-100 rounded-t-3xl">
                            <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Design Your AI Itinerary</h1>
                            <p className="text-slate-600 text-sm">Tell us about your dream trip, and our AI will craft the perfect daily schedule for you.</p>
                        </div>

                        {statusMessage && (
                            <div className={`p-4 mx-6 mt-4 rounded-xl border text-sm font-semibold text-center ${
                                statusMessage.type === 'success' 
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                    : 'bg-rose-50 border-rose-200 text-rose-800'
                            }`}>
                                {statusMessage.text}
                            </div>
                        )}

                        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 flex flex-col justify-between overflow-visible">
                            <div className="space-y-6 overflow-visible">
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-visible">
                                    {/* Custom Dropdown 1: Budget */}
                                    <div className="space-y-2 relative overflow-visible">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <FiDollarSign className="text-emerald-600" /> Budget
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setActiveDropdown(activeDropdown === 'budget' ? null : 'budget')}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700 transition-all text-left cursor-pointer"
                                        >
                                            <span>{budgetLabels[formData.budget]}</span>
                                            <FiChevronDown className={`text-slate-400 transition-transform ${activeDropdown === 'budget' ? 'rotate-180 text-emerald-600' : ''}`} size={16} />
                                        </button>
                                        {activeDropdown === 'budget' && (
                                            <ul className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                                                {Object.keys(budgetLabels).map((key) => (
                                                    <li key={key}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCustomSelect('budget', key)}
                                                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                                                                formData.budget === key ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                                                            }`}
                                                        >
                                                            {budgetLabels[key]}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
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

                                    {/* Custom Dropdown 2: Accommodation */}
                                    <div className="space-y-2 relative overflow-visible">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <FiHome className="text-emerald-600" /> Accommodation
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setActiveDropdown(activeDropdown === 'accommodation' ? null : 'accommodation')}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700 transition-all text-left cursor-pointer"
                                        >
                                            <span>{accommodationLabels[formData.accommodation]}</span>
                                            <FiChevronDown className={`text-slate-400 transition-transform ${activeDropdown === 'accommodation' ? 'rotate-180 text-emerald-600' : ''}`} size={16} />
                                        </button>
                                        {activeDropdown === 'accommodation' && (
                                            <ul className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                                                {Object.keys(accommodationLabels).map((key) => (
                                                    <li key={key}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCustomSelect('accommodation', key)}
                                                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                                                                formData.accommodation === key ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                                                            }`}
                                                        >
                                                            {accommodationLabels[key]}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                {/* Row 3: Travel Style & Interests */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-visible">
                                    {/* Custom Dropdown 3: Travel Style */}
                                    <div className="space-y-2 relative overflow-visible">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <FiCompass className="text-emerald-600" /> Travel Style
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setActiveDropdown(activeDropdown === 'travelStyle' ? null : 'travelStyle')}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-700 transition-all text-left cursor-pointer"
                                        >
                                            <span>{travelStyleLabels[formData.travelStyle]}</span>
                                            <FiChevronDown className={`text-slate-400 transition-transform ${activeDropdown === 'travelStyle' ? 'rotate-180 text-emerald-600' : ''}`} size={16} />
                                        </button>
                                        {activeDropdown === 'travelStyle' && (
                                            <ul className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                                                {Object.keys(travelStyleLabels).map((key) => (
                                                    <li key={key}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCustomSelect('travelStyle', key)}
                                                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                                                                formData.travelStyle === key ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                                                            }`}
                                                        >
                                                            {travelStyleLabels[key]}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <FiHeart className="text-emerald-600" /> Main Interests
                                        </label>
                                        <input type="text" name="interests" value={formData.interests} onChange={handleChange} placeholder="e.g., Food, Museums, Hiking, Nightlife" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end mt-6">
                                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer disabled:cursor-not-allowed text-sm">
                                    <FiSend size={16} />
                                    {isSubmitting ? 'Generating Schedule...' : 'Generate Itinerary'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT COLUMN: Billboard Sidebar Container */}
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

                {/* 🗺️ ✨ PERSISTENT ISOLATED FULL-WIDTH MAP PREVIEW CONTAINER */}
                {/* 2. Swapped directly to standard div rendering using the shell wrapper inside a standard container row */}
                <div className="w-full">
                    <IsolatedMapSection />
                </div>

                {/* 🤖 AI Output Display Box */}
                {aiResult && (
                    <div className="bg-slate-900 text-slate-100 rounded-3xl shadow-xl border border-slate-800 p-8 mt-6">
                        <div className="border-b border-slate-800 pb-4 mb-6">
                            <h2 className="text-3xl font-extrabold text-emerald-400 tracking-tight font-sans">✨ Your Itinerary Results</h2>
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
                                                    {cleanTextContent && <p className="mb-3 leading-relaxed text-slate-300">{cleanTextContent}</p>}
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