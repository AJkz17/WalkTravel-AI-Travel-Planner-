'use client';

import React, { useState, useEffect, memo } from 'react';
import { FiMap, FiMapPin, FiTarget, FiAlertTriangle } from 'react-icons/fi';

// Global static layout style sheet
import 'leaflet/dist/leaflet.css';

interface VenueItem {
    name: string;
    lat: number;
    lon: number;
    street?: string;
    type?: string;
}

//  Leaflet Canvas Engine
function LeafletCanvas({ 
    coordinates, 
    activeLocation, 
    venues 
}: { 
    coordinates: [number, number]; 
    activeLocation: string; 
    venues: VenueItem[]; 
}) {
    const { MapContainer, TileLayer, Marker, Popup, useMap } = require('react-leaflet');
    const L = require('leaflet');

    const centerLocationIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const venueSpotIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const ChangeMapView = ({ center }: { center: [number, number] }) => {
        const map = useMap();
        useEffect(() => {
            if (center) map.setView(center, 13);
        }, [center]);
        return null;
    };

    return (
        <MapContainer center={coordinates} zoom={13} scrollWheelZoom={true} style={{ width: '100%', height: '100%' }}>
            <TileLayer attribution='© OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* 🔵 BLUE PIN: Primary Target Center */}
            <Marker position={coordinates} icon={centerLocationIcon}>
                <Popup>
                    <div className="font-sans text-xs text-slate-800">
                        <span className="font-bold block text-slate-900">📍 Center Region</span>
                        <span className="text-slate-500 text-[10px]">{activeLocation}</span>
                    </div>
                </Popup>
            </Marker>

            {/* GREEN PINS: Local Discoveries mapped dynamically */}
            {venues.map((venue, idx) => {

                const queryText = `${venue.name} ${venue.street || ''} ${activeLocation}`;
                const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(queryText)}`;

                return (
                    <Marker key={idx} position={[venue.lat, venue.lon]} icon={venueSpotIcon}>
                        <Popup>
                            <div className="font-sans text-xs text-slate-800 min-w-42.5 p-0.5 flex flex-col space-y-2">
                                <div>
                                    <span className="font-extrabold block text-emerald-700 capitalize">
                                        ☕ {venue.name.toLowerCase()}
                                    </span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded tracking-wide inline-block mt-1">
                                        Type: {venue.type}
                                    </span>
                                </div>
                                
                                <span className="text-[10px] text-slate-500 block border-t border-slate-100 pt-1.5 truncate text-ellipsis max-w-41.25">
                                    {venue.street ? venue.street : 'Surrounding Area District'}
                                </span>

                                {/* STYLED ACTION REDIRECT TAB LINK */}
                                <a 
                                    href={googleSearchUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full text-center py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg transition-colors shadow-xs no-underline block mt-1 cursor-pointer"
                                >
                                    View Google Reviews ↗
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}

            <ChangeMapView center={coordinates} />
        </MapContainer>
    );
}

// 🏛️ PRIMARY COMPONENT CONTROLLER
function MapPreviewComponent() {
    const [isClient, setIsClient] = useState<boolean>(false);

    // Form search states
    const [locationInput, setLocationInput] = useState<string>('');
    const [activeLocation, setActiveLocation] = useState<string>('');
    const [coordinates, setCoordinates] = useState<[number, number] | null>([35.6762, 139.6503]); // Tokyo fallback default
    
    const [shopInput, setShopInput] = useState<string>('');
    const [venues, setVenues] = useState<VenueItem[]>([]);

    const [mapLoading, setMapLoading] = useState<boolean>(false);
    const [poiSearching, setPoiSearching] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
        const storedLocation = localStorage.getItem('saved_preview_map_location');
        if (storedLocation) {
            setLocationInput(storedLocation);
            setActiveLocation(storedLocation);
        }
    }, []);

    useEffect(() => {
        if (!isClient || !activeLocation.trim()) return;

        const convertLocationToCoords = async () => {
            try {
                setMapLoading(true);
                setHasError(false);

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(activeLocation)}&limit=1`
                );
                
                if (!response.ok) throw new Error(`Geocoder endpoint rate error`);
                const data = await response.json();

                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    setCoordinates([lat, lon]);
                }
            } catch (error) {
                console.error("❌ OSM Geocoding failure caught:", error);
                setHasError(true);
            } finally {
                setMapLoading(false);
            }
        };

        convertLocationToCoords();
    }, [activeLocation, isClient]);

    const handleLocationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (locationInput.trim()) {
            setActiveLocation(locationInput.trim());
            setVenues([]); // Reset matching pins when shifting location boundaries
            hasError && setHasError(false);
            localStorage.setItem('saved_preview_map_location', locationInput.trim());
        }
    };

    const handlePoiSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coordinates || !shopInput.trim() || !activeLocation) return;

        try {
            setPoiSearching(true);
            const [lat, lon] = coordinates;
            const overpassUrl = `https://overpass-api.de/api/interpreter`;
            const cleanKeyword = shopInput.trim().toLowerCase();
            
            // 🟩 FIXED LOGIC BLOCK:
            // Intercept broad category terms so typing "coffee shop" fetches raw categories directly 
            // instead of restricting to matching names.
            let overpassQuery = '';
            
            if (cleanKeyword.includes('coffe') || cleanKeyword.includes('cafe') || cleanKeyword.includes('shop')) {
                overpassQuery = `
                    [out:json][timeout:30];
                    (
                      node["amenity"="cafe"](around:3000,${lat},${lon});
                      node["shop"="coffee"](around:3000,${lat},${lon});
                      node["amenity"~"cafe"](around:3000,${lat},${lon})["name"~"${cleanKeyword}",i];
                    );
                    out body 20;
                `;
            } else if (cleanKeyword.includes('baker') || cleanKeyword.includes('bread')) {
                overpassQuery = `
                    [out:json][timeout:30];
                    (
                      node["shop"="bakery"](around:3000,${lat},${lon});
                      node["shop"~"bakery"](around:3000,${lat},${lon})["name"~"${cleanKeyword}",i];
                    );
                    out body 20;
                `;
            } else {
                // General keyword fallback fallback filter rule
                overpassQuery = `
                    [out:json][timeout:30];
                    (
                      node["amenity"~"cafe|restaurant|bakery|bar"](around:3000,${lat},${lon})["name"~"${cleanKeyword}",i];
                      node["shop"~"coffee|bakery"](around:3000,${lat},${lon})["name"~"${cleanKeyword}",i];
                      node["tourism"~"attraction|museum"](around:3000,${lat},${lon})["name"~"${cleanKeyword}",i];
                    );
                    out body 20;
                `;
            }

            const response = await fetch(overpassUrl, {
                method: 'POST',
                body: overpassQuery,
            });

            if (!response.ok) throw new Error("Overpass rate threshold hit");
            const result = await response.json();
            
            if (result.elements && result.elements.length > 0) {
                const mappedVenues = result.elements
                    .filter((el: any) => el.tags && (el.tags.name || el.tags.amenity || el.tags.shop))
                    .map((el: any) => ({
                        name: el.tags.name || el.tags.amenity || `Local spot`,
                        lat: el.lat,
                        lon: el.lon,
                        street: el.tags['addr:street'] || el.tags['addr:suburb'] || undefined,
                        type: el.tags.amenity || el.tags.shop || el.tags.tourism || 'venue'
                    }));

                // Unique filtering helper
                const uniqueVenues = mappedVenues.filter((venue: VenueItem, idx: number, self: VenueItem[]) =>
                    idx === self.findIndex((v) => v.name.toLowerCase() === venue.name.toLowerCase())
                );

                setVenues(uniqueVenues.slice(0, 15));
            } else {
                setVenues([]);
            }
        } catch (error) {
            console.error("❌ Discovery venue mapping failed:", error);
            setVenues([]);
        } finally {
            setPoiSearching(false);
        }
    };

    return (
        <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col space-y-4 mt-8 overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Set Map Location Area */}
                <form onSubmit={handleLocationSubmit} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 tracking-wide uppercase flex items-center gap-1.5">
                        <FiMapPin className="text-emerald-600" /> 1. Set Map Location Area
                    </label>
                    <div className="relative flex items-center">
                        <input 
                            type="text"
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            placeholder="Type a city (e.g., Paris, London...)"
                            className="w-full pl-4 pr-24 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold text-slate-700 bg-slate-50/50 shadow-xs"
                        />
                        <button type="submit" className="absolute right-2 px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 transition-colors cursor-pointer">
                            Go To Location
                        </button>
                    </div>
                </form>

                {/* 2. Pinpoint Places Nearby */}
                <form onSubmit={handlePoiSearch} className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 tracking-wide uppercase flex items-center gap-1.5">
                        <FiTarget className="text-emerald-600" /> 2. Pinpoint Places Nearby (e.g., Coffee, Bakery)
                    </label>
                    <div className="relative flex items-center">
                        <input 
                            type="text"
                            value={shopInput}
                            onChange={(e) => setShopInput(e.target.value)}
                            disabled={hasError || !activeLocation}
                            placeholder={activeLocation ? "Search nearby (e.g., coffee, cafe, starbucks...)" : "Set location first 👆"}
                            className="w-full pl-4 pr-24 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold text-slate-700 bg-slate-50/50 shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                        <button 
                            type="submit" 
                            disabled={poiSearching || hasError || !activeLocation || !shopInput.trim()}
                            className="absolute right-2 px-4 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                            {poiSearching ? 'Searching...' : 'Drop Pins'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100 relative z-10 flex flex-col shadow-xs">
                <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-between text-slate-700">
                    <div className="flex items-center gap-2">
                        <FiMap className="text-emerald-600" size={14} />
                        <span className="text-[10px] font-bold tracking-wide uppercase text-slate-500">
                            {activeLocation ? `Current Map: ${activeLocation}` : "Current Map: Awaiting Input Location..."} {venues.length > 0 && `(Showing ${venues.length} Discovery Pins)`}
                        </span>
                    </div>
                    {mapLoading && <span className="text-[9px] text-slate-400 animate-pulse font-medium">Updating map view...</span>}
                    {poiSearching && <span className="text-[9px] text-emerald-600 animate-pulse font-bold">Querying local nodes...</span>}
                </div>
                
                <div className="flex-1 relative w-full h-full">
                    {hasError ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50">
                            <FiAlertTriangle size={24} className="mb-1 text-amber-500 animate-bounce" />
                            <span className="text-xs font-bold text-slate-700">Map Rate Limit hit</span>
                            <p className="text-[10px] text-slate-400 mt-1 max-w-62.5">Public mapping thresholds maxed out briefly. Give it a moment to reset, you can still type form queries seamlessly!</p>
                        </div>
                    ) : coordinates ? (
                        <LeafletCanvas 
                            coordinates={coordinates} 
                            activeLocation={activeLocation || "Default Center"} 
                            venues={venues} 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-sans">Calculating geographic grids...</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default memo(MapPreviewComponent);