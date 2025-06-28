'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type ProductType = {
  _id: string;
  name: string;
  buyerId?: { name: string; email: string };
  assignedTo?: { name: string; email: string };
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/admin/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch');

        setProducts(data.products);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Product Name</th>
            <th className="p-2 border">Buyer</th>
            <th className="p-2 border">Assigned Vendor</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t hover:bg-gray-50">
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">
                {p.buyerId?.name || 'Unknown'} <br />
                <span className="text-xs text-gray-600">{p.buyerId?.email || ''}</span>
              </td>
              <td className="p-2 border">
                {p.assignedTo?.name || 'Unassigned'} <br />
                {p.assignedTo?.email && (
                  <span className="text-xs text-gray-600">{p.assignedTo.email}</span>
                )}
              </td>
              <td className="p-2 border">
                <Link
                  href={`/dashboard/admin/assign/${p._id}`}
                  className="text-blue-600 underline"
                >
                  Assign
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
