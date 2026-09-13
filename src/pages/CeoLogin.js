import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';

export default function CeoLogin({ onCeoSuccess, setCurrentPage }) {
  const [formData, setFormData] = useState({
    ceoBadgeId: 'BOLD-CEO-VTC-01',
    passcode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const handleCeoAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Verify email match OR fallback to explicit admin clearance
      const isAuthorizedEmail = currentUser?.email?.toLowerCase() === 'boldcassy2@gmail.com';
      const validBadge = formData.ceoBadgeId.trim().toUpperCase().startsWith('BOLD-CEO');
      const validPin = formData.passcode === '2026';

      if (isAuthorizedEmail || (validBadge && validPin)) {
        const ceoProfile = {
          name: 'Ebigbo Vitus Chukwuebuka',
          role: 'Chief Executive Officer',
          entity: 'BOLD DOT NG MARKETPLACE',
          email: currentUser?.email || 'boldcassy2@gmail.com',
          badgeId: formData.ceoBadgeId,
          authenticatedAt: new Date().toISOString()
        };

        localStorage.setItem('bold_ceo_auth', JSON.stringify(ceoProfile));
        
        if (typeof onCeoSuccess === 'function') onCeoSuccess(ceoProfile);
        if (typeof setCurrentPage === 'function') setCurrentPage('ceo-dashboard');
      } else {
        setError('Access Denied: Email boldcassy2@gmail.com not detected or invalid CEO credentials.');
      }
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 text-white text-left">
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/10 px-3 py-1 rounded-full border border-[#FF5A00]/20">
            Executive Access Terminal
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white mt-3">
            CEO Portal Login
          </h2>
          <p className="text-xs text-slate-400">
            Ebigbo Vitus Chukwuebuka • {currentUser?.email || 'boldcassy2@gmail.com'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-950/50 border border-red-900/50 rounded-xl text-xs text-red-400 font-bold flex items-center gap-2">
            <span>🛡️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleCeoAuth} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">
              Linked CEO Email (Firebase Session)
            </label>
            <input
              type="text"
              readOnly
              value={currentUser?.email || 'boldcassy2@gmail.com'}
              className="w-full bg-[#0b132b]/60 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-slate-400 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">
              CEO Badge Identifier
            </label>
            <input
              type="text"
              value={formData.ceoBadgeId}
              onChange={(e) => setFormData({ ...formData, ceoBadgeId: e.target.value })}
              required
              className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm font-mono text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">
              Security Passcode / PIN
            </label>
            <input
              type="password"
              placeholder="Enter PIN (2026)"
              value={formData.passcode}
              onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
              required
              className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-lg cursor-pointer border-none flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : '🔓 Verify & Access CEO Suite'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => setCurrentPage('marketplace')}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Return to Public Marketplace
          </button>
        </div>
      </div>
    </div>
  );
}