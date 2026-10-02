"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Tag,
  Star,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products?search=${encodeURIComponent(search)}&limit=50`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch {
      alert("Error deleting product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Products Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your store catalog, variations, pricing, inventory thresholds, and SEO.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, SKU, tags..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-emerald-600"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Total Products: <strong>{products.length}</strong>
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-xs font-semibold text-slate-400">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No products found</p>
            <Link
              href="/admin/products/new"
              className="inline-block px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
            >
              Add First Product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">SKU</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const image = p.images?.[0]?.url || "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=200&q=80";
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            <Image src={image} alt={p.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              className="font-bold text-slate-900 hover:text-emerald-600 line-clamp-1 flex items-center gap-1 group"
                            >
                              <span>{p.name}</span>
                              <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 shrink-0" />
                            </Link>
                            <span className="text-[10px] text-slate-400">
                              {p.brand?.name || "Original Brand"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-600">{p.sku}</td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {p.category?.name || "General"}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-black text-slate-900 block">
                          {formatPrice(p.salePrice || p.regularPrice)}
                        </span>
                        {p.salePrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            {formatPrice(p.regularPrice)}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                            p.stock > 5
                              ? "bg-emerald-100 text-emerald-800"
                              : p.stock > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {p.stock > 0 ? `${p.stock} units` : "Out of Stock"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {p.isPublished ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                            <XCircle className="w-3.5 h-3.5" />
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
