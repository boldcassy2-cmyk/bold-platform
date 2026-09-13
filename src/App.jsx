import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { db, auth } from './firebase'; 
import { collection, onSnapshot, addDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Core UI Components
import Home from './pages/Home';
import Footer from './components/Footer';

// Dynamic Lazy Imports
const AuthPortal = lazy(() => import('./pages/AuthPortal'));
const Store = lazy(() => import('./pages/Store'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Promotions = lazy(() => import('./pages/Promotions'));
const EscrowTracker = lazy(() => import('./pages/EscrowTracker'));
const CeoDashboard = lazy(() => import('./pages/CeoDashboard'));
const EscrowDashboard = lazy(() => import('./pages/EscrowDashboard'));
const EscrowProcessor = lazy(() => import('./pages/EscrowProcessor'));
const EscrowCheckout = lazy(() => import('./pages/EscrowCheckout'));
const CartSummaryPage = lazy(() => import('./pages/CartSummaryPage'));
const ProductCatalogForm = lazy(() => import('./pages/ProductCatalogForm'));

// CEO Email Fallbacks
const CEO_EMAILS = [
  'boldcassy2@gmail.com'
];

// Default / Offline Fallback Inventory
const FALLBACK_INVENTORY = [
  { id: 'fb-1', docId: 'fb-1', category: 'electronics', title: 'iPhone 8 Plus (64GB, Space Gray - UK Used)', price: 115000, location: 'Lagos', meta: '82% Battery Health | TouchID Ok', img: '📱', promotionSettings: { adPlacement: 'trending' } },
  { id: 'fb-2', docId: 'fb-2', category: 'electronics', title: 'iPhone 11 Pro (256GB, Midnight Green)', price: 295000, location: 'Abuja', meta: 'FaceID Active | TrueTone Ok', img: '📱', promotionSettings: { adPlacement: 'broadcast' } },
  { id: 'fb-3', docId: 'fb-3', category: 'electronics', title: 'MacBook Pro M2 (16GB RAM / 512GB SSD)', price: 1850000, location: 'Lagos', meta: 'UK Used | 100% Battery', img: '💻', promotionSettings: { adPlacement: 'broadcast' } },
  { id: 'fb-4', docId: 'fb-4', category: 'electronics', title: 'iPhone 13 Pro Max (128GB, Sierra Blue)', price: 540000, location: 'Lekki', meta: 'Factory Unlocked | 91% BH', img: '📱', promotionSettings: { adPlacement: 'trending' } },
  { id: 'fb-5', docId: 'fb-5', category: 'electronics', title: 'iPhone 12 (128GB, Product RED)', price: 340000, location: 'Ikeja', meta: 'Box Included | Flawless Screen', img: '📱', promotionSettings: { adPlacement: 'sidebar' } },
  { id: 'fb-6', docId: 'fb-6', category: 'fashion', title: 'Heavyweight Boxy Hoodie (Vintage Black)', price: 28000, location: 'Lagos', meta: 'Size: L, XL | Cotton', img: '👕', promotionSettings: { adPlacement: 'trending' } },
  { id: 'fb-7', docId: 'fb-7', category: 'automotive', title: 'Toyota Camry 2018 (Foreign Used SE)', price: 14500000, location: 'Abuja', meta: '42,000 km | Automatic', img: '🚗', promotionSettings: { adPlacement: null } }
];

// Initial Transactions Seed
const INITIAL_TRANSACTIONS = [
  { id: 'TX-8831', title: 'Heavyweight Boxy Hoodie (Vintage Black) (x1)', amount: 33500, status: 'Completed', date: '2026-06-04', hub: 'Lagos Hub', type: 'Fashion' },
  { id: 'TX-9022', title: 'MacBook Pro M2 (16GB RAM / 512GB SSD) (x1)', amount: 1873500, status: 'In Escrow Vault', date: '2026-06-05', hub: 'Lagos Hub', type: 'Electronics' }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeTxPayload, setActiveTxPayload] = useState(null);
  const [globalItems, setGlobalItems] = useState([]);
  
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('bold_cart_items');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);
  const [globalTransactions, setGlobalTransactions] = useState(INITIAL_TRANSACTIONS);
  
  const [globalUsersList, setGlobalUsersList] = useState([
    { id: 'usr-1', name: 'Chukwu Store', role: 'USER', email: 'merchant@bold.ng', status: 'Active' },
    { id: 'usr-2', name: 'Abuja Admin Hub', role: 'STAFF', email: 'staff.abuja@bold.ng', status: 'Active' }
  ]);

  const [globalStaffActions, setGlobalStaffActions] = useState([
    { id: 'log-1', staff: 'Abuja Admin Hub', action: 'Approved Escrow Release #TX-8831', timestamp: '2026-06-04 14:22' }
  ]); 
  
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('bold_dev_role') || 'CEO';
  });

  const [merchantStore, setMerchantStore] = useState({
    name: 'Bold Enterprise',
    niche: 'Multi-Sector Commerce Node',
    status: 'Verified',
    location: 'Lagos, NG',
    whatsapp: '08000000000'
  });

  useEffect(() => {
    try {
      localStorage.setItem('bold_dev_role', userRole);
    } catch (e) {}
  }, [userRole]);

  useEffect(() => {
    try {
      localStorage.setItem('bold_cart_items', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Clean, single authentication state observer effect
  useEffect(() => {
    if (!auth) return;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (localStorage.getItem('bold_dev_role') === 'CEO' || localStorage.getItem('bold_dev_ceo_forced') === 'true') {
        setUserRole('CEO');
        return;
      }

      if (user) {
        if (user.email && CEO_EMAILS.includes(user.email.toLowerCase())) {
          setUserRole('CEO');
          return;
        }

        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnapshot = await getDoc(userDocRef);
          if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            setUserRole(data?.role?.toUpperCase() || 'USER');
          } else {
            setUserRole('USER');
          }
        } catch (error) {
          setUserRole('USER');
        }
      } else {
        setUserRole('USER');
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const toggleExecutiveMode = () => {
    setUserRole((prev) => {
      const nextRole = prev === 'CEO' ? 'USER' : 'CEO';
      localStorage.setItem('bold_dev_ceo_forced', nextRole === 'CEO' ? 'true' : 'false');
      return nextRole;
    });
  };

  const handleLogout = async () => {
    try {
      if (auth) await signOut(auth);
      setUserRole('USER');
      localStorage.removeItem('bold_dev_ceo_forced');
      setCurrentPage('home');
      alert('Logged out successfully.');
    } catch (error) {}
  };

  const sortInventoryPriorities = (items) => {
    const getWeight = (placement) => {
      switch (placement) {
        case 'broadcast': return 3;
        case 'trending': return 2;
        case 'sidebar': return 1;
        default: return 0;
      }
    };

    return [...items].sort((a, b) => {
      const weightA = getWeight(a?.promotionSettings?.adPlacement);
      const weightB = getWeight(b?.promotionSettings?.adPlacement);
      if (weightB !== weightA) return weightB - weightA;
      return (b?.dateAdded ? new Date(b.dateAdded).getTime() : 0) - (a?.dateAdded ? new Date(a.dateAdded).getTime() : 0);
    });
  };

  // Real-time Inventory Firestore Sync
  useEffect(() => {
    let isMounted = true;
    
    const networkTimeoutGate = setTimeout(() => {
      if (isMounted) {
        setGlobalItems(FALLBACK_INVENTORY);
        setLoading(false);
      }
    }, 2500);

    let unsubscribe = null;
    try {
      if (!db) {
        setGlobalItems(FALLBACK_INVENTORY);
        setLoading(false);
        return;
      }

      const inventoryCollection = collection(db, 'inventory');
      unsubscribe = onSnapshot(inventoryCollection, 
        (snapshot) => {
          clearTimeout(networkTimeoutGate);
          if (!isMounted) return;

          let fetchedItems = snapshot.docs.map((docItem) => ({
            docId: docItem.id,
            id: docItem.id,
            ...docItem.data()
          }));

          if (fetchedItems.length === 0) fetchedItems = FALLBACK_INVENTORY;
          setGlobalItems(sortInventoryPriorities(fetchedItems));
          setLoading(false);
        },
        (error) => {
          clearTimeout(networkTimeoutGate);
          if (isMounted) {
            setGlobalItems(FALLBACK_INVENTORY);
            setLoading(false);
          }
        }
      );
    } catch (err) {
      clearTimeout(networkTimeoutGate);
      if (isMounted) {
        setGlobalItems(FALLBACK_INVENTORY);
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
      clearTimeout(networkTimeoutGate);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleAddToCart = useCallback((product) => {
    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id || item.docId === product.docId);
      if (existingIndex > -1) {
        return prevCart.map((item, idx) => 
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const handleTriggerCheckout = useCallback((itemContext) => {
    setActiveTxPayload(itemContext ? { ...itemContext, quantity: itemContext.quantity || 1 } : null);
    setCurrentPage('escrow-checkout');
  }, []);

  const handleAddNewProduct = async (newProductPayload) => {
    const cloudPayload = {
      ...newProductPayload,
      id: `prod-${Date.now()}`,
      merchantId: currentUser?.uid || 'anonymous',
      dateAdded: new Date().toISOString(),
      promotionSettings: newProductPayload?.promotionSettings || { adPlacement: null, dailyBudget: 0, campaignDays: 0 }
    };

    try {
      if (!db) throw new Error("Firestore not initialized");
      const firestorePromise = addDoc(collection(db, 'inventory'), cloudPayload);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Sync Timeout')), 5000));
      await Promise.race([firestorePromise, timeoutPromise]);
    } catch (error) {
      setGlobalItems((prev) => sortInventoryPriorities([cloudPayload, ...prev]));
    } finally {
      setCurrentPage('marketplace');
    }
  };

  const getRelatedItems = useCallback((activeItem) => {
    if (!activeItem || !activeItem.title) return [];
    const fullTitleLower = activeItem.title.toLowerCase();
    
    let searchKeyword = '';
    if (fullTitleLower.includes('iphone')) searchKeyword = 'iphone';
    else if (fullTitleLower.includes('macbook')) searchKeyword = 'macbook';
    else if (fullTitleLower.includes('toyota')) searchKeyword = 'toyota';
    else if (fullTitleLower.includes('hoodie')) searchKeyword = 'hoodie';

    return globalItems.filter((item) => {
      if (item.id === activeItem.id || item.docId === activeItem.docId) return false;
      const targetTitleLower = item.title ? item.title.toLowerCase() : '';
      const keywordMatch = searchKeyword && targetTitleLower.includes(searchKeyword);
      const categoryMatch = item.category && activeItem.category && (item.category === activeItem.category);
      return keywordMatch || categoryMatch;
    }).slice(0, 4);
  }, [globalItems]);

  const USER_NAV = [
    { id: 'home', label: '🏠 Home' },
    { id: 'marketplace', label: '🔍 Explore Market' },
    { id: 'addproduct', label: '➕ Add Product' },
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'promotions', label: '📈 Promotions' },
    { id: 'escrow', label: '🛡️ Escrow Vault' },
  ];

  const renderDashboardByRole = () => {
    if (userRole === 'CEO') {
      return (
        <CeoDashboard 
          transactions={globalTransactions} 
          setTransactions={setGlobalTransactions} 
          items={globalItems}
          usersList={globalUsersList}
          staffLogs={globalStaffActions}
          userRole={userRole}
        />
      );
    }
    if (userRole === 'STAFF') {
      return <EscrowDashboard currentUser={currentUser} setCurrentPage={setCurrentPage} />;
    }
    return <Store merchantStore={merchantStore} items={globalItems} transactions={globalTransactions} setCurrentPage={setCurrentPage} />;
  };

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'signup':
        return <AuthPortal setCurrentPage={setCurrentPage} setMerchantStore={setMerchantStore} setUserRole={setUserRole} />;
      case 'dashboard':
      case 'store':
        return renderDashboardByRole();
      case 'promotions':
        return <Promotions uploadedItems={globalItems} />;
      case 'escrow':
        return <EscrowTracker transactions={globalTransactions} />;
      case 'escrow-dashboard':
        return userRole === 'STAFF' || userRole === 'CEO' 
          ? <EscrowDashboard currentUser={currentUser} setCurrentPage={setCurrentPage} />
          : <Home setCurrentPage={setCurrentPage} />;
      case 'ceo':
        return userRole === 'CEO' 
          ? (
              <CeoDashboard 
                transactions={globalTransactions} 
                setTransactions={setGlobalTransactions} 
                items={globalItems}
                usersList={globalUsersList}
                staffLogs={globalStaffActions}
                userRole={userRole}
              />
            )
          : <Home setCurrentPage={setCurrentPage} />;
     case 'marketplace':
        return (
          <Marketplace 
            setCurrentPage={setCurrentPage} 
            items={globalItems} 
            onTriggerCheckout={handleTriggerCheckout} 
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            onViewCart={() => setCurrentPage('cart')}
          />
        );
      case 'addproduct':
        return <ProductCatalogForm onAddProductComplete={handleAddNewProduct} setCurrentPage={setCurrentPage} />;
      case 'checkout':
      case 'processor':
      case 'escrow-checkout':
        return (
          <EscrowCheckout
            cartItems={activeTxPayload ? [activeTxPayload] : cartItems}
            onCancel={() => {
              setActiveTxPayload(null);
              setCurrentPage(activeTxPayload ? 'marketplace' : 'cart');
            }}
            onConfirmPayment={() => {
              // 1. Create a clean transaction entry for the vault
              const itemsToCheckOut = activeTxPayload ? [activeTxPayload] : cartItems;
              const orderTotal = itemsToCheckOut.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
              const firstItemTitle = itemsToCheckOut[0]?.title || 'Multi-Item Order';
              const formattedTitle = itemsToCheckOut.length > 1 
                ? `${firstItemTitle} (+${itemsToCheckOut.length - 1} more)` 
                : `${firstItemTitle} (x${itemsToCheckOut[0]?.quantity || 1})`;

              const newTransaction = {
                id: 'TX-' + Math.floor(1000 + Math.random() * 9000),
                title: formattedTitle,
                amount: orderTotal > 0 ? orderTotal : 105000,
                status: 'In Escrow Vault',
                date: new Date().toISOString().split('T')[0],
                hub: 'Lagos Hub',
                type: itemsToCheckOut[0]?.category || 'General Commerce'
              };

              // 2. Prepend to global transactions tracker state
              setGlobalTransactions((prev) => [newTransaction, ...prev]);

              // 3. Reset active payload and clear shopping cart states
              setActiveTxPayload(null);
              setCartItems([]);
              try {
                localStorage.removeItem('bold_cart_items');
                localStorage.removeItem('bold_cart');
              } catch (e) {}
              window.dispatchEvent(new Event('cartUpdated'));

              // 4. Smoothly route straight to Escrow Vault Tracker screen
              setCurrentPage('escrow');
            }}
            onNavigate={(page) => setCurrentPage(page || 'marketplace')}
          />
        );
      case 'cart':
        return (
          <CartSummaryPage 
            cartItems={cartItems} 
            setCartItems={setCartItems} 
            setCurrentPage={setCurrentPage} 
            setTransactions={setGlobalTransactions} 
            onProceedToEscrow={() => {
              setActiveTxPayload(null);
              setCurrentPage('escrow-checkout');
            }}
          />
        );
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-white antialiased font-sans pb-12 selection:bg-[#FF5A00] selection:text-white flex flex-col justify-between">
      <div>
        <header className="bg-[#16223F] py-4 px-6 sticky top-0 z-50 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-4 border-b-2 border-[#FF5A00]">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group" 
            onClick={() => setCurrentPage('home')}
          >
            <div className="w-11 h-11 bg-[#FF5A00] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,90,0,0.4)] group-hover:scale-105 transition-transform">
              <span className="text-white text-2xl font-black">B</span>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">
              BOLD<span className="text-[#FF5A00]">.NG</span>
            </span>
          </div>

          <nav className="flex flex-wrap gap-2 justify-center items-center">
            {USER_NAV.map((nav) => (
              <button
                key={nav.id}
                type="button"
                onClick={() => {
                  setActiveTxPayload(null);
                  setCurrentPage(nav.id);
                }}
                className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer transition-colors ${
                  currentPage === nav.id ? 'bg-[#FF5A00] text-white' : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                {nav.label}
              </button>
            ))}

            {/* ONLY visible to CEO: Dedicated Executive Portal Link */}
            {userRole === 'CEO' && (
              <button 
                type="button" 
                onClick={() => setCurrentPage('ceo')} 
                className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer transition-colors bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]`}
              >
                👑 CEO Portal ⚡
              </button>
            )}

            {/* ONLY visible to Staff / Admins */}
            {userRole === 'STAFF' && (
              <button 
                type="button" 
                onClick={() => setCurrentPage('escrow-dashboard')} 
                className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer transition-colors ${
                  currentPage === 'escrow-dashboard' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-blue-400 bg-blue-950/20 border border-blue-900/40 hover:bg-blue-900/40'
                }`}
              >
                ⚡ Ops Telemetry
              </button>
            )}

            <button 
              type="button" 
              onClick={() => {
                setActiveTxPayload(null);
                setCurrentPage('cart');
              }} 
              className={`text-xs font-black px-4 py-2 rounded-xl border-none cursor-pointer flex items-center gap-2 transition-colors ${
                currentPage === 'cart' ? 'bg-[#FF5A00] text-white' : 'bg-[#0B132B] hover:bg-slate-900 text-slate-200'
              }`}
            >
              🛒 Basket 
              {totalCartCount > 0 && (
                <span className="bg-[#FF5A00] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {totalCartCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <button 
                type="button" 
                onClick={handleLogout} 
                className="text-xs font-black px-3 py-2 rounded-xl border border-red-500/40 text-red-400 bg-red-950/20 hover:bg-red-900/40 cursor-pointer transition-colors"
              >
                🚪 Log Out
              </button>
            ) : (
              <button 
                type="button" 
                onClick={() => setCurrentPage('signup')} 
                className={`text-xs font-black px-3 py-2 rounded-xl border border-slate-700 text-slate-300 bg-slate-900 hover:bg-slate-800 cursor-pointer transition-colors ${
                  currentPage === 'signup' ? 'bg-[#FF5A00] text-white border-transparent' : ''
                }`}
              >
                🔑 Login / Sign Up
              </button>
            )}
          </nav>
        </header>

        {currentPage !== 'marketplace' && currentPage !== 'home' && !loading && (
          <div className="bg-[#0f1936] border-b border-slate-800 px-6 py-2 sticky top-[78px] z-40 shadow-md">
            <button 
              type="button" 
              onClick={() => {
                setActiveTxPayload(null);
                setCurrentPage('marketplace');
              }} 
              className="bg-transparent border-none text-slate-300 text-xs font-bold flex items-center gap-2 cursor-pointer hover:text-[#FF5A00] transition-colors"
            >
              ← Back to Marketplace
            </button>
          </div>
        )}

        <main className="pt-4 px-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-3">
              <div className="w-10 h-10 border-4 border-[#FF5A00] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">
                Synchronizing with Bold Cloud Core...
              </p>
            </div>
          ) : (
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <div className="w-8 h-8 border-4 border-[#FF5A00] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Loading Section...</p>
              </div>
            }>
              {renderCurrentView()}
            </Suspense>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}