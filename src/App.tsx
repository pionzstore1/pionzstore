import React, { useState, useEffect, useMemo } from 'react';
import { 
  STORE_INFO, 
  CATEGORIES, 
  INITIAL_PRODUCTS, 
  GROUPS,
  Product,
  GroupLink
} from './data/storeData';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { CategoryNav } from './components/CategoryNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { GroupsView } from './components/GroupsView';
import { HelpView } from './components/HelpView';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminPanelModal, StoreSettings } from './components/AdminPanel/AdminPanelModal';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { 
  ArrowUpDown, 
  Zap, 
  CheckCircle2, 
  ShoppingBag,
  ChevronRight,
  Flame,
  Sparkles,
  ChevronLeft,
  Grid
} from 'lucide-react';

const CANONICAL_LOGO = 'https://cdn.phototourl.com/free/2026-08-14-3ae483b8-50e8-4aa2-891e-04031dfc30a6.jpg';
const CANONICAL_BANNER = 'https://i.ibb.co/HDWzWTYL/Screenshot-2026-09-27-10-56-03-982-com-openai-chatgpt-edit.jpg';

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  brandName: STORE_INFO.brandName,
  waNumber: STORE_INFO.waNumber,
  operationalHours: STORE_INFO.operationalHours,
  logoUrl: CANONICAL_LOGO,
  bannerUrl: CANONICAL_BANNER,
  guaranteeText: 'Garansi resmi Anti Hackback 15 - 30 hari. Rebind email & ganti nomor telepon dibimbing admin bertugas sampai tuntas 100% aman.',
  isMaintenanceMode: false,
  maintenanceTitle: 'Pemeliharaan Sistem & Update Stok Akun Free Fire',
  maintenanceMessage: 'Website sedang dalam peningkatan sistem keamanan transaksi dan pembaruan katalog akun game Free Fire terbaru. Anda tetap dapat melakukan order dan konsultasi langsung melalui WhatsApp resmi admin.',
  maintenanceEta: 'Estimasi Selesai: 15 - 30 Menit (Hari Ini)',
  storeStatus: 'open',
  announcementText: '🔥 Promo Spesial: Akun Free Fire Sultan & Old Season Siap Rebind Bergaransi 100% Anti Hackback!',
  showAnnouncement: true
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'groups' | 'help'>('home');
  
  // Persistent Products (Restricted to Free Fire accounts currently)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('pionz_store_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        const ffOnly = parsed.filter(p => p.game === 'Free Fire');
        if (ffOnly.length > 0) return ffOnly;
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  // Persistent Store Settings (with migration if old logoUrl is stale)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('pionz_store_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.logoUrl || parsed.logoUrl === '/logo.jpg') {
          parsed.logoUrl = CANONICAL_LOGO;
        }
        if (!parsed.bannerUrl || parsed.bannerUrl === '/banner.jpg') {
          parsed.bannerUrl = CANONICAL_BANNER;
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_STORE_SETTINGS;
  });

  // Persistent Groups
  const [groups, setGroups] = useState<GroupLink[]>(() => {
    try {
      const saved = localStorage.getItem('pionz_store_groups');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return GROUPS;
  });

  // Catalog Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'sold' | 'flash'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');

  // Pagination State for Katalog
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; // 8 items per page for clean desktop & mobile balance

  // Modals & Popups
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, filterStatus, searchQuery, sortBy]);

  // Save to localStorage when products update
  useEffect(() => {
    try {
      localStorage.setItem('pionz_store_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Save store settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pionz_store_settings', JSON.stringify(storeSettings));
    } catch {
      // ignore
    }
  }, [storeSettings]);

  // Save groups to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pionz_store_groups', JSON.stringify(groups));
    } catch {
      // ignore
    }
  }, [groups]);

  // Check URL hash for direct private admin access (#admin)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.toLowerCase() === '#admin') {
        setIsAdminOpen(true);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    // Keyboard shortcut: Ctrl + Shift + A or Alt + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Compute product counts per category
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    CATEGORIES.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = products.filter(
          (p) => p.game.toLowerCase() === cat.label.toLowerCase()
        ).length;
      }
    });
    return counts;
  }, [products]);

  // Filtered & Sorted Products for Katalog
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all') {
          const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
          if (catObj && p.game.toLowerCase() !== catObj.label.toLowerCase()) {
            return false;
          }
        }

        // Status filter
        if (filterStatus === 'available' && p.sold) return false;
        if (filterStatus === 'sold' && !p.sold) return false;
        if (filterStatus === 'flash' && !p.flash) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCode = p.accountCode.toLowerCase().includes(q);
          const matchGame = p.game.toLowerCase().includes(q);
          const matchSpecs = p.specs.some((s) => s.toLowerCase().includes(q));
          if (!matchName && !matchCode && !matchGame && !matchSpecs) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        if (sortBy === 'price_low') return priceA - priceB;
        if (sortBy === 'price_high') return priceB - priceA;
        return 0;
      });
  }, [products, selectedCategory, filterStatus, searchQuery, sortBy]);

  // Total pages and paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Featured Hot/Flash items for Home
  const featuredHotProducts = useMemo(() => {
    const hotList = products.filter(p => !p.sold && (p.flash || p.badge === 'HOT' || p.badge === 'SULTAN'));
    return (hotList.length >= 4 ? hotList : products.filter(p => !p.sold)).slice(0, 4);
  }, [products]);

  // New arrivals for Home
  const newArrivalProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  // Direct buy handler via WhatsApp
  const handleDirectBuy = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const finalPrice = product.discountPrice || product.price;
    const msg = `Halo Admin ${storeSettings.brandName}, saya berminat membeli akun:%0A` +
      `• Judul: ${encodeURIComponent(product.name)}%0A` +
      `• Kode: ${encodeURIComponent(product.accountCode)}%0A` +
      `• Harga: Rp ${finalPrice.toLocaleString('id-ID')}%0A%0A` +
      `Apakah akun ini masih ready untuk ditransaksikan?`;
    window.open(`https://wa.me/${storeSettings.waNumber}?text=${msg}`, '_blank');
  };

  const handleResetToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    setStoreSettings(DEFAULT_STORE_SETTINGS);
    setGroups(GROUPS);
    localStorage.removeItem('pionz_store_products');
    localStorage.removeItem('pionz_store_settings');
    localStorage.removeItem('pionz_store_groups');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const el = document.getElementById('katalog-top');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isAdminSession = typeof window !== 'undefined' && sessionStorage.getItem('pionz_admin_session') === 'true';

  // If maintenance mode is active and not logged in as admin, show the Maintenance Screen
  if (storeSettings.isMaintenanceMode && !isAdminSession && !isAdminOpen) {
    return (
      <>
        <MaintenanceScreen
          storeSettings={storeSettings}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
        <AdminPanelModal
          isOpen={isAdminOpen}
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.hash.toLowerCase() === '#admin') {
              history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }}
          products={products}
          onUpdateProducts={setProducts}
          storeSettings={storeSettings}
          onUpdateStoreSettings={setStoreSettings}
          groups={groups}
          onUpdateGroups={setGroups}
          onResetToDefault={handleResetToDefault}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fb] text-[#1a2233]">
      
      {/* 1. Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAdmin={() => setIsAdminOpen(true)}
        storeSettings={storeSettings}
      />

      {/* 2. Main Body Content Based on Active Tab */}
      <main className="flex-1 pb-16">
        
        {/* ======================================================== */}
        {/* TAB 1: BERANDA (HOME) */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-8 sm:space-y-10">
            
            {/* Hero Slider / Official Banner */}
            <HeroSlider
              storeSettings={storeSettings}
              onExploreClick={() => {
                setActiveTab('categories');
                setTimeout(() => {
                  const el = document.getElementById('katalog-top');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            />

            {/* Quick Game Category Card: Free Fire Focus */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black text-lg border border-amber-500/20">
                    <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-extrabold text-base sm:text-lg text-slate-900">
                        Katalog Spesial Free Fire
                      </h3>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        Stok Ready
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tersedia {products.length} akun FF terverifikasi (Sultan, Old, Pelajar, SG2 Rapper, dan Max Evo)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setActiveTab('categories');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#08499f] hover:bg-blue-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <Grid className="w-4 h-4" />
                  <span>Buka Semua Akun FF ({products.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            {/* Section: 🔥 Flash Sale & Akun Pilihan Unggulan */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="font-heading font-extrabold text-base sm:text-xl text-slate-900 flex items-center gap-1.5">
                    <Flame className="w-5 h-5 text-rose-500 fill-rose-500" />
                    <span>Akun Unggulan & Flash Sale Pilihan</span>
                  </h3>
                  <p className="text-xs text-slate-500">Akun terpopuler dengan spesifikasi istimewa</p>
                </div>

                <button
                  onClick={() => {
                    setFilterStatus('flash');
                    setActiveTab('categories');
                  }}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shrink-0"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Lihat Flash Sale</span>
                  <span className="sm:hidden">Flash Sale</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {featuredHotProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onDirectBuy={handleDirectBuy}
                  />
                ))}
              </div>
            </section>

            {/* Section: ⚡ Baru Masuk Katalog */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="font-heading font-extrabold text-base sm:text-xl text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-[#08499f]" />
                    <span>Baru Saja Masuk Katalog</span>
                  </h3>
                  <p className="text-xs text-slate-500">Stok akun fresh siap rebind dan bergaransi</p>
                </div>

                <button
                  onClick={() => setActiveTab('categories')}
                  className="px-3.5 py-1.5 bg-[#08499f] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1 shrink-0"
                >
                  <span>Buka Semua Katalog</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {newArrivalProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProduct(p)}
                    onDirectBuy={handleDirectBuy}
                  />
                ))}
              </div>

              {/* Big CTA to explore full catalog */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    setActiveTab('categories');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#08499f] to-blue-700 hover:from-blue-700 hover:to-[#08499f] text-white font-heading font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 inline-flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Jelajahi Seluruh Katalog ({products.length} Akun Game)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: KATALOG LENGKAP (CATEGORIES) DENGAN PAGINATION (1, 2, 3...) */}
        {/* ======================================================== */}
        {activeTab === 'categories' && (
          <div id="katalog-top" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-5 pt-2">
            
            {/* Header Title Section for Catalog */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900">
                    Katalog Lengkap Akun Free Fire
                  </h1>
                  <span className="bg-blue-100 text-[#08499f] text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {filteredProducts.length} Akun
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Semua akun dijamin bergaransi anti hackback & didampingi rebind sampai tuntas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Halaman {currentPage} dari {totalPages}</span>
              </div>
            </div>

            {/* Category selector */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setCurrentPage(1);
              }}
              productCounts={productCounts}
            />

            {/* Filters & Sorting Toolbar */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Status Segmented Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => {
                    setFilterStatus('all');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    filterStatus === 'all'
                      ? 'bg-[#08499f] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Semua ({products.length})
                </button>

                <button
                  onClick={() => {
                    setFilterStatus('available');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                    filterStatus === 'available'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tersedia ({products.filter(p => !p.sold).length})</span>
                </button>

                <button
                  onClick={() => {
                    setFilterStatus('flash');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                    filterStatus === 'flash'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Flash Sale</span>
                </button>

                <button
                  onClick={() => {
                    setFilterStatus('sold');
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    filterStatus === 'sold'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Terjual (Sold)
                </button>
              </div>

              {/* Sorting Dropdown */}
              <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-semibold text-slate-600">
                <span className="text-slate-400 shrink-0 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Urutkan:</span>
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-[#08499f]"
                >
                  <option value="newest">Terbaru</option>
                  <option value="price_low">Harga Terendah</option>
                  <option value="price_high">Harga Tertinggi</option>
                </select>
              </div>

            </div>

            {/* Search Result Info */}
            {searchQuery && (
              <div className="flex items-center justify-between px-2 text-xs text-slate-600">
                <span>
                  Hasil pencarian untuk "<strong>{searchQuery}</strong>": {filteredProducts.length} akun ditemukan
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[#08499f] font-bold hover:underline"
                >
                  Reset Pencarian
                </button>
              </div>
            )}

            {/* Product Grid (Paginated 8 items per page) */}
            {paginatedProducts.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                      onDirectBuy={handleDirectBuy}
                    />
                  ))}
                </div>

                {/* PAGINATION NUMBER CONTROLS (No 1, 2, 3...) */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                    
                    {/* Summary Page text */}
                    <span className="text-xs text-slate-500 font-medium">
                      Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} dari {filteredProducts.length} akun
                    </span>

                    {/* Pagination buttons [Prev] [1] [2] [3]... [Next] */}
                    <div className="flex items-center gap-1.5 select-none">
                      
                      {/* Prev Button */}
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Sebelumnya</span>
                      </button>

                      {/* Numbered page buttons 1, 2, 3... */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        const isCurrent = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`min-w-[34px] h-[34px] rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                              isCurrent
                                ? 'bg-[#08499f] text-white shadow-md shadow-blue-900/20'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {/* Next Button */}
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
                      >
                        <span className="hidden sm:inline">Selanjutnya</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                    </div>

                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-card max-w-md mx-auto my-8">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#08499f] grid place-items-center mx-auto mb-3">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h4 className="font-heading font-extrabold text-lg text-slate-900 mb-1">
                  Tidak Ada Akun Ditemukan
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Belum ada akun yang sesuai dengan filter atau kata kunci pencarianmu saat ini.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setFilterStatus('all');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-[#08499f] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-800 transition-colors"
                >
                  Tampilkan Semua Akun
                </button>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: GRUP WA & KONTAK */}
        {/* ======================================================== */}
        {activeTab === 'groups' && (
          <GroupsView
            groups={groups}
            storeSettings={storeSettings}
          />
        )}

        {/* ======================================================== */}
        {/* TAB 4: BANTUAN & CS */}
        {/* ======================================================== */}
        {activeTab === 'help' && (
          <HelpView
            storeSettings={storeSettings}
          />
        )}

      </main>

      {/* Footer */}
      <Footer
        setActiveTab={(t) => setActiveTab(t as any)}
        storeSettings={storeSettings}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
      />

      {/* Modal: Product Detail */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        storeSettings={storeSettings}
      />

      {/* Modal: Private Admin Panel */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash.toLowerCase() === '#admin') {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        products={products}
        onUpdateProducts={setProducts}
        storeSettings={storeSettings}
        onUpdateStoreSettings={setStoreSettings}
        groups={groups}
        onUpdateGroups={setGroups}
        onResetToDefault={handleResetToDefault}
      />

    </div>
  );
}
