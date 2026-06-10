import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, onSnapshot, addDoc } from 'firebase/firestore';

// 🔐 Swapped the old SignUp component for our secure AuthPortal Core engine
import AuthPortal from './pages/AuthPortal';
import Store from './pages/Store';
import Marketplace from './pages/Marketplace';
import Promotions from './pages/Promotions';
import EscrowTracker from './pages/EscrowTracker';
import CeoDashboard from './pages/CeoDashboard';
import ProductCatalogForm from './pages/ProductCatalogForm';
import EscrowProcessor from './pages/EscrowProcessor';
import CartSummaryPage from './pages/CartSummaryPage';
import Footer from './components/Footer'; // Use './Footer' if it's directly in the src folder

export default function App() {
  const [currentPage, setCurrentPage] = useState('marketplace');
  const [activeTxPayload, setActiveTxPayload] = useState(null);
  const [globalItems, setGlobalItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackInventory = [
    { id: 1, docId: 'fb-1', category: 'electronics', title: 'iPhone 8 Plus (64GB, Space Gray - UK Used)', price: 115000, location: 'Lagos', meta: '82% Battery Health | TouchID Ok', img: '📱', promotionSettings: { adPlacement: 'trending' } },
    { id: 2, docId: 'fb-2', category: 'electronics', title: 'iPhone 11 Pro (256GB, Midnight Green)', price: 295000, location: 'Abuja', meta: 'FaceID Active | TrueTone Ok', img: '📱', promotionSettings: { adPlacement: 'broadcast' } },
    { id: 3, docId: 'fb-3', category: 'electronics', title: 'MacBook Pro M2 (16GB RAM / 512GB SSD)', price: 1850000, location: 'Lagos', meta: 'UK Used | 100% Battery', img: '💻', promotionSettings: { adPlacement: 'broadcast' } },
    { id: 4, docId: 'fb-4', category: 'electronics', title: 'iPhone 13 Pro Max (128GB, Sierra Blue)', price: 540000, location: 'Lekki', meta: 'Factory Unlocked | 91% BH', img: '📱', promotionSettings: { adPlacement: 'trending' } },
    { id: 5, docId: 'fb-5', category: 'electronics', title: 'iPhone 12 (128GB, Product RED)', price: 340000, location: 'Ikeja', meta: 'Box Included | Flawless Screen', img: '📱', promotionSettings: { adPlacement: 'sidebar' } },
    { id: 6, docId: 'fb-6', category: 'fashion', title: 'Heavyweight Boxy Hoodie (Vintage Black)', price: 28000, location: 'Lagos', meta: 'Size: L, XL | Cotton', img: '👕', promotionSettings: { adPlacement: 'trending' } },
    { id: 7, docId: 'fb-7', category: 'automotive', title: 'Toyota Camry 2018 (Foreign Used SE)', price: 14500000, location: 'Abuja', meta: '42,000 km | Automatic', img: '🚗', promotionSettings: { adPlacement: null } }
  ];

  const [globalTransactions, setGlobalTransactions] = useState([
    { id: 'TX-8831', title: 'Heavyweight Boxy Hoodie (Vintage Black) (x1)', amount: 33500, status: 'Completed', date: '2026-06-04', hub: 'Lagos Hub', type: 'Fashion' },
    { id: 'TX-9022', title: 'MacBook Pro M2 (16GB RAM / 512GB SSD) (x1)', amount: 1873500, status: 'In Escrow Vault', date: '2026-06-05', hub: 'Lagos Hub', type: 'Electronics' }
  ]); 

  const [merchantStore, setMerchantStore] = useState({
    name: 'Bold Enterprise',
    niche: 'Multi-Sector Commerce Node',
    status: 'Verified',
    location: 'Lagos, NG',
    whatsapp: '08000000000'
  });

  useEffect(() => {
    let unsubscribeItems = () => {};
    const networkTimeoutGate = setTimeout(() => {
      if (loading) {
        setGlobalItems(fallbackInventory);
        textLabelResolve();
      }
    }, 2500);

    const textLabelResolve = () => { setLoading(false); };

    try {
      const inventoryCollection = collection(db, "inventory");
      unsubscribeItems = onSnapshot(inventoryCollection, (snapshot) => {
        clearTimeout(networkTimeoutGate);
        let itemsFromCloud = snapshot.docs.map(doc => ({
          docId: doc.id, id: doc.id, ...doc.data()
        }));
        if (itemsFromCloud.length === 0) itemsFromCloud = fallbackInventory;

        const sortedPriorities = itemsFromCloud.sort((a, b) => {
          const getWeight = (p) => p === 'broadcast' ? 3 : p === 'trending' ? 2 : p === 'sidebar' ? 1 : 0;
          const weightA = getWeight(a?.promotionSettings?.adPlacement);
          const weightB = getWeight(b?.promotionSettings?.adPlacement);
          if (weightB !== weightA) return weightB - weightA;
          return (b?.dateAdded ? new Date(b.dateAdded).getTime() : 0) - (a?.dateAdded ? new Date(a.dateAdded).getTime() : 0);
        });

        setGlobalItems(sortedPriorities);
        textLabelResolve();
      }, (error) => {
        clearTimeout(networkTimeoutGate);
        setGlobalItems(fallbackInventory);
        textLabelResolve();
      });
    } catch (err) {
      clearTimeout(networkTimeoutGate);
      setGlobalItems(fallbackInventory);
      textLabelResolve();
    }
    return () => { unsubscribeItems(); clearTimeout(networkTimeoutGate); };
  }, []);

  const handleAddToCart = (product) => {
    setCartItems((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id || item.docId === product.docId);
      if (existingIndex > -1) {
        return prevCart.map((item, idx) => idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleTriggerCheckout = (itemContext) => {
    setActiveTxPayload(itemContext);
    setCurrentPage('processor');
  };

  const handleAddNewProduct = async (newProductPayload) => {
    try {
      const cloudPayload = {
        ...newProductPayload,
        dateAdded: new Date().toISOString(),
        promotionSettings: { adPlacement: null, dailyBudget: 0, campaignDays: 0 }
      };
      await addDoc(collection(db, "inventory"), cloudPayload);
      setCurrentPage('marketplace');
    } catch (error) {
      setGlobalItems((prev) => [{ id: Date.now(), docId: `loc-${Date.now()}`, ...newProductPayload, dateAdded: new Date().toISOString() }, ...prev]);
      setCurrentPage('marketplace');
    }
  };

  const getRelatedItems = (activeItem) => {
    if (!activeItem || !activeItem.title) return [];
    const fullTitleLower = activeItem.title.toLowerCase();
    let searchKeyword = '';
    
    if (fullTitleLower.includes('iphone')) searchKeyword = 'iphone';
    else if (fullTitleLower.includes('macbook')) searchKeyword = 'macbook';
    else if (fullTitleLower.includes('toyota')) searchKeyword = 'toyota';
    else if (fullTitleLower.includes('hoodie')) searchKeyword = 'hoodie';

    return globalItems.filter(item => {
      if (item.id === activeItem.id || item.docId === activeItem.docId) return false;
      const targetTitleLower = item.title ? item.title.toLowerCase() : '';
      const keywordMatch = searchKeyword && targetTitleLower.includes(searchKeyword);
      const categoryMatch = item.category && activeItem.category && (item.category === activeItem.category);
      return keywordMatch || categoryMatch;
    }).slice(0, 4);
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-white antialiased font-sans pb-12 selection:bg-[#FF5A00] selection:text-white">
      <header className="bg-[#16223F] py-4 px-6 sticky top-0 z-50 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-4 border-b-2 border-[#FF5A00]">
        <div className="flex items-center gap-3 cursor-pointer select-none group" onClick={() => setCurrentPage('marketplace')}>
          <div className="w-11 h-11 bg-[#FF5A00] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,90,0,0.4)]">
            <span className="text-white text-2xl font-black">B</span>
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">BOLD<span className="text-[#FF5A00]">.NG</span></span>
        </div>
        <nav className="flex flex-wrap gap-2 justify-center items-center">
          <button type="button" onClick={() => setCurrentPage('signup')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer ${currentPage === 'signup' ? 'bg-[#FF5A00]' : 'bg-slate-900/60'}`}>🚀 Get Started</button>
          <button type="button" onClick={() => setCurrentPage('marketplace')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer ${currentPage === 'marketplace' ? 'bg-[#FF5A00]' : 'bg-slate-900/60'}`}>🔍 Explore Market</button>
          <button type="button" onClick={() => setCurrentPage('addproduct')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer ${currentPage === 'addproduct' ? 'bg-[#FF5A00]' : 'bg-slate-900/60'}`}>➕ Add Product</button>
          <button type="button" onClick={() => setCurrentPage('store')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer ${currentPage === 'store' ? 'bg-[#FF5A00]' : 'bg-slate-900/60'}`}>📊 Dashboard</button>
          <button type="button" onClick={() => setCurrentPage('promotions')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer ${currentPage === 'promotions' ? 'bg-[#FF5A00]' : 'bg-slate-900/60'}`}>📈 Promotions</button>
          <button type="button" onClick={() => setCurrentPage('escrow')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer ${currentPage === 'escrow' ? 'bg-[#FF5A00]' : 'bg-slate-900/60'}`}>🛡️ Escrow Vault</button>
          <button type="button" onClick={() => setCurrentPage('ceo')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer ${currentPage === 'ceo' ? 'bg-amber-500 text-slate-950' : 'text-amber-400 bg-amber-950/20 border border-amber-900/40'}`}>👑 CEO Portal</button>
          <button type="button" onClick={() => setCurrentPage('cart')} className={`text-xs font-black px-4 py-2 rounded-xl border-none cursor-pointer flex items-center gap-2 ${currentPage === 'cart' ? 'bg-[#FF5A00]' : 'bg-[#0B132B]'}`}>
            🛒 Basket {totalCartCount > 0 && <span className="bg-[#FF5A00] text-white text-[10px] font-black px-2 py-0.5 rounded-full">{totalCartCount}</span>}
          </button>
        </nav>
      </header>

      {currentPage !== 'marketplace' && !loading && (
        <div className="bg-[#0f1936] border-b border-slate-800 px-6 py-2 sticky top-[78px] z-40 shadow-md">
          <button type="button" onClick={() => setCurrentPage('marketplace')} className="bg-transparent border-none text-slate-300 text-xs font-bold flex items-center gap-2 cursor-pointer hover:text-[#FF5A00]">← Back to Marketplace</button>
        </div>
      )}

      <div className="pt-4 px-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <div className="w-10 h-10 border-4 border-[#FF5A00] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">Synchronizing with Bold Cloud Core...</p>
          </div>
        ) : (
          <>
            {/* 🔐 Wired AuthPortal right here into the signup render state matrix block */}
            {currentPage === 'signup' && <AuthPortal setCurrentPage={setCurrentPage} setMerchantStore={setMerchantStore} />}
            
            {currentPage === 'store' && <Store merchantStore={merchantStore} items={globalItems} transactions={globalTransactions} setCurrentPage={setCurrentPage} />} 
            {currentPage === 'promotions' && <Promotions uploadedItems={globalItems} />}
            {currentPage === 'escrow' && <EscrowTracker transactions={globalTransactions} />}
            {currentPage === 'ceo' && <CeoDashboard transactions={globalTransactions} setTransactions={setGlobalTransactions} />}
            
            {currentPage === 'marketplace' && (
              <Marketplace 
                setCurrentPage={setCurrentPage} 
                items={globalItems} 
                onTriggerCheckout={handleTriggerCheckout} 
                onAddToCart={handleAddToCart}
                getRelatedItems={getRelatedItems}
              />
            )}

            {currentPage === 'addproduct' && <ProductCatalogForm onAddProductComplete={handleAddNewProduct} setCurrentPage={setCurrentPage} />}

            {currentPage === 'processor' && (
              <div className="space-y-6 max-w-6xl mx-auto px-4">
                <EscrowProcessor 
                  activeTx={activeTxPayload} 
                  onCancelTx={() => setCurrentPage('marketplace')}
                  onCompleteTx={(tx) => {
                    setGlobalTransactions((prev) => [tx, ...prev]);
                    setActiveTxPayload(null);
                    setCurrentPage('escrow');
                  }}
                />

                {getRelatedItems(activeTxPayload).length > 0 && (
                  <div className="bg-[#16223F] rounded-2xl p-6 border-2 border-dashed border-slate-800 shadow-xl mt-8">
                    <h3 className="text-xs font-black text-slate-300 tracking-wide uppercase mb-4 flex items-center gap-2">
                      ⚠️ Hesitating? Consider Alternative Options on Bold before Paying:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {getRelatedItems(activeTxPayload).map((relatedItem) => (
                        <div key={relatedItem.id || relatedItem.docId} className="bg-[#0B132B] rounded-xl p-4 border border-slate-800 hover:border-[#FF5A00] transition-all flex flex-col justify-between">
                          <div>
                            <div className="text-xl mb-1">{relatedItem.img || '📱'}</div>
                            <h4 className="text-xs font-bold text-white line-clamp-2 min-h-[32px]">{relatedItem.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{relatedItem.meta}</p>
                          </div>
                          <div className="mt-4 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                            <span className="text-xs font-black text-[#FF5A00]">₦{Number(relatedItem.price).toLocaleString()}</span>
                            <button
                              type="button"
                              onClick={() => setActiveTxPayload(relatedItem)}
                              className="bg-slate-900 hover:bg-[#FF5A00] text-white text-[10px] font-black px-2 py-1 rounded border-none cursor-pointer transition-all"
                            >
                              Switch to This
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentPage === 'cart' && <CartSummaryPage cartItems={cartItems} setCartItems={setCartItems} setCurrentPage={setCurrentPage} setTransactions={setGlobalTransactions} />}
          </>
        )}
        <Footer />
      </div>
    </div>
  );
}