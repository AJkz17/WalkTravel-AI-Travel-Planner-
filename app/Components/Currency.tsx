'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiInfo, FiRefreshCw, FiChevronDown } from 'react-icons/fi';

export default function CurrencyConverter() {
    const [exchangeAmount, setExchangeAmount] = useState<number>(1000);
    const [targetCurrency, setTargetCurrency] = useState<string>('USD');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isCalculatorVisible, setIsCalculatorVisible] = useState<boolean>(true);
    
    const currencyRates: Record<string, { rate: number; symbol: string; label: string }> = {
        USD: { rate: 0.22, symbol: '$', label: 'USD (United States Dollar)' },
        EUR: { rate: 0.21, symbol: '€', label: 'EUR (Euro)' },
        SGD: { rate: 0.30, symbol: 'S$', label: 'SGD (Singapore Dollar)' },
        JPY: { rate: 34.21, symbol: '¥', label: 'JPY (Japanese Yen)' },
        GBP: { rate: 0.18, symbol: '£', label: 'GBP (British Pound)' }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentRateData = currencyRates[targetCurrency];
    const convertedValue = (exchangeAmount * currentRateData.rate).toFixed(2);

    return (
        <div className="w-full bg-white border border-slate-200 rounded-3xl shadow-sm overflow-visible relative z-30">

            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <FiInfo size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Budget Range References</h3>
                        <p className="text-xs text-slate-500">Estimated cost metrics calculated per individual plan basis.</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 md:flex md:items-center">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-center md:text-left">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Low Tier</span>
                        <span className="text-xs font-bold text-slate-700">RM 1,000 - 2,000</span>
                    </div>
                    <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-xl px-4 py-2 text-center md:text-left">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-600">Standard</span>
                        <span className="text-xs font-bold text-emerald-700">RM 2,500 - 3,500</span>
                    </div>
                    <div className="bg-amber-50/40 border border-amber-100/60 rounded-xl px-4 py-2 text-center md:text-left">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-600">High Tier</span>
                        <span className="text-xs font-bold text-amber-700">Above RM 4,000</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50/50 rounded-b-3xl flex flex-col transition-all duration-300 overflow-visible">
                {/* Header Control Row (Always Visible) */}
                <div className="p-5 flex items-center justify-between border-b border-slate-100/50">
                    <div className="flex items-center gap-2 text-slate-700">
                        <FiRefreshCw className={`text-slate-400 ${isCalculatorVisible ? 'animate-spin-slow' : ''}`} size={16} />
                        <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Quick Travel Converter</span>
                    </div>
                    
                    {/* Toggle Minimize/Maximize Switch Layout Button */}
                    <button
                        type="button"
                        onClick={() => setIsCalculatorVisible(!isCalculatorVisible)}
                        className="px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wide uppercase border bg-white shadow-xs transition-colors cursor-pointer text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700 active:scale-95"
                    >
                        {isCalculatorVisible ? '✕' : '＋'}
                    </button>
                </div>

                {/* Expandable Parameter Selection Panel Stream Wrapper */}
                {isCalculatorVisible && (
                    <div className="p-5 pt-0 flex flex-wrap items-center gap-3 sm:justify-end overflow-visible animate-in fade-in slide-in-from-top-2 duration-200 mt-4">
                        {/* Ringgit Input Field */}
                        <div className="relative rounded-xl border border-slate-200 bg-white shadow-xs max-w-32.5">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">RM</span>
                            <input 
                                type="number" 
                                value={exchangeAmount}
                                onChange={(e) => setExchangeAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 bg-transparent"
                            />
                        </div>

                        <span className="text-slate-400 text-xs font-bold">👉</span>

                        {/* STYLED CUSTOM DROPDOWN */}
                        <div className="relative overflow-visible" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                                className="flex items-center justify-between gap-2 px-4 py-1.5 min-w-52.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                            >
                                <span>{currencyRates[targetCurrency].label}</span>
                                <FiChevronDown className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} size={14} />
                            </button>

                            {/* Dropdown Options Popup Menu */}
                            {isOpen && (
                                <ul className="absolute right-0 top-full mt-2 w-full min-w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                    {Object.keys(currencyRates).map((key) => (
                                        <li key={key}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setTargetCurrency(key);
                                                    setIsOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors duration-150 flex items-center justify-between cursor-pointer ${
                                                    targetCurrency === key 
                                                        ? 'bg-emerald-50 text-emerald-700 font-bold' 
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                            >
                                                <span>{currencyRates[key].label}</span>
                                                <span className="text-slate-400 text-[10px] font-mono">{currencyRates[key].symbol}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="bg-emerald-600 text-white rounded-xl px-4 py-1.5 text-xs font-extrabold tracking-wide shadow-xs shadow-emerald-600/10 min-w-22.5 text-center">
                            {currentRateData.symbol} {convertedValue}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}