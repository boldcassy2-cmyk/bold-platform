import React, { useState } from 'react';

export default function AuthPortal({ setCurrentPage, setMerchantStore, setUserRole }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Professional Classifications: 'buyer', 'solo_seller', 'merchant', 'buyer_and_seller'
  const [selectedRole, setSelectedRole] = useState('buyer_and_seller');
  
  // Specific store details if registering as merchant/solo seller
  const [storeName, setStoreName] = useState('');
  const [storeNiche, setStoreNiche] = useState('General Commerce');

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password Validation Check: At least 8 characters with letters & numbers
  const isValidPassword = (pass) => {
    const hasLength = pass.length >= 8;
    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    return hasLength && hasLetters && hasNumbers;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (isRegistering && !acceptedTerms) {
      setErrorMsg('You must review and accept the Terms of Protocol and Privacy Policy before creating your account.');
      return;
    }

    if (isRegistering && !isValidPassword(password)) {
      setErrorMsg('Password must be at least 8 characters and include both letters and numbers.');
      return;
    }

    // Set role state in parent app based on selection
    if (setUserRole) {
      setUserRole(selectedRole === 'buyer' ? 'USER' : 'MERCHANT');
    }

    if ((selectedRole === 'merchant' || selectedRole === 'solo_seller' || selectedRole === 'buyer_and_seller') && setMerchantStore) {
      setMerchantStore({
        name: storeName || (fullName ? `${fullName}'s Hub` : 'Bold Multi-Vendor Node'),
        niche: storeNiche,
        status: selectedRole === 'merchant' ? 'Verified Enterprise' : selectedRole === 'buyer_and_seller' ? 'Hybrid Buyer & Seller Node' : 'Solo Seller Node',
        location: 'Lagos Headquarters, NG',
        whatsapp: '08000000000'
      });
    }

    setCurrentPage('marketplace');
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 overflow-hidden">
      
      {/* BOLD.NG MODEL GLASS HOUSE HEADQUARTERS BACKGROUND */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B132B]/90 via-[#0B132B]/75 to-[#0B132B]/95"></div>
      </div>

      {/* AUTH CARD CONTAINER */}
      <div className="relative z-10 max-w-lg w-full mx-auto p-8 bg-[#16223F]/95 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl text-white animate-fadeIn">
        
        {/* Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF5A00]/15 border border-[#FF5A00]/30 text-[#FF5A00] text-[10px] font-black uppercase tracking-widest mb-3">
            <span>🏢</span> Bold.ng Glass House Hub
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            {isRegistering ? 'Create BOLD.NG Account' : 'Access BOLD Gateway'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isRegistering 
              ? 'Unified gateway for buyers, solo creators, and enterprise merchants' 
              : 'Log in to manage your active orders & secure escrow vault'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-950/50 border border-red-500/50 rounded-xl text-red-400 text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* PROFESSIONAL ROLE SELECTOR DROPDOWN / TOGGLE */}
          {isRegistering && (
            <div className="space-y-2 pb-2 border-b border-slate-700/80">
              <label className="block text-[11px] font-mono text-orange-400 uppercase tracking-wider">
                Select Account Classification (Buyers can also sell)
              </label>
              
              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#FF5A00] cursor-pointer"
                >
                  <option value="buyer_and_seller">🛒 Hybrid Mode: Buyer & Seller (Recommended)</option>
                  <option value="buyer">🛍️ Pure Buyer (Shop & Secure Escrow)</option>
                  <option value="solo_seller">⚡ Solo Seller Node (List & Ship)</option>
                  <option value="merchant">🏢 Verified Enterprise Merchant</option>
                </select>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                {selectedRole === 'buyer_and_seller' && '⚡ Full access to purchase items and instantly launch your storefront anytime.'}
                {selectedRole === 'buyer' && '🛡️ Optimized for secure shopping with escrow protection.'}
                {selectedRole === 'solo_seller' && '📦 Tailored for individual vendors and creators.'}
                {selectedRole === 'merchant' && '🏛️ Enterprise multi-vendor store with priority hub dispatch.'}
              </p>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              {isRegistering ? 'Full Name / Representative' : 'Email Address'}
            </label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isRegistering ? 'e.g. Chukwuebuka Cassidy' : 'name@example.com'} 
              className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com" 
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5A00]"
              />
            </div>
          )}

          {/* STORE CONFIGURATION FIELDS (Appears if role allows selling) */}
          {isRegistering && (selectedRole === 'merchant' || selectedRole === 'solo_seller' || selectedRole === 'buyer_and_seller') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-[#0B132B]/80 border border-slate-700 rounded-2xl">
              <div>
                <label className="block text-[10px] font-mono text-orange-400 uppercase tracking-wider mb-1">Store / Business Name</label>
                <input 
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Bold Streetwear Hub"
                  className="w-full bg-[#16223F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF5A00]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-orange-400 uppercase tracking-wider mb-1">Store Niche</label>
                <select
                  value={storeNiche}
                  onChange={(e) => setStoreNiche(e.target.value)}
                  className="w-full bg-[#16223F] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF5A00]"
                >
                  <option value="General Commerce">General Commerce</option>
                  <option value="Streetwear & Fashion">Streetwear & Fashion</option>
                  <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                  <option value="Automotive & Parts">Automotive & Parts</option>
                  <option value="Gift Cards & Digital">Gift Cards & Digital</option>
                </select>
              </div>
            </div>
          )}

          {!isRegistering && (
            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5A00]"
              />
            </div>
          )}

          {isRegistering && (
            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider mb-1.5">Create Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5A00]"
              />
              <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                <span className={password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password) ? "text-green-400" : "text-amber-400"}>
                  ℹ️
                </span> 
                Must be at least 8 characters with letters & numbers.
              </p>
            </div>
          )}

          {isRegistering && (
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#FF5A00] rounded cursor-pointer"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  I agree to the{' '}
                  <button 
                    type="button" 
                    onClick={() => setCurrentPage('terms')} 
                    className="text-[#FF5A00] font-bold underline hover:text-orange-400 bg-transparent border-none cursor-pointer p-0 inline"
                  >
                    Terms of Protocol
                  </button>{' '}
                  and Privacy Policy governing marketplace escrow transactions on Bold.ng.
                </span>
              </label>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-[#FF5A00] hover:bg-orange-600 text-white font-black py-3.5 rounded-xl shadow-[0_0_15px_rgba(255,90,0,0.4)] transition-all cursor-pointer mt-2 text-sm uppercase tracking-wider"
          >
            {isRegistering ? 'Initialize Secure Account' : 'Secure Login'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-700/80 pt-4">
          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-slate-300 hover:text-white bg-transparent border-none cursor-pointer"
          >
            {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Create Account"}
          </button>
        </div>

      </div>
    </div>
  );
}