import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  X, 
  AlertTriangle,
  Fingerprint,
  Lock
} from 'lucide-react';
import { getLockoutStatus, recordFailedAttempt, resetFailedAttempts, addSecurityLog } from '../utils/storage.ts';
import { authenticateAdmin } from '../utils/adminAuth.ts';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expectedPassword?: string;
  expectedPin?: string;
  logo?: string;
  brandName?: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  expectedPassword,
  expectedPin,
  logo,
  brandName = 'Pionz Store',
}) => {
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'password' | 'pin'>('password');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [lockoutSec, setLockoutSec] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);

  // Check initial lockout state when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const status = getLockoutStatus();
    if (status.isLocked) {
      setLockoutSec(status.remainingSeconds);
    } else {
      setLockoutSec(0);
      setAttemptsLeft(Math.max(0, 3 - status.failedAttempts));
    }
    setStep('password');
    setPassword('');
    setPin('');
    setErrorMsg('');
  }, [isOpen]);

  // Live countdown timer during lockout
  useEffect(() => {
    if (lockoutSec <= 0) return;
    const timer = setInterval(() => {
      setLockoutSec((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          resetFailedAttempts();
          setErrorMsg('');
          setAttemptsLeft(3);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSec]);

  if (!isOpen) return null;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSec > 0) return;

    const result = await authenticateAdmin(password);

    if (result.ok) {
      if (expectedPin && expectedPin.trim().length >= 4) {
        setStep('pin');
        setErrorMsg('');
      } else {
        resetFailedAttempts();
        setErrorMsg('');
        setPassword('');
        setLockoutSec(0);
        onSuccess();
      }
    } else {
      const res = recordFailedAttempt();
      if (res.isLocked) {
        setLockoutSec(res.remainingSeconds);
        setErrorMsg('AKSES DIKUNCI SEMENTARA. Terlalu banyak percobaan gagal.');
      } else {
        setAttemptsLeft(res.attemptsLeft);
        setErrorMsg(`${result.message || 'Password salah.'} Sisa percobaan: ${res.attemptsLeft}x.`);
      }
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSec > 0) return;

    const trimmedPin = pin.trim();
    if (trimmedPin === expectedPin?.trim()) {
      resetFailedAttempts();
      setErrorMsg('');
      setPassword('');
      setPin('');
      setLockoutSec(0);
      onSuccess();
    } else {
      const res = recordFailedAttempt();
      if (res.isLocked) {
        setLockoutSec(res.remainingSeconds);
        setStep('password');
        setErrorMsg('PIN Keamanan salah! Sistem terkunci.');
      } else {
        setAttemptsLeft(res.attemptsLeft);
        setErrorMsg(`PIN salah! Sisa percobaan: ${res.attemptsLeft}x.`);
      }
    }
  };

  const isLocked = lockoutSec > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="w-full max-w-sm bg-[#0e131f] text-white rounded-3xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top High-Security Accent Strip */}
        <div className={`h-1.5 w-full absolute top-0 left-0 ${
          isLocked 
            ? 'bg-rose-600 animate-pulse' 
            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600'
        }`} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand logo */}
        <div className="text-center pt-3 mb-3">
          {logo ? (
            <img
              src={logo}
              alt={brandName}
              className="mx-auto w-16 h-16 rounded-2xl object-cover border border-slate-700/80 shadow-xl"
            />
          ) : (
            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-amber-400 font-black text-xl">
              {brandName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <p className="mt-2 text-xs font-bold text-slate-300">{brandName}</p>
        </div>

        {/* Security Header */}
        <div className="text-center mb-6 pt-2">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ${
            isLocked
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 ring-4 ring-rose-500/10'
              : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 ring-4 ring-amber-500/10'
          }`}>
            {isLocked ? (
              <ShieldAlert className="w-7 h-7" />
            ) : step === 'pin' ? (
              <Fingerprint className="w-7 h-7" />
            ) : (
              <Lock className="w-7 h-7" />
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Gate Keamanan Admin
          </div>

          <h3 className="text-xl font-black font-heading text-white">
            {isLocked 
              ? 'Akses Dikunci Sementara' 
              : step === 'pin'
              ? 'Verifikasi Master PIN'
              : 'Autentikasi Pemilik Toko'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {isLocked 
              ? 'Sistem anti-brute-force aktif. Akses login ditangguhkan sementara.'
              : step === 'pin'
              ? 'Masukkan 6 digit Master Security PIN kedua untuk membuka panel.'
              : 'Akses khusus pemilik toko. Seluruh upaya login dicatat ke sistem audit.'}
          </p>
        </div>

        {/* Lockout Active Alert Screen */}
        {isLocked ? (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-center space-y-3 mb-4">
            <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4 animate-spin-slow" />
              <span>Proteksi Brute-Force Aktif</span>
            </div>

            <div className="font-mono text-3xl font-black text-rose-400 tabular-nums">
              {formatTimer(lockoutSec)}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tunggu hitung mundur di atas selesai sebelum dapat memasukkan password kembali.
            </p>
          </div>
        ) : step === 'password' ? (
          /* Step 1: Password Form */
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  Password Admin
                </label>
                {attemptsLeft !== null && attemptsLeft < 3 && (
                  <span className="text-[10px] text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Sisa {attemptsLeft}x percobaan!
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMsg('');
                  }}
                  autoFocus
                  placeholder="Masukkan password admin..."
                  className="w-full bg-[#141b2a] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 pr-10 font-mono tracking-wider transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {errorMsg ? (
                <div className="text-xs text-rose-300 mt-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
                  <span>Password tersimpan di server, bukan di source website.</span>
                  <span className="text-[10px] text-slate-500">Maks 3x salah</span>
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!password.trim() || isLocked}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-sm shadow-lg shadow-orange-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Verifikasi Kredensial</span>
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: PIN Form (when 2FA pin is enabled) */
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Master Security PIN
              </label>

              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ''));
                  setErrorMsg('');
                }}
                autoFocus
                placeholder="••••••"
                className="w-full bg-[#141b2a] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-center text-xl text-amber-400 tracking-[0.5em] font-mono focus:outline-none focus:border-amber-500"
              />

              {errorMsg && (
                <div className="text-xs text-rose-300 mt-2 p-2 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('password')}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={pin.length < 4 || isLocked}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-40 text-slate-950 font-black text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Buka Panel</span>
              </button>
            </div>
          </form>
        )}

        {/* Security Footer Badge */}
        <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Keamanan Ketat Grade A+
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Auto-Lock 3x Salah
          </span>
        </div>
      </div>
    </div>
  );
};
