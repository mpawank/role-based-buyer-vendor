'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

type UserType = {
  email: string;
  role: string;
  name?: string;
  image?: string;
};

export default function BuyerProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({ name: '', image: '' });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const decoded = jwt.decode(token) as UserType;
    if (decoded?.role !== 'buyer') {
      router.push('/login');
      return;
    }

    fetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setFormData({ name: data.name || '', image: data.image || '' });
        setLoading(false);
      });
  }, [router]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setUser(updated);
      setEditMode(false);
      alert('Profile updated!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user?.image && (
            <img
              src={user.image}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
          )}

          <div>
            <Label>Email</Label>
            <Input value={user?.email} disabled />
          </div>

          <div>
            <Label>Role</Label>
            <Input value={user?.role} disabled />
          </div>

          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={!editMode}
            />
          </div>

          <div>
            <Label>Image URL</Label>
            <Input
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              disabled={!editMode}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {editMode ? (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Save</Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
