import React from 'react';
import MainLayout from '../layouts/MainLayout';
import { Share2, Lock } from 'lucide-react';

const Shared = () => {
  return (
    <MainLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
          <Share2 className="w-12 h-12 text-primary" />
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center">
            <Lock className="w-4 h-4 text-white/40" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Shared Workspace</h2>
        <p className="text-white/40 max-w-md mx-auto leading-relaxed">
          The shared notes feature is coming soon. You'll be able to collaborate with your team and share AI-generated insights securely.
        </p>
        <button 
          onClick={() => window.history.back()}
          className="mt-10 px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          Go Back
        </button>
      </div>
    </MainLayout>
  );
};

export default Shared;
