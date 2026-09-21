import React, { useState } from 'react';

export default function AdminActivityMonitor({ activities = [] }) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'traffic' | 'auth' | 'search' | 'upload' | 'escrow'
  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive sample data covering all professional enterprise telemetry verticals
  const sampleActivities = [
    {
      id: 'ACT-901',
      category: 'auth',
      userEmail: 'unauthorized.intruder@unknown.com',
      action: 'Failed Login Attempt',
      details: 'Incorrect password entered (3rd consecutive failure)',
      ipAddress: '102.89.44.12',
      timestamp: '2026-09-21 06:14:22',
      statusType: 'error' // error, success, warning
    },
    {
      id: 'ACT-902',
      category: 'search',
      userEmail: 'guest_visitor_99@web',
      action: 'Marketplace Search Query',
      details: 'Searched for keyword: "HP Core i7 Refurbished Laptop"',
      ipAddress: '197.210.70.5',
      timestamp: '2026-09-21 06:10:05',
      statusType: 'info'
    },
    {
      id: 'ACT-903',
      category: 'upload',
      userEmail: 'vendor.ikeja@bold.ng',
      action: 'Published Product Listing',
      details: 'Added iPhone 13 Pro Max to catalog (₦450,000)',
      ipAddress: '197.210.55.12',
      timestamp: '2026-09-21 05:45:10',
      statusType: 'success'
    },
    {
      id: 'ACT-904',
      category: 'escrow',
      userEmail: 'buyer.lekki@gmail.com',
      action: 'Authorized Escrow Deposit',
      details: 'Secured ₦105,000 via Paystack Gateway',
      ipAddress: '41.210.6.88',
      timestamp: '2026-09-21 05:12:40',
      statusType: 'success'
    },
    {
      id: 'ACT-905',
      category: 'traffic',
      userEmail: 'anonymous_visitor',
      action: 'New Site Visitor / Landing Page Hit',
      details: 'Landed on home page via organic direct link',
      ipAddress: '105.112.42.19',
      timestamp: '2026-09-21 05:01:15',
      statusType: 'info'
    },
    {
      id: 'ACT-906',
      category: 'auth',
      userEmail: 'boldcassy2@gmail.com',
      action: 'Successful CEO Staff Login',
      details: 'Authenticated successfully into Executive Gateway',
      ipAddress: '197.210.70.5',
      timestamp: '2026-09-21 04:30:00',
      statusType: 'success'
    },
    {
      id: 'ACT-907',
      category: 'auth',
      userEmail: 'newuser.signup@gmail.com',
      action: 'Failed Registration Attempt',
      details: 'Password did not meet minimum security requirements',
      ipAddress: '41.78.3.14',
      timestamp: '2026-09-21 03:22:11',
      statusType: 'error'
    }
  ];

  const liveFeed = activities.length > 0 ? activities : sampleActivities;

  // Filter logic across all professional metrics
  const filteredFeed = liveFeed.filter((item) => {
    const matchesSearch = 
      item.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'all') return matchesSearch;
    return matchesSearch && item.category === filterType;
  });

  // Calculate high-level metrics for quick CEO overview
  const totalEvents = liveFeed.length;
  const failedAuthCount = liveFeed.filter(i => i.category === 'auth' && i.statusType === 'error').length;
  const searchQueriesCount = liveFeed.filter(i => i.category === 'search').length;
  const uploadsCount = liveFeed.filter(i => i.category === 'upload').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white font-sans">
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black tracking-widest text-[#FF5A00] uppercase font-mono">Enterprise Telemetry Hub</span>
            </div>
            <h1 className="text-2xl font-black mt-1 uppercase tracking-tight">Live Platform Activity & Audit Stream</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Real-time monitoring of site traffic, authentication health, security failures, user search intent, and merchant uploads.
            </p>
          </div>
          
          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="Search email, action, IP, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#FF5A00] w-full md:w-72 font-mono"
            />
          </div>
        </div>

        {/* Professional Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Telemetry' },
            { key: 'traffic', label: '🌐 Traffic & Visitors' },
            { key: 'auth', label: '🔐 Auth & Failed Logins' },
            { key: 'search', label: '🔍 User Search Intent' },
            { key: 'upload', label: '📦 Vendor Uploads' },
            { key: 'escrow', label: '💰 Escrow & Payments' }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterType(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer border ${
                filterType === tab.key 
                  ? 'bg-[#FF5A00] border-[#FF5A00] text-white shadow-lg shadow-orange-600/20' 
                  : 'bg-[#0B132B] border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Activity Table */}
        <div className="bg-[#0B132B] rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-900/50">
                  <th className="p-4">Category / User</th>
                  <th className="p-4">Action Event</th>
                  <th className="p-4">Telemetry Metadata & Details</th>
                  <th className="p-4">Client IP</th>
                  <th className="p-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
                {filteredFeed.length > 0 ? (
                  filteredFeed.map((act, index) => (
                    <tr key={act.id || index} className="hover:bg-slate-900/40 transition">
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className={`w-fit px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                            act.category === 'auth' ? 'bg-red-950/60 text-red-400 border-red-800/60' :
                            act.category === 'search' ? 'bg-purple-950/60 text-purple-400 border-purple-800/60' :
                            act.category === 'upload' ? 'bg-blue-950/60 text-blue-400 border-blue-800/60' :
                            act.category === 'escrow' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' :
                            'bg-slate-800 text-slate-300 border-slate-700'
                          }`}>
                            {act.category}
                          </span>
                          <span className="text-slate-300 text-[11px] truncate max-w-[180px]">{act.userEmail}</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-white font-sans">
                        <span className={`inline-flex items-center gap-1.5 ${act.statusType === 'error' ? 'text-red-400' : 'text-slate-100'}`}>
                          {act.statusType === 'error' && '⚠️ '}
                          {act.action}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300 font-sans">
                        {act.details}
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">
                        {act.ipAddress || '127.0.0.1'}
                      </td>
                      <td className="p-4 text-right text-slate-400 text-[11px]">
                        {act.timestamp}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-500 text-sm">
                      🔍 No telemetry events match your current filter or search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase font-mono">Failed Auth / Security Alerts</p>
            <p className="text-xl font-mono font-black text-red-400 mt-1">{failedAuthCount} Incidents Logged</p>
          </div>
          <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase font-mono">Marketplace Search Queries</p>
            <p className="text-xl font-mono font-black text-purple-400 mt-1">{searchQueriesCount} Intent Signals</p>
          </div>
          <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase font-mono">Product & Media Uploads</p>
            <p className="text-xl font-mono font-black text-blue-400 mt-1">{uploadsCount} Published Items</p>
          </div>
          <div className="bg-[#0B132B] p-4 rounded-2xl border border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase font-mono">Total System Events</p>
            <p className="text-xl font-mono font-black text-[#FF5A00] mt-1">{totalEvents} Tracked Actions</p>
          </div>
        </div>

      </div>
    </div>
  );
}