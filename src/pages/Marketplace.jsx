import React, { useState } from 'react';

// Comprehensive Category Metadata Mapping for bold.ng (Expanded & Sanitized)
const CATEGORY_MAP = {
  all: { label: '🌟 All Marketplace Listings', icon: '✨' },
  automobiles: { 
    label: '🚗 Mobile & Vehicles', 
    icon: '🚗', 
    subcategories: [
      'Cars (Foreign & Nigerian Used)', 
      'Brand New Vehicles', 
      'Buses & Commercial Trucks', 
      'Auto Spare Parts & Accessories', 
      'Vehicle Rentals & Haulage Services'
    ] 
  },
  bikes_motorcycles: { 
    label: '🏍️ Bikes & Tricycles', 
    icon: '🏍️', 
    subcategories: [
      'Motorcycles & Okada', 
      'Tricycles (Keke Napep / Passenger & Cargo)', 
      'Bicycles & Electric Scooters', 
      'Bike & Keke Spare Parts'
    ] 
  },
  phones_gadgets: { 
    label: '📱 Phones & Laptops', 
    icon: '📱', 
    subcategories: [
      'Smartphones & Mobile Phones (iPhone, Samsung, Tecno, Infinix)', 
      'Windows Laptops & Notebooks (HP, Dell, Lenovo)', 
      'Apple MacBooks (Air / Pro)', 
      'Tablets, iPads & E-Readers', 
      'Gaming Consoles, Smartwatches & Tech Accessories'
    ] 
  },
  gift_cards: { 
    label: '💳 Gift Cards & Vouchers', 
    icon: '💳', 
    subcategories: [
      'Apple / iTunes Gift Cards', 
      'Google Play Gift Cards', 
      'Steam, Amazon & Razer Gold Cards', 
      'Verified Crypto Vouchers & Digital Currency'
    ] 
  },
  building_materials: { 
    label: '🏗️ Building Materials', 
    icon: '🏗️', 
    subcategories: [
      'Cement, Iron Rods & Structural Steel', 
      'Roofing Sheets, Wood & Timber', 
      'Tiles, Marble, Granite & Sanitary Wares', 
      'Paints, Plaster of Paris (POP) & Doors', 
      'Solar Panels, Inverters & Electrical Wiring'
    ] 
  },
  motor_parts: { 
    label: '⚙️ Motor Parts & Accessories', 
    icon: '⚙️', 
    subcategories: [
      'Car Engines, Gearboxes & Mechanical Parts', 
      'Brake Pads, Shock Absorbers & Suspension', 
      'Tyres, Rims & Wheel Alignment', 
      'Car Batteries, Headlights & Electricals', 
      'Body Parts (Bumpers, Doors, Mirrors)'
    ] 
  },
  fashion: { 
    label: '👕 Fashion & Wearables', 
    icon: '👕', 
    subcategories: [
      "Men's Wear (Casual, Corporate & Traditional)", 
      "Women's Wear (Dresses, Corporate & Ankara)", 
      "Kids & Babies Wear (All Ages)", 
      "Plus Size & Large Fit Apparel", 
      "Vintage & Thrift (Okirika / Old School Wear)", 
      'Footwear & Shoes (Adults & Kids)', 
      'Jewelry, Wristwatches & Bags', 
      'Tailoring, Fabrics & Custom Native Designs'
    ] 
  },
  homeappliances: { 
    label: '🏠 Home & Kitchen', 
    icon: '🏠', 
    subcategories: [
      'Refrigerators, Freezers & Coolers', 
      'Cookers, Ovens & Gas Burners', 
      'Kitchen Utensils, Pots & Cutlery', 
      'Blenders, Microwaves & Food Processors', 
      'Washing Machines & Ironing', 
      'Air Conditioners, Fans & Ventilation', 
      'Generators, Inverters & Solar Power Systems'
    ] 
  },
  babywears: { 
    label: '🍼 Baby Essentials', 
    icon: '🍼', 
    subcategories: [
      'Newborn Clothing & Gift Sets', 
      'Baby Diapers & Wipes', 
      'Baby Food, Formula & Feeding Bottles', 
      'Strollers, Car Seats & Carriers', 
      'Baby Bathing & Skin Care'
    ] 
  },
  foodstuffs: { 
    label: '🌾 Food Stuffs & Agro', 
    icon: '🌾', 
    subcategories: [
      'Grains (Rice, Beans, Maize, Millet)', 
      'Tubers (Yam, Garri, Cassava Flour)', 
      'Oils (Red Palm Oil, Vegetable Oil)', 
      'Spices, Condiments & Seasonings', 
      'Livestock, Meat & Frozen Foods', 
      'Fresh Fruits & Vegetables'
    ] 
  },
  provisions_supermarket: { 
    label: '🛒 Provisions & Supermarket', 
    icon: '🛒', 
    subcategories: [
      'Beverages, Milk, Tea & Coffee', 
      'Toiletries, Soaps & Personal Care', 
      'Canned Foods, Pasta & Noodles', 
      'Baby Foods, Cereals & Snacks', 
      'Household Cleaning & Detergents'
    ] 
  },
  pets_animals_business: { 
    label: '🐾 Pets & Livestock', 
    icon: '🐾', 
    subcategories: [
      'Dogs, Puppies & Household Pets', 
      'Poultry Livestock (Broilers, Layers, Day-Old Chicks)', 
      'Livestock (Goats, Sheep, Pigs, Cattle)', 
      'Pet Food, Cages, Aquariums & Veterinary Supplies'
    ] 
  },
  schools_education: { 
    label: '🏫 Schools & Education', 
    icon: '🏫', 
    subcategories: [
      'Nursery, Primary & Secondary School Admissions', 
      'Vocational & Tech Training Centers (Coding, Tailoring)', 
      'Exam Prep & Tutorial Centers (WAEC, JAMB, IELTS)', 
      'Professional Certification Academies'
    ] 
  },
  realestate: { 
    label: '🏢 Real Estate & Properties', 
    icon: '🏢', 
    subcategories: [
      'Residential Apartments for Rent', 
      'Houses & Lands for Sale', 
      'Commercial Shops & Office Spaces', 
      'Shortlet Apartments', 
      'Warehouses & Industrial Land'
    ] 
  },
  craftwork: { 
    label: '🛠️ Craft Workers & Artisans', 
    icon: '🛠️', 
    subcategories: [
      'Mechanics & Auto Technicians', 
      'Carpenters & Woodworkers', 
      'Painters & Interior Decorators', 
      'Plumbers & Pipe Fitters', 
      'Electricians & Solar Installers', 
      'Builders, Masons & Tilers', 
      'Welding & Iron Fabrication'
    ] 
  },
  pharmacy: { 
    label: '💊 Pharmacy & Health', 
    icon: '💊', 
    subcategories: [
      'Prescription & Over-the-Counter Drugs', 
      'Vitamins, Supplements & Herbs', 
      'First Aid & Medical Consumables', 
      'Medical Devices & Monitors (BP, Glucometer)', 
      'Personal Care & Hygiene'
    ] 
  },
  books: { 
    label: '📚 Book Sellers & eBooks', 
    icon: '📚', 
    subcategories: [
      'Academic Textbooks & Exam Prep (WAEC, JAMB)', 
      'Business, Finance & Entrepreneurship', 
      'Novels, Fiction & Literature', 
      'Religious & Motivational Books', 
      'Tech, Coding & Digital Guides (eBooks)'
    ] 
  },
  tutors: { 
    label: '🎓 Tutors & Learning', 
    icon: '🎓', 
    subcategories: [
      'Programming & Tech Instructors', 
      'Academic Tutors (Math, Sciences, Arts)', 
      'Language Lessons (English, French, Local Languages)', 
      'Professional Skills & Digital Marketing', 
      'Music & Instrumental Trainers'
    ] 
  },
  jobshub: { 
    label: '💼 Jobs Hub & Vacancies', 
    icon: '💼', 
    subcategories: [
      'Job Vacancies (Employer Postings)', 
      'Job Seekers Profiles & Qualifications', 
      'Contract & Freelance Gigs', 
      'Internships & Apprenticeship Openings'
    ] 
  },
  services: { 
    label: '⚙️ General Services', 
    icon: '⚙️', 
    subcategories: [
      'Dispatch Riders & Same-Day Package Delivery',
      'Interstate Logistics & Haulage',
      'Event Planning, DJ & Ushering Services', 
      'Catering & Outdoor Cooking', 
      'Printing, Branding & Signage', 
      'Cleaning & Fumigation Services', 
      'Legal, Accounting & Business Registration'
    ] 
  }
};

export default function Marketplace({ 
  items = [], 
  onTriggerCheckout, 
  onAddToCart, 
  cartItems = [], 
  onViewCart 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  
  // State for Product Details Modal
  const [activeProductModal, setActiveProductModal] = useState(null);
  
  // State for Image Zoom / Lightbox Modal
  const [zoomedImage, setZoomedImage] = useState(null);

  // Handle Category Switching (resets subcategory filter)
  const handleCategorySelect = (catKey) => {
    setSelectedCategory(catKey);
    setSelectedSubcategory('all');
  };

  // Filter items by Main Category, Subcategory, and Search Keywords
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || item.subcategory === selectedSubcategory;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      item.title?.toLowerCase().includes(searchLower) ||
      item.meta?.toLowerCase().includes(searchLower) ||
      item.location?.toLowerCase().includes(searchLower) ||
      item.subcategory?.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  // Calculate live cart totals
  const totalCartCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  const totalCartPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const activeSubcategories = CATEGORY_MAP[selectedCategory]?.subcategories || [];

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-4 space-y-6 pb-32 font-sans text-left text-white">
      
      {/* HEADER & SEARCH CONTROL BAR */}
      <div className="bg-[#16223F] p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/10 px-3 py-1 rounded-full border border-[#FF5A00]/20">
              Bold Dot NG Multi-Vendor Hub
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5">
              Explore Products, Artisans, Properties & Jobs
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-1/2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search products, mechanics, real estate, tutors, jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B132B] text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700/85 focus:outline-none focus:border-[#FF5A00] text-sm placeholder:text-slate-500 transition-all font-medium"
            />
          </div>
        </div>

        {/* Main Categories Horizontal Scroll Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
          {Object.entries(CATEGORY_MAP).map(([key, data]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleCategorySelect(key)}
              className={`text-xs font-bold px-4 py-3 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                selectedCategory === key
                  ? 'bg-[#FF5A00] text-white shadow-[0_0_15px_rgba(255,90,0,0.4)] border border-[#FF5A00]'
                  : 'bg-[#0B132B] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{data.icon}</span>
              <span>{data.label.replace(/^[^\w\s]+/, '').trim()}</span>
            </button>
          ))}
        </div>

        {/* Subcategories Secondary Filter Pill Bar */}
        {activeSubcategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-3">
            <span className="text-[10px] font-black uppercase text-[#FF5A00] tracking-wider shrink-0 mr-1">
              Filter Subcategory:
            </span>
            <button
              type="button"
              onClick={() => setSelectedSubcategory('all')}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedSubcategory === 'all'
                  ? 'bg-slate-200 text-slate-950 font-black'
                  : 'bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All {CATEGORY_MAP[selectedCategory]?.label.replace(/^[^\w\s]+/, '').trim()}
            </button>
            {activeSubcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubcategory(sub)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedSubcategory === sub
                    ? 'bg-slate-200 text-slate-950 font-black'
                    : 'bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* LISTINGS GRID SECTION */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-24 bg-[#16223F] rounded-3xl border border-slate-800 shadow-inner px-4">
          <div className="text-5xl mb-3">📭</div>
          <h3 className="text-white font-bold text-lg">No Listings Found</h3>
          <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto">
            We couldn't find any active listings matching your filters or search keywords in this category. Try switching subcategories or search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredItems.map((product) => {
            const placement = product.promotionSettings?.adPlacement;
            const originalPrice = product.oldPrice || (product.price ? product.price * 1.15 : null);
            const isJobOrService = product.category === 'jobshub' || product.category === 'tutors' || product.category === 'craftwork';

            return (
              <div
                key={product.id || product.docId}
                onClick={() => setActiveProductModal(product)}
                className="bg-[#16223F] rounded-2xl border border-slate-800/80 hover:border-[#FF5A00]/65 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden cursor-pointer"
              >
                {/* Image / Banner Header */}
                <div className="relative w-full aspect-square bg-[#0B132B] overflow-hidden rounded-t-2xl">
                  
                  {/* Promotion Badge */}
                  {placement && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-[#FF5A00] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider shadow">
                        {placement}
                      </span>
                    </div>
                  )}

                  {/* Location Tag */}
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-[#0B132B]/80 backdrop-blur-md border border-slate-700 text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded-md">
                      📍 {product.location || 'Nigeria'}
                    </span>
                  </div>

                  {product.img && product.img.startsWith('http') ? (
                    <img
                      src={product.img}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  {/* Fallback Icon */}
                  <div className={`w-full h-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 ${product.img && product.img.startsWith('http') ? 'hidden' : 'flex'}`}>
                    {CATEGORY_MAP[product.category]?.icon || '📦'}
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-[#FF5A00] uppercase tracking-wider line-clamp-1 bg-[#FF5A00]/10 px-2 py-0.5 rounded border border-[#FF5A00]/20">
                        {product.subcategory || product.category || 'General'}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-white mt-1.5 line-clamp-2 leading-snug group-hover:text-[#FF5A00] transition-colors min-h-[2.5rem]">
                      {product.title}
                    </h3>

                    {product.meta && (
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {product.meta}
                      </p>
                    )}
                  </div>

                  {/* Pricing & Actions */}
                  <div className="pt-2 border-t border-slate-800/60" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-base sm:text-lg font-black text-white font-mono tracking-tight">
                        ₦{Number(product.price).toLocaleString()}
                      </span>
                      {originalPrice && !isJobOrService && (
                        <span className="text-[10px] text-slate-500 line-through font-mono">
                          ₦{Math.round(originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-4 gap-1.5 mt-3">
                      <button
                        type="button"
                        title="Add to Basket"
                        onClick={() => onAddToCart(product)}
                        className="col-span-1 bg-[#0B132B] hover:bg-slate-800 text-white text-sm font-bold py-2 rounded-xl border border-slate-700/80 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                      >
                        🛒
                      </button>
                      <button
                        type="button"
                        onClick={() => onTriggerCheckout(product)}
                        className="col-span-3 bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-bold py-2 rounded-xl border-none transition-all cursor-pointer shadow-[0_2px_10px_rgba(255,90,0,0.25)] active:scale-95 tracking-wide"
                      >
                        {isJobOrService ? 'Apply / Book' : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PRODUCT DETAILS INSPECTION & DEEP READ MODAL */}
      {activeProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#16223F] border border-slate-700 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
            
            {/* Modal Header Bar */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-[#0B132B]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A00] animate-pulse"></span>
                <span className="text-xs font-mono font-bold text-[#FF5A00] uppercase tracking-wider">
                  Listing Deep Inspection View
                </span>
              </div>
              <button
                onClick={() => setActiveProductModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center text-sm font-bold cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Zoomable Image Viewer Section */}
              <div className="space-y-2">
                <div className="relative w-full h-72 sm:h-96 bg-[#0B132B] rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center group shadow-inner">
                  {activeProductModal.img && activeProductModal.img.startsWith('http') ? (
                    <>
                      <img 
                        src={activeProductModal.img} 
                        alt={activeProductModal.title} 
                        className="w-full h-full object-contain cursor-zoom-in"
                        onClick={() => setZoomedImage(activeProductModal.img)}
                      />
                      <button 
                        type="button"
                        onClick={() => setZoomedImage(activeProductModal.img)}
                        className="absolute bottom-3 right-3 bg-slate-950/80 hover:bg-[#FF5A00] text-white text-xs font-bold px-3 py-2 rounded-xl backdrop-blur-md border border-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-lg"
                      >
                        <span>🔍</span>
                        <span>Click to Zoom Image</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-7xl">{CATEGORY_MAP[activeProductModal.category]?.icon || '📦'}</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 text-center italic">
                  Tip: Click on the product image to inspect high-resolution details in full screen.
                </p>
              </div>

              {/* Product Header Information */}
              <div className="space-y-3 bg-[#0B132B] p-5 rounded-2xl border border-slate-800">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <span className="text-[10px] font-black text-[#FF5A00] uppercase tracking-widest bg-[#FF5A00]/10 px-3 py-1 rounded-full border border-[#FF5A00]/20">
                    {activeProductModal.subcategory || activeProductModal.category}
                  </span>
                  <span className="text-xs text-slate-300 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                    📍 Location: {activeProductModal.location || 'Nigeria'}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {activeProductModal.title}
                </h2>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-[#FF5A00]">
                    ₦{Number(activeProductModal.price).toLocaleString()}
                  </span>
                  {activeProductModal.oldPrice && (
                    <span className="text-sm text-slate-500 line-through font-mono">
                      ₦{Number(activeProductModal.oldPrice).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Comprehensive Description & Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#FF5A00] font-mono flex items-center gap-2">
                  <span>📝</span> Full Product & Vendor Details
                </h4>
                <div className="bg-[#0B132B] p-5 rounded-2xl border border-slate-800 text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-wrap font-medium">
                  {activeProductModal.description || activeProductModal.meta || 'No detailed written description was provided by the vendor for this listing.'}
                </div>
              </div>

              {/* Verified Trust Note */}
              <div className="bg-[#FF5A00]/5 border border-[#FF5A00]/20 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-lg">🛡️</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white font-bold">Bold.ng Buyer Protection:</strong> Always examine item specifications and photos carefully. Never make offline payments outside the official bold.ng escrow checkout system.
                </p>
              </div>

            </div>

            {/* Modal Footer Action Bar */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-[#0B132B] flex gap-3">
              <button
                onClick={() => {
                  onAddToCart(activeProductModal);
                  setActiveProductModal(null);
                }}
                className="flex-1 bg-[#0B132B] hover:bg-slate-800 text-white border border-slate-700 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🛒</span> Add to Basket
              </button>
              <button
                onClick={() => {
                  onTriggerCheckout(activeProductModal);
                  setActiveProductModal(null);
                }}
                className="flex-1 bg-[#FF5A00] hover:bg-[#e04f00] text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg shadow-[#FF5A00]/30 cursor-pointer"
              >
                {activeProductModal.category === 'jobshub' || activeProductModal.category === 'tutors' || activeProductModal.category === 'craftwork' ? 'Apply / Book Now' : 'Buy Now Securely'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FULL-SCREEN IMAGE ZOOM / LIGHTBOX MODAL */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 animate-in fade-in">
          <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center">
            
            {/* Close Zoom Button */}
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 bg-slate-800/80 hover:bg-[#FF5A00] text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border border-slate-700 transition cursor-pointer shadow-2xl z-10"
            >
              ✕
            </button>

            {/* Zoomed Image Container */}
            <div className="w-full h-full flex items-center justify-center p-2">
              <img
                src={zoomedImage}
                alt="Zoomed Inspection View"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-800 shadow-2xl"
              />
            </div>

            <p className="text-xs text-slate-400 mt-3 font-medium bg-[#16223F] px-4 py-2 rounded-xl border border-slate-800">
              🔍 Full-Screen Inspection Mode — Press Esc or click X to return.
            </p>
          </div>
        </div>
      )}

      {/* FLOATING CART BAR */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl bg-[#16223F]/95 backdrop-blur-xl border border-[#FF5A00]/50 p-3.5 sm:p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-40 flex items-center justify-between gap-4 transition-all animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="w-10 h-10 rounded-xl bg-[#FF5A00] text-white font-black flex items-center justify-center text-sm shadow-md">
                🛒
              </span>
              <span className="absolute -top-1.5 -right-1.5 bg-white text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#16223F]">
                {totalCartCount}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Cart Total ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})
              </p>
              <p className="text-base sm:text-lg font-black text-white font-mono leading-tight">
                ₦{totalCartPrice.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onViewCart}
            className="bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-lg shadow-[#FF5A00]/30 cursor-pointer border-none flex items-center gap-2 active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}