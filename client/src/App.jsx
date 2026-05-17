import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Archived from './pages/Archived';
import Shared from './pages/Shared';
import NoteEditor from './pages/NoteEditor';
import PublicNote from './pages/PublicNote';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import PageTransition from './components/PageTransition';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import { useEffect } from 'react';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore();
  return token ? children : <Navigate to="/login" replace />;
};

const AuthRoute = ({ children }) => {
  const { token } = useAuthStore();
  return !token ? children : <Navigate to="/dashboard" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Landing Page */}
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/archived" element={<ProtectedRoute><PageTransition><Archived /></PageTransition></ProtectedRoute>} />
        <Route path="/shared" element={<ProtectedRoute><PageTransition><Shared /></PageTransition></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><PageTransition><Analytics /></PageTransition></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        <Route path="/note/:id" element={<ProtectedRoute><PageTransition><NoteEditor /></PageTransition></ProtectedRoute>} />

        {/* Public Shared Notes (Accessible to everyone) */}
        <Route path="/share/:shareId" element={<PageTransition><PublicNote /></PageTransition>} />

        {/* Auth Routes */}
        <Route path="/login" element={<AuthRoute><PageTransition><Login /></PageTransition></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><PageTransition><Register /></PageTransition></AuthRoute>} />

        {/* Catch-all */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const { isDark } = useThemeStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontSize: '14px',
            padding: '12px 20px',
          },
          success: {
            iconTheme: { primary: '#6366f1', secondary: '#fff' },
          },
        }}
      />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
