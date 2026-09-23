import React from 'react';

export default function EscrowDashboard({ currentUser, setCurrentPage }) {
  return (
    <div className="bg-[#0B132B] min-h-[60vh] text-white p-6 rounded-2xl border border-slate-800">
      <h2 className="text-xl font-black mb-2 flex items-center gap-2">
        <span>🛡️</span> Escrow Operations Telemetry
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        Authorized staff inspection, milestone tracking, and dispute mediation center.
      </p>
      
      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center">
        <p className="text-xs font-mono text-emerald-400 mb-2">● System Status: Operational</p>
        <p className="text-xs text-slate-400">Connected user: {currentUser?.email || 'Staff Member'}</p>
      </div>
    </div>
  );
}