'use client'
import React, { useState } from 'react';
import { Search, Menu, Filter, X } from 'lucide-react';


export default function SellLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-blue-800 text-white p-4 flex justify-start">
                <button 
                    className="md:hidden ml-auto text-white focus:outline-none z-100"
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* {desktop menu /} */}
                {
                    isMobileMenuOpen&& 
                    <nav className={`absolute top-0 right-0 w-full bg-blue-500 shadow-md flex flex-col items-start px-4 py-4 space-y-3 md:hidden z-50`}>
                        <a href="/dashboard" className="text-md me-4 font-light hover:underline my-1">Home</a>
                        <a href="/sell" className="text-md me-4 font-light hover:underline my-1">My listings</a>
                        <a href="/sell/new-listing" className="text-md me-4 font-light hover:underline my-1">New listing</a>
                    </nav>
                }

                <nav className={`hidden md:flex space-x-6`}>
                    <a href="/dashboard" className="text-md me-4 font-light hover:underline my-1">Home</a>
                    <a href="/sell" className="text-md me-4 font-light hover:underline my-1">My listings</a>
                    <a href="/sell/new-listing" className="text-md me-4 font-light hover:underline my-1">New listing</a>
                </nav>
            </header>

            <main className="flex-grow p-4">
                {children}
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center">
                &copy; {new Date().getFullYear()} Real Estate Platform
            </footer>
        </div>
    );
}