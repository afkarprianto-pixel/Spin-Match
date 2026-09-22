import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import logoSpinMatch from '../assets/logo-spinmatch.png';

import {
  LayoutDashboard,
  Layers,
  Calendar,
  Radio,
  Trophy,
  Settings,
  LogOut,
  KeyRound,
  ChevronUp,
  Users,
  Dices
} from 'lucide-react';

export const Sidebar = ({ activeView, setActiveView }) => {
  const { user, logout } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuRef = useRef(null);

  const initial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : 'U';


  /* =========================================================
     TUTUP PROFILE MENU JIKA KLIK DI LUAR
  ========================================================= */

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }

    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );

  }, []);


  /* =========================================================
     GANTI PASSWORD
  ========================================================= */

  const handleGantiPassword = () => {

    setShowProfileMenu(false);

    alert(
      'Fitur Ganti Password akan membuka modal ubah password.'
    );

  };


  /* =========================================================
     STYLE MENU
  ========================================================= */

  const getNavClass = (viewName) => {

    const isActive = activeView === viewName;

    return `
      group
      relative
      w-full
      flex
      items-center
      gap-3
      px-3.5
      py-2.5
      rounded-xl
      text-sm
      transition-all
      duration-200
      cursor-pointer
      overflow-hidden

      ${
        isActive

          ? `
            bg-gradient-to-r
            from-[#0788ff]
            via-[#0876e8]
            to-[#0962d0]
            text-white
            font-black
            shadow-[0_8px_25px_rgba(0,123,255,0.30)]
            border
            border-cyan-300/25
          `

          : `
            text-blue-100/75
            font-semibold
            border
            border-transparent
            hover:text-white
            hover:bg-white/[0.07]
            hover:border-cyan-300/10
            hover:translate-x-[2px]
          `
      }
    `;

  };


  /* =========================================================
     ICON STYLE
  ========================================================= */

  const getIconClass = (viewName) => {

    const isActive = activeView === viewName;

    return `
      w-[18px]
      h-[18px]
      shrink-0
      transition-all
      duration-200

      ${
        isActive
          ? 'text-white stroke-[2.6]'
          : 'text-blue-200/75 group-hover:text-cyan-300'
      }
    `;

  };


  return (

    <aside
      className="
        relative
        w-64
        min-h-screen
        flex
        flex-col
        justify-between
        overflow-hidden
        border-r
        border-cyan-300/10
        text-slate-200
        select-none

        bg-gradient-to-b
        from-[#031936]
        via-[#052b5c]
        to-[#041b3e]

        shadow-[12px_0_40px_rgba(0,29,75,0.18)]
      "
    >

      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -top-24
          -left-24
          w-64
          h-64
          rounded-full
          bg-blue-500/20
          blur-[80px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          top-[30%]
          -right-24
          w-56
          h-56
          rounded-full
          bg-cyan-400/10
          blur-[80px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          left-10
          w-52
          h-52
          rounded-full
          bg-blue-600/15
          blur-[70px]
        "
      />


      {/* =====================================================
          BAGIAN ATAS
      ====================================================== */}

      <div className="relative z-10 p-4">

        {/* ================= LOGO ================= */}

        <div
          className="
            flex
            items-center
            gap-3
            px-1
            pt-2
            pb-5
            mb-3
          "
        >

          <div
            className="
              relative
              w-[58px]
              h-[58px]
              shrink-0
              flex
              items-center
              justify-center
              rounded-2xl

              bg-gradient-to-br
              from-white
              via-blue-50
              to-cyan-100

              border
              border-white/40

              shadow-[0_10px_30px_rgba(0,145,255,0.28)]
            "
          >

            {/* glow logo */}

            <div
              className="
                absolute
                inset-0
                rounded-2xl
                bg-cyan-300/10
                blur-lg
              "
            />

            <img
              src={logoSpinMatch}
              alt="SpinMatch Logo"
              className="
                relative
                z-10
                w-[50px]
                h-[50px]
                object-contain
                rounded-xl
              "
            />

          </div>


          <div className="min-w-0">

            <h1
              className="
                text-[21px]
                font-black
                tracking-[-0.03em]
                leading-none
                text-white
                drop-shadow-sm
              "
            >
              Spin<span className="text-[#7dff69]">Match</span>
            </h1>

            <div
              className="
                mt-1.5
                flex
                items-center
                gap-1.5
              "
            >

              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-[#70ff75]
                  shadow-[0_0_8px_rgba(112,255,117,0.9)]
                "
              />

              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.12em]
                  font-bold
                  text-blue-200/70
                "
              >
                Table Tennis Platform
              </span>

            </div>

          </div>

        </div>


        {/* ================= GARIS PEMBATAS ================= */}

        <div
          className="
            mb-4
            h-px
            bg-gradient-to-r
            from-transparent
            via-cyan-300/20
            to-transparent
          "
        />


        {/* =================================================
            NAVIGATION
        ================================================== */}

        <nav className="space-y-1.5">


          {/* DASHBOARD */}

          <button
            type="button"
            onClick={() =>
              setActiveView?.('DASHBOARD')
            }
            className={getNavClass('DASHBOARD')}
          >

            <LayoutDashboard
              className={getIconClass('DASHBOARD')}
            />

            <span className="relative z-10">
              Dashboard
            </span>

            {activeView === 'DASHBOARD' && (

              <span
                className="
                  absolute
                  right-3
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-cyan-200
                  shadow-[0_0_10px_rgba(103,232,249,1)]
                "
              />

            )}

          </button>


          {/* EVENT & DIVISI */}

          <button
            type="button"
            onClick={() =>
              setActiveView?.('EVENTS')
            }
            className={getNavClass('EVENTS')}
          >

            <Layers
              className={getIconClass('EVENTS')}
            />

            <span>
              Event & Divisi
            </span>

          </button>


          {/* DATA PESERTA */}

          <button
            type="button"
            onClick={() =>
              setActiveView?.('REGISTRATION')
            }
            className={getNavClass('REGISTRATION')}
          >

            <Users
              className={getIconClass('REGISTRATION')}
            />

            <span>
              Data Peserta
            </span>

          </button>


          {/* UNDIAN */}

          <button
            type="button"
            onClick={() =>
              setActiveView?.('DRAW')
            }
            className={getNavClass('DRAW')}
          >

            <Dices
              className={getIconClass('DRAW')}
            />

            <span>
              Undian Peserta
            </span>

          </button>


          {/* JADWAL */}

          <button
            type="button"
            onClick={() =>
              setActiveView?.('SCHEDULE')
            }
            className={getNavClass('SCHEDULE')}
          >

            <Calendar
              className={getIconClass('SCHEDULE')}
            />

            <span>
              Jadwal Pertandingan
            </span>

          </button>


          {/* LIVE SCORE */}

          <button
            type="button"
            onClick={() =>
              setActiveView?.('LIVE_SCORE')
            }
            className={getNavClass('LIVE_SCORE')}
          >

            <div className="relative">

              <Radio
                className={
                  activeView === 'LIVE_SCORE'
                    ? 'w-[18px] h-[18px] text-white stroke-[2.6]'
                    : 'w-[18px] h-[18px] text-red-400'
                }
              />

              <span
                className="
                  absolute
                  -top-0.5
                  -right-0.5
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-red-400
                  animate-pulse
                  shadow-[0_0_8px_rgba(248,113,113,0.9)]
                "
              />

            </div>

            <span>
              Live Score
            </span>

          </button>


          {/* KNOCKOUT */}

          <button
            type="button"
            onClick={() =>
              setActiveView?.('KNOCKOUT')
            }
            className={getNavClass('KNOCKOUT')}
          >

            <Trophy
              className={getIconClass('KNOCKOUT')}
            />

            <span>
              Bracket Knockout
            </span>

          </button>

        </nav>

      </div>


      {/* =====================================================
          BAGIAN BAWAH
      ====================================================== */}

      <div
        className="
          relative
          z-10
          p-4
        "
        ref={menuRef}
      >

        {/* divider */}

        <div
          className="
            mb-3
            h-px
            bg-gradient-to-r
            from-transparent
            via-cyan-300/20
            to-transparent
          "
        />


        {/* SETTINGS */}

        <button
          type="button"
          onClick={() =>
            setActiveView?.('SETTINGS')
          }
          className={`
            w-full
            flex
            items-center
            gap-3
            px-3.5
            py-2.5
            mb-3
            rounded-xl
            text-sm
            transition-all
            duration-200

            ${
              activeView === 'SETTINGS'

                ? `
                  bg-gradient-to-r
                  from-[#0788ff]
                  to-[#0962d0]
                  text-white
                  font-black
                  shadow-[0_8px_22px_rgba(0,123,255,0.25)]
                `

                : `
                  text-blue-100/70
                  font-semibold
                  hover:text-white
                  hover:bg-white/[0.07]
                `
            }
          `}
        >

          <Settings
            className="
              w-[18px]
              h-[18px]
              text-blue-200
            "
          />

          <span>
            Pengaturan
          </span>

        </button>


        {/* =================================================
            POPUP PROFILE
        ================================================== */}

        {showProfileMenu && (

          <div
            className="
              absolute
              bottom-[88px]
              left-4
              right-4
              z-50
              overflow-hidden
              rounded-2xl

              bg-gradient-to-b
              from-[#082d5c]
              to-[#041b3e]

              border
              border-cyan-300/20

              p-2

              shadow-[0_20px_50px_rgba(0,0,0,0.45)]
              backdrop-blur-xl
            "
          >

            <button
              type="button"
              onClick={handleGantiPassword}
              className="
                w-full
                flex
                items-center
                gap-2.5
                px-3
                py-2.5
                rounded-xl
                text-xs
                font-semibold
                text-blue-100
                hover:text-white
                hover:bg-white/10
                transition
              "
            >

              <KeyRound
                className="
                  w-4
                  h-4
                  text-amber-300
                "
              />

              <span>
                Ganti Password
              </span>

            </button>


            <button
              type="button"
              onClick={logout}
              className="
                w-full
                flex
                items-center
                gap-2.5
                px-3
                py-2.5
                rounded-xl
                text-xs
                font-semibold
                text-red-300
                hover:text-red-200
                hover:bg-red-500/10
                transition
              "
            >

              <LogOut
                className="
                  w-4
                  h-4
                "
              />

              <span>
                Keluar (Logout)
              </span>

            </button>

          </div>

        )}


        {/* =================================================
            PROFILE CARD
        ================================================== */}

        <div
          onClick={() =>
            setShowProfileMenu(!showProfileMenu)
          }
          className="
            relative
            overflow-hidden
            flex
            items-center
            justify-between
            p-3
            rounded-2xl
            cursor-pointer

            bg-gradient-to-r
            from-white/[0.07]
            to-cyan-300/[0.05]

            border
            border-cyan-200/10

            hover:border-cyan-200/25
            hover:bg-white/[0.10]

            transition-all
            duration-200

            shadow-[0_10px_30px_rgba(0,0,0,0.12)]
          "
        >

          {/* profile subtle glow */}

          <div
            className="
              pointer-events-none
              absolute
              -right-8
              -bottom-8
              w-20
              h-20
              rounded-full
              bg-blue-400/10
              blur-2xl
            "
          />


          <div
            className="
              relative
              z-10
              flex
              items-center
              gap-3
              overflow-hidden
            "
          >

            {/* AVATAR */}

            <div
              className="
                w-10
                h-10
                rounded-full
                shrink-0
                flex
                items-center
                justify-center

                bg-gradient-to-br
                from-[#ffb547]
                to-[#ff7a00]

                text-[#092044]
                font-black
                text-base

                border
                border-orange-200/50

                shadow-[0_6px_18px_rgba(255,122,0,0.30)]
              "
            >
              {initial}
            </div>


            {/* USER */}

            <div className="overflow-hidden">

              <h4
                className="
                  text-sm
                  font-black
                  text-white
                  truncate
                "
              >
                {user?.name || 'User'}
              </h4>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  font-semibold
                  text-blue-200/65
                  truncate
                "
              >
                {user?.roleLabel || user?.role}
              </p>

            </div>

          </div>


          <ChevronUp
            className={`
              relative
              z-10
              w-4
              h-4
              text-blue-200/50
              transition-transform
              duration-200

              ${
                showProfileMenu
                  ? 'rotate-180'
                  : ''
              }
            `}
          />

        </div>

      </div>

    </aside>

  );

};