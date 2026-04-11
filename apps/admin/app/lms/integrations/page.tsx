import React from 'react';

export default function Integrations() {
  const webhookEvents = [
    { id: 1, source: 'Stripe', eventType: 'payment.completed', status: 'success', receivedAt: '2024-04-11 14:32:00' },
    { id: 2, source: 'SendGrid', eventType: 'email.delivered', status: 'success', receivedAt: '2024-04-11 14:28:15' },
    { id: 3, source: 'Stripe', eventType: 'subscription.created', status: 'success', receivedAt: '2024-04-11 14:15:42' },
    { id: 4, source: 'Auth0', eventType: 'user.created', status: 'success', receivedAt: '2024-04-11 14:05:33' },
    { id: 5, source: 'SendGrid', eventType: 'email.opened', status: 'success', receivedAt: '2024-04-11 13:58:22' },
  ];

  const apiKeys = [
    { id: 1, name: 'Mobile App API', prefix: 'sk_mobile_***', lastUsed: '2024-04-11 10:15', createdAt: '2024-01-05' },
    { id: 2, name: 'Third Party Integration', prefix: 'sk_3rd_party_***', lastUsed: '2024-04-10 16:42', createdAt: '2024-02-15' },
    { id: 3, name: 'Internal Tools', prefix: 'sk_internal_***', lastUsed: '2024-04-09 09:23', createdAt: '2024-01-01' },
  ];

  const getStatusColor = (status: string) => {
    return status === 'success' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Integrations</h1>
          <p className="text-slate-400">Manage webhooks, API keys, and external integrations</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Webhook Events</h2>
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-sm transition-colors">
              View All Events
            </button>
          </div>

          <div className="bg-card border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900">
                    <th className="px-6 py-3 text-slate-300 font-semibold">Source</th>
                    <th className="px-6 py-3 text-slate-300 font-semibold">Event Type</th>
                    <th className="px-6 py-3 text-slate-300 font-semibold">Status</th>
                    <th className="px-6 py-3 text-slate-300 font-semibold">Received At</th>
                    <th className="px-6 py-3 text-slate-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {webhookEvents.map((event) => (
                    <tr key={event.id} className="border-b border-slate-800 hover:bg-slate-900 transition-colors">
                      <td className="px-6 py-3 text-white font-medium">{event.source}</td>
                      <td className="px-6 py-3 text-slate-300">{event.eventType}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-300 text-xs">{event.receivedAt}</td>
                      <td className="px-6 py-3">
                        <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">API Keys</h2>
            <button className="px-4 py-2 bg-gold text-black rounded-lg font-medium hover:bg-yellow-400 transition-colors">
              Create API Key
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div key={key.id} className="bg-card border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">{key.name}</h3>
                    <p className="text-sm text-slate-400 mt-1 font-mono">{key.prefix}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <div className="text-slate-400 text-xs">Last Used</div>
                    <div className="text-white">{key.lastUsed}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs">Created</div>
                    <div className="text-white">{key.createdAt}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                    Regenerate
                  </button>
                  <button className="flex-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">
                    Copy
                  </button>
                  <button className="flex-1 px-3 py-1 bg-red-900 hover:bg-red-800 text-red-200 rounded text-xs transition-colors">
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Integration Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="text-white font-medium text-sm">Stripe</div>
                  <div className="text-slate-400 text-xs">Payment processing</div>
                </div>
              </div>
              <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">Configure</button>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="text-white font-medium text-sm">SendGrid</div>
                  <div className="text-slate-400 text-xs">Email delivery</div>
                </div>
              </div>
              <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">Configure</button>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="text-white font-medium text-sm">Auth0</div>
                  <div className="text-slate-400 text-xs">Authentication</div>
                </div>
              </div>
              <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs transition-colors">Configure</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
