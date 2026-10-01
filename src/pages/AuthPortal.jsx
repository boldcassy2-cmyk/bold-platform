import React, { useState } from 'react';

export default function AuthScreen({ 
  onLoginSuccess, 
  onRegisterSuccess, 
  setCurrentPage, 
  initialMode = 'signin' // 'signin' or 'register'
}) {
  const [isRegistering, setIsRegistering] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [accountType, setAccountType] = useState('solo'); // 'solo' or 'merchant'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sample avatar presets for quick selection
  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegistering) {
        // --- REGISTER LOGIC ---
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (!email || !password) throw new Error('Please enter email and password.');
        
        // Simulating Backend registration call
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const finalAvatar = photoURL.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

        const newUserObject = { 
          email, 
          displayName: name.trim(), 
          photoURL: finalAvatar,
          uid: 'user_' + Date.now(), 
          role: accountType, // Passes 'solo' or 'merchant'
          createdAt: new Date().toISOString()
        };

        if (typeof onRegisterSuccess === 'function') {
          onRegisterSuccess(newUserObject);
        }

        setSuccessMsg(`Welcome, ${name.trim()}! Account created successfully.`);
        
        // Keep them on success notice for 1.2s, then take them straight to dashboard
        setTimeout(() => {
          setCurrentPage('dashboard');
        }, 1200);

      } else {
        // --- LOGIN LOGIC ---
        if (!email || !password) throw new Error('Please enter your email and password.');
        
        // Simulating Backend login call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Extract clean display name from email if name wasn't stored
        const derivedName = email.split('@')[0];
        const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

        const loggedInUserObject = { 
          email, 
          displayName: formattedName, 
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          uid: 'user_' + Date.now(),
          role: 'solo',
          createdAt: new Date().toISOString()
        };

        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(loggedInUserObject);
        }

        setSuccessMsg(`Sign in successful! Welcome back, ${formattedName}.`);
        
        // Short delay to show success notice before routing to dashboard like Amazon
        setTimeout(() => {
          setCurrentPage('dashboard');
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0f1111] flex flex-col justify-between font-sans selection:bg-[#febd69]">
      
      {/* Amazon Style Minimal Header */}
      <header className="py-6 flex flex-col items-center justify-center border-b border-slate-200">
        <div 
          onClick={() => setCurrentPage('marketplace')}
          className="cursor-pointer flex items-baseline tracking-tighter"
        >
          <span className="text-3xl font-black text-[#131921]">bold</span>
          <span className="text-3xl font-black text-[#ff9900]">.ng</span>
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
          Secure Marketplace Authentication
        </span>
      </header>

      {/* Main Authentication Card */}
      <main className="w-full max-w-sm mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="border border-slate-300 rounded-xl p-6 sm:p-8 shadow-xs bg-white space-y-5">
          <h1 className="text-2xl font-normal text-[#0f1111] tracking-tight">
            {isRegistering ? 'Create account' : 'Sign in'}
          </h1>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-bold flex items-start gap-2">
              <span className="text-sm">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-bold flex items-start gap-2 animate-pulse">
              <span className="text-sm">✓</span>
              <span>{successMsg} Redirecting to dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Your name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First and last name"
                    className="w-full bg-white border border-slate-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none rounded-md px-3 py-2 text-sm text-[#0f1111]"
                    required={isRegistering}
                  />
                </div>

                {/* Profile Picture / Avatar URL Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block">Profile Image URL (Optional)</label>
                  <input
                    type="url"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-white border border-slate-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none rounded-md px-3 py-2 text-xs text-[#0f1111]"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-500">Quick presets:</span>
                    <div className="flex gap-1.5">
                      {presetAvatars.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="preset"
                          onClick={() => setPhotoURL(img)}
                          className="w-6 h-6 rounded-full cursor-pointer hover:ring-2 hover:ring-[#ff9900] object-cover"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Account Type Selector Toggle */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-800 block">Select account type:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountType('solo')}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        accountType === 'solo' 
                          ? 'bg-[#20b2aa]/10 border-[#20b2aa] text-[#20b2aa]' 
                          : 'bg-white border-slate-300 text-slate-600'
                      }`}
                    >
                      👤 Solo Seller
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('merchant')}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        accountType === 'merchant' 
                          ? 'bg-[#f68b1e]/10 border-[#f68b1e] text-[#f68b1e]' 
                          : 'bg-white border-slate-300 text-slate-600'
                      }`}
                    >
                      🏢 Merchant
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-white border border-slate-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none rounded-md px-3 py-2 text-sm text-[#0f1111]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 block">Password</label>
                {!isRegistering && (
                  <span className="text-xs text-[#0066c0] hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRegistering ? 'At least 6 characters' : 'Enter your password'}
                className="w-full bg-white border border-slate-400 focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600] outline-none rounded-md px-3 py-2 text-sm text-[#0f1111]"
                required
              />
            </div>

            {/* Signature Amazon Yellow CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] border border-[#fcd200] text-[#0f1111] font-medium text-sm py-2.5 rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? 'Please wait...' : (isRegistering ? 'Continue & Verify Email' : 'Sign In')}
            </button>
          </form>

          <p className="text-[11px] text-slate-600 leading-relaxed pt-2">
            By continuing, you agree to bold.ng's <span className="text-[#0066c0] hover:underline cursor-pointer">Conditions of Use</span> and <span className="text-[#0066c0] hover:underline cursor-pointer">Privacy Notice</span>.
          </p>
        </div>

        {/* Divider & Switch Mode Section */}
        <div className="mt-6 text-center">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-500 uppercase tracking-wider">
              {isRegistering ? 'Already have an account?' : 'New to bold.ng?'}
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setSuccessMsg('');
            }}
            className="w-full mt-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 border border-slate-300 text-[#0f1111] font-medium text-sm py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            {isRegistering ? 'Sign in to your bold.ng account' : 'Create your bold.ng account'}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#f8f9fa] border-t border-slate-200 py-6 text-center text-[11px] text-slate-500 space-y-2">
        <div className="flex justify-center space-x-6">
          <span className="hover:underline cursor-pointer text-[#0066c0]">Conditions of Use</span>
          <span className="hover:underline cursor-pointer text-[#0066c0]">Privacy Notice</span>
          <span className="hover:underline cursor-pointer text-[#0066c0]">Help</span>
        </div>
        <p>© 1996-{new Date().getFullYear()}, Bold Dot NG Marketplace, Inc. or its affiliates.</p>
      </footer>
    </div>
  );
}