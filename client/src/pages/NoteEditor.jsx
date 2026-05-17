import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Archive, 
  Trash2, 
  Sparkles, 
  Clock, 
  CloudCheck,
  Loader2,
  ChevronRight,
  Maximize2,
  Minimize2,
  Brain,
  ListChecks,
  Type,
  X,
  Wand2,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Lock
} from 'lucide-react';
import { debounce } from 'lodash';
import useNoteStore from '../store/noteStore';
import toast from 'react-hot-toast';
import api from '../services/apiService';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateNote, deleteNote, toggleArchive, isSaving } = useNoteStore();
  
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI States
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Fetch Note Data
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
        setTitle(res.data.title);
        setContent(res.data.content);
        setIsLoading(false);
      } catch (err) {
        toast.error('Failed to load note');
        navigate('/dashboard');
      }
    };
    fetchNote();
  }, [id, navigate]);

  // Debounced Save Function
  const debouncedSave = useCallback(
    debounce(async (id, data) => {
      await updateNote(id, data);
    }, 1000),
    []
  );

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    debouncedSave(id, { title: e.target.value, content });
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    debouncedSave(id, { title, content: e.target.value });
  };

  const runAiTask = async (type) => {
    if (!content || content.length < 10) return toast.error('Content too short for AI');
    setIsAiLoading(true);
    setShowAiPanel(true);
    try {
      const endpoint = type === 'summary' ? '/ai/summary' : type === 'action' ? '/ai/action-items' : '/ai/title';
      const res = await api.post(endpoint, { noteId: id, content });
      setNote(res.data.updatedNote);
      if (type === 'title') setTitle(res.data.suggestedTitle);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} generated!`);
    } catch (err) {
      toast.error('AI request failed');
    } finally {
      setIsAiLoading(false);
    }
  };

  const toggleShare = async () => {
    try {
      const res = await api.patch(`/notes/${id}/share`);
      setNote(res.data);
      toast.success(res.data.isPublic ? 'Note is now public' : 'Note is now private');
    } catch (err) {
      toast.error('Failed to update sharing status');
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/share/${note.shareId}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;

  return (
    <div className={`min-h-screen bg-slate-950 text-white flex flex-col`}>
      {/* Header */}
      <header className="h-16 glass border-b border-white/10 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex items-center gap-2 text-sm font-medium text-white/40">
            <span>Workspace</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white/80 truncate max-w-[150px]">{title || 'Untitled'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 text-[11px] font-medium text-white/30 mr-2 uppercase tracking-widest hidden sm:flex">
            {isSaving ? <><Loader2 className="w-3 h-3 animate-spin" /><span>Saving...</span></> : <><CloudCheck className="w-4 h-4 text-emerald-500/50" /><span>Saved</span></>}
          </div>
          <div className="h-6 w-px bg-white/10 hidden sm:block" />
          
          <button onClick={() => setIsFullWidth(!isFullWidth)} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white hidden md:block" title="Wide Mode">{isFullWidth ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}</button>
          <button onClick={() => setShowShareModal(true)} className={`p-2 rounded-xl transition-all ${note.isPublic ? 'text-primary bg-primary/10' : 'hover:bg-white/5 text-white/40 hover:text-white'}`} title="Share Note"><Share2 className="w-5 h-5" /></button>
          <button onClick={() => setShowAiPanel(!showAiPanel)} className={`p-2 rounded-xl transition-all ${showAiPanel ? 'bg-primary text-white' : 'hover:bg-white/5 text-white/40 hover:text-white'}`} title="AI Insights"><Sparkles className="w-5 h-5" /></button>
          <button onClick={async () => { await toggleArchive(id); toast.success(note.isArchived ? 'Restored' : 'Archived'); navigate('/dashboard'); }} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white"><Archive className="w-5 h-5" /></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className={`flex-1 overflow-y-auto p-6 md:p-12 transition-all duration-500 ${isFullWidth ? 'max-w-full' : 'max-w-4xl mx-auto w-full'}`}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <input type="text" value={title} onChange={handleTitleChange} placeholder="Note Title" className="w-full text-4xl md:text-5xl font-extrabold bg-transparent border-none outline-none placeholder:text-white/10 focus:ring-0 p-0 text-white" />
            <div className="flex items-center gap-6 text-sm text-white/30 border-b border-white/5 pb-6">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>Edited {new Date(note.updatedAt).toLocaleTimeString()}</span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /><span>{note.category}</span></div>
            </div>
            <textarea value={content} onChange={handleContentChange} placeholder="Start writing..." className="w-full h-[calc(100vh-350px)] bg-transparent border-none outline-none placeholder:text-white/10 focus:ring-0 p-0 text-white text-lg leading-relaxed resize-none scrollbar-hide" />
          </motion.div>
        </main>

        <AnimatePresence>
          {showAiPanel && (
            <motion.aside initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} className="w-96 glass border-l border-white/10 p-6 overflow-y-auto hidden xl:block">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-primary font-bold"><Sparkles className="w-5 h-5" /> <span>AI Insights</span></div>
                <button onClick={() => setShowAiPanel(false)} className="p-1 hover:bg-white/5 rounded-lg text-white/40"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Available Tools</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <button onClick={() => runAiTask('summary')} disabled={isAiLoading} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm group"><Brain className="w-4 h-4 text-purple-400 group-hover:scale-110" /><span>Summarize Content</span></button>
                    <button onClick={() => runAiTask('action')} disabled={isAiLoading} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm group"><ListChecks className="w-4 h-4 text-emerald-400 group-hover:scale-110" /><span>Extract Actions</span></button>
                    <button onClick={() => runAiTask('title')} disabled={isAiLoading} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm group"><Type className="w-4 h-4 text-blue-400 group-hover:scale-110" /><span>Suggest Title</span></button>
                  </div>
                </div>
                <div className="space-y-6">
                  {isAiLoading && <div className="py-12 flex flex-col items-center justify-center text-center space-y-4"><div className="relative"><Wand2 className="w-10 h-10 text-primary animate-pulse" /><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute -inset-2 border-2 border-dashed border-primary/30 rounded-full" /></div><p className="text-sm text-white/40 font-medium animate-pulse">Consulting AI...</p></div>}
                  {!isAiLoading && note.summary && <div className="space-y-3"><h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Summary</h4><div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-sm text-white/80 leading-relaxed italic">"{note.summary}"</div></div>}
                  {!isAiLoading && note.actionItems?.length > 0 && <div className="space-y-3"><h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Action Items</h4><ul className="space-y-2">{note.actionItems.map((item, i) => (<li key={i} className="flex gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-sm text-white/80"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />{item}</li>))}</ul></div>}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowShareModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md glass border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center"><Share2 className="text-primary w-6 h-6" /></div>
                  <h2 className="text-xl font-bold">Share Note</h2>
                </div>
                <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-white/5 rounded-full text-white/40"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {note.isPublic ? <Globe className="text-emerald-400 w-5 h-5" /> : <Lock className="text-white/40 w-5 h-5" />}
                    <div>
                      <p className="text-sm font-semibold">{note.isPublic ? 'Public' : 'Private'}</p>
                      <p className="text-[11px] text-white/40">{note.isPublic ? 'Anyone with the link can view' : 'Only you can access this note'}</p>
                    </div>
                  </div>
                  <button onClick={toggleShare} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${note.isPublic ? 'bg-primary' : 'bg-white/10'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${note.isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                {note.isPublic && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                    <p className="text-xs font-bold text-white/30 uppercase tracking-widest">Shareable Link</p>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white/60 truncate flex items-center">
                        {window.location.origin}/share/{note.shareId}
                      </div>
                      <button onClick={copyLink} className="p-2 bg-primary rounded-xl text-white hover:bg-primary/90 transition-all">
                        {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    <a href={`/share/${note.shareId}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-xs text-primary hover:underline font-medium pt-2">
                      Preview public page <ExternalLink className="w-3 h-3" />
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NoteEditor;
