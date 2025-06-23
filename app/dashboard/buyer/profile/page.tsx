// app/dashboard/buyer/profile/page.tsx OR vendor/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setName(data.name || '');
        setImage(data.image || '');
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', name);
    if ((document.getElementById('file') as HTMLInputElement)?.files?.[0]) {
      formData.append('file', (document.getElementById('file') as HTMLInputElement).files![0]);
    }

    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      setImage(data.user.image);
      setMessage('Profile updated successfully');
    } else {
      setMessage('Failed to update');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Profile Picture</label>
          <input type="file" id="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} className="w-20 h-20 mt-2 rounded-full" />}
          {!preview && image && <img src={image} className="w-20 h-20 mt-2 rounded-full" />}
        </div>
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Save Changes
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
