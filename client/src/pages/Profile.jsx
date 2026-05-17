import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Briefcase, FileText, Camera, Save, Lock,
  Trash2, AlertTriangle, Eye, EyeOff, ArrowLeft, Check,
  Shield, Loader2, X
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import useAuthStore from '../store/authStore';
import useNoteStore from '../store/noteStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, deleteAccount, logout } = useAuthStore();
  const { notes } = useNoteStore();
  const fileInputRef = useRef(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    jobTitle: user?.jobTitle || '',
    avatar: user?.avatar || null,
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // UI states
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [showDeletePw, setShowDeletePw] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password' | 'danger'

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileForm((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setProfileForm((prev) => ({ ...prev, avatar: null }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const result = await updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      bio: profileForm.bio,
      jobTitle: profileForm.jobTitle,
      avatar: profileForm.avatar,
    });
    setIsSavingProfile(false);
    if (result.success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(result.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    if (passwordForm.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setIsSavingPassword(true);
    const result = await updateProfile({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    setIsSavingPassword(false);
    if (result.success) {
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(result.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return toast.error('Please enter your password');
    setIsDeletingAccount(true);
    const result = await deleteAccount(deletePassword);
    setIsDeletingAccount(false);
    if (result.success) {
      toast.success('Account deleted. Goodbye!');
      logout();
      navigate('/');
    } else {
      toast.error(result.message || 'Failed to delete account');
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'danger', label: 'Danger Zone', icon: Shield },
  ];

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-8 pb-20">

        {/* Page Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl hover:bg-foreground/5 text-foreground/50 hover:text-foreground transition-all border border-border"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-foreground">Account</h1>
            <p className="text-foreground/40 text-sm mt-0.5">Manage your profile and settings</p>
          </div>
        </div>

        {/* Avatar + Name Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl border border-border p-8 flex flex-col sm:flex-row items-center gap-6"
        >
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-primary/20">
              {profileForm.avatar ? (
                <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-3xl font-black text-white">
                  {initials}
                </div>
              )}
            </div>
            {/* Overlay buttons */}
            <div className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
                title="Upload photo"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
              {profileForm.avatar && (
                <button
                  onClick={handleRemoveAvatar}
                  className="p-1.5 bg-red-500/50 rounded-lg hover:bg-red-500/70 transition-all"
                  title="Remove photo"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-black text-foreground">{user?.name}</h2>
            <p className="text-foreground/50 text-sm">{user?.email}</p>
            {user?.jobTitle && <p className="text-primary text-sm font-medium mt-1">{user.jobTitle}</p>}
            {user?.bio && <p className="text-foreground/60 text-sm mt-2 max-w-sm">{user.bio}</p>}
            <div className="flex gap-4 mt-4 justify-center sm:justify-start">
              <div className="text-center">
                <p className="text-xl font-black text-foreground">{notes.length}</p>
                <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Notes</p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="text-xl font-black text-foreground">{notes.filter(n => n.summary).length}</p>
                <p className="text-[10px] text-foreground/40 uppercase tracking-widest">AI Used</p>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <p className="text-xl font-black text-foreground">{notes.filter(n => n.isPublic).length}</p>
                <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Shared</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground/5 border border-border text-sm font-semibold text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-all"
          >
            <Camera className="w-4 h-4" /> Change Photo
          </button>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-foreground/5 border border-border rounded-2xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm border border-border'
                  : 'text-foreground/50 hover:text-foreground'
              } ${tab.id === 'danger' && activeTab === tab.id ? '!text-red-500' : ''}`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <form onSubmit={handleSaveProfile} className="glass rounded-3xl border border-border p-8 space-y-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Personal Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/60 flex items-center gap-2">
                      <User className="w-4 h-4" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-foreground/5 text-foreground focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/60 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-foreground/5 text-foreground focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/60 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" /> Job Title
                    </label>
                    <input
                      type="text"
                      value={profileForm.jobTitle}
                      onChange={(e) => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-foreground/5 text-foreground focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-semibold text-foreground/60 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Bio
                      <span className="ml-auto text-xs text-foreground/30">{profileForm.bio.length}/200</span>
                    </label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      maxLength={200}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-foreground/5 text-foreground focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all resize-none"
                      placeholder="Tell us a little about yourself..."
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="primary flex items-center gap-2 px-6 py-3 disabled:opacity-50"
                  >
                    {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <motion.div key="password" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <form onSubmit={handleChangePassword} className="glass rounded-3xl border border-border p-8 space-y-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" /> Change Password
                </h3>

                {[
                  { label: 'Current Password', key: 'currentPassword', show: showCurrentPw, toggle: () => setShowCurrentPw(!showCurrentPw) },
                  { label: 'New Password', key: 'newPassword', show: showNewPw, toggle: () => setShowNewPw(!showNewPw) },
                  { label: 'Confirm New Password', key: 'confirmPassword', show: showConfirmPw, toggle: () => setShowConfirmPw(!showConfirmPw) },
                ].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-semibold text-foreground/60">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.show ? 'text' : 'password'}
                        value={passwordForm[field.key]}
                        onChange={(e) => setPasswordForm({ ...passwordForm, [field.key]: e.target.value })}
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-foreground/5 text-foreground focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={field.toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-foreground/40 hover:text-foreground transition-colors"
                      >
                        {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="primary flex items-center gap-2 px-6 py-3 disabled:opacity-50"
                  >
                    {isSavingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {isSavingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <motion.div key="danger" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="glass rounded-3xl border border-red-500/20 p-8 space-y-6">
                <h3 className="text-lg font-bold text-red-500 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Danger Zone
                </h3>
                <p className="text-foreground/50 text-sm leading-relaxed">
                  Deleting your account is permanent. All your notes, AI insights, and data will be
                  erased immediately and cannot be recovered.
                </p>

                <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-foreground">Delete Account</p>
                    <p className="text-sm text-foreground/40 mt-0.5">Permanently delete your account and all {notes.length} notes</p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 font-semibold text-sm hover:bg-red-500/20 transition-all shrink-0"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md glass border border-red-500/30 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 bg-red-500/20 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Delete Account?</h2>
                  <p className="text-sm text-foreground/40">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-sm text-foreground/60 mt-4 mb-6 leading-relaxed">
                All <strong className="text-foreground">{notes.length} notes</strong>, AI insights, and your profile
                data will be permanently deleted. Enter your password to confirm.
              </p>

              <div className="space-y-2 mb-6">
                <label className="text-sm font-semibold text-foreground/60">Your Password</label>
                <div className="relative">
                  <input
                    type={showDeletePw ? 'text' : 'password'}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-red-500/30 bg-red-500/5 text-foreground focus:ring-2 focus:ring-red-500/30 focus:outline-none transition-all"
                    placeholder="Enter password to confirm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePw(!showDeletePw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-foreground/40 hover:text-foreground"
                  >
                    {showDeletePw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }}
                  className="flex-1 py-3 rounded-xl bg-foreground/5 border border-border text-foreground font-semibold hover:bg-foreground/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount || !deletePassword}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-50"
                >
                  {isDeletingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {isDeletingAccount ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default Profile;
