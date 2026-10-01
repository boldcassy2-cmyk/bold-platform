// src/components/SellerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { fetchSellerAnalytics } from '../services/analyticsService';

export default function SellerDashboard({ userId, userType }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const data = await fetchSellerAnalytics(userId, userType);
      setStats(data);
      setLoading(false);
    }
    loadStats();
  }, [userId, userType]);

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading your performance metrics...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userType === 'merchant' ? 'Merchant Storefront Dashboard' : 'Solo Seller Ad Manager'}
            </h1>
            <p className="text-sm text-gray-500">Overview of your activity and performance on bold.ng</p>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full uppercase">
            {userType === 'merchant' ? 'Retail Store' : 'Classified P2P'}
          </span>
        </div>

        {/* Metrics Grid */}
        {userType === 'merchant' ? (
          // Merchant Analytics View
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-medium uppercase mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">₦{Number(stats?.totalRevenue || 0).toLocaleString()}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-medium uppercase mb-1">Active Products</p>
              <h3 className="text-2xl font-bold text-blue-600">{stats?.activeListings}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-medium uppercase mb-1">Pending Orders</p>
              <h3 className="text-2xl font-bold text-orange-500">{stats?.pendingOrders}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-medium uppercase mb-1">Store Views</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.totalViews}</h3>
            </div>
          </div>
        ) : (
          // Solo Seller Analytics View
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-medium uppercase mb-1">Active Classified Ads</p>
              <h3 className="text-2xl font-bold text-blue-600">{stats?.activeAds}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-medium uppercase mb-1">Total Ad Views</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats?.adViews}</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs text-gray-400 font-medium uppercase mb-1">Buyer Inquiries (Calls/Chats)</p>
              <h3 className="text-2xl font-bold text-green-600">{stats?.inquiries}</h3>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}