import React, { useState } from 'react';

export default function StaffLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleStaffLogin = (e) => {
    e.preventDefault();
    
    // Updated with your custom staff credentials
    if (email.trim().toLowerCase() === 'dedon@bold.ng' && password === 'YourSecurePassword123!') {
      setError('');
      localStorage.setItem('bold_staff_authenticated', 'true');
      localStorage.setItem('bold_user_role', 'admin');
      onLoginSuccess();
      onClose();
    } else {
      setError('Invalid staff credentials or unauthorized access attempt.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#16223F] border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 relative shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase bg-red-500/20 text-red-400 px-2.5 py-1 rounded-full font-bold">
              Restricted Area
            </span>
            <h2 className="text-lg font-black text-white mt-1">Staff & CEO Authentication</h2>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-bold cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        <form onSubmit={handleStaffLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Staff Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., dedon@bold.ng"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Staff Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-red-400 text-[11px] font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#FF5A00] hover:bg-orange-600 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-orange-600/20"
          >
            Authenticate & Open Admin Portal
          </button>
        </form>

        <div className="text-[10px] text-slate-500 text-center">
          Authorized personnel only. All login attempts are monitored and logged.
        </div>
      </div>
    </div>
  );
}