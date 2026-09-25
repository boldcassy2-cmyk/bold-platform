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
  where,
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage } from '../firebase';

export default function AuthPortal() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [verifyChannel, setVerifyChannel] = useState('email');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('marketplace');

  const [products, setProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('General Goods');
  const [productDescription, setProductDescription] = useState('');
  const [productImageFile, setProductImageFile] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  // PERSISTENT SESSION LISTENER & DATA SYNC
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
        await fetchAllData(user.uid);
      } else {
        setCurrentUser(null);
        setUserData(null);
        setProducts([]);
        setMyProducts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async (uid) => {
    try {
      // 1. Fetch all items from 'inventory' sorted by dateAdded
      const qAll = query(collection(db, 'inventory'), orderBy('dateAdded', 'desc'));
      const allSnapshot = await getDocs(qAll);
      const allItems = [];
      allSnapshot.forEach((docSnap) => {
        allItems.push({ id: docSnap.id, ...docSnap.data() });
      });
      setProducts(allItems);

      // 2. Fetch user's specific items using 'merchantId'
      const qMine = query(collection(db, 'inventory'), where('merchantId', '==', uid));
      const mineSnapshot = await getDocs(qMine);
      const mineItems = [];
      mineSnapshot.forEach((docSnap) => {
        mineItems.push({ id: docSnap.id, ...docSnap.data() });
      });
      setMyProducts(mineItems);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('Please enter your legal first and last name.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
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
        setSuccessMsg('Account created! Verification link sent to your email.');
      } else {
        const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(mockOtp);
        setSuccessMsg(`[Simulation] OTP sent via ${verifyChannel.toUpperCase()}: ${mockOtp}`);
      }
      setLoading(false);
      setIsVerifying(true);
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message.replace('Firebase: ', ''));
    }
  };

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
          setSuccessMsg('Email verified successfully!');
          setIsVerifying(false);
        } else {
          setErrorMsg('Email not verified yet. Please check your inbox.');
        }
      } else {
        if (otpInput.trim() === generatedOtp) {
          await updateDoc(doc(db, 'users', auth.currentUser.uid), { verified: true });
          setUserData(prev => ({ ...prev, verified: true }));
          setSuccessMsg('Contact number verified successfully!');
          setIsVerifying(false);
        } else {
          setErrorMsg('Invalid OTP code.');
        }
      }
    } catch (err) {
      setErrorMsg('Verification failed.');
    }
    setLoading(false);
  };

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
      setErrorMsg('Invalid email or password.');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email.trim()) {
      setErrorMsg('Please enter your account email.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setLoading(false);
      setSuccessMsg('Password reset instructions sent to your email.');
    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message.replace('Firebase: ', ''));
    }
  };

  // PRODUCT MANAGEMENT & FIREBASE STORAGE UPLOAD HANDLER
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      let finalImageUrl = existingImageUrl;

      // If user picked a new file, upload it to Firebase Storage
      if (productImageFile) {
        const imageRef = ref(storage, `product_images/${currentUser.uid}_${Date.now()}_${productImageFile.name}`);
        const snapshot = await uploadBytes(imageRef, productImageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      } else if (!editingProductId && !finalImageUrl) {
        setErrorMsg('Please select a product image file.');
        setLoading(false);
        return;
      }

      if (editingProductId) {
        const productRef = doc(db, 'products', editingProductId);
        await updateDoc(productRef, {
          name: productName,
          price: Number(productPrice),
          category: productCategory,
          description: productDescription,
          image: finalImageUrl
        });
        setSuccessMsg('Product updated successfully!');
        setEditingProductId(null);
      } else {
        await addDoc(collection(db, 'products'), {
          name: productName,
          price: Number(productPrice),
          category: productCategory,
          description: productDescription,
          image: finalImageUrl,
          ownerUid: currentUser.uid,
          ownerName: `${userData?.firstName || 'Vendor'} ${userData?.lastName || ''}`,
          isPromoted: false,
          createdAt: serverTimestamp()
        });
        setSuccessMsg('Product uploaded successfully with permanent storage!');
      }

      setProductName('');
      setProductPrice('');
      setProductDescription('');
      setProductImageFile(null);
      setExistingImageUrl('');
      setLoading(false);
      await fetchAllData(currentUser.uid);
      setActiveTab('my-products');
    } catch (err) {
      setLoading(false);
      setErrorMsg('Failed to save product or upload image.');
      console.error(err);
    }
  };

  const handlePromoteProduct = async (product) => {
    const confirmPromote = window.confirm(`Promote "${product.name}" for ₦1,000 ad boost fee?`);
    if (!confirmPromote) return;

    setLoading(true);
    try {
      const productRef = doc(db, 'products', product.id);
      await updateDoc(productRef, {
        isPromoted: true,
        promotedAt: serverTimestamp()
      });
      setSuccessMsg(`🚀 Successfully promoted "${product.name}" for ₦1,000! Your listing is now boosted.`);
      await fetchAllData(currentUser.uid);
    } catch (err) {
      setErrorMsg('Promotion payment simulation failed. Please try again.');
    }
    setLoading(false);
  };

  const handleEditProduct = (item) => {
    setEditingProductId(item.id);
    setProductName(item.name);
    setProductPrice(item.price);
    setProductCategory(item.category);
    setProductDescription(item.description);
    setExistingImageUrl(item.image);
    setProductImageFile(null);
    setActiveTab('upload');
  };

  const handleDeleteProduct = async (item) => {
    if (window.confirm('Are you sure you want to delete this product? The image and listing will be permanently removed.')) {
      try {
        if (item.image && item.image.includes('firebasestorage.googleapis.com')) {
          const imageRef = ref(storage, item.image);
          await deleteObject(imageRef).catch((err) => console.log('Storage delete notice:', err));
        }

        await deleteDoc(doc(db, 'products', item.id));
        setSuccessMsg('Product and image permanently deleted.');
        await fetchAllData(currentUser.uid);
      } catch (err) {
        setErrorMsg('Failed to delete product.');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // DASHBOARD VIEW
  if (currentUser) {
    return (
      <div className="min-h-screen bg-[#070D1F] text-white p-6 font-sans">
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
              📦 My Uploaded Products ({myProducts.length})
            </button>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 bg-red-950/80 border border-red-500/40 hover:bg-red-900 text-red-300 rounded-xl text-xs font-bold transition cursor-pointer ml-2"
            >
              Log Out 🚪
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mb-4">
          {errorMsg && <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-400 text-xs font-mono">⚠️ {errorMsg}</div>}
          {successMsg && <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-400 text-xs font-mono">✅ {successMsg}</div>}
        </div>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'marketplace' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black tracking-tight uppercase">Bold.ng Global Marketplace</h3>
                <span className="text-xs text-slate-400 font-mono">Showing promoted & community listings</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.length === 0 ? (
                  <p className="text-xs text-slate-400 font-mono py-8">No products found in marketplace.</p>
                ) : (
                  products.map((item) => (
                    <div key={item.id} className={`bg-[#16223F] border ${item.isPromoted ? 'border-[#FF5A00]' : 'border-slate-700'} rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between relative`}>
                      {item.isPromoted && (
                        <div className="absolute top-2 right-2 bg-[#FF5A00] text-white text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full shadow">
                          🔥 PROMOTED AD
                        </div>
                      )}
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
                          <span className="text-[10px] text-slate-500 font-mono">By: {item.ownerName || 'Vendor'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'my-products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black tracking-tight uppercase">My Inventory & Dashboard Management</h3>
                <button 
                  onClick={() => { 
                    setEditingProductId(null); 
                    setProductName(''); 
                    setProductPrice(''); 
                    setProductCategory('General Goods');
                    setProductDescription(''); 
                    setProductImageFile(null);
                    setExistingImageUrl(''); 
                    setActiveTab('upload'); 
                  }} 
                  className="bg-[#FF5A00] hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-lg"
                >
                  ➕ Upload New Product
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {myProducts.length === 0 ? (
                  <p className="text-xs text-slate-400 font-mono py-8">You haven't uploaded any products yet. Click 'Upload New Product' above.</p>
                ) : (
                  myProducts.map((item) => (
                    <div key={item.id} className={`bg-[#16223F] border ${item.isPromoted ? 'border-[#FF5A00]' : 'border-slate-700'} rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between relative`}>
                      {item.isPromoted && (
                        <div className="absolute top-2 right-2 bg-[#FF5A00] text-white text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full shadow">
                          🔥 ACTIVE PROMOTION
                        </div>
                      )}
                      <img src={item.image} alt={item.name} className="w-full h-48 object-cover bg-slate-800" />
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm">{item.name}</h4>
                          <span className="text-sm font-mono font-bold text-[#FF5A00]">₦{item.price?.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-400">{item.description}</p>
                      </div>
                      
                      <div className="p-4 pt-0 space-y-2">
                        {!item.isPromoted ? (
                          <button 
                            onClick={() => handlePromoteProduct(item)}
                            className="w-full bg-[#FF5A00] hover:bg-orange-600 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-md shadow-orange-600/20 flex items-center justify-center gap-1.5"
                          >
                            🚀 Promote Product (₦1,000)
                          </button>
                        ) : (
                          <div className="w-full bg-orange-950/50 border border-[#FF5A00]/40 text-[#FF5A00] py-2 rounded-xl text-center text-xs font-mono font-bold">
                            Ad Boost Active ✅
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditProduct(item)} 
                            className="flex-1 bg-slate-800 hover:bg-slate-700 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            Edit ✏️
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(item)} 
                            className="flex-1 bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            Delete 🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

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
                    placeholder="Enter product name"
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
                      placeholder="0.00"
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
                  <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Product Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProductImageFile(e.target.files[0])}
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#FF5A00] file:text-white"
                  />
                  {existingImageUrl && !productImageFile && (
                    <p className="text-[10px] text-slate-400 font-mono mt-1">Current image will be kept if no new file is chosen.</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Enter product description and details..."
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

  // AUTH GATEWAY (SIGNIN / SIGNUP)
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
            {isVerifying ? `Enter verification details for (${verifyChannel.toUpperCase()})` : isForgotPassword ? 'Recover your account access safely' : isSignup ? 'Register your profile on bold.ng' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {errorMsg && <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-400 text-xs font-mono">⚠️ {errorMsg}</div>}
        {successMsg && <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-400 text-xs font-mono">✅ {successMsg}</div>}

        {isVerifying ? (
          <form onSubmit={handleVerifySubmission} className="space-y-4">
            <div className="p-4 bg-[#0B132B] border border-slate-700 rounded-2xl space-y-3">
              <p className="text-xs text-slate-300">
                {verifyChannel === 'email' ? `Verification link sent to ${email}. Click the email link, then confirm below.` : `Enter OTP code sent via ${verifyChannel.toUpperCase()}:`}
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
              className="w-full bg-[#FF5A00] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              {loading ? 'Verifying...' : 'Confirm & Complete'}
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
              className="w-full bg-[#FF5A00] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              {loading ? 'Sending...' : 'Send Password Reset Link'}
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
                  <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Contact Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+234..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none"
                  />
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
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer font-mono"
                >
                  {showPassword ? 'hide' : 'show'}
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
                    className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:border-[#FF5A00] outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer font-mono"
                  >
                    {showConfirmPassword ? 'hide' : 'show'}
                  </button>
                </div>
              </div>
            )}

            {!isSignup && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(true); setErrorMsg(''); setSuccessMsg(''); }}
                  className="text-[11px] text-slate-400 hover:text-[#FF5A00] cursor-pointer font-mono"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF5A00] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-lg cursor-pointer mt-2"
            >
              {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Sign In'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => { setIsSignup(!isSignup); setErrorMsg(''); setSuccessMsg(''); }}
                className="text-xs text-slate-400 hover:text-white cursor-pointer font-mono"
              >
                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}