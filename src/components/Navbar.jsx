import React from 'react';

export default function Navbar({ currentPage, setCurrentPage }) {
  return (
    <nav className="bg-[#0B132B] border-b border-slate-800 flex justify-between items-center px-10 py-5 shadow-xl">
      <button 
        onClick={() => setCurrentPage('home')} 
        className="text-2xl font-black tracking-wider text-white bg-transparent border-none cursor-pointer outline-none"
      >
        BOLD<span className="text-[#FF5A00]">.ng</span>
      </button>
      
      <div className="flex items-center gap-8">
        <button 
          onClick={() => setCurrentPage('home')} 
          className={`font-semibold cursor-pointer border-none bg-transparent transition duration-200 outline-none ${currentPage === 'home' ? 'text-[#FF5A00]' : 'text-white hover:text-[#FF5A00]'}`}
        >
          Home
        </button>
        <button 
          onClick={() => setCurrentPage('explore')} 
          className={`font-semibold cursor-pointer border-none bg-transparent transition duration-200 outline-none ${currentPage === 'explore' ? 'text-[#FF5A00]' : 'text-gray-400 hover:text-[#FF5A00]'}`}
        >
          Explore
        </button>
        {/* Dynamic Developer Shortcut for Direct Store Evaluation */}
        <button 
          onClick={() => setCurrentPage('store')} 
          className={`font-semibold cursor-pointer border-none bg-transparent transition duration-200 outline-none ${currentPage === 'store' ? 'text-[#FF5A00]' : 'text-gray-400 hover:text-[#FF5A00]'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setCurrentPage('signup')} 
          className="bg-[#FF5A00] text-white font-bold px-5 py-2.5 rounded-lg border-none cursor-pointer transition duration-200 hover:brightness-110 shadow-lg shadow-orange-600/20 outline-none"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}