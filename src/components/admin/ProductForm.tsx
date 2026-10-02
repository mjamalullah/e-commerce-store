"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  Star,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface ProductFormProps {
  initialData?: any;
  categories: any[];
  brands: any[];
}

export default function ProductForm({
  initialData,
  categories,
  brands,
}: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData?.id);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [barcode, setBarcode] = useState(initialData?.barcode || "");
  const [shortDesc, setShortDesc] = useState(initialData?.shortDesc || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [regularPrice, setRegularPrice] = useState(initialData?.regularPrice || "");
  const [salePrice, setSalePrice] = useState(initialData?.salePrice || "");
  const [costPrice, setCostPrice] = useState(initialData?.costPrice || "");
  const [stock, setStock] = useState(initialData?.stock ?? 10);
  const [lowStockAlert, setLowStockAlert] = useState(initialData?.lowStockAlert ?? 5);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [brandId, setBrandId] = useState(initialData?.brandId || "");
  const [warranty, setWarranty] = useState(initialData?.warranty || "1 Year Official Warranty");
  const [tags, setTags] = useState(initialData?.tags || "");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [isBestSeller, setIsBestSeller] = useState(initialData?.isBestSeller ?? false);
  const [isNewArrival, setIsNewArrival] = useState(initialData?.isNewArrival ?? true);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");

  // Dynamic Lists: Images, Specs, Variants
  const [images, setImages] = useState<Array<{ url: string; alt: string }>>(
    initialData?.images?.map((i: any) => ({ url: i.url, alt: i.alt || "" })) || [
      { url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80", alt: "" },
    ]
  );
  const [specifications, setSpecifications] = useState<Array<{ name: string; value: string }>>(
    initialData?.specifications?.map((s: any) => ({ name: s.name, value: s.value })) || [
      { name: "Display", value: "AMOLED" },
    ]
  );
  const [variants, setVariants] = useState<Array<{ title: string; sku: string; price: number; stock: number; image?: string }>>(
    initialData?.variants?.map((v: any) => ({
      title: v.title,
      sku: v.sku,
      price: v.price,
      stock: v.stock,
      image: v.image || "",
    })) || []
  );

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setImages([...images, { url: imageUrlInput.trim(), alt: name }]);
    setImageUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleAddSpec = () => {
    setSpecifications([...specifications, { name: "", value: "" }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications(specifications.filter((_, idx) => idx !== index));
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        title: "Option",
        sku: `${sku}-${variants.length + 1}`,
        price: parseFloat(regularPrice || "0"),
        stock: 10,
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim() || !regularPrice) {
      setError("Product Name, SKU, and Regular Price are required");
      return;
    }

    setIsSaving(true);
    setError("");

    const payload = {
      name,
      sku,
      barcode,
      shortDesc,
      description,
      regularPrice: parseFloat(regularPrice),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      costPrice: costPrice ? parseFloat(costPrice) : null,
      stock: parseInt(stock.toString(), 10),
      lowStockAlert: parseInt(lowStockAlert.toString(), 10),
      categoryId: categoryId || null,
      brandId: brandId || null,
      warranty,
      tags,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isPublished,
      metaTitle,
      metaDescription,
      images,
      specifications: specifications.filter((s) => s.name && s.value),
      variants,
    };

    try {
      const url = isEdit ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Error saving product");
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {isEdit ? `Edit: ${name}` : "Create New Product"}
            </h1>
            <p className="text-xs text-slate-500">
              Fill in product attributes, pricing, media, and inventory controls.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 self-start cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving..." : isEdit ? "Update Product" : "Publish Product"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Primary Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Basic Info */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              General Information
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. QCY Watch GT AMOLED Smartwatch"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    SKU Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value.toUpperCase())}
                    placeholder="QCY-GT-01"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase focus:outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Barcode / EAN</label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="6957141408112"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:bg-white focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Short Tagline Description</label>
                <input
                  type="text"
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Brief 1-sentence product summary"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Detailed Description</label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key features, specifications, box contents, battery capacity..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* 2. Media Gallery */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Product Image Gallery ({images.length})</span>
            </h2>

            {/* Existing images list */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                  <Image src={img.url} alt={img.alt || name} fill className="object-cover" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-emerald-600 text-white text-[9px] font-bold rounded">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Image URL */}
            <div className="flex gap-2 text-xs">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Enter image URL (https://...)"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl"
              >
                Add Image
              </button>
            </div>
          </div>

          {/* 3. Product Variations */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Product Variations (Color / Storage)
              </h2>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            {variants.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No variants configured. Product sells as single standard item.</p>
            ) : (
              <div className="space-y-3">
                {variants.map((v, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs items-center">
                    <input
                      type="text"
                      value={v.title}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].title = e.target.value;
                        setVariants(copy);
                      }}
                      placeholder="Title (e.g. Black)"
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-medium"
                    />
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].sku = e.target.value.toUpperCase();
                        setVariants(copy);
                      }}
                      placeholder="Variant SKU"
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono uppercase"
                    />
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].price = parseFloat(e.target.value || "0");
                        setVariants(copy);
                      }}
                      placeholder="Price"
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => {
                          const copy = [...variants];
                          copy[idx].stock = parseInt(e.target.value || "0", 10);
                          setVariants(copy);
                        }}
                        placeholder="Stock"
                        className="w-20 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. Specifications */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Specifications Table
              </h2>
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {specifications.map((spec, idx) => (
                <div key={idx} className="flex gap-2 items-center text-xs">
                  <input
                    type="text"
                    value={spec.name}
                    onChange={(e) => {
                      const copy = [...specifications];
                      copy[idx].name = e.target.value;
                      setSpecifications(copy);
                    }}
                    placeholder="Feature (e.g. Battery)"
                    className="w-1/3 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => {
                      const copy = [...specifications];
                      copy[idx].value = e.target.value;
                      setSpecifications(copy);
                    }}
                    placeholder="Value (e.g. 500mAh / 10 Days)"
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Pricing, Stock, Category, SEO */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pricing */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider">Pricing (PKR)</h2>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Regular Retail Price <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={regularPrice}
                onChange={(e) => setRegularPrice(e.target.value)}
                placeholder="8999"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Discounted Sale Price
              </label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="6499"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Cost Price (Wholesale Purchase)
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="4800"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Inventory */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider">Stock & Inventory</h2>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Current Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value || "0", 10))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Low-Stock Alert Threshold</label>
              <input
                type="number"
                value={lowStockAlert}
                onChange={(e) => setLowStockAlert(parseInt(e.target.value || "0", 10))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Category & Brand */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider">Organization</h2>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Brand</label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Warranty Term</label>
              <input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                placeholder="1 Year Official Warranty"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Search Tags (Comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="watch, amoled, qcy, bluetooth"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* Visibility Badges */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h2 className="font-bold text-slate-900 uppercase tracking-wider">Display & Badges</h2>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span className="font-semibold text-slate-800">Published in Store</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span className="font-semibold text-slate-800">Featured on Homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span className="font-semibold text-slate-800">Best Seller Badge</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="rounded text-emerald-600"
              />
              <span className="font-semibold text-slate-800">New Arrival Badge</span>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
