import { Product, StoreConfig } from '../types.ts';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatTimestamp(timestamp?: number | null): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getBadgeColorClass(badge: string): { bg: string; text: string; border: string; glow: string } {
  switch (badge?.toUpperCase()) {
    case 'HOT':
      return {
        bg: 'bg-red-500/10 text-red-600',
        text: 'text-red-600',
        border: 'border-red-500/30',
        glow: 'shadow-red-500/20',
      };
    case 'SULTAN':
      return {
        bg: 'bg-amber-500/10 text-amber-600',
        text: 'text-amber-600',
        border: 'border-amber-500/30',
        glow: 'shadow-amber-500/20',
      };
    case 'PELAJAR':
      return {
        bg: 'bg-emerald-500/10 text-emerald-600',
        text: 'text-emerald-600',
        border: 'border-emerald-500/30',
        glow: 'shadow-emerald-500/20',
      };
    case 'LIMITED':
      return {
        bg: 'bg-purple-500/10 text-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-500/30',
        glow: 'shadow-purple-500/20',
      };
    default:
      return {
        bg: 'bg-blue-500/10 text-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-500/30',
        glow: 'shadow-blue-500/20',
      };
  }
}

export function createWhatsAppBuyUrl(product: Product, config: StoreConfig): string {
  const currentUrl = typeof window !== 'undefined' ? window.location.origin + '?product=' + product.id : '';
  const priceText = product.discountPrice ? formatRupiah(product.discountPrice) : formatRupiah(product.price);
  
  const isSold = product.sold;
  const isBooking = product.name.toLowerCase().includes('dp') || product.name.toLowerCase().includes('tikung');

  let text = '';
  if (isBooking || isSold) {
    text = `Halo Admin ${config.brandName}, saya mau tanya tentang akun berikut:\n\n` +
      `*ID Akun:* ${product.id}\n` +
      `*Nama Akun:* ${product.name}\n` +
      `*Game:* ${product.game}\n` +
      `*Harga:* ${priceText}\n` +
      (currentUrl ? `*Link:* ${currentUrl}\n\n` : '\n') +
      `Apakah akun ini masih bisa ditikung atau ada stok akun serupa yang ready? Terima kasih!`;
  } else {
    text = `Halo Admin ${config.brandName}, saya ingin membeli akun berikut:\n\n` +
      `*ID Akun:* ${product.id}\n` +
      `*Nama Akun:* ${product.name}\n` +
      `*Game:* ${product.game}\n` +
      `*Harga:* ${priceText}\n` +
      (currentUrl ? `*Link:* ${currentUrl}\n\n` : '\n') +
      `Apakah akun masih ready? Mohon info nomor rekening / QRIS pembayaran resmi dan panduan transaksinya. Terima kasih!`;
  }

  const encoded = encodeURIComponent(text);
  return `https://wa.me/${config.waNumber}?text=${encoded}`;
}

export function createGeneralWhatsAppUrl(config: StoreConfig, subject = 'Tanya Akun & Rekber'): string {
  const text = `Halo Admin ${config.brandName}, saya ingin konsultasi mengenai: *${subject}*. Apakah admin sedang online?`;
  return `https://wa.me/${config.waNumber}?text=${encodeURIComponent(text)}`;
}
