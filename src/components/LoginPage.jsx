import React, { useState, useEffect } from 'react';

import { useAuth } from '../context/AuthContext';

import logoSpinMatch from '../assets/logo-spinmatch.png';

import {

  Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight,

  Users, UserPlus, X, Trophy, Radio, CalendarDays

} from 'lucide-react';



export const LoginPage = ({ onCancel }) => {

  const { login, register, loginAsPublic } = useAuth();
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const previous = meta?.getAttribute('content');
    const theme = meta || document.createElement('meta');
    if (!meta) { theme.setAttribute('name', 'theme-color'); document.head.appendChild(theme); }
    theme.setAttribute('content', '#f58235');
    return () => { if (meta) theme.setAttribute('content', previous || ''); else theme.remove(); };
  }, []);




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
    <div className="sm-login relative min-h-[100dvh] overflow-hidden flex items-center justify-center px-4 py-16 sm:px-6 sm:py-20">
      <style>{`
        .sm-login{isolation:isolate;background:radial-gradient(ellipse at 72% 10%,#1259b1 0%,transparent 37%),linear-gradient(160deg,#031336,#063b85 52%,#031735);}
        .sm-login .sm-space{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:-1}
        .sm-login .sm-space:before{content:'';position:absolute;width:155%;height:31%;left:-26%;top:1%;border-top:2px solid #ff9c56;border-radius:50%;transform:rotate(-15deg);box-shadow:0 -9px 25px #f58b4d66;}
        .sm-login .sm-planet{position:absolute;right:5%;top:5%;width:clamp(92px,23vw,160px);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 28% 23%,#ffd6ae 0%,#b1b6e6 24%,#4777c9 49%,#172d69 76%,#091b44 100%);box-shadow:-9px -6px 18px #ffb77766,0 0 40px #3b8dff99;}
        .sm-login .sm-planet:after{content:'';position:absolute;inset:43% -25%;border:9px solid #62b1ff77;border-left-color:transparent;border-top-color:transparent;border-radius:50%;transform:rotate(-18deg);}
        .sm-login .sm-arc{position:absolute;left:-44%;bottom:-11%;width:133%;height:34%;border-radius:50%;transform:rotate(21deg);background:radial-gradient(ellipse at 48% 12%,#ffe18d 0%,#ffb24e 24%,#ed733b 50%,transparent 73%);box-shadow:0 -4px 12px #ffae68;}
        .sm-login .sm-arc:after{content:'';position:absolute;inset:-3px;border-top:3px solid #ffd17c;border-radius:50%;filter:drop-shadow(0 0 12px #ff9c43);}
        .sm-login .sm-panel{border:2px solid transparent;background:linear-gradient(160deg,#103f80f5,#062b60f7 56%,#0a2346f5) padding-box,linear-gradient(130deg,#ffbf70,#329dff 48%,#249bff 73%,#ffa65c) border-box;box-shadow:0 0 32px #1b8fff3d,0 25px 65px #0008,inset 0 0 28px #208bff16;}
        .sm-login .sm-primary{background:linear-gradient(100deg,#ff8f60 0%,#ffb45c 54%,#ffe16c 100%);box-shadow:0 8px 26px #ff974c50;}
        .sm-login .sm-primary:hover{filter:brightness(1.07)}
        @media(max-width:480px){.sm-login{padding-top:94px;padding-bottom:80px}.sm-login .sm-planet{top:4%;right:3%}.sm-login .sm-arc{bottom:-6%;}}
      `}</style>
      <div className="sm-space" aria-hidden="true"><div className="sm-planet"/><div className="sm-arc"/></div>
      <div className="relative w-full max-w-[430px]">
        <div className="sm-panel relative backdrop-blur-xl rounded-[30px] px-6 py-7 sm:px-8 sm:py-8 overflow-hidden">


          <div className="absolute -top-24 -left-24 w-56 h-56 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="absolute -bottom-28 -right-28 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />



          <div className="relative flex flex-col items-center text-center mb-4">

            <div className="w-[68px] h-[68px] rounded-[22px] bg-white border-2 border-orange-400 p-1.5 flex items-center justify-center shadow-[0_0_30px_rgba(251,146,60,0.32)] mb-2.5 overflow-hidden">

              <img src={logoSpinMatch} alt="SpinMatch Logo" className="w-full h-full object-contain rounded-[16px]" />

            </div>



            <h1 className="text-[23px] sm:text-[26px] font-black tracking-tight leading-tight">

              <span className="text-white">{mode === 'REGISTER' ? 'Daftar di ' : 'Masuk ke '}</span>

              <span className="text-[#f7a45a]">SpinMatch</span>

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

            <div className="relative mb-4 p-3 bg-emerald-500/10 border border-orange-400/30 rounded-xl text-orange-300 text-xs font-semibold text-center">

              {notice}

            </div>

          )}



          {mode === 'LOGIN' ? (

            <>

              <form onSubmit={handleSubmit} className="relative space-y-3.5">

                <div>

                  <label className="block text-xs font-semibold text-blue-50 mb-1.5">Email</label>

                  <div className="relative">

                    <User className="w-[17px] h-[17px] text-blue-200/45 absolute left-4 top-1/2 -translate-y-1/2" />

                    <input

                      type="email"

                      value={username}

                      onChange={(e) => setUsername(e.target.value)}

                      placeholder="Masukkan alamat email"

                      className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[14px] pl-11 pr-4 py-2.5 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"

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

                      className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[14px] pl-11 pr-12 py-2.5 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"

                      required

                    />

                    <button type="button" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-orange-300 hover:text-orange-400 hover:bg-white/5 transition cursor-pointer">

                      {showPassword ? <EyeOff className="w-[19px] h-[19px]" /> : <Eye className="w-[19px] h-[19px]" />}

                    </button>

                  </div>

                </div>



                <button type="submit" disabled={submitting} className="group w-full bg-gradient-to-r from-[#f97335] via-[#f6a34b] to-[#f8c74c] hover:from-[#fb8a4b] hover:to-[#ffda70] text-[#04110b] font-extrabold text-sm py-2.5 rounded-[14px] transition-all shadow-[0_8px_28px_rgba(249,160,72,0.24)] flex items-center justify-center gap-2 cursor-pointer">

                  Masuk Sekarang

                  <ArrowRight className="w-[18px] h-[18px] transition-transform group-hover:translate-x-1" />

                </button>

              </form>



              <div className="relative mt-4 grid grid-cols-2 gap-2.5">

                <button onClick={() => openRegister('EO')} className="rounded-[13px] border border-blue-300/20 bg-blue-500/10 hover:bg-blue-500/20 text-blue-50 py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer">

                  <UserPlus className="w-4 h-4 text-cyan-300" /> Daftar EO

                </button>

                <button onClick={handlePublic} className="rounded-[13px] border border-orange-300/25 bg-orange-500/10 hover:bg-orange-500/20 text-orange-100 py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer">

                  <Users className="w-4 h-4 text-orange-300" /> Masuk Public

                </button>

              </div>



              <button onClick={handlePublic} className="relative mt-2.5 w-full text-[11px] text-blue-100/55 hover:text-orange-300 transition cursor-pointer">

                Ingin melihat pertandingan? <span className="font-bold">Masuk sebagai Public</span>

                <span className="text-blue-100/35"> — untuk fitur Public/latihan ke depan</span>

              </button>



              <div className="relative mt-4 pt-3 border-t border-blue-200/10">

                <p className="text-[10px] font-bold text-orange-400 flex items-center gap-1.5 mb-2">

                  <ShieldCheck className="w-3.5 h-3.5" /> Akses SpinMatch

                </p>

                <div className="grid grid-cols-3 gap-2 text-center">

                  <div className="rounded-xl bg-white/[0.035] border border-white/[0.05] py-1.5">

                    <Trophy className="w-3.5 h-3.5 mx-auto text-amber-300 mb-1" />

                    <p className="text-[9px] text-blue-100/60">EO</p>

                  </div>

                  <div className="rounded-xl bg-white/[0.035] border border-white/[0.05] py-1.5">

                    <Radio className="w-3.5 h-3.5 mx-auto text-orange-300 mb-1" />

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



              <input value={regName} onChange={e => setRegName(e.target.value)} placeholder="Nama lengkap" className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] px-4 py-2.5 outline-none focus:border-orange-400" required />

              <input value={regUsername} onChange={e => setRegUsername(e.target.value)} placeholder="Username" className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] px-4 py-2.5 outline-none focus:border-orange-400" required />

              <div className="relative">

                <input type={showRegPassword ? 'text' : 'password'} value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Password minimal 8 karakter" className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] pl-4 pr-12 py-2.5 outline-none focus:border-orange-400" required />

                <button type="button" aria-label={showRegPassword ? 'Sembunyikan password pendaftaran' : 'Tampilkan password pendaftaran'} onClick={() => setShowRegPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-orange-300 hover:text-orange-200 hover:bg-white/10 transition cursor-pointer">

                  {showRegPassword ? <EyeOff className="w-[19px] h-[19px]" /> : <Eye className="w-[19px] h-[19px]" />}

                </button>

              </div>

              <input value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="No. HP (opsional)" className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] px-4 py-2.5 outline-none focus:border-orange-400" />

              <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="Email aktif (wajib untuk verifikasi)" required className="w-full bg-[#07182d]/90 border border-blue-300/20 text-white placeholder:text-blue-100/30 text-sm rounded-[13px] px-4 py-2.5 outline-none focus:border-orange-400" />



              <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-[#f97335] via-[#f6a34b] to-[#f8c74c] text-[#04110b] font-extrabold text-sm py-3 rounded-[13px] cursor-pointer">

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

            SPIN<span className="text-orange-400/70">MATCH</span>

          </p>

          <p className="text-[8px] tracking-[0.3em] text-blue-100/25 mt-1">TABLE TENNIS PLATFORM</p>

        </div>

      </div>

    </div>

  );

};
