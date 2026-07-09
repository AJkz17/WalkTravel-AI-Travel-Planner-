'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { 
    FiTarget, 
    FiCompass, 
    FiMapPin, 
    FiSliders, 
    FiGlobe, 
    FiUsers, 
    FiHeart 
} from 'react-icons/fi';
import Link from 'next/link';

// 🟩 3D GLOBE ELEMENT COMPONENT
// Renders an interactive, floating 3D globe with subtle distortion mesh animations
function Floating3DGlobe() {
    const meshRef = useRef<any>(null);

    // Continuous rotation frame loop
    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
            meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
        }
    });

    return (
        <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.4}>
            <MeshDistortMaterial
                color="#059669" // Emerald 600 theme
                attach="material"
                distort={0.25} // Subtle 3D wave distortion effect
                speed={1.5}
                roughness={0.2}
                metalness={0.8}
                wireframe={true} // High-tech grid aesthetic
            />
        </Sphere>
    );
}

export default function AboutPage() {
    const [isClient, setIsClient] = useState(false);

    // SSR Guard to ensure WebGL 3D Canvas mounts safely in the browser
    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* 🚀 HERO SECTION WITH 3D CANVAS */}
                <div className="relative bg-slate-900 text-white rounded-4xl p-8 md:p-14 overflow-hidden border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-120">
                    
                    {/* Hero Left Column Text */}
                    <div className="space-y-6 z-10">
                        <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2">
                            <FiCompass className="animate-spin-slow" /> Personalized Travel AI
                        </span>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                            Redefining How You <br />
                            <span className="text-emerald-400">Explore The World.</span>
                        </h1>

                        <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-lg">
                            We believe no two travelers are alike. Our AI core crafts tailored itineraries based on your exact style, budget, pace, and interests. Turning travel planning into an effortless experience.
                        </p>

                        <div className="pt-2 flex items-center gap-4">
                            <Link 
                                href="/Trip" 
                                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                            >
                                Plan Your Trip Now →
                            </Link>
                        </div>
                    </div>

                    {/* Hero Right Column: Interactive 3D Canvas */}
                    <div className="w-full h-80 lg:h-full min-h-80 relative flex items-center justify-center">
                        {isClient ? (
                            <Canvas className="w-full h-full cursor-grab active:cursor-grabbing">
                                <ambientLight intensity={0.8} />
                                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                                <Floating3DGlobe />
                                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                            </Canvas>
                        ) : (
                            <div className="w-full h-full bg-slate-800/50 rounded-3xl animate-pulse flex items-center justify-center text-xs text-slate-500">
                                Loading 3D Canvas Engine...
                            </div>
                        )}
                        {/* <span className="absolute bottom-2 text-[10px] text-slate-500 font-medium tracking-wide uppercase select-none pointer-events-none">
                        </span> */}
                    </div>
                </div>

                {/* 🎯 MISSION & VISION SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-justify">
                    
                    {/* OUR MISSION */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center ">
                                <FiTarget size={24} />
                            </div>
                            <h2 className="text-xl font-extrabold text-slate-900">Our Mission</h2>
                            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                                To empower every traveler with intelligent, hyper-personalized trip schedules. We aim to eliminate hours of stressful research by synthesizing your preferences such as budget, accommodation style, and passions.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                            <FiHeart /> Tailored to your preferences
                        </div>
                    </div>

                    {/* OUR VISION */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center">
                                <FiGlobe size={24} />
                            </div>
                            <h2 className="text-xl font-extrabold text-slate-900">Our Vision</h2>
                            <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                                To create a world where travel planning is completely seamless, intuitive, and accessible to everyone. We envision a future where technology understands your unique travel persona, uncovering hidden local gems while keeping your budget perfectly in check.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 text-[11px] font-bold text-teal-600 uppercase tracking-wider flex items-center gap-1.5">
                            <FiCompass /> Seamless global exploration
                        </div>
                    </div>

                </div>

                {/* 🌟 CORE PILLARS / VALUES */}
                <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-xs space-y-8 text-justify">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <h3 className="text-2xl font-black text-slate-900">Built Around Your Preferences</h3>
                        <p className="text-xs md:text-sm text-slate-500">
                            Here is how we turn your inputs into tailored travel experiences.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                            <FiSliders className="text-emerald-600" size={20} />
                            <h4 className="text-sm font-bold text-slate-800">Dynamic Preference Tuning</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Whether you prefer slow-paced relaxing getaways or action-packed adventures, our system balances daily activity counts accordingly.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                            <FiMapPin className="text-emerald-600" size={20} />
                            <h4 className="text-sm font-bold text-slate-800">Local Hotspot Mapping</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Integrated with live geographic nodes, pinpointing top-rated coffee shops, bakeries, and sights within a 3km radius of your destination.
                            </p>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                            <FiUsers className="text-emerald-600" size={20} />
                            <h4 className="text-sm font-bold text-slate-800">Budget & Traveler Aware</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                From backpacker budgets to luxury stays, solo trips to family vacations, recommendations scale to match your financial comfort zone.
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}