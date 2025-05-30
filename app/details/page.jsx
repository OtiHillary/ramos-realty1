'use client'
import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, MapPin, Bed, Bath, Square, Star, Phone, Mail, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const PropertyDetails = () => {
  const [property, setProperty] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const router = useRouter();

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  }, []);

  const handleWhatsAppClick = (agentName, agentPhone, propertyTitle, propertyLocation) => {
    const message = `Hi ${agentName}! I'm interested in the property: ${propertyTitle} at ${propertyLocation}. Could you provide more details?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${agentPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const storedProperty = localStorage.getItem('selectedProperty');
    console.log('Stored Property:', storedProperty);
    if (storedProperty) {
      setProperty(JSON.parse(storedProperty));
    } else {
      router.push('/dashboard'); // redirect client-side
    }
  }, [router]);

  if (!property) return null; // Avoid rendering until property is set

    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-6">
          {/* Back button */}
          <button
            onClick={() => router.push('/dashboard')}
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
                  <a href={`tel:${property.agent.phone}`} className="flex-1 flex justify-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                    <Phone size={16} className="inline mr-2 my-auto" />
                    Call Now
                  </a>
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors" onClick={()=> handleWhatsAppClick(property.agent.name, property.agent.phone, property.title, property.location)}>
                    <MessageCircle size={16} className="inline mr-2 my-auto" />
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}


export default PropertyDetails;