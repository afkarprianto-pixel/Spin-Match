import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // 1. Super Admin
    if (username === 'Teguhorina' && password === 'Teguh180b77#') {
      const adminUser = {
        username: 'Teguhorina',
        name: 'Teguh Orina',
        role: 'SUPER_ADMIN',
        roleLabel: 'Super Admin'
      };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }

    // 2. Demo EO
    if (username === 'eo_demo' && password === 'eo123') {
      const eoUser = {
        username: 'eo_demo',
        name: 'Budiono',
        role: 'EO',
        roleLabel: 'EO'
      };
      setUser(eoUser);
      return { success: true, user: eoUser };
    }

    // 3. Demo Wasit
    if (username === 'wasit_m1' && password === 'wasit123') {
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

    return { success: false, message: 'Username atau Password salah!' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);