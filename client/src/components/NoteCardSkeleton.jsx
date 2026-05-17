import React from 'react';

const NoteCardSkeleton = () => (
  <div className="glass p-6 rounded-2xl border border-white/10 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-6 w-3/4 bg-white/5 rounded-lg"></div>
      <div className="h-8 w-8 bg-white/5 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 w-full bg-white/5 rounded"></div>
      <div className="h-4 w-full bg-white/5 rounded"></div>
      <div className="h-4 w-2/3 bg-white/5 rounded"></div>
    </div>
    <div className="mt-6 flex gap-2">
      <div className="h-6 w-16 bg-white/5 rounded-full"></div>
      <div className="h-6 w-16 bg-white/5 rounded-full"></div>
    </div>
  </div>
);

export default NoteCardSkeleton;
