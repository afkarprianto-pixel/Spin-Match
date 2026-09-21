import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus } from 'lucide-react';

export const Header = () => {
  const { user } = useAuth();

  const badgeText = user?.role === 'SUPER_ADMIN' ? 'SA' : 'EO';
  const roleTitle = user?.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : user?.role || 'LIVE';

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        {/* TEKS WORKSPACE DITAMPILKAN KEMBALI */}
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
          SEPTEMBER 2026 • {roleTitle} WORKSPACE
        </p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Selamat datang di SpinMatch
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sistem online
        </div>

        <div className="px-3.5 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-full border border-slate-200 shadow-xs">
          {badgeText}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition cursor-pointer shadow-md">
          <Plus className="w-4 h-4 text-[#bef264]" />
          Buat Event
        </button>
      </div>
    </div>
  );
};