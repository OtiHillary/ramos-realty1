'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditListing() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try { 
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();
        if (error) console.error(error);
        else {
          setListing(data);
          setForm(data);
        }        
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError(true);
      }

    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setSuccess(false);
    setError(false);

    e.preventDefault();
    // Clean and validate form before update
    const cleanedForm = {
      ...form,
      price: Number(form.price),
      yearbuilt: form.yearbuilt ? Number(form.yearbuilt) : null,
      features: Array.isArray(form.features)
        ? form.features
        : form.features?.split(',').map(f => f.trim()) ?? [],
      images: Array.isArray(form.images)
        ? form.images
        : form.images?.split(',').map(i => i.trim()) ?? [],
      agent: typeof form.agent === 'string'
        ? JSON.parse(form.agent)
        : form.agent,
    };

    delete cleanedForm.id; // Remove id from update payload
    delete cleanedForm.created_at; // Remove created_at if present

    console.log(cleanedForm);
    const { error } = await supabase
      .from('listings')
      .update(cleanedForm)
      .eq('id', id);

    if (error) setError(true);

    else {
      setLoading(false);
      setError(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/sell')
      }, 2000);
    };
  };

  if (!listing) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      {
        success &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md border-t-4 border-green-600">
              <h2 className="text-xl font-semibold text-green-600 mb-2">Listing updated successfully</h2>
              <p className="text-gray-700 mb-1">If not redirected automataically, click the button below</p>

              <div className="flex justify-end gap-4">
                <button
                    onClick={()=> router.push('/sell')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                    Ok
                </button>
              </div>
          </div>
      </div>
      }

      {
        error && 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md border-t-4 border-red-600">
              <h2 className="text-xl font-semibold text-red-600 mb-2">Error: {error.message}</h2>
              <p className="text-gray-700 mb-1">If not redirected automataically, click the button below</p>

              <div className="flex justify-end gap-4">
                <button
                    onClick={()=> router.push('/sell')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                    Ok
                </button>
              </div>
          </div>
        </div>
        }
      
      {
        loading && 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md border-t-4 border-blue-600">
              <h2 className="text-xl font-semibold text-blue-600 mb-2">Loading...</h2>
          </div>
        </div>
      }

      <h2 className="text-2xl font-bold text-blue-700">Edit Listing</h2>

      <input name="title" value={form.title || ''} onChange={handleChange} className="border p-2 m-1 w-full rounded border-gray-300" />
      <input name="price" value={form.price || ''} onChange={handleChange} className="border p-2 m-1 w-full rounded border-gray-300" />
      <input name="location" value={form.location || ''} onChange={handleChange} className="border p-2 m-1 w-full rounded border-gray-300" />
      <textarea name="description" value={form.description || ''} onChange={handleChange} className="border p-2 m-1 w-full rounded border-gray-300" />
      <input name="bedrooms" value={form.bedrooms || ''} onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 m-1 rounded input" />
      <input name="bathrooms" value={ form.bathrooms || ''} onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 m-1 rounded input" />
      <input name="area" value={ form.area || '' } onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 m-1 rounded input" />
      <select
        name="status"
        onChange={handleChange}
        value={ form.status || '' }
        className="border border-gray-300 hover:border-blue-300 p-2 m-1 rounded input"
        >
            <option value="">Select Status</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
        </select>

        <select name="type" value={ form.type || '' } placeholder="Type" onChange={handleChange} className="border border-gray-300 hover:border-blue-300 p-2 rounded input" >
          <option value="">Select Type</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="commercial">Commercial</option>
          <option value="villa">Villa</option>
          <option value="studio">Studio</option>
          <option value="penthouse">Penthouse</option>
          <option value="commercial">Commercial</option>
        </select>

      {/* Add similar inputs for other fields */}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  );
}
