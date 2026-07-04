'use client';

import React, { useState, ChangeEventHandler, FormEventHandler } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {twinTowerUrl} from '../assets/asset.js'

export default function LoginPage() {
    // UI Feedback States
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter()
    

    // Form data tracking matching login credentials
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Forward credentials payload to your Node.js authentication API
    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            setStatusMessage({ type: 'success', text: '🟢 Welcome back! Redirecting to dashboard...' });
            
            // 💡 OPTIONAL PRO-TIP: Store the user session data locally so your app remembers them!
            localStorage.setItem('user', JSON.stringify(data.user));

            // 🚀 REDIRECT THE USER INSTANTLY:
            // Change "/" to "/dashboard" if your trip form is saved in a different subfolder file!
            setTimeout(() => {
                router.push('/Dashboard'); 
            }, 1500); // 1.5 second delay so they can read your beautiful green success message

        } else {
            setStatusMessage({ type: 'error', text: data.error || 'Invalid credentials.' });
        }
    } catch (error) {
        console.error('Connection failure:', error);
        setStatusMessage({ type: 'error', text: '❌ Could not connect to the login server.' });
    } finally {
        setIsSubmitting(false);
    }
};

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 md:p-8 font-sans text-slate-800">
            {/* Split Screen Master Box container */}
            <div className="max-w-4xl w-full min-h-150white rounded-4xl shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
                
                {/* 🎨 COLUMN 1: Visual Showcase with Crop-out Floating Image */}
                <div className="relative bg-linear-to-tr from-emerald-700 via-teal-600 to-green-600 p-8 flex flex-col justify-between overflow-hidden md:flex">
                    
                    {/* Background Ambient Decorative Circles */}
                    <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-emerald-500/20 blur-2xl"></div>

                    {/* Branding Text */}
                    <div className="relative z-10">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider uppercase text-emerald-100">
                            AI Travel Core
                        </span>
                        <h2 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
                            Your Next Journey <br />Starts Right Here.
                        </h2>
                    </div>

                    {/* 🚀 THE CROP-OUT FLOATING WINDOW */}
                    <div className="relative w-full flex justify-center items-center py-8 z-10">
                        <div className="w-64 h-64 rounded-full border-4 border-white/30 overflow-hidden shadow-2xl bg-slate-900/10 backdrop-blur-sm p-3 animate-float">
                            {/* Mask/Crop wrapper clipping the travel graphic */}
                            <div className="w-full h-full rounded-full overflow-hidden bg-emerald-800/40 relative">
                                <img 
                                    src={twinTowerUrl}
                                    alt="Featured Destination" 
                                    className="w-full h-full object-cover transform scale-110 hover:scale-125 transition-transform duration-700"
                                    onError={(e) => {
                                        // Fallback icon placeholder if asset image missing
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                {/* Overlay element creating shadow inside the crop circle window */}
                                <div className="absolute inset-0 from-slate-900/40 via-transparent to-transparent"></div>
                            </div>
                        </div>
                    </div>

                    {/* Footer tagline text */}
                    <p className="text-emerald-100 text-sm font-medium relative z-10">
                        Sync itineraries seamlessly across your favorite personal mobile devices.
                    </p>
                </div>

                {/* 📝 COLUMN 2: Secure Interactive Login Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 text-sm">Please log in to manage your active digital itineraries.</p>
                    </div>

                    {/* Status Feedback Notice Banner */}
                    {statusMessage && (
                        <div className={`p-4 mt-6 rounded-xl border text-sm font-semibold text-center ${
                            statusMessage.type === 'success' 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}>
                            {statusMessage.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        
                        {/* Email Input Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <FiMail className="text-emerald-600" /> Email Address
                            </label>
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

                        {/* Password Input Field with View Visibility Toggle */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <FiLock className="text-emerald-600" /> Password
                            </label>
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
                                >
                                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-emerald-400 disabled:to-teal-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] cursor-pointer"
                            >
                                {isSubmitting ? 'Verifying Account...' : 'Log In'}
                                <FiArrowRight size={16} />
                            </button>
                        </div>

                        {/* Redirect back link to sign up portal */}
                        <p className="text-center text-sm text-slate-500 pt-2">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold underline underline-offset-4">
                                Register
                            </Link>
                        </p>

                    </form>
                </div>

            </div>
        </div>
    );
}