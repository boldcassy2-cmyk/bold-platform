import React, { useState } from 'react';

export default function CeoDashboard({ 
  transactions = [], 
  setTransactions, 
  items = [], 
  usersList = [], 
  setUsersList, 
  staffLogs = [], 
  userRole,
  setCurrentPage 
}) {
  const [activeTab, setActiveTab] = useState('overview');

  // New Staff Form States
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffDepartment, setNewStaffDepartment] = useState('finance');
  const [staffCreationStatus, setStaffCreationStatus] = useState(null);

  const totalVolume = transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const activeEscrowCount = transactions.filter(tx => tx.status === 'In Escrow Vault').length;

  const handleCreateStaff = (e) => {
    e.preventDefault();
    if (!newStaffEmail || !newStaffName) return;

    const newStaffMember = {
      id: 'usr-' + Date.now(),
      name: newStaffName,
      email: newStaffEmail,
      role: 'STAFF',
      department: newStaffDepartment,
      status: 'Active',
      idCardStatus: 'Pending', // ID card tracking status
      dateAdded: new Date().toISOString()
    };

    if (typeof setUsersList === 'function') {
      setUsersList(prev => [newStaffMember, ...prev]);
    } else {
      usersList.unshift(newStaffMember);
    }

    setStaffCreationStatus(`Successfully provisioned account for ${newStaffName} (${newStaffDepartment.toUpperCase()})`);
    setNewStaffEmail('');
    setNewStaffName('');
    setTimeout(() => setStaffCreationStatus(null), 4000);
  };

  const toggleIdCardStatus = (index) => {
    if (typeof setUsersList === 'function') {
      setUsersList(prev => prev.map((usr, i) => {
        if (i === index) {
          const nextStatus = usr.idCardStatus === 'Issued' ? 'Pending' : 'Issued';
          return { ...usr, idCardStatus: nextStatus };
        }
        return usr;
      }));
    }
  };

  const handleLockTerminal = () => {
    localStorage.removeItem('bold_ceo_auth');
    if (typeof setCurrentPage === 'function') {
      setCurrentPage('marketplace');
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6 text-slate-100 space-y-6 pb-32 font-sans">
      
      {/* =========================================================
          1. CEO COMMAND TOP BANNER
      ========================================================= */}
      <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff9900]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ff9900] bg-[#ff9900]/10 px-2.5 py-0.5 rounded border border-[#ff9900]/30">
              👑 Master Authority Clearance
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
              ● Live Protocol
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
            CEO Command & Control Center
          </h1>
          
          <p className="text-slate-400 text-xs font-mono">
            Total Oversight: Finance, Logistics, HR, Inspection, & Staff Telemetry
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 w-full lg:w-auto flex-wrap">
          <div className="bg-[#161f2d] px-4 py-3 rounded-xl border border-slate-800 text-left">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Total Volume</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">₦{totalVolume.toLocaleString()}</span>
          </div>
          <div className="bg-[#161f2d] px-4 py-3 rounded-xl border border-slate-800 text-left">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Active Escrows</span>
            <span className="text-sm font-bold text-[#ff9900] font-mono">{activeEscrowCount}</span>
          </div>
          
          <button
            type="button"
            onClick={handleLockTerminal}
            className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-900 text-xs font-mono font-bold px-4 py-3 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
            title="Lock terminal and clear session"
          >
            <span>🔒</span> Lock Terminal
          </button>
        </div>
      </div>

      {/* =========================================================
          2. DEPARTMENTAL & STAFF NAVIGATION TABS
      ========================================================= */}
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
            className={`text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-[#ffd814] text-[#0f1111] shadow-md font-extrabold' 
                : 'bg-[#131921] hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* =========================================================
          3. TAB CONTENT DISPLAY
      ========================================================= */}
      <div className="space-y-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#131921] p-5 rounded-2xl border border-slate-800 shadow-md hover:border-slate-700 transition space-y-3">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Platform Catalog</span>
              <p className="text-2xl font-bold text-white font-mono">{items.length} Active Items</p>
              <button 
                type="button" 
                onClick={() => setActiveTab('finance')}
                className="text-xs text-[#0066c0] font-bold hover:underline bg-transparent border-none cursor-pointer block pt-1"
              >
                View Financial Logs →
              </button>
            </div>

            <div className="bg-[#131921] p-5 rounded-2xl border border-slate-800 shadow-md hover:border-slate-700 transition space-y-3">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Registered Users</span>
              <p className="text-2xl font-bold text-white font-mono">{usersList.length} Accounts</p>
              <button 
                type="button" 
                onClick={() => setActiveTab('hr')}
                className="text-xs text-[#0066c0] font-bold hover:underline bg-transparent border-none cursor-pointer block pt-1"
              >
                Inspect HR Directory →
              </button>
            </div>

            <div className="bg-[#131921] p-5 rounded-2xl border border-slate-800 shadow-md hover:border-slate-700 transition space-y-3">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Staff Action Audit Trail</span>
              <p className="text-2xl font-bold text-white font-mono">{staffLogs.length} Actions Logged</p>
              <button 
                type="button" 
                onClick={() => setActiveTab('telemetry')}
                className="text-xs text-[#0066c0] font-bold hover:underline bg-transparent border-none cursor-pointer block pt-1"
              >
                View Telemetry →
              </button>
            </div>
          </div>
        )}

        {/* FINANCE TAB */}
        {activeTab === 'finance' && (
          <div className="bg-[#131921] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>💰</span> Finance Department Vault & Ledger
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Monitoring all escrow disbursements, gateway inflows, and revenue collections.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="bg-[#161f2d] border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                    <th className="py-3 px-4">TX ID</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-[#ff9900]">{tx.id}</td>
                      <td className="py-3 px-4 text-white font-medium">{tx.title}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">₦{Number(tx.amount || 0).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          tx.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-amber-950 text-amber-400 border border-amber-900'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LOGISTICS TAB */}
        {activeTab === 'logistics' && (
          <div className="bg-[#131921] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🚚</span> Logistics Hubs & Dispatch Operations
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Manage regional fulfillment hubs (Lagos Hub, Abuja Node) and delivery statuses.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#161f2d] p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">● Lagos Central Hub</span>
                <p className="text-xs text-slate-300">Active Dispatch Officers: <strong className="text-white">4</strong></p>
                <p className="text-xs text-slate-300">Status: <strong className="text-emerald-400">Operational & Fully Synchronized</strong></p>
              </div>

              <div className="bg-[#161f2d] p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">● Abuja Regional Node</span>
                <p className="text-xs text-slate-300">Active Dispatch Officers: <strong className="text-white">2</strong></p>
                <p className="text-xs text-slate-300">Status: <strong className="text-emerald-400">Operational & Fully Synchronized</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* HR TAB */}
        {activeTab === 'hr' && (
          <div className="space-y-6">
            {/* Provision Staff Card */}
            <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>⚡</span> Provision New Staff Account
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Create operational credentials and assign departmental clearance.</p>
              </div>

              {staffCreationStatus && (
                <div className="bg-emerald-950/60 border border-emerald-900 text-emerald-300 text-xs px-4 py-3 rounded-xl">
                  {staffCreationStatus}
                </div>
              )}

              <form onSubmit={handleCreateStaff} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Staff Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe"
                    value={newStaffName} 
                    onChange={(e) => setNewStaffName(e.target.value)}
                    required
                    className="w-full bg-[#161f2d] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff9900]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="staff@bold.ng"
                    value={newStaffEmail} 
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    required
                    className="w-full bg-[#161f2d] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff9900]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Department Scope</label>
                  <select 
                    value={newStaffDepartment} 
                    onChange={(e) => setNewStaffDepartment(e.target.value)}
                    className="w-full bg-[#161f2d] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff9900]"
                  >
                    <option value="finance">Finance Vault</option>
                    <option value="inspection">Inspection Hub</option>
                    <option value="support">Customer Support</option>
                    <option value="delivery">Logistics & Delivery</option>
                    <option value="admin">Executive Admin</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-xs"
                >
                  Create Account 🚀
                </button>
              </form>
            </div>

            {/* Staff Directory Table */}
            <div className="bg-[#131921] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>👥</span> Human Resources & Staff ID Card Directory
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Review staff accounts, department clearances, and click ID status to toggle issuance.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead>
                    <tr className="bg-[#161f2d] border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                      <th className="py-3 px-4">Staff Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role & Dept</th>
                      <th className="py-3 px-4">ID Card Status</th>
                      <th className="py-3 px-4">Account Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {usersList.map((usr, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50 transition">
                        <td className="py-3 px-4 font-bold text-white">{usr.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{usr.email}</td>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <span className="bg-blue-950 text-blue-400 border border-blue-900 px-2 py-0.5 rounded text-[10px] font-bold">
                            {usr.role}
                          </span>
                          {usr.department && (
                            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                              {usr.department.toUpperCase()}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => toggleIdCardStatus(idx)}
                            title="Click to toggle ID card status"
                            className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border cursor-pointer transition ${
                              usr.idCardStatus === 'Issued'
                                ? 'bg-emerald-950 text-emerald-400 border-emerald-900 hover:bg-emerald-900'
                                : 'bg-amber-950 text-amber-400 border-amber-900 hover:bg-amber-900'
                            }`}
                          >
                            {usr.idCardStatus || 'Pending'} 🪪
                          </button>
                        </td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded text-[10px]">
                            {usr.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* INSPECTION TAB */}
        {activeTab === 'inspection' && (
          <div className="bg-[#131921] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🔍</span> Item Inspection & Quality Control
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Review items pending physical verification at escrow hubs before release to buyers.</p>
            </div>
            <div className="bg-[#161f2d] p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
              <p>All active catalog items are currently verified. No inspection anomalies reported.</p>
            </div>
          </div>
        )}

        {/* TELEMETRY TAB */}
        {activeTab === 'telemetry' && (
          <div className="bg-[#131921] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>⚡</span> Security Telemetry & Staff Action Logs
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time audit trail recording every administrative and staff action across the protocol.</p>
            </div>
            
            <div className="space-y-2">
              {staffLogs.map((log, idx) => (
                <div key={idx} className="bg-[#161f2d] p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#ff9900]">{log.staff}</span>: <span className="text-slate-200">{log.action}</span>
                  </div>
                  <span className="font-mono text-slate-400 text-[10px]">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}