"use client";

import { useState } from 'react';

interface Claim {
  id: string;
  policyId: string;
  farmName: string;
  reason: string;
  description: string;
  damageAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  submittedDate: string;
  processedDate?: string;
}

export default function ClaimsPage() {
  const [claims] = useState<Claim[]>([
    {
      id: '1',
      policyId: '1',
      farmName: 'Green Valley Farm',
      reason: 'Drought Damage',
      description: 'Severe drought conditions caused 60% crop loss across 150 acres of corn.',
      damageAmount: 45000,
      status: 'approved',
      submittedDate: '2024-07-15',
      processedDate: '2024-07-20'
    },
    {
      id: '2',
      policyId: '2',
      farmName: 'Sunset Fields',
      reason: 'Excessive Rainfall',
      description: 'Heavy rainfall and flooding damaged wheat crops in low-lying areas.',
      damageAmount: 28000,
      status: 'pending',
      submittedDate: '2024-08-10'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-100/80 border-amber-200';
      case 'approved': return 'text-emerald-600 bg-emerald-100/80 border-emerald-200';
      case 'rejected': return 'text-rose-600 bg-rose-100/80 border-rose-200';
      case 'paid': return 'text-blue-600 bg-blue-100/80 border-blue-200';
      default: return 'text-gray-600 bg-gray-100/80 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'paid': return 'Paid';
      default: return status;
    }
  };

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
        
        {claims.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Claims Found</h3>
              <p className="text-gray-500">You haven't submitted any claims yet.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {claims.map((claim) => (
              <div key={claim.id} className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                        {claim.farmName}
                      </h3>
                      <p className="text-gray-600 font-medium">Policy ID: {claim.policyId}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(claim.status)}`}>
                      {getStatusText(claim.status)}
                    </span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
                      <p className="font-semibold text-emerald-700 mb-1">Reason</p>
                      <p className="text-gray-700">{claim.reason}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
                      <p className="font-semibold text-blue-700 mb-1">Damage Amount</p>
                      <p className="text-2xl font-bold text-gray-800">${claim.damageAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                      <p className="font-semibold text-purple-700 mb-1">Submitted</p>
                      <p className="text-gray-700">{new Date(claim.submittedDate).toLocaleDateString()}</p>
                    </div>
                    {claim.processedDate && (
                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-100">
                        <p className="font-semibold text-orange-700 mb-1">Processed</p>
                        <p className="text-gray-700">{new Date(claim.processedDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50/80 p-6 rounded-xl border border-gray-200/50">
                    <p className="font-semibold text-gray-700 mb-3">Description</p>
                    <p className="text-gray-600 leading-relaxed">{claim.description}</p>
                  </div>
                  
                  {claim.status === 'approved' && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-emerald-700 font-semibold">Claim approved! Payment will be processed within 5-7 business days.</p>
                      </div>
                    </div>
                  )}
                  
                  {claim.status === 'rejected' && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-rose-50 to-red-50 rounded-xl border border-rose-200">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <p className="text-rose-700 font-semibold">Claim rejected. Please contact support for more information.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 