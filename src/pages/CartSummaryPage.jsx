import React from 'react';

export default function CartSummaryPage({ cartItems, setCartItems, setCurrentPage, setTransactions }) {
  const activeCart = cartItems || [];

  // ARITHMETIC AGGREGATION BLOCK
  const subtotalValue = activeCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vettingEscrowFee = subtotalValue > 0 ? 3500 : 0; 
  const totalSettlementCost = subtotalValue + vettingEscrowFee;

  // INCREMENT / DECREMENT QUANTITIES
  const alterVolumeCount = (targetId, dynamicModifier) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === targetId) {
        const structuralNextCount = item.quantity + dynamicModifier;
        return structuralNextCount > 0 ? { ...item, quantity: structuralNextCount } : item;
      }
      return item;
    }));
  };

  // REMOVE ITEM ENTIRELY FROM MEMORY NODE
  const purgeUnwantedItem = (targetId) => {
    setCartItems(prev => prev.filter(item => item.id !== targetId));
  };

  // COMPILE BULK ITEMS INTO SEPARATE IMMUTABLE ESCROW LEDGERS
  const handleSystemicLockdown = () => {
    if (activeCart.length === 0) return;

    const freshlyIssuedVaults = activeCart.map((item) => ({
      id: `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      title: `${item.title} (x${item.quantity})`,
      amount: item.price * item.quantity,
      status: 'In Escrow Vault',
      date: new Date().toISOString().split('T')[0],
      hub: `${item.location || 'Lagos'} Hub`,
      type: item.category || 'General Matrix'
    }));

    setTransactions(prev => [...freshlyIssuedVaults, ...prev]);
    setCartItems([]); // Flush tray clean
    setCurrentPage('escrow'); // Direct jump to active track panel
  };

  return (
    <div className="max-w-6xl mx-auto my-6 px-4 text-white selection:bg-[#FF5A00]">
      
      <div className="text-left mb-8">
        <h2 className="text-3xl font-black tracking-tight">Ecosystem Ledger Basket</h2>
        <p className="text-xs text-slate-400 mt-1">
          Review staged assets, modify volumetric footprints, or drop unapproved allocations before deployment.
        </p>
      </div>

      {activeCart.length === 0 ? (
        <div className="bg-[#16223F] border border-slate-800 rounded-3xl py-24 px-4 text-center space-y-4 shadow-2xl">
          <span className="text-5xl block animate-bounce">🛒</span>
          <p className="text-sm font-black text-slate-400 uppercase tracking-wider">Your commercial pipeline is completely empty.</p>
          <button 
            onClick={() => setCurrentPage('marketplace')}
            className="bg-[#FF5A00] text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer border-none"
          >
            Return To Trading Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* STAGED ENTRY CONTROLLERS */}
          <div className="lg:col-span-2 space-y-4">
            {activeCart.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#16223F] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4 text-left w-full sm:w-auto">
                  <span className="text-2xl bg-[#0B132B] border border-slate-800 w-12 h-12 rounded-xl flex items-center justify-center">
                    {item.img}
                  </span>
                  <div>
                    <h4 className="font-black text-sm text-white line-clamp-1">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      Base Rate: ₦{item.price.toLocaleString()} | Hub: {item.location}
                    </span>
                  </div>
                </div>

                {/* STEP QUANTITIES & DISPOSAL UTILITY */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-none border-slate-800/60 pt-3 sm:pt-0">
                  <div className="bg-[#0B132B] border border-slate-800 rounded-xl p-1 flex items-center gap-3 font-mono text-xs font-bold">
                    <button 
                      onClick={() => alterVolumeCount(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-[#16223F] hover:bg-slate-800 text-white flex items-center justify-center cursor-pointer border-none font-bold"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-black text-white">{item.quantity}</span>
                    <button 
                      onClick={() => alterVolumeCount(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-[#16223F] hover:bg-slate-800 text-white flex items-center justify-center cursor-pointer border-none font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right font-mono text-sm font-black text-white min-w-[100px]">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </div>

                  <button 
                    onClick={() => purgeUnwantedItem(item.id)}
                    className="text-slate-500 hover:text-red-400 text-xs font-black tracking-wide border-none bg-transparent cursor-pointer transition-colors"
                  >
                    ✕ Drop
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* AUDIT & CONSOLIDATION PANEL */}
          <div className="lg:col-span-1 bg-[#16223F] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="border-b border-slate-800/60 pb-3 text-left">
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-300">Invoice Summation</h4>
              <p className="text-[10px] text-slate-500 font-medium">Aggregated clearing ledger before system lock.</p>
            </div>

            <div className="space-y-3 font-bold text-xs text-slate-300 text-left">
              <div className="flex justify-between">
                <span>Staged Positions Matrix</span>
                <span className="font-mono text-white">₦{subtotalValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Legal Hub Escrow Stamp</span>
                <span className="font-mono text-white">₦{vettingEscrowFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-800/60 pt-3 flex justify-between text-sm font-black text-white">
                <span>Combined Balance</span>
                <span className="font-mono text-[#FF5A00] text-base">₦{totalSettlementCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-[#0B132B] border border-slate-800 p-3.5 rounded-xl text-left text-[11px] leading-relaxed text-slate-400">
              🛡️ <span className="text-slate-300 font-black">Isolation Node:</span> Total capital aggregates will freeze securely within sovereign smart networks. Release directives issue only upon physical receipt logging from assigned inspection nodes.
            </div>

            <button
              onClick={handleSystemicLockdown}
              className="w-full bg-[#FF5A00] text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#FF5A00]/10 cursor-pointer border-none"
            >
              🔒 Authorize Vault Isolation
            </button>
          </div>

        </div>
      )}

    </div>
  );
}