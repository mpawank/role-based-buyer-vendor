'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Save, X } from 'lucide-react';

export default function EditProductPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    brand: '',
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/buyer/products/${id}`);
        const data = await res.json();
        setFormData(data);
        setImagePreviews(data.images || []);
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (files: File[]) => {
    const valid = Array.from(files).filter((f) => f.size <= 5 * 1024 * 1024);
    setSelectedFiles(valid);
    const previews = valid.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'unsigned_upload'); // 🔁 Replace
    const res = await fetch('https://api.cloudinary.com/v1_1/deurwjvo4/image/upload', {
      method: 'POST',
      body: data,
    });
    const result = await res.json();
    return result.secure_url;
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const uploadedUrls = await Promise.all(selectedFiles.map(uploadToCloudinary));
      const updatedProduct = {
        ...formData,
        images: [...(formData.images || []), ...uploadedUrls],
      };

      const res = await fetch(`/api/buyer/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) throw new Error('Failed to update product');
      alert('Product updated');
      router.push(`/dashboard/buyer/products/${id}`);
    } catch (err) {
      console.error(err);
      alert('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
          </div>
          <div>
            <Label>SKU</Label>
            <Input value={formData.sku} onChange={(e) => handleChange('sku', e.target.value)} />
          </div>
          <div>
            <Label>Brand</Label>
            <Input value={formData.brand} onChange={(e) => handleChange('brand', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label>Stock</Label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="mt-6">
            <Label>Product Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {imagePreviews.map((url, index) => (
                <div key={index} className="relative group">
                  <img src={url} className="h-28 object-cover rounded border" />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileSelect(Array.from(e.target.files || []))}
              /> 
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  &nbsp;Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
