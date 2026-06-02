import React from 'react';

export default function Home({ setCurrentPage }) {
  return (
    <main className="max-w-2xl mx-auto pt-24 px-6 text-center">
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 text-xs font-extrabold px-5 py-2 rounded-full border border-[#FF5A00] uppercase tracking-wider bg-[#FF5A00]/5 text-[#FF5A00]">
          🛡️ Certified Counter-Fraud Trade Ecosystem
        </span>
      </div>
      
      <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
        High-Trust E-Commerce <br />Engineered Without Compromise.
      </h1>
      
      <p className="mt-7 text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
        Welcome to Bold<span className="text-[#FF5A00] font-bold">.ng</span> Marketplace. Building verified retail ecosystems to eliminate scams, secure merchant escrow payments, and enforce authenticity.
      </p>
      
      <div className="mt-12 flex justify-center items-center gap-6">
        <button 
          onClick={() => setCurrentPage('explore')}
          className="bg-[#FF5A00] text-white font-bold px-8 py-4 rounded-xl cursor-pointer transition duration-200 hover:brightness-110 shadow-xl shadow-orange-600/30 border-none outline-none"
        >
          Browse Marketplace
        </button>
        <button 
          onClick={() => setCurrentPage('signup')}
          className="text-white bg-transparent font-bold px-8 py-4 rounded-xl cursor-pointer border-2 border-slate-600 hover:border-slate-400 transition duration-200 outline-none"
        >
          Open Store As Seller
        </button>
      </div>
    </main>
  );
}