import React from 'react';
import pebloLogo from '../assets/peblo_logo.png';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Archive, 
  Settings, 
  Plus, 
  Search, 
  LogOut, 
  Sparkles,
  ChevronRight,
  X,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FileText, label: 'My Notes', path: '/dashboard' },
    { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
    { icon: Archive, label: 'Archived', path: '/archived' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[40] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[50]
        w-72 glass border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 px-8 flex items-center justify-between border-b border-border">
            <div 
              className="text-2xl tracking-tight text-foreground flex items-center gap-2.5 cursor-pointer"
              style={{ fontFamily: "'Instrument Serif', serif" }}
              onClick={() => navigate('/')}
            >
              <img src={pebloLogo} alt="Peblo" className="w-8 h-8 object-contain" />
              Peblo
            </div>
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-foreground/5 rounded-lg text-foreground/40">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            <div className="px-4 mb-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30">Main Menu</p>
            </div>
            
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3 rounded-xl transition-all group
                  ${isActive 
                    ? 'bg-foreground/5 text-foreground shadow-sm' 
                    : 'text-foreground/40 hover:bg-foreground/5 hover:text-foreground'}
                `}
              >
                <item.icon className={`w-5 h-5 transition-colors ${location.pathname === item.path ? 'text-primary' : 'group-hover:text-primary'}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="activeTab"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                  />
                )}
              </NavLink>
            ))}
          </nav>

          {/* Upgrade Card / Workspace Stats */}
          <div className="px-6 py-6 border-t border-border">
            <div className="p-5 rounded-2xl bg-foreground/5 border border-border relative overflow-hidden group">
              <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
              <h4 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Pro Plan
              </h4>
              <p className="text-[11px] text-foreground/40 mb-4 leading-relaxed">Unlock advanced AI analysis and cloud sync.</p>
              <button className="w-full py-2.5 rounded-xl bg-foreground text-background text-[11px] font-bold hover:scale-[1.02] transition-transform active:scale-95">
                Upgrade Now
              </button>
            </div>
            
            <button 
              onClick={logout}
              className="w-full mt-6 flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/40 hover:bg-red-500/5 hover:text-red-400 transition-all text-sm font-medium"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
