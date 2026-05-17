import { create } from 'zustand';
import api from '../services/apiService';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData, token: token, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Register
  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData, token: token, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Update Profile
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/auth/profile', profileData);
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData, token: token, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Delete Account
  deleteAccount: async (password) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete('/auth/account', { data: { password } });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isLoading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Account deletion failed';
      set({ error: message, isLoading: false });
      return { success: false, message };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  // Clear errors
  clearError: () => set({ error: null }),
}));

export default useAuthStore;

