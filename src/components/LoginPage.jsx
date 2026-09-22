import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logoSpinMatch from '../assets/logo-spinmatch.png';
import {
  Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight,
  Users, UserPlus, X, Trophy, Radio, CalendarDays
} from 'lucide-react';

export const LoginPage = ({ onCancel }) => {
  const { login, register, loginAsPublic } = useAuth();

  const [mode, setMode] = useState('LOGIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [regRole, setRegRole] = useState('EO');
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const resetMessage = () => {
    setError('');
    setNotice('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetMessage();
    const result = login(username, password);
    if (!result.success) setError(result.message);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    resetMessage();

    const result = register({
      name: regName,
      username: regUsername,
      password: regPassword,
      phone: regPhone,
      email: regEmail,
      role: regRole
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    setNotice(result.message);
    setUsername(regUsername);
    setPassword('');
    setRegName('');
    setRegUsername('');
    setRegPassword('');
    setRegPhone('');
    setRegEmail('');
    setMode('LOGIN');
  };

  const handlePublic = () => {
    resetMessage();
    loginAsPublic();
  };

  const openRegister = (role) => {
    resetMessage();
    setRegRole(role);
    setMode('REGISTER');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#061a38] flex items-center justify-center px-4 py-5 sm:px-6 sm:py-6">
      {/* Background biru SpinMatch */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(37,99,235,0.40),transparent_30%),radial-gradient(circle_at_82%_78%,rgba(16,185,129,0.18),transparent_28%),linear-gradient(135deg,#04142f_0%,#0a3b79_48%,#061b3d_100%)]" />
      <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full border-[55px] border-white/[0.035] rotate-12" />
      <div className="absolute -bottom-40 -right-28 w-[480px] h-[480px] rounded-full border-[70px] border-cyan-300/[0.045]" />
      <div className="absolute left-[8%] top-[18%] w-40 h-40 rounded-full bg-blue-300/10 blur-3xl" />
      <div className="absolute right-[8%] bottom-[14%] w-48 h-48 rounded-full bg-emerald-300/10 blur-3xl" />

      {/* Ornamen sporty biru - menyatukan area belakang form dengan tema SpinMatch */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
      <div className="hidden lg:block absolute left-[3%] bottom-[7%] w-[34%] h-[24%] border-t-2 border-cyan-300/20 -skew-y-6 opacity-70 pointer-events-none" />
      <div className="hidden lg:block absolute left-[3%] bottom-[12%] w-[34%] h-[1px] bg-cyan-200/20 shadow-[0_0_18px_rgba(34,211,238,0.35)] pointer-events-none" />
      <div className="hidden lg:block absolute right-[3%] bottom-[5%] w-44 h-44 rounded-full border-[28px] border-blue-300/[0.035] pointer-events-none" />

      <div className="hidden lg:block absolute right-[9%] top-[22%] text-right">
        <p className="text-white/30 text-[11px] tracking-[0.45em] font-bold">PLAY • CONNECT</p>
        <p className="text-emerald-300/50 text-[11px] tracking-[0.35em] font-bold mt-2">TOURNAMENT • TOGETHER</p>
      </div>

      <div className="relative w-full max-w-[430px]">
        <div className="absolute -inset-[1px] rounded-[30px] bg-gradient-to-br from-cyan-300/40 via-blue-500/20 to-emerald-300/30 blur-[1px]" />

        <div className="relative bg-gradient-to-b from-[#083764]/95 via-[#072b52]/96 to-[#061d39]/96 backdrop-blur-xl border border-cyan-300/25 rounded-[28px] px-6 py-5 sm:px-8 sm:py-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] overflow-hidden">
          <div className="absolute -top-24 -left-24 w-56 h-56 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -right-28 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col items-center text-center mb-4">
            <div className="w-[68px] h-[68px] rounded-[22px] bg-white border-2 border-emerald-400 p-1.5 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.22)] mb-2.5 overflow-hidden">
              <img src={logoSpinMatch} alt="SpinMatch Logo" className="w-full h-full object-contain rounded-[16px]" />
            </div>

            <h1 className="text-[23px] sm:text-[26px] font-black tracking-tight leading-tight">
              <span className="text-white">{mode === 'REGISTER' ? 'Daftar di ' : 'Masuk ke '}</span>
              <span className="text-emerald-400">SpinMatch</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-blue-100/65 mt-1.5">
              Platform Manajemen Pertandingan Tenis Meja
            </p>
          </div>

          {error && (
            <div className="relative mb-4 p-3 bg-red-500/10 border border-red-400/30 rounded-xl text-red-300 text-xs font-semibold text-center">
              {error}
            </div>
          )}
          {notice && (
            <div className="relative mb-4 p-3 bg-emerald-500/10 border border-emerald-400/30 rounded-xl text-emerald-300 text-xs font-semibold text-center">
              {notice}
            </div>
          )}

          {mode === 'LOGIN' ? (
            <>
              <form onSubmit={handleSubmit} className="relative space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-blue-50 mb-1.5">Username / ID</label>
                  <div className="relative">
                    <User className="w-[17px] h-[17px] text-blue-200/45 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Super Admin / EO / ID Wasit"
                      className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[14px] pl-11 pr-4 py-2.5 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-blue-50 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-[17px] h-[17px] text-blue-200/45 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[14px] pl-11 pr-12 py-2.5 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-blue-100/45 hover:text-emerald-400 hover:bg-white/5 transition cursor-pointer">
                      {showPassword ? <EyeOff className="w-[17px] h-[17px]" /> : <Eye className="w-[17px] h-[17px]" />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="group w-full bg-gradient-to-r from-emerald-500 via-green-400 to-lime-300 hover:from-emerald-400 hover:to-lime-200 text-[#04110b] font-extrabold text-sm py-2.5 rounded-[14px] transition-all shadow-[0_8px_25px_rgba(16,185,129,0.18)] flex items-center justify-center gap-2 cursor-pointer">
                  Masuk Sekarang
                  <ArrowRight className="w-[18px] h-[18px] transition-transform group-hover:translate-x-1" />
                </button>
              </form>

              <div className="relative mt-4 grid grid-cols-2 gap-2.5">
                <button onClick={() => openRegister('EO')} className="rounded-[13px] border border-blue-300/20 bg-blue-500/10 hover:bg-blue-500/20 text-blue-50 py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer">
                  <UserPlus className="w-4 h-4 text-cyan-300" /> Daftar EO
                </button>
                <button onClick={handlePublic} className="rounded-[13px] border border-emerald-300/25 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-100 py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer">
                  <Users className="w-4 h-4 text-emerald-300" /> Masuk Public
                </button>
              </div>

              <button onClick={() => openRegister('PUBLIC')} className="relative mt-2.5 w-full text-[11px] text-blue-100/55 hover:text-emerald-300 transition cursor-pointer">
                Belum punya akun? <span className="font-bold">Daftar Akun SpinMatch</span>
                <span className="text-blue-100/35"> — untuk fitur Public/latihan ke depan</span>
              </button>

              <div className="relative mt-4 pt-3 border-t border-blue-200/10">
                <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Akses SpinMatch
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-white/[0.035] border border-white/[0.05] py-1.5">
                    <Trophy className="w-3.5 h-3.5 mx-auto text-amber-300 mb-1" />
                    <p className="text-[9px] text-blue-100/60">EO</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.035] border border-white/[0.05] py-1.5">
                    <Radio className="w-3.5 h-3.5 mx-auto text-emerald-300 mb-1" />
                    <p className="text-[9px] text-blue-100/60">Wasit</p>
                  </div>
                  <div className="rounded-xl bg-white/[0.035] border border-white/[0.05] py-1.5">
                    <CalendarDays className="w-3.5 h-3.5 mx-auto text-cyan-300 mb-1" />
                    <p className="text-[9px] text-blue-100/60">Public</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleRegister} className="relative space-y-3">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-sm font-black text-white">
                    {regRole === 'EO' ? 'Pendaftaran Event Organizer' : 'Pendaftaran Akun Public'}
                  </p>
                  <p className="text-[10px] text-blue-100/50 mt-0.5">
                    {regRole === 'EO'
                      ? 'Buat akun EO untuk mengelola event.'
                      : 'Disiapkan untuk identitas Public dan fitur latihan ke depan.'}
                  </p>
                </div>
                <button type="button" onClick={() => { resetMessage(); setMode('LOGIN'); }} className="w-8 h-8 rounded-lg bg-white/5 text-blue-100/60 hover:text-white flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input value={regName} onChange={e => setRegName(e.target.value)} placeholder="Nama lengkap" className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] px-4 py-2.5 outline-none focus:border-emerald-400" required />
              <input value={regUsername} onChange={e => setRegUsername(e.target.value)} placeholder="Username" className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] px-4 py-2.5 outline-none focus:border-emerald-400" required />
              <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Password minimal 6 karakter" className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] px-4 py-2.5 outline-none focus:border-emerald-400" required />
              <input value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="No. HP (opsional)" className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] px-4 py-2.5 outline-none focus:border-emerald-400" />
              <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="Email (opsional)" className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] px-4 py-2.5 outline-none focus:border-emerald-400" />

              <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-lime-300 text-[#04110b] font-extrabold text-sm py-3 rounded-[13px] cursor-pointer">
                {regRole === 'EO' ? 'Daftar sebagai EO' : 'Daftar Akun Public'}
              </button>

              <button type="button" onClick={() => { resetMessage(); setMode('LOGIN'); }} className="w-full text-xs font-semibold text-blue-100/60 hover:text-white py-1.5 cursor-pointer">
                Kembali ke Login
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-3">
          <p className="text-[10px] font-black tracking-[0.35em] text-white/45">
            SPIN<span className="text-emerald-400/70">MATCH</span>
          </p>
          <p className="text-[8px] tracking-[0.3em] text-blue-100/25 mt-1">TABLE TENNIS PLATFORM</p>
        </div>
      </div>
    </div>
  );
};
