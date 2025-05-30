'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropertyDetails from '../components/Propertydetails';
import { Search, MapPin, Bed, Bath, Square, Heart, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import HomePage from '../components/Homepage';

const RealEstatePlatform = () => {
    const [properties, setProperties] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
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
        try {
            const user = localStorage.getItem('user');

            if (!user) {
            setLoggedIn(false);
            setUser(null);
            window.location.href = '/';
            return;
            }

            setLoggedIn(true);
            setUser(JSON.parse(user));
        } catch (err) {
            console.log('Error accessing localStorage:', err);
            setLoggedIn(false);
            setUser(null);
            return;
        }

        const fetchProperties = async () => {
            try {
            const { data, error } = await supabase.from('listings').select('*');

            if (error) {
                setError(true)
                setErrorMessage('Server error; Likely a network problem')
                console.log('Supabase error:', error.message);
                return;
            }

            setProperties(data);
            } catch (err) {
                setError(true)
                setErrorMessage('Network or unexpected error while fetching properties:', err.message)
                console.log('Network or unexpected error while fetching properties:', err.message);
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
                {
                error &&
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md border-t-4 border-red-600">
                        <h2 className="text-xl font-semibold text-red-600 mb-2">{ errorMessage }</h2>

                        <div className="flex justify-end gap-4">
                        <button
                            onClick={()=> setError(false)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                            Ok
                        </button>
                        </div>
                    </div>
                </div>
            }
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