'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import jwt from "jsonwebtoken";

export default function ProductsListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buyerId, setBuyerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No token found");

        const decoded = jwt.decode(token) as { buyerId: string };
        const buyerId = decoded?.buyerId;
        if (!buyerId) throw new Error("Invalid token");
        setBuyerId(buyerId);

        const res = await axios.get('/api/buyer/products', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(res.data.products);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Products</CardTitle>
          <CardDescription>
            View, manage, and update products.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 pb-4">
            <Input placeholder="Search products..." className="max-w-sm" />
            <Button variant="outline">Filter</Button>
            <Button
              onClick={() => {
                if (buyerId) {
                  router.push(`/dashboard/buyer/${buyerId}/products/add`);
                }
              }}
            >
              Add Product
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Stock</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(products ?? []).map((product) => (
                    <tr key={product._id || product.id} className="border">
                      <td className="p-2 border">{product.name}</td>
                      <td className="p-2 border">{product.stock}</td>
                      <td className="p-2 border">₹{product.price}</td>
                      <td className="p-2 border space-x-2">
                        <Link
                          href={
                        
                             `/dashboard/buyer/${buyerId}/products/${product._id}`
                              
                          }
                          className="text-blue-600"
                          aria-disabled={!buyerId}
                          tabIndex={!buyerId ? -1 : undefined}
                        >
                          View
                        </Link>
                        <Link href={`/dashboard/buyer/${buyerId}/products/${product._id}/edit`} className="text-red-600">Edit</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}