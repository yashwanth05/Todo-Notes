"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Components() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if the user isn't logged in
    if (!localStorage.getItem('userId')) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <h1 className="text-3xl font-semibold mb-6">Welcome to Your Dashboard</h1>
      <div className="gap-10 flex flex-row">
        <div>
        <button
          onClick={() => router.push('/todo')}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-200"
        >
          Add Todo
        </button>
        </div>
        <div>
        <button
          onClick={() => router.push('/note')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Add Note
        </button>
        </div>
      </div>
    </div>
  );
}
