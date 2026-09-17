import React, { useState } from 'react';

export default function HeaderMenu({ activePage, setCurrentPage, userBalance = 0 }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation Links Definition Matrix
  const navLinks = [
    { id: 'marketplace', label: '🛒 Marketplace', description: 'Browse products & services' },
    { id: 'promotions', label: '📈 Promotions Hub', description: 'Scale visibility & ads' },
    { id: 'giftcards', label: '🎁 BoldGifter', description: 'Digital gift cards & top-ups' },
    { id: 'escrow', label: '🔒 Escrow Vault', description: 'Secure transaction ledger' },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsMobileMenuOpen(false); // Close mobile menu on selection
  };

  return (
    <header className="sticky top-0 z-50 bg-[#16223F]/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* BRAND LOGO NODE */}
        <div 
          onClick={() => handleNavClick('marketplace')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FF5A00] flex items-center justify-center font-black text-white text-base shadow-md group-hover:scale-105 transition">
            B
          </div>
          <div>
            <span className="text-sm font-black tracking-wider uppercase block text-white leading-none">
              BOLD<span className="text-[#FF5A00]">.NG</span>
            </span>
            <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest">
              Escrow Ecosystem
            </span>
          </div>
        </div>

        {/* DESKTOP NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0B132B] p-1.5 rounded-2xl border border-slate-800">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-[#FF5A00] text-white shadow-md' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* RIGHT METRICS & MOBILE TOGGLE */}
        <div className="flex items-center gap-3">
          
          {/* USER WALLET BADGE */}
          <div className="hidden sm:flex items-center gap-2 bg-[#0B132B] border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Vault:</span>
            <span className="text-xs font-mono font-black text-[#FF5A00]">
              ₦{Number(userBalance).toLocaleString()}
            </span>
          </div>

          {/* MOBILE HAMBURGER MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden bg-[#0B132B] border border-slate-800 p-2.5 rounded-xl text-slate-200 hover:text-white hover:border-[#FF5A00] transition cursor-pointer focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5 text-[#FF5A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* COLLAPSIBLE MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0B132B] border-b border-slate-800 px-4 pt-3 pb-5 space-y-2 animate-fadeIn shadow-2xl">
          
          {/* Mobile Wallet View */}
          <div className="flex sm:hidden justify-between items-center bg-[#16223F] p-3 rounded-xl border border-slate-800 mb-3">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Escrow Balance Node</span>
            <span className="text-xs font-mono font-black text-[#FF5A00]">
              ₦{Number(userBalance).toLocaleString()}
            </span>
          </div>

          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Navigation Modules</p>

          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition cursor-pointer ${
                  isActive 
                    ? 'bg-[#FF5A00] text-white shadow-md font-black' 
                    : 'bg-[#16223F]/60 text-slate-200 hover:bg-[#16223F] font-bold'
                }`}
              >
                <div>
                  <span className="text-xs block">{link.label}</span>
                  <span className={`text-[9px] font-normal block mt-0.5 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {link.description}
                  </span>
                </div>
                {isActive && <span className="text-xs font-black">●</span>}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}