import React, { useState, useEffect } from 'react';

export default function Navbar({ currentPage, setCurrentPage }) {
  const [basketCount, setBasketCount] = useState(0);
  const [escrowCount, setEscrowCount] = useState(0);

  // Sync counts from LocalStorage & custom dispatch events
  const syncCounts = () => {
    // 1. Calculate Basket Items
    const savedCart = JSON.parse(localStorage.getItem('bold_cart') || '[]');
    const totalCartQuantity = savedCart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    setBasketCount(totalCartQuantity);

    // 2. Calculate Active Escrow Orders
    const savedOrders = JSON.parse(localStorage.getItem('bold_order_history') || '[]');
    const activeEscrows = savedOrders.filter(order => order.status?.includes('Escrow')).length;
    setEscrowCount(activeEscrows);
  };

  useEffect(() => {
    syncCounts();

    // Listen for custom dispatch events and window storage updates
    window.addEventListener('cartUpdated', syncCounts);
    window.addEventListener('storage', syncCounts);

    return () => {
      window.removeEventListener('cartUpdated', syncCounts);
      window.removeEventListener('storage', syncCounts);
    };
  }, []);

  const navItems = [
    { id: 'home', label: '🏠 Home' },
    { id: 'signup', label: '🚀 Get Started' },
    { id: 'explore', label: '🔍 Explore Market' },
    { id: 'add-product', label: '➕ Add Product' },
    { id: 'store', label: '📊 Dashboard' },
    { id: 'promotions', label: '📈 Promotions' },
    { id: 'escrow', label: '🛡️ Escrow Vault', badge: escrowCount },
    { id: 'telemetry', label: '⚡ Vault Telemetry' },
    { id: 'ceo-portal', label: '👑 CEO Portal' },
    { id: 'cart', label: '🛒 Basket', badge: basketCount, isPrimary: true }
  ];

  return (
    <nav className="bg-[#0B132B] border-b border-slate-800 px-6 py-4 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <button 
          onClick={() => setCurrentPage('home')} 
          className="text-2xl font-black tracking-wider text-white bg-transparent border-none cursor-pointer outline-none shrink-0"
        >
          BOLD<span className="text-[#FF5A00]">.ng</span>
        </button>
        
        {/* All 10 Navigation Links */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;

            if (item.isPrimary) {
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className="bg-[#FF5A00] text-white font-bold text-xs px-4 py-2 rounded-xl border-none cursor-pointer transition-all duration-200 hover:brightness-110 shadow-md shadow-orange-600/20 outline-none flex items-center gap-1.5 shrink-0 ml-2"
                >
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="bg-white text-[#FF5A00] text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer border-none bg-transparent transition duration-200 outline-none flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  isActive 
                    ? 'text-[#FF5A00] bg-slate-800/60 font-bold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="bg-[#FF5A00] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </nav>
  );
}