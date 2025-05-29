'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditListing() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchListing = async () => {
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
    };
    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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
        : JSON.stringify(form.agent),
    };

    delete cleanedForm.id; // Remove id from update payload
    delete cleanedForm.created_at; // Remove created_at if present

    console.log(cleanedForm);
    const { error } = await supabase
      .from('listings')
      .update(cleanedForm)
      .eq('id', id);

    if (error) alert('Update failed');
    else router.push('/my-listings');
  };

  if (!listing) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold text-blue-700">Edit Listing</h2>

      <input name="title" value={form.title || ''} onChange={handleChange} className="border p-2 w-full rounded border-gray-300" />
      <input name="price" value={form.price || ''} onChange={handleChange} className="border p-2 w-full rounded border-gray-300" />
      <input name="location" value={form.location || ''} onChange={handleChange} className="border p-2 w-full rounded border-gray-300" />
      <textarea name="description" value={form.description || ''} onChange={handleChange} className="border p-2 w-full rounded border-gray-300" />

      {/* Add similar inputs for other fields */}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  );
}
