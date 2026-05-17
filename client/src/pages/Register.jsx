import React, { useState } from 'react';
import pebloLogo from '../assets/peblo_logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      return toast.error('Please fill in all fields');
    }

    const res = await register(name, email, password);
    if (res.success) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background Decor (Matching Landing) */}
      <div className="fixed inset-0 z-0 bg-background" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="liquid-glass p-10 rounded-[2.5rem] w-full max-w-md relative z-10"
      >
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center mb-10 mt-4">
          <div className="flex flex-col items-center mb-2">
            <img src={pebloLogo} alt="Peblo" className="w-12 h-12 object-contain mb-2" />
            <div 
              className="text-2xl tracking-tight text-foreground"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Peblo
            </div>
          </div>
          <h1 
            className="text-4xl font-normal text-white mb-2"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Begin Journey
          </h1>
          <p className="text-muted-foreground text-sm">Create your space for sharp focus.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Your Name"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-white/10"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="name@example.com"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-white/10"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-white/10"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-white text-slate-950 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-8 text-muted-foreground text-sm">
          Already a rebel?{' '}
          <Link to="/login" className="text-foreground hover:underline font-bold">
            Sign in here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
