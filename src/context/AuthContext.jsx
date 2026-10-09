import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

const fromAuthUser = (authUser) => {
  if (!authUser) return null;
  // Role hanya berasal dari app_metadata yang ditetapkan di server.
  const role = String(authUser.app_metadata?.spinmatch_role || '').toUpperCase();
  if (!['SUPER_ADMIN', 'EO', 'WASIT'].includes(role)) return null;
  return {
    id: authUser.id,
    email: authUser.email || '',
    name: authUser.user_metadata?.full_name || authUser.email || '',
    role,
    roleLabel: role === 'SUPER_ADMIN' ? 'Super Admin' : role === 'EO' ? 'EO' : 'Wasit',
    app_metadata: authUser.app_metadata,
    user_metadata: authUser.user_metadata,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;
      if (error && error.name !== 'AuthSessionMissingError') console.warn('Supabase auth:', error.message);
      setUser(fromAuthUser(data?.user));
      setLoading(false);
    };
    refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(fromAuthUser(session?.user));
      setLoading(false);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const login = async (email, password) => {
    const cleanEmail = String(email || '').trim();
    if (!cleanEmail.includes('@')) {
      return { success: false, message: 'Masukkan email akun Supabase, bukan username lama.' };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    if (error) return { success: false, message: `Login gagal: ${error.message}` };
    // Verifikasi ulang identitas dan role dari server, bukan hanya cache browser.
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
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: { full_name: cleanName, username: cleanUsername, phone: String(phone || '').trim() },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { success: false, message: `Pendaftaran gagal: ${error.message}` };
    // Role EO diberikan oleh trigger database, bukan oleh metadata yang dikirim browser.
    // Tidak membuat sesi admin/EO otomatis sebelum email diverifikasi.
    if (data?.session) await supabase.auth.signOut();
    setUser(null);
    return { success: true, message: 'Pendaftaran diterima. Periksa email untuk verifikasi, lalu login sebagai EO menggunakan email dan password.' };
  };

  const loginAsPublic = async () => {
    await supabase.auth.signOut();
    const guest = { id: '', name: 'Public', username: 'public', role: 'PUBLIC', roleLabel: 'Public', isGuest: true };
    setUser(guest);
    return { success: true, user: guest };
  };

  const logout = async () => {
    setUser(null);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginAsPublic, logout }}>
      {loading ? <div className="min-h-screen flex items-center justify-center">Memeriksa sesi SpinMatch...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
