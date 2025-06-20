"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { abi, contractAddress } from '../lib/insuranceContract';

interface Policy {
  farmer: string;
  farmName: string;
  lat: bigint;
  lng: bigint;
  acreage: bigint;
  riskType: string;
  rainfallThreshold: bigint;
  startDate: bigint;
  endDate: bigint;
  premiumPaid: bigint;
  claimed: boolean;
  active: boolean;
}

interface PolicyWithId extends Policy {
  id: number;
}

export default function DashboardPage() {
  const { address } = useAccount();
  const [policies, setPolicies] = useState<PolicyWithId[]>([]);
  const [loading, setLoading] = useState(true);

  // Use ethers.js directly to fetch all policies for the user
  useEffect(() => {
    const fetchPolicies = async () => {
      console.log('Testing contract access with ethers.js...');
      console.log('Address:', address);

      if (!address) {
        console.log('Missing address');
        setLoading(false);
        return;
      }

      try {
        // Create ethers provider and contract instance
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        
        // First, get all policy IDs for this farmer
        console.log('Fetching farmer policies...');
        const farmerPolicyIds = await contract.getFarmerPolicies(address);
        console.log('Farmer policy IDs:', farmerPolicyIds);

        if (!farmerPolicyIds || farmerPolicyIds.length === 0) {
          console.log('No policies found for this address');
          setPolicies([]);
          setLoading(false);
          return;
        }

        // Fetch each policy
        const fetchedPolicies: PolicyWithId[] = [];
        
        for (let i = 0; i < farmerPolicyIds.length; i++) {
          const policyId = Number(farmerPolicyIds[i]);
          console.log(`Fetching policy ${policyId}...`);
          
          const policyData = await contract.getPolicy(policyId);
          console.log(`Policy ${policyId} data:`, policyData);
          
          if (policyData && policyData[0]) {
            // Map the array values to the Policy interface
            const mappedPolicy: Policy = {
              farmer: policyData[0], // address
              farmName: policyData[1], // string
              lat: policyData[2], // bigint
              lng: policyData[3], // bigint
              acreage: policyData[4], // bigint
              riskType: policyData[5], // string
              rainfallThreshold: policyData[6], // bigint
              startDate: policyData[7], // bigint
              endDate: policyData[8], // bigint
              premiumPaid: policyData[9], // bigint
              claimed: policyData[10], // boolean
              active: policyData[11], // boolean
            };
            
            fetchedPolicies.push({
              ...mappedPolicy,
              id: policyId,
            });
          }
        }

        console.log('Final fetched policies:', fetchedPolicies);
        setPolicies(fetchedPolicies);
      } catch (error) {
        console.error('Error fetching policies with ethers.js:', error);
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [address]);

  const [showClaimForm, setShowClaimForm] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyWithId | null>(null);
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

  const getStatusColor = (policy: PolicyWithId) => {
    if (policy.claimed) return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    if (!policy.active) return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
    
    const now = Math.floor(Date.now() / 1000);
    const endDate = Number(policy.endDate);
    
    if (now > endDate) return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
    return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
  };

  const getStatusText = (policy: PolicyWithId) => {
    if (policy.claimed) return 'Claimed';
    if (!policy.active) return 'Inactive';
    
    const now = Math.floor(Date.now() / 1000);
    const endDate = Number(policy.endDate);
    
    if (now > endDate) return 'Expired';
    return 'Active';
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const formatCoordinates = (lat: bigint, lng: bigint) => {
    const latitude = Number(lat) / 1000000;
    const longitude = Number(lng) / 1000000;
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  };

  const formatPremium = (premium: bigint) => {
    const premiumInRupees = Number(premium) * 30; // Convert from Flow to INR
    return `₹${premiumInRupees.toLocaleString()}`;
  };

  if (!address) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-12 rounded-2xl text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-8 text-lg">Please connect your wallet to view your insurance policies.</p>
          </div>
        </div>
      </div>
    );
  }

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
            {loading ? (
              <div className="glass-card p-12 rounded-2xl text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
                  <span className="text-2xl">⏳</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Loading Policies...</h3>
                <p className="text-gray-600">Fetching your insurance policies from the blockchain.</p>
                {policies.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Found {policies.length} policies
                  </p>
                )}
              </div>
            ) : policies.length === 0 ? (
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
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(policy)}`}>
                        {getStatusText(policy)}
                      </span>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">📍 Location</div>
                          <div className="font-semibold text-gray-800 text-xs">
                            {(Number(policy.lat) / 1000000).toFixed(6)}, {(Number(policy.lng) / 1000000).toFixed(6)}
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">📏 Acreage</div>
                          <div className="font-semibold text-gray-800">{Number(policy.acreage)} acres</div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">⚠️ Risk Type</div>
                          <div className="font-semibold text-gray-800">{policy.riskType}</div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">💰 Premium</div>
                          <div className="font-semibold text-gray-800">{formatPremium(policy.premiumPaid)}</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="text-sm text-gray-600 mb-2">📅 Coverage Period</div>
                        <div className="font-semibold text-gray-800">
                          {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
                        </div>
                      </div>

                      {Number(policy.rainfallThreshold) > 0 && (
                        <div className="bg-gradient-to-r from-cyan-50 to-cyan-100 p-4 rounded-xl">
                          <div className="text-sm text-gray-600 mb-1">🌧️ Rainfall Threshold</div>
                          <div className="font-semibold text-gray-800">{Number(policy.rainfallThreshold)} cm</div>
                        </div>
                      )}
                    </div>
                    
                    {getStatusText(policy) === 'Active' && (
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
                      <div className="text-sm text-gray-600">📍 Location</div>
                      <div className="font-semibold text-gray-800 text-xs">
                        {(Number(selectedPolicy.lat) / 1000000).toFixed(6)}, {(Number(selectedPolicy.lng) / 1000000).toFixed(6)}
                      </div>
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
                    💰 Estimated Damage Amount (₹)
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