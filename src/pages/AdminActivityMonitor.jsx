import React, { useState, useEffect } from 'react';

export default function AdminActivityMonitor({ activities = [], onNavigate }) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'escrow' | 'listing' | 'payment'
  const [searchTerm, setSearchTerm] = useState('');

  // Fallback sample data if no live activities array is passed yet
  const sampleActivities = [
    {
      id: 'ACT-1001',
      userType: 'seller',
      userEmail: 'vendor.ikeja@bold.ng',
      action: 'Published Direct Listing',
      details: 'iPhone 13 Pro Max (₦450,000)',
      hub: 'Lagos Hub',
      timestamp: '2026-09-18 18:30:15',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-600/40',
      mediaUrl: ''
    },
    {
      id: 'ACT-1002',
      userType: 'buyer',
      userEmail: 'buyer.lekki@gmail.com',
      action: 'Authorized Escrow Deposit',
      details: 'Secured ₦105,000 via Paystack',
      hub: 'Lagos Hub',
      timestamp: '2026-09-18 18:12:40',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-600/40',
      mediaUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
    },
    {
      id: 'ACT-1003',
      userType: 'seller',
      userEmail: 'streetwear.lagos@bold.ng',
      action: 'Attached Media Proof',
      details: 'Uploaded inspection video for Cargo Pants bundle',
      hub: 'Lagos Hub',
      timestamp: '2026-09-18 17:45:00',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-600/40',
      mediaUrl: 'video-proof.mp4'
    }
  ];

  const liveFeed = activities.length > 0 ? activities : sampleActivities;

  const filteredFeed = liveFeed.filter((item) => {
    const matchesSearch = item.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.details?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'escrow') return matchesSearch && item.action.toLowerCase().includes('escrow');
    if (filterType === 'listing') return matchesSearch && item.action.toLowerCase().includes('listing');
    if (filterType === 'payment') return matchesSearch && item.action.toLowerCase().includes('payment');
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black tracking-widest text-[#FF5A00] uppercase">CEO Command Center</span>
            </div>
            <h1 className="text-2xl font-black mt-1">Live User & Vendor Activity Stream</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Real-time audit log of all customer orders, escrow transactions, media uploads, and seller postings.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search user email or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#FF5A00] w-full md:w-64"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {['all', 'escrow', 'listing', 'payment'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition cursor-pointer border ${
                filterType === type 
                  ? 'bg-[#FF5A00] border-[#FF5A00] text-white shadow-lg' 
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {type} Feed
            </button>
          ))}
        </div>

        {/* Activity Table / Feed List */}
        <div className="bg-[#0B132B] rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-900/50">
                  <th className="p-4">User Type / Email</th>
                  <th className="p-4">Action Event</th>
                  <th className="p-4">Details & Metadata</th>
                  <th className="p-4">Attached Proof</th>
                  <th className="p-4">Hub / Location</th>
                  <th className="p-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredFeed.length > 0 ? (
                  filteredFeed.map((act, index) => (
                    <tr key={act.id || index} className="hover:bg-slate-900/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${
                            act.userType === 'seller' ? 'bg-purple-950/50 text-purple-300 border-purple-800' : 'bg-blue-950/50 text-blue-300 border-blue-800'
                          }`}>
                            {act.userType || 'user'}
                          </span>
                          <span className="font-medium text-slate-200 truncate max-w-[160px]">{act.userEmail || 'user@bold.ng'}</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-white">
                        {act.action}
                      </td>
                      <td className="p-4 text-slate-300">
                        {act.details}
                      </td>
                      <td className="p-4">
                        {act.mediaUrl ? (
                          <a 
                            href={act.mediaUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 rounded-lg text-[11px] font-medium"
                          >
                            🔗 View Proof
                          </a>
                        ) : (
                          <span className="text-slate-500 text-[11px]">No attachment</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-400">
                        {act.hub || 'Lagos Hub'}
                      </td>
                      <td className="p-4 text-right font-mono text-slate-400 text-[11px]">
                        {act.timestamp}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 text-sm">
                      No matching activity logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Summary Metrics for CEO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase">Total Tracked Events</p>
            <p className="text-xl font-mono font-black text-white mt-1">{liveFeed.length} Activities Recorded</p>
          </div>
          <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase">Active Escrow Vaults</p>
            <p className="text-xl font-mono font-black text-emerald-400 mt-1">₦105,000 Protected</p>
          </div>
          <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase">Platform Status</p>
            <p className="text-xl font-mono font-black text-[#FF5A00] mt-1">Live & Monitoring 🟢</p>
          </div>
        </div>

      </div>
    </div>
  );
}