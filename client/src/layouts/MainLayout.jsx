import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden">
      {/* Sidebar - Desktop always visible, Mobile animated */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen relative">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth relative z-10">
          <div className="max-w-7xl mx-auto w-full p-6 md:p-8 lg:p-12">
            {children}
          </div>
        </main>

        {/* Global Background Accents (Subtle Glows) */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse-slow" />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
