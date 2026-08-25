import React from 'react';

export default function Footer() {
  // Current year for copyright dynamically
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B132B] text-slate-300 border-t border-slate-800/80 font-sans">
      {/* MAIN FOOTER GRID CONTAINER */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* BRAND COLUMN (4 Cols wide) */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            {/* Replace with your structural logo asset if needed */}
            <span className="text-2xl font-black tracking-tight text-white">
              bold<span className="text-[#FF5A00]">.ng</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
            The secure escrow marketplace platform. Eliminating transaction risks and building absolute merchant trust across Nigeria.
          </p>
          
          {/* SOCIAL MEDIA HANDLES */}
          <div className="pt-2">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-3">
              Connect Channels
            </p>
            <div className="flex items-center gap-3">
              {/* FACEBOOK */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-[#16223F] border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#3b5998] hover:border-[#3b5998] transition-all duration-200 text-sm">
                <i className="fab fa-facebook-f">FB</i>
              </a>
              {/* INSTAGRAM */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-[#16223F] border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#E1306C] hover:border-[#E1306C] transition-all duration-200 text-sm">
                <i className="fab fa-instagram">IG</i>
              </a>
              {/* X (TWITTER) */}
              <a href="https://x.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-[#16223F] border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-black hover:border-black transition-all duration-200 text-sm">
                <i className="fab fa-x-twitter">X</i>
              </a>
              {/* TIKTOK */}
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-[#16223F] border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#00f2fe] hover:border-[#00f2fe] transition-all duration-200 text-sm">
                <i className="fab fa-tiktok">TT</i>
              </a>
              {/* YOUTUBE */}
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 bg-[#16223F] border border-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#ff0000] hover:border-[#ff0000] transition-all duration-200 text-sm">
                <i className="fab fa-youtube">YT</i>
              </a>
            </div>
          </div>
        </div>

        {/* NAVIGATION MENU 1: MARKETPLACE DISCOVERY (2 Cols wide) */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
            Marketplace
          </h4>
          <ul className="space-y-2 text-xs font-medium text-slate-400">
            <li><a href="#discover" className="hover:text-[#FF5A00] transition">Discover Stores</a></li>
            <li><a href="#streetwear" className="hover:text-[#FF5A00] transition">Streetwear Node</a></li>
            <li><a href="#automotive" className="hover:text-[#FF5A00] transition">Automotive Port</a></li>
            <li><a href="#escrow" className="hover:text-[#FF5A00] transition">How Escrow Works</a></li>
          </ul>
        </div>

        {/* NAVIGATION MENU 2: SYSTEM LINKS (2 Cols wide) */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
            Merchant Matrix
          </h4>
          <ul className="space-y-2 text-xs font-medium text-slate-400">
            <li><a href="#onboard" className="hover:text-[#FF5A00] transition">Apply as Vendor</a></li>
            <li><a href="#guidelines" className="hover:text-[#FF5A00] transition">Escrow Guidelines</a></li>
            <li><a href="#security" className="hover:text-[#FF5A00] transition">Security Telemetry</a></li>
            <li><a href="#terms" className="hover:text-[#FF5A00] transition">Terms of Protocol</a></li>
          </ul>
        </div>

        {/* CUSTOMER SERVICE & OPERATIONS CONTACT (4 Cols wide) */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
            Customer Operations Support
          </h4>
          <div className="p-4 bg-[#16223F] border border-slate-800 rounded-2xl space-y-3 text-xs font-medium">
            <div className="flex items-start gap-2.5">
              <span className="text-base text-[#FF5A00]">📞</span>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Live Support Hotlines</p>
                <p className="text-white mt-0.5 font-mono">+234 (0) 800-BOLD-MARKET</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2.5">
              <span className="text-base text-[#FF5A00]">✉️</span>
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide">Corporate Service Node</p>
                <a href="mailto:support@bold.ng" className="text-white hover:text-[#FF5A00] underline mt-0.5 block font-mono">
                  support@bold.ng
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-1 border-t border-slate-800/60">
              <span className="text-base text-slate-400">📍</span>
              <div>
                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-wide">Logistics Headquarters</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM BASEBAR SECTION */}
      <div className="border-t border-slate-800/60 bg-[#070D1E] py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-slate-500">
          <p>© {currentYear} bold.ng. All infrastructure rights deployed.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400 transition">Privacy Ledger</a>
            <a href="#compliance" className="hover:text-slate-400 transition">NDPR Compliance</a>
            <a href="#status" className="hover:text-slate-400 flex items-center gap-1.5 transition">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              All Nodes Operational
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}