/**
 * BOLD.NG TRUST ARCHITECTURE
 * Centralized logic for security badges and trust markers.
 */

export const getTrustBadge = (item) => {
  // 1. Safety check: If item is missing or doesn't have a price, return fallback safely
  if (!item || typeof item.price !== 'number') {
    return { text: "🤝 ESCROW ELIGIBLE", color: "bg-emerald-600" };
  }

  // 2. High-value milestone assessment (Over 1 Million Naira)
  if (item.price >= 1000000) {
    return { 
      text: "🛡️ PREMIUM ESCROW", 
      color: "bg-purple-600" 
    };
  }

  // 3. Category inspection vetting rules (Using optional chaining to prevent crashes)
  const itemCategory = item.category?.toLowerCase();
  if (itemCategory === "electronics" || itemCategory === "automotive" || itemCategory === "realestate") {
    return { 
      text: "✅ VERIFIED ASSET", 
      color: "bg-blue-600" 
    };
  }

  // 4. Default fallback protection for everything else
  return { 
    text: "🤝 ESCROW ELIGIBLE", 
    color: "bg-emerald-600" 
  };
};