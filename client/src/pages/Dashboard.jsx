import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  ChevronRight,
  SortAsc,
  Layers,
  SearchX,
  Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';
import NoteCardSkeleton from '../components/NoteCardSkeleton';
import NoteCard from '../components/NoteCard';
import CreateNoteModal from '../components/CreateNoteModal';
import useNoteStore from '../store/noteStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { notes, isLoading, fetchNotes, toggleArchive, deleteNote } = useNoteStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('latest');

  const debouncedFetch = useCallback(
    debounce((params) => {
      fetchNotes(params);
    }, 500),
    []
  );

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    if (sort !== 'latest') params.sort = sort;
    
    if (search) {
      debouncedFetch(params);
    } else {
      fetchNotes(params);
    }
  }, [search, category, sort, fetchNotes, debouncedFetch]);

  const stats = [
    { label: 'Total Notes', value: notes.length, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'AI Insights', value: notes.filter(n => n.summary).length, icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Productivity', value: 'High', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Active Drafts', value: notes.filter(n => !n.content).length, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  return (
    <MainLayout>
      <div className="space-y-12 pb-20">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest"
            >
              <Wand2 className="w-3 h-3" /> AI Workspace Active
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Knowledge</span> Hub
            </h1>
            <p className="text-foreground/40 text-lg max-w-lg">Capture ideas, summarize with AI, and organize your digital life seamlessly.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="primary flex items-center justify-center gap-3 px-8 py-4 shadow-2xl shadow-primary/30 text-base group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
            <span>Create New Note</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden glass p-6 rounded-[2rem] border border-border hover:border-primary/20 transition-all group cursor-default"
            >
              <div className="flex items-center justify-between relative z-10">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-black text-foreground">{stat.value}</div>
              </div>
              <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.2em] mt-6 relative z-10">{stat.label}</p>
              
              {/* Decorative background shape */}
              <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-full ${stat.bg} blur-3xl group-hover:scale-150 transition-transform duration-700`} />
            </motion.div>
          ))}
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search through notes, tags, or content..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-foreground/5 border border-border rounded-[2rem] focus:ring-primary/20 focus:bg-foreground/10 transition-all text-foreground placeholder:text-foreground/20 text-lg"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-foreground/5 px-6 py-4 rounded-[2rem] border border-border hover:border-primary/20 transition-all">
              <Layers className="w-5 h-5 text-foreground/20" />
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-foreground focus:ring-0 cursor-pointer min-w-[120px]"
              >
                <option value="All">All Categories</option>
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Ideas">Ideas</option>
              </select>
            </div>

            <div className="flex items-center gap-3 bg-foreground/5 px-6 py-4 rounded-[2rem] border border-border hover:border-primary/20 transition-all">
              <SortAsc className="w-5 h-5 text-foreground/20" />
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent border-none text-sm font-bold text-foreground focus:ring-0 cursor-pointer min-w-[120px]"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">A - Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map(n => <NoteCardSkeleton key={n} />)
            ) : notes.length > 0 ? (
              notes.map((note) => (
                <NoteCard 
                  key={note._id} 
                  note={note} 
                  onClick={() => navigate(`/note/${note._id}`)}
                  onArchive={toggleArchive}
                  onDelete={deleteNote}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full py-32 flex flex-col items-center justify-center text-center glass rounded-[3rem] border-dashed border-2 border-border"
              >
                {search ? (
                  <>
                    <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center mb-8"><SearchX className="w-12 h-12 text-foreground/10" /></div>
                    <h3 className="text-2xl font-bold text-foreground">No matches found</h3>
                    <p className="text-foreground/40 mt-3 text-lg">Try adjusting your keywords or clearing filters.</p>
                    <button onClick={() => {setSearch(''); setCategory('All');}} className="mt-8 text-primary font-bold hover:underline">Clear all search filters</button>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center mb-8"><FileText className="w-12 h-12 text-foreground/10" /></div>
                    <h3 className="text-2xl font-bold text-foreground">Your workspace is ready</h3>
                    <p className="text-foreground/40 mt-3 text-lg">Start your journey by creating an AI-powered note.</p>
                    <button onClick={() => setIsModalOpen(true)} className="primary mt-10 !w-auto px-12 py-4">Create Your First Note</button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CreateNoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
