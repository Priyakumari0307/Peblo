import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Clock, 
  User, 
  FileText, 
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/apiService';

const PublicNote = () => {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicNote = async () => {
      try {
        const res = await api.get(`/notes/share/${shareId}`);
        setNote(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Note not found or private');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicNote();
  }, [shareId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-white/40 animate-pulse">Fetching shared note...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-white/40 text-center max-w-xs">{error}</p>
        <Link to="/login" className="mt-8 text-primary hover:underline font-medium">Return to Peblo</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary/30">
      {/* Public Header */}
      <nav className="h-16 glass border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary w-5 h-5" />
          <span className="font-bold tracking-tight">Peblo <span className="text-white/40 font-normal ml-2">| Public Share</span></span>
        </div>
        <Link to="/register" className="text-xs font-bold text-primary hover:text-white transition-all uppercase tracking-widest border border-primary/20 px-4 py-2 rounded-lg bg-primary/5 hover:bg-primary/20">
          Get Started for Free
        </Link>
      </nav>

      {/* Note Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-white/40 pb-8 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                {note.userId?.name?.charAt(0)}
              </div>
              <span className="text-white/80 font-medium">{note.userId?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest font-bold">
              {note.category}
            </div>
          </div>

          {/* Note Body */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {note.title}
            </h1>
            
            <div className="text-lg md:text-xl text-white/80 leading-relaxed whitespace-pre-wrap">
              {note.content}
            </div>
          </div>

          {/* AI Summary Section (If available) */}
          {note.summary && (
            <div className="mt-16 p-8 glass rounded-3xl border border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-20 h-20 text-primary" />
              </div>
              <div className="relative z-10">
                <h3 className="text-primary font-bold flex items-center gap-2 mb-4 uppercase tracking-widest text-xs">
                  <Sparkles className="w-4 h-4" /> AI Generated Summary
                </h3>
                <p className="text-white/70 italic text-lg leading-relaxed">
                  "{note.summary}"
                </p>
              </div>
            </div>
          )}

          {/* Footer CTA */}
          <div className="mt-20 pt-10 border-t border-white/5 text-center">
            <p className="text-white/40 mb-6 italic text-sm">This note was generated and shared using Peblo AI Workspace.</p>
            <Link 
              to="/register" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
            >
              Start Your Own Workspace <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PublicNote;
