"use client";

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import dynamic from 'next/dynamic';
import { abi, contractAddress } from '../lib/insuranceContract';

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import('../../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 border border-gray-300 rounded-md bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
});

interface LocationCoords {
  lat: number | null;
  lng: number | null;
  address: string;
}

export default function FarmPage() {
  const { address } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  
  const [formData, setFormData] = useState({
    farmName: '',
    location: '',
    acreage: '',
    riskType: 'drought',
    rainfallThreshold: '',
    insuranceStartDate: '',
    insuranceEndDate: ''
  });
  const [locationCoords, setLocationCoords] = useState<LocationCoords>({
    lat: null,
    lng: null,
    address: ''
  });
  const [showAssessment, setShowAssessment] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [assessment, setAssessment] = useState({
    riskPercentage: 0.03, // 3% stored as 0.03
    premium: 0
  });

  // Calculate premium whenever acreage changes
  useEffect(() => {
    if (formData.acreage && !isNaN(parseInt(formData.acreage))) {
      const acreage = parseInt(formData.acreage);
      const riskRate = 0.03; // 3% risk
      const baseRate = 5000; // Rs 5000 per acre
      const premium = acreage * riskRate * baseRate;
      setAssessment(prev => ({ ...prev, premium }));
    }
  }, [formData.acreage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate premium: acre * 0.03 * 5000
    const acreage = parseInt(formData.acreage);
    const riskRate = 0.03; // 3% risk
    const baseRate = 5000; // Rs 5000 per acre
    const premium = acreage * riskRate * baseRate;
    
    setAssessment({ riskPercentage: riskRate, premium });
    setShowPopup(true);
  };

  const handleLocationSelect = (coords: LocationCoords) => {
    setLocationCoords(coords);
    setFormData({...formData, location: coords.address});
  };

  const handleCreatePolicy = async () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!locationCoords.lat || !locationCoords.lng) {
      alert('Please select a location on the map');
      return;
    }

    try {
      // Convert premium to Flow tokens (divide by 30)
      const premiumInFlow = assessment.premium / 30;
      
      // Convert coordinates to contract format (multiply by 1e6 for precision)
      const lat = Math.round(locationCoords.lat * 1000000);
      const lng = Math.round(locationCoords.lng * 1000000);
      
      // Convert dates to timestamps
      const startDate = Math.floor(new Date(formData.insuranceStartDate).getTime() / 1000);
      const endDate = Math.floor(new Date(formData.insuranceEndDate).getTime() / 1000);
      
      // Convert rainfall threshold to integer (multiply by 10 to preserve 1 decimal place)
      const rainfallThreshold = Math.round((parseFloat(formData.rainfallThreshold) || 0) * 10);

      // Ensure premium is an integer for BigInt conversion
      const premiumInFlowInt = Math.round(premiumInFlow);

      writeContract({
        address: contractAddress as `0x${string}`,
        abi,
        functionName: 'createPolicy',
        args: [
          formData.farmName,
          BigInt(lat),
          BigInt(lng),
          BigInt(parseInt(formData.acreage)),
          formData.riskType,
          BigInt(rainfallThreshold),
          BigInt(startDate),
          BigInt(endDate),
          BigInt(premiumInFlowInt)
        ],
        value: parseEther(premiumInFlow.toString())
      });

      setShowPopup(false);
      setShowAssessment(true);
    } catch (error) {
      console.error('Error creating policy:', error);
      alert('Failed to create policy. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🌾</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Farm Details</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Tell us about your farm to get personalized insurance coverage and risk assessment
          </p>
        </div>
        
        {!showAssessment ? (
          <div className="glass-card p-8 rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Farm Name */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  🏡 Farm Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your farm name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm"
                  value={formData.farmName}
                  onChange={(e) => setFormData({...formData, farmName: e.target.value})}
                />
              </div>

              {/* Farm Location */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  📍 Farm Location
                </label>
                <p className="text-gray-600 mb-4">
                  Search for a location or click on the map to pin your farm location
                </p>
                
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                  <MapComponent 
                    onLocationSelect={handleLocationSelect}
                    initialLocation={formData.location}
                  />
                </div>
              </div>

              {/* Acreage */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  📏 Acreage
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Number of acres"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm"
                  value={formData.acreage}
                  onChange={(e) => setFormData({...formData, acreage: e.target.value})}
                />
              </div>

              {/* Risk Type */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  ⚠️ Primary Risk Type
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-white/50 transition-all duration-200 cursor-pointer">
                    <input
                      type="radio"
                      name="riskType"
                      value="drought"
                      checked={formData.riskType === 'drought'}
                      onChange={(e) => setFormData({...formData, riskType: e.target.value})}
                      className="mr-3 w-5 h-5 text-green-600"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">🌵 Drought Risk</div>
                      <div className="text-sm text-gray-600">Protection against water scarcity</div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-white/50 transition-all duration-200 cursor-pointer">
                    <input
                      type="radio"
                      name="riskType"
                      value="rainfall"
                      checked={formData.riskType === 'rainfall'}
                      onChange={(e) => setFormData({...formData, riskType: e.target.value})}
                      className="mr-3 w-5 h-5 text-green-600"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">🌧️ Excessive Rainfall</div>
                      <div className="text-sm text-gray-600">Protection against flooding</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Rainfall Threshold */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  🌧️ Rainfall Threshold
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Enter rainfall threshold in cm"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm"
                    value={formData.rainfallThreshold}
                    onChange={(e) => setFormData({...formData, rainfallThreshold: e.target.value})}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 text-sm font-medium">cm</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Set the rainfall threshold that triggers insurance coverage (e.g., 15 cm for excessive rainfall)
                </p>
              </div>

              {/* Insurance Period */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  📅 Insurance Period
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm"
                      value={formData.insuranceStartDate}
                      onChange={(e) => setFormData({...formData, insuranceStartDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      min={formData.insuranceStartDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white/80 backdrop-blur-sm"
                      value={formData.insuranceEndDate}
                      onChange={(e) => setFormData({...formData, insuranceEndDate: e.target.value})}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Select the period for your insurance coverage
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 px-8 rounded-xl text-xl font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
              >
                🔍 Get Risk Assessment
              </button>
            </form>
          </div>
        ) : (
          <div className="glass-card p-8 rounded-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">Risk Assessment Complete</h2>
              <p className="text-gray-600">Here's your personalized insurance analysis</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-800">Risk Percentage</span>
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="text-3xl font-bold text-red-600">{(assessment.riskPercentage * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-600 mt-2">Based on location and crop type</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-gray-800">Annual Premium</span>
                  <span className="text-2xl">💰</span>
                </div>
                <div className="text-3xl font-bold text-green-600">₹{assessment.premium.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-2">Comprehensive coverage included</div>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 px-8 rounded-xl text-xl font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105">
                🛡️ Buy Policy Now
              </button>
              <button 
                onClick={() => setShowAssessment(false)}
                className="w-full glass py-4 px-8 rounded-xl text-xl font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                ← Back to Form
              </button>
            </div>
          </div>
        )}

        {/* Risk Assessment Popup Modal */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-w-md w-full p-8 animate-in slide-in-from-bottom-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  Risk Assessment Complete
                </h3>
                <p className="text-gray-600">Your personalized insurance analysis</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Risk Rate:</span>
                    <span className="text-xl font-bold text-emerald-600">3%</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Base Rate:</span>
                    <span className="text-xl font-bold text-blue-600">₹5,000/acre</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Acreage:</span>
                    <span className="text-xl font-bold text-purple-600">{formData.acreage} acres</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Premium (₹):</span>
                    <span className="text-2xl font-bold text-orange-600">₹{assessment.premium.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Calculation: {formData.acreage} × 0.03 × ₹5,000
                  </p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Premium (Flow):</span>
                    <span className="text-xl font-bold text-indigo-600">{(assessment.premium / 30).toFixed(2)} FLOW</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Converted: ₹{assessment.premium} ÷ 30
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCreatePolicy}
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? '🔄 Creating Policy...' : '🛡️ Create Insurance Policy'}
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  disabled={isPending}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 