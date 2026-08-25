import React, { useMemo, useState } from 'react';

export default function CartSummaryPage({ 
  cartItems = [], 
  setCartItems = () => {}, 
  setCurrentPage = () => {}, 
  onProceedToEscrow 
}) {
  const [navigationError, setNavigationError] = useState('');

  // Safe array reference
  const activeCart = useMemo(() => (Array.isArray(cartItems) ? cartItems : []), [cartItems]);

  // Financial aggregation calculations
  const subtotalValue = useMemo(() => {
    return activeCart.reduce((sum, item) => {
      const price = Number(item?.price) || 0;
      const quantity = Number(item?.quantity) || 1;
      return sum + (price * quantity);
    }, 0);
  }, [activeCart]);

  // Flat Escrow Protection & Vetting Fee
  const vettingEscrowFee = subtotalValue > 0 ? 3500 : 0; 
  const totalSettlementCost = subtotalValue + vettingEscrowFee;

  // Quantity modification handler
  const handleQuantityChange = (targetItem, dynamicModifier) => {
    if (typeof setCartItems !== 'function') return;
    const targetKey = targetItem?.id || targetItem?.docId;
    
    setCartItems(prev => {
      const currentList = Array.isArray(prev) ? prev : [];
      return currentList.map(item => {
        const itemKey = item?.id || item?.docId;
        if (itemKey === targetKey) {
          const nextQuantity = (Number(item?.quantity) || 1) + dynamicModifier;
          return nextQuantity > 0 ? { ...item, quantity: nextQuantity } : item;
        }
        return item;
      });
    });
  };

  // Remove item from cart
  const handleRemoveItem = (targetItem) => {
    if (typeof setCartItems !== 'function') return;
    const targetKey = targetItem?.id || targetItem?.docId;
    setCartItems(prev => {
      const currentList = Array.isArray(prev) ? prev : [];
      return currentList.filter(item => (item?.id || item?.docId) !== targetKey);
    });
  };

  // Safe checkout routing execution
  const handleProceedToCheckout = () => {
    setNavigationError('');
    if (activeCart.length === 0) return;

    const aggregateCheckoutPayload = {
      items: activeCart,
      subtotal: subtotalValue,
      escrowFee: vettingEscrowFee,
      totalPayout: totalSettlementCost
    };

    try {
      if (typeof onProceedToEscrow === 'function') {
        onProceedToEscrow(aggregateCheckoutPayload);
      } else if (typeof setCurrentPage === 'function') {
        setCurrentPage('processor');
      } else {
        throw new Error('No routing handler provided to CartSummaryPage.');
      }
    } catch (err) {
      console.error('Checkout processing failed:', err);
      setNavigationError('Unable to route to checkout processor. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto my-6 px-4 text-white font-sans selection:bg-[#FF5A00]">
      
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Shopping Basket</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review your selected items and verify specs before proceeding to secure payment authorization.
          </p>
        </div>
        {activeCart.length > 0 && (
          <span className="text-xs font-mono text-slate-400">
            {activeCart.length} {activeCart.length === 1 ? 'Unique Item' : 'Unique Items'}
          </span>
        )}
      </header>

      {/* Fallback Inline Error Alert */}
      {navigationError && (
        <div className="mt-4 p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-300 font-bold flex items-center justify-between">
          <span>⚠️ {navigationError}</span>
          <button 
            onClick={() => setNavigationError('')}
            className="text-red-400 hover:text-white bg-transparent border-none cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Empty State View */}
      {activeCart.length === 0 ? (
        <section className="bg-[#16223F] border border-slate-800 rounded-3xl py-20 px-4 text-center space-y-4 shadow-xl mt-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#0B132B] flex items-center justify-center text-4xl shadow-inner">
            🛒
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Your Shopping Cart is Empty</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Looks like you haven't added anything to your cart yet. Explore our marketplace to find verified deals.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => typeof setCurrentPage === 'function' && setCurrentPage('marketplace')}
            className="bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-black uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-[#FF5A00]/20 cursor-pointer border-none active:scale-95"
          >
            Continue Shopping
          </button>
        </section>
      ) : (
        /* Active Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-6">
          
          {/* Item List Container */}
          <section className="lg:col-span-2 space-y-4">
            {activeCart.map((item, index) => {
              const key = item?.id || item?.docId || `cart-item-${index}`;
              const itemPrice = Number(item?.price) || 0;
              const itemQty = Number(item?.quantity) || 1;

              return (
                <article 
                  key={key} 
                  className="bg-[#16223F] border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-center gap-4 text-left w-full sm:w-auto flex-1">
                    <div className="w-20 h-20 rounded-xl bg-[#0B132B] border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 relative">
                      {item?.img && typeof item.img === 'string' && item.img.startsWith('http') ? (
                        <img 
                          src={item.img} 
                          alt={item?.title || 'Item image'} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      ) : (
                        <span className="text-3xl">{item?.img || '📦'}</span>
                      )}
                    </div>
                    
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-bold text-[#FF5A00] uppercase tracking-wider">
                        📍 {item?.location || 'Nigeria'}
                      </span>
                      <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">
                        {item?.title || 'Untitled Product'}
                      </h3>
                      <p className="text-xs font-mono text-slate-400">
                        Unit Price: ₦{itemPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Stepper Buttons & Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto border-t sm:border-none border-slate-800/80 pt-3 sm:pt-0">
                    <div className="bg-[#0B132B] border border-slate-700/80 rounded-xl p-1 flex items-center gap-2 font-mono text-xs">
                      <button 
                        type="button"
                        onClick={() => handleQuantityChange(item, -1)}
                        className="w-7 h-7 rounded-lg bg-[#16223F] hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer border-none font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-black text-white">{itemQty}</span>
                      <button 
                        type="button"
                        onClick={() => handleQuantityChange(item, 1)}
                        className="w-7 h-7 rounded-lg bg-[#16223F] hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer border-none font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[110px]">
                      <span className="text-[10px] text-slate-400 block font-mono">Subtotal</span>
                      <span className="font-mono text-base font-black text-white">
                        ₦{(itemPrice * itemQty).toLocaleString()}
                      </span>
                    </div>

                    <button 
                      type="button"
                      onClick={() => handleRemoveItem(item)}
                      className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 border-none bg-transparent cursor-pointer transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Sidebar Summary */}
          <aside className="lg:col-span-1 bg-[#16223F] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl sticky top-24">
            <div className="border-b border-slate-800 pb-4 text-left">
              <h2 className="font-black text-xs uppercase tracking-widest text-slate-300">Order Summary</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Final breakdown before proceeding to Paystack escrow authorization.</p>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 text-left font-medium">
              <div className="flex justify-between items-center">
                <span>Items Subtotal</span>
                <span className="font-mono text-white font-bold">₦{subtotalValue.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  Escrow Protection Fee
                  <span title="Guarantees buyer protection until item delivery confirmation" className="cursor-help text-slate-500">ⓘ</span>
                </span>
                <span className="font-mono text-white font-bold">₦{vettingEscrowFee.toLocaleString()}</span>
              </div>

              <div className="border-t border-slate-800 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-black text-white">Total Amount</span>
                <span className="font-mono text-xl font-black text-[#FF5A00]">
                  ₦{totalSettlementCost.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-2xl text-left text-xs leading-relaxed text-slate-400 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span>🛡️</span>
                <span className="text-white">Escrow Payment Protection</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Your payment will be authorized via Paystack and locked securely in escrow. Funds are only released to the vendor after order confirmation.
              </p>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={activeCart.length === 0}
              className="w-full bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-[#FF5A00]/20 cursor-pointer border-none active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <span>Proceed to Payment</span>
              <span>→</span>
            </button>
          </aside>

        </div>
      )}

    </div>
  );
}