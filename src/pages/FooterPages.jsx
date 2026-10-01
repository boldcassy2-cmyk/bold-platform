import React from 'react';

export default function FooterPages({ page, setCurrentPage }) {
  const contentMap = {
    'footer-about': {
      title: 'About Bold NG',
      badge: 'Company Profile',
      desc: 'Bold.ng is Nigeria\'s premier high-trust multi-vendor marketplace, built to connect verified merchants and smart shoppers through foolproof escrow technology and CAC verification protocols.'
    },
    'footer-academy': {
      title: 'Careers & Bold Academy',
      badge: 'Education & Growth',
      desc: 'Join our growing team or level up your digital skills through Bold Academy, offering top-tier coding education, merchant business tutorials, and career pathways.'
    },
    'footer-press': {
      title: 'Press Releases',
      badge: 'Media Center',
      desc: 'Stay updated with the latest news, milestone announcements, vendor success stories, and platform expansions across Nigeria.'
    },
    'footer-policies': {
      title: 'Policies & Trust Protocol',
      badge: 'Security & Compliance',
      desc: 'We maintain strict anti-fraud measures, transparent vendor inspection guidelines, and uncompromising data protection standards.'
    },
    'footer-brand': {
      title: 'Protect & Build Your Brand',
      badge: 'Merchant Solutions',
      desc: 'Leverage our official business registration assistance and trademark protection tools to give your store instant customer credibility.'
    },
    'footer-advertise': {
      title: 'Advertise Your Products',
      badge: 'Ad Placements',
      desc: 'Boost your product listings to high-demand spotlight spaces across Bold.ng to scale your sales and reach thousands of buyers instantly.'
    },
    'footer-affiliate': {
      title: 'Become an Affiliate',
      badge: 'Earn Commissions',
      desc: 'Partner with Bold.ng, share your referral links, and earn high commission payouts for every successful verified order.'
    },
    'footer-escrow': {
      title: 'Bold Escrow Secure',
      badge: 'Payment Protection',
      desc: 'Funds are securely locked in escrow until the buyer confirms delivery and inspection of the purchased item, ensuring 0% scam risk.'
    },
    'footer-cards': {
      title: 'Business Cards & Credit',
      badge: 'Merchant Finance',
      desc: 'Access flexible business transaction tools, merchant credit facilities, and professional digital identity assets.'
    },
    'footer-wallet': {
      title: 'Reload Your Account & Wallet',
      badge: 'Instant Funding',
      desc: 'Top up your Bold.ng balance securely via bank transfer or card to enjoy lightning-fast checkout without payment delays.'
    },
    'footer-currency': {
      title: 'Currency Converter',
      badge: 'Exchange Tool',
      desc: 'Convert prices smoothly between Nigerian Naira (₦) and international currencies for seamless cross-border sourcing.'
    },
    'footer-shipping': {
      title: 'Shipping Rates & Policies',
      badge: 'Logistics',
      desc: 'Review delivery timelines, partner courier options, and flat-rate shipping policies across all states in Nigeria.'
    },
    'footer-returns': {
      title: 'Returns & Replacements',
      badge: 'Buyer Protection',
      desc: 'Easily initiate return requests or item replacements within our specified inspection window if an item doesn\'t match description.'
    },
    'footer-support': {
      title: 'Help Center & Support',
      badge: '24/7 Assistance',
      desc: 'Reach out to our customer resolution team, live chat agents, or check our comprehensive knowledge base for instant answers.'
    }
  };

  const currentContent = contentMap[page] || {
    title: 'Page Not Found',
    badge: 'Error',
    desc: 'The requested page could not be located.'
  };

  return (
    <main className="max-w-4xl mx-auto py-16 px-4 sm:px-6 font-sans text-left min-h-[60vh]">
      <div className="bg-[#16223F] border border-slate-700/80 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/15 px-3.5 py-1 rounded-full border border-[#FF5A00]/30">
            {currentContent.badge}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white">{currentContent.title}</h1>
        </div>
        
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800 pt-6">
          {currentContent.desc}
        </p>

        <div className="flex gap-4 pt-6">
          <button
            onClick={() => setCurrentPage('home')}
            className="bg-[#FF5A00] hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => setCurrentPage('marketplace')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition cursor-pointer border border-slate-700"
          >
            Browse Marketplace 🛒
          </button>
        </div>
      </div>
    </main>
  );
}