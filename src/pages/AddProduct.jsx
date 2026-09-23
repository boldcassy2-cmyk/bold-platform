import React, { useState, useEffect } from 'react';

export default function Promotions({ 
  uploadedItems = [], 
  onTriggerCheckout, 
  setCurrentPage, 
  setActiveTxPayload 
}) {
  // Seller Mode State: 'merchant' (catalog items) vs 'solo' (direct contact / custom items)
  const [sellerMode, setSellerMode] = useState('merchant');

  // Search & Selection State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Safe default item selection based on incoming uploadedItems
  const activeCatalog = uploadedItems.length > 0 ? uploadedItems : [
    { id: 'item-1', title: 'HP EliteBook 840 G5 Core i5 8GB RAM 256GB SSD', price: 185000, category: 'electronics_laptops', type: 'product' },
    { id: 'item-2', title: 'Same-Day Nationwide Dispatch & Package Delivery', price: 4500, category: 'transport_dispatch', type: 'service' }
  ];

  const [selectedItemId, setSelectedItemId] = useState(activeCatalog[0]?.id || 'item-1');

  // Solo Seller Form State
  const [soloTitle, setSoloTitle] = useState('');
  const [soloContact, setSoloContact] = useState('');
  const [soloPrice, setSoloPrice] = useState(15000);
  const [soloCategory, setSoloCategory] = useState('electronics_laptops');
  const [soloSubCategory, setSoloSubCategory] = useState('');

  // Item Specs State
  const [itemSpecs, setItemSpecs] = useState({
    ramMemory: '',
    storageCapacity: '',
    modelSize: '',
    location: ''
  });

  // Campaign Budget & Timeline State
  const [dailyBudget, setDailyBudget] = useState(5000);
  const [campaignDays, setCampaignDays] = useState(7);
  const [adPlacement, setAdPlacement] = useState('trending');

  // Placement Multipliers Configuration
  const placementMultipliers = {
    sidebar: { name: 'Sidebar Feed Node', multiplier: 120, conversions: 0.03 },
    trending: { name: 'Trending Ribbon Banner', multiplier: 250, conversions: 0.05 },
    broadcast: { name: 'Direct Push Broadcast', multiplier: 450, conversions: 0.08 }
  };

  // Comprehensive Professional Categories and Subcategories Master List
  const marketplaceCategories = [
    {
      id: 'electronics_laptops',
      label: '💻 Laptops, Phones & Gadgets',
      subcategories: [
        { id: 'laptops_windows', label: 'Windows Laptops (HP, Dell, Lenovo, Asus, etc.)' },
        { id: 'laptops_macbook', label: 'Apple MacBooks (Air / Pro)' },
        { id: 'phones_smartphones', label: 'Smartphones & Mobile Phones (iPhone, Samsung, Tecno, Infinix, etc.)' },
        { id: 'phones_tablets', label: 'Tablets, iPads & E-Readers' },
        { id: 'gadgets_accessories', label: 'Gaming Consoles, Audio, Power Banks & Accessories' }
      ]
    },
    {
      id: 'gift_cards',
      label: '💳 Gift Cards & Digital Vouchers',
      subcategories: [
        { id: 'apple_itunes_gc', label: 'Apple / iTunes Gift Cards' },
        { id: 'google_play_gc', label: 'Google Play Gift Cards' },
        { id: 'steam_amazon_gc', label: 'Steam, Amazon & Razer Gold Cards' },
        { id: 'crypto_vouchers', label: 'Verified Digital Vouchers & E-Currency' }
      ]
    },
    {
      id: 'motor_parts_vehicles',
      label: '🚗 Motor Parts, Motorcycles & Bicycles',
      subcategories: [
        { id: 'motor_spare_parts', label: 'Car Spare Parts (Engines, Shock Absorbers, Brakes, Tyres)' },
        { id: 'motorcycles_tricycles', label: 'Motorcycles, Okada & Tricycles (Keke Napep)' },
        { id: 'bicycles_scooters', label: 'Bicycles, Electric Scooters & Cycling Gear' },
        { id: 'cars_vehicles', label: 'Used & Brand New Cars (Tokunbo & Nigerian Used)' }
      ]
    },
    {
      id: 'building_materials',
      label: '🏗️ Building Materials & Construction',
      subcategories: [
        { id: 'cement_iron_rods', label: 'Cement, Iron Rods, Roofing Sheets & Structural Steel' },
        { id: 'tiles_sanitary', label: 'Tiles, Marble, Granite, Toilets & Bathroom Fittings' },
        { id: 'paints_wood_doors', label: 'Paints, Plaster of Paris (POP), Doors & Timber' },
        { id: 'solar_electrical', label: 'Solar Panels, Inverters, Generators & Electrical Wiring' }
      ]
    },
    {
      id: 'foodstuffs_provisions',
      label: '🛒 Foodstuffs, Agro & Provisions Business',
      subcategories: [
        { id: 'foodstuffs_tubers', label: 'Raw Foodstuffs (Garri, Rice, Beans, Yam, Palm Oil, Spices)' },
        { id: 'provisions_supermarket', label: 'Wholesale & Retail Provisions (Beverages, Toiletries, Canned Goods)' },
        { id: 'frozen_foods', label: 'Frozen Foods (Chicken, Turkey, Fish, Cold Room Supplies)' },
        { id: 'fresh_farm_produce', label: 'Fresh Fruits, Vegetables & Agro Products' }
      ]
    },
    {
      id: 'pets_animals_business',
      label: '🐾 Pets, Animals & Livestock Business',
      subcategories: [
        { id: 'dogs_pets', label: 'Dogs, Puppies, Cats & Household Pets' },
        { id: 'livestock_poultry', label: 'Livestock & Poultry (Broilers, Layers, Turkeys, Goats, Pigs)' },
        { id: 'pet_foods_accessories', label: 'Pet Food, Cages, Aquariums & Veterinary Supplies' }
      ]
    },
    {
      id: 'schools_education',
      label: '🏫 Schools, Training Centers & Education',
      subcategories: [
        { id: 'nursery_primary_secondary', label: 'Nursery, Primary & Secondary Schools (Admissions & Info)' },
        { id: 'vocational_training_centers', label: 'Vocational Training Centers (Coding, Tailoring, Catering, Tech)' },
        { id: 'tutorials_lessons', label: 'Exam Prep Centers (WAEC, JAMB, IELTS, IJMB)' }
      ]
    },
    {
      id: 'fashion_apparel',
      label: '👕 Fashion & Wears (Old & New, Adult & Kids)',
      subcategories: [
        { id: 'mens_wear', label: "Men's Casual & Corporate Wear" },
        { id: 'womens_wear', label: "Women's Fashion, Dresses & Gowns" },
        { id: 'kids_wears', label: "Kids & Teens Clothing (All Ages)" },
        { id: 'traditional_attire', label: "Traditional & Cultural Wears (Ankara, Agbada, Senator)" },
        { id: 'footwear_bags', label: 'Shoes, Sneakers, Slides & Designer Bags' }
      ]
    },
    {
      id: 'beauty_hair',
      label: '✨ Cosmetics, Hair & Beauty Products',
      subcategories: [
        { id: 'human_hair', label: 'Human Hair, Wigs, Bundles & Closures' },
        { id: 'hair_styling', label: 'Hairdressing & Salon Services' },
        { id: 'skincare_cosmetics', label: 'Skincare, Makeup, Perfumes & Body Care' }
      ]
    },
    {
      id: 'transport_dispatch',
      label: '🏍️ Transport, Dispatch Riders & Logistics',
      subcategories: [
        { id: 'dispatch_delivery', label: 'Dispatch Riders & Same-Day Package Delivery' },
        { id: 'interstate_transit', label: 'Interstate Transport & Car Charter Services' },
        { id: 'vehicle_rental', label: 'Car Rental & Fleet Management' }
      ]
    },
    {
      id: 'mechanic_artisans',
      label: '🔧 Mechanics, Technicians & Artisans',
      subcategories: [
        { id: 'auto_mechanic', label: 'Auto Mechanics, Vulcanizers & Car Diagnostics' },
        { id: 'home_repairs', label: 'Plumbers, Electricians, AC & Fridge Repairers' },
        { id: 'builders_welding', label: 'Carpenters, Welders & Masonry Contractors' }
      ]
    },
    {
      id: 'real_estate',
      label: '🏠 Real Estate Agents & Property Rentals',
      subcategories: [
        { id: 'apartment_rentals', label: 'Residential Apartments for Rent / Lease' },
        { id: 'land_sales', label: 'Lands, Plots & Commercial Properties' },
        { id: 'shortlet_apartments', label: 'Shortlet Apartments & Event Spaces' }
      ]
    },
    {
      id: 'jobs_employment',
      label: '💼 Jobs, Vacancies & Hiring (Job Seekers & Employers)',
      subcategories: [
        { id: 'employer_hiring', label: 'Employers Looking for Workers / Staff' },
        { id: 'job_seeker', label: 'Job Seekers Looking for Employment' }
      ]
    },
    {
      id: 'tickets_events',
      label: '🎟️ Ticket Sellers & Event Passes',
      subcategories: [
        { id: 'concert_tickets', label: 'Concert, Show & Party Tickets' },
        { id: 'transport_tickets', label: 'Bus, Flight & Cinema Ticket Bookings' }
      ]
    },
    {
      id: 'general_hustles',
      label: '⚡ General Hustles & Services',
      subcategories: [
        { id: 'freelance_digital', label: 'Web Development, Graphics & Video Editing' },
        { id: 'miscellaneous_hustle', label: 'Other Verified Local Hustles & Services' }
      ]
    }
  ];

  // Load Paystack script dynamically if not present
  useEffect(() => {
    if (!document.getElementById('paystack-script')) {
      const script = document.createElement('script');
      script.id = 'paystack-script';
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Filter active items based on user search string (handles both 'title' and 'name' fields securely)
  const filteredItems = activeCatalog.filter(item => {
    const itemTitle = item.title || item.name || '';
    return itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedMerchantAsset = activeCatalog.find(item => item.id === selectedItemId) || activeCatalog[0];

  // Resolve current active asset details based on mode
  const rawAssetTitle = selectedMerchantAsset?.title || selectedMerchantAsset?.name || 'Selected Merchant Item';
  const currentAssetTitle = sellerMode === 'merchant' ? rawAssetTitle : (soloTitle.trim() || 'Solo Direct Offer');

  const currentAssetContact = sellerMode === 'solo' ? soloContact.trim() : 'Store Catalog Official';

  // Math Formulations
  const activePlacement = placementMultipliers[adPlacement];
  const totalInvestment = dailyBudget * campaignDays;
  const estimatedImpressions = dailyBudget * activePlacement.multiplier * campaignDays;
  const estimatedClicks = Math.floor(estimatedImpressions * activePlacement.conversions);

  // Paystack Payment Gate Integration
  const handleLaunchCampaign = () => {
    const computedTotal = dailyBudget * campaignDays;
    
    // Validation for Solo Seller mode
    if (sellerMode === 'solo') {
      if (!soloTitle.trim()) {
        alert('Please enter a title for your product or service offer.');
        return;
      }
      if (!soloContact.trim()) {
        alert('Please provide your direct contact number or WhatsApp link so customers can reach you.');
        return;
      }
    }

    // Check if Paystack script is loaded in window
    if (typeof window.PaystackPop === 'undefined') {
      alert('Paystack gateway is still initializing. Please check your network connection and try again.');
      return;
    }

    // Initialize Paystack Popup Transaction
    const handler = window.PaystackPop.setup({
      key: 'pk_live_0c84f6825e054064023e208a41e1f3ad34cf0f2d', 
      email: sellerMode === 'solo' && soloContact.includes('@') ? soloContact : 'merchant@bold.ng', 
      amount: computedTotal * 100, // Paystack expects amount in kobo (Naira * 100)
      currency: 'NGN',
      ref: 'PROMO-' + Math.floor(100000 + Math.random() * 900000),
      metadata: {
        custom_fields: [
          {
            display_name: "Target Asset",
            variable_name: "target_asset",
            value: currentAssetTitle
          },
          {
            display_name: "Seller Mode",
            variable_name: "seller_mode",
            value: sellerMode === 'solo' ? 'Solo Direct Seller' : 'Store Merchant'
          },
          {
            display_name: "Direct Contact",
            variable_name: "direct_contact",
            value: currentAssetContact
          },
          {
            display_name: "Ad Placement",
            variable_name: "ad_placement",
            value: activePlacement.name
          }
        ]
      },
      callback: function(response) {
        const campaignPayload = {
          id: response.reference,
          title: `Campaign Initiated for "${currentAssetTitle}"! Total billing matrix of ₦${computedTotal.toLocaleString()} verified via Paystack escrow`,
          amount: computedTotal,
          price: computedTotal,
          category: sellerMode === 'solo' ? soloCategory : 'Promotion',
          quantity: 1,
          status: 'In Escrow Vault',
          date: new Date().toISOString().split('T')[0],
          paystackRef: response.reference,
          promotionSettings: {
            targetAsset: currentAssetTitle,
            sellerMode,
            directContact: currentAssetContact,
            adPlacement: activePlacement.name,
            dailyBudget,
            campaignDays,
            specs: sellerMode === 'solo' ? itemSpecs : {}
          }
        };

        if (typeof onTriggerCheckout === 'function') {
          onTriggerCheckout(campaignPayload);
        } else if (typeof setActiveTxPayload === 'function' && typeof setCurrentPage === 'function') {
          setActiveTxPayload(campaignPayload);
          setCurrentPage('escrow-checkout');
        } else {
          alert(`Payment verified successfully! Campaign for "${currentAssetTitle}" active with reference: ${response.reference}`);
        }
      },
      onClose: function() {
        console.log('[Paystack] Payment window closed by user.');
      }
    });

    handler.openIframe();
  };

  return (
    <main className="max-w-5xl mx-auto my-6 px-4 space-y-6 animate-fadeIn text-white text-left">
      {/* HEADER PLATFORM CARD */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] bg-[#FF5A00] text-white font-black tracking-widest uppercase px-2 py-0.5 rounded">
            📈 BOLD ACCELERATION ENGINE
          </span>
          <h1 className="text-2xl font-black text-white mt-1">
            {sellerMode === 'merchant' ? 'Store Merchant Promotions Hub' : 'Solo Direct Seller Promotions'}
          </h1>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">
            {sellerMode === 'merchant' 
              ? 'Scale your official managed inventory catalog items with guaranteed escrow backing.'
              : 'Promote your independent offer and attach your direct WhatsApp or phone contact for clients.'
            }
          </p>
        </div>

        {/* SELLER MODE TOGGLE BUTTONS */}
        <div className="flex bg-[#0B132B] p-1 rounded-xl border border-slate-800 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setSellerMode('merchant')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              sellerMode === 'merchant' ? 'bg-[#FF5A00] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏪 Store Merchant
          </button>
          <button
            type="button"
            onClick={() => setSellerMode('solo')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              sellerMode === 'solo' ? 'bg-[#FF5A00] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            👤 Solo Direct Seller
          </button>
        </div>
      </div>

      {/* CONDITIONAL ASSET PICKER: ONLY SHOWN FOR MANAGED STORE MERCHANTS */}
      {sellerMode === 'merchant' && (
        <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-black tracking-tight">🎯 Step 1: Select Catalog Asset to Promote</h3>
              <p className="text-xs text-slate-400">Choose from your managed store inventory items for this marketing campaign node.</p>
            </div>
            
            <input 
              type="text"
              placeholder="Search store items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0B132B] border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 w-full sm:w-64 focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              const displayTitle = item.title || item.name || 'Unnamed Product';
              const displayPrice = Number(item.price || item.amount || 0);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-[#FF5A00]/10 border-[#FF5A00] shadow-md' 
                      : 'bg-[#0B132B] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className={`absolute top-2 right-2 text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded ${
                    item.type === 'service' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {item.type || 'product'}
                  </span>

                  <div className="pr-12">
                    <h4 className="text-xs font-bold line-clamp-2 text-slate-100">
                      {displayTitle}
                    </h4>
                    <p className="text-[#FF5A00] font-mono text-xs font-bold mt-2">
                      ₦{displayPrice.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                    <span className="capitalize text-[9px] text-slate-500">Hub: {item.category || 'General'}</span>
                    {isSelected ? (
                      <span className="text-[#FF5A00] font-black flex items-center gap-1">
                        ● Active Target
                      </span>
                    ) : (
                      <span className="text-slate-600">Select Item</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SOLO SELLER DIRECT CONTACT & FORM CONTAINER */}
      {sellerMode === 'solo' && (
        <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 animate-fadeIn">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-black tracking-tight">👤 Step 1: Define Your Direct Offer, Specs & Contact</h3>
            <p className="text-xs text-slate-400">List your products, tech specs (RAM/Storage), services, rentals, jobs or hustles with full customer transparency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Product or Service Title</label>
              <input 
                type="text"
                placeholder="e.g., HP EliteBook Core i5 16GB/512GB or Same-Day Dispatch"
                value={soloTitle}
                onChange={(e) => setSoloTitle(e.target.value)}
                className="w-full bg-[#0B132B] border border-slate-800 text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF5A00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Direct Contact (WhatsApp / Phone)</label>
              <input 
                type="text"
                placeholder="e.g., +234 801 234 5678 or wa.me/234..."
                value={soloContact}
                onChange={(e) => setSoloContact(e.target.value)}
                className="w-full bg-[#0B132B] border border-slate-800 text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF5A00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Estimated Price / Salary (₦)</label>
              <input 
                type="number"
                value={soloPrice}
                onChange={(e) => setSoloPrice(Number(e.target.value))}
                className="w-full bg-[#0B132B] border border-slate-800 text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF5A00]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Category Hub</label>
              <select 
                value={soloCategory}
                onChange={(e) => setSoloCategory(e.target.value)}
                className="w-full bg-[#0B132B] border border-slate-800 text-white text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[#FF5A00]"
              >
                {marketplaceCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 & DETAILS DISPLAY MATRIX CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: CONTROLS */}
        <div className="lg:col-span-7 bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-black tracking-tight border-b border-slate-800 pb-3">
            ⚙️ Step 2: Campaign Parameter Configuration
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-slate-300 uppercase tracking-wide text-[10px]">Daily Capital Allocation</label>
              <span className="text-[#FF5A00] font-mono text-sm">₦{dailyBudget.toLocaleString()} / day</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="50000" 
              step="1000"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(Number(e.target.value))}
              className="w-full accent-[#FF5A00] bg-[#0B132B] h-2 rounded-lg cursor-pointer appearance-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-slate-300 uppercase tracking-wide text-[10px]">Campaign Timeline Run</label>
              <span className="text-[#FF5A00] font-mono text-sm">{campaignDays} Days</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              step="1"
              value={campaignDays}
              onChange={(e) => setCampaignDays(Number(e.target.value))}
              className="w-full accent-[#FF5A00] bg-[#0B132B] h-2 rounded-lg cursor-pointer appearance-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">
              Premium Placement Optimization Node
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div 
                onClick={() => setAdPlacement('sidebar')}
                className={`p-4 rounded-xl border text-center cursor-pointer transition select-none ${
                  adPlacement === 'sidebar' ? 'bg-[#FF5A00]/10 border-[#FF5A00]' : 'bg-[#0B132B] border-slate-800'
                }`}
              >
                <p className="text-base">📋</p>
                <p className="text-[11px] font-black uppercase mt-1">Sidebar Feed</p>
              </div>

              <div 
                onClick={() => setAdPlacement('trending')}
                className={`p-4 rounded-xl border text-center cursor-pointer transition select-none ${
                  adPlacement === 'trending' ? 'bg-[#FF5A00]/10 border-[#FF5A00]' : 'bg-[#0B132B] border-slate-800'
                }`}
              >
                <p className="text-base">🔥</p>
                <p className="text-[11px] font-black uppercase mt-1">Trending Ribbon</p>
              </div>

              <div 
                onClick={() => setAdPlacement('broadcast')}
                className={`p-4 rounded-xl border text-center cursor-pointer transition select-none ${
                  adPlacement === 'broadcast' ? 'bg-[#FF5A00]/10 border-[#FF5A00]' : 'bg-[#0B132B] border-slate-800'
                }`}
              >
                <p className="text-base">⚡</p>
                <p className="text-[11px] font-black uppercase mt-1">Direct Push</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: METRICS & LAUNCH BUTTON */}
        <div className="lg:col-span-5 bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-black tracking-tight border-b border-slate-800 pb-3">
              📊 Predictive Yield Metrics
            </h3>
            
            <div className="mt-4 space-y-4">
              <div className="bg-[#0B132B] p-3 rounded-xl border border-dashed border-slate-800">
                <span className="text-[9px] text-slate-400 font-black uppercase block mb-1">
                  {sellerMode === 'solo' ? 'Solo Offer Target' : 'Store Catalog Target'}
                </span>
                <span className="text-xs font-bold text-white line-clamp-1">{currentAssetTitle}</span>
                {sellerMode === 'solo' && soloContact && (
                  <span className="text-[10px] text-[#FF5A00] block mt-1 font-semibold">📞 Direct Contact: {soloContact}</span>
                )}
              </div>

              <div className="bg-[#0B132B] p-3.5 rounded-xl border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase block">Estimated Views</span>
                  <span className="text-xs font-semibold text-slate-300 font-mono">{activePlacement.name}</span>
                </div>
                <span className="text-xl font-black text-white font-mono">{estimatedImpressions.toLocaleString()}+</span>
              </div>

              <div className="bg-[#0B132B] p-3.5 rounded-xl border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase block">Estimated Clicks / Leads</span>
                  <span className="text-xs font-semibold text-slate-300 font-mono">Conversion Rate ({(activePlacement.conversions * 100)}%)</span>
                </div>
                <span className="text-xl font-black text-emerald-400 font-mono">{estimatedClicks.toLocaleString()}+</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block">Total Investment</span>
                <span className="text-[10px] text-slate-500">{campaignDays} days @ ₦{dailyBudget.toLocaleString()}/day</span>
              </div>
              <span className="text-2xl font-black text-[#FF5A00] font-mono">₦{totalInvestment.toLocaleString()}</span>
            </div>

            <button
              type="button"
              onClick={handleLaunchCampaign}
              className="w-full py-4 bg-[#FF5A00] hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/30 transition cursor-pointer uppercase text-xs tracking-wider font-mono flex items-center justify-center gap-2"
            >
              <span>🚀 Launch Campaign via Paystack</span>
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}