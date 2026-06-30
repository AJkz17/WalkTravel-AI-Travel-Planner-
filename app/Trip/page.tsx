'use client';

import React, { useState, ChangeEventHandler, FormEventHandler } from 'react';
import { 
    FiMapPin, 
    FiCalendar, 
    FiDollarSign, 
    FiUsers, 
    FiHome, 
    FiCompass, 
    FiHeart,
    FiSend
} from 'react-icons/fi';

export default function TripPlanner() {
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

    // Handle input changes using the imported ChangeEventHandler
    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission using the imported FormEventHandler
    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        console.log('Generating AI Itinerary with:', formData);
        // Add your AI prompt generation logic here
    };

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 md:px-8 font-sans text-slate-800">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                
                {/* Header Section */}
                <div className="bg-emerald-50/50 p-8 border-b border-emerald-100">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Design Your AI Itinerary</h1>
                    <p className="text-slate-600">Tell us about your dream trip, and our AI will craft the perfect daily schedule for you.</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    
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
                                placeholder="e.g., Tokyo, Japan" 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
                            >
                                <option value="Backpacker">Backpacker (Low)</option>
                                <option value="Moderate">Moderate (Standard)</option>
                                <option value="Luxury">Luxury (High)</option>
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
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
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
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
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
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
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
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button 
                            type="submit"
                            className="flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-600/30 active:scale-95"
                        >
                            <FiSend size={18} />
                            Generate Itinerary
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}