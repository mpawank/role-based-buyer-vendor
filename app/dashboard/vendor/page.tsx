'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default function VendorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwt.decode(token) as { email: string; role: string };
      if (decoded?.role !== 'vendor') {
        router.push('/login');
        return;
      }
      setUser(decoded);
    } catch {
      router.push('/login');
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">Vendor Dashboard</h1>
        {user && (
          <>
            <p className="text-gray-700 mb-2">Welcome, {user.email}</p>
            <p className="text-sm text-gray-500">Role: {user.role}</p>
            <button
              onClick={logout}
              className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
