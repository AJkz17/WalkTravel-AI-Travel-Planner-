import React from 'react';
import { FiHome, FiMap, FiInfo, FiUser, FiBookmark } from 'react-icons/fi';

const Navbar = () => {
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
                
                {/* ACTIVE STATE */}
                <a href="/" className="group relative flex items-center justify-center w-12 h-12 text-emerald-700 bg-emerald-50 rounded-xl transition-all shadow-sm border-2 border-emerald-600">
                    <FiHome size={22} />
                    
                    {/* Floating Tooltip Indicator */}
                    <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-xs font-light tracking-wider px-3 py-1.5 rounded-md pointer-events-none whitespace-nowrap shadow-md z-50">
                        Home
                    </span>
                </a>
                
                {/* INACTIVE STATE */}
                <a href="/Trip" className="group relative flex items-center justify-center w-12 h-12 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all border-2 border-transparent hover:border-emerald-600">
                    <FiMap size={22} />
                    
                    <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-xs font-light tracking-wider px-3 py-1.5 rounded-md pointer-events-none whitespace-nowrap shadow-md z-50">
                        Trip
                    </span>
                </a>
                
                <a href="/about" className="group relative flex items-center justify-center w-12 h-12 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all border-2 border-transparent hover:border-emerald-600">
                    <FiInfo size={22} />
                    
                    <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-xs font-light tracking-wider px-3 py-1.5 rounded-md pointer-events-none whitespace-nowrap shadow-md z-50">
                        About Us
                    </span>
                </a>

                <a href="/" className="group relative flex items-center justify-center w-12 h-12 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all border-2 border-transparent hover:border-emerald-600">
                    <FiBookmark size={22} />
                    
                    <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-xs font-light tracking-wider px-3 py-1.5 rounded-md pointer-events-none whitespace-nowrap shadow-md z-50">
                        Saved Trips
                    </span>
                </a>


            </nav>

            {/* Profile Section (Now matches the styling of the other icons perfectly) */}
            <div className="py-4 border-t border-slate-100 flex flex-col items-center">
                <a href="/profile" className="group relative flex items-center justify-center w-12 h-12 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all border-2 border-transparent hover:border-emerald-600">
                    <FiUser size={22} />
                    
                    <span className="absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-800 text-white text-xs font-light tracking-wider px-3 py-1.5 rounded-md pointer-events-none whitespace-nowrap shadow-md z-50">
                        Profile
                    </span>
                </a>
            </div>


        </aside>
    );
};

export default Navbar;