'use client';

import React, { useState, ChangeEventHandler, FormEventHandler } from 'react';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';

export default function RegisterPage() {
    // UI Notification and Loading States
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form inputs matching the database schema properties
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    // Handle inputs changes dynamically
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Forward registration payload to your standalone Node.js server
    // travel-frontend/app/register/page.tsx

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatusMessage(null);

        // This state object holds { username, email, password } 
        // matching what the backend is waiting to destructure!
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), 
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMessage({ type: 'success', text: data.message });
                setFormData({ username: '', email: '', password: '' }); // Clean inputs on success
            } else {
                setStatusMessage({ type: 'error', text: data.error || 'Failed to register.' });
            }
        } catch (error) {
            console.error('Connection failure:', error);
            setStatusMessage({ type: 'error', text: '❌ Connection error. Is your backend server online?' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans text-slate-800">
            {/* Main Decorative Background Card */}
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                
                {/* Modern Gradient Header Section */}
                <div className="bg-linear-to-r from-emerald-600 via-teal-600 to-green-600 p-8 text-center text-white">
                    <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Create Account</h1>
                    <p className="text-emerald-100 text-sm">Join our AI Travel Planner and begin mapping your next adventure.</p>
                </div>

                {/* Status Banners */}
                {statusMessage && (
                    <div className={`p-4 mx-8 mt-6 rounded-xl border text-sm font-semibold text-center ${
                        statusMessage.type === 'success' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                            : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                        {statusMessage.text}
                    </div>
                )}

                {/* Form Elements */}
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    
                    {/* Username Input Grid Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <FiUser className="text-emerald-600" /> Username
                        </label>
                        <div className="relative">
                            <input 
                                type="text" 
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a unique traveler handle" 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Email Input Grid Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <FiMail className="text-emerald-600" /> Email Address
                        </label>
                        <div className="relative">
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="traveler@example.com" 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input Grid Field */}
                    <div className="space-y-2">
                        {/* 1. Ensure the label closes RIGHT HERE after the text */}
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <FiLock className="text-emerald-600" /> Password
                        </label>
                        
                        {/* 2. The container div must be a sibling to the label, NOT nested inside it */}
                        <div className="relative flex items-center">
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••" 
                                className="w-full px-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer select-none"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button with matching color palette gradients */}
                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-400 disabled:to-teal-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Registering Account...' : 'Sign Up'}
                            <FiArrowRight size={16} />
                        </button>
                    </div>

                    {/* Navigation Link to Login Page */}
                    <p className="text-center text-sm text-slate-500 pt-2">
                        Already have an account?{' '}
                        <Link href="/Login" className="text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-4">
                            Log In
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
}