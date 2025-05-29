'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, MapPin, Bed, Bath, Square, Trash, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';


export default function MyListingsPage() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Memoize format price function
    const formatPrice = useCallback((price) => {
        return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        }).format(price);
    }, []);

    const deleteListing = async (listingId) => {
        const { error } = await supabase
            .from("listings")
            .delete()
            .eq("id", listingId);

        if (error) {
            console.error("Error deleting listing:", error.message);
            throw error;
        }
        console.log("Listing deleted successfully:", listingId);
        // Remove the deleted listing from the state
        setListings((prevListings) => 
            prevListings.filter((listing) => listing.id !== listingId)
        );
        // Optionally, you can show a success message or update the UI
        alert("Listing deleted successfully");
        return true;
    };

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            const user = localStorage.getItem('user');
            const email = user ? JSON.parse(user).email : null;
            console.log(email)

            if (!user) {
                setListings([]);
                setLoading(false);
                return;
            }

            // Query listings where agent.email matches the stored email
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .contains('agent', { email });

            if (error) {
                setListings([]);
            } else {
                setListings(data);
            }
            setLoading(false);
        };

        fetchListings();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className='text-blue-800 font-bold text-2xl px-3'>My Listings</h1>
            {listings.length === 0 ? (
                <p>No listings found.</p>
            ) : (
                <ul className='flex flex-wrap gap-2 m-auto p-4'>
                    {listings.map((listing) => (
                        <div key={listing.id} className="bg-white rounded-lg shadow-md min-w-[20rem] overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="relative">
                                <img 
                                src={listing.image? listing.image : null} 
                                alt={listing?.title}
                                className="w-full h-48 object-cover"
                                />
                                <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteListing(listing.id);
                                }}
                                className={`absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:scale-110 transition-transform`}
                                >
                                <Trash2 size={16} fill={'none'} />
                                </button>
                                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                                {listing.status}
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2 text-gray-800">{listing.title}</h3>
                                <p className="text-2xl font-bold text-blue-600 mb-2">{formatPrice(listing.price)}</p>
                                
                                <div className="flex items-center text-gray-600 mb-3">
                                <MapPin size={16} className="mr-1" />
                                <span className="text-sm">{listing.location}</span>
                                </div>
                                
                                <div className="flex justify-between text-sm text-gray-600 mb-3">
                                {listing.bedrooms > 0 && (
                                    <div className="flex items-center">
                                    <Bed size={16} className="mr-1" />
                                    <span>{listing.bedrooms} beds</span>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <Bath size={16} className="mr-1" />
                                    <span>{listing.bathrooms} baths</span>
                                </div>
                                <div className="flex items-center">
                                    <Square size={16} className="mr-1" />
                                    <span>{listing.area} sq ft</span>
                                </div>
                                </div>
                                
                                <button
                                onClick={() => {
                                    window.location.href = `/sell/edit-listing/${listing.id}`;
                                }}
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                                >
                                    Edit Listing
                                </button>
                            </div>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
}