import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const STORAGE_USERS = 'spinmatch_registered_users';
const STORAGE_SESSION = 'spinmatch_auth_session';

const normalize = (value) => String(value || '').trim();
const normalizeUsername = (value) => normalize(value).toLowerCase();

const getRegisteredUsers = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]');
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const saveRegisteredUsers = (users) => {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_SESSION) || 'null');
      return saved && saved.role ? saved : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) sessionStorage.setItem(STORAGE_SESSION, JSON.stringify(user));
    else sessionStorage.removeItem(STORAGE_SESSION);
  }, [user]);

  const login = (username, password) => {
    const u = normalize(username);
    const p = String(password || '');

    // 1. Super Admin - akun lama tetap dipertahankan
    if (u === 'Teguhorina' && p === 'Teguh180b77#') {
      const adminUser = {
        username: 'Teguhorina',
        name: 'Teguh Orina',
        role: 'SUPER_ADMIN',
        roleLabel: 'Super Admin'
      };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }

    // 2. Demo EO lama tetap bisa digunakan
    if (u === 'eo_demo' && p === 'eo123') {
      const eoUser = {
        username: 'eo_demo',
        name: 'Budiono',
        role: 'EO',
        roleLabel: 'EO'
      };
      setUser(eoUser);
      return { success: true, user: eoUser };
    }

    // 3. Demo Wasit lama tetap bisa digunakan
    if (u === 'wasit_m1' && p === 'wasit123') {
      const wasitUser = {
        username: 'wasit_m1',
        name: 'Wasit Meja 1',
        role: 'WASIT',
        roleLabel: 'Wasit',
        table: 'Meja 1'
      };
      setUser(wasitUser);
      return { success: true, user: wasitUser };
    }

    // 4. Akun EO / Public yang didaftarkan dari halaman login
    const registered = getRegisteredUsers().find(
      item => normalizeUsername(item.username) === normalizeUsername(u)
    );

    if (registered) {
      if (registered.password !== p) {
        return { success: false, message: 'Username atau Password salah!' };
      }

      const registeredUser = {
        id: registered.id,
        username: registered.username,
        name: registered.name,
        role: registered.role,
        roleLabel: registered.roleLabel,
        phone: registered.phone || '',
        email: registered.email || ''
      };
      setUser(registeredUser);
      return { success: true, user: registeredUser };
    }

    return { success: false, message: 'Username atau Password salah!' };
  };

  const register = ({ name, username, password, phone = '', email = '', role = 'PUBLIC' }) => {
    const cleanName = normalize(name);
    const cleanUsername = normalize(username);
    const cleanPassword = String(password || '');
    const cleanRole = role === 'EO' ? 'EO' : 'PUBLIC';

    if (!cleanName || !cleanUsername || !cleanPassword) {
      return { success: false, message: 'Nama, Username dan Password wajib diisi.' };
    }
    if (cleanUsername.length < 4) {
      return { success: false, message: 'Username minimal 4 karakter.' };
    }
    if (cleanPassword.length < 6) {
      return { success: false, message: 'Password minimal 6 karakter.' };
    }

    const reserved = ['teguhorina', 'eo_demo', 'wasit_m1'];
    const users = getRegisteredUsers();
    const duplicate =
      reserved.includes(normalizeUsername(cleanUsername)) ||
      users.some(item => normalizeUsername(item.username) === normalizeUsername(cleanUsername));

    if (duplicate) {
      return { success: false, message: 'Username sudah digunakan. Silakan pilih username lain.' };
    }

    const newUser = {
      id: `${cleanRole}-${Date.now()}`,
      username: cleanUsername,
      password: cleanPassword,
      name: cleanName,
      phone: normalize(phone),
      email: normalize(email),
      role: cleanRole,
      roleLabel: cleanRole === 'EO' ? 'EO' : 'Public',
      createdAt: new Date().toISOString()
    };

    saveRegisteredUsers([...users, newUser]);

    return {
      success: true,
      message: cleanRole === 'EO'
        ? 'Pendaftaran EO berhasil. Silakan login.'
        : 'Pendaftaran akun Public berhasil. Silakan login.',
      user: newUser
    };
  };

  // Public dapat melihat SpinMatch tanpa password.
  const loginAsPublic = () => {
    const publicUser = {
      id: `GUEST-${Date.now()}`,
      username: 'public',
      name: 'Public',
      role: 'PUBLIC',
      roleLabel: 'Public',
      isGuest: true
    };
    setUser(publicUser);
    return { success: true, user: publicUser };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, loginAsPublic, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
