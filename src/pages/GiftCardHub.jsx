import React, { useState } from 'react';
import { auth } from '../firebase';

export default function GiftCardHub({ onNavigate }) {
  const currentUser = auth?.currentUser;
  
  const [selectedAmount, setSelectedAmount] = useState(10000); // Default ₦10,000
  const [customAmount, setCustomAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState(currentUser?.displayName || 'Valued Customer');
  const [personalMessage, setPersonalMessage] = useState('Enjoy shopping on bold.ng! Treat yourself to something special.');
  const [selectedTheme, setSelectedTheme] = useState('midnight'); // midnight | celebration | gold
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemStatus, setRedeemStatus] = useState(null); // { success: true, message: '...' }

  const presetAmounts = [5000, 10000, 25000, 50000, 100000];

  const themes = {
    midnight: {
      name: 'Midnight Executive',
      bg: 'bg-gradient-to-br from-[#0B132B] via-[#16223F] to-slate-950',
      border: 'border-[#FF5A00]/40',
      badge: 'bg-[#FF5A00] text-white',
    },
    celebration: {
      name: 'Celebration Spark',
      bg: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950',
      border: 'border-purple-500/40',
      badge: 'bg-purple-600 text-white',
    },
    gold: {
      name: 'Elite Gold',
      bg: 'bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950',
      border: 'border-amber-500/40',
      badge: 'bg-amber-500 text-slate-950 font-bold',
    }
  };

  const handlePurchase = (e) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    
    if (!finalAmount || finalAmount <= 0) {
      alert('Please specify a valid gift card amount.');
      return;
    }

    if (!recipientEmail) {
      alert('Please enter the recipient email address.');
      return;
    }

    // Connect to your payment gateway (Paystack / Flutterwave) or wallet checkout flow
    alert(`Initiating secure checkout for ₦${finalAmount.toLocaleString()} bold.ng Gift Card addressed to ${recipientEmail}!`);
  };

  const handleRedeem = (e) => {
    e.preventDefault();
    if (!redeemCode.trim()) {
      setRedeemStatus({ success: false, message: 'Please enter a valid gift card code.' });
      return;
    }

    // Mock validation logic
    if (redeemCode.toUpperCase().startsWith('BOLD-')) {
      setRedeemStatus({ 
        success: true, 
        message: 'Successfully redeemed! ₦15,000 has been credited to your bold.ng wallet.' 
      });
    } else {
      setRedeemStatus({ 
        success: false, 
        message: 'Invalid or expired gift card code. Please check and try again.' 
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white font-sans space-y-8">
      
      {/* Header */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#FF5A00] uppercase font-mono bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            Digital Gifting Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 uppercase tracking-tight">bold.ng Gift Cards</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Give the gift of endless choice across multi-vendor electronics, fashion, and lifestyle essentials.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('marketplace')}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
        >
          ← Return to Marketplace
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Purchase & Customize Form */}
        <div className="lg:col-span-7 bg-[#16223F] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🎁</span> Create & Send a Gift Card
          </h2>

          <form onSubmit={handlePurchase} className="space-y-6">
            
            {/* Amount Selection */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Select Value (NGN)</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                    className={`py-2.5 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                      selectedAmount === amt && !customAmount
                        ? 'bg-[#FF5A00] border-[#FF5A00] text-white shadow-lg shadow-orange-600/20'
                        : 'bg-[#0B132B] border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <input
                  type="number"
                  placeholder="Or enter custom amount (e.g. 15000)"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white font-mono outline-none focus:border-[#FF5A00]"
                />
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Card Design Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedTheme(key)}
                    className={`p-3 rounded-xl text-left border text-xs font-bold transition cursor-pointer ${
                      selectedTheme === key ? 'border-[#FF5A00] bg-slate-800' : 'border-slate-800 bg-[#0B132B] text-slate-400'
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Recipient Name</label>
                <input
                  type="text"
                  placeholder="e.g. Amaka Johnson"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#FF5A00]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Recipient Email *</label>
                <input
                  type="email"
                  placeholder="amaka@example.com"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#FF5A00]"
                />
              </div>
            </div>

            {/* Sender & Message */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Your Name (Sender)</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#FF5A00]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Personal Message</label>
                <textarea
                  rows="3"
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-xl p-4 text-xs text-white outline-none focus:border-[#FF5A00] resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#FF5A00] hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/30 transition cursor-pointer uppercase text-xs tracking-wider font-mono"
            >
              Proceed to Secure Payment (₦{(customAmount ? parseFloat(customAmount) || 0 : selectedAmount).toLocaleString()})
            </button>
          </form>
        </div>

        {/* Right Column: Live Card Preview & Redemption */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Gift Card Preview */}
          <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider">Live Card Preview</h3>
            
            <div className={`relative rounded-2xl p-6 border ${themes[selectedTheme].bg} ${themes[selectedTheme].border} shadow-xl overflow-hidden min-h-[200px] flex flex-col justify-between`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-lg font-black tracking-tight text-white">bold<span className="text-[#FF5A00]">.ng</span></span>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Universal Marketplace Gift Voucher</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-mono ${themes[selectedTheme].badge}`}>
                  ₦{(customAmount ? parseFloat(customAmount) || 0 : selectedAmount).toLocaleString()}
                </span>
              </div>

              <div className="my-4 space-y-1">
                <p className="text-xs text-slate-300 italic">"{personalMessage || 'Your message here...'}"</p>
                <div className="pt-2 flex justify-between text-[11px] font-mono text-slate-400">
                  <span>To: {recipientName || 'Recipient Name'}</span>
                  <span>From: {senderName || 'Sender'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>CODE: BOLD-GIFT-XXXX</span>
                <span>No Expiry</span>
              </div>
            </div>
          </div>

          {/* Redeem Card Box */}
          <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🎟️</span> Have a Gift Card? Redeem It
            </h3>
            <p className="text-xs text-slate-400">
              Enter your voucher code below to instantly fund your bold.ng account balance.
            </p>

            <form onSubmit={handleRedeem} className="space-y-3">
              <input
                type="text"
                placeholder="e.g. BOLD-GIFT-8829-XYZ"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value)}
                className="w-full bg-[#0B132B] border border-slate-700 rounded-xl px-4 py-3 text-xs text-white font-mono uppercase outline-none focus:border-[#FF5A00]"
              />
              <button
                type="submit"
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase font-mono tracking-wider transition cursor-pointer"
              >
                Redeem Voucher Code
              </button>
            </form>

            {redeemStatus && (
              <div className={`p-3 rounded-xl text-xs font-mono border ${
                redeemStatus.success ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' : 'bg-red-950/60 text-red-400 border-red-800/60'
              }`}>
                {redeemStatus.message}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}