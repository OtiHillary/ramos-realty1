'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, MapPin, Bed, Bath, Square, Heart, Filter, Phone, Mail, Calendar, ArrowLeft, Star, Camera } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const RealEstatePlatform = () => {
    const [properties, setProperties] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [filters, setFilters] = useState({
        type: 'all',
        status: 'all',
        minPrice: '',
        maxPrice: '',
        bedrooms: 'all'
    });

    // Memoize the search handler to prevent unnecessary re-renders
    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    // Memoize the filter properties logic to prevent recalculation on every render
    const filteredProperties = useMemo(() => {
        let filtered = properties;

        // Text search
        if (searchQuery) {
        filtered = filtered.filter(property =>
            property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.type.toLowerCase().includes(searchQuery.toLowerCase())
        );
        }

        // Apply filters
        if (filters.type !== 'all') {
        filtered = filtered.filter(property => 
            property.type.toLowerCase() === filters.type.toLowerCase()
        );
        }

        if (filters.status !== 'all') {
        filtered = filtered.filter(property => 
            property.status.toLowerCase().includes(filters.status.toLowerCase())
        );
        }

        if (filters.minPrice) {
        filtered = filtered.filter(property => property.price >= parseInt(filters.minPrice));
        }

        if (filters.maxPrice) {
        filtered = filtered.filter(property => property.price <= parseInt(filters.maxPrice));
        }

        if (filters.bedrooms !== 'all') {
        filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms));
        }

        return filtered;
    }, [searchQuery, filters, properties]);

    // Memoize the toggle favorite function
    const toggleFavorite = useCallback((propertyId) => {
        setFavorites(prev => 
        prev.includes(propertyId) 
            ? prev.filter(id => id !== propertyId)
            : [...prev, propertyId]
        );
    }, []);

    // Memoize format price function
    const formatPrice = useCallback((price) => {
        return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        }).format(price);
    }, []);

    // Memoize filter handlers
    const handleFilterChange = useCallback((filterKey, value) => {
        setFilters(prev => ({...prev, [filterKey]: value}));
    }, []);

    const clearAllFilters = useCallback(() => {
        setSearchQuery('');
        setFilters({type: 'all', status: 'all', minPrice: '', maxPrice: '', bedrooms: 'all'});
    }, []);

    useEffect(() => {
        let user = localStorage.getItem('user');
        if (!user) {
            // Redirect to login page if user is not authenticated
            setLoggedIn(false);
            setUser(null);
            window.location.href = '/';
        }
        setLoggedIn(true);
        setUser(JSON.parse(user));
        const fetchProperties = async () => {
            const { data, error } = await supabase.from('listings').select('*');

            if (error) {
                console.error('Error fetching properties:', error);
            } else {
            setProperties(data);
            }
        };

        fetchProperties();
    }, []);

  // Memoize PropertyCard component to prevent unnecessary re-renders
  const PropertyCard = React.memo(({ property }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={property.image? property.image : null} 
          alt={property?.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            favorites.includes(property.id) 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-600'
          } hover:scale-110 transition-transform`}
        >
          <Heart size={16} fill={favorites.includes(property.id) ? 'white' : 'none'} />
        </button>
        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
          {property.status}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800">{property.title}</h3>
        <p className="text-2xl font-bold text-blue-600 mb-2">{formatPrice(property.price)}</p>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 mb-3">
          {property.bedrooms > 0 && (
            <div className="flex items-center">
              <Bed size={16} className="mr-1" />
              <span>{property.bedrooms} beds</span>
            </div>
          )}
          <div className="flex items-center">
            <Bath size={16} className="mr-1" />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center">
            <Square size={16} className="mr-1" />
            <span>{property.area} sq ft</span>
          </div>
        </div>
        
        <button
          onClick={() => {
            setSelectedProperty(property);
            setCurrentPage('details');
            setSelectedImageIndex(0);
          }}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  ));

  const PropertyDetails = ({ property }) => (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={property.images[selectedImageIndex]}
                alt={property.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                {selectedImageIndex + 1} / {property.images.length}
              </div>
            </div>
            
            {property.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded cursor-pointer ${
                      selectedImageIndex === index ? 'ring-2 ring-blue-600' : ''
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Property Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
              <p className="text-4xl font-bold text-blue-600 mb-4">{formatPrice(property.price)}</p>
              
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin size={20} className="mr-2" />
                <span className="text-lg">{property.location}</span>
              </div>

              <div className="flex space-x-6 text-gray-600 mb-6">
                {property.bedrooms > 0 && (
                  <div className="flex items-center">
                    <Bed size={20} className="mr-2" />
                    <span className="text-lg">{property.bedrooms} Bedrooms</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Bath size={20} className="mr-2" />
                  <span className="text-lg">{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <Square size={20} className="mr-2" />
                  <span className="text-lg">{property.area} sq ft</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {property.agent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold">{property.agent.name}</h4>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600">{property.agent.rating} rating</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone size={16} className="mr-3 text-gray-600" />
                  <span>{property.agent.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-3 text-gray-600" />
                  <span>{property.agent.email}</span>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                  <Phone size={16} className="inline mr-2" />
                  Call Now
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors">
                  <Calendar size={16} className="inline mr-2" />
                  Schedule Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function handleLogout() {
    supabase.auth.signOut().then(() => {
      localStorage.removeItem('user');
      setLoggedIn(false);
      setUser(null);
      window.location.href = '/';
    }).catch(error => {
      console.error('Logout error:', error);
    });
  }

  const HomePage = () => (
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
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">EstateHub</h4>
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

  return (
    <div className="font-sans">
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'details' && selectedProperty && (
        <PropertyDetails property={selectedProperty} />
      )}
    </div>
  );
};

export default RealEstatePlatform;