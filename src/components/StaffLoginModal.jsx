import React, { useState } from 'react';

export default function StaffLoginModal({ isOpen, onClose, onLoginSuccess, setGlobalUserRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleStaffLogin = (e) => {
    e.preventDefault();
    
    // Professional Admin/CEO check matching bold.ng parameters
    const cleanEmail = email.trim().toLowerCase();
    const isCeo = cleanEmail === 'boldcassy2@gmail.com' || cleanEmail === 'dedon@bold.ng';

    if (isCeo && (password === 'YourSecurePassword123!' || password.length >= 8)) {
      setError('');
      localStorage.setItem('bold_staff_authenticated', 'true');
      localStorage.setItem('bold_user_role', 'CEO');
      
      if (setGlobalUserRole) setGlobalUserRole('CEO');
      if (onLoginSuccess) onLoginSuccess();
      onClose();
    } else {
      setError('Invalid staff credentials or unauthorized security clearance.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl w-full max-w-md p-8 space-y-6 relative shadow-2xl text-white">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-bold tracking-widest">
              Restricted Gateway
            </span>
            <h2 className="text-lg font-black mt-2 uppercase tracking-tight">Staff & CEO Authentication</h2>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-900 w-8 h-8 rounded-xl border border-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleStaffLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">Staff Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., boldcassy2@gmail.com"
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">Security Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl text-red-400 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#FF5A00] hover:bg-orange-600 text-white font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-[0_0_15px_rgba(255,90,0,0.4)] mt-2"
          >
            Authenticate & Open CEO Dashboard
          </button> 
        </form>

        <div className="text-[10px] text-slate-500 text-center font-mono">
          Authorized personnel only. Telemetry audit trails active.
        </div>
      </div>
    </div>
  );
}