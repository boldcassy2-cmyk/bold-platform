import React, { useState } from 'react';
import SignUp from './pages/SignUp';
import Store from './pages/Store';
import Marketplace from './pages/Marketplace';
import Promotions from './pages/Promotions';
import EscrowTracker from './pages/EscrowTracker';
import CeoDashboard from './pages/CeoDashboard';
import ProductCatalogForm from './pages/ProductCatalogForm';
import EscrowProcessor from './pages/EscrowProcessor';

export default function App() {
  const [currentPage, setCurrentPage] = useState('marketplace'); // Default straight to live market view
  const [activeTxPayload, setActiveTxPayload] = useState(null);
  
  // SHARED GLOBAL LIVE INVENTORY LEDGER MATRIX
  const [globalItems, setGlobalItems] = useState([
    { id: 1, category: 'fashion', title: 'Heavyweight Boxy Hoodie (Vintage Black)', price: 28000, location: 'Lagos', meta: 'Size: L, XL | Cotton', img: '👕' },
    { id: 2, category: 'automotive', title: 'Toyota Camry 2018 (Foreign Used SE)', price: 14500000, location: 'Abuja', meta: '42,000 km | Automatic', img: '🚗' },
    { id: 3, category: 'electronics', title: 'MacBook Pro M2 (16GB RAM / 512GB SSD)', price: 1850000, location: 'Lagos', meta: 'UK Used | 100% Battery', img: '💻' },
    { id: 4, category: 'realestate', title: '4 Bedroom Terraced Duplex + BQ', price: 85000000, location: 'Lekki', meta: 'Serviced | Brand New', img: '🏢' },
    { id: 5, category: 'travel', title: 'Lagos to London Flight Ticket (Oneway)', price: 950000, location: 'Lagos', meta: 'Premium Economy | June Drop', img: '✈️' },
    { id: 6, category: 'education', title: 'Fullstack Next.js + Tailwind Mentorship', price: 150000, location: 'Remote', meta: '8 Weeks | 1-on-1 Sessions', img: '📚' }
  ]);

  // INITIALIZED MERCHANT PROFILE CONTEXT DATA
  const [merchantStore, setMerchantStore] = useState({
    name: 'Bold Enterprise',
    niche: 'Multi-Sector Commerce Node',
    status: 'Verified',
    location: 'Lagos, NG',
    whatsapp: '08000000000'
  });

  const handleTriggerCheckout = (itemContext) => {
    setActiveTxPayload(itemContext);
    setCurrentPage('processor');
  };

  // Callback function to push newly created form payloads into the main marketplace state array
  const handleAddNewProduct = (newProductPayload) => {
    setGlobalItems((prevItems) => [newProductPayload, ...prevItems]);
    setCurrentPage('marketplace'); // Automatically slide back to market to show live update
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-white antialiased font-sans pb-12 selection:bg-[#FF5A00] selection:text-white">
      
      {/* BRAND MASTER GLOBAL NAVIGATION HEADER */}
      <header className="bg-[#0B132B] py-4 px-6 sticky top-0 z-50 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-4 border-b-2 border-[#FF5A00]">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('marketplace')}>
          <span className="text-2xl font-black tracking-tighter text-white uppercase">
            BOLD<span className="text-[#FF5A00] text-3xl">.NG</span>
          </span>
        </div>

        <nav className="flex flex-wrap gap-2 justify-center items-center">
          <button onClick={() => setCurrentPage('signup')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer transition-all ${currentPage === 'signup' ? 'bg-[#FF5A00] text-white shadow-lg scale-105' : 'text-slate-300 bg-slate-900/60 hover:text-white'}`}>🚀 Get Started</button>
          <button onClick={() => setCurrentPage('marketplace')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer transition-all ${currentPage === 'marketplace' ? 'bg-[#FF5A00] text-white shadow-lg scale-105' : 'text-slate-300 bg-slate-900/60 hover:text-white'}`}>🔍 Explore Market</button>
          <button onClick={() => setCurrentPage('addproduct')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer transition-all ${currentPage === 'addproduct' ? 'bg-[#FF5A00] text-white shadow-lg scale-105' : 'text-slate-300 bg-slate-900/60 hover:text-white'}`}>➕ Add Product</button>
          <button onClick={() => setCurrentPage('store')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer transition-all ${currentPage === 'store' ? 'bg-[#FF5A00] text-white shadow-lg scale-105' : 'text-slate-300 bg-slate-900/60 hover:text-white'}`}>📊 Dashboard</button>
          <button onClick={() => setCurrentPage('promotions')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer transition-all ${currentPage === 'promotions' ? 'bg-[#FF5A00] text-white shadow-lg scale-105' : 'text-slate-300 bg-slate-900/60 hover:text-white'}`}>📈 Promotions</button>
          <button onClick={() => setCurrentPage('escrow')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer transition-all ${currentPage === 'escrow' ? 'bg-[#FF5A00] text-white shadow-lg scale-105' : 'text-slate-300 bg-slate-900/60 hover:text-white'}`}>🛡️ Escrow Vault</button>
          <button onClick={() => setCurrentPage('ceo')} className={`text-xs font-black px-3 py-2 rounded-xl border-none cursor-pointer transition-all ${currentPage === 'ceo' ? 'bg-amber-500 text-slate-950 font-black shadow-lg scale-105' : 'text-amber-400 bg-amber-950/20 border border-amber-900/40 hover:bg-amber-950/40'}`}>👑 CEO Portal</button>
        </nav>
      </header>

      {/* CORE ROUTING SWITCH CONTAINER */}
      <div className="pt-4 px-2">
        {currentPage === 'signup' && <SignUp setCurrentPage={setCurrentPage} setMerchantStore={setMerchantStore} />}
        
        {/* COMPREHENSIVE VENDOR STREAM INTEGRATION HUB */}
        {currentPage === 'store' && (
          <Store 
            merchantStore={merchantStore} 
            items={globalItems} 
            setCurrentPage={setCurrentPage} 
          />
        )}
        
        {currentPage === 'promotions' && <Promotions />}
        {currentPage === 'escrow' && <EscrowTracker />}
        {currentPage === 'ceo' && <CeoDashboard />}
        
        {/* Pass down ingestion handler directly to catalog form page view */}
        {currentPage === 'addproduct' && (
          <ProductCatalogForm onAddProductComplete={handleAddNewProduct} setCurrentPage={setCurrentPage} />
        )}
        
        {/* Pass down dynamic global item records directly to marketplace dashboard view */}
        {currentPage === 'marketplace' && (
          <Marketplace 
            setCurrentPage={setCurrentPage} 
            items={globalItems} 
            onTriggerCheckout={handleTriggerCheckout} 
          />
        )}

        {currentPage === 'processor' && (
          <EscrowProcessor 
            activeTx={activeTxPayload} 
            onCancelTx={() => setCurrentPage('marketplace')}
            onCompleteTx={() => {
              setActiveTxPayload(null);
              setCurrentPage('marketplace');
            }}
          />
        )}
      </div>

    </div>
  );
}