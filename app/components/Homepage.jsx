'use client';
import React from 'react'
import { Search, MapPin, Bed, Bath, Square, Heart, Filter } from 'lucide-react';
import { useMemo } from 'react';
import PropertyCard from './Property';

const HomePage = ({ loggedIn, properties, searchQuery, filters, handleSearchChange, handleFilterChange, clearAllFilters, handleLogout }) =>{
    const [favoriteIds, setFavoriteIds] = React.useState([]);

    // Filter properties based on search query and filters
    const filteredProperties = useMemo(() => {
      return properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||property.location.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesType = filters.type === 'all' || property.type === filters.type;
        const matchesStatus = filters.status === 'all' || property.status === filters.status;
        const matchesMinPrice = !filters.minPrice || property.price >= parseInt(filters.minPrice, 10);
        const matchesMaxPrice = !filters.maxPrice || property.price <= parseInt(filters.maxPrice, 10);
        const matchesBedrooms = filters.bedrooms === 'all' || property.bedrooms >= parseInt(filters.bedrooms, 10);

        return matchesSearch && matchesType && matchesStatus && matchesMinPrice && matchesMaxPrice && matchesBedrooms;
      });
    }, [properties, searchQuery, filters]);

    return (
        <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-blue-600">RamosRealty</h1>
                <nav className="hidden md:flex space-x-6">
                <a href="/dashboard" className="text-gray-600 hover:text-blue-600">Home</a>
                <a href="/sell" className="text-gray-600 hover:text-blue-600">Sell</a>
                    {
                        loggedIn? <a onClick= { handleLogout } className="text-gray-600 hover:text-blue-600 cursor-pointer">Logout</a>
                        : <a href='/' className="text-gray-600 hover:text-blue-600 cursor-pointer">Login</a>
                    }
                </nav>
            </div>
            </div>
        </header>

        {/* Hero Section */}
        <section className="bg-blue-800 text-white py-16">
            <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your Dream Home
            </h2>
            <p className="text-xl mb-8">
                Discover the perfect property from our extensive collection
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
                <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by location, property type, or keyword..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                </div>
            </div>
            </div>
        </section>

        {/* Filters */}
        <section className="bg-white py-6 shadow-sm">
            <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-4 items-center">
                <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="studio">Studio</option>
                <option value="commercial">Commercial</option>
                </select>

                <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                <option value="all">Buy or Rent</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
                </select>

                <input
                type="number"
                placeholder="Min Price"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />

                <input
                type="number"
                placeholder="Max Price"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />

                <select
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                >
                <option value="all">Any Bedrooms</option>
                <option value="1">1+ Bedrooms</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                </select>

                <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                Clear Filters
                </button>
            </div>
            </div>
        </section>

        {/* Properties Grid */}
        <section className="py-12">
            <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800">
                Properties ({filteredProperties.length})
                </h3>
                <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-600" />
                <span className="text-gray-600">Sort by: Latest</span>
                </div>
            </div>

            {filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
                <button
                    onClick={clearAllFilters}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Clear All Filters
                </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                    <PropertyCard
                        key={property.id}
                        property={property}
                        isFavorite={favoriteIds.includes(property.id)}
                        onToggleFavorite={() => {
                            setFavoriteIds(prev =>
                                prev.includes(property.id)
                                    ? prev.filter(id => id !== property.id)
                                    : [...prev, property.id]
                            );
                        }}
                    />
                ))}
                </div>
            )}
            </div>
        </section>
        
        <footer className="bg-gray-800 text-white py-12">
            <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                <h4 className="text-xl font-bold mb-4">Ramos Realty</h4>
                <p className="text-gray-400">Your trusted partner in finding the perfect property.</p>
                </div>
                <div>
                <h5 className="font-semibold mb-3">Services</h5>
                <ul className="space-y-2 text-gray-400">
                    <li>Buy Property</li>
                    <li>Rent Property</li>
                    <li>Sell Property</li>
                    <li>Property Management</li>
                </ul>
                </div>
                <div>
                <h5 className="font-semibold mb-3">Company</h5>
                <ul className="space-y-2 text-gray-400">
                    <li>About Us</li>
                    <li>Our Team</li>
                    <li>Careers</li>
                    <li>Contact</li>
                </ul>
                </div>
                <div>
                <h5 className="font-semibold mb-3">Contact</h5>
                <div className="space-y-2 text-gray-400">
                    <p>+234 800 123 4567</p>
                    <p>info@realtyhub.com</p>
                    <p>Lagos, Nigeria</p>
                </div>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 Rasmos Realty. All rights reserved.</p>
            </div>
            </div>
        </footer>
        </div>
    );
}
export default HomePage;