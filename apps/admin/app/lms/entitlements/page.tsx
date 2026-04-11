import React from 'react';

export default function Entitlements() {
  const products = [
    { id: 1, name: 'Professional Trainer Bundle', slug: 'pro-trainer', linkedCourses: 6, linkedCertifications: 2, linkedRoadmaps: 1 },
    { id: 2, name: 'Behavioral Specialist Pack', slug: 'behavior-pack', linkedCourses: 4, linkedCertifications: 1, linkedRoadmaps: 1 },
    { id: 3, name: 'Complete K9 Mastery', slug: 'complete-mastery', linkedCourses: 10, linkedCertifications: 3, linkedRoadmaps: 2 },
    { id: 4, name: 'Agility Excellence', slug: 'agility-excel', linkedCourses: 3, linkedCertifications: 1, linkedRoadmaps: 1 },
  ];

  const userEntitlements = [
    { id: 1, userId: 'user_001', email: 'john@example.com', product: 'Professional Trainer Bundle', grantedAt: '2024-01-15', expiresAt: '2025-01-15' },
    { id: 2, userId: 'user_002', email: 'jane@example.com', product: 'Complete K9 Mastery', grantedAt: '2024-02-01', expiresAt: '2025-02-01' },
    { id: 3, userId: 'user_003', email: 'mike@example.com', product: 'Behavioral Specialist Pack', grantedAt: '2024-03-10', expiresAt: '2025-03-10' },
    { id: 4, userId: 'user_004', email: 'sarah@example.com', product: 'Agility Excellence', grantedAt: '2024-01-20', expiresAt: '2024-12-20' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Entitlements</h1>
          <p className="text-slate-400">Manage products and user access entitlements</p>
        </div>
        <button className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors">
          Create Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Products</h2>
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="bg-card border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">{product.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">Slug: {product.slug}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                  <div className="bg-slate-900 rounded p-2">
                    <div className="text-slate-400 text-xs">Courses</div>
                    <div className="text-white font-semibold">{product.linkedCourses}</div>
                  </div>
                  <div className="bg-slate-900 rounded p-2">
                    <div className="text-slate-400 text-xs">Certifications</div>
                    <div className="text-white font-semibold">{product.linkedCertifications}</div>
                  </div>
                  <div className="bg-slate-900 rounded p-2">
                    <div className="text-slate-400 text-xs">Roadmaps</div>
                    <div className="text-white font-semibold">{product.linkedRoadmaps}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">User Entitlements</h2>
          <div className="bg-card border border-slate-800 rounded-xl overflow-hidden">
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
                  {userEntitlements.map((entitlement) => (
                    <tr key={entitlement.id} className="border-b border-slate-800 hover:bg-slate-900 transition-colors">
                      <td className="px-4 py-2 text-white text-xs">{entitlement.email}</td>
                      <td className="px-4 py-2 text-slate-300 text-xs">{entitlement.product}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-1">
                          <button className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                            Edit
                          </button>
                          <button className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                            Revoke
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
              <div>Showing 4 of 4 entitlements</div>
              <div className="flex gap-2">
                <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-white text-xs transition-colors">Prev</button>
                <button className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-white text-xs transition-colors">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
