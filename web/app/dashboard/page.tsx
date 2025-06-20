"use client";

import { useState } from 'react';

interface Policy {
  id: string;
  farmName: string;
  cropType: string;
  acreage: number;
  riskType: string;
  premium: number;
  status: 'active' | 'expired' | 'claimed';
  startDate: string;
  endDate: string;
}

export default function DashboardPage() {
  const [policies] = useState<Policy[]>([
    {
      id: '1',
      farmName: 'Green Valley Farm',
      cropType: 'Corn',
      acreage: 150,
      riskType: 'Drought',
      premium: 1875,
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    },
    {
      id: '2',
      farmName: 'Sunset Fields',
      cropType: 'Wheat',
      acreage: 80,
      riskType: 'Rainfall',
      premium: 1200,
      status: 'active',
      startDate: '2024-03-01',
      endDate: '2025-02-28'
    }
  ]);

  const [showClaimForm, setShowClaimForm] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [claimData, setClaimData] = useState({
    reason: '',
    description: '',
    damageAmount: ''
  });

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock claim submission
    alert('Claim submitted successfully! You will be contacted within 48 hours.');
    setShowClaimForm(false);
    setSelectedPolicy(null);
    setClaimData({ reason: '', description: '', damageAmount: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'expired': return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'claimed': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📋</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">My Policies</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Manage your insurance policies and submit claims when needed
          </p>
        </div>
        
        {!showClaimForm ? (
          <div className="space-y-8">
            {policies.length === 0 ? (
              <div className="glass-card p-12 rounded-2xl text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No Policies Found</h3>
                <p className="text-gray-600 mb-8 text-lg">Get started by creating your first insurance policy.</p>
                <a href="/farm" className="inline-block bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105">
                  🚀 Create Policy
                </a>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                {policies.map((policy) => (
                  <div key={policy.id} className="glass-card p-8 rounded-2xl hover:transform hover:scale-105 transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{policy.farmName}</h3>
                        <p className="text-gray-600">Policy ID: #{policy.id}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(policy.status)}`}>
                        {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">🌱 Crop Type</div>
                          <div className="font-semibold text-gray-800">{policy.cropType}</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">📏 Acreage</div>
                          <div className="font-semibold text-gray-800">{policy.acreage} acres</div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">⚠️ Risk Type</div>
                          <div className="font-semibold text-gray-800">{policy.riskType}</div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">💰 Premium</div>
                          <div className="font-semibold text-gray-800">${policy.premium}</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="text-sm text-gray-600 mb-2">📅 Coverage Period</div>
                        <div className="font-semibold text-gray-800">
                          {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {policy.status === 'active' && (
                      <button
                        onClick={() => {
                          setSelectedPolicy(policy);
                          setShowClaimForm(true);
                        }}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
                      >
                        🚨 Submit Claim
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 rounded-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚨</span>
                </div>
                <h2 className="text-3xl font-bold gradient-text mb-2">Submit Claim</h2>
                <p className="text-gray-600">Tell us about the damage to your crops</p>
              </div>
              
              {selectedPolicy && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl mb-8 border border-blue-200">
                  <h3 className="font-bold text-gray-800 mb-4 text-lg">📋 Policy Details</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">🏡 Farm</div>
                      <div className="font-semibold text-gray-800">{selectedPolicy.farmName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">🌱 Crop</div>
                      <div className="font-semibold text-gray-800">{selectedPolicy.cropType}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">⚠️ Risk Type</div>
                      <div className="font-semibold text-gray-800">{selectedPolicy.riskType}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleClaimSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    🎯 Reason for Claim
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm"
                    value={claimData.reason}
                    onChange={(e) => setClaimData({...claimData, reason: e.target.value})}
                  >
                    <option value="">Select the reason for your claim</option>
                    <option value="drought">🌵 Drought Damage</option>
                    <option value="excessive_rainfall">🌧️ Excessive Rainfall</option>
                    <option value="flooding">🌊 Flooding</option>
                    <option value="hail">🧊 Hail Damage</option>
                    <option value="other">❓ Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    📝 Description of Damage
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Please describe the damage in detail..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm"
                    value={claimData.description}
                    onChange={(e) => setClaimData({...claimData, description: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    💰 Estimated Damage Amount ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Enter estimated damage amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm"
                    value={claimData.damageAmount}
                    onChange={(e) => setClaimData({...claimData, damageAmount: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 px-8 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    📤 Submit Claim
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowClaimForm(false);
                      setSelectedPolicy(null);
                      setClaimData({ reason: '', description: '', damageAmount: '' });
                    }}
                    className="flex-1 glass py-4 px-8 rounded-xl text-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
                  >
                    ← Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 