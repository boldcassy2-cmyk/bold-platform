import React from 'react';

/**
 * Modern High-Trust Hero Banner Component
 * @param {Function} setCurrentPage - Parent state setter for SPA view routing
 */
export default function Home({ setCurrentPage }) {
  const trustMetrics = [
    { label: 'Escrow Vault Status', value: '100% Locked', icon: '🛡️' },
    { label: 'CAC Verified Sellers', value: 'Instant Inspection', icon: '🏛️' },
    { label: 'Zero-Scam Guarantee', value: 'Encrypted Routing', icon: '⚡' }
  ];

  return (
    <main className="min-h-[calc(100vh-80px)] flex flex-col justify-between max-w-6xl mx-auto pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Primary Hero Hero Section */}
      <section className="flex flex-col items-center text-center max-w-3xl mx-auto my-auto py-8">
        
        {/* Trust Badge Header */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-black px-5 py-2.5 rounded-full border border-[#FF5A00]/40 uppercase tracking-widest bg-[#FF5A00]/10 text-[#FF5A00] shadow-[0_0_20px_rgba(255,90,0,0.15)]">
            <span>🛡️</span> Certified Counter-Fraud Trade Ecosystem
          </span>
        </div>

        {/* Core Value Proposition Header */}
        <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] tracking-tight">
          High-Trust E-Commerce <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Engineered Without Compromise.
          </span>
        </h1>

        {/* Subtitle / Context */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed font-normal">
          Welcome to <strong className="text-white font-bold">Bold</strong>
          <span className="text-[#FF5A00] font-black">.ng</span> Marketplace. Building verified retail ecosystems to eliminate scams, secure merchant escrow payments, and enforce authenticity across Nigeria.
        </p>

        {/* Primary Call to Action Controls */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setCurrentPage('marketplace')}
            className="w-full sm:w-auto bg-[#FF5A00] hover:bg-[#e04f00] text-white font-black px-9 py-4 rounded-xl cursor-pointer transition-all duration-200 shadow-lg shadow-orange-600/25 border border-transparent hover:scale-[1.02] active:scale-[0.98]"
            aria-label="Navigate to Explore Marketplace"
          >
            Browse Marketplace →
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage('signup')}
            className="w-full sm:w-auto text-white bg-slate-900/80 hover:bg-slate-800 font-bold px-9 py-4 rounded-xl cursor-pointer border border-slate-700 hover:border-slate-500 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            aria-label="Navigate to Merchant Registration"
          >
            Open Store As Seller
          </button>
        </div>
      </section>

      {/* Embedded High-Trust Metric Grid */}
      <section aria-label="Ecosystem Highlights" className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-800/80">
        {trustMetrics.map((metric, idx) => (
          <div 
            key={idx} 
            className="bg-[#16223F]/60 backdrop-blur-md rounded-2xl p-5 border border-slate-800/80 flex items-center gap-4 hover:border-slate-700 transition-colors"
          >
            <div className="w-12 h-12 bg-[#0B132B] rounded-xl flex items-center justify-center text-xl border border-slate-800">
              {metric.icon}
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{metric.label}</p>
              <p className="text-sm font-black text-white mt-0.5">{metric.value}</p>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}