
'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BuyerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUser(data);
      setPreview(data.image);
    };
    fetchProfile();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      let uploadedImageUrl = user.image;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', 'unsigned_upload'); // Replace

        const uploadRes = await fetch('https://api.cloudinary.com/v1_1/deurwjvo4/image/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        uploadedImageUrl = uploadData.secure_url;
      }

      const token = localStorage.getItem('token');
      const res = await fetch('/api/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          image: uploadedImageUrl,
        }),
      });

      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || 'Update failed');
      alert('Profile updated');
      setUser(updated);
    } catch (err) {
      console.error(err);
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Edit Profile</h1>
      <div>
        <Label>Name</Label>
        <Input
          value={user.name || ''}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
      </div>

      <div>
        <Label>Profile Picture</Label>
        {preview && <img src={preview} alt="Preview" className="h-24 w-24 rounded-full object-cover mt-2" />}
        <Input type="file" accept="image/*" onChange={handleImageSelect} className="mt-2" />
      </div>

      <Button onClick={handleUpdate} disabled={saving} className="mt-4">
        {saving ? 'Saving...' : (
          <>
            <Save className="w-4 h-4 mr-1" /> Save
          </>
        )}
      </Button>
    </div>
  );
}