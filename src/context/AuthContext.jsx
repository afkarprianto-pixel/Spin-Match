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

  const register = async () => ({
    success: false,
    message: 'Pendaftaran EO/Public sedang disiapkan melalui Supabase. Untuk sementara gunakan Masuk Public.',
  });

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
