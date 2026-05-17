import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FileText, 
  Archive, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Tag as TagIcon,
  Loader2,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/apiService';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#3b82f6'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const statsCards = [
    { label: 'Total Notes', value: data.totalNotes, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Archived', value: data.archivedNotes, icon: Archive, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'AI Insights', value: data.totalAiUsage, icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Productivity', value: 'High', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <MainLayout>
      <div className="space-y-10 pb-20">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Productivity <span className="text-primary italic">Analytics</span></h1>
          <p className="text-white/40 mt-1">Track your growth and AI-powered insights over time.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold text-white/20 uppercase tracking-widest">Active</div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-white/40 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Activity */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-3xl border border-white/10 flex flex-col h-[400px]"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Weekly Activity
              </h3>
              <div className="text-[10px] uppercase font-bold text-white/20 tracking-widest">Last 7 Days</div>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.weeklyActivity}>
                  <defs>
                    <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff20" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="notes" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorNotes)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Tags */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-3xl border border-white/10 flex flex-col h-[400px]"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-purple-400" /> Topic Distribution
              </h3>
            </div>
            <div className="flex-1 flex items-center gap-8">
              <div className="flex-1 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.topTags}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="_id"
                    >
                      {data.topTags.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-4">
                {data.topTags.map((tag, i) => (
                  <div key={tag._id} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-sm font-medium text-white/60">{tag._id}</span>
                    <span className="text-xs font-bold text-white/20 ml-auto">{tag.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recently Edited Notes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-8 rounded-3xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" /> Recently Edited Notes
            </h3>
            <Link to="/dashboard" className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.recentNotes && data.recentNotes.length > 0 ? (
              data.recentNotes.map((note) => (
                <Link 
                  key={note._id} 
                  to={`/note/${note._id}`}
                  className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all flex flex-col gap-3 group"
                >
                  <h4 className="font-bold text-white truncate group-hover:text-primary transition-colors">{note.title}</h4>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{note.category}</span>
                    <span className="text-xs text-white/30">{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-white/40 italic">No recent notes found.</div>
            )}
          </div>
        </motion.div>

        {/* AI Stats Detail */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/5 to-purple-500/5"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" /> AI Assistance Overview
              </h3>
              <p className="text-white/40 leading-relaxed">
                You've engaged with Peblo's AI tools <span className="text-white font-bold">{data.totalAiUsage} times</span> this week. 
                Our GPT-4 engine has saved you approximately <span className="text-primary font-bold">{(data.totalAiUsage * 2).toFixed(1)} minutes</span> of manual summarizing and organizing.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-8 py-4 glass border border-white/10 rounded-2xl">
                <p className="text-3xl font-bold text-white">{(data.totalAiUsage / (data.totalNotes || 1)).toFixed(1)}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Avg AI Per Note</p>
              </div>
              <div className="text-center px-8 py-4 glass border border-white/10 rounded-2xl">
                <p className="text-3xl font-bold text-emerald-400">89%</p>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Accuracy Score</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
