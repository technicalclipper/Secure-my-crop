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
  payout: bigint;
  status: number; // 0: active, 1: claimed, 2: inactive
}

interface PolicyWithId extends Policy {
  id: number;
}

export default function ClaimsPage() {
  const { address } = useAccount();
  const [claimedPolicies, setClaimedPolicies] = useState<PolicyWithId[]>([]);
  const [allPolicies, setAllPolicies] = useState<PolicyWithId[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch claimed policies using ethers.js
  useEffect(() => {
    const fetchClaimedPolicies = async () => {
      console.log('Fetching claimed policies for address:', address);
      
      if (!address) {
        console.log('No address found, setting loading to false');
        setLoading(false);
        return;
      }

      try {
        // Create ethers provider and contract instance
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        
        // Get all policy IDs for this farmer
        console.log('Fetching farmer policy IDs...');
        const farmerPolicyIds = await contract.getFarmerPolicies(address);
        console.log('Farmer policy IDs:', farmerPolicyIds);
        
        if (!farmerPolicyIds || farmerPolicyIds.length === 0) {
          console.log('No policy IDs found for this farmer');
          setClaimedPolicies([]);
          setLoading(false);
          return;
        }

        // Fetch each policy and filter for claimed ones (status === 1)
        const fetchedPolicies: PolicyWithId[] = [];
        const allFetchedPolicies: PolicyWithId[] = [];
        
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
              payout: policyData[10], // bigint
              status: policyData[11], // number
            };
            
            console.log(`Policy ${policyId} status:`, mappedPolicy.status);
            
            // Add to all policies for debugging
            allFetchedPolicies.push({
              ...mappedPolicy,
              id: policyId,
            });
            
            // Only include claimed policies (status === 1)
            if (Number(mappedPolicy.status) === 1) {
              console.log(`Policy ${policyId} is claimed, adding to list`);
              fetchedPolicies.push({
                ...mappedPolicy,
                id: policyId,
              });
            } else {
              console.log(`Policy ${policyId} is not claimed (status: ${mappedPolicy.status})`);
            }
          }
        }

        console.log('All policies:', allFetchedPolicies);
        console.log('Final claimed policies:', fetchedPolicies);
        setAllPolicies(allFetchedPolicies);
        setClaimedPolicies(fetchedPolicies);
      } catch (error) {
        console.error('Error fetching claimed policies:', error);
        setClaimedPolicies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClaimedPolicies();
  }, [address]);

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  const formatPayout = (payout: bigint) => {
    const payoutValue = Number(payout); // Show the raw payout value directly
    return `₹${payoutValue.toLocaleString()}`;
  };

  const formatPremium = (premium: bigint) => {
    const premiumInRupees = Number(premium) * 30; // Convert from Flow to INR
    return `₹${premiumInRupees.toLocaleString()}`;
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center py-16">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">🔗</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Connect Your Wallet</h3>
              <p className="text-gray-500">Please connect your wallet to view your claimed policies.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 animate-pulse">
            Claims History
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your insurance claims and monitor their processing status
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-16">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mx-auto mb-6 flex items-center justify-center animate-spin">
                <span className="text-3xl">⏳</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Loading Claims...</h3>
              <p className="text-gray-500">Fetching your claimed policies from the blockchain.</p>
            </div>
          </div>
        ) : claimedPolicies.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Claims Found</h3>
              <p className="text-gray-500">You haven't submitted any claims yet.</p>
              
              {/* Debug Section */}
              {allPolicies.length > 0 && (
                <div className="mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-4">Debug Info - All Your Policies:</h4>
                  <div className="space-y-2 text-sm">
                    {allPolicies.map((policy) => (
                      <div key={policy.id} className="flex justify-between items-center p-2 bg-white rounded border">
                        <span>Policy {policy.id}: {policy.farmName}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          policy.status === 0 ? 'bg-green-100 text-green-800' :
                          policy.status === 1 ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          Status: {policy.status === 0 ? 'Active' : policy.status === 1 ? 'Claimed' : 'Inactive'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-yellow-600 mt-2">
                    Only policies with status "Claimed" (1) are shown in the claims history.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {claimedPolicies.map((policy) => (
              <div key={policy.id} className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                        {policy.farmName}
                      </h3>
                      <p className="text-gray-600 font-medium">Policy ID: {policy.id}</p>
                    </div>
                    <span className="px-4 py-2 rounded-full text-sm font-semibold border text-blue-600 bg-blue-100/80 border-blue-200">
                      Paid
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
                      <p className="font-semibold text-emerald-700 mb-1">Risk Type</p>
                      <p className="text-gray-700">{policy.riskType}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                      <p className="font-semibold text-blue-700 mb-1">Payout Received</p>
                      <p className="text-2xl font-bold text-gray-800">{formatPayout(policy.payout)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                      <p className="font-semibold text-purple-700 mb-1">Premium Paid</p>
                      <p className="text-gray-700">{formatPremium(policy.premiumPaid)}</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-100">
                      <p className="font-semibold text-orange-700 mb-1">Coverage Period</p>
                      <p className="text-gray-700">{formatDate(policy.startDate)} - {formatDate(policy.endDate)}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50/80 p-6 rounded-xl border border-gray-200/50">
                    <p className="font-semibold text-gray-700 mb-3">Policy Details</p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Acreage:</span>
                        <span className="ml-2 text-gray-800">{Number(policy.acreage)} acres</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Location:</span>
                        <span className="ml-2 text-gray-800">
                          {(Number(policy.lat) / 1000000).toFixed(6)}, {(Number(policy.lng) / 1000000).toFixed(6)}
                        </span>
                      </div>
                      {Number(policy.rainfallThreshold) > 0 && (
                        <div>
                          <span className="font-medium text-gray-600">Rainfall Threshold:</span>
                          <span className="ml-2 text-gray-800">{(Number(policy.rainfallThreshold) / 10).toFixed(1)} cm</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-emerald-700 font-semibold">Claim processed and payout issued successfully!</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 