import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import logoSpinMatch from '../assets/logo-spinmatch.PNG';
import { 
  LayoutDashboard, Layers, Calendar, Radio, Trophy, Settings, LogOut, KeyRound,
  ChevronUp, Users, Dices
} from 'lucide-react';

export const Sidebar = ({ activeView, setActiveView }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setShowProfileMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGantiPassword = () => {
    setShowProfileMenu(false);
    alert('Fitur Ganti Password akan membuka modal ubah password.');
  };

  const getNavClass = (viewName) => {
    const isActive = activeView === viewName;
    return `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
      isActive
        ? 'bg-[#bef264] text-slate-950 font-black shadow-lg shadow-lime-950/50'
        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
    }`;
  };

  return (
    <aside className="w-64 bg-[#070d18] border-r border-slate-800/80 flex flex-col justify-between p-4 min-h-screen text-slate-300 select-none">
      <div>
        <div className="flex items-center gap-3.5 px-1 py-3 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border-2 border-slate-700 p-2 flex items-center justify-center shadow-xl shrink-0">
            <img src={logoSpinMatch} alt="SpinMatch Logo" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <h1 className="font-black text-white text-xl tracking-tight leading-none">SpinMatch</h1>
            <span className="text-[11px] text-slate-400 font-medium">Table Tennis Platform</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          <button onClick={() => setActiveView?.('DASHBOARD')} className={getNavClass('DASHBOARD')}>
            <LayoutDashboard className={`w-4 h-4 ${activeView === 'DASHBOARD' ? 'text-slate-950 stroke-[2.5]' : ''}`} />
            <span>Dashboard</span>
          </button>

          <button onClick={() => setActiveView?.('EVENTS')} className={getNavClass('EVENTS')}>
            <Layers className="w-4 h-4" /><span>Event & Divisi</span>
          </button>

          <button onClick={() => setActiveView?.('REGISTRATION')} className={getNavClass('REGISTRATION')}>
            <Users className="w-4 h-4" /><span>Data Peserta</span>
          </button>

          <button onClick={() => setActiveView?.('DRAW')} className={getNavClass('DRAW')}>
            <Dices className="w-4 h-4" /><span>Undian Peserta</span>
          </button>

          <button onClick={() => setActiveView?.('SCHEDULE')} className={getNavClass('SCHEDULE')}>
            <Calendar className="w-4 h-4" /><span>Jadwal Pertandingan</span>
          </button>

          <button type="button" onClick={() => setActiveView?.('LIVE_SCORE')} className={getNavClass('LIVE_SCORE')}>
            <Radio className={`w-4 h-4 ${activeView === 'LIVE_SCORE' ? 'text-red-600' : 'text-red-500'} animate-pulse`} />
            <span>Live Score</span>
          </button>

          <button type="button" onClick={() => setActiveView?.('KNOCKOUT')} className={getNavClass('KNOCKOUT')}>
            <Trophy className={`w-4 h-4 ${activeView === 'KNOCKOUT' ? 'text-slate-950 stroke-[2.5]' : ''}`} />
            <span>Bracket Knockout</span>
          </button>
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800/80 relative" ref={menuRef}>
        <button
          onClick={() => setActiveView?.('SETTINGS')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 mb-2 rounded-xl text-sm font-medium transition cursor-pointer ${
            activeView === 'SETTINGS' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
          }`}
        >
          <Settings className="w-4 h-4" /><span>Pengaturan</span>
        </button>

        {showProfileMenu && (
          <div className="absolute bottom-20 left-0 right-0 bg-[#0a1120] border border-slate-800 rounded-2xl p-2 shadow-2xl space-y-1 z-50">
            <button onClick={handleGantiPassword} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer">
              <KeyRound className="w-4 h-4 text-amber-400" /><span>Ganti Password</span>
            </button>
            <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition cursor-pointer">
              <LogOut className="w-4 h-4" /><span>Keluar (Logout)</span>
            </button>
          </div>
        )}

        <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center justify-between p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-2xl cursor-pointer transition">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-slate-950 font-black text-base flex items-center justify-center shrink-0 shadow-md shadow-orange-950/40 border border-orange-400/50">{initial}</div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate">{user?.name || 'User'}</h4>
              <p className="text-[11px] text-slate-400 truncate">{user?.roleLabel || user?.role}</p>
            </div>
          </div>
          <ChevronUp className={`w-4 h-4 text-slate-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </aside>
  );
};
