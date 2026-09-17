import React from 'react';

export default function Footer({ footerNav = [], onNavigate }) {
  return (
    <footer className="bg-[#16223F] text-slate-400 py-8 px-6 mt-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-lg font-black text-white tracking-tighter uppercase">
            BOLD<span className="text-[#FF5A00]">.NG</span>
          </span>
          <p className="text-xs mt-1">Multi-Sector Commerce & Escrow Protocol</p>
        </div>

        {/* Gathered Dropdown Menu for Footer Links */}
        {footerNav.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="footer-nav-select" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Explore Portal:
            </label>
            <select
              id="footer-nav-select"
              defaultValue=""
              onChange={(e) => {
                const targetId = e.target.value;
                if (targetId && onNavigate) {
                  onNavigate(targetId);
                  // Reset select back to default prompt option
                  e.target.value = "";
                }
              }}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-3 py-2 cursor-pointer focus:outline-none focus:border-[#FF5A00] transition-colors"
            >
              <option value="" disabled>
                -- Select a Section --
              </option>
              {footerNav.map((link, idx) => (
                <option key={idx} value={link.id}>
                  {link.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} Bold.ng. All rights reserved.
        </div>
      </div>
    </footer>
  );
}