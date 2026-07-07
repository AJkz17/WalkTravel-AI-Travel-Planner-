'use client';

import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiCompass, FiTarget } from 'react-icons/fi';

interface VenueItem {
    name: string;
    lat: number;
    lon: number;
    street?: string;
    type?: string;
}

interface LocalSearchProps {
    currentDestination: string;
}

export default function LocalSearch({ currentDestination }: LocalSearchProps) {
    const [searchKeyword, setSearchKeyword] = useState<string>('coffee shop');
    const [venues, setVenues] = useState<VenueItem[]>([]);
    const [searching, setSearching] = useState<boolean>(false);
    const [searchTriggered, setSearchTriggered] = useState<boolean>(false);

    const handlePoiSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentDestination || !searchKeyword.trim()) return;

        try {
            setSearching(true);
            setSearchTriggered(true);
            // Convert destination city text string into geographic coordinates safely
            const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(currentDestination)}&limit=1`
            );
            const geoData = await geoRes.json();
            if (!geoData || geoData.length === 0) {
                setVenues([]);
                return;
            }
            const lat = parseFloat(geoData[0].lat);
            const lon = parseFloat(geoData[0].lon);
            const overpassUrl = `https://overpass-api.de/api/interpreter`;
            const cleanKeyword = searchKeyword.trim().toLowerCase();
            const overpassQuery = `
                [out:json][timeout:30];
                (
                  node["amenity"~"cafe|restaurant|fast_food|bar"](around:3000,${lat},${lon})["name"~"${cleanKeyword}",i];
                  node["shop"~"coffee|bakery"](around:3000,${lat},${lon})["name"~"${cleanKeyword}",i];
                  node["tourism"~"attraction|museum|viewpoint"](around:3000,${lat},${lon})["name"~"${cleanKeyword}",i];
                  // Fallback: get standard amenity nodes in radius if keyword is generic
                  node["amenity"~"cafe|restaurant"](around:2000,${lat},${lon});
                );
                out body 12;
            `;
            const response = await fetch(overpassUrl, {
                method: 'POST',
                body: overpassQuery,
            });

            if (!response.ok) throw new Error("Overpass server cluster rate limit hit");
            const result = await response.json();
            
            if (result.elements && result.elements.length > 0) {
                const mappedVenues = result.elements
                    .filter((el: any) => el.tags && (el.tags.name || el.tags.amenity || el.tags.shop))
                    .map((el: any) => ({
                        name: el.tags.name || `Local spot`,
                        lat: el.lat,
                        lon: el.lon,
                        street: el.tags['addr:street'] || el.tags['addr:place'] || undefined,
                        type: el.tags.amenity || el.tags.shop || el.tags.tourism || 'venue'
                    }));
                // Remove duplicates and filter rows matching user search criteria
                const uniqueVenues = mappedVenues.filter((venue: VenueItem, index: number, self: VenueItem[]) =>
                    index === self.findIndex((v) => v.name.toLowerCase() === venue.name.toLowerCase())
                );
                setVenues(uniqueVenues.slice(0, 10)); // return top 10 neat match points
            } else {
                setVenues([]);
            }
        } catch (error) {
            console.error("❌ Standalone Local Search failed:", error);
            setVenues([]);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="w-full bg-white border border-slate-200 rounded-3xl shadow-sm p-6 mt-6 transition-all">
            {/* Header section panel context */}
            <div className="flex items-center gap-2 mb-4">
                <FiCompass className="text-emerald-600 animate-spin-slow" size={18} />
                <div>
                    <h3 className="text-sm font-bold text-slate-900">
                        Local Discovery Finder
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                        Discover hot spots within 3km of <span className="font-semibold text-slate-600">{currentDestination || '"No Target Location Set"'}</span>
                    </p>
                </div>
            </div>

            {/* Custom Interactive Keyword Form Input Field Row */}
            <form onSubmit={handlePoiSearch} className="w-full">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <FiTarget size={16} />
                        </span>
                        <input 
                            type="text"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            disabled={!currentDestination}
                            placeholder="e.g., Coffee, Bakery, Starbucks, Museum..."
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs font-bold text-slate-700 bg-white transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={searching || !currentDestination || !searchKeyword.trim()}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 min-w-35 cursor-pointer disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                        <FiSearch size={14} />
                        {searching ? 'Finding spots...' : 'Search Places'}
                    </button>
                </div>
            </form>

            {/* Render Output Items Panel Grid Box */}
            {searchTriggered && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                    {searching ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 animate-pulse">
                            <div className="h-14 bg-slate-50 rounded-xl border border-slate-100 w-full"></div>
                            <div className="h-14 bg-slate-50 rounded-xl border border-slate-100 w-full"></div>
                        </div>
                    ) : venues.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {venues.map((venue, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/10 transition-all duration-200">
                                    <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shrink-0 text-xs font-extrabold shadow-xs">
                                        {idx + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <span className="block text-xs font-bold text-slate-800 truncate capitalize">
                                            {venue.name.toLowerCase()}
                                        </span>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-slate-200/60 rounded text-slate-500 tracking-wider scale-90 origin-left shrink-0">
                                                {venue.type}
                                            </span>
                                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5 truncate">
                                                <FiMapPin size={10} className="shrink-0 text-slate-300" /> 
                                                {venue.street ? `${venue.street}` : 'Surrounding Area'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-xs text-slate-400 font-medium">
                            No matching points found for "{searchKeyword}" within a 3km radius of {currentDestination}. Try typing a broader category word!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}