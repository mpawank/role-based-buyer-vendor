'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Upload,
  X,
  Save,
  Eye,
  Package,
  Image as ImageIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProductForm = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    slug: '',
    price: '',
    stock: '',
    discount: '',
    comparePrice: '',
    costPrice: '',
    weight: '',
    brand: '',
    categories: [],
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === '' ? '' : value,
      ...(field === 'name' && { slug: generateSlug(value) }),
    }));
  };

  const handleFileSelect = (files: File[]) => {
    const validFiles = Array.from(files).filter((file) => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/avif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles(validFiles);
    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'unsigned_upload'); // 🔁 Replace with real preset
    const res = await fetch('https://api.cloudinary.com/v1_1/deurwjvo4/image/upload', { // 🔁 Replace
      method: 'POST',
      body: data,
    });
    const result = await res.json();
    return result.secure_url;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const imageUrls = await Promise.all(selectedFiles.map(uploadToCloudinary));

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discount: parseFloat(formData.discount),
        comparePrice: parseFloat(formData.comparePrice),
        costPrice: parseFloat(formData.costPrice),
        weight: parseFloat(formData.weight),
        images: imageUrls,
      };

      const res = await fetch('/api/buyer/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create product');
      }

      alert('Product created successfully!');
      router.push('/dashboard/buyer/products');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to create product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'general', label: 'General', icon: Package },
                { id: 'inventory', label: 'Inventory', icon: Eye },
                { id: 'images', label: 'Images', icon: ImageIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'general' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="SKU"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange('price', e.target.value === '' ? '' : parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) =>
                    handleInputChange('stock', e.target.value === '' ? '' : parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Discount"
                  value={formData.discount}
                  onChange={(e) =>
                    handleInputChange('discount', e.target.value === '' ? '' : parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Compare Price"
                  value={formData.comparePrice}
                  onChange={(e) =>
                    handleInputChange('comparePrice', e.target.value === '' ? '' : parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Cost Price"
                  value={formData.costPrice}
                  onChange={(e) =>
                    handleInputChange('costPrice', e.target.value === '' ? '' : parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Weight"
                  value={formData.weight}
                  onChange={(e) =>
                    handleInputChange('weight', e.target.value === '' ? '' : parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            {activeTab === 'images' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8"
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    handleFileSelect(files as File[]);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-sm font-medium text-gray-700">Drag & drop or</p>
                  <button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Browse
                  </button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      handleFileSelect(files as File[]);
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Preview</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-6 gap-2">
          <button onClick={() => router.back()} className="px-6 py-2 border border-gray-300 rounded-lg text-sm">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Product
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
