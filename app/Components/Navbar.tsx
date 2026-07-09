'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiMap, FiInfo, FiUser, FiBookmark, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
    const pathname = usePathname();
    
    // Auth and user profile tracking states
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [initial, setInitial] = useState('U');

    useEffect(() => {
        // Evaluate user login state on component mount / route changes
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setIsLoggedIn(true);
            setInitial(user.username ? user.username[0].toUpperCase() : 'T');
        } else {
            setIsLoggedIn(false);
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        window.location.href = '/login';
    };

    // Helper function to dynamically swap active vs inactive icon styling classes
    const getLinkClass = (path: string) => {
        const baseClass = "group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all border-2 ";
        const activeClass = "text-emerald-700 bg-emerald-50 border-emerald-600 shadow-sm";
        const inactiveClass = "text-slate-500 border-transparent hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-600";
        
        return baseClass + (pathname === path ? activeClass : inactiveClass);
    };

    return (
        <aside className="h-screen w-20 bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 shadow-sm z-50 font-sans">
            
            {/* Logo/Brand Area */}
            <div className="h-20 border-b border-slate-100 flex items-center justify-center">
                <h2 className="text-xl font-extrabold text-slate-900">
                    AI<span className="text-emerald-600">.</span>
                </h2>
            </div>

            {/* Main Navigation Links */}
            <nav className="flex-1 py-6 space-y-4 flex flex-col items-center">
                
                {/* Always Available: Home / Core Planner */}
                <Link href="/" className={getLinkClass('/')}>
                    <FiHome size={22} />
                    <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-xs font-light tracking-wider px-3 py-1.5 rounded-md pointer-events-none whitespace-nowrap shadow-md z-50">
                        Home
                    </span>
                </Link>
                
                {/* 🔒 PROTECTED LINK: Active Trips Engine */}
                {isLoggedIn && (
                    <Link href="/Trip" className={getLinkClass('/trips')}>
                        <FiMap size={22} />
                        <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-xs font-light tracking-wider px-3 py-1.5 rounded-md pointer-events-none whitespace-nowrap shadow-md z-50">
                            Trip
                        </span>
                    </Link>
                )}
                
                {/* Always Available: Info / Context */}
                <Link href="/About" className={getLinkClass('/about')}>
                    <FiInfo size={22} />
                    <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-xs font-light tracking-wider px-3 py-1.5 rounded-md pointer-events-none whitespace-nowrap shadow-md z-50">
                        About Us
                    </span>
                </Link>

                {/* 🔒 PROTECTED LINK: Saved Itinerary Archive */}
                {isLoggedIn && (
                    <Link href="/Saved" className={getLinkClass('/saved')}>
                        <FiBookmark size={22} />
                        <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-xs font-light tracking-wider px-3 py-1.5 rounded-md pointer-events-none whitespace-nowrap shadow-md z-50">
                            Saved Trips
                        </span>
                    </Link>
                )}

            </nav>

            {/* Profile / Context Footer Segment */}
            <div className="py-4 border-t border-slate-100 flex flex-col items-center space-y-3">
                {isLoggedIn ? (
                    <>
                        {/* Dynamic Avatar Indicator Circle showing User Initial */}
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center justify-center shadow-sm select-none" title="Logged In">
                            {initial}
                        </div>
                        {/* Compact Sign-Out Action Toggle */}
                        <button 
                            onClick={handleLogout}
                            className="group relative flex items-center justify-center w-12 h-12 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-200 cursor-pointer"
                        >
                            <FiLogOut size={20} />
                            <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-xs font-light tracking-wider px-3 py-1.5 rounded-md pointer-events-none whitespace-nowrap shadow-md z-50">
                                Sign Out
                            </span>
                        </button>
                    </>
                ) : (
                    /* Public Fallback Login Action Redirect Gateway */
                    <Link href="/login" className={getLinkClass('/login')}>
                        <FiUser size={22} />
                        <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-xs font-light tracking-wider px-3 py-1.5 rounded-md pointer-events-none whitespace-nowrap shadow-md z-50">
                            Profile / Login
                        </span>
                    </Link>
                )}
            </div>

        </aside>
    );
};

export default Navbar;