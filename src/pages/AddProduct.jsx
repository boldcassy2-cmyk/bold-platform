import React, { useState, useEffect } from 'react';

export default function Promotions({ uploadedItems = [], onTriggerCheckout, setCurrentPage, setActiveTxPayload }) {
  // Seller Mode State: 'merchant' (catalog items) vs 'solo' (direct contact / custom items)
  const [sellerMode, setSellerMode] = useState('merchant');

  // Expanded Solo Seller Custom Asset Fields with granular metadata
  const [soloTitle, setSoloTitle] = useState('');
  const [soloPrice, setSoloPrice] = useState(15000);
  const [soloCategory, setSoloCategory] = useState('electronics_laptops');
  const [soloSubCategory, setSoloSubCategory] = useState('');
  const [soloContact, setSoloContact] = useState(''); // Direct phone or WhatsApp contact
  
  // Detailed attributes for custom assets (e.g., Laptops, Fashion, Real Estate, Services)
  const [itemSpecs, setItemSpecs] = useState({
    modelSize: '',
    ramMemory: '',
    storageCapacity: '',
    condition: 'Brand New', // Brand New, Foreign Used (Tokunbo), Nigerian Used
    location: '',
    experienceLevel: '', // For jobs / tutors
    serviceType: ''
  });

  // Comprehensive fallback catalog with rich categories & subcategories
  const defaultItemsList = uploadedItems.length > 0 ? uploadedItems : [
    { 
      id: 'p1', 
      title: 'HP EliteBook 840 G6 - Core i7, 16GB RAM, 512GB SSD', 
      type: 'product', 
      price: 450000, 
      category: 'electronics_laptops',
      specs: { modelSize: '14-inch', ramMemory: '16GB', storageCapacity: '512GB SSD', condition: 'Foreign Used (Tokunbo)' }
    },
    { 
      id: 'p2', 
      title: 'Professional Home & Office Plumbing & Mechanical Repairs', 
      type: 'service', 
      price: 25000, 
      category: 'mechanic_artisans',
      specs: { serviceType: 'Emergency Repair & Installation', location: 'Lagos Mainland' }
    },
    { 
      id: 'p3', 
      title: 'Same-Day Interstate Dispatch & Logistics Delivery', 
      type: 'service', 
      price: 5000, 
      category: 'transport_dispatch',
      specs: { serviceType: 'Express Package Delivery' }
    },
    { 
      id: 'p4', 
      title: 'Unisex Vintage Oversized Streetwear Hoodie (Adult & Teens)', 
      type: 'product', 
      price: 18000, 
      category: 'fashion_apparel',
      specs: { modelSize: 'L / XL / XXL', condition: 'Brand New' }
    },
    { 
      id: 'p5', 
      title: 'Verified 3-Bedroom Luxury Apartment Lease in Lekki Phase 1', 
      type: 'real_estate', 
      price: 3500000, 
      category: 'real_estate',
      specs: { location: 'Lekki Phase 1, Lagos' }
    }
  ];

  // Asset Management States
  const [selectedItemId, setSelectedItemId] = useState(defaultItemsList[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  // Budget Matrix States
  const [dailyBudget, setDailyBudget] = useState(5000); 
  const [campaignDays, setCampaignDays] = useState(7);    
  const [adPlacement, setAdPlacement] = useState('trending'); 
  
  // Real-time Traffic Multiplier Matrix
  const placementMultipliers = {
    sidebar: { name: 'Contextual Sidebar Placement', multiplier: 12, conversions: 0.02 },
    trending: { name: 'Main Marketplace Trending Ribbon', multiplier: 25, conversions: 0.05 },
    broadcast: { name: 'Direct Push Notification Broadcast', multiplier: 45, conversions: 0.08 }
  };

  // Comprehensive Professional Categories and Subcategories Master List
  const marketplaceCategories = [
    {
      id: 'electronics_laptops',
      label: '💻 Electronics, Laptops & Gadgets',
      subcategories: [
        { id: 'laptops_windows', label: 'Windows Laptops (HP, Dell, Lenovo, Asus)' },
        { id: 'laptops_macbook', label: 'Apple MacBooks (Air / Pro)' },
        { id: 'phones_tablets', label: 'Smartphones & Tablets (iPhone, Samsung, etc.)' },
        { id: 'gadgets_accessories', label: 'Gaming Consoles, Audio, Chargers & Accessories' }
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
      id: 'education_books',
      label: '📚 Digital Books, Physical Books & Tutors',
      subcategories: [
        { id: 'digital_books', label: 'E-Books, Online Courses & PDF Guides' },
        { id: 'physical_books', label: 'Textbooks, Novels & Educational Materials' },
        { id: 'online_offline_tutors', label: 'Private Tutors (Home Lessons & Online Coaching)' }
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

  // Filter items based on user search string
  const filteredItems = defaultItemsList.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMerchantAsset = defaultItemsList.find(item => item.id === selectedItemId) || defaultItemsList[0];

  // Resolve current active asset details based on mode
  const currentAssetTitle = sellerMode === 'merchant' 
    ? (selectedMerchantAsset ? selectedMerchantAsset.title : 'Selected Merchant Item')
    : (soloTitle.trim() || 'Solo Direct Offer');

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
        // Payment successful callback handler
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

        console.log(`[Paystack Success] Reference: ${response.reference}`);

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
                      {item.title}
                    </h4>
                    <p className="text-[#FF5A00] font-mono text-xs font-bold mt-2">
                      ₦{Number(item.price).toLocaleString()}
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

      {/* SOLO SELLER DIRECT CONTACT & GRANULAR OFFER FORM: ONLY SHOWN FOR SOLO SELLERS */}
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

          {/* DYNAMIC SUB-CATEGORY SELECTOR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/60">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Subcategory</label>
              <select
                value={soloSubCategory}
                onChange={(e) => setSoloSubCategory(e.target.value)}
                className="w-full bg-[#0B132B] border border-slate-800 text-white text-xs rounded-xl px-3 py-3 focus:outline-none focus:border-[#FF5A00]"
              >
                <option value="">Select Subcategory...</option>
                {marketplaceCategories
                  .find(c => c.id === soloCategory)
                  ?.subcategories.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.label}</option>
                  ))
                }
              </select>
            </div>

            {/* CONDITIONAL SPEC BUILDERS FOR LAPTOPS & TECH */}
            {soloCategory === 'electronics_laptops' && (
              <>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">RAM Memory Size</label>
                  <select 
                    value={itemSpecs.ramMemory}
                    onChange={(e) => setItemSpecs({...itemSpecs, ramMemory: e.target.value})}
                    className="w-full bg-[#0B132B] border border-slate-800 text-white text-xs rounded-xl px-3 py-3 focus:outline-none focus:border-[#FF5A00]"
                  >
                    <option value="">Select RAM...</option>
                    <option value="4GB RAM">4GB RAM</option>
                    <option value="8GB RAM">8GB RAM</option>
                    <option value="16GB RAM">16GB RAM</option>
                    <option value="32GB+ RAM">32GB+ RAM</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Storage Capacity</label>
                  <select 
                    value={itemSpecs.storageCapacity}
                    onChange={(e) => setItemSpecs({...itemSpecs, storageCapacity: e.target.value})}
                    className="w-full bg-[#0B132B] border border-slate-800 text-white text-xs rounded-xl px-3 py-3 focus:outline-none focus:border-[#FF5A00]"
                  >
                    <option value="">Select Storage...</option>
                    <option value="128GB SSD">128GB SSD</option>
                    <option value="256GB SSD">256GB SSD</option>
                    <option value="512GB SSD">512GB SSD</option>
                    <option value="1TB+ SSD / HDD">1TB+ SSD / HDD</option>
                  </select>
                </div>
              </>
            )}

            {/* CONDITIONAL CONDITION FIELD FOR PHYSICAL ITEMS & FASHION */}
            {(soloCategory === 'fashion_apparel' || soloCategory === 'beauty_hair' || soloCategory === 'electronics_laptops') && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Item Condition & Size Info</label>
                <input 
                  type="text"
                  placeholder="e.g., Brand New / Tokunbo / Sizes S, M, L, XL"
                  value={itemSpecs.modelSize}
                  onChange={(e) => setItemSpecs({...itemSpecs, modelSize: e.target.value})}
                  className="w-full bg-[#0B132B] border border-slate-800 text-white text-xs rounded-xl px-3 py-3 focus:outline-none focus:border-[#FF5A00]"
                />
              </div>
            )}

            {/* CONDITIONAL LOCATION FIELD FOR REAL ESTATE / MECHANICS / DISPATCH */}
            {(soloCategory === 'real_estate' || soloCategory === 'mechanic_artisans' || soloCategory === 'transport_dispatch') && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">Service Location / Base</label>
                <input 
                  type="text"
                  placeholder="e.g., Ikeja, Lekki, Abuja, Port Harcourt"
                  value={itemSpecs.location}
                  onChange={(e) => setItemSpecs({...itemSpecs, location: e.target.value})}
                  className="w-full bg-[#0B132B] border border-slate-800 text-white text-xs rounded-xl px-3 py-3 focus:outline-none focus:border-[#FF5A00]"
                />
              </div>
            )}
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
                {sellerMode === 'solo' && (itemSpecs.ramMemory || itemSpecs.modelSize || itemSpecs.location) && (
                  <span className="text-[9px] text-slate-400 block mt-1">
                    Specs: {[itemSpecs.ramMemory, itemSpecs.storageCapacity, itemSpecs.modelSize, itemSpecs.location].filter(Boolean).join(' | ')}
                  </span>
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
                  <span className="text-[9px] text-slate-400 font-black uppercase block">Target Clicks</span>
                  <span className="text-xs font-semibold text-slate-300 font-mono">Conversion index</span>
                </div>
                <span className="text-xl font-black text-emerald-400 font-mono">≈ {estimatedClicks.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Investment:</span>
              <span className="text-2xl font-black text-[#FF5A00] font-mono">₦{totalInvestment.toLocaleString()}</span>
            </div>
            
            <button 
              type="button"
              onClick={handleLaunchCampaign}
              className="w-full bg-[#FF5A00] hover:brightness-110 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl border-none shadow-lg cursor-pointer transition duration-200"
            >
              🚀 Pay & Launch Campaign (Paystack)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}