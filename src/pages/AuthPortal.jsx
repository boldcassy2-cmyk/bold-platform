import React, { useState, useCallback } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

const parseAuthError = (errorCode, defaultMsg) => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email address or password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    default:
      return defaultMsg || 'An error occurred during authentication. Please try again.';
  }
};

export default function AuthPortal({ setCurrentPage, setMerchantStore }) {
  // Navigation & View Mode
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [accountType, setAccountType] = useState('seller'); // 'seller' | 'shopper'

  // Credentials & Merchant Profiles
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [niche, setNiche] = useState("Men's Streetwear & Apparel");
  const [location, setLocation] = useState('Lagos, NG');
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Status Signals
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const clearMessages = useCallback(() => {
    setErrorMsg('');
    setSuccessMsg('');
  }, []);

  const handleToggleMode = (loginModeState) => {
    setIsLoginMode(loginModeState);
    setShowForgotPassword(false);
    setAwaitingVerification(false);
    clearMessages();
  };

  // Google SSO Handler
  const handleGoogleSignIn = async () => {
    clearMessages();
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      setMerchantStore({
        name: storeName.trim() || `${result.user.displayName || 'Merchant'}'s Store`,
        niche: niche,
        status: 'Active Store',
        location: location,
        phone: result.user.phoneNumber || phone || 'N/A'
      });
      setCurrentPage('store');
    } catch (err) {
      setErrorMsg(parseAuthError(err.code, err.message));
    } finally {
      setLoading(false);
    }
  };

  // Password Recovery Reset Link
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    clearMessages();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMsg('Password reset instructions have been sent to your email.');
    } catch (err) {
      setErrorMsg(parseAuthError(err.code, err.message));
    } finally {
      setLoading(false);
    }
  };

  // Primary Login / Registration Handler
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    const cleanEmail = email.trim();

    try {
      if (isLoginMode) {
        // --- SIGN IN FLOW ---
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);

        if (!userCredential.user.emailVerified) {
          setErrorMsg('Your email is not verified yet. We have directed you to the verification screen.');
          setAwaitingVerification(true);
          setLoading(false);
          return;
        }

        setMerchantStore({
          name: `${cleanEmail.split('@')[0]} Store`,
          niche: 'Multi-Category Merchant',
          status: 'Verified Account',
          location: 'Lagos, NG',
          phone: phone || '2348000000000'
        });

        setCurrentPage('store');
      } else {
        // --- SIGN UP FLOW ---
        if (accountType === 'seller' && (!storeName.trim() || !phone.trim())) {
          setErrorMsg('Please complete all required merchant fields.');
          setLoading(false);
          return;
        }

        if (!agreedToTerms) {
          setErrorMsg('You must accept the Terms of Service to proceed.');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        await sendEmailVerification(userCredential.user);
        setAwaitingVerification(true);
      }
    } catch (err) {
      if (!isLoginMode && err.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Switching you to Sign In mode...');
        setTimeout(() => {
          setIsLoginMode(true);
          clearMessages();
        }, 2000);
      } else {
        setErrorMsg(parseAuthError(err.code, err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend Verification Email Link
  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      setErrorMsg('Session expired or no active registration found. Please try signing up or signing in again.');
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      await sendEmailVerification(auth.currentUser);
      setSuccessMsg('A new verification email has been sent! Check your inbox and spam folder.');
    } catch (err) {
      setErrorMsg(parseAuthError(err.code, err.message));
    } finally {
      setLoading(false);
    }
  };

  // Verify Inbox Confirmation Status
  const handleCheckEmailStatus = async () => {
    setLoading(true);
    clearMessages();

    try {
      if (!auth.currentUser) {
        setErrorMsg('Session expired. Please sign in again.');
        setAwaitingVerification(false);
        return;
      }

      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '234' + cleanPhone.substring(1);

        setMerchantStore({
          name: storeName.trim() || `${fullName}'s Store`,
          niche,
          status: 'Verified Business',
          location,
          phone: cleanPhone || '2348000000000'
        });

        setCurrentPage('store');
      } else {
        setErrorMsg('Email verification is not complete yet. Please check your inbox and click the verification link.');
      }
    } catch (err) {
      setErrorMsg('Unable to verify email status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B132B] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-white">
      {/* BRANDING HEADER */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          bold<span className="text-[#FF5A00]">.ng</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400 font-medium">
          {isLoginMode 
            ? 'Sign in to access your business portal' 
            : 'Create your merchant account and start selling'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
          
          {/* NOTIFICATION MESSAGES */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-800/80 text-red-300 rounded-xl text-sm font-semibold flex items-center gap-3">
              <span>⚠️</span>
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 rounded-xl text-sm font-semibold flex items-center gap-3">
              <span>✅</span>
              <div>{successMsg}</div>
            </div>
          )}

          {/* VIEW 1: FORGOT PASSWORD */}
          {showForgotPassword ? (
            <form onSubmit={handlePasswordReset} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold">Reset Password</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your registered account email and we'll send you a password reset link.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Account Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#FF5A00] rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-sm tracking-wide py-3.5 rounded-xl cursor-pointer transition disabled:opacity-50"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(false); clearMessages(); }}
                  className="text-xs text-slate-400 hover:text-white font-semibold cursor-pointer bg-transparent border-none"
                >
                  ← Back to Sign In
                </button>
              </div>
            </form>

          /* VIEW 2: EMAIL VERIFICATION CHECKPOINT */
          ) : awaitingVerification ? (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 bg-[#FF5A00]/10 text-[#FF5A00] text-3xl flex items-center justify-center rounded-full mx-auto">
                ✉️
              </div>
              
              <div>
                <h2 className="text-xl font-bold">Verify Your Email Address</h2>
                <p className="text-sm text-slate-300 mt-2">
                  We sent a verification link to <span className="text-white font-semibold">{email}</span>.
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Click the link inside the email to activate your account, then click the button below to continue.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  type="button"
                  onClick={handleCheckEmailStatus}
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide py-3.5 rounded-xl cursor-pointer transition disabled:opacity-50"
                >
                  {loading ? 'Checking status...' : 'I Have Verified My Email'}
                </button>

                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs py-3 rounded-xl border border-slate-700 cursor-pointer transition disabled:opacity-50"
                >
                  Didn't get the email? Resend Verification Link
                </button>

                <button
                  type="button"
                  onClick={() => setAwaitingVerification(false)}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer bg-transparent border-none block mx-auto pt-2"
                >
                  Edit registration information
                </button>
              </div>
            </div>

          /* VIEW 3: MAIN AUTHENTICATION FORM */
          ) : (
            <div className="space-y-6">
              
              {/* ACCOUNT TYPE SELECTOR (FOR REGISTRATION) */}
              {!isLoginMode && (
                <div className="grid grid-cols-2 gap-3 p-1 bg-[#0B132B] rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setAccountType('seller')}
                    className={`py-2.5 text-xs font-bold rounded-lg transition ${
                      accountType === 'seller'
                        ? 'bg-[#FF5A00] text-white'
                        : 'text-slate-400 hover:text-white bg-transparent border-none'
                    }`}
                  >
                    🏪 Business / Seller
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('shopper')}
                    className={`py-2.5 text-xs font-bold rounded-lg transition ${
                      accountType === 'shopper'
                        ? 'bg-[#FF5A00] text-white'
                        : 'text-slate-400 hover:text-white bg-transparent border-none'
                    }`}
                  >
                    🛍️ Customer / Buyer
                  </button>
                </div>
              )}

              {/* QUICK SOCIAL SIGN-IN */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm py-3 rounded-xl border border-slate-700 flex items-center justify-center gap-3 cursor-pointer transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#16223F] px-3 text-slate-500 font-bold">Or continue with email</span>
                  </div>
                </div>
              </div>

              {/* PRIMARY FORM INPUTS */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {!isLoginMode && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#FF5A00] rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@business.com"
                    className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#FF5A00] rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Password
                    </label>
                    {isLoginMode && (
                      <button
                        type="button"
                        onClick={() => { setShowForgotPassword(true); clearMessages(); }}
                        className="text-xs text-[#FF5A00] hover:underline font-semibold bg-transparent border-none cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#FF5A00] rounded-xl pl-4 pr-12 py-3 text-sm text-white outline-none transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white bg-transparent border-none cursor-pointer text-sm"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                {/* MERCHANT SPECIFIC FIELDS */}
                {!isLoginMode && accountType === 'seller' && (
                  <div className="space-y-4 pt-2 border-t border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Store / Brand Name
                      </label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="e.g., Bold Urban Apparel"
                        className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#FF5A00] rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Primary Category
                        </label>
                        <select
                          value={niche}
                          onChange={(e) => setNiche(e.target.value)}
                          className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#FF5A00] rounded-xl px-3 py-3 text-sm text-white outline-none transition cursor-pointer"
                        >
                          <option value="Men's Streetwear & Apparel">👕 Men's Apparel & Streetwear</option>
                          <option value="Consumer Electronics">💻 Consumer Electronics</option>
                          <option value="Automotive & Spare Parts">🚗 Automotive & Accessories</option>
                          <option value="Beauty & Personal Care">💄 Beauty & Personal Care</option>
                          <option value="Services & Mentorship">📚 Mentorship & Professional Services</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Location / Base
                        </label>
                        <select
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#FF5A00] rounded-xl px-3 py-3 text-sm text-white outline-none transition cursor-pointer"
                        >
                          <option value="Lagos, NG">Lagos, Nigeria</option>
                          <option value="Abuja, NG">Abuja, Nigeria</option>
                          <option value="Port Harcourt, NG">Port Harcourt, Nigeria</option>
                          <option value="Other / Remote">Other Location</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Phone Number (WhatsApp Direct)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08012345678"
                        className="w-full bg-[#0B132B] border border-slate-700 focus:border-[#FF5A00] rounded-xl px-4 py-3 text-sm text-white outline-none transition"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* TERMS CHECKBOX FOR SIGNUP */}
                {!isLoginMode && (
                  <label className="flex items-start gap-3 pt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 accent-[#FF5A00] w-4 h-4 rounded border-slate-700"
                    />
                    <span className="text-xs text-slate-400 leading-relaxed">
                      I agree to the <a href="#terms" className="text-white underline">Terms of Service</a> and <a href="#privacy" className="text-white underline">Privacy Policy</a>.
                    </span>
                  </label>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-[#FF5A00] hover:bg-[#e04f00] text-white font-bold text-sm tracking-wide py-3.5 rounded-xl cursor-pointer shadow-lg transition disabled:opacity-50"
                >
                  {loading 
                    ? 'Processing...' 
                    : isLoginMode 
                      ? 'Sign In' 
                      : accountType === 'seller' ? 'Create Business Account' : 'Create Customer Account'}
                </button>

                {/* TOGGLE LOGIN / REGISTER */}
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => handleToggleMode(!isLoginMode)}
                    className="text-xs text-slate-400 hover:text-white font-semibold cursor-pointer bg-transparent border-none"
                  >
                    {isLoginMode ? (
                      <>Don't have an account? <span className="text-[#FF5A00] underline">Register now</span></>
                    ) : (
                      <>Already have an account? <span className="text-[#FF5A00] underline">Sign in</span></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}