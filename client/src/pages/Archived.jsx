import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Archive, ArrowLeft, RefreshCw, Trash2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NoteCard from '../components/NoteCard';
import NoteCardSkeleton from '../components/NoteCardSkeleton';
import useNoteStore from '../store/noteStore';

const Archived = () => {
  const navigate = useNavigate();
  const { archivedNotes, isLoading, fetchArchivedNotes, toggleArchive, deleteNote } = useNoteStore();

  useEffect(() => {
    fetchArchivedNotes();
  }, [fetchArchivedNotes]);

  return (
    <MainLayout>
      <div className="space-y-10 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-foreground/5 rounded-xl text-foreground/40 hover:text-foreground transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
              <Archive className="w-8 h-8 text-orange-400" /> Archived Notes
            </h1>
            <p className="text-foreground/40 mt-1">Manage and restore your hidden thoughts.</p>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1, 2, 3].map(n => <NoteCardSkeleton key={n} />)
          ) : archivedNotes.length > 0 ? (
            <AnimatePresence>
              {archivedNotes.map((note) => (
                <NoteCard 
                  key={note._id} 
                  note={note} 
                  onClick={() => navigate(`/note/${note._id}`)}
                  onArchive={toggleArchive}
                  onDelete={deleteNote}
                />
              ))}
            </AnimatePresence>
          ) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center glass rounded-3xl border-dashed border-2 border-border">
              <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-6">
                <Archive className="w-10 h-10 text-foreground/10" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">No archived notes</h3>
              <p className="text-foreground/40 mt-2 max-w-sm mx-auto px-6">
                Notes you archive will appear here. You can restore them to your dashboard anytime.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="px-8 py-3 rounded-xl bg-foreground/5 border border-border text-foreground font-medium hover:bg-foreground/10 transition-all mt-8"
              >
                Go to Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Archived;
