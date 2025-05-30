'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { ArrowRight, FileImageIcon } from 'lucide-react';

export default function UploadPage() {
  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    type: '',
    status: '',
    description: '',
    yearBuilt: '',
    agent_name: '',
    agent_phone: '',
    agent_email: '',
    agent_rating: '',
    features: '',
  });

  const [imageFiles, setImageFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFiles(e.target.files);
  };

  const uploadImages = async () => {
    if (!imageFiles || imageFiles.length === 0) return [];

    const uploadedURLs = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const filePath = `property-images/${uuidv4()}-${file.name}`;

      try {
        const { data, error } = await supabase.storage
          .from('listing-storage')
          .upload(filePath, file);

        if (error) {
          console.error(`Failed to upload image ${file.name}:`, error.message);
          continue; // Skip this file and move on
        }

        const { data: publicUrlData, error: urlError } = supabase.storage
          .from('listing-storage')
          .getPublicUrl(filePath);

        if (urlError || !publicUrlData?.publicUrl) {
          console.error(`Failed to retrieve public URL for ${file.name}:`, urlError?.message);
          continue;
        }

        uploadedURLs.push(publicUrlData.publicUrl);
      } catch (err) {
        console.error(`Unexpected error uploading ${file.name}:`, err.message);
        continue;
      }
    }

    return uploadedURLs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = await uploadImages();

      const newProperty = {
        title: form.title,
        price: parseInt(form.price),
        location: form.location,
        bedrooms: parseInt(form.bedrooms),
        bathrooms: parseInt(form.bathrooms),
        area: parseInt(form.area),
        type: form.type,
        status: form.status,
        image: imageUrls[0] || '',
        description: form.description,
        yearbuilt: parseInt(form.yearBuilt),
        agent: {
          name: form.agent_name,
          phone: form.agent_phone,
          email: form.agent_email,
          rating: parseFloat(form.agent_rating)
        },
        features: form.features.split(',').map((f) => f.trim()),
        images: imageUrls
      };

      const { error } = await supabase.from('listings').insert([newProperty]);

      if (error) {
        console.error('Listing insert error:', error.message);
        alert('Upload failed: ' + error.message);
      } else {
        console.log('Listing uploaded successfully!');
        alert('Listing uploaded!');
        router.push('/dashboard');
      }

    } catch (err) {
      console.error('Unexpected error during listing upload:', err.message);
      alert('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Upload Property</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input name="title" placeholder="Title" onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 rounded input" required />
        <input name="price" placeholder="Price" onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 rounded input" required />
        <input name="location" placeholder="Location" onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 rounded input" required />
        <input name="bedrooms" placeholder="Bedrooms" onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 rounded input" />
        <input name="bathrooms" placeholder="Bathrooms" onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 rounded input" />
        <input name="area" placeholder="Area (sqft)" onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 rounded input" />
        <select name="type" placeholder="Type" onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 rounded input" >
            <option value="">Select Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="commercial">Commercial</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="penthouse">Penthouse</option>
            <option value="commercial">Commercial</option>
        </select>
        <select
        name="status"
        onChange={handleChange}
        className="border border-gray-300 hover:border-blue-300 p-2 rounded input"
        >
            <option value="">Select Status</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
        </select>

        <input name="yearBuilt" placeholder="Year Built" onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 rounded input" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="input col-span-2" />

        <label htmlFor="file" className="col-span-2 flex flex-col justify-center p-2 items-center bg-blue-600 border border-gray-300 hover:border-blue-300 rounded cursor-pointer">
          <span className="text-white my-auto">
          <FileImageIcon className="inline mr-2 my-auto" size={20} />
          Upload Images
          </span>
          <input id='file' type="file" accept="image/*" multiple onChange={handleFileChange} className="sr-only col-span-2" />
        </label>

        <hr className="col-span-2 my-4" />

        <input name="agent_name" placeholder="Agent Name" onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 rounded input" />
        <input name="agent_phone" placeholder="Agent Phone" onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 rounded input" />
        <input name="agent_email" placeholder="Agent Email" onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 rounded input" />
        <input name="agent_rating" placeholder="Agent Rating" onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 rounded input" />

        <input name="features" placeholder="Features (comma separated)" onChange={handleChange} className="input col-span-2 border border-gray-300 hover:border-blue-300 p-2 rounded" />

        <button type="submit" className="col-span-2 mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
          {loading ? 'Uploading...' : 'Submit Listing'}
          <ArrowRight className="inline ml-2" size={20} />
        </button>
      </form>
    </div>
  );
}


//  border border-gray-300 hover:border-blue-300 p-2 rounded