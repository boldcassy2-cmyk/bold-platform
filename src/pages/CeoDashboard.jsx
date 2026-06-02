import React, { useState } from 'react';

export default function CeoDashboard() {
  // Live KPI Matrix metrics for macro business oversight
  const [metrics] = useState({
    totalGmv: "₦4,850,000",
    escrowLocked: "₦1,240,000",
    adRevenue: "₦385,000",
    activeMerchants: 142
  });

  const [activeDept, setActiveDept] = useState('Overview');

  // Departmental Action Queue Items
  const departments = {
    Trust: {
      title: "🛡️ Trust, Escrow & Anti-Fraud Dept",
      lead: "Verification Operations Crew",
      objective: "Keep shopping fear-free. Monitor pending escrow holds and mediate open inspection disputes.",
      alerts: [
        { id: "AL-101", task: "Review size dispute on ORD-8819 (Retro Threads NG vs Buyer)", status: "Critical Hold" },
        { id: "AL-102", task: "Run routine quality audit on merchant location onboarding queues", status: "In Progress" }
      ]
    },
    Growth: {
      title: "📈 Growth & Premium Ad Operations",
      lead: "Marketing & Revenue Team",
      objective: "Maximize marketplace monetization. Optimize front-page banner tiers and target streetwear brands.",
      alerts: [
        { id: "AL-201", task: "Approve custom Ad Campaign slot request for 'Cassydon Garms Hub'", status: "Awaiting Space" },
        { id: "AL-202", task: "Review conversion analytics for premium category stream bumps", status: "Healthy (4.8x ROI)" }
      ]
    },
    Tech: {
      title: "⚙️ Core Infrastructure & Engineering",
      lead: "Systems & Security Devs",
      objective: "Maintain multi-page platform uptime, check payload compression, and protect checkout routes.",
      alerts: [
        { id: "AL-301", task: "Monitor automated WhatsApp integration ping hooks for vendor notification loops", status: "Stable" },
        { id: "AL-302", task: "Optimize database schemas for dynamic product matrix indexing", status: "Optimized" }
      ]
    }
  };

  return (
    <main className="max-w-6xl mx-auto my-10 px-4 space-y-8 animate-fadeIn">
      
      {/* CEO COMMAND BANNER */}
      <div className="bg-[#1E293B] border-2 border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] bg-[#FF5A00] text-white font-black tracking-widest uppercase px-2.5 py-1 rounded">
            Executive Command Mode
          </span>
          <h1 className="text-3xl font-black text-white mt-2 tracking-tight">Bold.ng HQ Central Console</h1>
          <p className="text-slate-400 text-xs mt-0.5">Macro oversight dashboard, real-time ecosystem financials, and departmental operations.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0B132B] px-4 py-2 rounded-xl border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs text-slate-300 font-mono font-bold">Platform State: Live & Secure</span>
        </div>
      </div>

      {/* FINANCIAL & INFRASTRUCTURE KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Gross Transaction Volume</p>
          <p className="text-xl font-black text-[#0B132B] mt-1 font-mono">{metrics.totalGmv}</p>
          <span className="text-[10px] text-emerald-600 font-bold">↑ 18% weekly velocity</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Escrow Vault Balance</p>
          <p className="text-xl font-black text-[#FF5A00] mt-1 font-mono">{metrics.escrowLocked}</p>
          <span className="text-[10px] text-slate-500 font-medium">Secured customer purchase deposits</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Ad Accelerator Revenue</p>
          <p className="text-xl font-black text-emerald-600 mt-1 font-mono">{metrics.adRevenue}</p>
          <span className="text-[10px] text-slate-500 font-medium">Direct merchant promotion invoices</span>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Onboarded Merchants</p>
          <p className="text-xl font-black text-[#0B132B] mt-1 font-mono">{metrics.activeMerchants}</p>
          <span className="text-[10px] text-slate-500 font-medium">Verified local distribution nodes</span>
        </div>
      </div>

      {/* INTERACTIVE DEPARTMENTAL OPERATIONS SEGMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* DEPT SELECTOR CONSOLE */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Corporate Departments</h3>
          
          <button 
            onClick={() => setActiveDept('Overview')}
            className={`w-full text-left p-4 rounded-xl font-black text-xs uppercase tracking-wider transition border-none cursor-pointer flex justify-between items-center ${
              activeDept === 'Overview' ? 'bg-[#FF5A00] text-white shadow-md' : 'bg-[#1E293B] text-slate-300 hover:text-white'
            }`}
          >
            📋 HQ Summary Matrix
            <span className="font-mono text-[10px] bg-black/20 px-2 py-0.5 rounded">All</span>
          </button>

          <button 
            onClick={() => setActiveDept('Trust')}
            className={`w-full text-left p-4 rounded-xl font-black text-xs uppercase tracking-wider transition border-none cursor-pointer flex justify-between items-center ${
              activeDept === 'Trust' ? 'bg-[#FF5A00] text-white shadow-md' : 'bg-[#1E293B] text-slate-300 hover:text-white'
            }`}
          >
            🛡️ Trust & Escrow Audit
            <span className="font-mono text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-black">Disputes</span>
          </button>

          <button 
            onClick={() => setActiveDept('Growth')}
            className={`w-full text-left p-4 rounded-xl font-black text-xs uppercase tracking-wider transition border-none cursor-pointer flex justify-between items-center ${
              activeDept === 'Growth' ? 'bg-[#FF5A00] text-white shadow-md' : 'bg-[#1E293B] text-slate-300 hover:text-white'
            }`}
          >
            📈 Monetization & Ad Ops
            <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black">Active</span>
          </button>

          <button 
            onClick={() => setActiveDept('Tech')}
            className={`w-full text-left p-4 rounded-xl font-black text-xs uppercase tracking-wider transition border-none cursor-pointer flex justify-between items-center ${
              activeDept === 'Tech' ? 'bg-[#FF5A00] text-white shadow-md' : 'bg-[#1E293B] text-slate-300 hover:text-white'
            }`}
          >
            ⚙️ Core Infrastructure
            <span className="font-mono text-[10px] bg-slate-500/30 text-slate-300 px-2 py-0.5 rounded">Systems</span>
          </button>
        </div>

        {/* METRIC DETAILS DISPLAY CANVAS */}
        <div className="lg:col-span-2 bg-white text-slate-900 p-6 rounded-2xl shadow-2xl min-h-[340px]">
          {activeDept === 'Overview' ? (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-[#0B132B] uppercase tracking-wide">Bold.ng System Status Summary</h2>
                <p className="text-slate-500 text-xs mt-0.5">Global operation snapshot across all market nodes.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-black text-[#0B132B] uppercase">Escrow Release Metrics</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">98.4% of orders resolve successfully without intervention within the 24-hour verification delivery window.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-black text-[#0B132B] uppercase">Ad Space Velocity</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">Premium Front Page spots have high utilization. Merchants are leveraging promotion layers to out-rank standard location streams.</p>
                </div>
              </div>
              <blockquote className="bg-orange-50 border-l-4 border-[#FF5A00] p-4 text-xs font-semibold text-slate-700 rounded-r-xl">
                💡 <span className="font-black text-[#0B132B]">CEO Strategic Guidance:</span> Prioritize scaling trust infrastructure over raw vendor counts. High buyer validation confidence directly drives transaction velocity.
              </blockquote>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-black text-[#0B132B] uppercase tracking-wide">{departments[activeDept].title}</h2>
                <p className="text-slate-400 text-xs font-bold mt-0.5">Team Assignment: {departments[activeDept].lead}</p>
              </div>
              
              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {departments[activeDept].objective}
              </p>

              <div className="space-y-2">
                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Active Operations Track Queue</h4>
                {departments[activeDept].alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm text-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{alert.id}</span>
                      <p className="font-semibold text-slate-800">{alert.task}</p>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-orange-100 text-[#FF5A00] rounded whitespace-nowrap">
                      {alert.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </main>
  );
}