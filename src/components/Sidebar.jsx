import React from 'react';
import { BOLD_CATEGORIES } from '../data/categories';

export default function Sidebar({ userType }) {
  // Filter categories if needed based on whether user is 'merchant' or 'solo_seller'
  const filteredCategories = BOLD_CATEGORIES.filter(cat => 
    cat.availableFor.includes(userType)
  );

  return (
    <aside className="w-64 bg-white shadow-md p-4 h-full overflow-y-auto">
      <h3 className="font-bold text-gray-700 mb-4">Categories</h3>
      <ul className="space-y-2">
        {filteredCategories.map((cat) => (
          <li key={cat.id} className="group">
            <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer">
              <span className="text-sm font-medium text-gray-800">{cat.name}</span>
            </div>
            <ul className="pl-4 mt-1 space-y-1 hidden group-hover:block">
              {cat.subcategories.map((sub, index) => (
                <li key={index} className="text-xs text-gray-500 hover:text-blue-600 py-1">
                  {sub}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </aside>
  );
}