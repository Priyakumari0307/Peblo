import { create } from 'zustand';
import api from '../services/apiService';

const useNoteStore = create((set, get) => ({
  notes: [],
  archivedNotes: [],
  currentNote: null,
  isLoading: false,
  isSaving: false,
  error: null,

  fetchNotes: async (params = {}) => {
    set({ isLoading: true });
    try {
      // Build query string from params
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/notes?${queryString}`);
      set({ notes: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch notes', isLoading: false });
    }
  },

  fetchArchivedNotes: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/notes/archived');
      set({ archivedNotes: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch archived notes', isLoading: false });
    }
  },

  createNote: async (noteData) => {
    try {
      const response = await api.post('/notes', noteData);
      set((state) => ({ notes: [response.data, ...state.notes] }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create note' });
      return null;
    }
  },

  updateNote: async (id, noteData) => {
    set({ isSaving: true });
    
    // Optimistic Update
    const previousNotes = get().notes;
    set((state) => ({
      notes: state.notes.map((n) => (n._id === id ? { ...n, ...noteData } : n)),
    }));

    try {
      const response = await api.put(`/notes/${id}`, noteData);
      set({ isSaving: false });
      return response.data;
    } catch (error) {
      set({ notes: previousNotes, isSaving: false, error: 'Failed to save changes' });
      return null;
    }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((n) => n._id !== id),
        archivedNotes: state.archivedNotes.filter((n) => n._id !== id),
      }));
    } catch (error) {
      set({ error: 'Failed to delete note' });
    }
  },

  toggleArchive: async (id) => {
    try {
      const response = await api.patch(`/notes/${id}/archive`);
      const updatedNote = response.data;

      if (updatedNote.isArchived) {
        set((state) => ({
          notes: state.notes.filter((n) => n._id !== id),
          archivedNotes: [updatedNote, ...state.archivedNotes],
        }));
      } else {
        set((state) => ({
          archivedNotes: state.archivedNotes.filter((n) => n._id !== id),
          notes: [updatedNote, ...state.notes],
        }));
      }
    } catch (error) {
      set({ error: 'Failed to archive note' });
    }
  },

  setCurrentNote: (note) => set({ currentNote: note }),
}));

export default useNoteStore;
