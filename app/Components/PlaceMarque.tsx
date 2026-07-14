'use client';

import React from 'react';
import { travelLocations } from "@/app/assets/asset";

const ItemMarquee = () => {
    return (
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group sm:my-20">
            {/* Left Ambient Blend Gradient Edge */}
            <div className="absolute left-0 top-0 h-full w-40 z-10 pointer-events-none bg-linear-to-r from-white to-transparent" />
            
            {/* Scrolling Track Strip Loop */}
            <div className="flex min-w-[200%] animate-[marqueeScroll_10s_linear_infinite] sm:animate-marqueeScroll group-hover:[animation-play-state:paused] gap-4">
                {[...travelLocations, ...travelLocations, ...travelLocations, ...travelLocations].map((location, index) => (
                    <button 
                        key={index} 
                        className="shrink-0 px-5 py-2 bg-slate-100 rounded-lg text-slate-500 text-xs sm:text-sm hover:bg-emerald-900 hover:text-white active:scale-95 transition-all duration-300 font-medium tracking-wide cursor-pointer"
                    >
                        {location}
                    </button>
                ))}
            </div>
            
            {/* Right Ambient Blend Gradient Edge */}
            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-linear-to-l from-white to-transparent" />
        </div>
    );
};

export default ItemMarquee;