'use client';

import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiMapPin } from 'react-icons/fi';

interface LocationImageProps {
    query: string;
}

export default function LocationImage({ query }: LocationImageProps) {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchImagesFromBackend = async () => {
            if (!query) return;
            try {
                setLoading(true);

                // 🌐 Safe backend proxy call to your Node.js server instead of looking for local env variables
                const response = await fetch(`http://localhost:5000/api/images?query=${encodeURIComponent(query)}`);
                
                if (!response.ok) throw new Error(`Server error response: ${response.status}`);
                const data = await response.json();

                if (data.images && data.images.length > 0) {
                    setImages(data.images);
                    setCurrentIndex(0);
                } else {
                    setImages([]);
                }
            } catch (error) {
                console.error("❌ Failed to fetch from backend proxy endpoint:", error);
                setImages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchImagesFromBackend();
    }, [query]);

    if (loading) {
        return (
            <div className="w-full h-full min-h-60 bg-slate-800 rounded-2xl border border-slate-700 shadow-md relative overflow-hidden animate-pulse">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-slate-700/20 to-transparent"></div>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="w-full h-full min-h-60 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                <FiMapPin size={24} className="mb-2 text-slate-600" />
                <span className="text-xs font-medium">No live media feed found for "{query}"</span>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative group overflow-hidden rounded-2xl border border-slate-800 shadow-xl bg-slate-950 flex flex-col justify-between">
            <img 
                src={images[currentIndex]} 
                alt={`${query} shot`} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/40 pointer-events-none"></div>

            {/* Floating Meta Labels */}
            <div className="relative p-4 flex justify-between items-start">
                <span className="bg-emerald-500 text-slate-950 font-bold uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                    <FiMapPin size={10} /> Live Feed
                </span>
                <span className="bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700/40">
                    {currentIndex + 1} / {images.length}
                </span>
            </div>

            <div className="relative p-5 pt-20">
                <h4 className="text-lg font-bold text-white capitalize tracking-wide drop-shadow-md truncate">{query}</h4>
            </div>

            {/* Slider Handles */}
            {images.length > 1 && (
                <>
                    <button 
                        onClick={(e) => { e.preventDefault(); setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1); }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-sm border border-slate-700/50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                        <FiChevronLeft size={18} />
                    </button>
                    <button 
                        onClick={(e) => { e.preventDefault(); setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-900/80 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-sm border border-slate-700/50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                        <FiChevronRight size={18} />
                    </button>
                </>
            )}
        </div>
    );
}