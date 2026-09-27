import React, { useState } from 'react';
import { Product, StoreConfig, Banner, GroupChannel, Testimonial } from '../types.ts';
import { formatRupiah } from '../utils/formatters.ts';
import {
  Package,
  Settings,
  Image as ImageIcon,
  Users,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Flame,
  Search,
  ArrowLeft,
  LogOut,
  Save,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Check,
  ShieldCheck,
  Lock,
  ExternalLink,
  MessageCircle,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface AdminPanelProps {
  config: StoreConfig;
  products: Product[];
  banners: Banner[];
  groups: GroupChannel[];
  testimonials?: Testimonial[];
  onUpdateConfig: (newConfig: StoreConfig) => void;
  onUpdateProducts: (newProducts: Product[]) => void;
  onUpdateBanners: (newBanners: Banner[]) => void;
  onUpdateGroups: (newGroups: GroupChannel[]) => void;
  onUpdateTestimonials?: (newTestimonials: Testimonial[]) => void;
  onExit: () => void;
  onLogout: () => void;
  onResetDefault: () => void;
  onImportBackup: (jsonStr: string) => boolean;
  onExportBackup: () => string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  config,
  products,
  banners,
  groups,
  onUpdateConfig,
  onUpdateProducts,
  onUpdateBanners,
  onUpdateGroups,
  onExit,
  onLogout,
  onResetDefault,
  onImportBackup,
  onExportBackup,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'config' | 'banners' | 'groups' | 'backup'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'dp' | 'sold'>('all');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Editing or creating product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for Product
  const [prodName, setProdName] = useState('');
  const [prodGame, setProdGame] = useState('Free Fire');
  const [prodImage, setProdImage] = useState('');
  const [prodImages, setProdImages] = useState('');
  const [prodPrice, setProdPrice] = useState(250000);
  const [prodDiscountPrice, setProdDiscountPrice] = useState<number | ''>('');
  const [prodBadge, setProdBadge] = useState('HOT');
  const [prodFlash, setProdFlash] = useState(false);
  const [prodSold, setProdSold] = useState(false);
  const [prodIsDp, setProdIsDp] = useState(false);
  const [prodSpecs, setProdSpecs] = useState('');

  // Store config form state
  const [configForm, setConfigForm] = useState<StoreConfig>({ ...config });
  const [showPassword, setShowPassword] = useState(false);

  // Banner editing state
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState<Banner>({ id: '', image: '', title: '', subtitle: '' });

  // Group editing state
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupForm, setGroupForm] = useState<GroupChannel>({ id: '', name: '', url: '', image: '' });

  const showNotify = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Stats calculation
  const totalProducts = products.length;
  const readyProducts = products.filter((p) => !p.sold && !p.name.toUpperCase().includes('SOLD DI DP')).length;
  const dpProducts = products.filter((p) => p.name.toUpperCase().includes('SOLD DI DP') && !p.sold).length;
  const soldProducts = products.filter((p) => p.sold).length;
  const totalValue = products.reduce((acc, curr) => acc + (curr.discountPrice || curr.price), 0);

  // Open Product Modal (Create or Edit)
  const handleOpenProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setProdName(prod.name);
      setProdGame(prod.game || 'Free Fire');
      setProdImage(prod.image);
      setProdImages(prod.images ? prod.images.join('\n') : prod.image);
      setProdPrice(prod.price);
      setProdDiscountPrice(prod.discountPrice || '');
      setProdBadge(prod.badge || 'HOT');
      setProdFlash(!!prod.flash);
      setProdSold(!!prod.sold);
      setProdIsDp(prod.name.toUpperCase().includes('SOLD DI DP'));
      setProdSpecs(prod.specs ? prod.specs.join('\n') : '');
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdGame('Free Fire');
      setProdImage('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');
      setProdImages('');
      setProdPrice(250000);
      setProdDiscountPrice('');
      setProdBadge('PELAJAR');
      setProdFlash(false);
      setProdSold(false);
      setProdIsDp(false);
      setProdSpecs('Vault 200+\nSg2 Rapper / Evo Gun on\nRebind only + garansi 15 hari');
    }
    setIsProductModalOpen(true);
  };

  // Save Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    const parsedImages = prodImages
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const finalImages = parsedImages.length > 0 ? parsedImages : [prodImage];

    const parsedSpecs = prodSpecs
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    let cleanName = prodName.replace(/SOLD DI DP \(TIKUNG LANGSUNG CHAT ADMIN\)/gi, '').trim();
    if (prodIsDp && !prodSold) {
      cleanName = `SOLD DI DP (TIKUNG LANGSUNG CHAT ADMIN) ${cleanName}`;
    }

    if (editingProduct) {
      // Update existing
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: cleanName,
            game: 'Free Fire',
            image: prodImage || finalImages[0],
            images: finalImages,
            price: Number(prodPrice),
            discountPrice: prodDiscountPrice ? Number(prodDiscountPrice) : null,
            badge: prodBadge,
            flash: prodFlash,
            sold: prodSold,
            soldPrice: prodSold ? Number(prodDiscountPrice || prodPrice) : null,
            soldAt: prodSold ? (p.soldAt || Date.now()) : null,
            specs: parsedSpecs,
          };
        }
        return p;
      });
      onUpdateProducts(updated);
      showNotify(`Akun "${cleanName}" berhasil diperbarui!`);
    } else {
      // Create new
      const newProd: Product = {
        id: `produk-${Date.now()}`,
        name: cleanName,
        game: 'Free Fire',
        image: prodImage || finalImages[0],
        images: finalImages,
        price: Number(prodPrice),
        discountPrice: prodDiscountPrice ? Number(prodDiscountPrice) : null,
        rating: 5,
        badge: prodBadge,
        specs: parsedSpecs,
        flash: prodFlash,
        sold: prodSold,
        soldPrice: prodSold ? Number(prodDiscountPrice || prodPrice) : null,
        soldAt: prodSold ? Date.now() : null,
      };
      onUpdateProducts([newProd, ...products]);
      showNotify(`Akun baru "${cleanName}" berhasil ditambahkan!`);
    }

    setIsProductModalOpen(false);
  };

  // Delete Product
  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Hapus akun "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      const updated = products.filter((p) => p.id !== id);
      onUpdateProducts(updated);
      showNotify(`Akun "${name}" berhasil dihapus.`);
    }
  };

  // Quick 1-Click Status Handlers
  const handleSetStatus = (prod: Product, targetStatus: 'ready' | 'dp' | 'sold') => {
    const rawName = prod.name.replace(/SOLD DI DP \(TIKUNG LANGSUNG CHAT ADMIN\)/gi, '').trim() || prod.name;
    const updated = products.map((p) => {
      if (p.id === prod.id) {
        if (targetStatus === 'ready') {
          return {
            ...p,
            sold: false,
            soldPrice: null,
            soldAt: null,
            name: rawName,
          };
        } else if (targetStatus === 'dp') {
          return {
            ...p,
            sold: false,
            soldPrice: null,
            soldAt: null,
            name: `SOLD DI DP (TIKUNG LANGSUNG CHAT ADMIN) ${rawName}`,
          };
        } else if (targetStatus === 'sold') {
          return {
            ...p,
            sold: true,
            soldPrice: p.discountPrice || p.price,
            soldAt: Date.now(),
            name: rawName,
          };
        }
      }
      return p;
    });
    onUpdateProducts(updated);
    showNotify(`Status akun diubah ke: ${targetStatus.toUpperCase()}`);
  };

  const handleToggleFlash = (prod: Product) => {
    const updated = products.map((p) => {
      if (p.id === prod.id) {
        return { ...p, flash: !p.flash };
      }
      return p;
    });
    onUpdateProducts(updated);
    showNotify(`Status Flash Sale akun berhasil diubah!`);
  };

  // Save Config
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(configForm);
    showNotify('Pengaturan toko berhasil disimpan!');
  };

  // Save Banner
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.image) return;

    if (bannerForm.id) {
      const updated = banners.map((b) => (b.id === bannerForm.id ? bannerForm : b));
      onUpdateBanners(updated);
      showNotify('Banner berhasil diperbarui!');
    } else {
      const newBanner: Banner = {
        ...bannerForm,
        id: `banner-${Date.now()}`,
      };
      onUpdateBanners([...banners, newBanner]);
      showNotify('Banner baru berhasil ditambahkan!');
    }
    setIsBannerModalOpen(false);
  };

  const handleDeleteBanner = (id: string) => {
    if (banners.length <= 1) {
      alert('Toko harus memiliki minimal 1 banner utama.');
      return;
    }
    if (window.confirm('Hapus banner ini?')) {
      onUpdateBanners(banners.filter((b) => b.id !== id));
      showNotify('Banner berhasil dihapus.');
    }
  };

  // Save Group
  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupForm.name || !groupForm.url) return;

    if (groupForm.id) {
      const updated = groups.map((g) => (g.id === groupForm.id ? groupForm : g));
      onUpdateGroups(updated);
      showNotify('Grup berhasil diperbarui!');
    } else {
      const newGroup: GroupChannel = {
        ...groupForm,
        id: `grup-${Date.now()}`,
      };
      onUpdateGroups([...groups, newGroup]);
      showNotify('Grup baru berhasil ditambahkan!');
    }
    setIsGroupModalOpen(false);
  };

  const handleDeleteGroup = (id: string) => {
    if (window.confirm('Hapus grup ini dari daftar komunitas?')) {
      onUpdateGroups(groups.filter((g) => g.id !== id));
      showNotify('Grup berhasil dihapus.');
    }
  };

  // Backup file export
  const handleDownloadBackup = () => {
    const jsonStr = onExportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-${config.brandName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotify('File backup berhasil didownload!');
  };

  // Backup file import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImportBackup(content);
        if (success) {
          showNotify('Backup berhasil direstore!');
        } else {
          alert('Format file backup tidak valid.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Filtered Products for Admin Table
  const adminFilteredProducts = products.filter((p) => {
    if (filterStatus === 'ready' && (p.sold || p.name.toUpperCase().includes('SOLD DI DP'))) return false;
    if (filterStatus === 'dp' && (!p.name.toUpperCase().includes('SOLD DI DP') || p.sold)) return false;
    if (filterStatus === 'sold' && !p.sold) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.badge?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans pb-16">
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-sm font-bold">{saveSuccessMsg}</span>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Title & Brand */}
            <div className="flex items-center gap-3">
              <img
                src={config.logo}
                alt={config.brandName}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/50"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black text-white font-heading">
                    Admin Panel {config.brandName}
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Sistem Aktif
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Kelola stok akun Free Fire, harga, nomor WA, dan tampilan website
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onExit}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all shadow-sm"
              >
                <Eye className="w-4 h-4 text-blue-400" />
                <span>Lihat Website</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-bold transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Summary Statistics */}
      <div className="bg-slate-950/60 border-b border-slate-800/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[11px] text-slate-400 font-medium block">Total Akun FF</span>
              <span className="text-xl sm:text-2xl font-black text-white font-heading">{totalProducts}</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[11px] text-emerald-400 font-medium block">Ready (Tersedia)</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-heading">{readyProducts}</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[11px] text-amber-400 font-medium block">Booking (Sold di DP)</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-heading">{dpProducts}</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[11px] text-red-400 font-medium block">Terjual (Sold Out)</span>
              <span className="text-xl sm:text-2xl font-black text-red-400 font-heading">{soldProducts}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
              <span className="text-[11px] text-blue-400 font-medium block">Total Nilai Stok</span>
              <span className="text-sm sm:text-base font-black text-blue-400 font-heading truncate block">
                {formatRupiah(totalValue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 border-b border-slate-800">
          {[
            { id: 'products', label: 'Kelola Akun Free Fire', icon: Package, count: products.length },
            { id: 'config', label: 'Pengaturan Toko & WA', icon: Settings },
            { id: 'banners', label: 'Banner Hero', icon: ImageIcon, count: banners.length },
            { id: 'groups', label: 'Grup & Komunitas', icon: Users, count: groups.length },
            { id: 'backup', label: 'Backup & Reset', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20' : 'bg-slate-700'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-950 p-4 rounded-3xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari akun, ID, tier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Filter Status Pills */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      filterStatus === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Semua ({products.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('ready')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      filterStatus === 'ready' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Ready ({readyProducts})
                  </button>
                  <button
                    onClick={() => setFilterStatus('dp')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      filterStatus === 'dp' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Booking DP ({dpProducts})
                  </button>
                  <button
                    onClick={() => setFilterStatus('sold')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      filterStatus === 'sold' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Terjual ({soldProducts})
                  </button>
                </div>
              </div>

              {/* Add New Product Button */}
              <button
                onClick={() => handleOpenProductModal()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Akun Baru</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 font-extrabold">
                    <tr>
                      <th className="py-3 px-4">Info Akun Free Fire</th>
                      <th className="py-3 px-4">Harga / Promo</th>
                      <th className="py-3 px-4">Tier</th>
                      <th className="py-3 px-4">Status Akun (1-Klik Ganti)</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {adminFilteredProducts.map((p) => {
                      const isDp = p.name.toUpperCase().includes('SOLD DI DP');
                      return (
                        <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                          {/* Info & Image */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-14 h-14 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700"
                              />
                              <div className="min-w-0 max-w-sm">
                                <h4 className="font-bold text-white text-xs sm:text-sm line-clamp-1">
                                  {p.name}
                                </h4>
                                <span className="text-[10px] text-slate-500 font-mono block">
                                  ID: {p.id}
                                </span>
                                {p.flash && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 mt-0.5">
                                    <Flame className="w-3 h-3 fill-rose-400" /> Flash Sale Aktif
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            {p.discountPrice ? (
                              <div>
                                <span className="text-red-400 font-bold block">
                                  {formatRupiah(p.discountPrice)}
                                </span>
                                <span className="text-[10px] text-slate-500 line-through">
                                  {formatRupiah(p.price)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-blue-400 font-bold">
                                {formatRupiah(p.price)}
                              </span>
                            )}
                          </td>

                          {/* Badge */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-slate-800 text-slate-200 border border-slate-700">
                              {p.badge}
                            </span>
                          </td>

                          {/* Status Quick 1-Click Buttons */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleSetStatus(p, 'ready')}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                  !p.sold && !isDp
                                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                                    : 'bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700'
                                }`}
                                title="Klik untuk set status Ready"
                              >
                                Ready
                              </button>

                              <button
                                onClick={() => handleSetStatus(p, 'dp')}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                  isDp && !p.sold
                                    ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                                    : 'bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700'
                                }`}
                                title="Klik untuk set status Booking DP"
                              >
                                Booking DP
                              </button>

                              <button
                                onClick={() => handleSetStatus(p, 'sold')}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                  p.sold
                                    ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-400'
                                    : 'bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700'
                                }`}
                                title="Klik untuk set status Terjual"
                              >
                                Terjual
                              </button>

                              <button
                                onClick={() => handleToggleFlash(p)}
                                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                                  p.flash
                                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                    : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                                }`}
                                title={p.flash ? 'Matikan Flash Sale' : 'Aktifkan Flash Sale'}
                              >
                                <Flame className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenProductModal(p)}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 transition-colors"
                                title="Edit Akun"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-red-950 text-red-400 hover:text-red-300 transition-colors"
                                title="Hapus Akun"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {adminFilteredProducts.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    Tidak ada akun yang sesuai dengan filter pencarian.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STORE CONFIGURATION & WHATSAPP */}
        {activeTab === 'config' && (
          <div className="max-w-3xl mx-auto bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
            <h3 className="text-xl font-black text-white font-heading mb-1">
              Pengaturan Website & Kontak
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Ubah nomor WhatsApp, nama toko, logo, dan status operasional website secara langsung.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-5">
              {/* Brand Name & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nama Toko (Brand Name) *
                  </label>
                  <input
                    type="text"
                    value={configForm.brandName}
                    onChange={(e) => setConfigForm({ ...configForm, brandName: e.target.value })}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tagline / Slogan
                  </label>
                  <input
                    type="text"
                    value={configForm.tagline}
                    onChange={(e) => setConfigForm({ ...configForm, tagline: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Logo URL with preview */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  URL Logo Toko
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={configForm.logo}
                    alt="Logo Toko"
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-900 shrink-0"
                  />
                  <input
                    type="text"
                    value={configForm.logo}
                    onChange={(e) => setConfigForm({ ...configForm, logo: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* WhatsApp Number & Direct Test Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-300">
                      Nomor WhatsApp Admin (Format: 628...) *
                    </label>
                    <a
                      href={`https://wa.me/${configForm.waNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Uji Chat</span>
                    </a>
                  </div>
                  <input
                    type="text"
                    value={configForm.waNumber}
                    onChange={(e) => setConfigForm({ ...configForm, waNumber: e.target.value })}
                    required
                    placeholder="6285643698411"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Semua tombol "Beli Sekarang" & CS akan otomatis diarahkan ke nomor ini.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Jam Operasional Toko
                  </label>
                  <input
                    type="text"
                    value={configForm.operatingHours}
                    onChange={(e) => setConfigForm({ ...configForm, operatingHours: e.target.value })}
                    placeholder="Open 09.00 - 23.00 WIB"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Deskripsi Toko (Tampil di Footer)
                </label>
                <textarea
                  rows={3}
                  value={configForm.description}
                  onChange={(e) => setConfigForm({ ...configForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Maintenance Mode Toggle */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Mode Pemeliharaan (Maintenance)</h4>
                  <p className="text-xs text-slate-400">
                    Aktifkan jika website sedang dalam perbaikan sehingga pengunjung melihat halaman pemeliharaan.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configForm.maintenanceMode}
                    onChange={(e) => setConfigForm({ ...configForm, maintenanceMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {configForm.maintenanceMode && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Pesan Pemeliharaan (Akan tampil ke pengunjung)
                  </label>
                  <input
                    type="text"
                    value={configForm.maintenanceMessage || ''}
                    onChange={(e) => setConfigForm({ ...configForm, maintenanceMessage: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {/* Admin authentication is managed server-side via Vercel environment variables. */}
      <div className="pt-4 border-t border-slate-800">
        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/20">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">🔐</div>
            <div>
              <h4 className="font-bold text-sm text-white">Keamanan Admin</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Password admin tidak lagi disimpan di source code atau pengaturan toko. Autentikasi dilakukan melalui Vercel Serverless Function menggunakan secret environment variable.
              </p>
              <p className="text-[10px] text-slate-500 mt-2">
                Jangan masukkan password ke file HTML, React, atau Git.
              </p>
            </div>
          </div>
        </div>
      </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Toko</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: BANNERS MANAGEMENT */}
        {activeTab === 'banners' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-3xl border border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white font-heading">
                  Banner Hero Utama
                </h3>
                <p className="text-xs text-slate-400">
                  Banner visual yang tampil di bagian atas beranda toko
                </p>
              </div>
              <button
                onClick={() => {
                  setBannerForm({ id: '', image: '', title: '', subtitle: '' });
                  setIsBannerModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Banner</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-lg flex flex-col"
                >
                  <div className="relative aspect-[21/9] bg-slate-900">
                    <img
                      src={banner.image}
                      alt={banner.title || 'Banner'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 text-white text-[10px] font-bold backdrop-blur-sm">
                      Banner #{index + 1} (Aktif)
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm mb-1">{banner.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{banner.subtitle}</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-2 block truncate">
                        {banner.image}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setBannerForm(banner);
                          setIsBannerModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold"
                      >
                        Edit Banner
                      </button>
                      {banners.length > 1 && (
                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950 text-red-400 text-xs font-bold"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GROUPS & COMMUNITY */}
        {activeTab === 'groups' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-950 p-4 rounded-3xl border border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white font-heading">
                  Grup & Komunitas Resmi
                </h3>
                <p className="text-xs text-slate-400">
                  Daftar link WhatsApp grup, saluran stok, japost, dan media sosial
                </p>
              </div>
              <button
                onClick={() => {
                  setGroupForm({ id: '', name: '', url: '', image: '' });
                  setIsGroupModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Grup Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={group.image || config.logo}
                      alt={group.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = config.logo;
                      }}
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">{group.name}</h4>
                      <a
                        href={group.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline truncate block"
                      >
                        {group.url}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setGroupForm(group);
                        setIsGroupModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-950 text-red-400 text-xs font-bold"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BACKUP & RESTORE */}
        {activeTab === 'backup' && (
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-lg font-black text-white font-heading mb-2">
                Download Backup Data Toko
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Simpan salinan seluruh akun game, harga, pengaturan toko, dan banner ke dalam file JSON di HP/komputer Anda untuk keamanan data.
              </p>
              <button
                onClick={handleDownloadBackup}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Backup Toko (.json)</span>
              </button>
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-lg font-black text-white font-heading mb-2">
                Restore / Pulihkan Data
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Unggah file backup JSON yang pernah Anda simpan untuk mengembalikan seluruh isi toko secara instan.
              </p>
              <label className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm cursor-pointer border border-slate-700 transition-all">
                <Upload className="w-4 h-4" />
                <span>Pilih File Backup JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl border border-red-900/50 shadow-xl">
              <div className="flex items-center gap-2 text-red-400 mb-2 font-bold text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>Reset ke Pengaturan Awal</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Mengembalikan seluruh data akun dan pengaturan ke data awal toko.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh data toko ke default? Semua perubahan akan dikembalikan ke setelan awal.')) {
                    onResetDefault();
                    showNotify('Data toko berhasil direset ke default.');
                  }
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 font-bold text-xs sm:text-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Seluruh Data ke Default</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-7 space-y-4 my-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-black text-white font-heading">
                {editingProduct ? 'Edit Akun Free Fire' : 'Tambah Akun Free Fire Baru'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-slate-850"
              >
                ✕ Tutup
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Judul Akun Free Fire *
                </label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Contoh: Epas 8/10 on Scar max ft sg2 rapper"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Badge & Game */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Badge Kategori
                  </label>
                  <select
                    value={prodBadge}
                    onChange={(e) => setProdBadge(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="HOT">HOT (Populer)</option>
                    <option value="PELAJAR">PELAJAR (Hemat)</option>
                    <option value="SULTAN">SULTAN (High End)</option>
                    <option value="LIMITED">LIMITED (Langka)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Game</label>
                  <input
                    type="text"
                    value="Free Fire"
                    disabled
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Price & Discount Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Harga Normal (Rp) *
                  </label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Harga Diskon / Promo (Rp) (Opsional)
                  </label>
                  <input
                    type="number"
                    value={prodDiscountPrice}
                    onChange={(e) => setProdDiscountPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Kosongkan jika tidak promo"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Main Image with Live Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  URL Foto Utama Akun *
                </label>
                <div className="flex items-center gap-3">
                  {prodImage && (
                    <img
                      src={prodImage}
                      alt="Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 bg-slate-900 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  )}
                  <input
                    type="text"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    placeholder="https://..."
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Foto Tambahan (1 URL per baris)
                </label>
                <textarea
                  rows={2}
                  value={prodImages}
                  onChange={(e) => setProdImages(e.target.value)}
                  placeholder="https://...\nhttps://..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* Specs */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Spesifikasi Akun (1 baris per poin spesifikasi)
                </label>
                <textarea
                  rows={4}
                  value={prodSpecs}
                  onChange={(e) => setProdSpecs(e.target.value)}
                  placeholder="Vault 500+, bundle saitama\nEvo gun max 3 ft sg2 rapper\nRebind only + garansi 15 hari"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={prodFlash}
                    onChange={(e) => setProdFlash(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                  />
                  <span>Tampilkan di Flash Sale 🔥</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={prodIsDp}
                    onChange={(e) => setProdIsDp(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                  />
                  <span>Booking DP (Sold di DP) ⚠️</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-300">
                  <input
                    type="checkbox"
                    checked={prodSold}
                    onChange={(e) => setProdSold(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-0"
                  />
                  <span>Tandai Terjual (Sold Out) 🔴</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT BANNER */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-black text-white font-heading">
              {bannerForm.id ? 'Edit Banner Hero' : 'Tambah Banner Baru'}
            </h3>

            <form onSubmit={handleSaveBanner} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  URL Gambar Banner *
                </label>
                <input
                  type="text"
                  value={bannerForm.image}
                  onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                  required
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Judul Banner
                </label>
                <input
                  type="text"
                  value={bannerForm.title || ''}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder={`${config.brandName} - Top Marketplace Game`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Subjudul Banner
                </label>
                <input
                  type="text"
                  value={bannerForm.subtitle || ''}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="Koleksi Akun Free Fire Sultan, Pelajar & Limited"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Simpan Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT GROUP */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-950 rounded-3xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-black text-white font-heading">
              {groupForm.id ? 'Edit Grup / Saluran' : 'Tambah Grup Baru'}
            </h3>

            <form onSubmit={handleSaveGroup} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Nama Grup / Komunitas *
                </label>
                <input
                  type="text"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                  required
                  placeholder="Contoh: Whatsapp Utama Pionz"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Link URL (WhatsApp / Saluran / TikTok) *
                </label>
                <input
                  type="text"
                  value={groupForm.url}
                  onChange={(e) => setGroupForm({ ...groupForm, url: e.target.value })}
                  required
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  URL Icon / Foto Grup
                </label>
                <input
                  type="text"
                  value={groupForm.image}
                  onChange={(e) => setGroupForm({ ...groupForm, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Simpan Grup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
