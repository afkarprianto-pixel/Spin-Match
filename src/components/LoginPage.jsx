import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import logoSpinMatch from '../assets/logo-spinmatch.PNG';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const LoginPage = ({ onCancel }) => {
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = login(username, password);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center p-4 sm:p-6">

      {/* LOGIN CARD */}
      <div
        className="
          relative
          w-full max-w-md
          bg-gradient-to-b from-[#0b1728] to-[#07111f]
          border border-[#17415c]
          rounded-[30px]
          px-6 py-7 sm:px-9 sm:py-8
          shadow-[0_25px_70px_rgba(0,0,0,0.55)]
          overflow-hidden
        "
      >

        {/* DEKORASI HIJAU ATAS */}
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* DEKORASI HIJAU BAWAH */}
        <div className="absolute -bottom-28 -right-28 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* LOGO + HEADER */}
        <div className="relative flex flex-col items-center text-center mb-7">

          {/* Logo */}
          <div
            className="
              w-[88px] h-[88px]
              sm:w-[96px] sm:h-[96px]
              rounded-[24px]
              bg-white
              border-2 border-emerald-400
              p-1.5
              flex items-center justify-center
              shadow-[0_0_30px_rgba(16,185,129,0.20)]
              mb-4
              overflow-hidden
            "
          >
            <img
              src={logoSpinMatch}
              alt="SpinMatch Logo"
              className="w-full h-full object-contain rounded-[18px]"
            />
          </div>

          <h1 className="text-[25px] sm:text-[28px] font-black tracking-tight leading-tight">
            <span className="text-white">Masuk ke </span>
            <span className="text-emerald-400">SpinMatch</span>
          </h1>

          <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
            Platform Manajemen Pertandingan Tenis Meja
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="relative mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="relative space-y-5">

          {/* USERNAME */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Username / ID
            </label>

            <div className="relative">
              <User className="w-[18px] h-[18px] text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username Anda"
                className="
                  w-full
                  bg-[#101d2e]
                  border border-[#29445d]
                  text-white
                  placeholder:text-slate-600
                  text-sm
                  rounded-[14px]
                  pl-11 pr-4 py-3.5
                  outline-none
                  transition-all
                  focus:border-emerald-400
                  focus:ring-2
                  focus:ring-emerald-400/10
                "
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Password
            </label>

            <div className="relative">
              <Lock className="w-[18px] h-[18px] text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="
                  w-full
                  bg-[#101d2e]
                  border border-[#29445d]
                  text-white
                  placeholder:text-slate-600
                  text-sm
                  rounded-[14px]
                  pl-11 pr-12 py-3.5
                  outline-none
                  transition-all
                  focus:border-emerald-400
                  focus:ring-2
                  focus:ring-emerald-400/10
                "
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2
                  w-8 h-8
                  rounded-lg
                  flex items-center justify-center
                  text-slate-500
                  hover:text-emerald-400
                  hover:bg-white/5
                  transition
                  cursor-pointer
                "
              >
                {showPassword
                  ? <EyeOff className="w-[17px] h-[17px]" />
                  : <Eye className="w-[17px] h-[17px]" />
                }
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="
              group
              w-full
              bg-gradient-to-r
              from-emerald-500
              via-green-400
              to-lime-300
              hover:from-emerald-400
              hover:to-lime-200
              text-[#04110b]
              font-extrabold
              text-sm
              py-3.5
              rounded-[14px]
              transition-all
              shadow-[0_8px_25px_rgba(16,185,129,0.18)]
              flex items-center justify-center gap-2
              cursor-pointer
            "
          >
            Masuk Sekarang

            <ArrowRight
              className="
                w-[18px] h-[18px]
                transition-transform
                group-hover:translate-x-1
              "
            />
          </button>
        </form>

        {/* AKUN PENGUJIAN */}
        <div className="relative mt-7 pt-6 border-t border-slate-700/60">

          <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-4 h-4" />
            Akun Pengujian:
          </p>

          <div className="text-[11px] text-slate-500 space-y-1.5">

            <p>
              <strong className="text-slate-300 inline-block w-[85px]">
                Super Admin
              </strong>
              <span className="text-slate-600 mr-2">:</span>
              Teguhorina / Teguh180b77#
            </p>

            <p>
              <strong className="text-slate-300 inline-block w-[85px]">
                EO
              </strong>
              <span className="text-slate-600 mr-2">:</span>
              eo_demo / eo123
            </p>

            <p>
              <strong className="text-slate-300 inline-block w-[85px]">
                Wasit
              </strong>
              <span className="text-slate-600 mr-2">:</span>
              wasit_m1 / wasit123
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};