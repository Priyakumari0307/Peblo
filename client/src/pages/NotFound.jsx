import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-6">Lost in the Nebula?</h2>
        <p className="text-white/40 max-w-md mx-auto mb-10 leading-relaxed">
          The page you're looking for has drifted away. Let's get you back to your workspace.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Home className="w-5 h-5" /> Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
