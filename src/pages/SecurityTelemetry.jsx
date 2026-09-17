import React from 'react';

export default function SecurityTelemetry({ onNavigate }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white space-y-8">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#FF5A00] uppercase">System Infrastructure</span>
          <h1 className="text-3xl font-black mt-1">Security Telemetry</h1>
        </div>
        <button onClick={() => onNavigate('marketplace')} className="text-xs bg-slate-800 px-4 py-2 rounded-xl text-slate-300 hover:text-white cursor-pointer">
          ← Back to Marketplace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-emerald-400 font-mono text-xs">● ONLINE (256-BIT)</span>
          <h3 className="font-bold text-lg text-white">SSL Encrypted Gateway</h3>
          <p className="text-xs text-slate-300">All data transactions and payment sessions are encrypted end-to-end via secure HTTPS protocols.</p>
        </div>

        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-emerald-400 font-mono text-xs">● SECURED</span>
          <h3 className="font-bold text-lg text-white">Firebase Security Rules</h3>
          <p className="text-xs text-slate-300">Firestore database is governed by strict role-based authentication rules preventing unauthorized data tampering.</p>
        </div>
      </div>
    </div>
  );
}