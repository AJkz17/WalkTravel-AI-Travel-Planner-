'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FiMap, FiAlertTriangle } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';

const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapPreviewProps {
    query: string;
}

function ChangeMapView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 13);
        }
    }, [center, map]);
    return null;
}

export default function MapPreview({ query }: MapPreviewProps) {
    const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false); // 👈 1. ADDED TRACKER FOR INDEPENDENT SANDBOX

    useEffect(() => {
        const convertLocationToCoords = async () => {
            if (!query) return;
            try {
                setLoading(true);
                setHasError(false); 

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
                );
                
                // 🛑 2. CAPTURE RATE LIMITS (Catches 429 errors or server blocks cleanly)
                if (!response.ok) {
                    throw new Error(`Rate limit or network block anomaly: ${response.status}`);
                }

                const data = await response.json();

                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    setCoordinates([lat, lon]);
                } else {
                    setCoordinates(null);
                }
            } catch (error) {
                console.error("❌ OSM Geocoding failure caught safely:", error);
                setHasError(true); // 👈 3. TOGGLE FALLBACK SEPARATELY WITHOUT KILLING COMPONENT STREAMS
            } finally {
                setLoading(false);
            }
        };

        convertLocationToCoords();
    }, [query]);

    if (!query) return null;

    return (
        <div className="w-full h-64 sm:h-80 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col mt-4">
            {/* Map Header */}
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-2.5 flex items-center justify-between text-slate-700">
                <div className="flex items-center gap-2">
                    <FiMap className="text-emerald-600 animate-pulse" size={16} />
                    <span className="text-xs font-bold tracking-wide uppercase text-slate-600">
                        Location Preview
                    </span>
                </div>
                {loading && !hasError && <span className="text-[10px] text-slate-400 animate-pulse font-medium">Updating pin...</span>}
            </div>

            <div className="flex-1 w-full h-full bg-slate-100 relative z-10">

                {hasError ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50 text-slate-500 font-sans">
                        <FiAlertTriangle size={28} className="mb-2 text-amber-500 animate-bounce" />
                        <span className="text-xs font-bold text-slate-700">Map Limit Reached</span>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-65 leading-relaxed">
                            Public map query bounds exceeded. Feel free to continue utilizing the currency converter form fields and image sliders while it cools down!
                        </p>
                    </div>
                ) : coordinates ? (
                    <MapContainer
                        center={coordinates}
                        zoom={13}
                        scrollWheelZoom={true}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {/* 🎨 Using standard clear OpenStreetMap tile styles layout layer */}
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        
                        {/* Interactive map Pin Marker overlay drop */}
                        <Marker position={coordinates} icon={defaultIcon}>
                            <Popup>
                                <span className="text-xs font-bold font-sans text-slate-800">
                                    📍 Center-point: {query}
                                </span>
                            </Popup>
                        </Marker>

                        {/* Fires coordinate camera translation hooks smoothly */}
                        <ChangeMapView center={coordinates} />
                    </MapContainer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-medium font-sans">
                        {loading ? "Calculating mapping view..." : "Locating map positions..."}
                    </div>
                )}
            </div>
        </div>
    );
}