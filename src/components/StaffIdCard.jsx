import React from 'react';

export default function StaffIdCard({ 
  staffName = "Dedon Cassidy", 
  staffRole = "CEO & Founder", 
  department = "Executive Admin", 
  staffId = "BOLD-NG-001",
  email = "ceo@bold.ng",
  avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] font-mono text-[#FF5A00] tracking-widest uppercase font-bold">
            Official Credential
          </span>
          <h2 className="text-lg font-black text-white">bold.ng Staff ID Badge</h2>
        </div>
        <button
          onClick={handlePrint}
          className="bg-[#FF5A00] hover:bg-[#e05000] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg cursor-pointer print:hidden"
        >
          Print Badge 🖨️
        </button>
      </div>

      {/* ID Card Print Container */}
      <div className="w-[340px] h-[520px] mx-auto bg-gradient-to-b from-[#0B132B] via-[#16223F] to-[#0B132B] rounded-2xl border-2 border-amber-500/30 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden text-white font-sans">
        
        {/* Background Decorative Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#FF5A00]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-3 relative z-10">
          <div>
            <span className="text-xl font-black tracking-tighter text-white">
              bold<span className="text-[#FF5A00]">.ng</span>
            </span>
            <span className="block text-[8px] tracking-widest text-slate-400 uppercase font-mono">
              Secure Escrow Protocol
            </span>
          </div>
          <span className="bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/40 text-[9px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold">
            {department}
          </span>
        </div>

        {/* Staff Photo & Details */}
        <div className="flex flex-col items-center text-center space-y-3 relative z-10 my-auto">
          <div className="w-24 h-24 rounded-2xl p-1 bg-gradient-to-tr from-[#FF5A00] to-amber-400 shadow-xl">
            <img 
              src={avatarUrl} 
              alt={staffName} 
              className="w-full h-full object-cover rounded-xl bg-slate-800"
            />
          </div>

          <div>
            <h3 className="text-base font-black text-white tracking-tight">{staffName}</h3>
            <p className="text-xs font-bold text-[#FF5A00] mt-0.5">{staffRole}</p>
            <p className="text-[10px] font-mono text-slate-400 mt-1">{email}</p>
          </div>
        </div>

        {/* Card Footer / Barcode & ID */}
        <div className="border-t border-white/10 pt-3 flex justify-between items-end relative z-10">
          <div>
            <span className="text-[8px] font-mono text-slate-400 uppercase block">Staff ID No.</span>
            <span className="text-xs font-mono font-bold text-white">{staffId}</span>
          </div>

          {/* Simulated QR Code / Security Stamp */}
          <div className="bg-white p-1.5 rounded-lg shadow">
            <div className="w-10 h-10 bg-slate-900 flex items-center justify-center text-[7px] font-mono text-amber-400 text-center leading-tight">
              SECURE VERIFY
            </div>
          </div>
        </div>

      </div>

      <p className="text-[11px] text-slate-400 text-center">
        This card is property of bold.ng. If found, please return to the nearest regional hub or HR department.
      </p>
    </div>
  );
}