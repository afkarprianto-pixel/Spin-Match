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

  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showRegPassword, setShowRegPassword] = useState(false);

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



  const handleSubmit = async (e) => {

    e.preventDefault();

    resetMessage();

    setSubmitting(true);

    try {

      const result = await login(username, password);

      if (!result.success) setError(result.message);

    } catch (err) {

      setError(err?.message || 'Login gagal.');

    } finally {

      setSubmitting(false);

    }

  };



  const handleRegister = async (e) => {

    e.preventDefault();

    resetMessage();

    if (regRole !== 'EO') { setError('Pendaftaran Public belum tersedia. Gunakan Masuk Public.'); return; }

    setSubmitting(true);

    try {

      const result = await register({

        name: regName, username: regUsername, password: regPassword,

        phone: regPhone, email: regEmail, role: regRole,

      });

      if (!result.success) { setError(result.message); return; }

      setMode('LOGIN');

      setUsername(regEmail.trim());

      setPassword('');

      setNotice(result.message);

      setRegPassword('');

    } catch (err) {

      setError(err?.message || 'Pendaftaran gagal.');

    } finally {

      setSubmitting(false);

    }

  };



  const handlePublic = async () => {

    resetMessage();

    await loginAsPublic();

  };



  const openRegister = (role) => {

    resetMessage();

    setRegRole(role);

    setMode('REGISTER');

  };



  return (

    \<div className="relative min-h-screen overflow-hidden bg-[#061a38] flex items-center justify-center px-4 py-12 sm:px-6 sm:py-12">

             {/* Ornamen planet dan lengkungan sporty seperti referensi */}
       <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_13%,rgba(28,104,215,0.45),transparent_35%),linear-gradient(145deg,#031333,#063b86_55%,#041533)]" />
         <div className="absolute right-[-18px] top-[7%] w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-[radial-gradient(circle_at_30%_28%,#f7c9a5_0%,#8ca8e5_26%,#2562b8_56%,#061c50_82%)] shadow-[0_0_35px_rgba(85,162,255,0.65)] opacity-90" />
         <div className="absolute -left-[35%] bottom-[-12%] w-[115%] h-[32%] rounded-[50%] rotate-[-24deg] bg-[radial-gradient(ellipse_at_40%_30%,#ffca53_0%,#f7a34b_28%,#dc622a_52%,rgba(210,73,24,0)_76%)] opacity-95" />
         <div className="absolute -left-[38%] bottom-[2%] w-[135%] h-[27%] rounded-[50%] rotate-[-24deg] border-t-[3px] border-orange-300/90 shadow-[0_-9px_28px_rgba(255,149,59,0.5)]" />
         <div className="absolute -right-[38%] top-[9%] w-[145%] h-[19%] rounded-[50%] -rotate-[19deg] border-t-2 border-orange-300/80 shadow-[0_-6px_24px_rgba(255,153,69,0.3)]" />
       </div>
{/\* Background biru SpinMatch \*/}

      \<div className="absolute inset-0 bg-[radial-gradient(circle_at_18%\_20%,rgba(37,99,235,0.40),transparent_30%),radial-gradient(circle_at_82%\_78%,rgba(249,115,22,0.18),transparent_28%),linear-gradient(135deg,#04142f_0%,#0a3b79_48%,#061b3d_100%)]" />

      \<div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full border-[55px] border-white/[0.035] rotate-12" />

      \<div className="absolute -bottom-40 -right-28 w-[480px] h-[480px] rounded-full border-[70px] border-cyan-300/[0.045]" />

      \<div className="absolute left-[8%] top-[18%] w-40 h-40 rounded-full bg-blue-300/10 blur-3xl" />

      \<div className="absolute right-[8%] bottom-[14%] w-48 h-48 rounded-full bg-orange-300/10 blur-3xl" />



      {/\* Ornamen sporty biru - menyatukan area belakang form dengan tema SpinMatch \*/}

      \<div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

      \<div className="hidden lg:block absolute left-[3%] bottom-[7%] w-[34%] h-[24%] border-t-2 border-cyan-300/20 -skew-y-6 opacity-70 pointer-events-none" />

      \<div className="hidden lg:block absolute left-[3%] bottom-[12%] w-[34%] h-[1px] bg-cyan-200/20 shadow-[0_0_18px_rgba(34,211,238,0.35)] pointer-events-none" />

      \<div className="hidden lg:block absolute right-[3%] bottom-[5%] w-44 h-44 rounded-full border-[28px] border-blue-300/[0.035] pointer-events-none" />



      \<div className="hidden lg:block absolute right-[9%] top-[22%] text-right">

        \<p className="text-white/30 text-[11px] tracking-[0.45em] font-bold">PLAY • CONNECT\</p>

        \<p className="text-orange-300/50 text-[11px] tracking-[0.35em] font-bold mt-2">TOURNAMENT • TOGETHER\</p>

      \</div>



      \<div className="relative w-full max-w-[430px]">

        \<div className="absolute -inset-[1px] rounded-[30px] bg-gradient-to-br from-orange-300/65 via-blue-500/40 to-amber-400/65 blur-[1px]" />



        \<div className="relative bg-gradient-to-b from-[#083764]/95 via-[#072b52]/96 to-[#061d39]/96 backdrop-blur-xl border border-blue-400/65 rounded-[28px] px-6 py-5 sm:px-8 sm:py-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] overflow-hidden">

          \<div className="absolute -top-24 -left-24 w-56 h-56 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

          \<div className="absolute -bottom-28 -right-28 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />



          \<div className="relative flex flex-col items-center text-center mb-4">

            \<div className="w-[68px] h-[68px] rounded-[22px] bg-white border-2 border-orange-400 p-1.5 flex items-center justify-center shadow-[0_0_30px_rgba(251,146,60,0.32)] mb-2.5 overflow-hidden">

              \<img src={logoSpinMatch} alt="SpinMatch Logo" className="w-full h-full object-contain rounded-[16px]" />

            \</div>



            \<h1 className="text-[23px] sm:text-[26px] font-black tracking-tight leading-tight">

              \<span className="text-white">{mode === 'REGISTER' ? 'Daftar di ' : 'Masuk ke '}\</span>

              \<span className="text-[#f7a45a]">SpinMatch\</span>

            \</h1>

            \<p className="text-[10px] sm:text-[11px] text-blue-100/65 mt-1.5">

              Platform Manajemen Pertandingan Tenis Meja

            \</p>

          \</div>



          {error && (

            \<div className="relative mb-4 p-3 bg-red-500/10 border border-red-400/30 rounded-xl text-red-300 text-xs font-semibold text-center">

              {error}

            \</div>

          )}

          {notice && (

            \<div className="relative mb-4 p-3 bg-emerald-500/10 border border-orange-400/30 rounded-xl text-orange-300 text-xs font-semibold text-center">

              {notice}

            \</div>

          )}



          {mode === 'LOGIN' ? (

            <>

              \<form onSubmit={handleSubmit} className="relative space-y-3.5">

                \<div>

                  \<label className="block text-xs font-semibold text-blue-50 mb-1.5">Email\</label>

                  \<div className="relative">

                    \<User className="w-[17px] h-[17px] text-blue-200/45 absolute left-4 top-1/2 -translate-y-1/2" />

                    \<input

                      type="email"

                      value={username}

                      onChange={(e) => setUsername(e.target.value)}

                      placeholder="Masukkan alamat email"

                      className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[14px] pl-11 pr-4 py-2.5 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"

                      required

                    />

                  \</div>

                \</div>



                \<div>

                  \<label className="block text-xs font-semibold text-blue-50 mb-1.5">Password\</label>

                  \<div className="relative">

                    \<Lock className="w-[17px] h-[17px] text-blue-200/45 absolute left-4 top-1/2 -translate-y-1/2" />

                    \<input

                      type={showPassword ? 'text' : 'password'}

                      value={password}

                      onChange={(e) => setPassword(e.target.value)}

                      placeholder="Masukkan password"

                      className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[14px] pl-11 pr-12 py-2.5 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"

                      required

                    />

                    \<button type="button" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-orange-300 hover:text-orange-400 hover:bg-white/5 transition cursor-pointer">

                      {showPassword ? \<EyeOff className="w-[19px] h-[19px]" /> : \<Eye className="w-[19px] h-[19px]" />}

                    \</button>

                  \</div>

                \</div>



                \<button type="submit" disabled={submitting} className="group w-full bg-gradient-to-r from-[#f97335] via-[#f6a34b] to-[#f8c74c] hover:from-[#fb8a4b] hover:to-[#ffda70] text-[#04110b] font-extrabold text-sm py-2.5 rounded-[14px] transition-all shadow-[0_8px_28px_rgba(249,160,72,0.24)] flex items-center justify-center gap-2 cursor-pointer">

                  Masuk Sekarang

                  \<ArrowRight className="w-[18px] h-[18px] transition-transform group-hover:translate-x-1" />

                \</button>

              \</form>



              \<div className="relative mt-4 grid grid-cols-2 gap-2.5">

                \<button onClick={() => openRegister('EO')} className="rounded-[13px] border border-blue-300/20 bg-blue-500/10 hover:bg-blue-500/20 text-blue-50 py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer">

                  \<UserPlus className="w-4 h-4 text-cyan-300" /> Daftar EO

                \</button>

                \<button onClick={handlePublic} className="rounded-[13px] border border-orange-300/25 bg-orange-500/10 hover:bg-orange-500/20 text-orange-100 py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer">

                  \<Users className="w-4 h-4 text-orange-300" /> Masuk Public

                \</button>

              \</div>



              \<button onClick={handlePublic} className="relative mt-2.5 w-full text-[11px] text-blue-100/55 hover:text-orange-300 transition cursor-pointer">

                Ingin melihat pertandingan? \<span className="font-bold">Masuk sebagai Public\</span>

                \<span className="text-blue-100/35"> — untuk fitur Public/latihan ke depan\</span>

              \</button>



              \<div className="relative mt-4 pt-3 border-t border-blue-200/10">

                \<p className="text-[10px] font-bold text-orange-400 flex items-center gap-1.5 mb-2">

                  \<ShieldCheck className="w-3.5 h-3.5" /> Akses SpinMatch

                \</p>

                \<div className="grid grid-cols-3 gap-2 text-center">

                  \<div className="rounded-xl bg-white/[0.035] border border-white/[0.05] py-1.5">

                    \<Trophy className="w-3.5 h-3.5 mx-auto text-amber-300 mb-1" />

                    \<p className="text-[9px] text-blue-100/60">EO\</p>

                  \</div>

                  \<div className="rounded-xl bg-white/[0.035] border border-white/[0.05] py-1.5">

                    \<Radio className="w-3.5 h-3.5 mx-auto text-orange-300 mb-1" />

                    \<p className="text-[9px] text-blue-100/60">Wasit\</p>

                  \</div>

                  \<div className="rounded-xl bg-white/[0.035] border border-white/[0.05] py-1.5">

                    \<CalendarDays className="w-3.5 h-3.5 mx-auto text-cyan-300 mb-1" />

                    \<p className="text-[9px] text-blue-100/60">Public\</p>

                  \</div>

                \</div>

              \</div>

            \</>

          ) : (

            \<form onSubmit={handleRegister} className="relative space-y-3">

              \<div className="flex items-center justify-between mb-1">

                \<div>

                  \<p className="text-sm font-black text-white">

                    {regRole === 'EO' ? 'Pendaftaran Event Organizer' : 'Pendaftaran Akun Public'}

                  \</p>

                  \<p className="text-[10px] text-blue-100/50 mt-0.5">

                    {regRole === 'EO'

                      ? 'Buat akun EO untuk mengelola event.'

                      : 'Disiapkan untuk identitas Public dan fitur latihan ke depan.'}

                  \</p>

                \</div>

                \<button type="button" onClick={() => { resetMessage(); setMode('LOGIN'); }} className="w-8 h-8 rounded-lg bg-white/5 text-blue-100/60 hover:text-white flex items-center justify-center">

                  \<X className="w-4 h-4" />

                \</button>

              \</div>



              \<input value={regName} onChange={e => setRegName(e.target.value)} placeholder="Nama lengkap" className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] px-4 py-2.5 outline-none focus:border-orange-400" required />

              \<input value={regUsername} onChange={e => setRegUsername(e.target.value)} placeholder="Username" className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] px-4 py-2.5 outline-none focus:border-orange-400" required />

              \<div className="relative">

                \<input type={showRegPassword ? 'text' : 'password'} value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Password minimal 8 karakter" className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] pl-4 pr-12 py-2.5 outline-none focus:border-orange-400" required />

                \<button type="button" aria-label={showRegPassword ? 'Sembunyikan password pendaftaran' : 'Tampilkan password pendaftaran'} onClick={() => setShowRegPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-orange-300 hover:text-orange-200 hover:bg-white/10 transition cursor-pointer">

                  {showRegPassword ? \<EyeOff className="w-[19px] h-[19px]" /> : \<Eye className="w-[19px] h-[19px]" />}

                \</button>

              \</div>

              \<input value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="No. HP (opsional)" className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] px-4 py-2.5 outline-none focus:border-orange-400" />

              \<input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="Email aktif (wajib untuk verifikasi)" required className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] px-4 py-2.5 outline-none focus:border-orange-400" />



              \<button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-[#f97335] via-[#f6a34b] to-[#f8c74c] text-[#04110b] font-extrabold text-sm py-3 rounded-[13px] cursor-pointer">

                {regRole === 'EO' ? 'Daftar sebagai EO' : 'Daftar Akun Public'}

              \</button>



              \<button type="button" onClick={() => { resetMessage(); setMode('LOGIN'); }} className="w-full text-xs font-semibold text-blue-100/60 hover:text-white py-1.5 cursor-pointer">

                Kembali ke Login

              \</button>

            \</form>

          )}

        \</div>



        \<div className="text-center mt-3">

          \<p className="text-[10px] font-black tracking-[0.35em] text-white/45">

            SPIN\<span className="text-orange-400/70">MATCH\</span>

          \</p>

          \<p className="text-[8px] tracking-[0.3em] text-blue-100/25 mt-1">TABLE TENNIS PLATFORM\</p>

        \</div>

      \</div>

    \</div>

  );

};
