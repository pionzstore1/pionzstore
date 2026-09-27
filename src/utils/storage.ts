import { Product, StoreConfig, Banner, GroupChannel, Testimonial } from '../types.ts';
import { 
  PRODUCTS as DEFAULT_PRODUCTS, 
  STORE_CONFIG as DEFAULT_CONFIG, 
  BANNERS as DEFAULT_BANNERS, 
  GROUPS as DEFAULT_GROUPS, 
  TESTIMONIALS as DEFAULT_TESTIMONIALS 
} from '../data/storeData.ts';

const STORAGE_KEYS = {
  PRODUCTS: 'pionz_store_products_v2',
  CONFIG: 'pionz_store_config_v2',
  BANNERS: 'pionz_store_banners_v3',
  GROUPS: 'pionz_store_groups_v2',
  TESTIMONIALS: 'pionz_store_testimonials_v2',
  ADMIN_AUTH: 'pionz_admin_auth_v2',
  ADMIN_SESSION_TIME: 'pionz_admin_session_time_v2',
  LOGIN_FAILED_ATTEMPTS: 'pionz_admin_failed_attempts_v2',
  LOGIN_LOCKOUT_UNTIL: 'pionz_admin_lockout_until_v2',
  SECURITY_LOGS: 'pionz_admin_security_logs_v2',
};

const MAX_FAILED_ATTEMPTS = 3; // Strict 3x attempts limit
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes lockout
const DEFAULT_SESSION_MAX_IDLE_MS = 15 * 60 * 1000; // 15 minutes default auto-lock

export function getSessionMaxIdleMs(): number {
  try {
    const config = getStoredConfig();
    if (config.sessionTimeoutMinutes && config.sessionTimeoutMinutes > 0) {
      return config.sessionTimeoutMinutes * 60 * 1000;
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_SESSION_MAX_IDLE_MS;
}

export interface SecurityLogEntry {
  id: string;
  timestamp: string;
  event: string;
  success: boolean;
  ipPlaceholder?: string;
  userAgent: string;
}

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return DEFAULT_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRODUCTS;
  } catch (e) {
    console.error('Failed to load products from storage:', e);
    return DEFAULT_PRODUCTS;
  }
}

export function saveStoredProducts(products: Product[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products:', e);
  }
}

export function getStoredConfig(): StoreConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) return DEFAULT_CONFIG;
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_CONFIG, ...parsed };
    // Legacy builds stored the admin password in LocalStorage. Never use or retain it.
    delete (merged as Partial<StoreConfig>).adminPassword;
    return merged;
  } catch (e) {
    console.error('Failed to load config from storage:', e);
    return DEFAULT_CONFIG;
  }
}

export function saveStoredConfig(config: StoreConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save config:', e);
  }
}

export function getStoredBanners(): Banner[] {
  if (typeof window === 'undefined') return DEFAULT_BANNERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BANNERS);
    if (!raw) return DEFAULT_BANNERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_BANNERS;
  } catch (e) {
    console.error('Failed to load banners:', e);
    return DEFAULT_BANNERS;
  }
}

export function saveStoredBanners(banners: Banner[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
  } catch (e) {
    console.error('Failed to save banners:', e);
  }
}

export function getStoredGroups(): GroupChannel[] {
  if (typeof window === 'undefined') return DEFAULT_GROUPS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GROUPS);
    if (!raw) return DEFAULT_GROUPS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_GROUPS;
  } catch (e) {
    console.error('Failed to load groups:', e);
    return DEFAULT_GROUPS;
  }
}

export function saveStoredGroups(groups: GroupChannel[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  } catch (e) {
    console.error('Failed to save groups:', e);
  }
}

export function getStoredTestimonials(): Testimonial[] {
  if (typeof window === 'undefined') return DEFAULT_TESTIMONIALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
    if (!raw) return DEFAULT_TESTIMONIALS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_TESTIMONIALS;
  } catch (e) {
    console.error('Failed to load testimonials:', e);
    return DEFAULT_TESTIMONIALS;
  }
}

export function saveStoredTestimonials(testimonials: Testimonial[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
  } catch (e) {
    console.error('Failed to save testimonials:', e);
  }
}

export function getAdminAuthState(): boolean {
  if (typeof window === 'undefined') return false;
  const isAuth = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  if (!isAuth) return false;

  // Verify session timeout
  const lastActive = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION_TIME);
  if (!lastActive) {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    return false;
  }

  const idleTime = Date.now() - parseInt(lastActive, 10);
  const maxIdle = getSessionMaxIdleMs();
  if (idleTime > maxIdle) {
    // Session expired
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION_TIME);
    addSecurityLog('Sesi Berakhir Otomatis (Inactivity Timeout)', false);
    return false;
  }

  // Session still valid, update activity timestamp
  localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION_TIME, Date.now().toString());
  return true;
}

export function touchAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION_TIME, Date.now().toString());
}

export function setAdminAuthState(isLoggedIn: boolean): void {
  if (typeof window === 'undefined') return;
  if (isLoggedIn) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION_TIME, Date.now().toString());
    resetFailedAttempts();
    addSecurityLog('Login Admin Berhasil', true);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION_TIME);
    addSecurityLog('Logout Admin Selesai', true);
  }
}

export function getLockoutStatus(): { isLocked: boolean; remainingSeconds: number; failedAttempts: number } {
  if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
  
  const lockoutUntilStr = localStorage.getItem(STORAGE_KEYS.LOGIN_LOCKOUT_UNTIL);
  const failedAttempts = parseInt(localStorage.getItem(STORAGE_KEYS.LOGIN_FAILED_ATTEMPTS) || '0', 10);
  
  if (lockoutUntilStr) {
    const lockoutUntil = parseInt(lockoutUntilStr, 10);
    const now = Date.now();
    if (now < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      return { isLocked: true, remainingSeconds, failedAttempts };
    } else {
      // Lockout expired, reset
      localStorage.removeItem(STORAGE_KEYS.LOGIN_LOCKOUT_UNTIL);
      localStorage.setItem(STORAGE_KEYS.LOGIN_FAILED_ATTEMPTS, '0');
    }
  }

  return { isLocked: false, remainingSeconds: 0, failedAttempts };
}

export function recordFailedAttempt(): { isLocked: boolean; remainingSeconds: number; attemptsLeft: number } {
  if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_FAILED_ATTEMPTS };

  const currentAttempts = parseInt(localStorage.getItem(STORAGE_KEYS.LOGIN_FAILED_ATTEMPTS) || '0', 10) + 1;
  localStorage.setItem(STORAGE_KEYS.LOGIN_FAILED_ATTEMPTS, currentAttempts.toString());
  addSecurityLog(`Percobaan Password Salah (${currentAttempts}/${MAX_FAILED_ATTEMPTS})`, false);

  if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
    const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
    localStorage.setItem(STORAGE_KEYS.LOGIN_LOCKOUT_UNTIL, lockoutUntil.toString());
    addSecurityLog('Sistem Mengunci Akses (Brute-Force Protection Aktif)', false);
    return {
      isLocked: true,
      remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      attemptsLeft: 0,
    };
  }

  return {
    isLocked: false,
    remainingSeconds: 0,
    attemptsLeft: Math.max(0, MAX_FAILED_ATTEMPTS - currentAttempts),
  };
}

export function resetFailedAttempts(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.LOGIN_FAILED_ATTEMPTS);
  localStorage.removeItem(STORAGE_KEYS.LOGIN_LOCKOUT_UNTIL);
}

export function getSecurityLogs(): SecurityLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SECURITY_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function addSecurityLog(event: string, success: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSecurityLogs();
    const entry: SecurityLogEntry = {
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      event,
      success,
      userAgent: navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Browser',
    };
    const updated = [entry, ...existing].slice(0, 50); // Keep last 50 logs
    localStorage.setItem(STORAGE_KEYS.SECURITY_LOGS, JSON.stringify(updated));
  } catch (e) {
    // Ignore log errors
  }
}

export function clearSecurityLogs(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.SECURITY_LOGS);
  addSecurityLog('Riwayat Log Keamanan Direset oleh Admin', true);
}

export function resetAllDataToDefault(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
  localStorage.removeItem(STORAGE_KEYS.CONFIG);
  localStorage.removeItem(STORAGE_KEYS.BANNERS);
  localStorage.removeItem(STORAGE_KEYS.GROUPS);
  localStorage.removeItem(STORAGE_KEYS.TESTIMONIALS);
}

export function exportBackupJSON(): string {
  const data = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    config: getStoredConfig(),
    banners: getStoredBanners(),
    products: getStoredProducts(),
    groups: getStoredGroups(),
    testimonials: getStoredTestimonials(),
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.config) saveStoredConfig(parsed.config);
    if (Array.isArray(parsed.banners)) saveStoredBanners(parsed.banners);
    if (Array.isArray(parsed.products)) saveStoredProducts(parsed.products);
    if (Array.isArray(parsed.groups)) saveStoredGroups(parsed.groups);
    if (Array.isArray(parsed.testimonials)) saveStoredTestimonials(parsed.testimonials);
    return true;
  } catch (e) {
    console.error('Invalid backup JSON:', e);
    return false;
  }
}
