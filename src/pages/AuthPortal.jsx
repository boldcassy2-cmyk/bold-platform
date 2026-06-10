import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';

export default function AuthPortal({ setCurrentPage, setMerchantStore }) {
  // Navigation Matrices & Flow Nodes
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [verificationStep, setVerificationStep] = useState('auth'); // 'auth' | 'awaiting_email_verification'

  // Input States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [niche, setNiche] = useState("Men's Streetwear & Apparel");
  const [location, setLocation] = useState('Lagos, NG');
  const [whatsapp, setWhatsapp] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Security Visibility States
  const [showPassword, setShowPassword] = useState(false);
  
  // Bot Deflection (Robot Confirmation Matrix)
  const [botChallenge, setBotChallenge] = useState({ num1: Math.floor(Math.random() * 9) + 2, num2: Math.floor(Math.random() * 8) + 1 });
  const [botAnswer, setBotAnswer] = useState('');
  const [isRobotVerified, setIsRobotVerified] = useState(false);

  // Status & Traceable Log Fields
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditLog, setAuditLog] = useState([]);

  // Traceability Logging Mechanism
  const logSecurityEvent = (action, status, details = '') => {
    const timestamp = new Date().toISOString();
    const mockTelemetryHash = `HEX-${Math.random().toString(16).substr(2, 8).toUpperCase()}`;
    const entry = `[${timestamp}] AUTH_NODE_${action} | STATUS: ${status} | HASH: ${mockTelemetryHash} ${details ? `| INFO: ${details}` : ''}`;
    setAuditLog(prev => [entry, ...prev].slice(0, 5));
    console.warn(`[SECURITY_AUDIT] ${entry}`);
  };

  // Robot Protection Vector Verification
  const verifyHumanCheck = () => {
    if (parseInt(botAnswer) === (botChallenge.num1 + botChallenge.num2)) {
      setIsRobotVerified(true);
      setErrorMsg('');
      logSecurityEvent('BOT_CHALLENGE', 'SUCCESS', 'Human validation cleared');
    } else {
      setIsRobotVerified(false);
      setErrorMsg('Robot confirmation sequence failed. Equation validation mismatch.');
      logSecurityEvent('BOT_CHALLENGE', 'FAILED', 'Invalid mathematical sum response');
    }
  };

  // Password Recovery Reset Hook
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Provide a verified email target node.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg('Recovery authorization link dispatched to your real inbox.');
      logSecurityEvent('PASSWORD_RESET', 'DISPATCHED', `Target: ${email}`);
    } catch (err) {
      setErrorMsg(err.message || 'Reset transaction timeout.');
      logSecurityEvent('PASSWORD_RESET', 'FAILED', err.code);
    } finally {
      setLoading(false);
    }
  };

  // Master Authentication Process Handler
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isRobotVerified) {
      setErrorMsg('Please perform the automated robot protection confirmation challenge.');
      return;
    }

    setLoading(true);

    try {
      if (isLoginMode) {
        // ==========================================
        // LIVE SIGN IN ROUTE
        // ==========================================
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Dynamic check: Prevent entry if they haven't verified their real email link yet!
        if (!userCredential.user.emailVerified) {
          setErrorMsg('Access locked. You must verify your corporate email address via the live link sent to your inbox first.');
          setLoading(false);
          return;
        }

        logSecurityEvent('SIGN_IN', 'SUCCESS', `UID: ${userCredential.user.uid}`);

        setMerchantStore({
          name: email.split('@')[0].toUpperCase() + ' Node',
          niche: "Multi-Sector Merchant",
          status: 'Active Vector',
          location: 'Lagos, NG',
          whatsapp: whatsapp || '08000000000'
        });
        setCurrentPage('store');
      } else {
        // ==========================================
        // LIVE REGISTRATION + REAL EMAIL DISPATCH ROUTE
        // ==========================================
        if (!storeName.trim() || !whatsapp.trim()) {
          setErrorMsg('All infrastructure parameters must be explicitly populated.');
          setLoading(false);
          return;
        }
        if (!agreedToTerms) {
          setErrorMsg('Escrow guidelines must be authorized.');
          setLoading(false);
          return;
        }

        // 1. Commit the user to real Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // 2. Instantly fire a physical verification link to their real email inbox
        await sendEmailVerification(userCredential.user);
        
        logSecurityEvent('REGISTRATION_INIT', 'EMAIL_DISPATCHED', `UID: ${userCredential.user.uid}`);

        // 3. Move them to the screen telling them to check their phone/computer inbox
        setVerificationStep('awaiting_email_verification');
        setLoading(false);
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This identity string is already deployed to another store node.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Security vulnerability: Password must be at least 6 characters long.');
      } else if (err.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid login credentials. Please verify your email and password strings.');
      } else {
        setErrorMsg(err.message || 'Handshake loop failure.');
      }
      logSecurityEvent(isLoginMode ? 'SIGN_IN' : 'REGISTRATION_FAILURE', 'FAILED', err.code);
      setLoading(false);
    }
  };

  // Check verification state when they click complete button
  const handleCheckEmailVerificationStatus = async () => {
    setLoading(true);
    setErrorMsg('');
    
    try {
      // Force reload user metadata parameters to see if they clicked the email link yet
      await auth.currentUser.reload();
      const isVerified = auth.currentUser.emailVerified;

      if (isVerified) {
        logSecurityEvent('REGISTRATION_COMPLETE', 'SUCCESS', `UID: ${auth.currentUser.uid}`);
        
        let cleanPhone = whatsapp.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '234' + cleanPhone.substring(1);

        setMerchantStore({
          name: storeName,
          niche: niche,
          status: 'Verified Node',
          location: location,
          whatsapp: cleanPhone
        });

        setCurrentPage('store');
      } else {
        setErrorMsg('Verification link not cleared yet. Open your real email inbox, click the secure link from Bold/Firebase, then return here to click confirm.');
      }
    } catch (err) {
      setErrorMsg('Failed to sync authentication parameters. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-8 px-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch animate-fadeIn text-white">
      
      {/* LEFT COLUMN: BRAND PROPS AND LIVE LOG MONITOR */}
      <div className="md:col-span-5 bg-[#16223F] border border-slate-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-xl">
        <div className="space-y-6 relative z-10">
          <div className="inline-block bg-[#FF5A00] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
            Bold Security Matrix v3.5
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Absolute <span className="text-[#FF5A00]">Escrow</span> Protection.
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              Every profile deployment triggers live verification handshakes, cryptographic tracking logs, and dual out-of-band communication validations.
            </p>
          </div>
        </div>

        {/* Live Traceable Audit Tracker Output Block */}
        <div className="mt-8 bg-[#0B132B] p-4 rounded-xl border border-slate-800/80 font-mono text-[9px] text-slate-400 space-y-1.5">
          <p className="text-[#FF5A00] font-bold uppercase tracking-wider mb-1">🔴 Live Security Node Output:</p>
          {auditLog.length === 0 ? (
            <p className="text-slate-600 italic">Awaiting structural authorization traces...</p>
          ) : (
            auditLog.map((log, i) => <p key={i} className="truncate text-emerald-400/90">{log}</p>)
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: CORE SECURE INPUT FORMS */}
      <div className="md:col-span-7 bg-[#16223F] border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-center">
        
        {/* VIEW TYPE A: PASSWORD RESET RECOVERY */}
        {showForgotPassword ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-black tracking-tight text-amber-400">Initialize Identity Recovery</h3>
              <p className="text-slate-400 text-xs font-medium mt-1">Dispatches secure bypass access tokens to your baseline corporate communication link.</p>
            </div>

            {errorMsg && <div className="p-3 bg-red-950/40 border border-red-900/50 text-red-400 rounded-xl text-xs font-bold">⚠️ {errorMsg}</div>}
            {successMsg && <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 rounded-xl text-xs font-bold">✅ {successMsg}</div>}

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Registered Recovery Target Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] rounded-xl px-4 py-3 text-sm text-white outline-none transition" 
                  required 
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest py-4 rounded-xl border-none cursor-pointer">
                {loading ? 'Processing Cryptographic Sync...' : '🔧 Dispatch Recovery Link'}
              </button>
              <div className="text-center">
                <button type="button" onClick={() => { setShowForgotPassword(false); setErrorMsg(''); setSuccessMsg(''); }} className="bg-transparent border-none text-xs text-slate-400 font-bold hover:underline cursor-pointer">← Return to Access Gate</button>
              </div>
            </form>
          </div>
        ) : verificationStep === 'awaiting_email_verification' ? (
          
          /* VIEW TYPE B: REAL-TIME INBOX VERIFICATION CHECKPOINT SCREEN */
          <div className="space-y-5 text-center py-6">
            <div className="w-16 h-16 bg-[#FF5A00]/10 text-[#FF5A00] text-3xl flex items-center justify-center rounded-full mx-auto animate-pulse">
              ✉️
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-emerald-400">Real-Time Verification Link Dispatched</h3>
              <p className="text-slate-400 text-xs font-medium mt-2 leading-relaxed">
                We've fired an authorization connection link directly to <span className="text-white font-bold font-mono">{email}</span>.
              </p>
              <p className="text-amber-400 text-[11px] font-bold mt-2">
                ⚠️ Action Required: Go open your mailbox, click the link to verify, then come back and hit the button below!
              </p>
            </div>

            {errorMsg && <div className="p-3 bg-red-950/40 border border-red-900/50 text-red-400 rounded-xl text-xs font-bold text-left">⚠️ {errorMsg}</div>}

            <div className="space-y-3 pt-2">
              <button 
                type="button" 
                onClick={handleCheckEmailVerificationStatus}
                disabled={loading}
                className="w-full bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest py-4 rounded-xl border-none cursor-pointer shadow-lg hover:bg-emerald-400 transition"
              >
                {loading ? 'Syncing Handshake Parameters...' : '✓ I Have Verified My Email'}
              </button>
              
              <button
                type="button"
                onClick={() => { setVerificationStep('auth'); }}
                className="text-xs text-slate-400 underline cursor-pointer bg-transparent border-none"
              >
                Go back & update info
              </button>
            </div>
          </div>
        ) : (
          
          /* VIEW TYPE C: MAIN AUTHENTICATION GATEWAY */
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-black tracking-tight">{isLoginMode ? 'Access Portal' : 'Onboard Merchant Node'}</h3>
              <p className="text-slate-400 text-xs font-medium mt-1">
                {isLoginMode ? 'Enter authorization strings to boot up your system workspace.' : 'Configure your profile fields below to activate your vendor dashboard.'}
              </p>
            </div>

            {errorMsg && <div className="mb-4 p-3 bg-red-950/40 border border-red-900/50 text-red-400 rounded-xl text-xs font-bold tracking-wide">⚠️ {errorMsg}</div>}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* PRIMARY CREDENTIAL INPUTS */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Corporate Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="identity@bold.ng" 
                  className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] rounded-xl px-4 py-3 text-sm text-white font-medium outline-none transition" 
                  required 
                />
              </div>

              {/* SECURE PASSWORD INPUT WITH EYE TOGGLE */}
              <div className="space-y-1.5 relative">
                <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Secure Security Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] rounded-xl pl-4 pr-12 py-3 text-sm text-white font-mono outline-none transition" 
                    required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer text-base hover:opacity-80 p-1"
                  >
                    {showPassword ? '👁️' : '🕶️'}
                  </button>
                </div>
                {isLoginMode && (
                  <div className="text-right pt-0.5">
                    <button type="button" onClick={() => { setShowForgotPassword(true); setErrorMsg(''); }} className="bg-transparent border-none text-[10px] text-slate-400 hover:text-[#FF5A00] cursor-pointer font-bold">Forgotten Access Key Sequence?</button>
                  </div>
                )}
              </div>

              {/* ONBOARDING DETAIL FIELD LAYERS */}
              {!isLoginMode && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Store / Business Brand Name</label>
                    <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="e.g., Bold Dot NG Store" className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] rounded-xl px-4 py-3 text-sm text-white font-medium outline-none transition" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Commerce Core Niche</label>
                      <select value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] rounded-xl px-3 py-3 text-sm text-white outline-none transition cursor-pointer">
                        <option value="Men's Streetwear & Apparel">👕 Men's Streetwear & Apparel</option>
                        <option value="Automotive Sourcing">🚗 Automotive Sourcing</option>
                        <option value="Premium Gadgetry & Electronics">💻 Premium Electronics</option>
                        <option value="Real Estate Development">🏢 Real Estate Properties</option>
                        <option value="Educational Mentorship">📚 Mentorship & Services</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Operational Logistics Base</label>
                      <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] rounded-xl px-3 py-3 text-sm text-white outline-none transition cursor-pointer">
                        <option value="Lagos, NG">Lagos, Nigeria</option>
                        <option value="Abuja, NG">Abuja, Nigeria</option>
                        <option value="Port Harcourt, NG">Port Harcourt, Nigeria</option>
                        <option value="Remote Operations">Global / Remote</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">WhatsApp Communication Routing Line</label>
                    <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="e.g., 08031234567" className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] rounded-xl px-4 py-3 text-sm text-white font-mono font-medium outline-none transition" />
                  </div>

                  <label className="flex items-start gap-3 pt-2 group cursor-pointer select-none">
                    {/* FIXED: changed e.checked to e.target.checked */}
                    <input 
                      type="checkbox" 
                      checked={agreedToTerms} 
                      onChange={(e) => setAgreedToTerms(e.target.checked)} 
                      className="mt-0.5 accent-[#FF5A00] w-4 h-4 rounded border-slate-800" 
                    />
                    <span className="text-[11px] text-slate-400 group-hover:text-slate-300 transition leading-relaxed font-medium">
                      I authorize the <span className="text-white font-bold">Bold.ng Escrow Matrix</span> to hold transaction capital liabilities securely.
                    </span>
                  </label>
                </div>
              )}

              {/* INTEGRATED BOT DEFLECTION */}
              <div className="p-4 bg-[#0B132B] border border-slate-800 rounded-2xl space-y-2.5">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">🤖 Automated Bot Deflection Challenge</label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="bg-[#16223F] px-4 py-2 rounded-xl text-xs font-black tracking-widest text-amber-400 border border-slate-800 flex items-center justify-center select-none">
                    SECURITY CALCULUS: {botChallenge.num1} + {botChallenge.num2} = ?
                  </div>
                  <input 
                    type="number" 
                    placeholder="Input Answer" 
                    value={botAnswer} 
                    onChange={(e) => setBotAnswer(e.target.value)}
                    disabled={isRobotVerified}
                    className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] rounded-xl px-3 py-2 text-xs text-white outline-none flex-1 font-bold tracking-wide text-center disabled:opacity-50"
                  />
                  {!isRobotVerified && (
                    <button 
                      type="button" 
                      onClick={verifyHumanCheck}
                      className="bg-slate-800 hover:bg-[#FF5A00] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border-none text-white cursor-pointer transition"
                    >
                      Verify
                    </button>
                  )}
                </div>
                {isRobotVerified && <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">✓ Cryptographic token integrity authorized. Cleared to execute action node.</p>}
              </div>

              {/* SUBMIT LOGISTICS CORE */}
              <button
                type="submit"
                disabled={loading || !isRobotVerified}
                className="w-full mt-2 bg-[#FF5A00] text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl border-none cursor-pointer shadow-lg hover:brightness-110 disabled:opacity-25 transition duration-200"
              >
                {loading ? 'Processing Cryptographic Sync...' : isLoginMode ? '🔓 Open Workspace' : '🚀 Initiate Deployment Route'}
              </button>

              {/* FOOTER SWITCH TRIGGERS */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setIsLoginMode(!isLoginMode); setErrorMsg(''); setSuccessMsg(''); setVerificationStep('auth'); }}
                  className="bg-transparent border-none text-[11px] text-[#FF5A00] font-bold hover:underline cursor-pointer"
                >
                  {isLoginMode ? "New to the platform? Deploy a merchant store node instead" : "Already registered? Unlock an existing secure terminal account"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}