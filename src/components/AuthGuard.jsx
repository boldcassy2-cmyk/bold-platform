import React, { useState } from 'react';
import AuthGuard from './AuthGuard';
import ProductCatalogForm from './ProductCatalogForm';

export default function AppRouter({ currentUser, setCurrentPage }) {
  const [activeTab, setActiveTab] = useState('marketplace');

  // Helper to handle navigation to login/register pages
  const handleNavigateToAuth = (mode) => {
    // mode can be 'login' or 'register'
    setCurrentPage(mode); 
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-slate-100 font-sans">
      {/* Navigation Header with Auth Status */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-[#16223F]">
        <h1 className="text-lg font-black tracking-wider text-[#FF5A00]">bold.ng</h1>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('marketplace')} className="text-xs font-bold hover:text-[#FF5A00] transition-colors">
            Marketplace
          </button>
          <button onClick={() => setActiveTab('upload')} className="text-xs font-bold hover:text-[#FF5A00] transition-colors">
            Upload Product
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
              ● Online
            </span>
          )}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="p-6">
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
                console.slog("Saving product:", verifiedPayload);
                setActiveTab('marketplace');
              }}
              setCurrentPage={() => setActiveTab('marketplace')}
            />
          </AuthGuard>
        )}

        {activeTab === 'marketplace' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Example Product Card */}
            <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="h-40 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                Product Image
              </div>
              <h3 className="font-bold text-sm">Premium Streetwear Hoodie</h3>
              <p className="text-xs text-[#FF5A00] font-black">₦45,000</p>

              {/* BUY BUTTON GUARDED */}
              <AuthGuard 
                currentUser={currentUser} 
                onNavigateToAuth={handleNavigateToAuth}
                actionTitle="Sign In to Purchase"
              >
                <button
                  onClick={() => alert(`Proceeding to checkout for authenticated user: ${currentUser.email}`)}
                  className="w-full bg-[#FF5A00] hover:bg-[#e04f00] text-white font-black text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  Buy Now
                </button>
              </AuthGuard>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
