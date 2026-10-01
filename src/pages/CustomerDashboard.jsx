import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function CustomerDashboard({ 
  user, 
  orders = [], 
  userListings = [], 
  setCurrentPage, 
  onOpenProductUpload, 
  onDeleteListing,
  onRefreshListings,
  onSignOut 
}) {
  const displayName = user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : 'Valued Member');
  const displayEmail = user?.email || 'member@bold.ng';
  const userPhoto = user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

  const userOrders = Array.isArray(orders) ? orders : [];
  const activeOrdersCount = userOrders.filter(o => o.status !== 'Completed').length;
  const completedVaultsCount = userOrders.filter(o => o.status === 'Completed').length;
  
  const myListings = Array.isArray(userListings) ? userListings : [];
  const totalListings = myListings.length;
  const totalPromoted = myListings.filter(item => item.promotionSettings?.adPlacement).length;

  // Edit State
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', price: '', category: '', whatsappNumber: '' });

  // Buyer Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);

  // View Mode toggle: 'grid' or 'table'
  const [viewMode, setViewMode] = useState('grid');

  // 🔒 AUTHENTICATION GATE
  const requireAuth = (callback) => {
    const activeUser = auth.currentUser || user;

    if (!activeUser || !activeUser.email) {
      alert('🔒 Access Restricted: You must log in or sign up for a bold.ng account to manage your store.');
      if (typeof setCurrentPage === 'function') {
        setCurrentPage('auth'); 
      }
      return;
    }

    if (typeof callback === 'function') {
      callback();
    }
  };

  // 🚪 HANDLE SIGN OUT / LOGOUT
  const handleSignOut = async () => {
    const confirmLogout = window.confirm('Are you sure you want to log out of your bold.ng merchant account?');
    if (!confirmLogout) return;

    try {
      if (typeof onSignOut === 'function') {
        onSignOut();
        return;
      }

      await signOut(auth);
      alert('You have been securely logged out.');
      
      if (typeof setCurrentPage === 'function') {
        setCurrentPage('auth');
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const handleOpenUpload = () => {
    requireAuth(() => {
      if (typeof onOpenProductUpload === 'function') {
        onOpenProductUpload();
      } else {
        alert('Product upload modal is loading or not connected yet.');
      }
    });
  };

  const handleOpenStoreUpgrade = () => {
    requireAuth(() => {
      if (typeof setCurrentPage === 'function') {
        setCurrentPage('addproduct'); 
      } else {
        handleOpenUpload();
      }
    });
  };

  const handleSecureCheckout = (product) => {
    requireAuth(() => {
      alert(`🛡️ Escrow Verified: Proceeding to secure checkout for ${product.title || product.meta}`);
      setSelectedProduct(null);
    });
  };

  const startEditing = (item) => {
    requireAuth(() => {
      setEditingItem(item.id || item.docId);
      setEditFormData({
        title: item.title || item.meta || '',
        price: item.price || '',
        category: item.category || 'General',
        whatsappNumber: item.whatsappNumber || ''
      });
    });
  };

  const handleSaveEdit = async (itemId) => {
    requireAuth(async () => {
      try {
        const itemRef = doc(db, 'inventory', itemId);
        await updateDoc(itemRef, {
          title: editFormData.title,
          meta: editFormData.title,
          price: Number(editFormData.price),
          category: editFormData.category,
          whatsappNumber: editFormData.whatsappNumber
        });
        alert('Listing updated successfully!');
        setEditingItem(null);
        if (typeof onRefreshListings === 'function') onRefreshListings();
      } catch (err) {
        console.error('Error updating listing:', err);
        alert('Failed to update listing.');
      }
    });
  };

  const getProductImage = (item) => {
    return item.media?.imageUrl || item.img || item.imageUrl || '';
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6 text-slate-100 space-y-6 pb-32 font-sans">
      
      {/* =========================================================
          1. MERCHANT HUB TOP BANNER + LOGOUT
      ========================================================= */}
      <div className="bg-[#131921] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff9900]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-5 z-10">
          <img 
            src={userPhoto} 
            alt={displayName} 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#ff9900] shadow-md" 
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#ff9900] bg-[#ff9900]/10 px-2.5 py-0.5 rounded border border-[#ff9900]/30">
                🏢 Verified Merchant & Classified Hub
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                ● Active Session
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Welcome back, {displayName}!
            </h1>
            
            <p className="text-slate-400 text-xs font-mono">
              {displayEmail} • Manage direct listings, WhatsApp leads, and escrow payouts.
            </p>
          </div>
        </div>

        {/* ACTION CONTROLS & LOGOUT BUTTON */}
        <div className="flex flex-wrap items-center gap-2.5 z-10 w-full lg:w-auto">
          <button
            type="button"
            onClick={handleOpenStoreUpgrade}
            className="flex-1 sm:flex-none px-4 py-3 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🏪</span> Add New Inventory
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage('marketplace')}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>🛍️</span> Marketplace
          </button>
          
          <button
            type="button"
            onClick={handleSignOut}
            className="px-4 py-3 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-900/60 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            title="Log out of your account"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </div>

      {/* =========================================================
          2. SELLER CENTRAL METRICS GRID
      ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161f2d] p-5 rounded-xl border border-slate-800 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Inventory</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-bold text-white font-mono">{totalListings}</span>
            <span className="text-[11px] text-[#ff9900] bg-[#ff9900]/10 px-2 py-0.5 rounded font-bold">Live Store</span>
          </div>
        </div>
        
        <div className="bg-[#161f2d] p-5 rounded-xl border border-slate-800 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Boosted / Promoted</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-bold text-[#ff9900] font-mono">{totalPromoted}</span>
            <span className="text-[11px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded font-bold">Top Ads</span>
          </div>
        </div>

        <div className="bg-[#161f2d] p-5 rounded-xl border border-slate-800 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Escrow Orders</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-bold text-white font-mono">{activeOrdersCount}</span>
            <span className="text-[11px] text-blue-400 bg-blue-950 px-2 py-0.5 rounded font-bold">In Progress</span>
          </div>
        </div>

        <div className="bg-[#161f2d] p-5 rounded-xl border border-slate-800 shadow-md flex flex-col justify-between hover:border-slate-700 transition">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Completed Sales</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-bold text-emerald-400 font-mono">{completedVaultsCount}</span>
            <span className="text-[11px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-bold">Paid Out</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. MERCHANT INVENTORY & DIRECT CLASSIFIED LISTINGS
      ========================================================= */}
      <div className="bg-[#131921] rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📦</span> Manage Inventory & Direct WhatsApp Listings
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit pricing, check promotional boost placement, or manage direct classified chats.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex text-xs">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md font-bold transition cursor-pointer ${viewMode === 'grid' ? 'bg-[#ff9900] text-[#0f1111]' : 'text-slate-400'}`}
              >
                Grid View
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-md font-bold transition cursor-pointer ${viewMode === 'table' ? 'bg-[#ff9900] text-[#0f1111]' : 'text-slate-400'}`}
              >
                Table View
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenUpload}
              className="bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] text-xs font-bold px-4 py-2.5 rounded-lg transition cursor-pointer shadow-xs"
            >
              + Upload Product
            </button>
          </div>
        </div>

        {myListings.length === 0 ? (
          <div className="text-center py-16 bg-[#161f2d] rounded-xl border border-slate-800 space-y-3 px-4">
            <div className="text-4xl">🚀</div>
            <h3 className="text-white font-bold text-sm">No Inventory Listed Yet</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Start selling to thousands on bold.ng by uploading your items with secure escrow or direct WhatsApp chat.
            </p>
            <button
              type="button"
              onClick={handleOpenStoreUpgrade}
              className="mt-2 bg-[#ffd814] text-[#0f1111] text-xs font-bold px-5 py-2.5 rounded-lg transition shadow cursor-pointer inline-block"
            >
              Add Your First Product
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map((item) => {
              const itemId = item.id || item.docId;
              const isEditing = editingItem === itemId;
              const placement = item.promotionSettings?.adPlacement || 'Standard Feed';
              const itemImg = getProductImage(item);

              return (
                <div key={itemId} className="bg-[#161f2d] border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
                  <div className="flex gap-3 items-start">
                    <div 
                      className="w-16 h-16 rounded-lg bg-slate-900 shrink-0 overflow-hidden border border-slate-800 flex items-center justify-center cursor-pointer"
                      onClick={() => setSelectedProduct(item)}
                    >
                      {itemImg && itemImg.startsWith('http') ? (
                        <img src={itemImg} alt={item.title || item.meta} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">📦</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#ff9900] bg-[#ff9900]/10 px-2 py-0.5 rounded">
                        {item.category || 'General'}
                      </span>

                      {isEditing ? (
                        <div className="space-y-1.5 mt-2">
                          <input 
                            type="text" 
                            value={editFormData.title} 
                            onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            placeholder="Title"
                          />
                          <input 
                            type="number" 
                            value={editFormData.price} 
                            onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            placeholder="Price (₦)"
                          />
                          <input 
                            type="text" 
                            value={editFormData.whatsappNumber} 
                            onChange={(e) => setEditFormData({...editFormData, whatsappNumber: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                            placeholder="WhatsApp Number"
                          />
                        </div>
                      ) : (
                        <>
                          <h4 
                            className="text-xs font-bold text-white truncate mt-1 cursor-pointer hover:text-[#ff9900]"
                            onClick={() => setSelectedProduct(item)}
                          >
                            {item.title || item.meta}
                          </h4>
                          <p className="text-xs font-mono font-bold text-white mt-0.5">₦{Number(item.price || 0).toLocaleString()}</p>
                          {item.whatsappNumber && (
                            <p className="text-[10px] text-emerald-400 font-mono mt-0.5">📱 WhatsApp: {item.whatsappNumber}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Ad Slot:</span>
                    <span className="text-emerald-400 font-bold truncate max-w-[130px]">{placement}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(item)}
                      className="text-[11px] text-[#0066c0] hover:underline font-bold cursor-pointer"
                    >
                      View Details
                    </button>
                    
                    <div className="flex items-center gap-3">
                      {isEditing ? (
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(itemId)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditing(item)}
                          className="text-xs text-[#0066c0] hover:underline font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                      )}

                      {onDeleteListing && (
                        <button
                          type="button"
                          onClick={() => onDeleteListing(itemId)}
                          className="text-xs text-red-400 hover:text-red-300 font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="bg-[#161f2d] border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Placement</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {myListings.map((item) => {
                  const itemId = item.id || item.docId;
                  const placement = item.promotionSettings?.adPlacement || 'Standard Feed';

                  return (
                    <tr key={itemId} className="hover:bg-slate-900/50 transition">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                          {getProductImage(item) ? (
                            <img src={getProductImage(item)} alt="" className="w-full h-full object-cover" />
                          ) : '📦'}
                        </span>
                        <span className="truncate max-w-[200px]">{item.title || item.meta}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{item.category || 'General'}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">₦{Number(item.price || 0).toLocaleString()}</td>
                      <td className="py-3 px-4 text-emerald-400">{placement}</td>
                      <td className="py-3 px-4">
                        <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-900">Active</span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-3">
                        <button 
                          onClick={() => startEditing(item)}
                          className="text-[#0066c0] hover:underline font-bold"
                        >
                          Edit
                        </button>
                        {onDeleteListing && (
                          <button 
                            onClick={() => onDeleteListing(itemId)}
                            className="text-red-400 hover:underline font-bold"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================
          4. ESCROW VAULT & TRANSACTION HISTORY
      ========================================================= */}
      <div className="bg-[#131921] rounded-2xl p-6 sm:p-7 border border-slate-800 shadow-xl">
        <h2 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
          <span>🛡️</span> Escrow Vault & Transaction History
        </h2>
        
        {userOrders.length === 0 ? (
          <div className="text-center py-10 bg-[#161f2d] rounded-xl border border-slate-800">
            <p className="text-slate-400 text-xs">
              No escrow transactions recorded for this account. Secure purchases and payouts will be tracked here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {userOrders.map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#161f2d] p-4 rounded-xl border border-slate-800 gap-4">
                <div>
                  <p className="font-bold text-xs text-white">{order.title}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">ID: {order.id} • {order.date}</p>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <div className="text-right">
                    <p className="font-bold text-sm text-[#ff9900] font-mono">₦{Number(order.amount).toLocaleString()}</p>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full inline-block mt-1 ${order.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-amber-950 text-amber-400 border border-amber-900'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================
          5. PRODUCT DETAILS & DIRECT CONTACT MODAL
      ========================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#131921] border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white space-y-5 relative shadow-2xl">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-slate-300 w-7 h-7 rounded-full flex items-center justify-center font-bold transition cursor-pointer"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#ff9900] bg-[#ff9900]/10 px-2.5 py-0.5 rounded border border-[#ff9900]/30 font-bold">
                {selectedProduct.category || 'General'} Item Summary
              </span>
              <h2 className="text-xl font-bold text-white pt-1">
                {selectedProduct.title || selectedProduct.meta}
              </h2>
            </div>

            <div className="w-full h-56 bg-[#161f2d] rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {getProductImage(selectedProduct) ? (
                <img 
                  src={getProductImage(selectedProduct)} 
                  alt={selectedProduct.title || selectedProduct.meta} 
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-3xl">📦</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#161f2d] p-3.5 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Price</span>
                <span className="text-sm font-bold text-[#ff9900] font-mono mt-0.5 block">
                  ₦{Number(selectedProduct.price || 0).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Location</span>
                <span className="text-xs font-bold text-white mt-0.5 block">
                  {selectedProduct.location || 'Nigeria'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Listing ID</span>
                <span className="font-mono text-slate-300 truncate block mt-0.5">
                  {selectedProduct.id || selectedProduct.docId || 'BOLD-NG'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Escrow / Direct Status</span>
                <span className="text-emerald-400 font-bold block mt-0.5">Verified Node</span>
              </div>
            </div>

            {selectedProduct.whatsappNumber && (
              <div className="bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-bold">Direct Vendor WhatsApp:</span>
                <a 
                  href={`https://wa.me/${selectedProduct.whatsappNumber}?text=Hello, I am interested in your listing: ${selectedProduct.title || selectedProduct.meta}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition"
                >
                  Chat on WhatsApp 💬
                </a>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSecureCheckout(selectedProduct)}
                className="flex-1 bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] font-bold py-3 rounded-xl transition shadow cursor-pointer text-xs uppercase tracking-wider"
              >
                Secure Checkout & Escrow
              </button>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl transition cursor-pointer text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}