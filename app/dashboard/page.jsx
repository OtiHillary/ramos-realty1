'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropertyDetails from '../components/Propertydetails';
import { Search, MapPin, Bed, Bath, Square, Heart, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import HomePage from '../components/Homepage';

const RealEstatePlatform = () => {
    const [properties, setProperties] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
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

    // Memoize filter handlers
    const handleFilterChange = useCallback((filterKey, value) => {
        console.log(`Filter changed: ${filterKey} = ${value}`);
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

return (
    <div className="font-sans">
        <HomePage
            properties={properties}
            searchQuery={searchQuery}
            loggedIn={loggedIn}
            filters={filters}
            handleSearchChange={handleSearchChange}
            handleFilterChange={handleFilterChange}
            clearAllFilters={clearAllFilters}
            handleLogout={handleLogout}
        />
    </div>
);
};

export default RealEstatePlatform;