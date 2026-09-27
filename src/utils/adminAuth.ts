export interface AdminAuthResult {
  ok: boolean;
  message?: string;
}

export async function authenticateAdmin(password: string): Promise<AdminAuthResult> {
  const value = password.trim();
  if (!value) return { ok: false, message: 'Password wajib diisi.' };

  try {
    const response = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: value }),
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok && data?.ok === true) return { ok: true };

    return {
      ok: false,
      message: data?.message || 'Password admin tidak valid.',
    };
  } catch {
    return {
      ok: false,
      message: 'Server autentikasi tidak tersedia. Pastikan API Vercel sudah ter-deploy dan ADMIN_PASSWORD_HASH sudah diatur.',
    };
  }
}
