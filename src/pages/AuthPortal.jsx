import React, { useState } from 'react';

export default function AuthPortal({ setCurrentPage, setMerchantStore, setUserRole }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Role selector: 'buyer', 'merchant', or 'solo_seller'
  const [selectedRole, setSelectedRole] = useState('buyer');
  
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

    if ((selectedRole === 'merchant' || selectedRole === 'solo_seller') && setMerchantStore) {
      setMerchantStore({
        name: storeName || fullName || 'Bold Solo Merchant',
        niche: storeNiche,
        status: selectedRole === 'merchant' ? 'Verified Enterprise' : 'Solo Seller Node',
        location: 'Lagos, NG',
        whatsapp: '08000000000'
      });
    }

    // Redirect to marketplace or dashboard after auth simulation
    setCurrentPage('marketplace');
  };

  return (
    <div className="max-w-lg mx-auto my-12 p-8 bg-[#16223F] border border-slate-800 rounded-3xl shadow-2xl text-white animate-fadeIn">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#FF5A00] rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_15px_rgba(255,90,0,0.4)] mb-3">
          <span className="text-white text-2xl font-black">B</span>
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">
          {isRegistering ? 'Create BOLD.NG Account' : 'Access BOLD Gateway'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isRegistering 
            ? 'Choose your account type to join the multi-vendor ecosystem' 
            : 'Log in to manage your active orders & escrow vault'}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-red-950/40 border border-red-500/50 rounded-xl text-red-400 text-xs font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegistering && (
          <div className="space-y-3 pb-2 border-b border-slate-800">
            <label className="block text-[11px] font-mono text-slate-300 uppercase tracking-wider">Select Account / Seller Classification</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('buyer')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedRole === 'buyer' 
                    ? 'bg-[#FF5A00] border-[#FF5A00] text-white shadow-[0_0_10px_rgba(255,90,0,0.4)]' 
                    : 'bg-[#0B132B] border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🛒</span> Buyer
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedRole('solo_seller')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedRole === 'solo_seller' 
                    ? 'bg-[#FF5A00] border-[#FF5A00] text-white shadow-[0_0_10px_rgba(255,90,0,0.4)]' 
                    : 'bg-[#0B132B] border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>⚡</span> Solo Seller
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('merchant')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedRole === 'merchant' 
                    ? 'bg-[#FF5A00] border-[#FF5A00] text-white shadow-[0_0_10px_rgba(255,90,0,0.4)]' 
                    : 'bg-[#0B132B] border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🏢</span> Verified Store
              </button>
            </div>
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
            placeholder={isRegistering ? 'e.g. Dedon Cassidy' : 'name@example.com'} 
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

        {isRegistering && (selectedRole === 'merchant' || selectedRole === 'solo_seller') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-[#0B132B]/60 border border-slate-800 rounded-2xl">
            <div>
              <label className="block text-[10px] font-mono text-orange-400 uppercase tracking-wider mb-1">Store / Business Name</label>
              <input 
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Bold Streetwear Hub"
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF5A00]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-orange-400 uppercase tracking-wider mb-1">Store Niche</label>
              <select
                value={storeNiche}
                onChange={(e) => setStoreNiche(e.target.value)}
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF5A00]"
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
          {isRegistering ? `Register as ${selectedRole === 'buyer' ? 'Buyer' : selectedRole === 'solo_seller' ? 'Solo Seller' : 'Verified Merchant'}` : 'Secure Login'}
        </button>
      </form>

      <div className="mt-6 text-center border-t border-slate-800 pt-4">
        <button 
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-xs text-slate-400 hover:text-white bg-transparent border-none cursor-pointer"
        >
          {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Create Customer / Seller Account"}
        </button>
      </div>
    </div>
  );
}