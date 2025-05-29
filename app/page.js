'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-blue-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-black text-white text-5xl">Ramos Realty</h1>
        <p className="text-white mt-4">Loading...</p>
      </div>
    </main>
  );
}
