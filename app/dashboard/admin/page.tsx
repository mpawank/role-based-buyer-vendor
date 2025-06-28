'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/admin/products', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>Name</th>
            <th>Buyer</th>
            <th>Assigned Vendor</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => (
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.buyerEmail}</td>
              <td className="p-2">{p.assignedTo?.name || 'Unassigned'}</td>
              <td className="p-2">
                <Link href={`/dashboard/admin/assign/${p._id}`} className="text-blue-600 underline">Assign</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
