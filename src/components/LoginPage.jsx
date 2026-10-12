import React, { useState, useEffect } from 'react';



import { useAuth } from '../context/AuthContext';



import logoSpinMatch from '../assets/logo-spinmatch-bola.png';



import {



  Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight,



  Users, UserPlus, X, Trophy, Radio, CalendarDays



} from 'lucide-react';







export const LoginPage = ({ onCancel }) => {



  const { login, register, loginAsPublic, resendVerification, requestPasswordReset, updateRecoveredPassword, recoveryMode } = useAuth();

  useEffect(() => {

    const meta = document.querySelector('meta[name="theme-color"]');

    const previous = meta?.getAttribute('content');

    const theme = meta || document.createElement('meta');

    if (!meta) { theme.setAttribute('name', 'theme-color'); document.head.appendChild(theme); }

    theme.setAttribute('content', '#12b894');

    return () => { if (meta) theme.setAttribute('content', previous || ''); else theme.remove(); };

  }, []);









  const [mode, setMode] = useState('LOGIN');
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);



  const [username, setUsername] = useState('');



  const [password, setPassword] = useState('');



  const [submitting, setSubmitting] = useState(false);



  const [showPassword, setShowPassword] = useState(false);



  const [showRegPassword, setShowRegPassword] = useState(false);



  const [error, setError] = useState('');



  const [notice, setNotice] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');







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



      setUsername(regUsername.trim());



      setPassword('');



      setNotice(result.message);
        setVerificationEmail(regEmail.trim().toLowerCase());
        setResendMessage('');



      setRegPassword('');



    } catch (err) {



      setError(err?.message || 'Pendaftaran gagal.');



    } finally {



      setSubmitting(false);



    }



  };







  const handleResend = async () => {
    if (!verificationEmail || resending) return;
    setResending(true);
    setResendMessage('');
    try {
      const result = await resendVerification(verificationEmail);
      setResendMessage(result.message);
    } catch (err) {
      setResendMessage(err?.message || 'Gagal mengirim ulang email.');
    } finally {
      setResending(false);
    }
  };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    resetMessage();
    setSubmitting(true);
    try {
      const result = await requestPasswordReset(resetEmail);
      if (result.success) setNotice(result.message);
      else setError(result.message);
    } catch (err) {
      setError(err?.message || 'Permintaan reset gagal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    resetMessage();
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak sama.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await updateRecoveredPassword(newPassword);
      if (result.success) {
        setNewPassword('');
        setConfirmPassword('');
        setMode('LOGIN');
        setNotice(result.message);
      } else setError(result.message);
    } catch (err) {
      setError(err?.message || 'Gagal mengubah password.');
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

    <div className={`sm-login ${mode === 'LOGIN' && !recoveryMode ? 'sm-login-home' : 'sm-login-extra'} relative min-h-[100dvh] overflow-hidden flex items-center justify-center px-4 py-16 sm:px-6 sm:py-20`}>

      <style>{`

        .sm-login{isolation:isolate;background:radial-gradient(ellipse at 72% 10%,#1259b1 0%,transparent 37%),linear-gradient(160deg,#031336,#063b85 52%,#031735);}

        .sm-login .sm-space{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:-1}

        .sm-login .sm-space:before{content:'';position:absolute;width:155%;height:31%;left:-26%;top:1%;border-top:2px solid #ff9c56;border-radius:50%;transform:rotate(-15deg);box-shadow:0 -9px 25px #f58b4d66;}

        .sm-login .sm-planet{position:absolute;right:5%;top:5%;width:clamp(92px,23vw,160px);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 28% 23%,#ffd6ae 0%,#b1b6e6 24%,#4777c9 49%,#172d69 76%,#091b44 100%);box-shadow:-9px -6px 18px #ffb77766,0 0 40px #3b8dff99;}

        .sm-login .sm-planet:after{content:'';position:absolute;inset:43% -25%;border:9px solid #62b1ff77;border-left-color:transparent;border-top-color:transparent;border-radius:50%;transform:rotate(-18deg);}

        .sm-login .sm-arc{position:absolute;left:-48%;bottom:-17%;width:112%;height:23%;border-radius:50%;transform:rotate(12deg);background:linear-gradient(180deg,transparent 0%,rgba(27,93,187,.16) 52%,rgba(255,149,76,.18) 78%,transparent 100%);box-shadow:none;}

        .sm-login .sm-arc:after{content:'';position:absolute;inset:-3px;border-top:2px solid rgba(255,168,92,.88);border-radius:50%;filter:drop-shadow(0 0 5px rgba(255,156,67,.55));}

        .sm-login .sm-panel{border:2px solid transparent;background:linear-gradient(160deg,#103f80f5,#062b60f7 56%,#0a2346f5) padding-box,linear-gradient(130deg,#ffbf70,#329dff 48%,#249bff 73%,#ffa65c) border-box;box-shadow:0 0 32px #1b8fff3d,0 25px 65px #0008,inset 0 0 28px #208bff16;}

        .sm-login .sm-primary{background:linear-gradient(100deg,#ff8f60 0%,#ffb45c 54%,#ffe16c 100%);box-shadow:0 8px 26px #ff974c50;}

        .sm-login .sm-primary:hover{filter:brightness(1.07)}

        @media(max-width:480px){.sm-login{padding-top:94px;padding-bottom:80px}.sm-login .sm-planet{top:4%;right:3%}.sm-login .sm-arc{bottom:-6%;}}


        /* Tema Login SpinMatch: biru muda / putih / aksen oranye, tanpa mengubah fungsi autentikasi. */
        .sm-login{background:radial-gradient(ellipse at 25% 17%,#a9d9ff 0%,transparent 43%),linear-gradient(165deg,#e5f5ff 0%,#f8fcff 50%,#d6edff 100%) !important;color:#123866;padding-top:38px !important;padding-bottom:60px !important;align-items:flex-start;overflow-x:hidden}
        .sm-login .sm-space:before{display:none}
        .sm-login .sm-wave{position:absolute;left:-25%;width:150%;height:230px;border-radius:50%;transform:rotate(-11deg);border-top:24px solid #268df3;box-shadow:0 -12px 0 #9dd9ff,0 -21px 0 #f5fcff}
        .sm-login .sm-wave-top{top:-140px}
        .sm-login .sm-wave-bottom{bottom:-160px;transform:rotate(10deg);border-top:35px solid #0872d5;box-shadow:0 -13px 0 #5cb7ff,0 -23px 0 #fff,0 -31px 0 #ff7c35}
        .sm-login .sm-net{position:absolute;right:-8%;top:210px;width:45%;height:70px;transform:skewY(-10deg);opacity:.22;background:repeating-linear-gradient(90deg,#1476c6 0 2px,transparent 2px 11px),repeating-linear-gradient(0deg,#1476c6 0 2px,transparent 2px 11px)}
        .sm-login .sm-player{position:absolute;top:175px;width:90px;height:130px;opacity:.12;filter:blur(1px);background:#167fda;clip-path:polygon(42% 0,60% 0,68% 12%,58% 21%,83% 33%,100% 49%,92% 57%,67% 44%,56% 71%,79% 100%,60% 100%,40% 75%,20% 100%,0 100%,31% 57%,20% 33%,35% 20%)}
        .sm-login .sm-player-left{left:0}.sm-login .sm-player-right{right:2%;transform:scaleX(-1)}
        .sm-login .sm-panel{background:rgba(255,255,255,.94) !important;border:1px solid rgba(255,255,255,.9) !important;box-shadow:0 15px 45px rgba(38,111,185,.14) !important;backdrop-filter:blur(12px)}
        .sm-login .sm-panel label,.sm-login .sm-panel h2{color:#123866 !important}
        .sm-login .sm-panel input{background:#edf6fd !important;border:1px solid #d7e9f8 !important;color:#123866 !important;box-shadow:none !important}
        .sm-login .sm-panel input::placeholder{color:#8297b0 !important;opacity:1}
        .sm-login .sm-panel input:focus{border-color:#218bf3 !important;outline:2px solid #a6d7ff !important;outline-offset:0}
        .sm-login .sm-panel .text-blue-50,.sm-login .sm-panel .text-blue-100,.sm-login .sm-panel .text-blue-100\/60,.sm-login .sm-panel .text-blue-100\/55,.sm-login .sm-panel .text-blue-100\/35,.sm-login .sm-panel .text-blue-100\/65{color:#607a9b !important}
        .sm-login .sm-panel .text-orange-200,.sm-login .sm-panel .text-orange-300{color:#ec6d15 !important}
        .sm-login .sm-panel .text-cyan-300,.sm-login .sm-panel .text-blue-200\/45{color:#1887ee !important}
        .sm-login .sm-panel button[type=submit]{background:linear-gradient(100deg,#ff612d,#ffbd4b) !important;color:white !important;border-radius:20px !important;padding-top:13px !important;padding-bottom:13px !important;box-shadow:0 8px 18px #ff8b4b44}
        .sm-login .sm-panel button:not([type=submit]){transition:filter .2s}
        .sm-login .sm-panel button:not([type=submit]):hover{filter:brightness(.96)}
        .sm-login .sm-panel .bg-blue-500\/10{background:#e1f0ff !important;border-color:#c4e2ff !important;color:#123866 !important}
        .sm-login .sm-panel .bg-orange-500\/10{background:#fff3e9 !important;border-color:#ffdfc8 !important;color:#123866 !important}
        .sm-login .sm-panel .bg-white\/\[0\.035\]{background:#f6fbff !important;border-color:#deecf9 !important}
        .sm-login .sm-panel .border-blue-200\/10{border-color:#dcebf8 !important}
        .sm-login .sm-panel .text-\[9px\],.sm-login .sm-panel .text-\[10px\]{color:#7189a5}
        .sm-login .sm-panel .text-orange-400{color:#f47716 !important}
        .sm-login .sm-panel .bg-\[\#092d59\]{background:#f2f8ff !important}
        @media(min-width:640px){.sm-login{padding-top:55px !important}.sm-login .sm-player{top:205px}}
        @media(max-width:480px){.sm-login .sm-net{top:210px}.sm-login .sm-player{top:180px}.sm-login .sm-panel{padding:24px 20px !important}.sm-login .sm-wave-bottom{bottom:-160px}}

        /* SpinMatch sporty v3: biru tegas, kontras tinggi, tepi kartu tipis. */
        .sm-login{background:radial-gradient(ellipse at 48% 22%,#e9f8ff 0%,#b5e1ff 31%,transparent 61%),linear-gradient(150deg,#147fe9 0%,#60baff 35%,#d8f2ff 59%,#0875d9 100%) !important;color:#092d65;}
        .sm-login .sm-space{z-index:0;}
        .sm-login .sm-space:before{display:block;left:-27%;top:-10%;width:155%;height:32%;border-top:23px solid #0877e8;box-shadow:0 -13px 0 #e8faff,0 -27px 0 #ff833a,0 -37px 0 #1466c7;transform:rotate(-22deg);opacity:.96}
        .sm-login .sm-wave-top{top:-146px;border-top:33px solid #1688ef;box-shadow:0 -14px 0 #a5dfff,0 -26px 0 #fff,0 -36px 0 #ff8d3d}
        .sm-login .sm-wave-bottom{bottom:-125px;height:260px;border-top:50px solid #0c69c8;box-shadow:0 -12px 0 #83cbff,0 -23px 0 #fff,0 -36px 0 #ff8737,0 -50px 0 #1763c1;}
        .sm-login .sm-space:after{content:'';position:absolute;bottom:-7%;left:-20%;width:140%;height:22%;background:linear-gradient(140deg,#032c77,#0963c5 55%,#03306f);border-radius:50% 50% 0 0;transform:rotate(7deg)}
        .sm-login .sm-net{top:19%;right:-5%;width:38%;height:15%;opacity:.65;transform:perspective(200px) rotateY(-24deg) skewY(-8deg);background:repeating-linear-gradient(90deg,#0a4c9a 0 2px,transparent 2px 12px),repeating-linear-gradient(0deg,#0a4c9a 0 2px,transparent 2px 12px)}
        .sm-login .sm-player{top:15%;height:175px;width:130px;opacity:.38;filter:none;background:#0864bd}
        .sm-login .sm-player-left{left:-13px}.sm-login .sm-player-right{right:-7px}
        .sm-login .sm-panel{background:linear-gradient(145deg,#fff 0%,#f8fcff 100%) !important;border:1px solid #d9edff !important;box-shadow:0 14px 32px #0a5aa433 !important;}
        .sm-login .sm-panel label,.sm-login .sm-panel h2{color:#082b63 !important;font-weight:750}
        .sm-login .sm-panel input{background:#e8f2fd !important;border:1px solid #c7def6 !important;color:#0b3068 !important}
        .sm-login .sm-panel input::placeholder{color:#6c86a9 !important}
        .sm-login .sm-panel .text-blue-100\/55,.sm-login .sm-panel .text-blue-100\/35,.sm-login .sm-panel .text-blue-100\/60{color:#385f93 !important}
        .sm-login .sm-panel .bg-blue-500\/10{background:#dcecff !important;color:#0a306d !important}
        .sm-login .sm-panel .bg-orange-500\/10{background:#fff0e6 !important;color:#0a306d !important}
        .sm-login .sm-panel .bg-white\/\[0\.035\]{background:#eaf4ff !important;border:1px solid #c8def6 !important}
        .sm-login .sm-panel .text-\[9px\]{color:#224979 !important}
        .sm-login .sm-login-footer{padding:14px 0 9px;margin-top:8px;position:relative;z-index:2}
        .sm-login .sm-login-footer p:first-child{font-size:14px;color:#fff !important;letter-spacing:.32em;text-shadow:0 2px 8px #05245b}
        .sm-login .sm-login-footer p:last-child{color:#fff !important;font-size:10px;text-shadow:0 2px 8px #05245b;letter-spacing:.23em}
        .sm-login .sm-login-content{z-index:2;width:min(100%,490px)}
        .sm-login-home{height:100dvh;min-height:100dvh;max-height:100dvh;overflow:hidden !important;display:flex;align-items:center;justify-content:center;padding:8px 10px !important}
        .sm-login-home .sm-login-content{max-height:100%;display:flex;flex-direction:column;justify-content:center}
        .sm-login-home .sm-login-brand{margin-bottom:10px}
        .sm-login-home .sm-login-brand>div:first-child{width:clamp(66px,11.5vh,104px);height:clamp(66px,11.5vh,104px);margin-bottom:8px}
        .sm-login-home .sm-login-brand h1{font-size:clamp(22px,3.4vh,29px);white-space:nowrap;text-shadow:0 1px 2px #fff}
        .sm-login-home .sm-login-brand p{font-size:clamp(10px,1.6vh,12px);color:#234c80}
        .sm-login-home .sm-panel{padding:clamp(14px,2.4vh,24px) clamp(14px,4vw,24px) !important;border-radius:25px}
        .sm-login-home .sm-panel form{gap:0}
        .sm-login-home .sm-panel form>div{margin-bottom:clamp(8px,1.35vh,14px)}
        .sm-login-home .sm-panel input{padding-top:clamp(9px,1.4vh,13px);padding-bottom:clamp(9px,1.4vh,13px)}
        .sm-login-home .sm-panel button[type=submit]{padding-top:clamp(10px,1.5vh,15px) !important;padding-bottom:clamp(10px,1.5vh,15px) !important}
        .sm-login-home .sm-login-footer{margin-top:clamp(4px,1.3vh,12px);padding:3px 0}
        @media(max-height:760px){.sm-login-home .sm-login-brand>div:first-child{width:60px;height:60px}.sm-login-home .sm-login-brand{margin-bottom:5px}.sm-login-home .sm-panel{padding:12px 16px !important}.sm-login-home .sm-panel .relative.mt-4{margin-top:9px}.sm-login-home .sm-panel .relative.mt-4.pt-3{padding-top:8px}.sm-login-home .sm-panel .relative.mt-3{margin-top:7px}.sm-login-home .sm-panel .relative.mt-2\.5{margin-top:6px}.sm-login-home .sm-login-footer{margin-top:3px}.sm-login-home .sm-login-brand h1{font-size:22px}}
        @media(max-height:620px){.sm-login-home .sm-login-brand>div:first-child{width:48px;height:48px}.sm-login-home .sm-login-brand p{display:none}.sm-login-home .sm-panel{padding:8px 14px !important}.sm-login-home .sm-panel form>div{margin-bottom:5px}.sm-login-home .sm-panel input{padding-top:7px;padding-bottom:7px}.sm-login-home .sm-login-footer p:last-child{display:none}}
        @media(min-width:641px){.sm-login-home .sm-login-content{width:min(100%,510px)}.sm-login-home .sm-player{width:200px;height:250px}}

        /* FIX KONTRAS: tombol dan label di panel putih harus selalu terbaca */
        .sm-login .sm-panel button.bg-blue-500\/10,
        .sm-login .sm-panel button.bg-orange-500\/10{opacity:1 !important;filter:none !important;text-shadow:none !important;font-weight:800 !important;}
        .sm-login .sm-panel button.bg-blue-500\/10{background:#d7e9ff !important;border:1.5px solid #9dc9fa !important;color:#093b83 !important;box-shadow:0 3px 9px #135da312 !important;}
        .sm-login .sm-panel button.bg-orange-500\/10{background:#fff0e4 !important;border:1.5px solid #ffc8a3 !important;color:#833a0b !important;box-shadow:0 3px 9px #d57a2612 !important;}
        .sm-login .sm-panel button.bg-blue-500\/10 svg{color:#0878df !important;stroke-width:2.6 !important;opacity:1 !important;}
        .sm-login .sm-panel button.bg-orange-500\/10 svg{color:#e76b0a !important;stroke-width:2.6 !important;opacity:1 !important;}
        .sm-login .sm-panel button.text-blue-100\/55{color:#345a87 !important;opacity:1 !important;font-weight:500 !important;}
        .sm-login .sm-panel button.text-blue-100\/55 span{color:#103e7d !important;opacity:1 !important;}
        .sm-login .sm-panel button.text-blue-100\/55 span.text-blue-100\/35{color:#526d8b !important;}
        .sm-login .sm-panel .grid.grid-cols-3.text-center>div{background:#edf5ff !important;border:1.5px solid #bfd9f6 !important;opacity:1 !important;box-shadow:0 2px 8px #0b5db10b;}
        .sm-login .sm-panel .grid.grid-cols-3.text-center>div p{color:#173d70 !important;font-weight:800 !important;font-size:11px !important;opacity:1 !important;}
        .sm-login .sm-panel .grid.grid-cols-3.text-center>div svg{opacity:1 !important;stroke-width:2.4 !important;}
        .sm-login .sm-panel .grid.grid-cols-3.text-center>div:nth-child(1) svg{color:#e47b08 !important;}
        .sm-login .sm-panel .grid.grid-cols-3.text-center>div:nth-child(2) svg{color:#1165ca !important;}
        .sm-login .sm-panel .grid.grid-cols-3.text-center>div:nth-child(3) svg{color:#0788bb !important;}
        .sm-login .sm-panel input+svg,.sm-login .sm-panel input~svg{opacity:1 !important;}

      `}</style>

      <div className="sm-space" aria-hidden="true"><div className="sm-wave sm-wave-top"/><div className="sm-wave sm-wave-bottom"/><div className="sm-net"/><div className="sm-player sm-player-left"/><div className="sm-player sm-player-right"/></div>

      <div className="sm-login-content relative w-full max-w-[430px]">







          <div className="absolute -top-24 -left-24 w-56 h-56 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />



          <div className="absolute -bottom-28 -right-28 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />







          <div className="sm-login-brand relative flex flex-col items-center text-center mb-5">



            <div className="w-[96px] h-[96px] sm:w-[108px] sm:h-[108px] rounded-full bg-white border border-white/80 p-0 flex items-center justify-center shadow-[0_0_30px_rgba(251,146,60,0.32)] mb-2.5 overflow-hidden">



              <img src={logoSpinMatch} alt="SpinMatch Logo" className="w-full h-full object-contain rounded-full" />



            </div>







            <h1 className="text-[25px] sm:text-[28px] font-black tracking-tight leading-tight">



              <span className="text-[#154b85]">{recoveryMode ? 'Reset Password ' : mode === 'REGISTER' ? 'Daftar di ' : 'Masuk ke '}</span>



              <span className="text-[#087b51]">SpinMatch</span>



            </h1>



            <p className="text-[10px] sm:text-[11px] text-[#68829f] mt-1.5">



              Platform Manajemen Pertandingan Tenis Meja



            </p>



          </div>








        <div className="sm-panel relative backdrop-blur-xl rounded-[30px] px-6 py-7 sm:px-8 sm:py-8 overflow-hidden">
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







                      {verificationEmail && mode === 'LOGIN' && (
              <div role="dialog" aria-label="Verifikasi email EO" className="relative mb-4 rounded-2xl border border-orange-300/45 bg-[#092d59] p-4 text-center shadow-lg">
                <div className="text-3xl mb-2">✉️</div>
                <h2 className="text-base font-extrabold text-white">Periksa Email Anda</h2>
                <p className="text-xs text-blue-100 mt-2">Jika pendaftaran baru berhasil, klik tautan verifikasi yang dikirim ke:</p>
                <p className="text-sm font-bold text-orange-200 break-all mt-2">{verificationEmail}</p>
                <p className="text-xs text-blue-100/80 mt-2">Periksa Inbox, Spam atau Promosi. Setelah verifikasi, kembali ke sini dan login menggunakan username serta password.</p>
                <button type="button" onClick={handleResend} disabled={resending} className="mt-3 w-full rounded-xl border border-orange-300/60 bg-orange-400/15 py-2.5 text-sm font-bold text-orange-100 disabled:opacity-50">
                  {resending ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                </button>
                {resendMessage && <p role="status" className="mt-2 text-xs text-blue-100">{resendMessage}</p>}
                <button type="button" onClick={() => setVerificationEmail('')} className="mt-3 text-xs text-blue-100/75 underline">Tutup pemberitahuan</button>
              </div>
            )}

{recoveryMode ? (
              <form onSubmit={handleNewPassword} className="relative space-y-3">
                <h2 className="text-white text-base font-bold">Buat Password Baru</h2>
                <p className="text-blue-100 text-xs">Tautan pemulihan diterima. Masukkan password baru minimal 8 karakter.</p>
                <div className="relative">
                  <input type={showNewPassword ? 'text' : 'password'} autoComplete="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Password baru (minimal 8 karakter)" minLength={8} required className="w-full rounded-xl bg-[#07182d] border border-blue-300/20 text-white px-4 pr-12 py-3 text-sm" />
                  <button type="button" onClick={() => setShowNewPassword(v => !v)} aria-label="Tampilkan atau sembunyikan password" className="absolute right-3 top-3 text-orange-300">{showNewPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
                </div>
                <input type={showNewPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Ulangi password baru" minLength={8} required className="w-full rounded-xl bg-[#07182d] border border-blue-300/20 text-white px-4 py-3 text-sm" />
                <button type="submit" disabled={submitting} className="sm-primary w-full rounded-xl py-3 font-extrabold text-[#04110b] disabled:opacity-50">{submitting ? 'Menyimpan...' : 'Simpan Password Baru'}</button>
              </form>
            ) : mode === 'FORGOT' ? (
              <form onSubmit={handleResetRequest} className="relative space-y-3">
                <h2 className="text-white text-base font-bold">Lupa Password?</h2>
                <p className="text-blue-100 text-xs">Masukkan email yang digunakan saat mendaftar SpinMatch. Kami akan mengirim tautan pemulihan.</p>
                <input type="email" autoComplete="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="Alamat email akun EO" required className="w-full rounded-xl bg-[#07182d] border border-blue-300/20 text-white px-4 py-3 text-sm" />
                <button type="submit" disabled={submitting} className="sm-primary w-full rounded-xl py-3 font-extrabold text-[#04110b] disabled:opacity-50">{submitting ? 'Mengirim...' : 'Kirim Link Reset Password'}</button>
                <button type="button" onClick={() => { resetMessage(); setMode('LOGIN'); }} className="w-full text-xs text-blue-100 underline py-2">Kembali ke Login</button>
              </form>
            ) : mode === 'LOGIN' ? (



            <>



              <form onSubmit={handleSubmit} className="relative space-y-3.5">



                <div>



                  <label className="block text-xs font-semibold text-blue-50 mb-1.5">Username</label>



                  <div className="relative">



                    <User className="w-[17px] h-[17px] text-blue-200/45 absolute left-4 top-1/2 -translate-y-1/2" />



                    <input



                      type="text"



                      value={username}



                      onChange={(e) => setUsername(e.target.value)}



                      placeholder="Masukkan username"



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







              <button type="button" onClick={() => { resetMessage(); setResetEmail(username.includes('@') ? username : ''); setMode('FORGOT'); }} className="relative mt-3 block ml-auto text-xs font-semibold text-orange-200 hover:text-orange-100 underline">Lupa Password?</button>
              <div className="relative mt-4 grid grid-cols-2 gap-2.5">



                <button onClick={() => openRegister('EO')} className="rounded-[13px] border border-blue-300/20 bg-blue-500/10 hover:bg-blue-500/20 text-blue-50 py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer" style={{ color: "#073875", backgroundColor: "#d7e9ff", border: "2px solid #83baf4", opacity: 1, WebkitTextFillColor: "#073875", fontWeight: 800 }}>



                  <UserPlus className="w-4 h-4 text-cyan-300" /> Daftar EO



                </button>



                <button onClick={handlePublic} className="rounded-[13px] border border-orange-300/25 bg-orange-500/10 hover:bg-orange-500/20 text-orange-100 py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer" style={{ color: "#713108", backgroundColor: "#fff0e4", border: "2px solid #f4b88c", opacity: 1, WebkitTextFillColor: "#713108", fontWeight: 800 }}>



                  <Users className="w-4 h-4 text-orange-300" /> Masuk Public



                </button>



              </div>







              <button onClick={handlePublic} className="relative mt-2.5 w-full text-[11px] text-blue-100/55 hover:text-orange-300 transition cursor-pointer" style={{ color: "#254c79", WebkitTextFillColor: "#254c79", opacity: 1, fontWeight: 600 }}>



                Ingin melihat pertandingan? <span className="font-bold" style={{ color: "#073875", WebkitTextFillColor: "#073875" }}>Masuk sebagai Public</span>



                <span className="text-blue-100/35" style={{ color: "#3c5878", WebkitTextFillColor: "#3c5878" }}> — untuk fitur Public/latihan ke depan</span>



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







        <div className="sm-login-footer relative z-10 text-center mt-5 pb-2">



          <p className="text-[12px] font-black tracking-[0.35em] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">



            SPIN<span className="text-[#ffb06e]">MATCH</span>



          </p>



          <p className="text-[9px] tracking-[0.3em] text-blue-100/85 mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">TABLE TENNIS PLATFORM</p>



        </div>



      </div>



    </div>



  );



};
