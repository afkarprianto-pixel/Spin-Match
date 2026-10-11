import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);
const fromAuthUser = (authUser) => {
  if (!authUser) return null;
  const role = String(authUser.app_metadata?.spinmatch_role || (authUser.app_metadata?.role === 'WASIT' ? 'WASIT' : '')).toUpperCase();
  if (!['SUPER_ADMIN', 'EO', 'WASIT'].includes(role)) return null;
  return {
    id: authUser.id, email: authUser.email || '',
    name: authUser.user_metadata?.full_name || authUser.email || '',
    role, roleLabel: role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'EO' ? 'EO' : 'Wasit',
    app_metadata: authUser.app_metadata, user_metadata: authUser.user_metadata,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const recoveryRef = useRef(window.location.pathname.replace(/\/$/, '') === '/reset-password' || window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery'));
  const [recoveryMode, setRecoveryMode] = useState(recoveryRef.current);
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;
      if (error && error.name !== 'AuthSessionMissingError') console.warn('Supabase auth:', error.message);
      setUser(recoveryRef.current ? null : fromAuthUser(data?.user));
      setLoading(false);
    };
    refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'PASSWORD_RECOVERY') {
        recoveryRef.current = true;
        setRecoveryMode(true);
        setUser(null);
      } else {
        setUser(recoveryRef.current ? null : fromAuthUser(session?.user));
      }
      setLoading(false);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const login = async (usernameOrEmail, password) => {
    const identifier = String(usernameOrEmail || '').trim();
    if (!identifier || !password) {
      return { success: false, message: 'Masukkan username dan password.' };
    }

    if (identifier.includes('@')) {
      // Login email lama dipertahankan sementara sebagai cadangan pengujian.
      const { error } = await supabase.auth.signInWithPassword({
        email: identifier.toLowerCase(), password,
      });
      if (error) {
        const msg = String(error.message || '');
        if (/email not confirmed/i.test(msg)) return { success: false, message: 'Email belum diverifikasi. Periksa Inbox/Spam dan klik tautan verifikasi.' };
        if (/invalid login credentials/i.test(msg)) return { success: false, message: 'Email atau password tidak cocok.' };
        return { success: false, message: `Login gagal: ${msg}` };
      }
    } else {
      // Username diverifikasi di server; email akun tidak dikirim ke browser.
      const { data, error } = await supabase.functions.invoke('spinmatch-login', {
        body: { username: identifier, password },
      });
      if (error || !data?.success || !data?.access_token || !data?.refresh_token) {
        return { success: false, message: data?.error || 'Username atau password tidak cocok. Jika fungsi belum dapat diakses, hubungi administrator.' };
      }
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      if (sessionError) {
        return { success: false, message: 'Sesi login gagal disimpan. Silakan coba lagi.' };
      }
    }

    const { data: verified, error: verifyError } = await supabase.auth.getUser();
    const verifiedUser = !verifyError ? fromAuthUser(verified?.user) : null;
    if (!verifiedUser) {
      await supabase.auth.signOut();
      setUser(null);
      return { success: false, message: 'Akun belum mempunyai peran resmi di Supabase. Hubungi Super Admin.' };
    }
    setUser(verifiedUser);
    return { success: true, user: verifiedUser };
  };

  const register = async ({ name, username, password, phone = '', email = '', role = 'EO' }) => {
    if (role !== 'EO') return { success: false, message: 'Pendaftaran Public belum tersedia. Gunakan Masuk Public.' };
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanName = String(name || '').trim();
    const cleanUsername = String(username || '').trim();
    if (!cleanName || !cleanUsername || !cleanEmail || !password) return { success: false, message: 'Nama, username, email dan password wajib diisi.' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return { success: false, message: 'Alamat email tidak valid.' };
    if (cleanUsername.length < 4) return { success: false, message: 'Username minimal 4 karakter.' };
    if (String(password).length < 8) return { success: false, message: 'Password minimal 8 karakter.' };
    const { data: existingSession } = await supabase.auth.getSession();
    if (existingSession?.session) return { success: false, message: 'Keluar dari akun aktif sebelum mendaftarkan EO baru. Gunakan browser privat jika perlu.' };
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail, password,
      options: {
        data: { full_name: cleanName, username: cleanUsername, phone: String(phone || '').trim() },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { success: false, message: `Pendaftaran gagal: ${error.message}` };
    // Supabase bisa menyamarkan email yang sudah terdaftar; jangan menjanjikan akun baru pasti dibuat.
    if (data?.session) {
      await supabase.auth.signOut();
      setUser(null);
    }
    return { success: true, message: 'Permintaan pendaftaran diterima. Jika email belum terdaftar, periksa Inbox atau Spam untuk tautan verifikasi. Jika akun sudah ada, gunakan login atau pemulihan password.' };
  };

  const resendVerification = async (email) => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return { success: false, message: 'Masukkan alamat email yang valid.' };
    const { error } = await supabase.auth.resend({ type: 'signup', email: cleanEmail, options: { emailRedirectTo: window.location.origin } });
    if (error) {
      if (/rate|limit|seconds|too many/i.test(error.message)) return { success: false, message: 'Terlalu cepat meminta email. Tunggu beberapa saat lalu coba lagi.' };
      return { success: false, message: `Belum dapat mengirim email: ${error.message}` };
    }
    return { success: true, message: 'Permintaan pengiriman diterima. Jika akun memenuhi syarat, email verifikasi akan dikirim. Periksa Inbox/Spam.' };
  };

  const requestPasswordReset = async (email) => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, message: 'Masukkan alamat email yang valid.' };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: window.location.origin + '/reset-password',
    });
    if (error) {
      if (/rate|limit|seconds|too many/i.test(error.message)) return { success: false, message: 'Terlalu banyak permintaan. Tunggu beberapa saat lalu coba lagi.' };
      return { success: false, message: `Gagal meminta pemulihan: ${error.message}` };
    }
    return { success: true, message: 'Jika email terdaftar, tautan pemulihan akan dikirim. Periksa Inbox, Spam, atau Promosi.' };
  };

  const updateRecoveredPassword = async (newPassword) => {
    if (!recoveryRef.current) return { success: false, message: 'Buka tautan pemulihan dari email terlebih dahulu.' };
    if (String(newPassword || '').length < 8) return { success: false, message: 'Password baru minimal 8 karakter.' };
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) return { success: false, message: 'Tautan pemulihan tidak valid atau kedaluwarsa. Minta tautan baru.' };
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, message: `Gagal mengubah password: ${error.message}` };
    await supabase.auth.signOut();
    recoveryRef.current = false;
    setRecoveryMode(false);
    setUser(null);
    window.history.replaceState({}, document.title, '/');
    return { success: true, message: 'Password berhasil diubah. Silakan masuk dengan password baru.' };
  };

  const loginAsPublic = async () => {
    await supabase.auth.signOut();
    const guest = { id: '', name: 'Public', username: 'public', role: 'PUBLIC', roleLabel: 'Public', isGuest: true };
    setUser(guest);
    return { success: true, user: guest };
  };
  const logout = async () => { setUser(null); await supabase.auth.signOut(); };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, resendVerification, requestPasswordReset, updateRecoveredPassword, recoveryMode, loginAsPublic, logout }}>
      {loading ? <div className="min-h-screen flex items-center justify-center">Memeriksa sesi SpinMatch...</div> : children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
