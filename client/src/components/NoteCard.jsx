import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Archive, 
  Trash2, 
  Clock, 
  Tag,
  Sparkles
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NoteCard = ({ note, onClick, onArchive, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => onClick(note)}
      className="group relative bg-foreground/5 backdrop-blur-xl rounded-[2rem] p-6 border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer flex flex-col h-full shadow-lg hover:shadow-primary/10"
    >
      {/* AI Indicator */}
      {note.summary && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 z-10">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
      )}

      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
              {note.category}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-foreground/30 font-bold uppercase mt-0.5">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onArchive(note._id); }}
            className="p-2 hover:bg-foreground/10 rounded-xl text-foreground/40 hover:text-foreground transition-colors"
          >
            <Archive className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(note._id); }}
            className="p-2 hover:bg-red-500/10 rounded-xl text-foreground/40 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-1 leading-tight group-hover:text-primary transition-colors">
        {note.title}
      </h3>
      
      <p className="text-foreground/50 text-sm line-clamp-3 leading-relaxed flex-1">
        {note.content || 'Start writing your thoughts...'}
      </p>

      {/* Footer Tags */}
      {note.tags?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {note.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="px-3 py-1 rounded-full bg-foreground/5 border border-border text-[10px] text-foreground/40 font-bold flex items-center gap-1.5">
              <Tag className="w-2 h-2" /> {tag}
            </span>
          ))}
          {note.tags.length > 2 && (
            <span className="px-2 py-1 rounded-full bg-foreground/5 text-[10px] text-foreground/20 font-bold">
              +{note.tags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Hover Background Glow */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 rounded-[2rem] transition-opacity pointer-events-none -z-10" />
    </motion.div>
  );
};

export default NoteCard;
