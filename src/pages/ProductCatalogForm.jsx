import React, { useState, useEffect, useCallback } from 'react';

// --- AMAZON-INSPIRED MERCHANT CATEGORIES (A TO Z) ---
const AMAZON_MERCHANT_CATEGORIES = {
  appliances: {
    label: '⚡ Appliances & Major Home Electronics',
    subcategories: [
      'Refrigerators & Freezers', 'Washing Machines & Dryers', 'Air Conditioners & Coolers', 
      'Microwaves, Ovens & Cookers', 'Water Dispensers & Purifiers', 'Vacuum Cleaners & Floor Care'
    ],
    specFields: [
      { id: 'brand', label: 'Brand', type: 'text', placeholder: 'e.g., LG, Samsung, Haier Thermocool' },
      { id: 'powerRating', label: 'Power Rating / Voltage', type: 'text', placeholder: 'e.g., 1.5 HP, 220V' },
      { id: 'condition', label: 'Condition', type: 'select', options: ['Brand New (Boxed)', 'Certified Factory Refurbished'] }
    ]
  },
  automotive_industrial: {
    label: '🚗 Automotive, Industrial & Scientific',
    subcategories: [
      'Car & Truck Parts', 'Motorcycle & Powersports', 'Tools & Garage Equipment', 
      'Industrial Power Supplies & Generators', 'Safety & Protective Gear', 'Lab & Scientific Equipment'
    ],
    specFields: [
      { id: 'partNumber', label: 'Manufacturer Part Number / SKU', type: 'text', placeholder: 'e.g., SKU-AUT-992' },
      { id: 'compatibility', label: 'Compatibility / Model', type: 'text', placeholder: 'e.g., Universal or Specific Make' }
    ]
  },
  baby_kids: {
    label: '👶 Baby Products & Kids Items',
    subcategories: [
      'Baby Care & Diapering', 'Strollers, Prams & Car Seats', 'Nursery Furniture & Bedding', 
      'Baby Feeding & Formula', 'Kids Toys & Educational Games', 'Baby & Children Clothing'
    ],
    specFields: [
      { id: 'ageGroup', label: 'Target Age Group', type: 'select', options: ['Newborn (0-12 months)', 'Toddler (1-3 years)', 'Kids (4-8 years)', 'Older Kids (9-14 years)'] },
      { id: 'materialSafety', label: 'Material Certification', type: 'text', placeholder: 'e.g., BPA-Free, Organic Cotton' }
    ]
  },
  books_stationery: {
    label: '📚 Books, Office & Stationery Supplies',
    subcategories: [
      'Textbooks & Educational Books', 'Literature, Fiction & Novels', 'Office Electronics & Calculators', 
      'Notebooks, Pens & Writing Supplies', 'Printer Ink, Toner & Paper', 'School Bags & Desk Organizers'
    ],
    specFields: [
      { id: 'formatType', label: 'Item Format', type: 'select', options: ['Hardcover', 'Paperback', 'Digital/E-Book', 'Physical Office Supply'] },
      { id: 'authorOrBrand', label: 'Author / Brand', type: 'text', placeholder: 'e.g., Penguin Books / HP' }
    ]
  },
  computers_tech: {
    label: '💻 Computers, Laptops & Electronics',
    subcategories: [
      'Windows Laptops & Notebooks', 'Apple MacBooks & iMacs', 'Computer Components & CPUs', 
      'Monitors, Keyboards & Mice', 'Networking Routers & Switches', 'External Hard Drives & Flash Storages'
    ],
    specFields: [
      { id: 'ram', label: 'RAM Size', type: 'select', options: ['8GB', '16GB', '32GB', '64GB+'] },
      { id: 'storage', label: 'Storage Drive', type: 'text', placeholder: 'e.g., 512GB NVMe SSD' },
      { id: 'processor', label: 'Processor', type: 'text', placeholder: 'e.g., Intel Core i7, Apple M3' }
    ]
  },
  fashion_apparel: {
    label: '👗 Fashion, Clothing & Apparel (A-Z)',
    subcategories: [
      'Men\'s Streetwear & Casuals', 'Women\'s Dresses & Gowns', 'Unisex Footwear & Sneakers', 
      'Luxury Wristwatches & Jewelry', 'Handbags, Wallets & Luggage', 'Traditional & Cultural Attire'
    ],
    specFields: [
      { id: 'size', label: 'Size Range', type: 'text', placeholder: 'e.g., S, M, L, XL, XXL or UK 7-12' },
      { id: 'material', label: 'Fabric / Material', type: 'text', placeholder: 'e.g., 100% Cotton, Genuine Leather' }
    ]
  },
  groceries_gourmet: {
    label: '🛒 Groceries, Food & Gourmet Supplies',
    subcategories: [
      'Packaged Staple Foods & Grains', 'Beverages, Teas & Coffees', 'Snacks, Chocolates & Confectionery', 
      'Cooking Oils, Spices & Seasonings', 'Canned Goods & Instant Meals', 'Organic & Health Foods'
    ],
    specFields: [
      { id: 'packSize', label: 'Package / Carton Size', type: 'text', placeholder: 'e.g., 10kg Bag, Carton of 24 pieces' },
      { id: 'expiryDate', label: 'Shelf Life / Expiry Indicator', type: 'text', placeholder: 'e.g., 24 Months from Production' }
    ]
  },
  health_beauty: {
    label: '💄 Health, Beauty & Personal Care',
    subcategories: [
      'Skincare, Serums & Face Creams', 'Haircare, Shampoos & Wigs', 'Makeup & Cosmetics', 
      'Vitamins, Supplements & Wellness', 'Perfumes & Fragrances', 'Oral Care & Shaving Supplies'
    ],
    specFields: [
      { id: 'skinType', label: 'Target Skin / Hair Type', type: 'text', placeholder: 'e.g., All Skin Types, Dry Hair' },
      { id: 'volume', label: 'Volume / Net Weight', type: 'text', placeholder: 'e.g., 250ml, 50g' }
    ]
  },
  home_kitchen: {
    label: '🏠 Home, Garden & Kitchenware',
    subcategories: [
      'Cookware, Pots & Pans Sets', 'Bedding, Duvets & Pillows', 'Home Decor, Lighting & Rugs', 
      'Bath Towels & Bathroom Accessories', 'Furniture, Sofas & Tables', 'Garden Tools & Outdoor Living'
    ],
    specFields: [
      { id: 'colorDesign', label: 'Color / Finish', type: 'text', placeholder: 'e.g., Matte Black, Oak Wood, Velvet Grey' },
      { id: 'dimensions', label: 'Dimensions / Size', type: 'text', placeholder: 'e.g., 6ft x 6ft' }
    ]
  },
  pet_supplies: {
    label: '🐾 Pet Supplies & Animal Care',
    subcategories: [
      'Dog Food & Treats', 'Cat Food & Litter', 'Aquarium & Fish Supplies', 
      'Pet Grooming & Healthcare', 'Cakes, Cages & Collars', 'Bird & Small Animal Feed'
    ],
    specFields: [
      { id: 'petType', label: 'Target Animal Species', type: 'select', options: ['Dogs', 'Cats', 'Fish & Aquatic', 'Birds', 'Small Animals'] },
      { id: 'weight', label: 'Net Weight / Pack', type: 'text', placeholder: 'e.g., 5kg Bag' }
    ]
  },
  sports_outdoors: {
    label: '⚽ Sports, Fitness & Outdoors',
    subcategories: [
      'Fitness & Gym Equipment', 'Team Sports Gear (Football, Basketball)', 'Camping & Hiking Gear', 
      'Cycling & Bicycles', 'Water Sports & Swimming', 'Running & Athletic Footwear'
    ],
    specFields: [
      { id: 'sportCategory', label: 'Sport Discipline', type: 'text', placeholder: 'e.g., Football, Weightlifting, Yoga' },
      { id: 'skillLevel', label: 'Skill Level', type: 'select', options: ['Beginner', 'Professional / Tournament Grade', 'All Levels'] }
    ]
  },
  toys_games: {
    label: '🎮 Toys, Puzzles & Video Games',
    subcategories: [
      'Action Figures & Collectibles', 'Board Games & Puzzles', 'Outdoor Play & Bouncers', 
      'Video Game Consoles & Accessories', 'PC & Console Video Game Discs', 'Remote Control & Drones'
    ],
    specFields: [
      { id: 'platform', label: 'Gaming Platform (if applicable)', type: 'select', options: ['PS5 / PS4', 'Xbox Series X/S', 'Nintendo Switch', 'PC Gaming', 'Not Applicable'] },
      { id: 'recommendedAge', label: 'Age Suitability', type: 'text', placeholder: 'e.g., Ages 8+' }
    ]
  }
};

// --- JIJI-INSPIRED SOLO SELLER CLASSIFIED CATEGORIES (A TO Z) ---
const JIJI_SOLO_CATEGORIES = {
  animals_pets: {
    label: '🐾 Animals & Pets',
    subcategories: [
      'Dogs & Puppies for Sale', 'Cats & Kittens', 'Birds, Poultry & Livestock', 
      'Fish & Aquarium Pets', 'Pet Accessories, Cages & Foods'
    ],
    specFields: [
      { id: 'breed', label: 'Breed / Species', type: 'text', placeholder: 'e.g., Alsatian, Boer Goat, Broilers' },
      { id: 'age', label: 'Age / Life Stage', type: 'text', placeholder: 'e.g., 3 Months old, Point of Lay' }
    ]
  },
  babies_kids: {
    label: '👶 Babies & Kids Items (Used/New)',
    subcategories: [
      'Baby & Kids Clothing', 'Baby Walkers, Prams & Strollers', 'Feeding & Nursing Gear', 
      'Toys, Bicycles & Games', 'Nursery Furniture'
    ],
    specFields: [
      { id: 'condition', label: 'Item Condition', type: 'select', options: ['Foreign Used (Clean)', 'Nigerian Used', 'Brand New'] }
    ]
  },
  beauty_personal: {
    label: '💅 Beauty & Personal Care',
    subcategories: [
      'Hair Extensions, Wigs & Weaves', 'Perfumes & Body Sprays', 'Skincare & Organic Creams', 
      'Makeup, Brushes & Palettes', 'Vitamins & Dietary Supplements'
    ],
    specFields: [
      { id: 'originBrand', label: 'Brand / Origin', type: 'text', placeholder: 'e.g., Imported Human Hair, Local Organic' }
    ]
  },
  commercial_equipment: {
    label: '🏗️ Commercial Equipment & Tools',
    subcategories: [
      'Manufacturing & Processing Machinery', 'Restaurant & Catering Equipment', 'Medical & Dental Equipment', 
      'Printing & Packaging Machines', 'Solar Panels & Heavy Generators', 'Construction Tools'
    ],
    specFields: [
      { id: 'powerSource', label: 'Power Source / Specs', type: 'text', placeholder: 'e.g., Diesel, Electric 3-Phase' }
    ]
  },
  electronics: {
    label: '📺 Electronics (TV, Audio & Cameras)',
    subcategories: [
      'Televisions & Smart TVs', 'Home Theatre Systems & Soundbars', 'Video Game Consoles (PS5, Xbox)', 
      'Cameras, Camcorder & Drones', 'Projectors & Studio Equipment'
    ],
    specFields: [
      { id: 'screenOrPower', label: 'Screen Size / Spec', type: 'text', placeholder: 'e.g., 55 inch, 4K UHD' }
    ]
  },
  fashion: {
    label: '👕 Fashion (Clothing, Shoes & Bags)',
    subcategories: [
      'Men\'s Clothing & Suits', 'Women\'s Wear & Dresses', 'Wristwatches, Jewelry & Accessories', 
      'Men & Women Shoes / Sneakers', 'Bags, Wallets & Luggage'
    ],
    specFields: [
      { id: 'gender', label: 'Target Gender', type: 'select', options: ['Men', 'Women', 'Unisex / Kids'] },
      { id: 'sizeFit', label: 'Size / Fit', type: 'text', placeholder: 'e.g., Size 42 Shoes, L Shirt' }
    ]
  },
  food_agriculture: {
    label: '🌾 Food, Agriculture & Farming',
    subcategories: [
      'Farm Produce & Grains (Rice, Beans, Garri)', 'Fresh Vegetables & Fruits', 
      'Palm Oil, Vegetable Oil & Condiments', 'Livestock Feed & Fertilizers'
    ],
    specFields: [
      { id: 'quantityMeasure', label: 'Quantity / Measure', type: 'text', placeholder: 'e.g., 50kg bag, Paint bucket' }
    ]
  },
  home_furniture: {
    label: '🛋️ Home, Furniture & Appliances',
    subcategories: [
      'Sofas, Beds & Wardrobes', 'Home Appliances (Fridges, Cookers)', 'Kitchenware & Cookware', 
      'Lighting, Lamps & Ceiling Fans', 'Home Decor, Rugs & Curtains'
    ],
    specFields: [
      { id: 'material', label: 'Material / Build', type: 'text', placeholder: 'e.g., Solid Mahogany Wood, Stainless Steel' }
    ]
  },
  jobs_services: {
    label: '💼 Jobs & Professional Services',
    subcategories: [
      'Job Vacancies & Hiring', 'Seeking Work / CVs', 'Building & Trades Services (Carpenters, Plumbers)', 
      'IT, Computer & Web Services', 'Logistics, Delivery & Transport Services'
    ],
    specFields: [
      { id: 'employmentType', label: 'Engagement Type', type: 'select', options: ['Full-Time Job', 'Contract / Freelance', 'One-off Service Gig'] }
    ]
  },
  leisure_sports: {
    label: '⚽ Leisure, Sports & Hobbies',
    subcategories: [
      'Musical Instruments (Guitars, Keyboards)', 'Fitness & Gym Gear', 'Outdoor Camping & Sports', 
      'Art, Antiques & Collectibles', 'Books, Games & Music CDs'
    ],
    specFields: [
      { id: 'itemState', label: 'Condition', type: 'select', options: ['Working Perfectly', 'Needs Minor Repair', 'Brand New'] }
    ]
  },
  phones_tablets: {
    label: '📱 Phones & Tablets',
    subcategories: [
      'Mobile Phones & Smartphones', 'Tablets & iPads', 'Smartwatches & Fitness Bands', 
      'Phone Accessories (Cases, Chargers, Powerbanks)', 'Headphones & Earpods'
    ],
    specFields: [
      { id: 'networkRam', label: 'RAM / Storage Specs', type: 'text', placeholder: 'e.g., 8GB RAM, 128GB ROM' },
      { id: 'simCount', label: 'SIM Slot Type', type: 'select', options: ['Single SIM', 'Dual SIM', 'eSIM Supported'] }
    ]
  },
  real_estate: {
    label: '🏢 Real Estate & Property',
    subcategories: [
      'Houses & Apartments for Rent', 'Houses & Lands for Sale', 'Short Let Apartments', 
      'Commercial Shops & Offices for Rent', 'Land & Plots for Sale'
    ],
    specFields: [
      { id: 'bedrooms', label: 'Number of Bedrooms', type: 'select', options: ['Self Contain / Studio', '1 Bedroom', '2 Bedrooms', '3 Bedrooms', '4+ Bedrooms / Duplex', 'Land / Commercial'] },
      { id: 'propertyLocation', label: 'Neighborhood / Area', type: 'text', placeholder: 'e.g., Lekki Phase 1, Ikeja, Wuse Abuja' }
    ]
  },
  vehicles: {
    label: '🚗 Vehicles & Automotive',
    subcategories: [
      'Cars (Foreign & Nigerian Used)', 'Motorcycles & Scooters (Okada/Power bikes)', 
      'Buses & Microbuses (Transport)', 'Trucks, Trailers & Heavy Machinery', 'Car Spare Parts & Accessories'
    ],
    specFields: [
      { id: 'carMakeModel', label: 'Car Make & Model', type: 'text', placeholder: 'e.g., Toyota Camry 2012' },
      { id: 'transmission', label: 'Transmission', type: 'select', options: ['Automatic', 'Manual'] },
      { id: 'condition', label: 'Vehicle Condition', type: 'select', options: ['Foreign Used (Tokunbo)', 'Nigerian Used', 'Brand New'] }
    ]
  }
};

const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 50;
const MAX_PDF_SIZE_MB = 10;

const CLOUD_NAME = "rylkihnc";
const UPLOAD_PRESET = "Bold_ng_page";

const compressImage = (file) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) return resolve(file);
    const reader = new FileReader();
    const timeoutTimer = setTimeout(() => resolve(file), 3000);

    reader.onerror = () => { clearTimeout(timeoutTimer); resolve(file); };
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => { clearTimeout(timeoutTimer); resolve(file); };
      img.src = event.target.result;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_DIMENSION = 1200;
          let { width, height } = img;
          if (width > height && width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            clearTimeout(timeoutTimer);
            if (!blob) return resolve(file);
            resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
          }, 'image/jpeg', 0.80);
        } catch (err) {
          clearTimeout(timeoutTimer);
          resolve(file);
        }
      };
    };
    reader.readAsDataURL(file);
  });
};

function FileUploadField({ label, accept, maxMb, file, onSelect }) {
  return (
    <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-4 space-y-3">
      <label className="text-xs font-black text-slate-300 uppercase tracking-wider block">
        {label} <span className="text-slate-500 font-normal lowercase">(max {maxMb}MB)</span>
      </label>
      {!file ? (
        <div className="border-2 border-dashed border-slate-700 hover:border-[#FF5A00] rounded-xl p-4 text-center transition-all cursor-pointer relative bg-slate-900/30">
          <input
            type="file"
            accept={accept}
            onChange={(e) => onSelect(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <p className="text-xs font-bold text-slate-300">Click to upload or drag & drop</p>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-700">
          <div className="truncate pr-2">
            <span className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 mr-2">Attached</span>
            <span className="text-xs font-bold text-white truncate">{file.name}</span>
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-red-400 hover:text-red-300 text-xs font-bold px-2 py-1 rounded cursor-pointer shrink-0"
          >
            ✕ Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductCatalogForm({ currentUser, onAddProductComplete, setCurrentPage }) {
  // Seller Mode: 'merchant' (Amazon A-Z style) vs 'solo' (Jiji A-Z style)
  const [sellerMode, setSellerMode] = useState('merchant');

  // Dynamic dictionary lookup based on mode
  const activeDictionary = sellerMode === 'merchant' ? AMAZON_MERCHANT_CATEGORIES : JIJI_SOLO_CATEGORIES;
  const initialCategoryKey = Object.keys(activeDictionary)[0];

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stockQuantity: '1',
    sku: '',
    brandName: '',
    negotiable: false,
    meetupSpot: '',
    category: initialCategoryKey,
    subcategory: activeDictionary[initialCategoryKey].subcategories[0],
    location: 'Lagos',
    meta: ''
  });

  const [specifications, setSpecifications] = useState(() => {
    const initial = {};
    activeDictionary[initialCategoryKey].specFields.forEach(f => { initial[f.id] = ''; });
    return initial;
  });

  const [media, setMedia] = useState({ image: null, video: null, pdf: null });
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Mode Switch (Resets category dropdown safely to match chosen mode A-Z list)
  const handleModeSwitch = (mode) => {
    setSellerMode(mode);
    const newDict = mode === 'merchant' ? AMAZON_MERCHANT_CATEGORIES : JIJI_SOLO_CATEGORIES;
    const firstCatKey = Object.keys(newDict)[0];
    const firstSubcat = newDict[firstCatKey].subcategories[0];

    setFormData(prev => ({
      ...prev,
      category: firstCatKey,
      subcategory: firstSubcat
    }));

    const newSpecs = {};
    newDict[firstCatKey].specFields.forEach(f => { newSpecs[f.id] = ''; });
    setSpecifications(newSpecs);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const catConfig = activeDictionary[selectedCategory];
    const defaultSub = catConfig?.subcategories[0] || '';
    
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      subcategory: defaultSub
    }));

    const initialSpecs = {};
    catConfig?.specFields?.forEach((field) => {
      initialSpecs[field.id] = '';
    });
    setSpecifications(initialSpecs);
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [id]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSpecChange = (fieldId, value) => {
    setSpecifications((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleImageSelect = (file) => {
    setErrorMessage('');
    if (!file) {
      setMedia((prev) => ({ ...prev, image: null }));
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
      return;
    }
    if (file.size / (1024 * 1024) > MAX_IMAGE_SIZE_MB) {
      setErrorMessage(`Image file exceeds maximum size limit of ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }
    setMedia((prev) => ({ ...prev, image: file }));
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleFileChange = (key, file, maxMbAllowed) => {
    setErrorMessage('');
    if (!file) {
      setMedia((prev) => ({ ...prev, [key]: null }));
      return;
    }
    if (file.size / (1024 * 1024) > maxMbAllowed) {
      setErrorMessage(`File "${file.name}" exceeds maximum size limit of ${maxMbAllowed}MB.`);
      return;
    }
    setMedia((prev) => ({ ...prev, [key]: file }));
  };

  const uploadToCloudinary = useCallback(async (file, resourceType = 'auto', label) => {
    if (!file) return '';
    setStatusText(`Uploading ${label} to Cloudinary...`);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("folder", "bold_store");

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, {
      method: "POST",
      body: data,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || `Failed to upload ${label}`);
    return result.secure_url;
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentUser) {
      setErrorMessage('Access Denied: You must be signed in and registered to upload products.');
      return;
    }

    if (!formData.title.trim() || !formData.price || Number(formData.price) <= 0) {
      setErrorMessage('Please enter a valid title and price.');
      return;
    }

    if (!media.image) {
      setErrorMessage('Please select and confirm a primary product image before submitting.');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(15);
      setStatusText('Optimizing image compression...');

      const compressedImage = await compressImage(media.image);
      setUploadProgress(35);
      const imageUrl = await uploadToCloudinary(compressedImage, 'image', 'Product Image');

      let videoUrl = '';
      if (media.video) {
        setUploadProgress(65);
        videoUrl = await uploadToCloudinary(media.video, 'video', 'Product Video');
      }

      let pdfUrl = '';
      if (media.pdf) {
        setUploadProgress(85);
        pdfUrl = await uploadToCloudinary(media.pdf, 'raw', 'Verification Document');
      }

      setStatusText('Saving listing to database...');
      setUploadProgress(95);

      const payload = {
        id: Date.now(),
        sellerMode, // 'merchant' or 'solo'
        title: formData.title.trim(),
        price: Number(formData.price),
        stockQuantity: sellerMode === 'merchant' ? Number(formData.stockQuantity) : 1,
        sku: sellerMode === 'merchant' ? formData.sku.trim() : '',
        brandName: sellerMode === 'merchant' ? formData.brandName.trim() : '',
        negotiable: sellerMode === 'solo' ? formData.negotiable : false,
        meetupSpot: sellerMode === 'solo' ? formData.meetupSpot.trim() : '',
        category: formData.category,
        subcategory: formData.subcategory,
        location: formData.location,
        specifications,
        meta: formData.meta.trim(),
        img: imageUrl,
        media: { imageUrl, videoUrl, pdfUrl },
        ownerUid: currentUser.uid || currentUser.id,
        vendorEmail: currentUser.email,
        dateAdded: new Date().toISOString().split('T')[0]
      };

      if (typeof onAddProductComplete === 'function') {
        await onAddProductComplete(payload);
      }
      
      setUploadProgress(100);
      setStatusText('Upload Successful!');
      setTimeout(() => {
        if (typeof setCurrentPage === 'function') setCurrentPage('marketplace');
      }, 500);

    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMessage(`Upload failed: ${err.message || 'Please check network and try again.'}`);
      setUploading(false);
      setUploadProgress(0);
      setStatusText('');
    }
  };

  const currentCategorySpecs = activeDictionary[formData.category]?.specFields || [];
  const currentCategoryConfig = activeDictionary[formData.category];

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 text-white text-left selection:bg-[#FF5A00]">
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Header & A-Z Seller Mode Switcher */}
        <div className="mb-8 border-b border-slate-800 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/10 px-3 py-1 rounded-full border border-[#FF5A00]/20">
                Bold.ng A-Z Global Marketplace Hub
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-2">
                {sellerMode === 'merchant' ? '📦 Amazon-Style Merchant Catalog (A–Z)' : '📍 Jiji-Style Solo Classifieds (A–Z)'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {sellerMode === 'merchant' 
                  ? 'Access complete A to Z departments for bulk stock, brand storefronts, inventory SKUs, and wholesale fulfillment.' 
                  : 'Access complete A to Z classified categories for direct peer-to-peer ads, negotiable pricing, and local meetups.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="bg-[#0B132B] p-1.5 rounded-2xl border border-slate-800 flex shrink-0">
              <button
                type="button"
                onClick={() => handleModeSwitch('merchant')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all cursor-pointer ${
                  sellerMode === 'merchant' 
                    ? 'bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📦 Merchant (Amazon A-Z)
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('solo')}
                className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wide uppercase transition-all cursor-pointer ${
                  sellerMode === 'solo' 
                    ? 'bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📍 Solo Seller (Jiji A-Z)
              </button>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-900/50 rounded-2xl flex items-center gap-3 text-xs text-red-400 font-bold">
            <span className="text-base">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-8">
          
          {/* 1. Primary Image Upload */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#FF5A00] uppercase tracking-widest flex items-center gap-2">
              <span>🖼️</span> 1. Primary Product Image (Required)
            </h3>
            <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-4 md:p-6">
              {!imagePreviewUrl ? (
                <div className="border-2 border-dashed border-slate-700 hover:border-[#FF5A00] rounded-xl p-8 text-center transition-all cursor-pointer relative bg-slate-900/30">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2">
                    <span className="text-4xl block">📷</span>
                    <p className="text-sm font-bold text-slate-200">Click to choose image or drag & drop here</p>
                    <p className="text-xs text-slate-400">Supports PNG, JPG, WEBP (Max {MAX_IMAGE_SIZE_MB}MB)</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                  <div className="relative group w-44 h-44 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center shrink-0 shadow-lg">
                    <img src={imagePreviewUrl} alt="Product Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2 text-center sm:text-left flex-1">
                    <span className="text-[10px] font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 inline-block">
                      ✓ Image Selected & Verified
                    </span>
                    <h4 className="text-sm font-bold text-white truncate max-w-xs">{media.image?.name}</h4>
                    <p className="text-xs text-slate-400">Size: {(media.image?.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleImageSelect(null)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        ✕ Remove / Change Image
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Basic Info & A-Z Department Mapping */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#FF5A00] uppercase tracking-widest flex items-center gap-2">
              <span>📝</span> 2. Basic Information & A-Z Department Mapping
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label htmlFor="title" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  {sellerMode === 'merchant' ? 'Product Title / Store Catalog Item' : 'Classified Ad Title'} <span className="text-[#FF5A00]">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={sellerMode === 'merchant' ? 'e.g., Premium Smart Inverter Air Conditioner 1.5HP' : 'e.g., Foreign Used iPhone 13 Pro Max - Clean'}
                  required
                  className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium"
                />
              </div>

              {/* Conditional Merchant Fields (Amazon Style) */}
              {sellerMode === 'merchant' && (
                <>
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="brandName" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                      Storefront / Brand Name
                    </label>
                    <input
                      id="brandName"
                      type="text"
                      value={formData.brandName}
                      onChange={handleInputChange}
                      placeholder="e.g., LG Official Store / Anker Direct"
                      className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="sku" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                      Inventory SKU / Model Code
                    </label>
                    <input
                      id="sku"
                      type="text"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="e.g., LG-INV-AC-15"
                      className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col space-y-1.5">
                <label htmlFor="price" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  Price (₦ - Nigerian Naira) <span className="text-[#FF5A00]">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 450000"
                  required
                  className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium"
                />
              </div>

              {sellerMode === 'merchant' ? (
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="stockQuantity" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                    Bulk Stock Quantity
                  </label>
                  <input
                    id="stockQuantity"
                    type="number"
                    min="1"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium"
                  />
                </div>
              ) : (
                <div className="flex flex-col space-y-1.5 justify-center">
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      id="negotiable"
                      type="checkbox"
                      checked={formData.negotiable}
                      onChange={handleInputChange}
                      className="w-5 h-5 accent-[#FF5A00] rounded cursor-pointer"
                    />
                    <label htmlFor="negotiable" className="text-xs font-bold text-slate-300 uppercase tracking-wider cursor-pointer">
                      Price is Negotiable
                    </label>
                  </div>
                </div>
              )}

              {/* A-Z Department / Category Selection */}
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="category" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  {sellerMode === 'merchant' ? 'Amazon A-Z Department' : 'Jiji A-Z Classified Category'}
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium cursor-pointer"
                >
                  {Object.entries(activeDictionary).map(([key, config]) => (
                    <option key={key} value={key}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Selection */}
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="subcategory" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  Specific Subcategory
                </label>
                <select
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium cursor-pointer"
                >
                  {currentCategoryConfig?.subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label htmlFor="location" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  Fulfillment Location / Hub
                </label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Ikeja, Lagos / Abuja / Port Harcourt"
                  className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium"
                />
              </div>

              {sellerMode === 'solo' && (
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="meetupSpot" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                    Preferred Meetup / Inspection Spot
                  </label>
                  <input
                    id="meetupSpot"
                    type="text"
                    value={formData.meetupSpot}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Village Ikeja / Safe Public Mall"
                    className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 3. Dynamic A-Z Specifications */}
          {currentCategorySpecs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#FF5A00] uppercase tracking-widest flex items-center gap-2">
                <span>⚙️</span> 3. Department Specifications ({currentCategoryConfig?.label.split(' ')[1] || 'Category'})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0B132B] border border-slate-800 rounded-2xl p-6">
                {currentCategorySpecs.map((field) => (
                  <div key={field.id} className="flex flex-col space-y-1.5">
                    <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={specifications[field.id] || ''}
                        onChange={(e) => handleSpecChange(field.id, e.target.value)}
                        className="bg-slate-900 border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium cursor-pointer"
                      >
                        <option value="">-- Select {field.label} --</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={specifications[field.id] || ''}
                        onChange={(e) => handleSpecChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="bg-slate-900 border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Additional Media & Verification */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#FF5A00] uppercase tracking-widest flex items-center gap-2">
              <span>📎</span> 4. Additional Verification & Media (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadField
                label="Product Video Demonstration"
                accept="video/*"
                maxMb={MAX_VIDEO_SIZE_MB}
                file={media.video}
                onSelect={(file) => handleFileChange('video', file, MAX_VIDEO_SIZE_MB)}
              />
              <FileUploadField
                label="Warranty / Manual PDF Document"
                accept="application/pdf"
                maxMb={MAX_PDF_SIZE_MB}
                file={media.pdf}
                onSelect={(file) => handleFileChange('pdf', file, MAX_PDF_SIZE_MB)}
              />
            </div>
          </div>

          {/* 5. Detailed Description / Meta Notes */}
          <div className="space-y-2">
            <label htmlFor="meta" className="text-xs font-black text-slate-300 uppercase tracking-wider block">
              Detailed Description & Terms
            </label>
            <textarea
              id="meta"
              rows="4"
              value={formData.meta}
              onChange={handleInputChange}
              placeholder="Provide complete item highlights, warranty terms, return policy, or delivery details..."
              className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-2xl p-4 text-sm text-white font-medium"
            />
          </div>

          {/* Upload Progress & Submit Action */}
          {uploading && (
            <div className="space-y-2 bg-[#0B132B] p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                <span className="text-[#FF5A00] animate-pulse">{statusText}</span>
                <span className="text-slate-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#FF5A00] to-amber-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => setCurrentPage?.('marketplace')}
              className="px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-900 border border-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-[#FF5A00] hover:bg-[#e05000] shadow-xl shadow-[#FF5A00]/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Processing & Publishing...' : '🚀 Publish A-Z Listing Now'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}