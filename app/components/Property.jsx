'use client';
import React, { useCallback } from 'react';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import { redirect } from 'next/navigation';


// Memoize PropertyCard component to prevent unnecessary re-renders
const PropertyCard = React.memo(({
    property
}) => {

    // Memoize format price function
    const formatPrice = useCallback((price) => {
        return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        }).format(price);
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
                <img 
                    src={property.image ? property.image : null} 
                    alt={property?.title}
                    className="w-full h-48 object-cover"
                />
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
                        localStorage.setItem('selectedProperty', JSON.stringify(property));
                        redirect('/details');
                    }}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    View Details
                </button>
            </div>
        </div>
    );
})

export default PropertyCard;