import React, { useState } from 'react';
import { Search, Moon, Sun, Menu, ChevronDown, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

const Navbar = ({ onMenuClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { isDark, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleNav = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  return (
    <header className="h-20 glass border-b border-border px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-foreground/5 rounded-lg text-foreground/60">
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Search Bar */}
        <div className="relative max-w-md w-full hidden md:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search notes, tags, or content..." 
            className="w-full pl-11 pr-4 py-2.5 bg-foreground/5 border border-border rounded-xl focus:ring-primary/20 focus:bg-foreground/10 transition-all text-foreground"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-foreground/5 text-[10px] text-foreground/40">⌘</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-foreground/5 text-[10px] text-foreground/40">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2.5 hover:bg-foreground/5 rounded-xl text-foreground/60 hover:text-foreground transition-colors border border-foreground/5"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>



        {/* User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1.5 hover:bg-foreground/5 rounded-2xl transition-all border border-transparent hover:border-border"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center font-bold text-sm text-primary-foreground shadow-lg shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="hidden sm:block text-left mr-1">
              <p className="text-sm font-semibold text-foreground leading-tight">{user?.name}</p>
              <p className="text-[11px] text-foreground/40 leading-tight">{user?.jobTitle || 'Workspace Admin'}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-foreground/40 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 glass border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                {/* User info header */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-foreground/40 truncate">{user?.email}</p>
                </div>
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => handleNav('/profile')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-foreground/5 rounded-xl text-sm text-foreground/80 hover:text-foreground transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>
                  <button
                    onClick={() => handleNav('/profile')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-foreground/5 rounded-xl text-sm text-foreground/80 hover:text-foreground transition-colors"
                  >
                    <SettingsIcon className="w-4 h-4" /> Account Settings
                  </button>
                  <div className="h-px bg-border my-1 mx-2" />
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-500/10 rounded-xl text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

