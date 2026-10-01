// src/components/RelatedProducts.jsx
import React, { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
// Make sure this points to your actual firebase configuration file path:
// import { db } from '../firebaseConfig';

export default function RelatedProducts({ currentProductId, subcategoryId }) {
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      if (!subcategoryId) {
        setLoading(false);
        return;
      }
      
      try {
        /* Uncomment when connected to your live Firestore DB:
        const q = query(
          collection(db, "products"),
          where("subcategoryId", "==", subcategoryId),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const items = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => item.id !== currentProductId);
          
        setRelatedItems(items);
        */

        // Mock fallback data for instant preview if DB is empty
        setRelatedItems([
          { id: '1', title: 'HP Folio i7 Touchscreen', price: 280000, imageUrl: 'https://via.placeholder.com/150' },
          { id: '2', title: 'Dell Latitude Business Laptop', price: 250000, imageUrl: 'https://via.placeholder.com/150' },
          { id: '3', title: 'MacBook Pro M1 Clean', price: 650000, imageUrl: 'https://via.placeholder.com/150' },
          { id: '4', title: 'Lenovo ThinkPad X1 Carbon', price: 320000, imageUrl: 'https://via.placeholder.com/150' },
        ]);

      } catch (error) {
        console.error("Error fetching related items:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRelated();
  }, [subcategoryId, currentProductId]);

  if (loading) return <div className="text-sm text-gray-400 my-4">Loading related recommendations...</div>;
  if (relatedItems.length === 0) return null;

  return (
    <div className="mt-12 border-t pt-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Related Items You Might Like</h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {relatedItems.map(item => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition cursor-pointer">
            <img src={item.imageUrl} alt={item.title} className="w-full h-36 object-cover rounded-lg mb-3 bg-gray-100" />
            <h4 className="text-sm font-semibold text-gray-800 truncate mb-1">{item.title}</h4>
            <p className="text-blue-600 font-bold text-sm">₦{Number(item.price).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}