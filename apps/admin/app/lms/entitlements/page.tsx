'use client';

import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';

interface CreateProductForm {
  name: string;
  slug: string;
  description: string;
}

interface ModalErrors {
  name?: string;
  slug?: string;
  submit?: string;
}

const generateSlugFromName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

const SkeletonProductCard = () => (
  <div className="bg-card border border-slate-800 rounded-xl p-5 animate-pulse">
    <div className="h-5 bg-slate-700 rounded w-48 mb-3" />
    <div className="h-4 bg-slate-700 rounded w-32 mb-4" />
    <div className="grid grid-cols-3 gap-2 mb-3">
      <div className="h-12 bg-slate-700 rounded" />
      <div className="h-12 bg-slate-700 rounded" />
      <div className="h-12 bg-slate-700 rounded" />
    </div>
    <div className="h-8 bg-slate-700 rounded" />
  </div>
);

const SkeletonTableRow = () => (
  <tr className="border-b border-slate-800">
    <td className="px-4 py-2">
      <div className="h-4 bg-slate-700 rounded w-32 animate-pulse" />
    </td>
    <td className="px-4 py-2">
      <div className="h-4 bg-slate-700 rounded w-24 animate-pulse" />
    </td>
    <td className="px-4 py-2">
      <div className="h-6 bg-slate-700 rounded w-40 animate-pulse" />
    </td>
  </tr>
);

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProductForm) => void;
  isLoading: boolean;
  errors: ModalErrors;
}

const CreateProductModal = ({ isOpen, onClose, onSubmit, isLoading, errors }: CreateProductModalProps) => {
  const [form, setForm] = useState<CreateProductForm>({
    name: '',
    slug: '',
    description: '',
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm({
      ...form,
      name,
      slug: generateSlugFromName(name),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const resetForm = () => {
    setForm({
      name: '',
      slug: '',
      description: '',
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1f29] border border-slate-800 rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Create Product</h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.submit && (
            <div className="p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Product Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="Product name"
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors"
              placeholder="auto-generated"
              disabled={isLoading}
            />
            {errors.slug && <p className="text-red-400 text-sm mt-1">{errors.slug}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-gold transition-colors resize-none"
              placeholder="Product description"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function EntitlementsManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalErrors, setModalErrors] = useState<ModalErrors>({});

  const { data, isLoading, error } = trpc.lms.entitlement.getMyEntitlements.useQuery();
  const createProductMutation = trpc.lms.entitlement.adminCreateProduct.useMutation();
  const utils = trpc.useUtils();

  const handleCreateProduct = async (formData: CreateProductForm) => {
    setModalErrors({});

    if (!formData.name.trim()) {
      setModalErrors({ name: 'Product name is required' });
      return;
    }

    if (!formData.slug.trim()) {
      setModalErrors({ slug: 'Slug is required' });
      return;
    }

    try {
      await createProductMutation.mutateAsync({
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
      });

      await utils.lms.entitlement.getMyEntitlements.invalidate();
      setIsModalOpen(false);
      setModalErrors({});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setModalErrors({ submit: errorMessage });
    }
  };

  const products = data?.products || [];
  const entitlements = data?.entitlements || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Entitlements</h1>
          <p className="text-slate-400">Manage products and user access entitlements</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors disabled:opacity-50"
          disabled={createProductMutation.isPending}
        >
          Create Product
        </button>
      </div>

      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProduct}
        isLoading={createProductMutation.isPending}
        errors={modalErrors}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Products</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">
              Failed to load products: {error.message}
            </div>
          )}

          {isLoading && !data ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <SkeletonProductCard key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-card border border-slate-800 rounded-xl p-8 text-center">
              <p className="text-slate-400 mb-4">No products yet.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors inline-block text-sm"
              >
                Create Your First Product
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="bg-card border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
                >
                  <div className="mb-3">
                    <h3 className="text-white font-medium">{product.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">Slug: {product.slug}</p>
                    {product.description && (
                      <p className="text-sm text-slate-400 mt-2 line-clamp-2">{product.description}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                    <div className="bg-slate-900 rounded p-2">
                      <div className="text-slate-400 text-xs">Courses</div>
                      <div className="text-white font-semibold">{product.courseCount || 0}</div>
                    </div>
                    <div className="bg-slate-900 rounded p-2">
                      <div className="text-slate-400 text-xs">Users</div>
                      <div className="text-white font-semibold">{product.userCount || 0}</div>
                    </div>
                    <div className="bg-slate-900 rounded p-2">
                      <div className="text-slate-400 text-xs">Created</div>
                      <div className="text-xs text-slate-300">{product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors font-medium">
                      Edit
                    </button>
                    <button className="flex-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors font-medium">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">User Entitlements</h2>
          <div className="bg-card border border-slate-800 rounded-xl overflow-hidden">
            {isLoading && !data ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900">
                      <th className="px-4 py-2 text-slate-300 font-semibold">Email</th>
                      <th className="px-4 py-2 text-slate-300 font-semibold">Product</th>
                      <th className="px-4 py-2 text-slate-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(4)].map((_, i) => (
                      <SkeletonTableRow key={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : entitlements.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-slate-400 text-sm">No entitlements granted yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900">
                      <th className="px-4 py-2 text-slate-300 font-semibold">Email</th>
                      <th className="px-4 py-2 text-slate-300 font-semibold">Product</th>
                      <th className="px-4 py-2 text-slate-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entitlements.map((entitlement: any) => (
                      <tr key={entitlement.id} className="border-b border-slate-800 hover:bg-slate-900 transition-colors">
                        <td className="px-4 py-2 text-white text-xs">{entitlement.userEmail || entitlement.userId}</td>
                        <td className="px-4 py-2 text-slate-300 text-xs">{entitlement.productName}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-1">
                            <button className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors font-medium">
                              Edit
                            </button>
                            <button className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors font-medium">
                              Revoke
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && entitlements.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
                <div>Showing {entitlements.length} entitlement{entitlements.length !== 1 ? 's' : ''}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
