/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Product, StoreConfig, Banner, GroupChannel, Testimonial } from './types.ts';
import {
  getStoredProducts,
  saveStoredProducts,
  getStoredConfig,
  saveStoredConfig,
  getStoredBanners,
  saveStoredBanners,
  getStoredGroups,
  saveStoredGroups,
  getStoredTestimonials,
  saveStoredTestimonials,
  getAdminAuthState,
  setAdminAuthState,
  resetAllDataToDefault,
  exportBackupJSON,
  importBackupJSON,
} from './utils/storage.ts';

import { Navbar } from './components/Navbar.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { CategoryBar } from './components/CategoryBar.tsx';
import { FlashSaleSection } from './components/FlashSaleSection.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { CommunitySection } from './components/CommunitySection.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';
import { HelpSection } from './components/HelpSection.tsx';

import { 
  Search, 
  ArrowRight,
  ShieldAlert,
  Lock,
  Wrench,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // Global Store State loaded from LocalStorage
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => getStoredConfig());
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [banners, setBanners] = useState<Banner[]>(() => getStoredBanners());
  const [groups, setGroups] = useState<GroupChannel[]>(() => getStoredGroups());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => getStoredTestimonials());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => getAdminAuthState());

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Filters & Product Selection
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [badgeFilter, setBadgeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const productSliderRef = useRef<HTMLDivElement | null>(null);

  // Deep-linking & Private Admin Triggers
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (productId) {
      const match = products.find((p) => p.id === productId);
      if (match) {
        setSelectedProduct(match);
      }
    }

    const checkAdminQuery = () => {
      const p = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      if (p.get('admin') === 'true' || p.get('admin') === 'pionz' || hash === '#admin') {
        if (isAdminLoggedIn) {
          setIsAdminOpen(true);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };
    checkAdminQuery();

    // Secret shortcut for shop owner: Ctrl + Shift + A or Alt + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
          (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        if (isAdminLoggedIn) {
          setIsAdminOpen((prev) => !prev);
        } else {
          setIsLoginModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products, isAdminLoggedIn]);

  // Sync state changes to storage
  const handleUpdateConfig = (newConfig: StoreConfig) => {
    setStoreConfig(newConfig);
    saveStoredConfig(newConfig);
  };

  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveStoredProducts(newProducts);
  };

  const handleUpdateBanners = (newBanners: Banner[]) => {
    setBanners(newBanners);
    saveStoredBanners(newBanners);
  };

  const handleUpdateGroups = (newGroups: GroupChannel[]) => {
    setGroups(newGroups);
    saveStoredGroups(newGroups);
  };

  const handleUpdateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    saveStoredTestimonials(newTestimonials);
  };

  const handleResetDefault = () => {
    resetAllDataToDefault();
    setStoreConfig(getStoredConfig());
    setProducts(getStoredProducts());
    setBanners(getStoredBanners());
    setGroups(getStoredGroups());
    setTestimonials(getStoredTestimonials());
  };

  const handleImportBackup = (jsonStr: string): boolean => {
    const ok = importBackupJSON(jsonStr);
    if (ok) {
      setStoreConfig(getStoredConfig());
      setProducts(getStoredProducts());
      setBanners(getStoredBanners());
      setGroups(getStoredGroups());
      setTestimonials(getStoredTestimonials());
    }
    return ok;
  };

  // Admin Auth Handlers
  const handleOpenAdminTrigger = () => {
    if (isAdminLoggedIn) {
      setIsAdminOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setAdminAuthState(true);
    setIsLoginModalOpen(false);
    setIsAdminOpen(true);
  };

  const handleLogoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminAuthState(false);
    setIsAdminOpen(false);
  };

  // Product Selection Handlers
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    const url = new URL(window.location.href);
    url.searchParams.set('product', product.id);
    window.history.replaceState({}, '', url.toString());
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('product');
    window.history.replaceState({}, '', url.toString());
  };

  // Compute product counts for categories
  const productCounts = useMemo(() => {
    const counts: Record<string, number> = { total: products.length };
    products.forEach((p) => {
      counts[p.game] = (counts[p.game] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Game filter
        if (selectedGame !== 'all' && product.game !== selectedGame) {
          return false;
        }

        // Status filter
        if (statusFilter === 'available' && product.sold) {
          return false;
        }
        if (statusFilter === 'sold' && !product.sold) {
          return false;
        }

        // Badge filter
        if (badgeFilter !== 'all' && product.badge?.toUpperCase() !== badgeFilter.toUpperCase()) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(query);
          const matchId = product.id.toLowerCase().includes(query);
          const matchSpecs = product.specs?.some((s) => s.toLowerCase().includes(query));
          const matchGame = product.game.toLowerCase().includes(query);
          if (!matchName && !matchId && !matchSpecs && !matchGame) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;

        if (sortBy === 'price_asc') {
          return priceA - priceB;
        }
        if (sortBy === 'price_desc') {
          return priceB - priceA;
        }
        // Newest default: unsold first, then flash, then original order
        if (a.sold !== b.sold) {
          return a.sold ? 1 : -1;
        }
        return 0;
      });
  }, [products, selectedGame, statusFilter, badgeFilter, searchQuery, sortBy]);

  // MAINTENANCE MODE VIEW (if activated and user is not admin)
  if (storeConfig.maintenanceMode && !isAdminLoggedIn && !isAdminOpen) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
            <Wrench className="w-8 h-8 animate-spin-slow" />
          </div>

          <h2 className="text-2xl font-black font-heading text-white">
            Sedang Dalam Pemeliharaan
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            {storeConfig.maintenanceMessage ||
              'Toko sedang dalam pemeliharaan sistem untuk meningkatkan kenyamanan Anda. Kami akan segera kembali!'}
          </p>

          <div className="pt-2 space-y-3">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1 mx-auto pt-2"
            >
              <Lock className="w-3 h-3" />
              <span>Login Pemilik / Admin</span>
            </button>
          </div>
        </div>

        {/* Login Modal inside maintenance */}
        <AdminLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={handleLoginSuccess}
          logo={storeConfig.logo} brandName={storeConfig.brandName}
        />
      </div>
    );
  }

  // IF ADMIN PANEL IS OPEN
  if (isAdminOpen) {
    return (
      <AdminPanel
        config={storeConfig}
        products={products}
        banners={banners}
        groups={groups}
        testimonials={testimonials}
        onUpdateConfig={handleUpdateConfig}
        onUpdateProducts={handleUpdateProducts}
        onUpdateBanners={handleUpdateBanners}
        onUpdateGroups={handleUpdateGroups}
        onUpdateTestimonials={handleUpdateTestimonials}
        onExit={() => setIsAdminOpen(false)}
        onLogout={handleLogoutAdmin}
        onResetDefault={handleResetDefault}
        onImportBackup={handleImportBackup}
        onExportBackup={exportBackupJSON}
      />
    );
  }

  // STANDARD PUBLIC STORE VIEW
  return (
    <div className="pionz-public min-h-screen text-slate-100 flex flex-col font-sans">
      {/* Navbar Header */}
      <Navbar
        config={storeConfig}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAdmin={handleOpenAdminTrigger}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'beranda' && (
          <div className="space-y-4">
            {/* Hero Banner (Only 1 banner now, user's main banner) */}
            <HeroBanner
              banners={banners}
              storeConfig={storeConfig}
              onExploreClick={() => setActiveTab('katalog')}
            />

            {/* Category Selector Chips */}
            <CategoryBar
              selectedGame={selectedGame}
              onSelectGame={(game) => {
                setSelectedGame(game);
                setActiveTab('katalog');
              }}
              productCounts={productCounts}
            />

            {/* Flash Sale Section */}
            <FlashSaleSection
              products={products}
              config={storeConfig}
              onSelectProduct={handleSelectProduct}
              onViewAllFlash={() => {
                setBadgeFilter('HOT');
                setActiveTab('katalog');
              }}
            />

            {/* Featured Product Section */}
            <section className="pionz-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-6 bg-[#08499f] rounded-full" />
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                      Daftar Akun Game Pilihan
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Koleksi akun Free Fire terverifikasi dengan transaksi aman & garansi akun
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('katalog')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] border border-white/10 text-xs sm:text-sm font-bold text-slate-200 hover:bg-[#1a2232] transition-all self-start sm:self-auto shadow-sm"
                >
                  <span>Lihat Semua Akun ({products.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Product Slider — 6 produk utama + produk lainnya bisa digeser */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="Produk sebelumnya"
                  onClick={() => productSliderRef.current?.scrollBy({ left: -360, behavior: 'smooth' })}
                  className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-[#111827]/95 border border-white/10 text-white shadow-xl hover:bg-[#1b2435]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div
                  ref={productSliderRef}
                  className="pionz-product-slider flex gap-2.5 sm:gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 scroll-smooth"
                >
                  {products.slice(0, 6).map((product) => (
                    <div key={product.id} className="pionz-product-slide shrink-0 w-[78vw] sm:w-[31vw] md:w-[24vw] lg:w-[19vw] xl:w-[16.2vw] snap-start">
                      <ProductCard
                        product={product}
                        config={storeConfig}
                        onSelect={handleSelectProduct}
                      />
                    </div>
                  ))}
                  {products.slice(6).map((product) => (
                    <div key={`more-${product.id}`} className="pionz-product-slide shrink-0 w-[78vw] sm:w-[31vw] md:w-[24vw] lg:w-[19vw] xl:w-[16.2vw] snap-start">
                      <ProductCard
                        product={product}
                        config={storeConfig}
                        onSelect={handleSelectProduct}
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Produk berikutnya"
                  onClick={() => productSliderRef.current?.scrollBy({ left: 360, behavior: 'smooth' })}
                  className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-[#111827]/95 border border-white/10 text-white shadow-xl hover:bg-[#1b2435]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-slate-500">
                <span>Geser untuk melihat produk lainnya</span>
                <ArrowRight className="w-3 h-3" />
              </div>

              {/* View More Button */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setActiveTab('katalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#08499f] hover:bg-[#063980] text-white font-extrabold text-sm shadow-md shadow-[#08499f]/30 active:scale-95 transition-all"
                >
                  <span>Buka Semua Katalog ({products.length} Akun)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* Quick Community / Groups Banner in Home */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="bg-gradient-to-r from-blue-900 to-[#08499f] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="flex items-center gap-4">
                  <img
                    src={storeConfig.logo}
                    alt={storeConfig.brandName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30 shadow-lg"
                  />
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black font-heading">
                      Gabung Komunitas & Saluran Stok {storeConfig.brandName}
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-lg">
                      Dapatkan notifikasi akun baru setiap hari, jasa post gratis (japost), rekber resmi, dan info promo flash sale!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('grup');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-[#111827] border border-white/10 text-slate-200 hover:bg-[#1a2232] font-black text-xs sm:text-sm shadow-lg whitespace-nowrap active:scale-95 transition-all shrink-0"
                >
                  Lihat Grup WhatsApp & Saluran
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'katalog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            {/* Catalog Header & Filters */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 font-heading">
                    Katalog Akun Free Fire
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Menampilkan {filteredProducts.length} akun Free Fire dengan transaksi aman & garansi akun
                  </p>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                    Urutkan:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="pionz-dark-control bg-[#111827] border border-white/10 text-xs sm:text-sm font-bold text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7c5cff]/30"
                  >
                    <option value="newest">Terbaru & Ready</option>
                    <option value="price_asc">Harga Terendah</option>
                    <option value="price_desc">Harga Tertinggi</option>
                  </select>
                </div>
              </div>

              {/* Status and Category Filter Rows */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                {/* Game Info Badge */}
                <div className="pionz-dark-control flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  <span>Katalog Khusus Free Fire ({filteredProducts.length} Akun)</span>
                </div>

                <div className="h-6 w-px bg-white/10 hidden sm:block" />

                {/* Status Tabs */}
                <div className="pionz-dark-control flex items-center gap-1.5 bg-[#111827] border border-white/10 p-1 rounded-2xl">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === 'all'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Semua Status
                  </button>
                  <button
                    onClick={() => setStatusFilter('available')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === 'available'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tersedia
                  </button>
                  <button
                    onClick={() => setStatusFilter('sold')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      statusFilter === 'sold'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Terjual
                  </button>
                </div>

                {/* Badge Tag Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {['all', 'HOT', 'PELAJAR', 'SULTAN', 'LIMITED'].map((badge) => (
                    <button
                      key={badge}
                      onClick={() => setBadgeFilter(badge)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold uppercase border transition-all ${
                        badgeFilter === badge
                          ? 'bg-[#08499f] text-white border-[#08499f]'
                          : 'bg-[#111827] text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {badge === 'all' ? 'Semua Badge' : badge}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Catalog Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    config={storeConfig}
                    onSelect={handleSelectProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Tidak Ada Akun Yang Sesuai
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Coba sesuaikan kata kunci pencarian atau reset filter untuk melihat akun lainnya.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGame('all');
                    setStatusFilter('all');
                    setBadgeFilter('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#08499f] text-white text-xs font-bold hover:bg-[#063980]"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bantuan' && (
          <HelpSection config={storeConfig} />
        )}

        {activeTab === 'grup' && (
          <CommunitySection groups={groups} config={storeConfig} />
        )}

      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseModal}
        config={storeConfig}
      />

      {/* Footer */}
      <Footer
        config={storeConfig}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={handleOpenAdminTrigger}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} config={storeConfig} />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        logo={storeConfig.logo} brandName={storeConfig.brandName}
      />
    </div>
  );
}
