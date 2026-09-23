import React, { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification, 
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { auth, db } from '../firebase'; // Update path to your firebase initialization file

export default function AuthPortal() {
  // Auth & Session States
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Signup Channel Choice: 'email' | 'whatsapp' | 'sms'
  const [verifyChannel, setVerifyChannel] = useState('email');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Feedback Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Dashboard Navigation: 'marketplace' | 'my-products' | 'upload'
  const [activeTab, setActiveTab] = useState('marketplace');

  // Product Form Fields
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('General Goods');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);

  // 1. PERSISTENT SESSION LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
        fetchMarketplaceProducts();
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch all products from Firestore Marketplace
  const fetchMarketplaceProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      setProducts(items);
    } catch (err) {
      console.error('Error fetching marketplace products:', err);
    }
  };

  // 2. HANDLE SIGNUP SUBMISSION
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('Please enter your legal first and last name.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please check and try again.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`
      });

      const initialUserData = {
        uid: user.uid,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: email.trim() === 'admin@bold.ng' ? 'ADMIN' : 'CUSTOMER',
        createdAt: serverTimestamp(),
        verified: false,
        verifyChannel
      };

      await setDoc(doc(db, 'users', user.uid), initialUserData);
      setUserData(initialUserData);

      if (verifyChannel === 'email') {
        await sendEmailVerification(user);
        setSuccessMsg('Account created! Verification link dispatched to your email inbox.');
      } else {
        const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(mockOtp);
        setSuccessMsg(`[Simulation] OTP code sent via ${verifyChannel.toUpperCase()} to ${phone}: ${mockOtp}`);
      }

      setLoading(false);
      setIsVerifying(true);

    } catch (error) {
      setLoading(false);
      let message = error.message.replace('Firebase: ', '');
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email address is already registered. Please sign in instead.';
      }
      setErrorMsg(message);
    }
  };

  // 3. VERIFY OTP OR EMAIL STATUS
  const handleVerifySubmission = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (verifyChannel === 'email') {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), { verified: true });
          setUserData(prev => ({ ...prev, verified: true }));
          setSuccessMsg('Email verified successfully! Welcome to Bold.ng.');
          setIsVerifying(false);
        } else {
          setErrorMsg('Email not verified yet. Please click the link sent to your inbox.');
        }
      } else {
        if (otpInput.trim() === generatedOtp) {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), { verified: true });
          setUserData(prev => ({ ...prev, verified: true }));
          setSuccessMsg('Contact number verified successfully! Welcome.');
          setIsVerifying(false);
        } else {
          setErrorMsg('Invalid OTP code entered. Please check and try again.');
        }
      }
    } catch (err) {
      setErrorMsg('Verification check failed. Please retry.');
    }
    setLoading(false);
  };

  // 4. HANDLE LOGIN SUBMISSION
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
      setLoading(false);
      setSuccessMsg('Login successful!');
    } catch (error) {
      setLoading(false);
      let message = error.message.replace('Firebase: ', '');
      if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found'].includes(error.code)) {
        message = 'Invalid email or password. Please check your credentials.';
      }
      setErrorMsg(message);
    }
  };

  // 5. HANDLE PASSWORD RESET
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email.trim()) {
      setErrorMsg('Please enter your account email address first.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setLoading(false);
      setSuccessMsg('Password reset instructions have been dispatched to your email.');
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message.replace('Firebase: ', ''));
    }
  };

  // 6. PRODUCT MANAGEMENT
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!productName || !productPrice) {
      setErrorMsg('Please provide product name and price.');
      return;
    }

    setLoading(true);
    try {
      if (editingProductId) {
        const productRef = doc(db, 'products', editingProductId);
        await updateDoc(productRef, {
          name: productName,
          price: Number(productPrice),
          category: productCategory,
          description: productDescription,
          image: productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
        });
        setSuccessMsg('Product updated successfully!');
        setEditingProductId(null);
      } else {
        await addDoc(collection(db, 'products'), {
          name: productName,
          price: Number(productPrice),
          category: productCategory,
          description: productDescription,
          image: productImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
          ownerUid: currentUser.uid,
          ownerName: `${userData?.firstName} ${userData?.lastName}`,
          createdAt: serverTimestamp()
        });
        setSuccessMsg('Product uploaded successfully to marketplace!');
      }

      setProductName('');
      setProductPrice('');
      setProductDescription('');
      setProductImage('');
      setLoading(false);
      fetchMarketplaceProducts();
      setActiveTab('my-products');
    } catch (err) {
      setLoading(false);
      setErrorMsg('Failed to save product. Please try again.');
    }
  };

  const handleEditProduct = (item) => {
    setEditingProductId(item.id);
    setProductName(item.name);
    setProductPrice(item.price);
    setProductCategory(item.category);
    setProductDescription(item.description);
    setProductImage(item.image);
    setActiveTab('upload');
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setSuccessMsg('Product deleted successfully.');
        fetchMarketplaceProducts();
      } catch (err) {
        setErrorMsg('Failed to delete product.');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserData(null);
  };

  // =========================================================
  // RENDER: DASHBOARD VIEW
  // =========================================================
  if (currentUser) {
    return (
      <div className="min-h-screen bg-[#070D1F] text-white p-6 font-sans">
        {/* Top Header Navbar */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center bg-[#16223F] border border-slate-700 p-4 rounded-2xl mb-6 shadow-xl gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF5A00] rounded-xl flex items-center font-black text-lg justify-center">B</div>
            <div>
              <h2 className="font-bold text-sm">Welcome, {userData?.firstName || 'User'} {userData?.lastName || ''}</h2>
              <p className="text-[10px] text-slate-400 font-mono">Role: {userData?.role} | Status: {userData?.verified ? '✅ Verified' : '⚠️ Pending'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={() => setActiveTab('marketplace')} 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'marketplace' ? 'bg-[#FF5A00] text-white' : 'bg-[#0B132B] text-slate-300 hover:bg-slate-800'}`}
            >
              🛒 Public Marketplace
            </button>
            <button 
              onClick={() => setActiveTab('my-products')} 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === 'my-products' ? 'bg-[#FF5A00] text-white' : 'bg-[#0B132B] text-slate-300 hover:bg-slate-800'}`}
            >
              📦 My Uploaded Products
            </button>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 bg-red-950/80 border border-red-500/40 hover:bg-red-900 text-red-300 rounded-xl text-xs font-bold transition cursor-pointer ml-2"
            >
              Log Out 🚪
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        <div className="max-w-6xl mx-auto mb-4">
          {errorMsg && <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-400 text-xs font-mono">⚠️ {errorMsg}</div>}
          {successMsg && <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-400 text-xs font-mono">✅ {successMsg}</div>}
        </div>

        {/* MAIN CONTAINER CONTENT SWITCHER */}
        <div className="max-w-6xl mx-auto">

          {/* TAB 1: PUBLIC MARKETPLACE */}
          {activeTab === 'marketplace' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black tracking-tight uppercase">Bold.ng Global Marketplace</h3>
                <span className="text-xs text-slate-400 font-mono">Showing all community uploads</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.length === 0 ? (
                  <p className="text-xs text-slate-400 font-mono py-8">No products listed in the marketplace yet. Be the first to upload!</p>
                ) : (
                  products.map((item) => (
                    <div key={item.id} className="bg-[#16223F] border border-slate-700 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                      <img src={item.image} alt={item.name} className="w-full h-48 object-cover bg-slate-800" />
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm">{item.name}</h4>
                            <span className="text-[10px] bg-[#FF5A00]/20 text-[#FF5A00] font-mono px-2 py-0.5 rounded-full">{item.category}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description || 'No description provided.'}</p>
                        </div>
                        <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                          <span className="text-sm font-mono font-bold text-[#FF5A00]">₦{item.price?.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500 font-mono">By: {item.ownerName || 'Verified Vendor'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY UPLOADED PRODUCTS */}
          {activeTab === 'my-products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black tracking-tight uppercase">My Inventory & Uploaded Products</h3>
                <button 
                  onClick={() => { 
                    setEditingProductId(null); 
                    setProductName(''); 
                    setProductPrice(''); 
                    setProductCategory('General Goods');
                    setProductDescription(''); 
                    setProductImage(''); 
                    setActiveTab('upload'); 
                  }} 
                  className="bg-[#FF5A00] hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-lg"
                >
                  ➕ Upload New Product
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.filter(p => p.ownerUid === currentUser.uid).length === 0 ? (
                  <p className="text-xs text-slate-400 font-mono py-8">You have not uploaded any products yet. Click 'Upload New Product' above.</p>
                ) : (
                  products.filter(p => p.ownerUid === currentUser.uid).map((item) => (
                    <div key={item.id} className="bg-[#16223F] border border-slate-700 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between">
                      <img src={item.image} alt={item.name} className="w-full h-48 object-cover bg-slate-800" />
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm">{item.name}</h4>
                          <span className="text-sm font-mono font-bold text-[#FF5A00]">₦{item.price?.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-400">{item.description}</p>
                      </div>
                      <div className="p-4 pt-0 flex gap-2">
                        <button 
                          onClick={() => handleEditProduct(item)} 
                          className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Edit ✏️
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(item.id)} 
                          className="flex-1 bg-red-600 hover:bg-red-500 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Delete 🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: UPLOAD / EDIT PRODUCT FORM */}
          {activeTab === 'upload' && (
            <div className="max-w-xl mx-auto bg-[#16223F] border border-slate-700 rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black tracking-tight uppercase">{editingProductId ? 'Edit Product' : 'Upload New Product'}</h3>
                <button 
                  onClick={() => setActiveTab('my-products')}
                  className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
                >
                  ← Back to My Products
                </button>
              </div>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Premium Wireless Earbuds"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Price (₦)</label>
                    <input
                      type="number"
                      placeholder="25000"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      required
                      className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Category</label>
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none cursor-pointer"
                    >
                      <option value="General Goods">General Goods</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion & Wear">Fashion & Wear</option>
                      <option value="Industrial & Building">Industrial & Building</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Describe your product condition, delivery terms..."
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FF5A00] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-orange-600/25 cursor-pointer mt-2"
                >
                  {loading ? 'Saving...' : editingProductId ? 'Update Product Listing' : 'Publish Product to Marketplace'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    );
  }

  // =========================================================
  // RENDER: AUTHENTICATION & VERIFICATION PORTAL GATEWAY
  // =========================================================
  return (
    <div className="relative min-h-screen bg-[#070D1F] flex items-center justify-center p-4 font-sans text-white overflow-hidden">
      <div className="relative z-10 w-full max-w-md bg-[#16223F]/95 backdrop-blur-md border border-slate-700/80 rounded-3xl p-8 shadow-2xl space-y-6">

        <div className="text-center space-y-1">
          <div className="inline-block px-3 py-1 bg-[#FF5A00]/10 text-[#FF5A00] font-mono text-[10px] font-black uppercase tracking-widest rounded-full border border-[#FF5A00]/20 mb-2">
            Secure Auth Gateway
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">
            {isVerifying ? 'Channel Verification' : isForgotPassword ? 'Reset Password' : isSignup ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-slate-400">
            {isVerifying 
              ? `Enter verification details for your chosen channel (${verifyChannel.toUpperCase()})` 
              : isForgotPassword 
              ? 'Recover your account access safely' 
              : isSignup 
              ? 'Register your profile on bold.ng' 
              : 'Sign in to access your dashboard'}
          </p>
        </div>

        {errorMsg && <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-400 text-xs font-mono">⚠️ {errorMsg}</div>}
        {successMsg && <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-400 text-xs font-mono">✅ {successMsg}</div>}

        {isVerifying ? (
          <form onSubmit={handleVerifySubmission} className="space-y-4">
            <div className="p-4 bg-[#0B132B] border border-slate-700 rounded-2xl space-y-3">
              <p className="text-xs text-slate-300">
                {verifyChannel === 'email' 
                  ? `We sent an automated verification link to ${email}. Please click the link inside your email, then click the button below.`
                  : `Enter the 6-digit OTP code sent via ${verifyChannel.toUpperCase()} to ${phone}:`}
              </p>
              {verifyChannel !== 'email' && (
                <input
                  type="text"
                  placeholder="123456"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  maxLength={6}
                  required
                  className="w-full bg-[#16223F] border border-slate-700 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white font-mono focus:border-[#FF5A00] outline-none"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF5A00] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-orange-600/20 cursor-pointer"
            >
              {loading ? 'Verifying...' : 'Confirm & Complete Verification'}
            </button>
          </form>
        ) : isForgotPassword ? (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Account Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF5A00] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-orange-600/20 cursor-pointer"
            >
              {loading ? 'Sending Instructions...' : 'Send Password Reset Link'}
            </button>
            <button
              type="button"
              onClick={() => { setIsForgotPassword(false); setErrorMsg(''); setSuccessMsg(''); }}
              className="w-full text-center text-xs text-slate-400 hover:text-white pt-2 cursor-pointer font-mono"
            >
              ← Back to Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={isSignup ? handleSignupSubmit : handleLoginSubmit} className="space-y-4">

            {isSignup && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 font-mono">First Name</label>
                    <input
                      type="text"
                      placeholder="Chukwuebuka"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-3 text-xs text-white focus:border-[#FF5A00] outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Last Name</label>
                    <input
                      type="text"
                      placeholder="Ebigbo"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-3 text-xs text-white focus:border-[#FF5A00] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Contact Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Verification Method</label>
                  <select
                    value={verifyChannel}
                    onChange={(e) => setVerifyChannel(e.target.value)}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none cursor-pointer font-mono"
                  >
                    <option value="email">Email Link Verification</option>
                    <option value="whatsapp">WhatsApp OTP Code (Simulated)</option>
                    <option value="sms">SMS Contact Number OTP (Simulated)</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none pr-14"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 hover:text-white cursor-pointer px-2 py-1"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {isSignup && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 hover:text-white cursor-pointer px-2 py-1"
                  >
                    {showConfirmPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>
            )}

            {!isSignup && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(true); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-[11px] text-slate-400 hover:text-[#FF5A00] font-mono cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF5A00] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-orange-600/20 cursor-pointer mt-2"
            >
              {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => { setIsSignup(!isSignup); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-xs text-slate-400 hover:text-white cursor-pointer font-mono"
              >
                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}