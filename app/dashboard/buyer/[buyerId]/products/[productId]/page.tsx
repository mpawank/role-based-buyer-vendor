'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import axios from 'axios';

export default function ViewProductPage() {
  const router = useRouter();
  const params = useParams();
  const { buyerId, productId } = params as { buyerId: string; productId: string };

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/buyer/products/${productId}`);
        setProduct(res.data.product); // ✅ FIX: Access the nested "product" field
      } catch (err: any) {
        setError(err.message || 'Error loading product');
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>ID: {productId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><strong>Name:</strong> {product.name}</div>
          <div><strong>SKU:</strong> {product.sku}</div>
          <div><strong>Slug:</strong> {product.slug}</div>
          <div><strong>Brand:</strong> {product.brand}</div>
          <div><strong>Price:</strong> ₹{product.price}</div>
          <div><strong>Stock:</strong> {product.stock}</div>
          <div><strong>Discount:</strong> {product.discount}%</div>
          <div><strong>Compare Price:</strong> ₹{product.comparePrice}</div>
          <div><strong>Cost Price:</strong> ₹{product.costPrice}</div>
          <div><strong>Weight:</strong> {product.weight}kg</div>

          {product.images?.length > 0 && (
            <div className="space-y-2">
              <strong>Images:</strong>
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Product Image ${index + 1}`}
                    className="rounded-md border h-32 object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pt-6">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Link href={`/dashboard/buyer/${buyerId}/products/${productId}/edit`}>
              <Button className="ml-2">Edit</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
