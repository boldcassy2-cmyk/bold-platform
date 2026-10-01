// src/components/AppRouter.jsx
import React, { useState } from 'react';
import AuthGuard from './AuthGuard';
import ProductCatalogForm from './ProductCatalogForm';
import EscrowTracker from './EscrowTracker';
import SellerDashboard from './SellerDashboard';
import SearchBar from './SearchBar';
import RelatedProducts from './RelatedProducts';
import { BOLD_CATEGORIES } from '../data/categories';

export default function AppRouter({ currentUser, setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [userRole, setUserRole] = useState('merchant'); // 'merchant' or 'solo_seller'

  const handleNavigateToAuth = (mode) => {
    setCurrentPage(mode); 
  };

  const handleSearchFilter = (searchParams) => {
    console.log("Filtering marketplace with:", searchParams);
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 font-sans">
      {/* Navigation Header with Auth Status */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-[#16223F]">
        <h1 className="text-lg font-black tracking-wider text-[#FF5A00]">bold.ng</h1>
        
        <div className="flex gap-4 items-center">
          <button onClick={() => setActiveTab('marketplace')} className="text-xs font-bold hover:text-[#FF5A00] transition-colors">
            Marketplace
          </button>
          <button onClick={() => setActiveTab('dashboard')} className="text-xs font-bold hover:text-[#FF5A00] transition-colors">
            My Dashboard
          </button>
          <button onClick={() => setActiveTab('upload')} className="text-xs font-bold hover:text-[#FF5A00] transition-colors">
            Post Ad / Product
          </button>

          {!currentUser ? (
            <button 
              onClick={() => setCurrentPage('login')}
              className="bg-[#FF5A00] text-white text-xs font-bold px-4 py-2 rounded-lg"
            >
              Sign In
            </button>
          ) : (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              ● Online ({currentUser.email})
            </span>
          )}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="p-6">
        
        {/* TAB 1: MARKETPLACE & SEARCH */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <SearchBar onSearch={handleSearchFilter} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="h-40 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                  Product Image
                </div>
                <h3 className="font-bold text-sm">HP Folio i7 Touchscreen</h3>
                <p className="text-xs text-[#FF5A00] font-black">₦350,000</p>

                {/* BUY BUTTON GUARDED WITH ESCROW READY */}
                <AuthGuard 
                  currentUser={currentUser} 
                  onNavigateToAuth={handleNavigateToAuth}
                  actionTitle="Sign In to Secure Purchase"
                >
                  <button
                    onClick={() => alert(`Initiating Escrow Order for authenticated user: ${currentUser.email}`)}
                    className="w-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-black text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Buy with Escrow Protection
                  </button>
                </AuthGuard>
              </div>
            </div>

            {/* Related Items Component preview */}
            <RelatedProducts currentProductId="prod_1" subcategoryId="Computers & Laptops" />
          </div>
        )}

        {/* TAB 2: UPLOAD PRODUCT / POST AD */}
        {activeTab === 'upload' && (
          <AuthGuard 
            currentUser={currentUser} 
            onNavigateToAuth={handleNavigateToAuth}
            actionTitle="Vendor Access Required"
          >
            <ProductCatalogForm
              onAddProductComplete={(newProduct) => {
                const verifiedPayload = {
                  ...newProduct,
                  vendorId: currentUser.uid,
                  vendorEmail: currentUser.email,
                  createdAt: new Date().toISOString()
                };
                console.log("Saving product:", verifiedPayload);
                setActiveTab('marketplace');
              }}
              setCurrentPage={() => setActiveTab('marketplace')}
            />
          </AuthGuard>
        )}

        {/* TAB 3: SELLER PERFORMANCE & ESCROW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <AuthGuard 
            currentUser={currentUser} 
            onNavigateToAuth={handleNavigateToAuth}
            actionTitle="Sign In to Access Dashboard"
          >
            <div className="space-y-6">
              <SellerDashboard userId={currentUser?.uid} userType={userRole} />
              <EscrowTracker 
                order={{ productTitle: "HP Folio i7", amount: 350000, status: "escrow_funded" }} 
                userRole="buyer" 
                onUpdateStatus={(status) => alert(`Status updated to: ${status}`)} 
              />
            </div>
          </AuthGuard>
        )}

      </main>
    </div>
  );
}