import React, { useState, useEffect, useRef } from 'react';
import { Product, GroupLink } from '../../data/storeData';
import { VerifiedBadge } from '../VerifiedBadge';
import {
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Package,
  Settings,
  Users,
  BarChart3,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Search,
  Save,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Zap,
  RotateCcw,
  Wrench,
  Megaphone,
  Download,
  Upload,
  Copy,
  Check,
  MessageCircle,
  Flame,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  KeyRound,
  ShieldAlert,
  Sliders,
  DollarSign,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';

export interface StoreSettings {
  brandName: string;
  waNumber: string;
  operationalHours: string;
  logoUrl: string;
  bannerUrl: string;
  guaranteeText: string;
  isMaintenanceMode?: boolean;
  maintenanceTitle?: string;
  maintenanceMessage?: string;
  maintenanceEta?: string;
  storeStatus?: 'open' | 'closed' | 'restock';
  announcementText?: string;
  showAnnouncement?: boolean;
}

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  storeSettings: StoreSettings;
  onUpdateStoreSettings: (settings: StoreSettings) => void;
  groups: GroupLink[];
  onUpdateGroups: (groups: GroupLink[]) => void;
  onResetToDefault: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  storeSettings,
  onUpdateStoreSettings,
  groups,
  onUpdateGroups,
  onResetToDefault
}) => {
  // Authentication State with Email and Password
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('pionz_admin_session') === 'true';
  });

  const [storedEmail, setStoredEmail] = useState(() => {
    return localStorage.getItem('pionz_admin_email') || 'admin@pionzstore.com';
  });

  const [storedPassword, setStoredPassword] = useState(() => {
    return localStorage.getItem('pionz_admin_password') || 'admin123';
  });

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'maintenance' | 'store' | 'groups' | 'security'>('dashboard');

  // Search & Filter in Products tab
  const [adminSearch, setAdminSearch] = useState('');
  const [filterStock, setFilterStock] = useState<'all' | 'ready' | 'sold' | 'flash'>('all');

  // Product Edit / Add form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [specInput, setSpecInput] = useState('');

  // Group Edit / Add form state
  const [editingGroup, setEditingGroup] = useState<GroupLink | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Temporary Store Settings Form
  const [tempStoreSettings, setTempStoreSettings] = useState<StoreSettings>(storeSettings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Security Credentials Update Form
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [credChangeMsg, setCredChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Tool: WhatsApp Generator state in Dashboard
  const [selectedProductForWA, setSelectedProductForWA] = useState<string>(products[0]?.id || '');
  const [waCopied, setWaCopied] = useState(false);

  // File input ref for restore
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setTempStoreSettings(storeSettings);
  }, [storeSettings]);

  useEffect(() => {
    if (products.length > 0 && !selectedProductForWA) {
      setSelectedProductForWA(products[0].id);
    }
  }, [products, selectedProductForWA]);

  if (!isOpen) return null;

  // Handle Login with Email and Password
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanInputEmail = loginEmail.trim().toLowerCase();
    const cleanStoredEmail = storedEmail.trim().toLowerCase();

    if (cleanInputEmail === cleanStoredEmail && loginPassword === storedPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('pionz_admin_session', 'true');
      setLoginError('');
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setLoginError('Email atau password admin salah. Silakan periksa kembali.');
    }
  };

  // Quick fill default credentials for convenience
  const handleQuickFill = () => {
    setLoginEmail(storedEmail);
    setLoginPassword(storedPassword);
    setLoginError('');
  };

  // Reset Credentials to Factory Default
  const handleResetCredentials = () => {
    if (window.confirm('Reset kredensial login admin ke default (admin@pionzstore.com / admin123)?')) {
      const defaultEmail = 'admin@pionzstore.com';
      const defaultPass = 'admin123';
      localStorage.setItem('pionz_admin_email', defaultEmail);
      localStorage.setItem('pionz_admin_password', defaultPass);
      setStoredEmail(defaultEmail);
      setStoredPassword(defaultPass);
      setLoginEmail(defaultEmail);
      setLoginPassword(defaultPass);
      setLoginError('');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('pionz_admin_session');
    onClose();
  };

  // Toggle Sold status
  const toggleProductSold = (id: string) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        const nextSold = !p.sold;
        return {
          ...p,
          sold: nextSold,
          soldPrice: nextSold ? (p.discountPrice || p.price) : null,
          soldAt: nextSold ? Date.now() : undefined
        };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  // Toggle Flash Sale
  const toggleFlashSale = (id: string) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, flash: !p.flash };
      }
      return p;
    });
    onUpdateProducts(updated);
  };

  // Delete Product
  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus akun "${name}" dari katalog?`)) {
      const updated = products.filter((p) => p.id !== id);
      onUpdateProducts(updated);
      if (editingProduct?.id === id) {
        setEditingProduct(null);
      }
    }
  };

  // Save (Create or Update) Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isCreatingProduct) {
      onUpdateProducts([editingProduct, ...products]);
    } else {
      const updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
      onUpdateProducts(updated);
    }

    setEditingProduct(null);
    setIsCreatingProduct(false);
  };

  // Save Store Settings
  const handleSaveStoreSettings = (e?: React.FormEvent, customSettings?: StoreSettings) => {
    if (e) e.preventDefault();
    const toSave = customSettings || tempStoreSettings;
    onUpdateStoreSettings(toSave);
    setSaveSuccessMsg('Pengaturan toko berhasil diperbarui!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Quick toggle Maintenance mode
  const handleToggleMaintenance = () => {
    const nextState = !storeSettings.isMaintenanceMode;
    const updated: StoreSettings = {
      ...storeSettings,
      isMaintenanceMode: nextState
    };
    onUpdateStoreSettings(updated);
    setTempStoreSettings(updated);
  };

  // Bulk Ready / Sold
  const handleMarkAllReady = () => {
    if (window.confirm('Tandai SEMUA akun sebagai READY (Tersedia)?')) {
      const updated = products.map(p => ({ ...p, sold: false }));
      onUpdateProducts(updated);
    }
  };

  const handleMarkAllSold = () => {
    if (window.confirm('Tandai SEMUA akun sebagai TERJUAL (SOLD)?')) {
      const updated = products.map(p => ({ ...p, sold: true }));
      onUpdateProducts(updated);
    }
  };

  // Download Backup JSON
  const handleDownloadBackup = () => {
    const backupData = {
      version: '3.0',
      brand: storeSettings.brandName,
      backupDate: new Date().toISOString(),
      storeSettings,
      products,
      groups
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${storeSettings.brandName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Restore Backup JSON
  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.products && Array.isArray(data.products)) {
          onUpdateProducts(data.products);
        }
        if (data.storeSettings) {
          onUpdateStoreSettings(data.storeSettings);
          setTempStoreSettings(data.storeSettings);
        }
        if (data.groups && Array.isArray(data.groups)) {
          onUpdateGroups(data.groups);
        }
        alert('Data cadangan berhasil dipulihkan!');
      } catch {
        alert('Format file cadangan tidak valid atau rusak.');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  // Save Group
  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup) return;

    if (isCreatingGroup) {
      onUpdateGroups([...groups, editingGroup]);
    } else {
      const updated = groups.map((g) => (g.id === editingGroup.id ? editingGroup : g));
      onUpdateGroups(updated);
    }

    setEditingGroup(null);
    setIsCreatingGroup(false);
  };

  // Delete Group
  const handleDeleteGroup = (id: string, name: string) => {
    if (window.confirm(`Hapus link grup "${name}"?`)) {
      onUpdateGroups(groups.filter((g) => g.id !== id));
      if (editingGroup?.id === id) setEditingGroup(null);
    }
  };

  // Handle Credentials Change (Email & Password)
  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredChangeMsg(null);

    // Verify current password
    if (currentPassword !== storedPassword) {
      setCredChangeMsg({ type: 'error', text: 'Password saat ini salah!' });
      return;
    }

    // Email update
    let updatedEmail = storedEmail;
    if (newEmail.trim()) {
      if (!newEmail.includes('@') || !newEmail.includes('.')) {
        setCredChangeMsg({ type: 'error', text: 'Format email baru tidak valid!' });
        return;
      }
      updatedEmail = newEmail.trim().toLowerCase();
    }

    // Password update
    let updatedPassword = storedPassword;
    if (newPassword) {
      if (newPassword.length < 6) {
        setCredChangeMsg({ type: 'error', text: 'Password baru minimal 6 karakter!' });
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setCredChangeMsg({ type: 'error', text: 'Konfirmasi password baru tidak cocok!' });
        return;
      }
      updatedPassword = newPassword;
    }

    localStorage.setItem('pionz_admin_email', updatedEmail);
    localStorage.setItem('pionz_admin_password', updatedPassword);
    setStoredEmail(updatedEmail);
    setStoredPassword(updatedPassword);

    setCredChangeMsg({ type: 'success', text: 'Kredensial login admin berhasil diperbarui!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setNewEmail('');
  };

  // Filtered Products for Products tab
  const filteredAdminProducts = products.filter((p) => {
    if (filterStock === 'ready' && p.sold) return false;
    if (filterStock === 'sold' && !p.sold) return false;
    if (filterStock === 'flash' && (!p.flash || p.sold)) return false;
    if (adminSearch.trim()) {
      const q = adminSearch.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCode = p.accountCode.toLowerCase().includes(q);
      if (!matchName && !matchCode) return false;
    }
    return true;
  });

  // Calculate Metrics
  const readyCount = products.filter((p) => !p.sold).length;
  const soldCount = products.filter((p) => p.sold).length;
  const flashCount = products.filter((p) => p.flash && !p.sold).length;
  const totalReadyValue = products
    .filter((p) => !p.sold)
    .reduce((sum, p) => sum + (p.discountPrice || p.price), 0);
  const totalSoldValue = products
    .filter((p) => p.sold)
    .reduce((sum, p) => sum + (p.discountPrice || p.price), 0);

  // Selected product for WhatsApp generator
  const currentWAProduct = products.find(p => p.id === selectedProductForWA) || products[0];

  const generateWAText = (p: Product) => {
    if (!p) return '';
    const price = p.discountPrice || p.price;
    return `🔥 *DETAIL AKUN ${p.game.toUpperCase()} - ${storeSettings.brandName.toUpperCase()}* 🔥%0A%0A` +
      `• *Kode Akun* : ${p.accountCode}%0A` +
      `• *Judul*     : ${p.name}%0A` +
      `• *Harga*     : Rp ${price.toLocaleString('id-ID')} (Garansi Resmi Anti HB)%0A` +
      `• *Status*    : ${p.sold ? '❌ SUDAH TERJUAL' : '✅ READY SIAP REBIND'}%0A%0A` +
      `*Spesifikasi Akun:*%0A` +
      p.specs.map(s => `• ${s}`).join('%0A') + `%0A%0A` +
      `🛡️ *Jaminan:* ${storeSettings.guaranteeText}%0A` +
      `Tertarik order akun ini sekarang, kak?`;
  };

  const handleCopyWAText = () => {
    if (!currentWAProduct) return;
    const rawText = generateWAText(currentWAProduct).replace(/%0A/g, '\n');
    navigator.clipboard.writeText(rawText);
    setWaCopied(true);
    setTimeout(() => setWaCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#060911]/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* Hidden file input for restore JSON */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleRestoreBackup}
        accept=".json"
        className="hidden"
      />

      {/* ======================================================== */}
      {/* 1. LOGIN WITH EMAIL & PASSWORD (ENTERPRISE HIGH-END UI) */}
      {/* ======================================================== */}
      {!isAuthenticated ? (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative bg-[#0d1322] border border-slate-700/80 text-slate-100 w-full max-w-md rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-y-auto max-h-[92vh] flex flex-col font-sans p-6 sm:p-8 my-auto space-y-6 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Close X Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors z-10"
            title="Tutup Panel"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Brand Header */}
          <div className="text-center space-y-3 relative z-10">
            <div className="relative mx-auto w-20 h-20">
              <img 
                src={storeSettings.logoUrl} 
                alt={storeSettings.brandName}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://cdn.phototourl.com/free/2026-08-14-3ae483b8-50e8-4aa2-891e-04031dfc30a6.jpg';
                }}
                className="w-full h-full rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-2xl"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#0d1322] rounded-full p-1.5 border border-slate-700 shadow-md">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1.5">
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                  Admin Portal
                </h2>
                <VerifiedBadge size={18} />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Akses Privat Pengelolaan Toko {storeSettings.brandName}
              </p>
            </div>
          </div>

          {/* Login Form with Email & Password */}
          <form onSubmit={handleLogin} className="space-y-4 text-left relative z-10">
            
            {/* Email Field */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Email Administrator:</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoFocus
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="admin@pionzstore.com"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500 font-medium"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>Password:</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="Masukkan password..."
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500 font-medium"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {loginError && (
                <div className="mt-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>Masuk ke Dashboard</span>
              </button>

              {/* Quick Preset Login for Ease of Use */}
              <button
                type="button"
                onClick={handleQuickFill}
                className="w-full py-2 bg-slate-800/80 hover:bg-slate-700/80 text-blue-300 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Gunakan Kredensial Tersimpan</span>
              </button>
            </div>

            {/* Forgot / Reset Credentials */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={handleResetCredentials}
                className="text-[11px] text-slate-400 hover:text-rose-400 underline transition-colors"
              >
                Lupa Password? Reset ke Kredensial Awal
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* ======================================================== */
        /* 2. AUTHENTICATED ULTRA-PREMIER SAAS ADMIN DASHBOARD */
        /* ======================================================== */
        <div 
          onClick={(e) => e.stopPropagation()}
          className="relative bg-[#090d16] border border-slate-800 text-slate-100 w-full max-w-6xl rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden my-auto max-h-[94vh] flex flex-col font-sans"
        >
          {/* Top Luxury Navigation Header */}
          <div className="px-4 sm:px-7 py-3.5 bg-[#0f172a]/90 border-b border-slate-800/90 flex items-center justify-between gap-3 shrink-0 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={storeSettings.logoUrl} 
                  alt={storeSettings.brandName} 
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://cdn.phototourl.com/free/2026-08-14-3ae483b8-50e8-4aa2-891e-04031dfc30a6.jpg';
                  }}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/30 shadow shrink-0"
                />
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                  storeSettings.isMaintenanceMode ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></span>
              </div>

              <div>
                <div className="flex items-center gap-2 leading-none">
                  <h3 className="font-heading font-extrabold text-sm sm:text-base text-white tracking-tight">
                    {storeSettings.brandName} Management Studio
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hidden sm:inline-block">
                    v3.0 Pro
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-slate-400 truncate">
                    Login sebagai: <strong className="text-slate-200">{storedEmail}</strong>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                    storeSettings.isMaintenanceMode 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {storeSettings.isMaintenanceMode ? 'Maintenance Aktif' : 'Toko Online'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Top Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                title="Keluar dari Panel Admin"
                className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-900/40 hover:text-rose-300 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700/60"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700/60"
                title="Tutup Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <div className="px-3 sm:px-7 border-b border-slate-800/80 bg-[#0b101d] flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0 pt-2.5">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setEditingProduct(null);
                setIsCreatingProduct(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-[#151f38] text-blue-400 border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard Analisis</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('products');
                setEditingProduct(null);
                setIsCreatingProduct(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'products'
                  ? 'bg-[#151f38] text-blue-400 border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Kelola Akun ({products.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('maintenance');
                setEditingProduct(null);
                setIsCreatingProduct(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'maintenance'
                  ? 'bg-[#151f38] text-amber-400 border-amber-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Mode Maintenance</span>
              {storeSettings.isMaintenanceMode && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('store');
                setEditingProduct(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'store'
                  ? 'bg-[#151f38] text-blue-400 border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Profil & Banner</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('groups');
                setEditingProduct(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'groups'
                  ? 'bg-[#151f38] text-blue-400 border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Link Grup WA</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('security');
                setEditingProduct(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-[#151f38] text-blue-400 border-blue-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Akun & Keamanan</span>
            </button>
          </div>

          {/* Main Body Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-7 bg-[#090d16] space-y-6">

            {/* ======================================================== */}
            {/* TAB 1: EXECUTIVE DASHBOARD & ANALYTICS */}
            {/* ======================================================== */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                
                {/* 1. Header KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                  
                  <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800/90 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/10 rounded-bl-3xl pointer-events-none"></div>
                    <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Total Akun</span>
                    <span className="font-heading font-extrabold text-2xl text-white block mt-1">{products.length}</span>
                    <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Katalog Free Fire</span>
                    </span>
                  </div>

                  <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800/90 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-600/10 rounded-bl-3xl pointer-events-none"></div>
                    <span className="text-[11px] font-bold text-emerald-400 block uppercase tracking-wider">Stok Ready</span>
                    <span className="font-heading font-extrabold text-2xl text-emerald-400 block mt-1">{readyCount}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">Siap Transaksi</span>
                  </div>

                  <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800/90 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-rose-600/10 rounded-bl-3xl pointer-events-none"></div>
                    <span className="text-[11px] font-bold text-rose-400 block uppercase tracking-wider">Terjual (Sold)</span>
                    <span className="font-heading font-extrabold text-2xl text-rose-400 block mt-1">{soldCount}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">Transaksi Sukses</span>
                  </div>

                  <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800/90 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-600/10 rounded-bl-3xl pointer-events-none"></div>
                    <span className="text-[11px] font-bold text-amber-400 block uppercase tracking-wider">Flash Sale</span>
                    <span className="font-heading font-extrabold text-2xl text-amber-400 block mt-1">{flashCount}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">Promo Berjalan</span>
                  </div>

                  <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800/90 shadow-sm sm:col-span-1">
                    <span className="text-[11px] font-bold text-blue-400 block uppercase tracking-wider">Valuasi Stok Ready</span>
                    <span className="font-heading font-extrabold text-lg sm:text-xl text-blue-300 block mt-1 truncate">
                      Rp {totalReadyValue.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">Aset Siap Jual</span>
                  </div>

                  <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800/90 shadow-sm sm:col-span-1">
                    <span className="text-[11px] font-bold text-purple-400 block uppercase tracking-wider">Omset Terjual</span>
                    <span className="font-heading font-extrabold text-lg sm:text-xl text-purple-300 block mt-1 truncate">
                      Rp {totalSoldValue.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">Akumulasi Penjualan</span>
                  </div>

                </div>

                {/* 2. Interactive Maintenance & Store Health Bar */}
                <div className="bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-800/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-amber-400" />
                        <span>Mode Maintenance & Keamanan Website</span>
                      </h4>
                      {storeSettings.isMaintenanceMode ? (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                          Aktif
                        </span>
                      ) : (
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          Toko Dibuka
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 max-w-xl">
                      {storeSettings.isMaintenanceMode 
                        ? 'Pengunjung biasa melihat tampilan layar pemeliharaan sistem. Anda tetap dapat mengedit akun selagi maintenance.' 
                        : 'Website aktif dan dapat dijelajahi pembeli. Nyalakan mode maintenance ketika Anda sedang restock besar-besaran.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleToggleMaintenance}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 active:scale-95 ${
                        storeSettings.isMaintenanceMode
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-amber-600 hover:bg-amber-500 text-white'
                      }`}
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{storeSettings.isMaintenanceMode ? 'Matikan Maintenance' : 'Aktifkan Maintenance'}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('maintenance')}
                      className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Konfigurasi Pesan
                    </button>
                  </div>
                </div>

                {/* 3. Quick Action Hub */}
                <div className="bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-800/90 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span>Aksi Cepat Inventaris</span>
                  </h4>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => {
                        setEditingProduct({
                          id: 'pz-' + Date.now(),
                          accountCode: 'PZ-FF' + (products.length + 101),
                          name: '',
                          game: 'Free Fire',
                          price: 250000,
                          discountPrice: null,
                          image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
                          images: [],
                          specs: ['Akun Old Season', 'Vault Sultan & Bundle Langka', 'Login Facebook Aman'],
                          badge: 'HOT',
                          rating: 5.0,
                          sold: false
                        });
                        setIsCreatingProduct(true);
                        setActiveTab('products');
                      }}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Tambah Akun Baru</span>
                    </button>

                    <button
                      onClick={handleMarkAllReady}
                      className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Set Semua Ready</span>
                    </button>

                    <button
                      onClick={handleMarkAllSold}
                      className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Set Semua Sold</span>
                    </button>

                    <button
                      onClick={handleDownloadBackup}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                      title="Unduh backup JSON data toko"
                    >
                      <Download className="w-4 h-4 text-blue-400" />
                      <span>Cadangkan Data (JSON)</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                      title="Pulihkan data toko dari file backup JSON"
                    >
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Pulihkan Data (JSON)</span>
                    </button>
                  </div>
                </div>

                {/* 4. WhatsApp Chat Format Generator */}
                <div className="bg-[#111827] p-4 sm:p-5 rounded-2xl border border-slate-800/90 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-heading font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>Generator Format Chat WhatsApp untuk Calon Pembeli</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Pilih akun untuk langsung membuat teks penawaran rapi siap kirim ke WhatsApp pembeli.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedProductForWA}
                        onChange={(e) => setSelectedProductForWA(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-xs font-semibold text-white px-3 py-2 rounded-xl outline-none focus:border-blue-500 max-w-xs"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            [{p.accountCode}] {p.name.substring(0, 28)}...
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={handleCopyWAText}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 active:scale-95 shrink-0"
                      >
                        {waCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{waCopied ? 'Tersalin!' : 'Salin Teks WA'}</span>
                      </button>
                    </div>
                  </div>

                  {currentWAProduct && (
                    <div className="bg-[#090d16] p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-36 overflow-y-auto">
                      {generateWAText(currentWAProduct).replace(/%0A/g, '\n')}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: PRODUCT INVENTORY MANAGEMENT */}
            {/* ======================================================== */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                
                {editingProduct ? (
                  /* PRODUCT EDIT / ADD FORM */
                  <form onSubmit={handleSaveProduct} className="bg-[#111827] p-5 sm:p-7 rounded-3xl border border-slate-800 space-y-4 max-w-3xl mx-auto shadow-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h4 className="font-heading font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-blue-400" />
                          <span>{isCreatingProduct ? 'Tambah Akun Baru ke Toko' : `Edit Akun #${editingProduct.accountCode}`}</span>
                        </h4>
                        <p className="text-xs text-slate-400">Pastikan informasi spesifikasi dan URL foto spek HD akurat.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          setIsCreatingProduct(false);
                        }}
                        className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-800 rounded-xl"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Kode Akun (Unik):
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.accountCode}
                          onChange={(e) => setEditingProduct({ ...editingProduct, accountCode: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono font-bold text-blue-400 outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Game:
                        </label>
                        <input
                          type="text"
                          disabled
                          value="Free Fire"
                          className="w-full px-3.5 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-semibold text-slate-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Judul Akun / Spesifikasi Utama:
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        placeholder="Contoh: FF Sultan Old Season 1 ft SG2 Rapper & Evo Scar Max"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Harga Normal (Rp):
                        </label>
                        <input
                          type="number"
                          required
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-white outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Harga Diskon / Promo (Opsional):
                        </label>
                        <input
                          type="number"
                          value={editingProduct.discountPrice || ''}
                          onChange={(e) => setEditingProduct({
                            ...editingProduct,
                            discountPrice: e.target.value ? Number(e.target.value) : null
                          })}
                          placeholder="Kosongkan jika harga normal"
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-emerald-400 outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">
                          Badge Label:
                        </label>
                        <select
                          value={editingProduct.badge || 'HOT'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white outline-none focus:border-blue-500"
                        >
                          <option value="HOT">HOT 🔥</option>
                          <option value="SULTAN">SULTAN 👑</option>
                          <option value="PELAJAR">PELAJAR 🎓</option>
                          <option value="OLD">OLD S1 ⚡</option>
                          <option value="MURMER">MURAH MERIAH 💎</option>
                        </select>
                      </div>
                    </div>

                    {/* Image URL Inputs */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center justify-between">
                        <span>URL Foto Utama (Resolusi HD):</span>
                        {editingProduct.image && (
                          <a href={editingProduct.image} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 text-[11px]">
                            <ExternalLink className="w-3 h-3" />
                            <span>Buka Foto</span>
                          </a>
                        )}
                      </label>
                      <input
                        type="url"
                        required
                        value={editingProduct.image}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        placeholder="https://... (URL foto spek vault / profil)"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    {/* Multi images URLs */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        URL Foto Tambahan Spek (Pisahkan dengan koma atau baris baru):
                      </label>
                      <textarea
                        rows={2}
                        value={(editingProduct.images || []).join('\n')}
                        onChange={(e) => {
                          const urls = e.target.value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
                          setEditingProduct({ ...editingProduct, images: urls });
                        }}
                        placeholder="https://... foto vault&#10;https://... foto evo gun"
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    {/* Specs Checklist */}
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Daftar Spesifikasi Akun:
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={specInput}
                          onChange={(e) => setSpecInput(e.target.value)}
                          placeholder="Tambah poin spek, misal: SG2 Rapper, Old S1..."
                          className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (specInput.trim()) {
                              setEditingProduct({
                                ...editingProduct,
                                specs: [...editingProduct.specs, specInput.trim()]
                              });
                              setSpecInput('');
                            }
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
                        >
                          + Tambah
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                        {editingProduct.specs.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-slate-800 text-slate-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-700"
                          >
                            <span>{spec}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newSpecs = editingProduct.specs.filter((_, idx) => idx !== sIdx);
                                setEditingProduct({ ...editingProduct, specs: newSpecs });
                              }}
                              className="text-slate-400 hover:text-rose-400 font-bold"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Status Checkboxes */}
                    <div className="flex items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={editingProduct.sold}
                          onChange={(e) => setEditingProduct({ ...editingProduct, sold: e.target.checked })}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-0 bg-slate-900 border-slate-700"
                        />
                        <span className="text-xs font-bold text-slate-200">Tandai Sudah Terjual (Sold)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!!editingProduct.flash}
                          onChange={(e) => setEditingProduct({ ...editingProduct, flash: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
                        />
                        <span className="text-xs font-bold text-slate-200">Aktifkan Flash Sale 🔥</span>
                      </label>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          setIsCreatingProduct(false);
                        }}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/30 flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>Simpan Akun</span>
                      </button>
                    </div>

                  </form>
                ) : (
                  /* PRODUCT LIST & TOOLBAR */
                  <div className="space-y-4">
                    
                    {/* Toolbar */}
                    <div className="bg-[#111827] p-3 sm:p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      
                      {/* Search */}
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Cari kode akun atau nama..."
                          value={adminSearch}
                          onChange={(e) => setAdminSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Stock filter */}
                      <div className="flex items-center gap-1.5 overflow-x-auto">
                        <button
                          onClick={() => setFilterStock('all')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            filterStock === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Semua ({products.length})
                        </button>
                        <button
                          onClick={() => setFilterStock('ready')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            filterStock === 'ready' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Ready ({readyCount})
                        </button>
                        <button
                          onClick={() => setFilterStock('flash')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            filterStock === 'flash' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Flash Sale ({flashCount})
                        </button>
                        <button
                          onClick={() => setFilterStock('sold')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            filterStock === 'sold' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          Sold ({soldCount})
                        </button>
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => {
                          setEditingProduct({
                            id: 'pz-' + Date.now(),
                            accountCode: 'PZ-FF' + (products.length + 101),
                            name: '',
                            game: 'Free Fire',
                            price: 250000,
                            discountPrice: null,
                            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
                            images: [],
                            specs: ['Akun Old Season', 'Vault Sultan & Bundle Langka', 'Login Facebook Aman'],
                            badge: 'HOT',
                            rating: 5.0,
                            sold: false
                          });
                          setIsCreatingProduct(true);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Tambah Akun</span>
                      </button>

                    </div>

                    {/* Products Table */}
                    <div className="bg-[#111827] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#090d16] text-slate-400 uppercase font-bold tracking-wider border-b border-slate-800">
                            <tr>
                              <th className="py-3 px-4">Akun & Kode</th>
                              <th className="py-3 px-4">Harga Normal / Promo</th>
                              <th className="py-3 px-4">Status & Flash</th>
                              <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/80 font-medium">
                            {filteredAdminProducts.length > 0 ? (
                              filteredAdminProducts.map((p) => {
                                const finalPrice = p.discountPrice || p.price;
                                return (
                                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-3">
                                        <img
                                          src={p.image}
                                          alt=""
                                          className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                                        />
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-1.5">
                                            <span className="font-mono text-xs font-black text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded">
                                              {p.accountCode}
                                            </span>
                                            {p.badge && (
                                              <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                                                {p.badge}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-white font-bold truncate max-w-xs mt-0.5">
                                            {p.name}
                                          </p>
                                        </div>
                                      </div>
                                    </td>

                                    <td className="py-3 px-4">
                                      <div className="space-y-0.5">
                                        <span className="font-mono font-extrabold text-white block">
                                          Rp {finalPrice.toLocaleString('id-ID')}
                                        </span>
                                        {p.discountPrice && (
                                          <span className="text-[10px] text-slate-500 line-through font-mono block">
                                            Rp {p.price.toLocaleString('id-ID')}
                                          </span>
                                        )}
                                      </div>
                                    </td>

                                    <td className="py-3 px-4">
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => toggleProductSold(p.id)}
                                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                            p.sold
                                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                          }`}
                                        >
                                          {p.sold ? 'SOLD OUT' : 'READY'}
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => toggleFlashSale(p.id)}
                                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                            p.flash
                                              ? 'bg-amber-500 text-slate-950 font-black'
                                              : 'bg-slate-800 text-slate-400 hover:text-white'
                                          }`}
                                        >
                                          ⚡ Flash
                                        </button>
                                      </div>
                                    </td>

                                    <td className="py-3 px-4 text-right">
                                      <div className="flex items-center justify-end gap-1.5">
                                        <button
                                          onClick={() => {
                                            setEditingProduct(p);
                                            setIsCreatingProduct(false);
                                          }}
                                          className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 transition-colors"
                                          title="Edit Akun"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteProduct(p.id, p.name)}
                                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 transition-colors"
                                          title="Hapus Akun"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={4} className="py-8 text-center text-slate-500">
                                  Tidak ada akun yang sesuai dengan filter pencarian.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 3: MAINTENANCE MODE CONTROLLER */}
            {/* ======================================================== */}
            {activeTab === 'maintenance' && (
              <div className="max-w-3xl mx-auto space-y-6">
                
                {/* Status Toggle Card */}
                <div className="bg-[#111827] p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-heading font-extrabold text-base sm:text-lg text-white">
                        Status Mode Maintenance
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Aktifkan jika website sedang diperbarui, restock akun baru, atau pemeliharaan server.
                      </p>
                    </div>

                    <button
                      onClick={handleToggleMaintenance}
                      className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 active:scale-95 ${
                        storeSettings.isMaintenanceMode
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <Wrench className="w-4 h-4" />
                      <span>{storeSettings.isMaintenanceMode ? 'Matikan (Buka Toko)' : 'Aktifkan Maintenance'}</span>
                    </button>
                  </div>
                </div>

                {/* Maintenance Customization Form */}
                <form onSubmit={handleSaveStoreSettings} className="bg-[#111827] p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                  <h4 className="font-heading font-extrabold text-sm sm:text-base text-white border-b border-slate-800 pb-3">
                    Konten Layar Pemeliharaan (Dilihat oleh Pengunjung)
                  </h4>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Judul Pemeliharaan:
                    </label>
                    <input
                      type="text"
                      value={tempStoreSettings.maintenanceTitle || ''}
                      onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, maintenanceTitle: e.target.value })}
                      placeholder="Pemeliharaan Sistem & Update Stok Akun Free Fire"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Pesan Pemberitahuan untuk Pengunjung:
                    </label>
                    <textarea
                      rows={3}
                      value={tempStoreSettings.maintenanceMessage || ''}
                      onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, maintenanceMessage: e.target.value })}
                      placeholder="Website sedang dalam pembaruan stok akun Free Fire sultan terbaru..."
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Estimasi Selesai (ETA):
                    </label>
                    <input
                      type="text"
                      value={tempStoreSettings.maintenanceEta || ''}
                      onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, maintenanceEta: e.target.value })}
                      placeholder="Estimasi Selesai: 15 - 30 Menit (Hari Ini)"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  {saveSuccessMsg && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Teks Pemeliharaan</span>
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 4: STORE PROFILE & BANNER SETTINGS */}
            {/* ======================================================== */}
            {activeTab === 'store' && (
              <form onSubmit={handleSaveStoreSettings} className="bg-[#111827] p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-5 max-w-3xl mx-auto">
                <div>
                  <h4 className="font-heading font-extrabold text-base sm:text-lg text-white">
                    Profil Toko, Logo & Banner Resmi
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sesuaikan nama brand, nomor WhatsApp admin untuk order, dan tautan gambar.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Nama Brand Toko:
                    </label>
                    <input
                      type="text"
                      required
                      value={tempStoreSettings.brandName}
                      onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, brandName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-bold outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Nomor WhatsApp Admin (Format 62...):
                    </label>
                    <input
                      type="text"
                      required
                      value={tempStoreSettings.waNumber}
                      onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, waNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-mono font-bold outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Jam Operasional:
                    </label>
                    <input
                      type="text"
                      value={tempStoreSettings.operationalHours}
                      onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, operationalHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Status Buka Toko:
                    </label>
                    <select
                      value={tempStoreSettings.storeStatus || 'open'}
                      onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, storeStatus: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-white outline-none focus:border-blue-500"
                    >
                      <option value="open">Buka Normal (Online)</option>
                      <option value="restock">Sedang Restock</option>
                      <option value="closed">Tutup Sementara</option>
                    </select>
                  </div>
                </div>

                {/* Banner & Logo URLs */}
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      URL Gambar Banner Utama:
                    </label>
                    <input
                      type="url"
                      value={tempStoreSettings.bannerUrl}
                      onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, bannerUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-blue-500"
                    />
                    {tempStoreSettings.bannerUrl && (
                      <div className="mt-2 aspect-[24/8] max-h-24 rounded-xl overflow-hidden border border-slate-700">
                        <img src={tempStoreSettings.bannerUrl} alt="Preview Banner" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      URL Gambar Logo Toko:
                    </label>
                    <input
                      type="url"
                      value={tempStoreSettings.logoUrl}
                      onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, logoUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Running Announcement */}
                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Megaphone className="w-4 h-4 text-amber-400" />
                      <span>Teks Pengumuman Header:</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-semibold">
                      <input
                        type="checkbox"
                        checked={!!tempStoreSettings.showAnnouncement}
                        onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, showAnnouncement: e.target.checked })}
                        className="rounded text-blue-600 bg-slate-900 border-slate-700"
                      />
                      <span>Tampilkan di Atas Navbar</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={tempStoreSettings.announcementText || ''}
                    onChange={(e) => setTempStoreSettings({ ...tempStoreSettings, announcementText: e.target.value })}
                    placeholder="🔥 Promo Spesial: Akun Free Fire Sultan & Old Season Siap Rebind Bergaransi 100% Anti Hackback!"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                {saveSuccessMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                )}

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Profil Toko</span>
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* TAB 5: WHATSAPP GROUPS */}
            {/* ======================================================== */}
            {activeTab === 'groups' && (
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-heading font-extrabold text-base sm:text-lg text-white">
                      Link Grup WhatsApp & Komunitas Resmi
                    </h4>
                    <p className="text-xs text-slate-400">
                      Kelola tautan grup JB dan grup diskusi transaksi pembeli.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingGroup({
                        id: 'grp-' + Date.now(),
                        name: 'Grup WhatsApp Resmi ' + (groups.length + 1),
                        description: 'Tempat transaksi akun aman dan update stok harian.',
                        url: `https://chat.whatsapp.com/invite_example_${groups.length + 1}`,
                        badge: 'AKTIF',
                        category: 'komunitas'
                      });
                      setIsCreatingGroup(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Tambah Grup</span>
                  </button>
                </div>

                {editingGroup ? (
                  <form onSubmit={handleSaveGroup} className="bg-[#111827] p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h5 className="font-bold text-sm text-white">
                      {isCreatingGroup ? 'Tambah Link Grup' : 'Edit Link Grup'}
                    </h5>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Nama Grup:</label>
                      <input
                        type="text"
                        required
                        value={editingGroup.name}
                        onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Deskripsi:</label>
                      <input
                        type="text"
                        value={editingGroup.description}
                        onChange={(e) => setEditingGroup({ ...editingGroup, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Tautan URL Grup WA:</label>
                      <input
                        type="url"
                        required
                        value={editingGroup.url}
                        onChange={(e) => setEditingGroup({ ...editingGroup, url: e.target.value })}
                        placeholder="https://chat.whatsapp.com/..."
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => { setEditingGroup(null); setIsCreatingGroup(false); }}
                        className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow"
                      >
                        Simpan Grup
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {groups.map((grp) => (
                      <div key={grp.id} className="bg-[#111827] p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h5 className="font-bold text-sm text-white truncate">{grp.name}</h5>
                          <p className="text-xs text-slate-400 truncate">{grp.description}</p>
                          <span className="text-[11px] font-mono text-blue-400 block truncate mt-0.5">{grp.url}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => { setEditingGroup(grp); setIsCreatingGroup(false); }}
                            className="p-2 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 rounded-xl transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGroup(grp.id, grp.name)}
                            className="p-2 bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-300 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 6: SECURITY & CREDENTIAL MANAGEMENT */}
            {/* ======================================================== */}
            {activeTab === 'security' && (
              <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Form Ubah Email & Password */}
                <form onSubmit={handleChangeCredentials} className="bg-[#111827] p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="font-heading font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-blue-400" />
                      <span>Ubah Email & Password Admin</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Email saat ini: <strong className="text-blue-400 font-mono">{storedEmail}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Email Baru (Opsional, kosongkan jika tetap):
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Masukkan email baru..."
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Password Saat Ini:
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Masukkan password saat ini untuk verifikasi..."
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white outline-none focus:border-blue-500 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Password Baru:
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimal 6 karakter..."
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white outline-none focus:border-blue-500 font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">
                        Ulangi Password Baru:
                      </label>
                      <input
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Konfirmasi password baru..."
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white outline-none focus:border-blue-500 font-medium"
                      />
                    </div>
                  </div>

                  {credChangeMsg && (
                    <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      credChangeMsg.type === 'success' 
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
                        : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                    }`}>
                      {credChangeMsg.type === 'success' ? <Check className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                      <span>{credChangeMsg.text}</span>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan Kredensial</span>
                    </button>
                  </div>
                </form>

                {/* Reset to Factory Defaults */}
                <div className="bg-[#111827] p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-white">Reset Semua Data Toko ke Awal</h5>
                    <p className="text-[11px] text-slate-400">Kembalikan katalog awal dan reset pengaturan pabrik.</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Reset semua data toko kembali ke bawaan awal? Tindakan ini tidak dapat dibatalkan.')) {
                        onResetToDefault();
                        onClose();
                      }
                    }}
                    className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl transition-all"
                  >
                    Reset ke Awal
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
