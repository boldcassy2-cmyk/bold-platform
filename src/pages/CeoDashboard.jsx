import React, { useState } from 'react';

export default function CeoDashboard({ transactions = [], setTransactions, items = [], usersList = [], staffLogs = [], userRole }) {
  const [activeTab, setActiveTab] = useState('overview');

  const totalVolume = transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const activeEscrowCount = transactions.filter(tx => tx.status === 'In Escrow Vault').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* CEO Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-[#FF5A00] to-[#0B132B] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-slate-950/40 text-amber-300 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-amber-400/30">
            👑 Master Authority Clearance
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-2 tracking-tight">
            CEO Command & Control Center
          </h1>
          <p className="text-xs text-slate-100/90 mt-1">
            Total Oversight: Finance, Logistics, HR, Inspection, & Staff Telemetry
          </p>
        </div>

        <div className="flex gap-3">
          <div className="bg-slate-950/60 backdrop-blur px-4 py-2.5 rounded-xl border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Total Volume</span>
            <span className="text-sm font-black text-emerald-400">₦{totalVolume.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950/60 backdrop-blur px-4 py-2.5 rounded-xl border border-white/10 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Active Escrows</span>
            <span className="text-sm font-black text-amber-400">{activeEscrowCount}</span>
          </div>
        </div>
      </div>

      {/* Departmental & Staff Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {[
          { id: 'overview', label: '📊 Executive Overview' },
          { id: 'finance', label: '💰 Finance Dashboard' },
          { id: 'logistics', label: '🚚 Logistics & Hubs' },
          { id: 'hr', label: '👥 HR & Staff Directory' },
          { id: 'inspection', label: '🔍 Inspection & Quality' },
          { id: 'telemetry', label: '⚡ Security Audit Logs' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs font-black px-4 py-2.5 rounded-xl border-none cursor-pointer transition-all ${
              activeTab === tab.id 
                ? 'bg-[#FF5A00] text-white shadow-[0_0_12px_rgba(255,90,0,0.4)]' 
                : 'bg-[#16223F] hover:bg-slate-800 text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Display */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Total Platform Catalog</span>
              <p className="text-2xl font-black text-white mt-1">{items.length} Active Items</p>
              <button 
                type="button" 
                onClick={() => setActiveTab('finance')}
                className="mt-4 text-xs text-[#FF5A00] font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                View Financial Logs →
              </button>
            </div>
            <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Total Registered Users</span>
              <p className="text-2xl font-black text-white mt-1">{usersList.length} Accounts</p>
              <button 
                type="button" 
                onClick={() => setActiveTab('hr')}
                className="mt-4 text-xs text-[#FF5A00] font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                Inspect HR Directory →
              </button>
            </div>
            <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800">
              <span className="text-xs text-slate-400 font-bold uppercase">Staff Action Audit Trail</span>
              <p className="text-2xl font-black text-white mt-1">{staffLogs.length} Actions Logged</p>
              <button 
                type="button" 
                onClick={() => setActiveTab('telemetry')}
                className="mt-4 text-xs text-[#FF5A00] font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                View Telemetry →
              </button>
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="bg-[#16223F] p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-black text-white">💰 Finance Department Vault & Ledger</h2>
            <p className="text-xs text-slate-400">Monitoring all escrow disbursements, gateway inflows, and revenue collections.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-mono">
                  <tr>
                    <th className="p-3">TX ID</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-[#FF5A00]">{tx.id}</td>
                      <td className="p-3">{tx.title}</td>
                      <td className="p-3 font-mono font-bold">₦{Number(tx.amount || 0).toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          tx.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="bg-[#16223F] p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-black text-white">🚚 Logistics Hubs & Dispatch Operations</h2>
            <p className="text-xs text-slate-400">Manage regional fulfillment hubs (Lagos Hub, Abuja Node) and delivery statuses.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase">● Lagos Central Hub</span>
                <p className="text-xs text-slate-300 mt-2">Active Dispatch Officers: 4</p>
                <p className="text-xs text-slate-300">Status: Operational & Fully Synchronized</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase">● Abuja Regional Node</span>
                <p className="text-xs text-slate-300 mt-2">Active Dispatch Officers: 2</p>
                <p className="text-xs text-slate-300">Status: Operational & Fully Synchronized</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hr' && (
          <div className="bg-[#16223F] p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-black text-white">👥 Human Resources & Staff Directory</h2>
            <p className="text-xs text-slate-400">Review staff accounts, department clearances, and role assignments.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-mono">
                  <tr>
                    <th className="p-3">Staff / Merchant Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {usersList.map((usr, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white">{usr.name}</td>
                      <td className="p-3 font-mono">{usr.email}</td>
                      <td className="p-3">
                        <span className="bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          {usr.role}
                        </span>
                      </td>
                      <td className="p-3 text-emerald-400 font-bold">{usr.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inspection' && (
          <div className="bg-[#16223F] p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-black text-white">🔍 Item Inspection & Quality Control</h2>
            <p className="text-xs text-slate-400">Review items pending physical verification at escrow hubs before release to buyers.</p>
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
              <p>All active catalog items are currently verified. No inspection anomalies reported.</p>
            </div>
          </div>
        )}

        {activeTab === 'telemetry' && (
          <div className="bg-[#16223F] p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-black text-white">⚡ Security Telemetry & Staff Action Logs</h2>
            <p className="text-xs text-slate-400">Real-time audit trail recording every administrative and staff action across the protocol.</p>
            <div className="space-y-2">
              {staffLogs.map((log, idx) => (
                <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#FF5A00]">{log.staff}</span>: <span className="text-slate-200">{log.action}</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[10px]">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}