import React from 'react';

export default function Footer({ setCurrentPage }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B132B] text-slate-300 font-sans border-t border-slate-800">
      
      {/* BACK TO TOP BUTTON */}
      <button 
        onClick={scrollToTop}
        className="w-full bg-[#16223F] hover:bg-[#1f2f56] text-white text-xs font-bold py-4 text-center transition cursor-pointer border-b border-slate-800 tracking-wider uppercase"
      >
        Back to top ↑
      </button>

      {/* MAIN FOOTER LINK COLUMNS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* COLUMN 1: GET TO KNOW US */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-black uppercase tracking-wider">Get to Know Us</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentPage('footer-about')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  About Bold NG
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('academy')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Careers & Academy
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('footer-press')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Press Releases
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('footer-policies')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Policies & Trust
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 2: MAKE MONEY WITH US */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-black uppercase tracking-wider">Make Money with Us</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentPage('signup')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Sell on Bold NG
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('footer-brand')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Protect & Build Your Brand
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('footer-advertise')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Advertise Your Products
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('footer-affiliate')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Become an Affiliate
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: PAYMENT PRODUCTS */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-black uppercase tracking-wider">Payment Products</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentPage('footer-escrow')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Bold Escrow Secure
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('footer-cards')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Business Cards & Credit
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('footer-wallet')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Reload Your Account
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('footer-currency')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Currency Converter
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: LET US HELP YOU */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-black uppercase tracking-wider">Let Us Help You</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setCurrentPage('dashboard')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Your Account & Orders
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('footer-shipping')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Shipping Rates & Policies
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('footer-returns')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Returns & Replacements
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('footer-support')} className="hover:text-[#FF5A00] transition text-left cursor-pointer">
                  Help Center & Support
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BRAND ROW */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-white">Bold<span className="text-[#FF5A00]">.ng</span></span>
            <span className="text-xs text-slate-500 font-mono">| Nigeria's High-Trust Multi-Vendor Marketplace</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} Bold.ng. All rights reserved. Escrow & CAC Verified.
          </p>
        </div>

      </div>
    </footer>
  );
}