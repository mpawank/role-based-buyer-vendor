'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { LogOut, Home, PackageCheck, Settings,User } from 'lucide-react';

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

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 text-xl font-bold text-purple-700 border-b">Vendor Panel</div>
        <nav className="p-4 space-y-2 flex-1">
          <SidebarLink icon={<Home size={18} />} href="/dashboard/vendor" label="Dashboard" />
           <SidebarLink icon={<User size={18} />} href="/profile" label='profile'/>
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

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-2 text-purple-700">Welcome, {user.email}</h1>
        <p className="text-gray-600 text-sm">Role: {user.role}</p>
        {/* Add vendor-specific dashboard content here */}
      </main>
    </div>
  );
}

function SidebarLink({
  icon,
  href,
  label,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
}) {
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
