'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { LogOut, Home, PackageCheck, Settings, User } from 'lucide-react';

type UserType = {
  email: string;
  role: string;
  name?: string;
  image?: string;
};

export default function VendorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwt.decode(token) as UserType;
      if (decoded?.role !== 'vendor') {
        router.push('/login');
        return;
      }

      fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error('Fetch user error:', data.error);
            router.push('/login');
          } else {
            setUser({
              email: data.email,
              role: data.role,
              name: data.name,
              image: data.image,
            });
          }
        });
    } catch {
      router.push('/login');
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b">
          {user.image && (
            <img src={user.image} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
          )}
          <div>
            <p className="text-md font-semibold text-purple-700">{user.name || 'Vendor'}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <SidebarLink icon={<Home size={18} />} href="/dashboard/vendor" label="Dashboard" />
          <SidebarLink icon={<User size={18} />} href="/profile" label="Profile" />
          <SidebarLink icon={<PackageCheck size={18} />} href="/products" label="My Products" />
          <SidebarLink icon={<Settings size={18} />} href="/vendor-settings" label="Settings" />
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 p-2 rounded-md w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-2 text-purple-700">
          Welcome, {user.name || user.email}
        </h1>
        <p className="text-gray-600 text-sm">Role: {user.role}</p>
      </main>
    </div>
  );
}

function SidebarLink({ icon, href, label }: { icon: React.ReactNode; href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
