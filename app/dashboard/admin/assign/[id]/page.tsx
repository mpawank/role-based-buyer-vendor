'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function AssignVendorPage() {
  const { id } = useParams();
  const router = useRouter();
  type Vendor = { _id: string; name: string; email: string };
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVendors = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/vendors', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error('Invalid vendor response:', data);
        return;
      }

      setVendors(data);
    };

    fetchVendors();
  }, []);

  const assignProduct = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    const res = await fetch(`/api/admin/products/assign/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ vendorId: selectedVendor }),
    });

    if (res.ok) {
      alert('Product assigned successfully');
      router.push('/dashboard/admin');
    } else {
      const err = await res.json();
      alert('Error: ' + err.error);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Assign Product to Vendor</h1>

      <Label>Select Vendor:</Label>
      <select
        className="w-full p-2 border rounded mt-2"
        value={selectedVendor}
        onChange={(e) => setSelectedVendor(e.target.value)}
      >
        <option value="">-- Select Vendor --</option>
        {vendors.map((vendor: any) => (
          <option key={vendor._id} value={vendor._id}>
            {vendor.name} ({vendor.email})
          </option>
        ))}
      </select>

      <Button onClick={assignProduct} disabled={!selectedVendor || loading} className="mt-4">
        {loading ? 'Assigning...' : 'Assign'}
      </Button>
    </div>
  );
}
