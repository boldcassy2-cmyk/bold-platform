// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { BOLD_CATEGORIES } from '../data/categories';

export default function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sellerType, setSellerType] = useState('all'); // 'all', 'merchant', 'solo_seller'

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ keyword, selectedCategory, sellerType });
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto flex flex-col md:flex-row gap-3 items-center">
      
      {/* Keyword Input */}
      <div className="flex-1 w-full">
        <input 
          type="text"
          placeholder="Search items, cars, phones, services..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Dropdown */}
      <div className="w-full md:w-56">
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Departments</option>
          {BOLD_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Seller Type Filter */}
      <div className="w-full md:w-44">
        <select 
          value={sellerType}
          onChange={(e) => setSellerType(e.target.value)}
          className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Sellers</option>
          <option value="merchant">Merchants (Retail)</option>
          <option value="solo_seller">Solo Sellers (P2P)</option>
        </select>
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-md"
      >
        Search
      </button>

    </form>
  );
}