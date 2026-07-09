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
    FiChevronDown,
    FiBookmark,
    FiCheck
} from 'react-icons/fi';

// Isolated shell for rendering map preview safely
const IsolatedMapSection = () => {
    const MapPreviewElement = MapPreview;
    return <MapPreviewElement />;
};

export default function TripPlanner() {
    // UI Notification States
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiResult, setAiResult] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [extractedImageQuery, setExtractedImageQuery] = useState<string | null>(null);

    // Track active trip form values for saving metadata
    const [savedTripDetails, setSavedTripDetails] = useState<{ destination: string; startDate: string; endDate: string } | null>(null);

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

    // Custom Dropdowns States
    const [activeDropdown, setActiveDropdown] = useState<'budget' | 'accommodation' | 'travelStyle' | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [previewDestination, setPreviewDestination] = useState('');

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
        setActiveDropdown(null);
    };

    const handleBlur = () => {
        setPreviewDestination(formData.destination.trim());
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage(null);
        setAiResult(null);
        setIsSaved(false);
        setExtractedImageQuery(null);

        const currentMeta = {
            destination: formData.destination.trim(),
            startDate: formData.startDate,
            endDate: formData.endDate
        };

        try {
            const response = await fetch('http://localhost:5000/api/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMessage({ type: 'success', text: data.message });
                if (data.itinerary) {
                    const rawItinerary = data.itinerary;
                    setAiResult(rawItinerary);
                    setSavedTripDetails(currentMeta);

                    // 🖼️ Extract first image search query for the top hero cover
                    const match = rawItinerary.match(/\[Image Search:\s*([^\]]+)\]/i);
                    if (match && match[1]) {
                        setExtractedImageQuery(match[1].trim());
                    } else {
                        setExtractedImageQuery(currentMeta.destination);
                    }
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

    // 💾 CLEAN SAVE FUNCTION (Completely strips out [Image Search: ...] tags before saving)
    const handleSaveItinerary = () => {
        if (!aiResult || !savedTripDetails) return;

        // 🧹 Strips all [Image Search: ...] strings & cleans spacing
        const cleanItineraryText = aiResult
            .replace(/\[Image Search:\s*[^\]]+\]/gi, '')
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .trim();

        const newTrip = {
            id: Date.now().toString(),
            destination: savedTripDetails.destination,
            startDate: savedTripDetails.startDate,
            endDate: savedTripDetails.endDate,
            imageUrl: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80`,
            itineraryContent: cleanItineraryText, // Strictly clean text stored in localStorage
            createdAt: new Date().toLocaleDateString()
        };

        const existingTrips = JSON.parse(localStorage.getItem('saved_trips') || '[]');

        const isDuplicate = existingTrips.some((trip: any) => 
            trip.destination.toLowerCase() === newTrip.destination.toLowerCase() &&
            trip.startDate === newTrip.startDate
        );

        if (isDuplicate) {
            alert('This trip itinerary is already saved in your Saved page!');
            setIsSaved(true);
            return;
        }

        const updatedTrips = [newTrip, ...existingTrips];
        localStorage.setItem('saved_trips', JSON.stringify(updatedTrips));
        setIsSaved(true);
    };

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 md:px-8 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto space-y-6 overflow-visible">
                
                <CurrencyConverter />

                {/* Main Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch overflow-visible">
                    
                    {/* Input Form */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-visible flex flex-col justify-between">
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
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
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
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
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
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-all"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-visible">
                                    <div className="space-y-2 relative overflow-visible">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <FiDollarSign className="text-emerald-600" /> Budget
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setActiveDropdown(activeDropdown === 'budget' ? null : 'budget')}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 text-sm font-medium text-slate-700 text-left cursor-pointer"
                                        >
                                            <span>{budgetLabels[formData.budget]}</span>
                                            <FiChevronDown className={`text-slate-400 transition-transform ${activeDropdown === 'budget' ? 'rotate-180 text-emerald-600' : ''}`} size={16} />
                                        </button>
                                        {activeDropdown === 'budget' && (
                                            <ul className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1">
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
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                        />
                                    </div>

                                    <div className="space-y-2 relative overflow-visible">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <FiHome className="text-emerald-600" /> Accommodation
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setActiveDropdown(activeDropdown === 'accommodation' ? null : 'accommodation')}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 text-sm font-medium text-slate-700 text-left cursor-pointer"
                                        >
                                            <span>{accommodationLabels[formData.accommodation]}</span>
                                            <FiChevronDown className={`text-slate-400 transition-transform ${activeDropdown === 'accommodation' ? 'rotate-180 text-emerald-600' : ''}`} size={16} />
                                        </button>
                                        {activeDropdown === 'accommodation' && (
                                            <ul className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1">
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-visible">
                                    <div className="space-y-2 relative overflow-visible">
                                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                            <FiCompass className="text-emerald-600" /> Travel Style
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setActiveDropdown(activeDropdown === 'travelStyle' ? null : 'travelStyle')}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 text-sm font-medium text-slate-700 text-left cursor-pointer"
                                        >
                                            <span>{travelStyleLabels[formData.travelStyle]}</span>
                                            <FiChevronDown className={`text-slate-400 transition-transform ${activeDropdown === 'travelStyle' ? 'rotate-180 text-emerald-600' : ''}`} size={16} />
                                        </button>
                                        {activeDropdown === 'travelStyle' && (
                                            <ul className="absolute left-0 top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1">
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
                                        <input type="text" name="interests" value={formData.interests} onChange={handleChange} placeholder="e.g., Food, Museums, Hiking, Nightlife" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end mt-6">
                                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/20 text-sm cursor-pointer">
                                    <FiSend size={16} />
                                    {isSubmitting ? 'Generating Schedule...' : 'Generate Itinerary'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column Preview */}
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

                <div className="w-full">
                    <IsolatedMapSection />
                </div>

                {/* AI OUTPUT DISPLAY BOX */}
                {aiResult && (
                    <div className="bg-slate-900 text-slate-100 rounded-3xl shadow-xl border border-slate-800 p-8 mt-6 overflow-hidden">
                        
                        {/* Header Action Bar */}
                        <div className="border-b border-slate-800 pb-5 mb-6 flex items-center justify-between flex-wrap gap-4">
                            <h2 className="text-2xl font-extrabold text-emerald-400 tracking-tight font-sans">
                                ✨ Your Itinerary Results
                            </h2>

                            <button
                                onClick={handleSaveItinerary}
                                disabled={isSaved}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer ${
                                    isSaved 
                                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 cursor-default' 
                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                }`}
                            >
                                {isSaved ? (
                                    <>
                                        <FiCheck size={16} /> Saved to Bookmarks
                                    </>
                                ) : (
                                    <>
                                        <FiBookmark size={16} /> Save Itinerary
                                    </>
                                )}
                            </button>
                        </div>

                        {extractedImageQuery && (
                            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-6 border border-slate-800 shadow-lg relative">
                                <LocationImage query={extractedImageQuery} />
                            </div>
                        )}

                        <div className="prose prose-invert max-w-none font-sans text-sm text-slate-300 bg-slate-950 p-6 rounded-2xl border border-slate-800/60 leading-relaxed">
                            <ReactMarkdown
                                components={{
                                    h1: ({ children }) => <h1 className="text-xl font-extrabold text-emerald-400 mt-6 mb-3 border-b border-slate-800 pb-2">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-lg font-bold text-emerald-300 mt-5 mb-2">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-base font-semibold text-slate-200 mt-4 mb-2">{children}</h3>,
                                    strong: ({ children }) => <strong className="font-bold text-emerald-400">{children}</strong>,
                                    ul: ({ children }) => <ul className="list-disc pl-5 space-y-1.5 my-3 text-slate-300">{children}</ul>,
                                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                    p: ({ node, children }) => {
                                        const content = String(children);
                                        const tokenRegex = /\[Image Search:\s*([^\]]+)\]/i;
                                        const match = content.match(tokenRegex);

                                        // 🖼️ Renders inline photo cards directly on the Trip page live!
                                        if (match) {
                                            const searchQuery = match[1].trim();
                                            const cleanTextContent = content.replace(tokenRegex, '').trim();

                                            return (
                                                <div className="my-6 transition-all">
                                                    {cleanTextContent && <p className="mb-3 leading-relaxed text-slate-300">{cleanTextContent}</p>}
                                                    <div className="max-w-2xl h-64 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
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