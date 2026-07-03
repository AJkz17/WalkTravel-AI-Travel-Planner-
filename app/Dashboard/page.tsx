import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Map, MapPin, Database, LogIn, UserPlus, Cpu } from 'lucide-react';
import MalaysiaImage from '../assets/asset.js'; // Your original import
import { MapPicture } from '../assets/asset.js'; // Importing the MapPicture

const Landing = () => {
    return (
        <div className="min-h-screen bg-stone-50 text-slate-800 font-sans antialiased">
            {/* Main Container */}
           <main className="w-full pl-4 md:pl-12 py-12 md:py-20 pr-12">
                {/* Header / Announcement Banner */}
                <div className="text-center mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        Proudly Designed in Malaysia
                    </span>
                </div>

                {/* Section 1: Top Hero Row (Description & Visual Elements) */}
                {/* Section 1: Top Hero Row (Description & Visual Elements evenly split 50/50) */}
                {/* Section 1: Top Hero Row (Balanced 50/50 Row Layout) */}
                <section className="grid grid-cols-1 lg:grid-cols-12 items-stretch bg-white rounded-l-3xl shadow-sm border border-emerald-100/50 border-r-0 overflow-hidden">
                    
                    {/* Description Left (Exactly half the width) */}
                    <div className="lg:col-span-6 flex flex-col justify-center space-y-6 py-10 pl-8 md:pl-12 pr-4 md:pr-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                            AI Travel Planner: <br/>
                            <span className="bg-linear-to-r from-emerald-600 via-teal-600 to-green-500 bg-clip-text text-transparent">
                                Your Next Adventure Awaits
                            </span>
                        </h1>
                        <p className="text-base text-slate-600 leading-relaxed text-justify">
                            Welcome to the ultimate AI-powered travel companion. Whether you are mapping out a weekend escape to the pristine beaches of Langkawi or orchestrating an international multi-city tour, our platform turns your chaotic travel ideas into perfectly structured itineraries in seconds.
                        </p>
                        <p className="text-base text-slate-600 leading-relaxed text-justify">
                            Driven by advanced AI, our planner curates hidden local gems, tracks your travel statistics, and seamlessly handles the logistics so you can focus entirely on the journey ahead. Your next perfect trip is just a prompt away.
                        </p>
                    </div>

                    {/* Visual Elements Right (Exactly half the width, dedicated fully to the Map image) */}
                    {/* FIX: Removed grid-cols-2 so the single map picture fills up the entire right half of the row */}
                    <div className="lg:col-span-6 relative w-full h-full min-h-87.5 md:min-h-100 overflow-hidden transition-transform hover:scale-101 duration-300">
                        <Image 
                            src={MapPicture} 
                            alt="AI Travel Planner Map" 
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover object-center"
                            priority
                        />
                    </div>
                </section>

                {/* Section 2: Middle Data Area (App Usage and Population Insights) */}
                <section className="mt-8 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-emerald-100/50">
                    <div className="mb-6 flex items-center gap-2">
                        <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                            <Map size={20} />
                        </span>
                        <h2 className="text-xl font-bold text-slate-900">App Usage & Travel Population Insights</h2>
                    </div>
                    
                    {/* Table Responsive Wrapper */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                            <thead className="bg-emerald-50/70 text-xs font-semibold uppercase tracking-wider text-emerald-900">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Metric</th>
                                    <th scope="col" className="px-6 py-4">Current Statistics</th>
                                    <th scope="col" className="px-6 py-4">Platform Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                                <tr className="hover:bg-emerald-50/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                        <Users size={16} className="text-emerald-600" /> Active Global Travelers
                                    </td>
                                    <td className="px-6 py-4">45,000+ Users </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Live & Scaling 
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-emerald-50/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                        <Map size={16} className="text-emerald-600" /> Itineraries Generated
                                    </td>
                                    <td className="px-6 py-4">120,000+ Planned Trips </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                            <Cpu size={12} className="mr-1" /> AI Core Active 
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-emerald-50/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                        <MapPin size={16} className="text-emerald-600" /> Malaysian Destination Guides
                                    </td>
                                    <td className="px-6 py-4">1,500+ Local Spots Curated </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                            🇲🇾 Region Optimized 
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-emerald-50/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                        <Database size={16} className="text-emerald-600" /> Active Repository Syncs
                                    </td>
                                    <td className="px-6 py-4">12MB / 100MB Max Limit </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-800">
                                            PostgreSQL Connected 
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
        
                {/* Vision and Missio */}

            </main>
        </div>
    );
};

export default Landing;