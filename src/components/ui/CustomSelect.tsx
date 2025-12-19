'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretDown, Check } from '@phosphor-icons/react';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder = 'Select option', label }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="space-y-2 relative" ref={containerRef}>
            {label && (
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full bg-surface border border-border p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:border-primary/50 text-foreground group ${isOpen ? 'ring-2 ring-primary/20 border-primary' : ''}`}
            >
                <span className={`text-sm font-bold ${!selectedOption ? 'text-gray-500' : ''}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <CaretDown
                    size={18}
                    weight="bold"
                    className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-[100] left-0 right-0 mt-2 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="max-h-60 overflow-y-auto custom-scroll p-2">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${value === option.value
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-primary/10 text-gray-400 hover:text-foreground'
                                        }`}
                                >
                                    <span className="text-sm font-bold tracking-tight">
                                        {option.label}
                                    </span>
                                    {value === option.value && (
                                        <Check size={16} weight="bold" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
