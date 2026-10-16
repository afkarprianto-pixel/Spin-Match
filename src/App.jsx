// SpinMatch Login System Update: SUPER_ADMIN / EO / WASIT / PUBLIC supported via AuthContext + LoginPage
import { supabase } from './lib/supabaseClient'
import React, { useState, useEffect, useRef } from 'react';
import logoSpinMatch from './assets/logo-spinmatch.png';
import heroPingpong from './assets/hero-pingpong-new.png';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StatCard } from './components/StatCard';
import { LoginPage } from './components/LoginPage';
import * as XLSX from 'xlsx';
import {
  Trophy, Users, Activity, DollarSign, Plus, X, Trash2, Edit3,
  ArrowLeft, Upload, FileSpreadsheet, UserPlus, Filter, Shuffle,
  Settings, ChevronDown, Pencil, Wallet, Play, Pause, RotateCcw,
  Crown, Medal, Sparkles, Target, Dices, CheckCircle2, Calendar,
  Printer, Download, Search, Info, FileText, Radio, MoreVertical, LogOut, RefreshCw, ShieldCheck, Eye, EyeOff
} from 'lucide-react';


const SpinMatchSidebar = ({ activeView, setActiveView, role = '', onMyEvents, onAllEvents, onLogout, onManageReferees, refereeSectionActive = false, onManageSupervisor, supervisorSectionActive = false }) => {
  const [showDesktopMoreMenu, setShowDesktopMoreMenu] = useState(false);
  const handleDesktopRestart = () => { setShowDesktopMoreMenu(false); window.location.reload(); };
  const handleDesktopLogout = () => {
    setShowDesktopMoreMenu(false);
    onLogout?.();
  };
  const normalizedRole = String(role || '').toUpperCase();
  const isPublicRole = normalizedRole === 'PUBLIC' || normalizedRole === 'PUBLIK';
  const isWasitRole = normalizedRole === 'WASIT';
  const isRefereeRole = normalizedRole === 'REFEREE';

  const openView = (view) => {
    if (isRefereeRole && !['DASHBOARD', 'SCHEDULE', 'REF_CALLS', 'REF_TABLES', 'REF_WASIT', 'REF_LIVE', 'RANKING'].includes(view)) return;
    const publicBlocked = ['REGISTRATION', 'DRAW', 'SETTINGS', 'REFEREE_MANAGEMENT', 'SUPERVISOR_MANAGEMENT'];
    if (isWasitRole && !['LIVE_SCORE', 'SCHEDULE', 'DASHBOARD', 'DRAW', 'KNOCKOUT', 'RANKING'].includes(view)) {
      alert('Akun Wasit hanya dapat mengelola skor meja tugasnya dan melihat informasi pertandingan.');
      return;
    }
    if (isPublicRole && publicBlocked.includes(view)) {
      alert('Akun Public hanya dapat melihat event. Untuk mencari pertandingan, silakan pilih Semua Event.');
      return;
    }
    if (view === 'REFEREE_MANAGEMENT') { onManageReferees?.(); return; }
    if (view === 'SUPERVISOR_MANAGEMENT') { onManageSupervisor?.(); return; }
    setActiveView(view);
  };

  const menu = [
    { view: 'DASHBOARD', label: 'Dashboard', icon: Activity },
    ...(isRefereeRole ? [
      { view: 'SCHEDULE', label: 'Jadwal Pertandingan', icon: Calendar },
      { view: 'REF_CALLS', label: 'Panggilan Pertandingan', icon: Radio },
      { view: 'REF_TABLES', label: 'Penempatan Meja', icon: Target },
      { view: 'REF_WASIT', label: 'Kelola Wasit', icon: Users },
      { view: 'REF_LIVE', label: 'Pantau Live Score', icon: Activity },
    ] : []),
    { view: 'REGISTRATION', label: 'Kelola Pemain', icon: Users },
    { view: 'REFEREE_MANAGEMENT', label: 'Kelola Wasit', icon: Users },
    { view: 'SUPERVISOR_MANAGEMENT', label: 'Kelola Referee', icon: ShieldCheck },
    { view: 'DRAW', label: 'Undian Pool', icon: Dices },
    ...(!isRefereeRole ? [{ view: 'SCHEDULE', label: 'Jadwal Pertandingan', icon: Calendar }] : []),
    { view: 'LIVE_SCORE', label: 'Live Score', icon: Radio },
    { view: 'RANKING', label: 'Peringkat & Poin', icon: Medal },
    { view: 'KNOCKOUT', label: 'Knockout', icon: Trophy },
  ];

  return (
    <aside className="flex h-screen w-[268px] flex-col bg-gradient-to-b from-[#052a4a] via-[#063a67] to-[#052a4a] text-white shadow-2xl">
      <div className="flex min-h-[82px] items-center gap-3 border-b border-white/10 px-4">
        <img src={logoSpinMatch} alt="SpinMatch" className="h-[48px] w-[48px] shrink-0 rounded-[12px] object-contain" />
        <div className="min-w-0">
          <div className="whitespace-nowrap text-[18px] font-black leading-none tracking-[-0.03em]"><span className="text-white">Spin</span><span className="text-[#16e49b]">Match</span></div>
          <div className="mt-2 flex items-start gap-1.5"><span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#22e89d] shadow-[0_0_8px_rgba(34,232,157,.75)]" /><div className="text-[9px] font-black uppercase leading-[1.25] tracking-[.14em] text-[#9abbd2]"><div>TABLE TENNIS</div><div>PLATFORM</div></div></div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
        {menu.filter(item => (!isRefereeRole || ['DASHBOARD', 'SCHEDULE', 'REF_CALLS', 'REF_TABLES', 'REF_WASIT', 'REF_LIVE', 'RANKING'].includes(item.view)) && (!['REFEREE_MANAGEMENT', 'SUPERVISOR_MANAGEMENT'].includes(item.view) || !isPublicRole) && (item.view !== 'SUPERVISOR_MANAGEMENT' || ['EO', 'SUPER_ADMIN', 'SUPERADMIN', 'ADMIN'].includes(normalizedRole)) && (!isWasitRole || ['LIVE_SCORE', 'SCHEDULE', 'DASHBOARD', 'DRAW', 'KNOCKOUT', 'RANKING'].includes(item.view)) && (!isPublicRole || ['DASHBOARD', 'SCHEDULE', 'LIVE_SCORE', 'RANKING', 'KNOCKOUT'].includes(item.view))).map(({ view, label, icon: Icon }) => (
          <button key={view} type="button" onClick={() => openView(view)} className={`flex w-full items-center gap-3 rounded-[11px] px-3 py-2 text-left text-[13px] font-extrabold transition ${(activeView === view || (view === 'REFEREE_MANAGEMENT' && refereeSectionActive) || (view === 'SUPERVISOR_MANAGEMENT' && supervisorSectionActive)) ? 'bg-gradient-to-r from-[#0b67b2] to-[#0a86d8] text-white shadow-lg shadow-blue-950/20' : 'text-[#d5e3ed] hover:bg-white/10 hover:text-white'}`}>
            <Icon className={`h-[18px] w-[18px] shrink-0 ${(activeView === view || (view === 'REFEREE_MANAGEMENT' && refereeSectionActive) || (view === 'SUPERVISOR_MANAGEMENT' && supervisorSectionActive)) ? 'text-cyan-200' : 'text-[#8eb2cb]'}`} /><span>{label}</span>
          </button>
        ))}

        <div className="my-1.5 border-t border-white/10" />
        {!isPublicRole && !isWasitRole && !isRefereeRole && <button type="button" onClick={onMyEvents} className="flex w-full items-center gap-3 rounded-[11px] px-3 py-1.5 text-left text-[12px] font-extrabold text-[#d5e3ed] transition hover:bg-white/10 hover:text-white"><Trophy className="h-[18px] w-[18px] text-cyan-300" /><span>Event Saya</span></button>}
        {!isWasitRole && !isRefereeRole && <button type="button" onClick={onAllEvents} className="flex w-full items-center gap-3 rounded-[11px] px-3 py-1.5 text-left text-[12px] font-extrabold text-[#d5e3ed] transition hover:bg-white/10 hover:text-white"><FileText className="h-[18px] w-[18px] text-orange-300" /><span>Semua Event</span></button>}
      </nav>

      <div className="relative border-t border-white/10 p-2.5">
        {!isPublicRole && !isWasitRole && !isRefereeRole && <button type="button" onClick={() => openView('SETTINGS')} className={`flex w-full items-center gap-3 rounded-[11px] px-3 py-2 text-left text-[13px] font-extrabold transition ${activeView === 'SETTINGS' ? 'bg-gradient-to-r from-[#0b67b2] to-[#0a86d8] text-white shadow-lg shadow-blue-950/20' : 'text-[#d5e3ed] hover:bg-white/10 hover:text-white'}`}>
          <Settings className="h-[17px] w-[17px] shrink-0" /><span>Pengaturan</span>
        </button>}

        {showDesktopMoreMenu && (
          <div className="absolute bottom-[48px] right-2 z-50 w-[150px] overflow-hidden rounded-xl border border-white/10 bg-[#07345c] p-1.5 shadow-2xl">
            <button type="button" onClick={handleDesktopRestart} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-white hover:bg-white/10"><RefreshCw className="h-4 w-4" />Restart</button>
            <button type="button" onClick={handleDesktopLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-red-200 hover:bg-red-500/10"><LogOut className="h-4 w-4" />Keluar</button>
          </div>
        )}
        <button type="button" aria-label="Menu lainnya" onClick={() => setShowDesktopMoreMenu(v => !v)} className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"><MoreVertical className="h-4 w-4" /></button>
      </div>
    </aside>
  );
};


// Akun login wasit online. Terpisah dari Master Wasit lokal agar Live Score lama tetap aman.
const RefereeOnlineAccounts = ({ eventItem, tableCount, onAccountsChanged }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nama, setNama] = useState('');
  const [meja, setMeja] = useState('1');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editingWasit, setEditingWasit] = useState(null);
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [created, setCreated] = useState(null);
  const [errorText, setErrorText] = useState('');
  const [noticeText, setNoticeText] = useState('');

  const refresh = async () => {
    if (!eventItem?.id) return;
    setLoading(true);
    const { data, error } = await supabase.from('spinmatch_wasit_event')
      .select('id, kode_wasit, nama_wasit, nomor_meja, status')
      .eq('event_id', Number(eventItem.id)).order('nomor_meja');
    if (error) setErrorText(error.message);
    else { setRows(data || []); setErrorText(''); onAccountsChanged?.(data || []); }
    setLoading(false);
  };
  useEffect(() => { setCreated(null); setMeja('1'); refresh(); }, [eventItem?.id]);

  const createAccount = async (e) => {
    e.preventDefault();
    if (saving || !eventItem?.id) return;
    setCreated(null);
    setErrorText('');
    if (!nama.trim() || password.length < 8) {
      setErrorText('Isi nama wasit dan password minimal 8 karakter.'); return;
    }
    const nomor = Number(meja);
    if (!Number.isInteger(nomor) || nomor < 1 || nomor > tableCount) {
      setErrorText('Nomor meja tidak sesuai jumlah meja event.'); return;
    }
    setSaving(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) throw new Error('Sesi EO tidak ditemukan. Silakan login ulang.');
      const { data, error } = await supabase.functions.invoke('spinmatch-create-wasit', {
        headers: { Authorization: `Bearer ${accessToken}` },
        body: { event_id: Number(eventItem.id), nama_wasit: nama.trim(), nomor_meja: nomor, password }
      });
      if (error || !data?.success) {
        let message = data?.error || error?.message || 'Gagal membuat akun wasit.';
        if (error?.context?.json) {
          try { const detail = await error.context.json(); message = detail?.error || message; } catch (_) {}
        }
        throw new Error(message);
      }
      setCreated({ loginId: data.login_id, kode: data.wasit?.kode_wasit, nama: nama.trim(), meja: nomor });
      setNama(''); setPassword('');
      await refresh();
    } catch (err) { setErrorText(err?.message || 'Gagal membuat akun.'); }
    finally { setSaving(false); }
  };

  const updateWasitPassword = async (e) => {
    e.preventDefault();
    if (updatingPassword || !editingWasit || !eventItem?.id) return;
    setErrorText('');
    setNoticeText('');
    if (editPassword.length < 8 || editPassword.length > 128) {
      setErrorText('Password baru harus terdiri dari 8–128 karakter.');
      return;
    }
    setUpdatingPassword(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) throw new Error('Sesi EO tidak ditemukan. Silakan login ulang.');
      const { data, error } = await supabase.functions.invoke('spinmatch-reset-wasit-password', {
        headers: { Authorization: `Bearer ${accessToken}` },
        body: {
          event_id: Number(eventItem.id),
          wasit_id: editingWasit.id,
          password: editPassword
        }
      });
      if (error || !data?.success) {
        let message = data?.error || error?.message || 'Gagal memperbarui password Wasit.';
        if (error?.context?.json) {
          try {
            const detail = await error.context.json();
            message = detail?.error || message;
          } catch (parseError) {
            console.warn('Gagal membaca detail error reset password Wasit:', parseError);
          }
        }
        throw new Error(message);
      }
      setNoticeText(`Password ${editingWasit.nama_wasit || 'Wasit'} berhasil diperbarui. Berikan password baru langsung kepada Wasit.`);
      setEditingWasit(null);
      setEditPassword('');
      setShowEditPassword(false);
    } catch (err) {
      setErrorText(err?.message || 'Gagal memperbarui password Wasit.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[24px] border border-violet-100 bg-white shadow-sm">
      <div className="border-b border-violet-100 bg-violet-50 p-5">
        <h4 className="text-sm font-black text-violet-950">Akun Login Wasit (Supabase)</h4>
        <p className="mt-1 text-[11px] text-violet-800">Akun terikat ke event ini dan satu meja. ID login unik dibuat otomatis; kode WST dapat berulang pada event berbeda.</p>
      </div>
      <form onSubmit={createAccount} className="grid grid-cols-1 gap-3 p-5 md:grid-cols-4">
        <label className="text-xs font-bold text-slate-700">Nama Wasit
          <input required maxLength={100} value={nama} onChange={e => setNama(e.target.value)} placeholder="Nama wasit" className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm" />
        </label>
        <label className="text-xs font-bold text-slate-700">Meja
          <select value={meja} onChange={e => setMeja(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm">
            {Array.from({ length: tableCount }, (_, i) => i + 1).map(n => <option key={n} value={n}>Meja {n}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-slate-700">Password dari EO
          <span className="relative mt-1 block">
            <input required minLength={8} maxLength={128} type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 8 karakter" className="w-full rounded-xl border border-slate-200 p-3 pr-11 text-sm" />
            <button type="button" aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} onClick={() => setShowPassword(visible => !visible)} className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-violet-700">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
        </label>
        <button type="submit" disabled={saving} className="self-end rounded-xl bg-violet-700 p-3 text-sm font-black text-white disabled:opacity-50">{saving ? 'Membuat...' : '+ Buat Akun Login'}</button>
      </form>
      {errorText && <p role="alert" className="mx-5 mb-4 rounded-lg bg-red-50 p-3 text-xs font-bold text-red-700">{errorText}</p>}
      {noticeText && <p role="status" className="mx-5 mb-4 rounded-lg bg-emerald-50 p-3 text-xs font-bold text-emerald-800">{noticeText}</p>}
      {created && <div className="mx-5 mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
        <div className="font-black">Akun berhasil dibuat — berikan data login ini kepada wasit</div>
        <div className="mt-2 break-all rounded-lg border border-emerald-200 bg-white p-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-800">ID Login (masukkan di kolom Username saat login)</div>
          <div className="mt-1 font-mono text-base font-black">{created.loginId}</div>
        </div>
        <div className="mt-2 text-xs">{created.nama} • Kode Wasit: {created.kode} • Meja {created.meja}</div>
        <p className="mt-2 text-xs font-bold">Gunakan ID Login di atas dan password yang dibuat EO. Kode Wasit (WST) hanya kode identitas, bukan untuk login.</p>
        <p className="mt-1 text-xs">Password tidak dapat dilihat kembali dari halaman ini.</p>
        <button type="button" onClick={() => navigator.clipboard?.writeText(created.loginId)} className="mt-2 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">Salin ID Login</button>
      </div>}
      <div className="border-t border-slate-100 p-5">
        <div className="mb-2 flex items-center justify-between"><h5 className="text-xs font-black">Daftar Akun Online</h5><button type="button" onClick={refresh} className="text-xs font-bold text-violet-700">Muat ulang</button></div>
        {loading ? <p className="text-xs text-slate-500">Memuat...</p> : rows.length === 0 ? <p className="text-xs text-slate-500">Belum ada akun login wasit untuk event ini.</p> :
          <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-xs"><thead><tr className="border-b"><th className="py-2">Kode</th><th>Nama</th><th>Meja</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{rows.map(r => <React.Fragment key={r.id}>
            <tr className="border-b"><td className="py-2 font-bold">{r.kode_wasit}</td><td>{r.nama_wasit}</td><td>{r.nomor_meja}</td><td>{r.status}</td><td><button type="button" onClick={() => { setEditingWasit(current => current?.id === r.id ? null : r); setEditPassword(''); setShowEditPassword(false); setErrorText(''); setNoticeText(''); }} className="rounded-lg border border-violet-200 px-2.5 py-1.5 font-bold text-violet-700 hover:bg-violet-50">{editingWasit?.id === r.id ? 'Batal' : 'Edit Password'}</button></td></tr>
            {editingWasit?.id === r.id && <tr className="border-b bg-violet-50/60"><td colSpan={5} className="p-3"><form onSubmit={updateWasitPassword} className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <label className="flex-1 text-xs font-bold text-slate-700">Password baru untuk {r.nama_wasit}
                <span className="relative mt-1 block">
                  <input required minLength={8} maxLength={128} type={showEditPassword ? 'text' : 'password'} autoComplete="new-password" value={editPassword} onChange={event => setEditPassword(event.target.value)} placeholder="Minimal 8 karakter" className="w-full rounded-lg border border-slate-200 bg-white p-2.5 pr-10 text-sm" />
                  <button type="button" aria-label={showEditPassword ? 'Sembunyikan password baru' : 'Tampilkan password baru'} onClick={() => setShowEditPassword(visible => !visible)} className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
                    {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>
              <button type="submit" disabled={updatingPassword} className="rounded-lg bg-violet-700 px-4 py-2.5 text-xs font-black text-white disabled:opacity-50">{updatingPassword ? 'Menyimpan...' : 'Simpan Password Baru'}</button>
            </form></td></tr>}
          </React.Fragment>)}</tbody></table></div>}
        <p className="mt-3 text-[10px] text-slate-500">Untuk login, wasit memakai ID Login yang ditampilkan saat akun dibuat dan password dari EO. Kode Wasit pada daftar ini hanya sebagai identitas.</p>
      </div>
    </div>
  );
};


// Pengawas pertandingan: akun permanen dan penugasan event melalui Supabase.
// Seluruh perubahan penugasan diputuskan oleh RPC server, bukan localStorage.
const SupervisorManagementPanel = ({ eventItem }) => {
  const [accounts, setAccounts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedReferee, setSelectedReferee] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [notice, setNotice] = useState('');
  const [createdAccount, setCreatedAccount] = useState(null);
  const eventId = Number(eventItem?.id);
  const activeAssignment = assignments.find(row => Number(row.event_id) === eventId && row.status === 'AKTIF');
  const activeAccount = accounts.find(row => row.auth_user_id === activeAssignment?.referee_auth_id);

  const refresh = async () => {
    setLoading(true);
    try {
      const [refereesResult, assignmentsResult] = await Promise.all([
        supabase.from('spinmatch_referees').select('id, auth_user_id, kode_referee, nama_referee').order('id'),
        supabase.from('spinmatch_referee_assignments').select('id, event_id, referee_auth_id, status, assigned_at').eq('status', 'AKTIF'),
      ]);
      if (refereesResult.error) throw new Error(`Daftar Referee: ${refereesResult.error.message}`);
      if (assignmentsResult.error) throw new Error(`Penugasan Referee: ${assignmentsResult.error.message}`);
      setAccounts(refereesResult.data || []);
      setAssignments(assignmentsResult.data || []);
      setErrorText('');
    } catch (error) {
      setErrorText(error?.message || 'Data Referee tidak dapat dimuat. Periksa izin SELECT/RLS di Supabase.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { refresh(); }, [eventId]);

  const createAccount = async (e) => {
    e.preventDefault();
    if (busy) return;
    setErrorText(''); setNotice(''); setCreatedAccount(null);
    const normalizedUsername = username.trim().toLowerCase();
    if (nama.trim().length < 2 || !/^[a-z0-9][a-z0-9._-]{3,31}$/.test(normalizedUsername) || password.length < 8 || password.length > 128) {
      setErrorText('Nama minimal 2 karakter, username 4–32 karakter, dan password 8–128 karakter.');
      return;
    }
    setBusy(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error('Sesi login tidak tersedia. Silakan login ulang.');
      const { data, error } = await supabase.functions.invoke('spinmatch-create-referee', {
        headers: { Authorization: `Bearer ${token}` },
        body: { nama_referee: nama.trim(), username: normalizedUsername, password },
      });
      if (error || !data?.success) {
        let message = data?.error || error?.message || 'Gagal membuat akun Referee.';
        if (error?.context?.json) {
          try { const detail = await error.context.json(); message = detail?.error || message; } catch (_) {}
        }
        throw new Error(message);
      }
      setCreatedAccount({ ...data.referee, password });
      setNama(''); setUsername(''); setPassword('');
      setNotice('Akun berhasil dibuat. Referee belum ditugaskan ke event.');
      await refresh();
    } catch (error) {
      setErrorText(error?.message || 'Gagal membuat akun Referee.');
    } finally {
      setBusy(false);
    }
  };

  const assign = async () => {
    if (busy || !selectedReferee || !Number.isSafeInteger(eventId)) return;
    const selected = accounts.find(row => row.auth_user_id === selectedReferee);
    if (!window.confirm(`Tugaskan ${selected?.nama_referee || 'Referee'} ke event "${eventItem.nama}"? Penugasan aktif sebelumnya pada event ini akan diganti.`)) return;
    setBusy(true); setErrorText(''); setNotice('');
    try {
      const { error } = await supabase.rpc('spinmatch_assign_referee', {
        p_event_id: eventId, p_referee_auth_id: selectedReferee,
      });
      if (error) throw error;
      setNotice('Penugasan Referee berhasil disimpan.');
      await refresh();
    } catch (error) { setErrorText(error?.message || 'Gagal menugaskan Referee.'); }
    finally { setBusy(false); }
  };

  const endAssignment = async () => {
    if (busy || !activeAssignment) return;
    if (!window.confirm(`Akhiri penugasan Referee pada event "${eventItem.nama}"?`)) return;
    setBusy(true); setErrorText(''); setNotice('');
    try {
      const { error } = await supabase.rpc('spinmatch_end_referee_assignment', { p_event_id: eventId });
      if (error) throw error;
      setNotice('Penugasan telah diakhiri. Akun Referee dapat digunakan kembali.');
      await refresh();
    } catch (error) { setErrorText(error?.message || 'Gagal mengakhiri penugasan.'); }
    finally { setBusy(false); }
  };

  return <div className="mt-5 space-y-4">
    {errorText && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-800">{errorText}</p>}
    {notice && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800">{notice}</p>}
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-black text-slate-900">Penugasan Referee Event</h4>
        <button type="button" onClick={refresh} disabled={loading || busy} className="rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-50">Muat Ulang</button>
      </div>
      <p className="mt-2 text-xs text-slate-600">Referee aktif: <strong>{activeAssignment ? (activeAccount ? `${activeAccount.nama_referee} (${activeAccount.kode_referee})` : `Akun ${activeAssignment.referee_auth_id}`) : 'Belum ada'}</strong></p>
      <div className="mt-3 flex flex-col gap-2 md:flex-row">
        <select value={selectedReferee} onChange={e => setSelectedReferee(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3 text-sm">
          <option value="">Pilih akun Referee</option>
          {accounts.map(row => {
            const otherAssignment = assignments.find(a => a.referee_auth_id === row.auth_user_id && Number(a.event_id) !== eventId);
            return <option key={row.id} value={row.auth_user_id} disabled={!!otherAssignment}>{row.kode_referee} — {row.nama_referee}{otherAssignment ? ' (bertugas di event lain)' : ''}</option>;
          })}
        </select>
        <button type="button" disabled={busy || loading || !selectedReferee || !eventItem} onClick={assign} className="rounded-xl bg-blue-700 px-4 py-3 text-xs font-black text-white disabled:opacity-50">Tugaskan / Ganti</button>
        <button type="button" disabled={busy || loading || !activeAssignment} onClick={endAssignment} className="rounded-xl border border-red-200 px-4 py-3 text-xs font-black text-red-700 disabled:opacity-50">Akhiri Tugas</button>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">Satu akun hanya boleh bertugas pada satu event aktif. Validasi dilakukan di server.</p>
    </div>
    <div className="rounded-xl border border-slate-200 p-4">
      <h4 className="text-sm font-black text-slate-900">Daftarkan Akun Referee Baru</h4>
      <form onSubmit={createAccount} className="mt-3 grid gap-3 md:grid-cols-4">
        <label className="text-xs font-bold text-slate-700">Nama Referee<input required minLength={2} maxLength={100} value={nama} onChange={e => setNama(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm" placeholder="Nama lengkap" /></label>
        <label className="text-xs font-bold text-slate-700">Username<input required minLength={4} maxLength={32} value={username} onChange={e => setUsername(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm" placeholder="contoh: referee01" /></label>
        <label className="text-xs font-bold text-slate-700">Password<input required minLength={8} maxLength={128} type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm" placeholder="Minimal 8 karakter" /></label>
        <button type="submit" disabled={busy} className="self-end rounded-xl bg-emerald-600 p-3 text-xs font-black text-white disabled:opacity-50">{busy ? 'Memproses...' : '+ Buat Akun Referee'}</button>
      </form>
      {createdAccount && <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-950">
        <strong>Akun dibuat: {createdAccount.kode_referee} — {createdAccount.nama_referee}</strong>
        <p className="mt-1">Username: <strong>{createdAccount.username}</strong></p>
        <p>Password yang Anda masukkan: <strong>{createdAccount.password}</strong></p>
        <p className="mt-1">Simpan kredensial dengan aman dan serahkan langsung kepada Referee. Informasi ini hilang saat halaman ditutup.</p>
      </div>}
    </div>
    <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Pendaftaran dan penugasan tersedia untuk pengujian. Dashboard operasional Referee dan kebijakan akses pertandingan di server belum selesai; jangan gunakan akun Referee untuk pertandingan resmi.</p>
  </div>;
};

const SignaturePad = ({ value, onChange, label }) => {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (value) {
      const image = new Image();
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      image.src = value;
    }
  }, [value]);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();
    drawingRef.current = true;
    lastPointRef.current = getPoint(event);
    canvasRef.current.setPointerCapture?.(event.pointerId);
  };

  const draw = (event) => {
    if (!drawingRef.current) return;
    event.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const currentPoint = getPoint(event);
    const lastPoint = lastPointRef.current;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    lastPointRef.current = currentPoint;
  };

  const stopDrawing = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    onChange(canvasRef.current.toDataURL('image/png'));
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  return (
    <div className="min-w-0">
      <div className="mb-1 text-center text-[10px] font-bold text-slate-500">{label}</div>
      <div className="overflow-hidden rounded-lg border border-slate-300 bg-white">
        <canvas
          ref={canvasRef}
          width={360}
          height={100}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          className="block h-[46px] w-full touch-none cursor-crosshair sm:h-[54px]"
        />
      </div>
      <button
        type="button"
        onClick={clearSignature}
        className="mt-1 w-full text-[9px] font-bold text-red-500"
      >
        Hapus Tanda Tangan
      </button>
    </div>
  );
};


// Pengaturan tarif global SpinMatch — hanya Super Admin; Supabase RLS memverifikasi hak tulis.
const PricingAdminPanel = () => {
  const [config, setConfig] = useState(null);
  const [rules, setRules] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [eoId, setEoId] = useState('');
  const [specialPrice, setSpecialPrice] = useState('0');
  const [quota, setQuota] = useState('');
  const [note, setNote] = useState('');
  const money = n => `Rp ${Number(n || 0).toLocaleString('id-ID')}`;
  // Format rupiah di layar (100.000), tetapi simpan nilai angka murni ke Supabase.
  const rupiahInput = value => String(value ?? '').replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const load = async () => {
    setBusy(true); setError('');
    const [a,b] = await Promise.all([
      supabase.from('spinmatch_pricing_settings').select('*').eq('id',1).single(),
      supabase.from('spinmatch_eo_pricing').select('*').order('created_at',{ascending:false})
    ]);
    if(a.error || b.error) setError(a.error?.message || b.error?.message || 'Tidak dapat membaca tarif.');
    else {setConfig(a.data);setRules(b.data || []);}
    setBusy(false);
  };
  useEffect(() => {load();}, []);
  const save = async () => {
    if(!config || busy) return;
    const standard = Number(config.standard_price), promo = Number(config.public_promo_price);
    if(!Number.isInteger(standard) || standard<0 || !Number.isInteger(promo) || promo<0) {setError('Harga harus angka bulat minimal 0.');return;}
    if(config.public_promo_start && config.public_promo_end && config.public_promo_end < config.public_promo_start) {setError('Tanggal akhir promosi harus setelah tanggal mulai.');return;}
    setBusy(true);setError('');setNotice('');
    const {error:err} = await supabase.from('spinmatch_pricing_settings').update({
      standard_price:standard, public_promo_enabled:!!config.public_promo_enabled,
      public_promo_price:promo, public_promo_start:config.public_promo_start || null,
      public_promo_end:config.public_promo_end || null,
      payment_bank:config.payment_bank || '', payment_account_number:config.payment_account_number || '',
      payment_account_name:config.payment_account_name || '',payment_whatsapp:config.payment_whatsapp || '',
      updated_at:new Date().toISOString()
    }).eq('id',1).select('id');
    if(err) setError(err.message); else setNotice('Pengaturan tarif berhasil disimpan di Supabase.');
    setBusy(false);
  };
  const addRule = async () => {
    if(busy) return;
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eoId.trim())) {setError('Isi User ID EO dari Supabase Auth (format UUID).');return;}
    const price=Number(specialPrice), q=quota.trim()===''?null:Number(quota);
    if(!Number.isInteger(price)||price<0||(q!==null&&(!Number.isInteger(q)||q<1))) {setError('Tarif minimal Rp0 dan kuota harus bilangan bulat positif.');return;}
    setBusy(true);setError('');setNotice('');
    const {error:err}=await supabase.from('spinmatch_eo_pricing').insert({eo_auth_id:eoId.trim(),price_per_event:price,quota_events:q,note:note.trim(),enabled:true});
    if(err) setError(err.message); else {setNotice('Tarif khusus berhasil ditambahkan.');setEoId('');setNote('');await load();}
    setBusy(false);
  };
  const toggleRule = async r => {
    setBusy(true);setError('');
    const {error:err}=await supabase.from('spinmatch_eo_pricing').update({enabled:!r.enabled,updated_at:new Date().toISOString()}).eq('id',r.id);
    if(err) setError(err.message);else await load();
    setBusy(false);
  };
  const field=(label,key,type='text') => {
    const isRupiah = key === 'standard_price' || key === 'public_promo_price';
    return <label className="block text-xs font-bold text-slate-700">{label}<input type={isRupiah ? 'text' : type} inputMode={isRupiah ? 'numeric' : undefined} value={isRupiah ? rupiahInput(config?.[key]) : (config?.[key] ?? '')} onChange={e=>setConfig(v=>({...v,[key]:isRupiah ? e.target.value.replace(/\D/g, '') : e.target.value}))} className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm" /></label>;
  };
  return <div className="space-y-4">
    <div className="flex items-center gap-3"><h3 className="text-lg font-black text-slate-900">Tarif & Pembayaran SpinMatch</h3><button type="button" disabled={busy} onClick={load} className="ml-auto rounded-lg border px-3 py-2 text-xs font-bold">Muat ulang</button></div>
    {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}
    {notice && <p className="rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800">{notice}</p>}
    {!config ? <p className="rounded-xl bg-white p-5 text-sm">{busy?'Memuat pengaturan...':'Pengaturan belum dapat ditampilkan. Periksa akses Super Admin dan RLS Supabase.'}</p> : <>
      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4"><h4 className="font-black">Tarif Umum & Promosi</h4>
        <div className="grid gap-3 md:grid-cols-2">{field('Tarif umum per event (Rp)','standard_price','number')}{field('Tarif promosi per event (Rp)','public_promo_price','number')}</div>
        <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={!!config.public_promo_enabled} onChange={e=>setConfig(v=>({...v,public_promo_enabled:e.target.checked}))}/>Aktifkan promosi umum</label>
        <div className="grid gap-3 md:grid-cols-2">{field('Mulai promosi (opsional)','public_promo_start','datetime-local')}{field('Akhir promosi (opsional)','public_promo_end','datetime-local')}</div>
        <p className="text-xs text-slate-500">Tarif normal: {money(config.standard_price)} • Promosi: {config.public_promo_enabled ? money(config.public_promo_price) : 'Tidak aktif'}. Tarif promosi adalah harga akhir, bukan nilai diskon. Saat promo aktif dengan harga Rp0, event gratis.</p>
      </div>
      <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3"><h4 className="font-black">Rekening & Konfirmasi</h4><div className="grid gap-3 md:grid-cols-2">{field('Nama bank','payment_bank')}{field('Nomor rekening','payment_account_number')}{field('Atas nama','payment_account_name')}{field('Nomor WhatsApp (contoh 62812...)','payment_whatsapp')}</div></div>
      <button type="button" disabled={busy} onClick={save} className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{busy?'Memproses...':'Simpan Tarif & Rekening'}</button>
    </>}
    <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3"><h4 className="font-black">Tarif Khusus / Gratis untuk EO</h4>
      <p className="text-xs text-slate-500">Masukkan UUID akun EO dari Supabase → Authentication → Users. Tarif Rp0 memberikan fasilitas gratis. Kuota kosong = tanpa batas; pembatasan pemakaian kuota akan diaktifkan bersama sistem invoice pada tahap berikutnya.</p>
      <div className="grid gap-3 md:grid-cols-2"><label className="text-xs font-bold">User ID EO<input value={eoId} onChange={e=>setEoId(e.target.value)} placeholder="UUID akun EO" className="mt-1 w-full rounded-xl border p-3 text-sm"/></label><label className="text-xs font-bold">Tarif khusus (Rp)<input type="text" inputMode="numeric" value={rupiahInput(specialPrice)} onChange={e=>setSpecialPrice(e.target.value.replace(/\D/g, ''))} className="mt-1 w-full rounded-xl border p-3 text-sm"/></label><label className="text-xs font-bold">Kuota event (opsional)<input type="number" min="1" value={quota} onChange={e=>setQuota(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm"/></label><label className="text-xs font-bold">Catatan<input value={note} onChange={e=>setNote(e.target.value)} className="mt-1 w-full rounded-xl border p-3 text-sm"/></label></div>
      <button type="button" disabled={busy} onClick={addRule} className="rounded-xl bg-[#0a3971] px-5 py-3 text-sm font-black text-white disabled:opacity-50">+ Tambah Tarif Khusus EO</button>
      <div className="space-y-2">{rules.map(r=><div key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border p-3 text-xs"><div className="min-w-0"><div className="break-all font-bold">{r.eo_auth_id}</div><div>{money(r.price_per_event)} • Kuota: {r.quota_events??'Tanpa batas'} • {r.note||'Tanpa catatan'}</div></div><button type="button" disabled={busy} onClick={()=>toggleRule(r)} className={`rounded-lg px-3 py-2 font-bold ${r.enabled?'bg-emerald-100 text-emerald-800':'bg-slate-100 text-slate-600'}`}>{r.enabled?'Aktif — Nonaktifkan':'Nonaktif — Aktifkan'}</button></div>)}{rules.length===0&&<p className="text-xs text-slate-500">Belum ada tarif khusus EO.</p>}</div>
    </div><p className="text-xs text-amber-700">Tagihan saat pembuatan event sudah tersedia. Verifikasi pembayaran, pemotongan kuota, dan pengamanan tarif/status di server masih memerlukan integrasi lanjutan.</p>
  </div>;
};

// Verifikasi pembayaran hanya lewat RPC Supabase dengan pemeriksaan Super Admin di server.
const PaymentReviewPanel = ({ onEventUpdated }) => {
  const [invoices, setInvoices] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState('PENDING');
  const load = async () => {
    setBusy(true); setError('');
    const { data, error: err } = await supabase.from('spinmatch_event_invoices')
      .select('id,event_id,event_name,eo_auth_id,amount,price_label,status,created_at,reviewed_at')
      .order('created_at', { ascending: false });
    if (err) setError(`Gagal memuat tagihan: ${err.message}`);
    else setInvoices(data || []);
    setBusy(false);
  };
  useEffect(() => { load(); }, []);
  const review = async (invoice, action) => {
    const approve = action === 'APPROVED';
    const amountText = invoice.amount == null ? 'nominal lama belum tercatat' : `Rp ${Number(invoice.amount).toLocaleString('id-ID')}`;
    if (!window.confirm(`${approve ? 'SETUJUI' : 'TOLAK'} pembayaran event "${invoice.event_name}" (${amountText})? ${approve ? 'Pastikan dana benar-benar masuk ke rekening sebelum melanjutkan.' : 'Event tetap tidak aktif.'}`)) return;
    setBusy(true); setError(''); setNotice('');
    const { data, error: err } = await supabase.rpc('spinmatch_review_event_payment', { p_invoice_id: invoice.id, p_action: action });
    if (err) setError(`Verifikasi gagal: ${err.message}`);
    else {
      setNotice(`Pembayaran ${invoice.event_name} ${approve ? 'disetujui; event diaktifkan' : 'ditolak'}.`);
      await onEventUpdated?.();
    }
    await load();
    setBusy(false);
  };
  const shown = invoices.filter(r => filter === 'ALL' || r.status === filter);
  return <div className="rounded-2xl bg-white p-5 shadow-sm space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg font-black text-slate-900">Verifikasi Pembayaran EO</h3><button type="button" disabled={busy} onClick={load} className="rounded-lg border px-3 py-2 text-xs font-bold">Muat Ulang</button></div>
    <p className="text-xs text-slate-500">Cocokkan bukti WhatsApp dengan mutasi rekening. WhatsApp bukan bukti pembayaran otomatis.</p>
    <div className="flex flex-wrap gap-2">{[['PENDING','Menunggu'],['APPROVED','Disetujui'],['REJECTED','Ditolak'],['ALL','Semua']].map(([value,label])=><button key={value} type="button" onClick={()=>setFilter(value)} className={`rounded-lg px-3 py-2 text-xs font-bold ${filter===value?'bg-blue-800 text-white':'bg-slate-100 text-slate-700'}`}>{label}</button>)}</div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
    {notice && <p className="rounded-lg bg-green-50 p-3 text-xs text-green-800">{notice}</p>}
    {busy && <p className="text-xs text-slate-500">Memproses...</p>}
    {!busy && shown.length===0 && <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Tidak ada tagihan dalam kategori ini.</p>}
    <div className="space-y-3">{shown.map(inv=><div key={inv.id} className="rounded-xl border border-slate-200 p-4 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-slate-900">{inv.event_name}</strong><span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold">{inv.status==='PENDING'?'Menunggu':inv.status==='APPROVED'?'Disetujui':inv.status==='REJECTED'?'Ditolak':'Gratis'}</span></div>
      <div className="text-xs text-slate-600">Event ID: {inv.event_id} • {new Date(inv.created_at).toLocaleString('id-ID')}</div>
      <div className="text-base font-black text-blue-950">{inv.amount==null?'Nominal belum tercatat — cek bukti dan rekening':`Rp ${Number(inv.amount).toLocaleString('id-ID')}`}</div>
      <div className="text-xs text-slate-500">{inv.price_label || 'Tarif event'} • EO: {inv.eo_auth_id || '-'}</div>
      {inv.status==='PENDING' && <div className="grid grid-cols-2 gap-2 pt-2"><button type="button" disabled={busy} onClick={()=>review(inv,'APPROVED')} className="rounded-xl bg-emerald-600 px-3 py-3 text-xs font-black text-white disabled:opacity-50">✓ Setujui</button><button type="button" disabled={busy} onClick={()=>review(inv,'REJECTED')} className="rounded-xl bg-red-600 px-3 py-3 text-xs font-black text-white disabled:opacity-50">✕ Tolak</button></div>}
    </div>)}</div>
  </div>;
};



// Jeda bersama seluruh meja; jam dasar tidak pernah ditimpa.
const smClock = value => { const m = /^(\d{2}):(\d{2})$/.exec(String(value || '')); return m && +m[1] < 24 && +m[2] < 60 ? (+m[1] * 60 + +m[2]) : null; };
const smTime = n => `${String(Math.floor(n / 60) % 24).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
const smBreaks = rows => (Array.isArray(rows) ? rows : []).filter(x => x.enabled).map(x => ({ ...x, a: smClock(x.start_time), b: smClock(x.end_time) })).filter(x => x.a !== null && x.b !== null && x.b > x.a).sort((a,b) => a.a - b.a);
const smMovePastBreaks = (start, duration, breaks) => {
  // Geser seluruh pertandingan yang bertabrakan dengan jeda, termasuk
  // pertandingan yang dimulai sebelum jeda tetapi selesai di dalam jeda.
  let next = start;
  for (const b of breaks) {
    if (next < b.b && next + duration > b.a) next = b.b;
  }
  return next;
};
const smApplyBreaks = (schedule, breaks) => {
  const active = smBreaks(breaks);
  if (!active.length) return schedule;
  const times = new Map();
  return schedule.map(row => {
    if (!row || row.type !== 'player' || !row.jam || row.result?.winner) return row;
    
    // Regex diperbarui agar mengenali pemisah jam baik di HP maupun Desktop (- / – / — / spasi)
    const match = /^(\d{1,2}:\d{2})\s*[-–—\s]+\s*(\d{1,2}:\d{2})$/.exec(String(row.jam).trim());
    if (!match) return row;
    
    const startStr = match[1].padStart(5, '0');
    const endStr = match[2].padStart(5, '0');
    const start = smClock(startStr);
    const end = smClock(endStr);
    
    if (start === null || end === null || end <= start) return row;
    const duration = end - start;
    const key = `${start}:${end}`;
    
    if (!times.has(key)) {
      times.set(key, smMovePastBreaks(start, duration, active));
    }
    const shifted = times.get(key);
    return { ...row, jam: `${smTime(shifted)} - ${smTime(shifted + duration)}` };
  });
};
const SpinMatchBreakEditor = ({ eventId, breaks, onSaved, canEdit }) => {
  const empty = () => Array.from({ length: 3 }, (_, i) => ({ slot: i + 1, enabled: false, start_time: '', end_time: '', label: '' }));
  const [draft, setDraft] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => { setDraft(Array.from({ length: 3 }, (_, i) => ({ ...empty()[i], ...(breaks || []).find(x => Number(x.slot) === i + 1) }))); setMessage(''); }, [eventId, JSON.stringify(breaks || [])]);
  const change = (i, key, value) => setDraft(old => old.map((x, j) => j === i ? { ...x, [key]: value } : x));
  const save = async () => {
    if (!eventId || busy) return;
    const active = draft.filter(x => x.enabled);
    for (const item of active) if (smClock(item.start_time) === null || smClock(item.end_time) === null || smClock(item.end_time) <= smClock(item.start_time)) { setMessage('Jam jeda harus valid, selesai lebih besar dari mulai, dan dalam hari yang sama.'); return; }
    const ordered = smBreaks(draft);
    if (ordered.some((x, i) => i && x.a < ordered[i-1].b)) { setMessage('Sesi jeda tidak boleh saling bertumpuk.'); return; }
    if (!window.confirm('Simpan jeda untuk seluruh meja? Jadwal pertandingan yang belum selesai akan dihitung ulang.')) return;
    setBusy(true); setMessage('');
    const { error } = await supabase.from('spinmatch_event_breaks').upsert(draft.map(x => ({ event_id: Number(eventId), slot: x.slot, enabled: x.enabled, start_time: x.start_time || null, end_time: x.end_time || null, label: x.label || '' })), { onConflict: 'event_id,slot' });
    if (error) setMessage(`Gagal menyimpan: ${error.message}`);
    else { setMessage('Jeda berhasil disimpan untuk event ini.'); onSaved?.(); }
    setBusy(false);
  };
  return <div className="rounded-xl border border-sky-200 bg-white p-3 space-y-2">
    <div className="font-black text-sm text-sky-950">Pengaturan Jeda Pertandingan <span className="font-normal text-xs">(maksimal 3 sesi, semua meja)</span></div>
    {draft.map((item, i) => <div key={i} className="flex flex-wrap items-center gap-2 border-t pt-2 text-xs">
      <label className="flex items-center gap-1 font-bold"><input type="checkbox" disabled={!canEdit} checked={!!item.enabled} onChange={e => change(i, 'enabled', e.target.checked)} />Jeda {i + 1}</label>
      <input aria-label={`Mulai jeda ${i+1}`} type="time" disabled={!canEdit || !item.enabled} value={item.start_time || ''} onChange={e => change(i, 'start_time', e.target.value)} className="rounded border p-1" />
      <span>s.d.</span><input aria-label={`Selesai jeda ${i+1}`} type="time" disabled={!canEdit || !item.enabled} value={item.end_time || ''} onChange={e => change(i, 'end_time', e.target.value)} className="rounded border p-1" />
      <input aria-label={`Alasan jeda ${i+1}`} disabled={!canEdit || !item.enabled} value={item.label || ''} onChange={e => change(i, 'label', e.target.value)} placeholder="Istirahat / salat" className="min-w-[140px] flex-1 rounded border p-1" />
    </div>)}
    {canEdit && <button type="button" disabled={busy || !eventId} onClick={save} className="rounded-lg bg-sky-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">{busy ? 'Menyimpan...' : 'Simpan Jeda'}</button>}
    {message && <p role="status" className="text-xs text-sky-800">{message}</p>}
  </div>;
};

const RefereeWorkspace = ({ user, activeView, setActiveView, events, getSchedule, getWasit, getMatchPlayers, eventBreaks, onBreaksSaved }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scheduleSearch, setScheduleSearch] = useState('');
  const [showBreakEditor, setShowBreakEditor] = useState(false);
  const [eventWasits, setEventWasits] = useState([]);
  const [wasitError, setWasitError] = useState('');
  const [savingWasitId, setSavingWasitId] = useState(null);
  const [calledMatches, setCalledMatches] = useState({});
  const [calledWasits, setCalledWasits] = useState({});
  const [speechError, setSpeechError] = useState('');
  const loadEventWasits = async eventId => {
    if (!eventId) return [];
    const { data, error: queryError } = await supabase.rpc('spinmatch_get_event_wasits', {
      p_event_id: Number(eventId),
    });
    if (queryError) {
      setWasitError(`Gagal menyinkronkan daftar Wasit event: ${queryError.message}`);
      return null;
    }
    const wasits = Array.isArray(data) ? data : [];
    setEventWasits(wasits);
    setWasitError('');
    return wasits;
  };
  const load = async () => {
    setLoading(true); setError('');
    const { data, error: queryError } = await supabase.from('spinmatch_referee_assignments')
      .select('event_id, status, assigned_at').eq('referee_auth_id', user?.id).eq('status', 'AKTIF');
    if (queryError) setError(queryError.message);
    setRows(data || []); setLoading(false);
  };
  useEffect(() => { if (user?.id) load(); else setLoading(false); }, [user?.id]);
  const assignedEventId = rows[0]?.event_id;
  const assignedEvent = events.find(ev => String(ev.id) === String(assignedEventId));
  useEffect(() => {
    let cancelled = false;
    const refreshEventWasits = async () => {
      setWasitError('');
      setEventWasits([]);
      if (!assignedEventId) return;
      const { data, error: queryError } = await supabase.rpc('spinmatch_get_event_wasits', {
        p_event_id: Number(assignedEventId),
      });
      if (cancelled) return;
      if (queryError) setWasitError(`Gagal menyinkronkan daftar Wasit event: ${queryError.message}`);
      else setEventWasits(Array.isArray(data) ? data : []);
    };
    refreshEventWasits();
    return () => { cancelled = true; };
  }, [assignedEventId]);
  const sections = {
    SCHEDULE: { title: 'Jadwal Pertandingan' },
    REF_CALLS: { title: 'Panggilan Pertandingan' },
    REF_TABLES: { title: 'Penempatan Meja' },
    REF_WASIT: { title: 'Kelola Wasit' },
    REF_LIVE: { title: 'Pantau Live Score' },
  };
  const section = sections[activeView];
  const scheduledMatches = assignedEventId && assignedEvent
    ? (getSchedule(assignedEventId) || []).filter(row =>
      row?.matchId &&
      row.showMatch !== false &&
      (row.type === 'player' || row.player)
    )
    : [];
  const filteredScheduledMatches = scheduledMatches.filter(row => {
    const pair = getMatchPlayers(row, assignedEventId);
    const searchText = [
      row.player?.nama, row.player?.ptm, row.player?.club, row.pool, row.playerCode,
      row.matchRef, row.matchLabel, row.meja, pair?.player1?.nama, pair?.player1?.ptm,
      pair?.player2?.nama, pair?.player2?.ptm,
    ].filter(Boolean).join(' ').toLocaleLowerCase();
    return searchText.includes(scheduleSearch.trim().toLocaleLowerCase());
  });
  const getMatchCallDetails = row => {
    const pair = getMatchPlayers(row, assignedEventId);
    const player1 = pair?.player1 || row.player;
    const player2 = pair?.player2;
    const rawDivision = player1?.divisi || player2?.divisi || row.player?.divisi || '';
    const division = String(rawDivision).trim().replace(/^divisi\s*/i, '');
    const rawTable = String(row.meja || '').trim().replace(/^meja\s*/i, '');
    const table = rawTable && rawTable !== '-' ? rawTable : 'belum ditentukan';
    const formatPlayer = player => {
      if (!player?.nama) return 'Peserta belum ditentukan';
      const ptm = String(player.ptm || '').trim();
      return ptm ? `${player.nama} dari PTM ${ptm.replace(/^ptm\.?\s*/i, '')}` : player.nama;
    };
    const divisionText = division ? `Divisi ${division}` : 'divisi belum tercatat';
    const announcement = `Pertandingan ${divisionText}. ${formatPlayer(player1)}, melawan, ${formatPlayer(player2)}.`;
    return { pair, divisionText, table, announcement, player1, player2 };
  };
  const getTableNumber = value => {
    const match = String(value ?? '').match(/\d+/);
    return match ? Number(match[0]) : NaN;
  };
  const getTableSpokenName = value => {
    const tableNumber = getTableNumber(value);
    const names = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh'];
    return Number.isInteger(tableNumber) && names[tableNumber] ? names[tableNumber] : String(value);
  };
  const callMatch = row => {
    const { announcement, table } = getMatchCallDetails(row);
    const callText = `${announcement} Silakan bertanding di Meja ${getTableSpokenName(table)}.`;
    speakAnnouncement(callText);
    setCalledMatches(previous => ({ ...previous, [row.matchId]: true }));
  };
  const speakAnnouncement = text => {
    setSpeechError('');
    if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) {
      setSpeechError('Fitur suara tidak didukung browser ini. Periksa pengaturan suara perangkat.');
      alert(text);
      return false;
    }
    try {
      const speech = window.speechSynthesis;
      speech.cancel();
      speech.resume();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      utterance.pitch = 0.65;
      utterance.onstart = () => setSpeechError('');
      utterance.onerror = event => setSpeechError(`Suara panggilan gagal diputar (${event.error || 'kesalahan audio'}). Coba tekan lagi dan pastikan volume perangkat tidak senyap.`);
      const voices = speech.getVoices();
      const maleVoice = voices.find(voice =>
        /(male|man|boy|pria|laki-laki|ardi)/i.test(voice.name) && /^id(-|_)?/i.test(voice.lang)
      ) || voices.find(voice => /(male|man|boy|pria|laki-laki|ardi)/i.test(voice.name));
      if (!maleVoice) {
        setSpeechError('Suara pria tidak tersedia di browser/perangkat ini. Tambahkan atau pilih voice pria pada pengaturan text-to-speech perangkat.');
        return false;
      }
      utterance.voice = maleVoice;
      speech.speak(utterance);
      return true;
    } catch (error) {
      setSpeechError(`Suara panggilan gagal diputar: ${error.message || 'kesalahan audio'}.`);
      return false;
    }
  };
  const callWasit = async (row, wasit) => {
    let wasitToCall = wasit;
    if (!wasitToCall?.nama_wasit) {
      const latestWasits = await loadEventWasits(assignedEventId);
      if (!latestWasits) return;
      const tableNumber = getTableNumber(getMatchCallDetails(row).table);
      wasitToCall = latestWasits.find(item =>
        getTableNumber(item.nomor_meja) === tableNumber &&
        Boolean(item.nama_wasit) &&
        !['NONAKTIF', 'NON-AKTIF', 'INAKTIF'].includes(String(item.status || '').trim().toUpperCase())
      );
    }
    if (!wasitToCall?.nama_wasit) {
      setSpeechError('Belum ada Wasit dengan nama yang ditugaskan pada meja pertandingan ini.');
      alert('Nama Wasit untuk meja pertandingan ini belum ditemukan. Pastikan penugasan Wasit pada event sudah tersimpan.');
      return;
    }
    const { table } = getMatchCallDetails(row);
    const callText = `Perhatian, Saudara ${wasitToCall.nama_wasit}. Mohon segera menuju Meja ${getTableSpokenName(table)} untuk memimpin pertandingan.`;
    speakAnnouncement(callText);
    setCalledWasits(previous => ({ ...previous, [row.matchId]: true }));
  };
  const updateWasitTable = async (wasit, tableNumber) => {
    setWasitError('');
    setSavingWasitId(wasit.id);
    try {
      const { data: updatedWasit, error: updateError } = await supabase.from('spinmatch_wasit_event')
        .update({ nomor_meja: Number(tableNumber) })
        .eq('id', wasit.id)
        .eq('event_id', Number(assignedEventId))
        .select('id')
        .maybeSingle();
      if (updateError || !updatedWasit) {
        setWasitError(`Gagal memperbarui meja Wasit ${wasit.nama_wasit}: ${updateError?.message || 'Tidak ada baris yang dapat diperbarui. Periksa izin akun Referee.'}`);
      } else {
        setEventWasits(previous => previous.map(item => item.id === wasit.id ? { ...item, nomor_meja: Number(tableNumber) } : item).sort((a, b) => Number(a.nomor_meja) - Number(b.nomor_meja)));
      }
    } catch (updateError) {
      setWasitError(`Gagal memperbarui meja Wasit ${wasit.nama_wasit}: ${updateError?.message || 'Terjadi kesalahan koneksi.'}`);
    }
    setSavingWasitId(null);
  };
  const quickLinks = [
    { view: 'SCHEDULE', label: 'Jadwal Pertandingan', Icon: Calendar, color: 'from-[#ff8a16] to-[#ffad24]', span: 'col-span-3' },
    { view: 'REF_CALLS', label: 'Panggilan Pertandingan', Icon: Radio, color: 'from-[#0874c9] to-[#26a7ff]', span: 'col-span-3' },
    { view: 'REF_TABLES', label: 'Penempatan Meja', Icon: Target, color: 'from-[#08a878] to-[#19c995]', span: 'col-span-2' },
    { view: 'REF_WASIT', label: 'Kelola Wasit', Icon: Users, color: 'from-[#6857d9] to-[#9581ef]', span: 'col-span-2' },
    { view: 'REF_LIVE', label: 'Pantau Live Score', Icon: Activity, color: 'from-[#e83c55] to-[#fa6b78]', span: 'col-span-2' },
    { view: 'RANKING', label: 'Peringkat & Poin', Icon: Medal, color: 'from-[#13a86b] to-[#36cf8b]', span: 'col-span-2' },
  ];
  if (activeView === 'DASHBOARD') return <div className="mx-auto w-full max-w-4xl space-y-5">
    <div className="rounded-3xl bg-gradient-to-r from-[#07335d] to-[#0879c9] p-5 text-white shadow-xl">
      <div className="flex items-center gap-3"><ShieldCheck className="h-9 w-9 text-cyan-200" /><div><h2 className="text-xl font-black">Dashboard Referee</h2><p className="text-xs text-blue-100">Pengawas pertandingan • Akses operasional</p></div></div>
      <p className="mt-3 text-sm text-blue-50">Selamat datang. Akun Referee hanya ditugaskan pada satu event aktif.</p>
    </div>
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2"><h3 className="font-black text-slate-900">Penugasan Saya</h3><button type="button" onClick={load} className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700">Muat Ulang</button></div>
      {loading ? <p className="mt-3 text-sm text-slate-500">Memeriksa penugasan...</p> : error ? <p role="alert" className="mt-3 text-sm text-red-700">{error}</p> : rows.length ? rows.map(row => <div key={row.event_id} className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"><strong>Penugasan aktif</strong><p className="mt-1">{assignedEvent?.nama || `ID Event: ${row.event_id}`}</p><p className="text-xs">Ditugaskan: {row.assigned_at ? new Date(row.assigned_at).toLocaleString('id-ID') : '-'}</p></div>) : <p className="mt-3 text-sm text-slate-600">Belum ada penugasan aktif. Hubungi EO atau Super Admin.</p>}
    </div>
    <section className="rounded-[26px] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4"><h2 className="text-base font-black text-slate-950">Menu Cepat</h2><p className="mt-1 text-xs text-slate-500">Akses operasional pertandingan</p></div>
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {quickLinks.map(({ view, label, Icon, color, span }) => <button key={view} type="button" onClick={() => setActiveView(view)} className={`${span} flex min-h-[64px] min-w-0 flex-col items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r ${color} px-2 py-2.5 text-center text-[10px] font-black leading-tight text-white shadow-sm active:scale-[.98] sm:min-h-[72px] sm:flex-row sm:gap-2 sm:text-xs`}>
          <Icon className="h-5 w-5 shrink-0" /><span>{label}</span>
        </button>)}
      </div>
    </section>
  </div>;
  if (activeView === 'SCHEDULE') return <div className="mx-auto max-w-6xl space-y-5">
    {loading ? <div className="rounded-2xl bg-white p-5">Memeriksa penugasan...</div>
      : error ? <div role="alert" className="rounded-2xl bg-red-50 p-5 text-red-700">{error}</div>
      : !assignedEventId ? <div className="rounded-2xl bg-amber-50 p-5 text-amber-900">Belum ada penugasan aktif. Hubungi EO atau Super Admin.</div>
      : !assignedEvent ? <div className="rounded-2xl bg-amber-50 p-5 text-amber-900">Data event belum dapat dibaca. Periksa izin baca event di Supabase.</div>
      : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0"><h2 className="text-base font-black text-slate-900">Jadwal Pertandingan</h2><p className="mt-1 truncate text-xs text-slate-500">{assignedEvent.nama} • {assignedEvent.tanggal || ''}</p></div>
          <button type="button" onClick={() => setShowBreakEditor(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-black text-amber-950 shadow-sm hover:bg-amber-500"><Pause className="h-4 w-4" />Jeda Main</button>
        </div>
        <div className="border-b border-slate-200 p-4">
          <label htmlFor="referee-schedule-search" className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-700"><Search className="h-4 w-4 text-slate-500" />Cari Pemain / Club</label>
          <input id="referee-schedule-search" type="search" value={scheduleSearch} onChange={event => setScheduleSearch(event.target.value)} placeholder="Ketik nama pemain, PTM/club, pool, atau match..." className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
        </div>
        {scheduledMatches.length === 0 ? <div className="bg-amber-50 p-5 text-sm text-amber-900">Belum ada jadwal pool yang bisa ditampilkan untuk event ini. Pastikan undian pool sudah tersimpan di Supabase dan akun Referee memiliki izin baca.</div>
          : filteredScheduledMatches.length === 0 ? <div className="p-5 text-center text-sm text-slate-500">Tidak ada jadwal yang cocok dengan pencarian.</div>
          : <div className="w-full max-w-full overflow-x-auto">
        <table className="w-max min-w-[1150px] table-auto whitespace-nowrap text-left text-[12px] leading-relaxed">

          <thead className="bg-slate-100 text-slate-700"><tr>
            {['Pool', 'Nama Pemain', 'Club/PTM', 'Match', 'Urutan Pertandingan (EO)', 'Jam', 'Meja', 'Wasit', 'Status'].map(label => <th key={label} className="px-1.5 py-2 font-bold break-words">{label}</th>)}
          </tr></thead>
          <tbody>{filteredScheduledMatches.map((row, i) => {
            const pair = getMatchPlayers(row, assignedEventId);
            const matchNames = [pair?.player1?.nama, pair?.player2?.nama].filter(Boolean).join(' vs ');
            return <tr key={`${row.matchId}-${i}`} className="border-t border-slate-100 hover:bg-slate-50">
              <td className="px-1.5 py-1 font-bold align-top">{row.playerCode || row.pool || '-'}</td>
              <td className="px-1.5 py-1 font-semibold align-top whitespace-nowrap">{row.player?.nama || '-'}</td>
              <td className="px-1.5 py-1 align-top whitespace-nowrap">{row.player?.ptm || row.player?.club || '-'}</td>
              <td className="px-1.5 py-1 align-top whitespace-nowrap">{row.matchRef || '-'}</td>
              <td className="px-1.5 py-1 font-semibold text-emerald-800 align-top whitespace-nowrap">{row.matchLabel || 'Menunggu jadwal EO'}{matchNames && <div className="text-[10px] font-normal text-slate-600 whitespace-nowrap">{matchNames}</div>}</td>
              <td className="px-1.5 py-1 align-top">{(row.jam || '-').replace(/\s*-\s*/g, '–')}</td>
              <td className="px-1.5 py-1 align-top">{row.meja || '-'}</td>
              <td className="px-1.5 py-1 text-indigo-700 align-top whitespace-nowrap">{getWasit(assignedEventId, row.meja)}</td>
              <td className="px-1.5 py-1 font-bold align-top whitespace-nowrap">{row.result?.winner ? 'Selesai' : 'Belum selesai'}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>}
      </div>}
    {showBreakEditor && <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={() => setShowBreakEditor(false)}>
      <div role="dialog" aria-modal="true" aria-labelledby="referee-break-title" className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-2xl sm:p-5" onClick={event => event.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 id="referee-break-title" className="text-base font-black text-slate-900">Jeda Main</h3>
          <button type="button" onClick={() => setShowBreakEditor(false)} aria-label="Tutup pengaturan jeda" className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <SpinMatchBreakEditor eventId={assignedEventId} breaks={eventBreaks[String(assignedEventId)] || []} onSaved={() => { setShowBreakEditor(false); onBreaksSaved?.(); }} canEdit={true} />
      </div>
    </div>}
  </div>;
  if (section) return <div className="mx-auto max-w-5xl space-y-5">
    <div className="rounded-3xl bg-gradient-to-r from-[#07335d] to-[#0879c9] p-5 text-white shadow-xl">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setActiveView('DASHBOARD')} aria-label="Kembali ke Dashboard" title="Kembali ke Dashboard" className="shrink-0 rounded-xl border border-white/20 bg-white/10 p-2 text-blue-50 transition hover:bg-white/20">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div><h2 className="text-xl font-black">{section.title}</h2><p className="mt-1 text-sm text-blue-100">{assignedEvent?.nama || (assignedEventId ? `Event ${assignedEventId}` : 'Belum ada event aktif')}</p></div>
      </div>
    </div>
    {loading ? <div className="rounded-2xl bg-white p-5">Memeriksa penugasan...</div>
      : error ? <div role="alert" className="rounded-2xl bg-red-50 p-5 text-red-700">{error}</div>
      : !assignedEventId ? <div className="rounded-2xl bg-amber-50 p-5 text-amber-900">Belum ada penugasan aktif. Hubungi EO atau Super Admin.</div>
      : !assignedEvent ? <div className="rounded-2xl bg-amber-50 p-5 text-amber-900">Data event belum dapat dibaca. Periksa izin baca event di Supabase.</div>
      : activeView === 'REF_CALLS' ? <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4"><div><h3 className="font-black text-slate-900">Panggilan Pertandingan</h3><p className="mt-1 text-xs text-slate-500">Gunakan tombol panggil untuk membacakan peserta, match, dan meja.</p></div><input type="search" aria-label="Cari pertandingan yang akan dipanggil" value={scheduleSearch} onChange={event => setScheduleSearch(event.target.value)} placeholder="Cari pemain atau match..." className="w-full rounded-xl border px-3 py-2 text-sm sm:w-64" /></div>
        {wasitError && <p role="alert" className="m-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{wasitError}. Terapkan migrasi Supabase `spinmatch_get_event_wasits` lalu muat ulang halaman.</p>}
        {speechError && <p role="alert" className="m-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{speechError}</p>}
        {filteredScheduledMatches.length ? <div className="divide-y divide-slate-100">{filteredScheduledMatches.map(row => {
          const { pair, divisionText, table } = getMatchCallDetails(row);
          const tableNumber = getTableNumber(table);
          const assignedWasit = eventWasits.find(wasit =>
            getTableNumber(wasit.nomor_meja) === tableNumber &&
            Boolean(wasit.nama_wasit) &&
            ['AKTIF', 'ACTIVE'].includes(String(wasit.status || '').trim().toUpperCase())
          );
          const scheduledWasitName = getWasit(assignedEventId, row.meja);
          const resolvedWasit = assignedWasit || (
            scheduledWasitName && scheduledWasitName !== 'Belum ditugaskan'
              ? { nama_wasit: scheduledWasitName }
              : null
          );
          return <div key={row.matchId} className="flex flex-wrap items-center justify-between gap-3 p-4"><div className="min-w-0"><p className="text-xs font-bold text-blue-700">{row.matchLabel || row.matchRef || 'Pertandingan'} · {divisionText}</p><p className="mt-1 text-sm font-bold text-slate-900">{pair?.player1?.nama || row.player?.nama || 'Peserta'} vs {pair?.player2?.nama || 'Menunggu lawan'}</p><p className="mt-1 text-xs text-slate-500">Meja {table} • {row.jam || '-'}</p>{resolvedWasit && <p className="mt-1 text-xs font-semibold text-violet-700">Wasit Meja {table}: {resolvedWasit.nama_wasit}</p>}</div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => callMatch(row)} className="rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-black text-white">{calledMatches[row.matchId] ? 'Panggil Lagi' : 'Panggil Pemain'}</button><button type="button" onClick={() => callWasit(row, resolvedWasit)} title={resolvedWasit ? `Panggil Wasit ${resolvedWasit.nama_wasit}` : `Panggil Wasit untuk Meja ${table}`} className="rounded-xl bg-violet-700 px-4 py-2.5 text-xs font-black text-white hover:bg-violet-800">{calledWasits[row.matchId] ? 'Panggil Wasit Lagi' : 'Panggil Wasit'}</button></div></div>;
        })}</div> : <p className="p-5 text-sm text-slate-500">Tidak ada pertandingan yang cocok.</p>}
      </div>
      : activeView === 'REF_TABLES' ? <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-4"><h3 className="font-black text-slate-900">Penempatan Meja</h3><p className="mt-1 text-xs text-slate-500">Jadwal pertandingan dikelompokkan berdasarkan meja yang sudah ditetapkan EO.</p></div>
        {scheduledMatches.length ? Array.from(new Set(scheduledMatches.map(row => String(row.meja || 'Belum ditentukan')))).sort((a, b) => Number(a) - Number(b)).map(table => <section key={table} className="border-b last:border-b-0"><h4 className="bg-slate-50 px-4 py-2 text-xs font-black text-slate-700">Meja {table}</h4><div className="divide-y divide-slate-100">{scheduledMatches.filter(row => String(row.meja || 'Belum ditentukan') === table).map(row => {
          const pair = getMatchPlayers(row, assignedEventId);
          return <div key={row.matchId} className="flex flex-wrap justify-between gap-2 px-4 py-3 text-sm"><span className="font-semibold">{row.matchLabel || row.matchRef} · {pair?.player1?.nama || row.player?.nama || 'Peserta'} vs {pair?.player2?.nama || 'Menunggu lawan'}</span><span className="text-xs text-slate-500">{row.jam || '-'}</span></div>;
        })}</div></section>) : <p className="p-5 text-sm text-slate-500">Belum ada jadwal pertandingan untuk event ini.</p>}
      </div>
      : activeView === 'REF_WASIT' ? <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-4"><h3 className="font-black text-slate-900">Kelola Wasit & Penempatan Meja</h3><p className="mt-1 text-xs text-slate-500">Ubah nomor meja penugasan Wasit. Perubahan disimpan pada data event.</p></div>
        {wasitError && <p role="alert" className="m-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{wasitError}</p>}
        {speechError && <p role="alert" className="m-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{speechError}</p>}
        {eventWasits.length ? <div className="overflow-x-auto"><table className="w-full min-w-[540px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="p-3">Kode Wasit</th><th className="p-3">Nama Wasit</th><th className="p-3">Meja Tugas</th><th className="p-3">Status</th><th className="p-3">Aksi</th></tr></thead><tbody className="divide-y divide-slate-100">{eventWasits.map(wasit => <tr key={wasit.id}><td className="p-3 font-bold text-blue-800">{wasit.kode_wasit || '-'}</td><td className="p-3 font-semibold text-slate-900">{wasit.nama_wasit || 'Nama belum diisi'}</td><td className="p-3"><label className="flex items-center gap-2 text-xs font-bold text-slate-700"><span className="sr-only">Meja untuk {wasit.nama_wasit || wasit.kode_wasit || 'Wasit'}</span><select aria-label={`Meja untuk ${wasit.nama_wasit || wasit.kode_wasit || 'Wasit'}`} disabled={savingWasitId === wasit.id} value={wasit.nomor_meja || ''} onChange={event => updateWasitTable(wasit, event.target.value)} className="rounded-lg border px-3 py-2"><option value="">Pilih meja</option>{Array.from({ length: Math.max(1, Number(assignedEvent.jumlahMeja || 4)) }, (_, index) => <option key={index + 1} value={index + 1}>Meja {index + 1}</option>)}</select>{savingWasitId === wasit.id && <span role="status">Menyimpan...</span>}</label></td><td className="p-3"><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${String(wasit.status || '').toUpperCase() === 'AKTIF' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{wasit.status || 'Tidak diketahui'}</span></td><td className="p-3"><button type="button" disabled={!wasit.nama_wasit || !Number.isFinite(getTableNumber(wasit.nomor_meja)) || ['NONAKTIF', 'NON-AKTIF', 'INAKTIF'].includes(String(wasit.status || '').trim().toUpperCase())} onClick={() => speakAnnouncement(`Perhatian, Saudara ${wasit.nama_wasit}. Mohon segera menuju Meja ${getTableSpokenName(wasit.nomor_meja)} untuk memimpin pertandingan.`)} className="rounded-lg bg-violet-700 px-3 py-2 text-xs font-bold text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-slate-300">Panggil Wasit</button></td></tr>)}</tbody></table></div> : !wasitError && <p className="p-5 text-sm text-slate-500">Belum ada data Wasit untuk event ini.</p>}
      </div>
      : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b p-4"><h3 className="font-black text-slate-900">Pantau Live Score</h3><p className="mt-1 text-xs text-slate-500">Tampilan baca-saja dari hasil pertandingan. Referee tidak dapat mengubah skor melalui halaman ini.</p></div>
        {scheduledMatches.length ? <div className="w-full overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-xs"><tr><th className="p-3">Match</th><th className="p-3">Pemain</th><th className="p-3">Meja</th><th className="p-3">Skor</th><th className="p-3">Status</th></tr></thead><tbody>{scheduledMatches.map(row => {
          const pair = getMatchPlayers(row, assignedEventId);
          const result = row.result;
          return <tr key={row.matchId} className="border-t"><td className="p-3 font-bold">{row.matchLabel || row.matchRef || '-'}</td><td className="p-3">{pair?.player1?.nama || row.player?.nama || 'Peserta'} vs {pair?.player2?.nama || 'Menunggu lawan'}</td><td className="p-3">{row.meja || '-'}</td><td className="p-3 font-black">{result ? `${result.player1Score ?? 0} - ${result.player2Score ?? 0}` : '-'}</td><td className="p-3">{result?.winner ? 'Selesai' : 'Belum selesai'}</td></tr>;
        })}</tbody></table></div> : <p className="p-5 text-sm text-slate-500">Belum ada jadwal untuk dipantau.</p>}
      </div>}
  </div>;
  return null;
};

const AuthenticatedContent = () => {
  const { user, logout } = useAuth();
  const userRole = String(user?.app_metadata?.spinmatch_role || user?.app_metadata?.role || user?.role || user?.user_metadata?.role || '').toUpperCase();
  const isPublic = userRole === 'PUBLIC' || userRole === 'PUBLIK';
  const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'SUPERADMIN' || userRole === 'ADMIN';
  const isEO = userRole === 'EO';
  const isWasit = userRole === 'WASIT';
  const isReferee = userRole === 'REFEREE';
  const [showMobileMoreMenu, setShowMobileMoreMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(null);
  const saveFeedbackTimeoutRef = useRef(null);
  const accountRoleLabel = isSuperAdmin ? 'Super Admin' : isEO ? 'Event Organizer (EO)' : isPublic ? 'Publik' : userRole === 'WASIT' ? 'Wasit' : isReferee ? 'Referee' : 'Pengguna';

  const showSaveFeedback = (saved) => {
    setSaveFeedback(saved);
    window.clearTimeout(saveFeedbackTimeoutRef.current);
    saveFeedbackTimeoutRef.current = window.setTimeout(() => setSaveFeedback(null), 2400);
  };

  useEffect(() => () => window.clearTimeout(saveFeedbackTimeoutRef.current), []);

  const handleMobileRestart = () => {
    setShowMobileMoreMenu(false);
    window.location.reload();
  };

  const handleMobileLogout = () => {
    setShowMobileMoreMenu(false);
    logout();
  };
  const currentUserId = String(user?.id || user?.user_id || user?.uid || '');
  const currentUserName = String(user?.user_metadata?.full_name || user?.user_metadata?.name || user?.name || user?.email || 'EO');

  // ============================================
  // SEMUA HOOKS HARUS DI SINI (SEBELUM RETURN APAPUN)
  // ============================================
  
  const [activeView, setActiveView] = useState('DASHBOARD');
  const [heroEventIndex, setHeroEventIndex] = useState(0);
  const [selectedEventIdForReg, setSelectedEventIdForReg] = useState('');
  const [selectedEventIdForDraw, setSelectedEventIdForDraw] = useState('');
  const [selectedEventIdForSchedule, setSelectedEventIdForSchedule] = useState('');
  const [selectedEventIdForLive, setSelectedEventIdForLive] = useState('');
  const [publicLiveTable, setPublicLiveTable] = useState('ALL');
  const [wasitAssignment, setWasitAssignment] = useState(null);
  const [wasitAssignmentLoading, setWasitAssignmentLoading] = useState(true);
  useEffect(() => {
    if (!isWasit) { setWasitAssignmentLoading(false); return; }
    let cancelled = false;
    setWasitAssignmentLoading(true);
    const load = async () => {
      const { data, error } = await supabase.from('spinmatch_wasit_event')
        .select('event_id, nomor_meja, nama_wasit, status')
        .eq('auth_user_id', currentUserId).eq('status', 'AKTIF').limit(1);
      if (cancelled) return;
      if (error) console.error('Penugasan wasit gagal dimuat:', error);
      setWasitAssignment(!error ? (data?.[0] || null) : null);
      setWasitAssignmentLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [isWasit, currentUserId]);
  useEffect(() => {
    if (!isWasit) return;
    setActiveView('LIVE_SCORE');
    setSelectedEventIdForLive(wasitAssignment?.event_id ? String(wasitAssignment.event_id) : '');
  }, [isWasit, wasitAssignment?.event_id]);

  const [selectedEventIdForKnockout, setSelectedEventIdForKnockout] = useState('');
  const [dashboardEventBrowser, setDashboardEventBrowser] = useState(null); // null | 'MINE' | 'ALL'
  const [publicViewedEventId, setPublicViewedEventId] = useState(() => sessionStorage.getItem('spinmatch_public_view_event') || '');
  const [selectedDashboardEventId, setSelectedDashboardEventId] = useState(() => isPublic ? (sessionStorage.getItem('spinmatch_public_view_event') || '') : '');
  const selectDashboardEvent = (eventItem) => {
    if (!eventItem?.id) return;
    const eventId = String(eventItem.id);
    setSelectedDashboardEventId(eventId);
    setHeroEventIndex(0);
    setSelectedEventIdForReg(eventId);
    setSelectedEventIdForDraw(eventId);
    setSelectedEventIdForSchedule(eventId);
    setSelectedEventIdForLive(eventId);
    setSelectedEventIdForKnockout(eventId);
    setSelectedEventIdForRanking(eventId);
    setSelectedEventIdForSettings(eventId);
    setSelectedDivisionForRanking('');
    setPublicLiveTable('ALL');
    if (isPublic) {
      setPublicViewedEventId(eventId);
      sessionStorage.setItem('spinmatch_public_view_event', eventId);
    }
  };

  // Peringkat & Poin
  const [rankingMode, setRankingMode] = useState('EVENT');
  const [selectedEventIdForRanking, setSelectedEventIdForRanking] = useState('');
  const [selectedDivisionForRanking, setSelectedDivisionForRanking] = useState('');

  // Pengaturan terpusat
  const [selectedEventIdForSettings, setSelectedEventIdForSettings] = useState('');
  const [settingsSection, setSettingsSection] = useState('HOME');
  const [refereeAssignments, setRefereeAssignments] = useState(() => {
    try { return JSON.parse(localStorage.getItem('spinmatch_referee_assignments') || '{}'); }
    catch { return {}; }
  });
  const [financeDrafts, setFinanceDrafts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('spinmatch_finance_drafts') || '{}'); }
    catch { return {}; }
  });

  // Master Wasit SpinMatch + log aktivitas lokal.
  // Nanti dipindahkan ke Supabase/Auth agar lintas perangkat dan akun.
  const [refereeRegistry, setRefereeRegistry] = useState(() => {
    try { return JSON.parse(localStorage.getItem('spinmatch_referee_registry') || '[]'); }
    catch { return []; }
  });
  // Akun online dipisahkan dari Master Wasit lokal agar tidak mencampur event.
  const [onlineReferees, setOnlineReferees] = useState([]);
  // Penugasan online lintas halaman: jadwal Pool dan seluruh ronde Knockout.
  const [refereesByEvent, setRefereesByEvent] = useState({});
  useEffect(() => {
    let cancelled = false;
    const loadReferees = async () => {
      const { data, error } = await supabase.from('spinmatch_wasit_event')
        .select('event_id, nama_wasit, nomor_meja, status');
      if (cancelled) return;
      if (error) {
        console.warn('Nama wasit belum dapat dimuat:', error.message);
        return;
      }
      const grouped = {};
      (data || []).forEach(r => {
        const eventKey = String(r.event_id);
        if (!grouped[eventKey]) grouped[eventKey] = [];
        grouped[eventKey].push(r);
      });
      setRefereesByEvent(grouped);
    };
    loadReferees();
    return () => { cancelled = true; };
  }, [user?.id, selectedEventIdForSchedule, selectedEventIdForKnockout, settingsSection]);
  const getScheduledReferee = (eventId, tableValue) => {
    const tableNo = Number(String(tableValue ?? '').match(/\d+/)?.[0]);
    if (!Number.isFinite(tableNo) || tableNo < 1) return 'Belum ditugaskan';
    const rows = refereesByEvent[String(eventId)] || [];
    const found = rows.find(r => Number(r.nomor_meja) === tableNo && String(r.status || '').toUpperCase() === 'AKTIF');
    return found?.nama_wasit || 'Belum ditugaskan';
  };

  const [onlineRefereesError, setOnlineRefereesError] = useState('');
  const [onlineRefereesLoading, setOnlineRefereesLoading] = useState(false);
  const [refereeModalOpen, setRefereeModalOpen] = useState(false);
  const [newRefereeName, setNewRefereeName] = useState('');
  const [newRefereeStatus, setNewRefereeStatus] = useState('AKTIF');
  const [activityLogs, setActivityLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('spinmatch_activity_logs') || '[]'); }
    catch { return []; }
  });

  const [eventBreaks, setEventBreaks] = useState({});
  const [eventBreaksReadError, setEventBreaksReadError] = useState('');
  const loadEventBreaks = async () => {
    const { data, error } = await supabase.from('spinmatch_event_breaks').select('event_id,slot,enabled,start_time,end_time,label');
    if (error) { console.warn('Pengaturan jeda belum bisa dibaca:', error.message); setEventBreaksReadError(error.message); return; }
    setEventBreaksReadError('');
    const grouped = {};
    (data || []).forEach(x => { const k = String(x.event_id); (grouped[k] ||= []).push(x); });
    setEventBreaks(grouped);
  };
  useEffect(() => { loadEventBreaks(); }, [user?.id]);
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('spinmatch_events');
    if (savedEvents) {
      try { return JSON.parse(savedEvents); } catch (e) { console.error(e); }
    }
    // Tidak ada lagi event contoh bawaan. Data utama mengikuti Supabase.
    return [];
  });

  const [participants, setParticipants] = useState(() => {
    const savedParticipants = localStorage.getItem('spinmatch_participants');
    if (savedParticipants) {
      try { return JSON.parse(savedParticipants); } catch (e) { console.error(e); }
    }
    // Tidak ada lagi peserta contoh bawaan. Data utama mengikuti Supabase.
    return {};
  });

  const [seededPlayers, setSeededPlayers] = useState(() => {
    const saved = localStorage.getItem('spinmatch_seeded');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {};
  });

  const [poolResults, setPoolResults] = useState(() => {
    const saved = localStorage.getItem('spinmatch_pools');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {};
  });

  const [matchResults, setMatchResults] = useState(() => {
    const saved = localStorage.getItem('spinmatch_match_results');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {};
  });
  const [onlineLiveScores, setOnlineLiveScores] = useState({});

  const [poolRankings, setPoolRankings] = useState(() => {
    const saved = localStorage.getItem('spinmatch_pool_rankings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {};
  });

  const [knockoutResults, setKnockoutResults] = useState(() => {
    const saved = localStorage.getItem('spinmatch_knockout_results');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {};
  });
  const [knockoutPrizes, setKnockoutPrizes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('spinmatch_knockout_prizes') || '{}'); }
    catch (e) { console.error(e); return {}; }
  });
  const [knockoutZoom, setKnockoutZoom] = useState(1);
  const knockoutPinchRef = useRef(null);
  const [knockoutAwardsZoom, setKnockoutAwardsZoom] = useState(1);
  const knockoutAwardsPinchRef = useRef(null);
  const [showKnockoutTopEight, setShowKnockoutTopEight] = useState(false);

  useEffect(() => { localStorage.setItem('spinmatch_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('spinmatch_participants', JSON.stringify(participants)); }, [participants]);
  useEffect(() => { localStorage.setItem('spinmatch_seeded', JSON.stringify(seededPlayers)); }, [seededPlayers]);
  useEffect(() => { localStorage.setItem('spinmatch_pools', JSON.stringify(poolResults)); }, [poolResults]);
  useEffect(() => { localStorage.setItem('spinmatch_match_results', JSON.stringify(matchResults)); }, [matchResults]);
  useEffect(() => { localStorage.setItem('spinmatch_pool_rankings', JSON.stringify(poolRankings)); }, [poolRankings]);
  useEffect(() => { localStorage.setItem('spinmatch_knockout_results', JSON.stringify(knockoutResults)); }, [knockoutResults]);
  useEffect(() => { localStorage.setItem('spinmatch_knockout_prizes', JSON.stringify(knockoutPrizes)); }, [knockoutPrizes]);

  // Data undian dan skor online: Supabase adalah sumber bersama antar perangkat.
  // Jangan mengunggah cache lokal otomatis saat login (dapat menimpa data EO).
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const loadOnlineResults = async () => {
      const { data, error } = await supabase.from('spinmatch_event_data')
        .select('event_id, pool_results, match_results');
      if (cancelled) return;
      if (error) { console.error('Gagal membaca data undian/skor online:', error); return; }
      const onlinePools = {};
      const onlineMatches = {};
      const onlineLiveScores = {};
      (data || []).forEach(row => {
        if (row.pool_results && Object.keys(row.pool_results).length) {
          onlinePools[String(row.event_id)] = row.pool_results;
        }
        Object.entries(row.match_results || {}).forEach(([matchId, result]) => {
          if (result?.liveScore) onlineLiveScores[matchId] = result.liveScore;
          if (result && Object.keys(result).some(key => key !== 'liveScore')) {
            const savedResult = { ...result };
            delete savedResult.liveScore;
            onlineMatches[matchId] = savedResult;
          }
        });
      });
      // Data online didahulukan, cache lama tetap ada untuk migrasi pertama.
      setPoolResults(prev => ({ ...prev, ...onlinePools }));
      setMatchResults(prev => ({ ...prev, ...onlineMatches }));
      setOnlineLiveScores(prev => ({ ...prev, ...onlineLiveScores }));
    };
    loadOnlineResults();
    return () => { cancelled = true; };
  }, [user?.id]);

  const saveOnlinePool = async (eventId, poolData) => {
    const { data: existing, error: readError } = await supabase.from('spinmatch_event_data')
      .select('match_results').eq('event_id', Number(eventId)).maybeSingle();
    if (readError) throw readError;
    const { error } = await supabase.from('spinmatch_event_data').upsert({
      event_id: Number(eventId), pool_results: poolData,
      match_results: existing?.match_results || {}, updated_at: new Date().toISOString()
    }, { onConflict: 'event_id' });
    if (error) throw error;
  };

  const saveOnlineMatch = async (eventId, matchId, result) => {
    const { data: existing, error: readError } = await supabase.from('spinmatch_event_data')
      .select('pool_results, match_results').eq('event_id', Number(eventId)).maybeSingle();
    if (readError) throw readError;
    const nextMatches = { ...(existing?.match_results || {}) };
    if (result === null) delete nextMatches[matchId];
    else nextMatches[matchId] = {
      ...result,
      liveScore: {
        gameHistory: result.gameHistory || [],
        point1: Number(result.point1) || 0,
        point2: Number(result.point2) || 0,
        updatedAt: result.updatedAt || new Date().toISOString()
      }
    };
    const { error } = await supabase.from('spinmatch_event_data').upsert({
      event_id: Number(eventId), pool_results: existing?.pool_results || {},
      match_results: nextMatches, updated_at: new Date().toISOString()
    }, { onConflict: 'event_id' });
    if (error) throw error;
  };

  const saveOnlineLiveScore = async (eventId, matchId, liveScore) => {
    const { data: existing, error: readError } = await supabase.from('spinmatch_event_data')
      .select('pool_results, match_results').eq('event_id', Number(eventId)).maybeSingle();
    if (readError) throw readError;
    const nextMatches = { ...(existing?.match_results || {}) };
    nextMatches[matchId] = {
      ...(nextMatches[matchId] || {}),
      liveScore
    };
    const { error } = await supabase.from('spinmatch_event_data').upsert({
      event_id: Number(eventId),
      pool_results: existing?.pool_results || {},
      match_results: nextMatches,
      updated_at: new Date().toISOString()
    }, { onConflict: 'event_id' });
    if (error) throw error;
  };


  // ============================================
  // SUPABASE SYNC - EVENTS
  // Supabase menjadi sumber data bersama antar perangkat.
  // localStorage tetap dipertahankan sebagai cache/fallback lokal.
  // ============================================
  const eventFromSupabase = (row) => ({
    id: Number(row.id),
    nama: row.nama || '',
    tanggal: row.tanggal || '',
    status: row.status || 'Aktif',
    peserta: Number(row.peserta || 0),
    durasiMatch: row.durasimatch || '20 Menit',
    jamMulai: row.jammulai || '08:00',
    jamSelesai: row.jamselesai || '18:00',
    jumlahMeja: Number(row.jumlahmeja || row.jumlahMeja || 4),
    metodePengundian: row.metodeundian || 'PER_DIVISI',
    divisiList: Array.isArray(row.divisilist) ? row.divisilist : [],
    ownerId: String(row.eo_auth_id || row.owner_id || row.ownerid || row.created_by || row.owner || ''),
    ownerName: row.owner_name || row.ownername || row.eo_name || row.eo || '',
    lokasi: row.lokasi || row.location || '',
    contactPerson: row.contact_person || row.contactperson || row.kontak || ''
  });

  const eventToSupabase = (eventItem) => ({
    id: Number(eventItem.id),
    nama: eventItem.nama || '',
    tanggal: eventItem.tanggal || '',
    status: eventItem.status || 'Aktif',
    peserta: Number(eventItem.peserta || 0),
    durasimatch: eventItem.durasiMatch || '20 Menit',
    jammulai: eventItem.jamMulai || '08:00',
    jamselesai: eventItem.jamSelesai || '18:00',
    jumlahmeja: Math.max(1, Number(eventItem.jumlahMeja || 4)),
    metodeundian: eventItem.metodePengundian || 'PER_DIVISI',
    divisilist: Array.isArray(eventItem.divisiList) ? eventItem.divisiList : [],
    ...(eventItem.ownerId ? { eo_auth_id: eventItem.ownerId } : {})
  });


  // Hak akses event di sisi UI/handler. RLS Supabase tetap wajib sebagai lapisan keamanan server.
  const eventOwnerId = (eventItem) => String(eventItem?.ownerId || eventItem?.owner_id || eventItem?.ownerid || eventItem?.created_by || eventItem?.owner || '');
  const canManageEvent = (eventItem) => {
    if (isSuperAdmin) return true;
    if (!isEO || !eventItem || !currentUserId) return false;
    return eventOwnerId(eventItem) === currentUserId;
  };
  const myEvents = isSuperAdmin ? events : events.filter(canManageEvent);
  const guardPublicMutation = () => {
    if (!isPublic) return false;
    alert('Akun Public hanya dapat melihat data. Silakan pilih event melalui Semua Event.');
    return true;
  };

  useEffect(() => {
    let cancelled = false;

    const loadEventsFromSupabase = async () => {
      const { data, error } = await supabase
        .from('Events')
        .select('*')
        .order('id', { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error('❌ Gagal membaca Events dari Supabase:', error);
        return;
      }

      // Supabase adalah sumber data utama. Jika tabel online kosong,
      // state dan cache lokal juga harus kosong agar event lama tidak muncul kembali.
      if (Array.isArray(data) && data.length > 0) {
        const onlineEvents = data.map(eventFromSupabase);
        setEvents(onlineEvents);
        localStorage.setItem('spinmatch_events', JSON.stringify(onlineEvents));
        console.log(`✅ ${onlineEvents.length} Event dimuat dari Supabase`);
      } else {
        setEvents([]);
        localStorage.setItem('spinmatch_events', JSON.stringify([]));
        console.log('ℹ️ Tabel Events Supabase kosong; event lokal ikut dikosongkan.');
      }
    };

    loadEventsFromSupabase();
    return () => { cancelled = true; };
  }, []);

  // ============================================
  // SUPABASE SYNC - PARTICIPANTS
  // Supabase menjadi sumber data bersama antar perangkat.
  // localStorage tetap dipertahankan sebagai cache/fallback lokal.
  // ============================================
  const participantFromSupabase = (row) => ({
    id: Number(row.id),
    customId: row.custom_id || '',
    nama: row.nama || '',
    ptm: row.ptm || '',
    noTelp: row.notelp || '',
    divisi: row.divisi || '',
    statusBayar: row.statusbayar || 'Belum',
    nilaiBayar: Number(row.nilaibayar || 0),
    usia: Number(row.usia || 0)
  });

  useEffect(() => {
    let cancelled = false;

    const loadParticipantsFromSupabase = async () => {
      const { data, error } = await supabase
        .from('Participants')
        .select('*')
        .order('id', { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error('❌ Gagal membaca Participants dari Supabase:', error);
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        const groupedParticipants = {};

        data.forEach((row) => {
          const eventId = Number(row.event_id);
          if (!groupedParticipants[eventId]) groupedParticipants[eventId] = [];
          groupedParticipants[eventId].push(participantFromSupabase(row));
        });

        setParticipants(groupedParticipants);
        localStorage.setItem('spinmatch_participants', JSON.stringify(groupedParticipants));
        console.log(`✅ ${data.length} Participant dimuat dari Supabase`);
      } else {
        // Jangan hapus cache pemain hanya karena query Supabase mengembalikan 0 baris.
        // Bisa terjadi karena RLS, masalah sinkronisasi, atau data server belum dipulihkan.
        // Penghapusan pemain harus dilakukan melalui aksi hapus yang disengaja.
        console.warn('⚠️ Supabase mengembalikan 0 peserta. Cache lokal dipertahankan; periksa tabel Participants dan RLS.');
      }
    };

    loadParticipantsFromSupabase();
    return () => { cancelled = true; };
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [eventPaymentPreview, setEventPaymentPreview] = useState(null);
  const [eventPaymentBusy, setEventPaymentBusy] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [showSeedStatusList, setShowSeedStatusList] = useState(false);
  const [tempSeedData, setTempSeedData] = useState({ seed1: '', seed2: '', seed3: '', seed4: '' });
  const [showDrawAnimation, setShowDrawAnimation] = useState(false);
  const [drawPhase, setDrawPhase] = useState('idle');
  const [spinningNames, setSpinningNames] = useState(['', '', '', '']);
  const spinIntervalRef = useRef(null);

  const [formNama, setFormNama] = useState('');
  const [isMultiDate, setIsMultiDate] = useState(false);
  const [formSingleDate, setFormSingleDate] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formStatus, setFormStatus] = useState('Aktif');

  const [durasiMatch, setDurasiMatch] = useState('20 Menit');
  const [jamMulai, setJamMulai] = useState('08:00');
  const [jamSelesai, setJamSelesai] = useState('18:00');
  const [jumlahMeja, setJumlahMeja] = useState(4);
  const [metodePengundian, setMetodePengundian] = useState('PER_DIVISI');

  const [inputDivisi, setInputDivisi] = useState('');
  const [divisiList, setDivisiList] = useState([]);
  const [activeDivisiTab, setActiveDivisiTab] = useState(null);
  const [selectedDivisiForConfig, setSelectedDivisiForConfig] = useState(null);

  const [regNama, setRegNama] = useState('');
  const [regPtm, setRegPtm] = useState('');
  const [regNoTelp, setRegNoTelp] = useState('');
  const [regDivisi, setRegDivisi] = useState('');
  const [regUsia, setRegUsia] = useState('');
  const [regStatusBayar, setRegStatusBayar] = useState('Bayar');
  const [regNilaiBayar, setRegNilaiBayar] = useState(50000);

  const [showEditPlayerModal, setShowEditPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, player: null });

  const [simulationSaving, setSimulationSaving] = useState(false);
  const [showMatchResultModal, setShowMatchResultModal] = useState(false);
  const [ratioDetail, setRatioDetail] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showScheduleBreakEditor, setShowScheduleBreakEditor] = useState(false);
  const [showScheduleLegend, setShowScheduleLegend] = useState(false);
  const [printOrientation, setPrintOrientation] = useState('portrait');
  const [printPaperSize, setPrintPaperSize] = useState('A4');

  const [searchTerm, setSearchTerm] = useState('');

  const [liveScoreMatch, setLiveScoreMatch] = useState(null);
  const [livePlayer1Score, setLivePlayer1Score] = useState(0);
  const [livePlayer2Score, setLivePlayer2Score] = useState(0);
  const [livePoint1, setLivePoint1] = useState(0);
  const [livePoint2, setLivePoint2] = useState(0);
  const [liveWinner, setLiveWinner] = useState('');
  const [liveGameHistory, setLiveGameHistory] = useState([]);
  const [currentGameP1, setCurrentGameP1] = useState(0);
  const [currentGameP2, setCurrentGameP2] = useState(0);

  const [signatureWinner, setSignatureWinner] = useState('');
  const [signatureLoser, setSignatureLoser] = useState('');
  const [signatureReferee, setSignatureReferee] = useState('');

  // ============================================
  // STATE UNTUK FITUR SUARA & TAP (HANYA 1x)
  // ============================================
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const recognitionRef = useRef(null);
  const voiceCommandProcessedRef = useRef(false);
  const tapTimeoutRef = useRef(null);
  const liveMatchPlayersRef = useRef(null);
  // Set aktif untuk input suara: 0=Set 1, 1=Set 2, dst.
  // Ref dipakai agar perubahan langsung tersedia tanpa menunggu render React.
  const activeVoiceSetRef = useRef(0);
  const [activeVoiceSet, setActiveVoiceSet] = useState(0);

  // Event terpilih harus didefinisikan sebelum dipakai oleh dependency useEffect.
  const selectedEventItem = events.find(e => String(e.id) === String(selectedEventIdForReg));
  const selectedDrawEvent = events.find(e => String(e.id) === String(selectedEventIdForDraw));
  const selectedScheduleEvent = events.find(e => String(e.id) === String(selectedEventIdForSchedule));
  const selectedLiveEvent = events.find(e => String(e.id) === String(selectedEventIdForLive) && (!isWasit || String(e.id) === String(wasitAssignment?.event_id)));
  const selectedKnockoutEvent = events.find(e => String(e.id) === String(selectedEventIdForKnockout));

  useEffect(() => {
    if (isPublic || !liveScoreMatch?.matchId || !selectedLiveEvent?.id) return undefined;

    const timeout = window.setTimeout(() => {
      const snapshot = {
        gameHistory: liveGameHistory,
        point1: Number(livePoint1) || 0,
        point2: Number(livePoint2) || 0,
        updatedAt: new Date().toISOString()
      };
      setOnlineLiveScores(previous => ({
        ...previous,
        [liveScoreMatch.matchId]: snapshot
      }));
      saveOnlineLiveScore(selectedLiveEvent.id, liveScoreMatch.matchId, snapshot)
        .catch(error => console.error('Gagal menyinkronkan skor berjalan:', error));
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [isPublic, liveScoreMatch?.matchId, selectedLiveEvent?.id, liveGameHistory, livePoint1, livePoint2]);

  useEffect(() => {
    if (
      !isPublic ||
      !selectedLiveEvent?.id ||
      (activeView !== 'LIVE_SCORE' && !liveScoreMatch)
    ) return undefined;

    let cancelled = false;
    const refreshPublicLiveScores = async () => {
      const { data, error } = await supabase
        .from('spinmatch_event_data')
        .select('match_results')
        .eq('event_id', Number(selectedLiveEvent.id))
        .maybeSingle();

      if (cancelled) return;
      if (error) {
        console.error('Gagal memuat skor berjalan untuk Publik:', error);
        return;
      }

      const refreshedScores = {};
      Object.entries(data?.match_results || {}).forEach(([matchId, result]) => {
        if (result?.liveScore) refreshedScores[matchId] = result.liveScore;
      });
      setOnlineLiveScores(previous => ({ ...previous, ...refreshedScores }));
    };

    refreshPublicLiveScores();
    const interval = window.setInterval(refreshPublicLiveScores, 1500);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isPublic, selectedLiveEvent?.id, activeView, liveScoreMatch?.matchId]);

  // Update ref pemain live. Hook tetap dipanggil pada setiap render.
  useEffect(() => {
    if (!user) {
      liveMatchPlayersRef.current = null;
      return;
    }
    if (liveScoreMatch && selectedLiveEvent?.id) {
      const players = getLiveMatchPlayers(liveScoreMatch, selectedLiveEvent.id);
      liveMatchPlayersRef.current = players;
    } else {
      liveMatchPlayersRef.current = null;
    }
  }, [user, liveScoreMatch, selectedLiveEvent?.id]);

  // Inisialisasi Web Speech API
  useEffect(() => {
    if (!user) return;
    console.log('=== CEK DUKUNGAN SPEECH API ===');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'id-ID';
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onstart = () => {
          console.log(' Mikrofon aktif');
          voiceCommandProcessedRef.current = false;
          setIsListening(true);
          setVoiceStatus('Mendengarkan...');
        };

        recognitionRef.current.onresult = (event) => {
          if (voiceCommandProcessedRef.current) return;

          const result = event.results?.[event.results.length - 1];
          const transcript = String(result?.[0]?.transcript || '').trim();
          const isFinal = Boolean(result?.isFinal);

          if (!transcript) return;

          console.log(`🎤 ${isFinal ? 'Final' : 'Interim'}:`, transcript);

          // FAST PATH:
          // Jangan menunggu browser mengubah transcript menjadi final bila kalimat
          // sementara sudah merupakan perintah lengkap yang valid.
          const normalized = transcript
            .toLowerCase()
            .replace(/[.,!?;:]/g, ' ')
            .replace(/set\s*[-–—]\s*/g, 'set ')
            .replace(/set\s+ke\s*[-–—]\s*/g, 'set ke ')
            .replace(/\s+/g, ' ')
            .trim();

          const setReady = /^set\s+(?:ke\s*[-]?\s*)?(1|2|3|4|5|satu|dua|tiga|empat|lima|kesatu|kedua|ketiga|keempat|kelima|pertama)$/.test(normalized);

          const players = liveMatchPlayersRef.current || {};
          const p1 = getVoicePlayerName(players.player1?.nama || '');
          const p2 = getVoicePlayerName(players.player2?.nama || '');
          const p1Tokens = getVoiceNameTokens(p1);
          const p2Tokens = getVoiceNameTokens(p2);

          const transcriptHasName = (name, tokens) => {
            if (!name) return false;
            if (normalized === name || normalized.startsWith(`${name} `) || normalized.includes(` ${name} `)) return true;
            return tokens.some(token =>
              normalized === token ||
              normalized.startsWith(`${token} `) ||
              normalized.includes(` ${token} `)
            );
          };

          const hasPlayer = transcriptHasName(p1, p1Tokens) || transcriptHasName(p2, p2Tokens);

          const hasScore =
            /\b\d{1,2}\b/.test(normalized) ||
            /\b(nol|kosong|satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan|sepuluh|sebelas|dua belas|tiga belas|empat belas|lima belas|enam belas|enambelas|tujuh belas|delapan belas|sembilan belas|dua puluh|duapuluh|dua puluh satu|dua puluh dua|dua puluh tiga|dua puluh empat|dua puluh lima)\b/.test(normalized);

          const scoreReady = hasPlayer && hasScore;

          // Eksekusi secepat transcript sudah lengkap.
          // Final tetap menjadi fallback bila interim belum cukup jelas.
          if (setReady || scoreReady || isFinal) {
            voiceCommandProcessedRef.current = true;
            processVoiceCommand(transcript);

            // Stop segera setelah perintah diterima supaya UI langsung siap.
            try { recognitionRef.current?.stop?.(); } catch (_) {}
          }
        };

        recognitionRef.current.onerror = (event) => {
          if (event.error === 'aborted') {
            console.log('ℹ️ Speech Recognition dihentikan');
          } else {
            console.error('❌ Error:', event.error);
          }
          setIsListening(false);

          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setVoiceStatus('Izin mikrofon ditolak!');
            alert('Izin mikrofon ditolak. Silakan izinkan akses mikrofon di browser Anda.');
          } else if (event.error === 'no-speech') {
            setVoiceStatus('Tidak ada suara terdeteksi. Klik mikrofon lalu coba lagi.');
          } else if (event.error === 'audio-capture') {
            setVoiceStatus('Mikrofon tidak dapat digunakan. Periksa perangkat mikrofon.');
          } else if (event.error === 'network') {
            setVoiceStatus('Speech Recognition gagal terhubung ke layanan suara.');
          } else if (event.error === 'aborted') {
            setVoiceStatus('Mikrofon dimatikan');
          } else {
            setVoiceStatus(`Error suara: ${event.error}`);
          }
        };

        recognitionRef.current.onend = () => {
          console.log(' Recognition ended');
          setIsListening(false);
        };

        console.log('✅ Speech Recognition siap');
      } catch (error) {
        console.error('❌ Gagal init:', error);
        setVoiceStatus('Gagal inisialisasi voice');
      }
    } else {
      console.error('❌ Browser tidak support Speech Recognition');
      setVoiceStatus('Browser tidak support voice');
    }
    return () => {
      try { recognitionRef.current?.stop?.(); } catch (e) { /* abaikan cleanup */ }
      recognitionRef.current = null;
    };
  }, [user]);

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      alert('Browser tidak mendukung input suara. Gunakan Chrome/Edge.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      setIsListening(false);
      setVoiceStatus('Mikrofon dimatikan');
      return;
    }

    // Mulai langsung tanpa delay 100ms dan tanpa menunggu permission query.
    // Browser tetap akan meminta izin mikrofon sendiri jika memang diperlukan.
    try {
      voiceCommandProcessedRef.current = false;
      setVoiceStatus('Mendengarkan...');
      recognitionRef.current.start();
    } catch (e) {
      console.error('❌ Gagal memulai mikrofon:', e);
      setIsListening(false);
      setVoiceStatus('Mikrofon masih sibuk. Klik lagi.');
    }
  };

  // Nama untuk voice: abaikan prefix Pool, mis. "Pool B - Joko Pratama" -> "Joko Pratama".
  const getVoicePlayerName = (name) => {
    return String(name || '')
      .toLowerCase()
      .replace(/^\s*pool\s+[a-z0-9]+\s*[-–—:]\s*/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Cocokkan nama lengkap, nama depan, nama belakang, atau satu bagian nama yang unik.
  const getVoiceNameTokens = (name) => {
    const clean = getVoicePlayerName(name);
    return clean ? clean.split(/\s+/).filter(Boolean) : [];
  };

  const voiceNameMatches = (spoken, playerName) => {
    const cleanSpoken = String(spoken || '').toLowerCase().replace(/\s+/g, ' ').trim();
    const cleanName = getVoicePlayerName(playerName);
    if (!cleanSpoken || !cleanName) return false;
    if (cleanSpoken === cleanName) return true;
    const tokens = getVoiceNameTokens(cleanName);
    if (tokens.includes(cleanSpoken)) return true;
    return cleanName.includes(cleanSpoken) || cleanSpoken.includes(cleanName);
  };

  const processVoiceCommand = (text) => {
    const rawText = String(text || '').toLowerCase().trim();
    // Normalisasi hasil Speech Recognition: buang tanda baca dan rapikan spasi.
    // Contoh "Set 2.", "set ke dua", "set kedua" tetap dikenali sebagai perintah pindah set.
    const lowerText = rawText
      .replace(/[.,!?;:]/g, ' ')
      .replace(/set\s*[-–—]\s*/g, 'set ')
      .replace(/set\s+ke\s*[-–—]\s*/g, 'set ke ')
      .replace(/\s+/g, ' ')
      .trim();
    console.log('=== PROCESS VOICE COMMAND ===');
    console.log('Input:', lowerText);

    if (!lowerText) {
      setVoiceStatus('Suara belum terbaca. Klik mikrofon lalu coba lagi.');
      return;
    }

    const angkaMap = {
      'nol': 0, 'kosong': 0,
      'satu': 1, 'dua': 2, 'tiga': 3, 'empat': 4, 'lima': 5,
      'enam': 6, 'tujuh': 7, 'delapan': 8, 'sembilan': 9, 'sepuluh': 10,
      'sebelas': 11, 'dua belas': 12, 'tiga belas': 13, 'empat belas': 14,
      'lima belas': 15, 'enam belas': 16, 'enambelas': 16, 'tujuh belas': 17,
      'delapan belas': 18, 'sembilan belas': 19, 'dua puluh': 20, 'duapuluh': 20,
      'dua puluh satu': 21, 'dua puluh dua': 22, 'dua puluh tiga': 23,
      'dua puluh empat': 24, 'dua puluh lima': 25
    };

    const parseNumber = (value) => {
      const clean = String(value || '').toLowerCase().trim();
      if (/^\d+$/.test(clean)) return Number(clean);
      return Object.prototype.hasOwnProperty.call(angkaMap, clean) ? angkaMap[clean] : null;
    };

    // PERINTAH PINDAH SET.
    // Cukup disebut SATU KALI. Setelah itu semua skor tetap masuk ke set tersebut
    // sampai wasit mengucapkan perintah set berikutnya.
    const setAlias = {
      '1': 1, 'satu': 1, 'kesatu': 1, 'pertama': 1,
      '2': 2, 'dua': 2, 'kedua': 2,
      '3': 3, 'tiga': 3, 'ketiga': 3,
      '4': 4, 'empat': 4, 'keempat': 4,
      '5': 5, 'lima': 5, 'kelima': 5
    };

    // Terima: "set 2", "set dua", "set ke dua", "set kedua", "set ke-2".
    // Perintah SET diperiksa SEBELUM angka skor agar angka 2 tidak pernah
    // dianggap sebagai poin pemain pada Set 1.
    const setCommand = lowerText.match(
      /^set\s+(?:ke\s*)?(1|2|3|4|5|satu|dua|tiga|empat|lima|kesatu|kedua|ketiga|keempat|kelima|pertama)$/
    );

    if (setCommand) {
      const token = setCommand[1];
      const setNo = setAlias[token];

      if (setNo >= 1 && setNo <= 5) {
        const idx = setNo - 1;
        activeVoiceSetRef.current = idx;
        setActiveVoiceSet(idx);
        setVoiceStatus(`SET ${setNo} AKTIF`);
        console.log(`✅ PINDAH SET: semua poin berikutnya masuk SET ${setNo}`);
      }
      return;
    }

    // Jika kalimat diawali kata "set" tetapi formatnya belum dikenali,
    // JANGAN pernah memproses angkanya sebagai skor.
    if (/^set\b/.test(lowerText)) {
      setVoiceStatus(`Perintah set belum dikenali. Ucapkan: "Set dua"`);
      console.log('⚠️ Perintah SET tidak dikenali, skor tidak diubah:', lowerText);
      return;
    }

    const currentPlayers = liveMatchPlayersRef.current || {};
    const p1RawName = currentPlayers.player1?.nama || '';
    const p2RawName = currentPlayers.player2?.nama || '';
    const p1Name = getVoicePlayerName(p1RawName);
    const p2Name = getVoicePlayerName(p2RawName);
    const p1First = getVoiceNameTokens(p1RawName)[0] || '';
    const p2First = getVoiceNameTokens(p2RawName)[0] || '';

    if (!p1Name || !p2Name) {
      setVoiceStatus('Data pemain belum siap.');
      return;
    }

    // Cari angka dari ujung kalimat. Frasa panjang dicek lebih dulu.
    const numberWords = Object.keys(angkaMap).sort((a, b) => b.length - a.length);
    let scoreValue = null;
    let numberToken = '';

    const digitMatch = lowerText.match(/\b(\d{1,2})\b/);
    if (digitMatch) {
      scoreValue = Number(digitMatch[1]);
      numberToken = digitMatch[0];
    } else {
      for (const word of numberWords) {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp(`(?:^|\\s)${escaped}(?:$|\\s)`, 'i').test(lowerText)) {
          scoreValue = angkaMap[word];
          numberToken = word;
          break;
        }
      }
    }

    if (scoreValue === null) {
      setVoiceStatus(`Angka tidak dikenali. Contoh: "${p1First} sebelas"`);
      return;
    }

    // Hilangkan kata-kata perintah agar tersisa bagian nama pemain.
    let namePart = lowerText;
    if (numberToken) {
      const escaped = numberToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      namePart = namePart.replace(new RegExp(`\\b${escaped}\\b`, 'i'), ' ');
    }
    namePart = namePart
      .replace(/\b(point|poin|poinnya|skor|nilai|untuk|tambah|jadi)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    let targetPlayer = null;
    let displayName = '';

    const p1Matched = voiceNameMatches(namePart, p1RawName);
    const p2Matched = voiceNameMatches(namePart, p2RawName);

    // Jika satu sebutan cocok ke kedua pemain (mis. keduanya sama-sama "Pratama"),
    // jangan menebak agar skor tidak masuk ke pemain yang salah.
    if (p1Matched && p2Matched) {
      setVoiceStatus(`Nama "${namePart}" ada pada kedua pemain. Sebut nama yang lebih spesifik.`);
      return;
    }

    if (p1Matched) {
      targetPlayer = 'p1';
      displayName = p1Name || p1First;
    } else if (p2Matched) {
      targetPlayer = 'p2';
      displayName = p2Name || p2First;
    }

    if (!targetPlayer) {
      setVoiceStatus(`Nama tidak dikenali. Coba "${p1First} ${scoreValue}" atau "${p2First} ${scoreValue}"`);
      return;
    }

    const setIndex = activeVoiceSetRef.current;

    // Update langsung pada Set aktif. Tidak mencari kolom kosong lain.
    setLiveGameHistory(prev => {
      const next = Array.from({ length: Math.max(5, prev.length) }, (_, i) =>
        prev[i] ? { ...prev[i] } : { p1: '', p2: '' }
      );
      next[setIndex] = {
        ...(next[setIndex] || { p1: '', p2: '' }),
        [targetPlayer]: scoreValue
      };
      return next;
    });

    // Feedback dibuat segera setelah transcript diproses.
    setVoiceStatus(`SET ${setIndex + 1} • ${displayName}: ${scoreValue}`);
    console.log(`✅ SET ${setIndex + 1} | ${displayName} = ${scoreValue}`);
  };

  const handleScoreTap = (setIndex, player, isDoubleTap) => {
    setLiveGameHistory(prev => {
      const newHistory = [...prev];
      const currentSet = newHistory[setIndex] || { p1: 0, p2: 0 };
      let currentVal = parseInt(currentSet[player]) || 0;
      if (isDoubleTap) {
        currentVal = Math.max(0, currentVal - 1);
      } else {
        currentVal = currentVal + 1;
      }
      newHistory[setIndex] = { ...currentSet, [player]: currentVal };
      return newHistory;
    });
  };

  const cancelPendingScoreTap = () => {
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = null;
    }
  };

  const handleTapInteraction = (setIndex, player) => {
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = null;
      handleScoreTap(setIndex, player, true);
    } else {
      tapTimeoutRef.current = setTimeout(() => {
        handleScoreTap(setIndex, player, false);
        tapTimeoutRef.current = null;
      }, 250);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(prev => ({ ...prev, visible: false }));
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user || !isPublic) return;
    const publicAllowedViews = ['DASHBOARD', 'SCHEDULE', 'LIVE_SCORE', 'RANKING', 'KNOCKOUT'];
    if (!publicAllowedViews.includes(activeView)) setActiveView('DASHBOARD');
  }, [user, isPublic, activeView]);

  useEffect(() => {
    if (!user) return;
    const preferredEvent = events.find(eventItem =>
      String(eventItem.id) === String(selectedDashboardEventId || publicViewedEventId)
    ) || events.find(eventItem => String(eventItem.status || '').toLowerCase() === 'aktif') || events[0];
    const defaultEventId = isWasit
      ? String(wasitAssignment?.event_id || preferredEvent?.id || '')
      : String(preferredEvent?.id || '');
    if (activeView === 'REGISTRATION' && !selectedEventIdForReg && events.length > 0) {
      setSelectedEventIdForReg(defaultEventId);
    }
    if (activeView === 'DRAW' && !selectedEventIdForDraw && events.length > 0) {
      setSelectedEventIdForDraw(defaultEventId);
    }
    if (activeView === 'SCHEDULE' && !selectedEventIdForSchedule && events.length > 0) {
      setSelectedEventIdForSchedule(defaultEventId);
    }
    if (!isWasit && activeView === 'LIVE_SCORE' && !selectedEventIdForLive && events.length > 0) {
      setSelectedEventIdForLive(defaultEventId);
    }
    if (activeView === 'KNOCKOUT' && !selectedEventIdForKnockout && events.length > 0) {
      setSelectedEventIdForKnockout(defaultEventId);
    }
    if (activeView === 'RANKING' && !selectedEventIdForRanking && events.length > 0) {
      setSelectedEventIdForRanking(defaultEventId);
    }
    if (activeView === 'SETTINGS' && !selectedEventIdForSettings && events.length > 0) {
      setSelectedEventIdForSettings(defaultEventId);
    }
  }, [user, activeView, events, isWasit, wasitAssignment?.event_id, selectedDashboardEventId, publicViewedEventId, selectedEventIdForReg, selectedEventIdForDraw, selectedEventIdForSchedule, selectedEventIdForLive, selectedEventIdForKnockout]);

  useEffect(() => {
    if (!selectedScheduleEvent?.id || !poolResults[selectedScheduleEvent.id]) return;

    // Perbarui ulang status Lolos sesuai aturan Event aktif.
    // Tidak mengubah skor/match; hanya ranking/keterangan.
    calculatePoolRankings(selectedScheduleEvent.id);
  }, [selectedScheduleEvent?.id, matchResults, poolResults]);

  // ============================================
  // MIGRASI MASTER WASIT - HOOK WAJIB SEBELUM CONDITIONAL RETURN LOGIN
  // ============================================
  // Migrasi kompatibilitas: versi lama pernah menyimpan nama wasit pada
  // penugasan meja tanpa ID WST. Sekali jalan, nama lama dibuatkan Master
  // Wasit dan assignment diperbarui agar dropdown, nama, status, dan aksi sinkron.
  useEffect(() => {
    const registry = Array.isArray(refereeRegistry) ? [...refereeRegistry] : [];
    const assignments = refereeAssignments && typeof refereeAssignments === 'object'
      ? JSON.parse(JSON.stringify(refereeAssignments))
      : {};

    let changedRegistry = false;
    let changedAssignments = false;

    const normalizeName = (v) => String(v || '').trim().toLowerCase();
    const usedNumbers = registry
      .map(r => Number(String(r.id || '').replace(/\D/g, '')))
      .filter(n => Number.isFinite(n) && n > 0);
    let nextNumber = usedNumbers.length ? Math.max(...usedNumbers) + 1 : 1;

    const getOrCreateReferee = (name) => {
      const cleanName = String(name || '').trim();
      if (!cleanName) return null;

      let found = registry.find(r => normalizeName(r.nama) === normalizeName(cleanName));
      if (found) return found;

      found = {
        id: `WST-${String(nextNumber++).padStart(4, '0')}`,
        nama: cleanName,
        status: 'AKTIF',
        createdAt: new Date().toISOString(),
        migratedFromLegacy: true
      };
      registry.push(found);
      changedRegistry = true;
      return found;
    };

    Object.keys(assignments).forEach(eventKey => {
      const tables = assignments[eventKey];
      if (!tables || typeof tables !== 'object') return;

      Object.keys(tables).forEach(tableKey => {
        const a = tables[tableKey];
        if (!a || typeof a !== 'object') return;

        // Sudah punya ID valid di registry -> sinkronkan nama/status terbaru.
        if (a.refereeId) {
          const registered = registry.find(r => r.id === a.refereeId);
          if (registered) {
            if (a.refereeName !== registered.nama || a.status !== registered.status) {
              assignments[eventKey][tableKey] = {
                ...a,
                refereeName: registered.nama,
                status: registered.status
              };
              changedAssignments = true;
            }
            return;
          }
        }

        // Assignment legacy: nama ada tetapi ID kosong/tidak dikenal.
        if (a.refereeName) {
          const ref = getOrCreateReferee(a.refereeName);
          if (ref) {
            assignments[eventKey][tableKey] = {
              ...a,
              refereeId: ref.id,
              refereeName: ref.nama,
              status: ref.status
            };
            changedAssignments = true;
          }
        }
      });
    });

    if (changedRegistry) {
      localStorage.setItem('spinmatch_referee_registry', JSON.stringify(registry));
      setRefereeRegistry(registry);
    }
    if (changedAssignments) {
      localStorage.setItem('spinmatch_referee_assignments', JSON.stringify(assignments));
      setRefereeAssignments(assignments);
    }
  }, []);

  // Otomatis tentukan pemenang dari jumlah SET yang dimenangkan.
  // Hook harus berada sebelum conditional return login agar urutan Hooks selalu konsisten.
  useEffect(() => {
    if (!liveScoreMatch) return;

    const score = liveGameHistory.reduce(
      (acc, game) => {
        const p1 = Number(game?.p1 || 0);
        const p2 = Number(game?.p2 || 0);
        if (p1 > p2) acc.player1 += 1;
        if (p2 > p1) acc.player2 += 1;
        return acc;
      },
      { player1: 0, player2: 0 }
    );

    if (score.player1 > score.player2) setLiveWinner('player1');
    else if (score.player2 > score.player1) setLiveWinner('player2');
    else setLiveWinner('');
  }, [liveScoreMatch, liveGameHistory]);

  // AuthenticatedContent hanya dipasang ketika user sudah tersedia.

  const generateCustomId = (divisiName, existingList = []) => {
    const currentYearShort = String(new Date().getFullYear()).slice(-2);
    let divCode = 'GEN';
    if (divisiName) {
      const cleanName = divisiName.trim();
      if (cleanName.toLowerCase().startsWith('divisi')) {
        const numPart = cleanName.replace(/[^0-9]/g, '');
        divCode = `D${numPart || '1'}`;
      } else if (cleanName.toLowerCase().startsWith('u')) {
        const numPart = cleanName.replace(/[^0-9]/g, '');
        divCode = `U${numPart}`;
      } else {
        divCode = cleanName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3);
      }
    }
    const prefix = `${divCode}-${currentYearShort}`;
    let maxSeq = 0;
    existingList.forEach(p => {
      if (p.customId && p.customId.startsWith(prefix)) {
        const seqPart = parseInt(p.customId.split('-')[1]?.slice(2) || '0', 10);
        if (seqPart > maxSeq) maxSeq = seqPart;
      }
    });
    const nextSeq = maxSeq + 1;
    return `${prefix}${String(nextSeq).padStart(4, '0')}`;
  };

  // Tanggal form selalu disimpan sebagai YYYY-MM-DD agar aman untuk <input type="date">.
  // Format Indonesia hanya dibuat saat data Event akan disimpan/ditampilkan.
  const formatEventDate = (isoDate) => {
    if (!isoDate) return '';
    const [year, month, day] = String(isoDate).split('-').map(Number);
    if (!year || !month || !day) return String(isoDate);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${day} ${monthNames[month - 1]} ${year}`;
  };

  const eventDateToInputValue = (dateText) => {
    const value = String(dateText || '').trim();
    if (!value) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    const monthMap = {
      jan: 1, januari: 1,
      feb: 2, februari: 2,
      mar: 3, maret: 3,
      apr: 4, april: 4,
      mei: 5, may: 5,
      jun: 6, juni: 6,
      jul: 7, juli: 7,
      agu: 8, agt: 8, agustus: 8, aug: 8,
      sep: 9, sept: 9, september: 9,
      okt: 10, oktober: 10, oct: 10,
      nov: 11, november: 11,
      des: 12, desember: 12, dec: 12
    };

    const match = value.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (!match) return '';
    const day = Number(match[1]);
    const month = monthMap[match[2].toLowerCase()];
    const year = Number(match[3]);
    if (!day || !month || !year) return '';
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const handleOpenCreate = () => {
    if (isWasit || isPublic) { alert('Hanya EO atau Super Admin yang boleh membuat event.'); return; }
    if (isPublic) { alert('Akun Public tidak dapat membuat event. Silakan pilih Semua Event.'); return; }
    if (!isEO && !isSuperAdmin) { alert('Hanya akun EO atau Super Admin yang dapat membuat event.'); return; }
    setIsEditMode(false);
    setEventPaymentPreview(null); // Jangan membawa tagihan event sebelumnya.
    setFormNama('');
    setIsMultiDate(false);
    setFormSingleDate('');
    setFormStartDate('');
    setFormEndDate('');
    setFormStatus('Aktif');
    setDurasiMatch('20 Menit');
    setJamMulai('08:00');
    setJamSelesai('18:00');
    setJumlahMeja(4);
    setMetodePengundian('PER_DIVISI');
    setDivisiList([]);
    setActiveDivisiTab(null);
    setSelectedDivisiForConfig(null);
    setShowModal(true);
  };

  const handleRowClick = (eventItem) => {
    if (!canManageEvent(eventItem)) { alert('Event ini hanya dapat diedit oleh EO pemilik event atau Super Admin.'); return; }
    setIsEditMode(true);
    setEventPaymentPreview(null);
    setFormNama(eventItem.nama);
    setFormStatus(eventItem.status);
    if (eventItem.tanggal.includes('sd') || eventItem.tanggal.includes('-')) {
      setIsMultiDate(true);
      const dates = eventItem.tanggal.replace('Dari Tanggal ', '').split(' sd ');
      setFormStartDate(eventDateToInputValue(dates[0] || ''));
      setFormEndDate(eventDateToInputValue(dates[1] || ''));
    } else {
      setIsMultiDate(false);
      setFormSingleDate(eventDateToInputValue(eventItem.tanggal.replace('Dari Tanggal ', '')));
    }
    setDurasiMatch(eventItem.durasiMatch || '20 Menit');
    setJamMulai(eventItem.jamMulai || '08:00');
    setJamSelesai(eventItem.jamSelesai || '18:00');
    setJumlahMeja(Math.max(1, Number(eventItem.jumlahMeja || eventItem.jumlahmeja || 4)));
    setMetodePengundian(eventItem.metodePengundian || 'PER_DIVISI');
    setDivisiList(eventItem.divisiList ? [...eventItem.divisiList] : []);
    setActiveDivisiTab(eventItem.divisiList?.[0]?.nama || null);
    setSelectedDivisiForConfig(null);
    setSelectedEventIdForReg(String(eventItem.id));
    setShowModal(true);
  };

  const handleAddDivisi = () => {
    if (!inputDivisi.trim()) return;
    if (divisiList.some(d => d.nama.toLowerCase() === inputDivisi.trim().toLowerCase())) {
      alert('Divisi sudah ada!');
      return;
    }
    const newDivisi = {
      nama: inputDivisi.trim(),
      sistemMatch: 'Best of 5',
      jumlahPool: '1 Pool isi 3 Orang',
      lolosPool: '2 Pemain'
    };
    setDivisiList([...divisiList, newDivisi]);
    setActiveDivisiTab(newDivisi.nama);
    setSelectedDivisiForConfig(newDivisi.nama);
    setInputDivisi('');
  };

  const handleRemoveDivisi = (divisiNama) => {
    const updated = divisiList.filter(d => d.nama !== divisiNama);
    setDivisiList(updated);
    if (activeDivisiTab === divisiNama) {
      setActiveDivisiTab(updated.length > 0 ? updated[0].nama : null);
    }
    if (selectedDivisiForConfig === divisiNama) {
      setSelectedDivisiForConfig(null);
    }
  };

  const handleDivisiConfigChange = (divisiNama, field, value) => {
    const updated = divisiList.map(d =>
      d.nama === divisiNama ? { ...d, [field]: value } : d
    );
    setDivisiList(updated);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (guardPublicMutation()) return;
    if (!isEO && !isSuperAdmin) { alert('Akses ditolak.'); return; }
    if (eventPaymentBusy) return;
    const formattedTanggal = isMultiDate
      ? `Dari Tanggal ${formatEventDate(formStartDate)} sd ${formatEventDate(formEndDate)}`
      : formatEventDate(formSingleDate);

    if (isEditMode && selectedEventIdForReg) {
      const eventId = Number(selectedEventIdForReg);
      const currentEvent = events.find(ev => Number(ev.id) === eventId);
      if (!currentEvent) return;
      if (!canManageEvent(currentEvent)) { alert('Anda tidak dapat mengubah event milik EO lain.'); return; }

      const updatedEvent = {
        ...currentEvent,
        nama: formNama,
        tanggal: formattedTanggal,
        // EO tidak boleh mengaktifkan sendiri event yang masih menunggu pembayaran.
        status: isSuperAdmin ? formStatus : currentEvent.status,
        durasiMatch,
        jamMulai,
        jamSelesai,
        jumlahMeja: Math.max(1, Number(jumlahMeja || 4)),
        metodePengundian,
        divisiList
      };

      // UPDATE tidak boleh dianggap berhasil hanya karena error=null.
      // Jika RLS menolak baris, Supabase bisa mengembalikan [] tanpa error.
      const payload = eventToSupabase(updatedEvent);
      delete payload.id; // primary key tidak perlu diubah
      const { data: savedRows, error } = await supabase
        .from('Events')
        .update(payload)
        .eq('id', eventId)
        .select('*');

      if (error || !Array.isArray(savedRows) || savedRows.length !== 1) {
        console.error('❌ UPDATE Events tidak terkonfirmasi:', { error, savedRows, eventId });
        alert(error
          ? `Event gagal disimpan ke Supabase: ${error.message}`
          : 'Perubahan belum tersimpan di Supabase. Izin UPDATE/RLS mungkin belum aktif atau event belum memiliki EO pemilik. Data lama tidak diubah.');
        return;
      }

      // Gunakan hasil server, bukan asumsi bahwa data lokal sudah tersimpan.
      const confirmedEvent = eventFromSupabase(savedRows[0]);
      const updatedEvents = events.map(ev => Number(ev.id) === eventId ? confirmedEvent : ev);
      setEvents(updatedEvents);
      localStorage.setItem('spinmatch_events', JSON.stringify(updatedEvents));
      alert('Event berhasil diperbarui dan disimpan');
    } else {
      // EO wajib melihat tarif yang sedang berlaku sebelum event dibuat.
      if (isEO && !eventPaymentPreview) {
        setEventPaymentBusy(true);
        try {
          const { data: cfg, error: cfgError } = await supabase.from('spinmatch_pricing_settings').select('*').eq('id', 1).single();
          if (cfgError || !cfg) throw new Error(cfgError?.message || 'Tarif Super Admin belum tersedia.');
          const now = new Date();
          const promoStart = cfg.public_promo_start ? new Date(cfg.public_promo_start) : null;
          const promoEnd = cfg.public_promo_end ? new Date(cfg.public_promo_end) : null;
          const promoActive = !!cfg.public_promo_enabled && (!promoStart || now >= promoStart) && (!promoEnd || now <= promoEnd);
          let price = Number(promoActive ? cfg.public_promo_price : cfg.standard_price);
          let category = promoActive ? 'Tarif Promosi' : 'Tarif Normal';
          const { data: rules, error: rulesError } = await supabase.from('spinmatch_eo_pricing').select('*').eq('eo_auth_id', currentUserId).eq('enabled', true).order('created_at', { ascending: false }).limit(1);
          if (rulesError) throw rulesError;
          if (rules?.length) {
            price = Number(rules[0].price_per_event);
            category = 'Tarif Khusus EO';
          }
          if (!Number.isInteger(price) || price < 0) throw new Error('Nominal tarif harus bilangan bulat minimal Rp0.');
          setEventPaymentPreview({ price, category, bank: cfg.payment_bank || '', account: cfg.payment_account_number || '', holder: cfg.payment_account_name || '', whatsapp: cfg.payment_whatsapp || '' });
        } catch (err) {
          alert(`Tarif belum bisa ditampilkan: ${err.message}. Event belum dibuat.`);
        } finally { setEventPaymentBusy(false); }
        return;
      }
      // Nilai 0 adalah harga akhir GRATIS, bukan potongan.
      // Konversi eksplisit mencegah angka 0 berbentuk string dianggap berbayar.
      const payableAmount = Number(eventPaymentPreview?.price);
      if (isEO && (!Number.isInteger(payableAmount) || payableAmount < 0)) {
        alert('Tarif tidak valid. Silakan kembali dan muat ulang tarif.');
        setEventPaymentPreview(null);
        return;
      }
      const isFreeEvent = isEO && payableAmount === 0;
      const newEvent = {
        id: Date.now(),
        nama: formNama,
        tanggal: formattedTanggal,
        // Status pembayaran harus dikendalikan oleh verifikasi server sebelum produksi.
        status: isEO ? (isFreeEvent ? 'Aktif' : 'Menunggu Pembayaran') : formStatus,
        peserta: 0,
        durasiMatch,
        jamMulai,
        jamSelesai,
        jumlahMeja: Math.max(1, Number(jumlahMeja || 4)),
        metodePengundian,
        divisiList,
        ownerId: currentUserId,
        ownerName: currentUserName
      };

      setEventPaymentBusy(true);
      const { data: insertedRows, error } = await supabase
        .from('Events')
        .insert(eventToSupabase(newEvent)).select('*');
      setEventPaymentBusy(false);

      if (error) {
        console.error('❌ Gagal membuat Event di Supabase:', error);
        alert(`Event belum tersimpan ke Supabase: ${error.message}`);
        return;
      }

      const confirmedEvent = insertedRows?.[0] ? eventFromSupabase(insertedRows[0]) : newEvent;
      const updatedEvents = [...events, confirmedEvent];
      setEvents(updatedEvents);
      localStorage.setItem('spinmatch_events', JSON.stringify(updatedEvents));
      alert(isEO ? (isFreeEvent ? 'Event GRATIS berhasil dibuat dan langsung aktif. Tidak perlu transfer.' : 'Event tersimpan dengan status Menunggu Pembayaran. Konfirmasi pembayaran ke admin; aktivasi masih memerlukan verifikasi.') : 'Event berhasil dibuat dan disimpan');
    }

    setEventPaymentPreview(null);
    setShowModal(false);
    setIsEditMode(false);
    setSelectedEventIdForReg('');
    setSelectedDivisiForConfig(null);
  };

  const handleDeleteEvent = async (id, nama) => {
    if (guardPublicMutation()) return;

    const eventId = Number(id);
    const targetEvent = events.find(ev => Number(ev.id) === eventId);
    if (!canManageEvent(targetEvent)) {
      alert('Anda tidak dapat menghapus event milik EO lain.');
      return;
    }

    const confirmed = window.confirm(
      `Hapus event "${nama}"?\n\nEvent beserta peserta, pool, hasil pertandingan, ranking, dan knockout lokal akan dibersihkan.`
    );
    if (!confirmed) return;

    // Hapus peserta lebih dahulu agar aman bila Participants memiliki foreign key ke Events.
    const { error: participantsError } = await supabase
      .from('Participants')
      .delete()
      .eq('event_id', eventId);

    if (participantsError) {
      console.error('❌ Gagal menghapus Participants event di Supabase:', participantsError);
      alert(`Peserta event belum dapat dihapus dari Supabase: ${participantsError.message}`);
      return;
    }

    const { error: eventError } = await supabase
      .from('Events')
      .delete()
      .eq('id', eventId);

    if (eventError) {
      console.error('❌ Gagal menghapus Event di Supabase:', eventError);
      alert(`Event belum dapat dihapus dari Supabase: ${eventError.message}`);
      return;
    }

    // Bersihkan state/cache yang terikat ke event tersebut.
    const withoutEventKey = (source) => {
      const next = { ...(source || {}) };
      delete next[eventId];
      delete next[String(eventId)];
      return next;
    };

    setEvents(prev => prev.filter(item => Number(item.id) !== eventId));
    setParticipants(prev => withoutEventKey(prev));
    setSeededPlayers(prev => withoutEventKey(prev));
    setPoolResults(prev => withoutEventKey(prev));
    setMatchResults(prev => withoutEventKey(prev));
    setPoolRankings(prev => withoutEventKey(prev));
    setKnockoutResults(prev => withoutEventKey(prev));

    // Kosongkan pilihan UI bila sedang menunjuk event yang dihapus.
    const clearIfDeleted = (value, setter) => {
      if (String(value) === String(eventId)) setter('');
    };
    clearIfDeleted(selectedEventIdForReg, setSelectedEventIdForReg);
    clearIfDeleted(selectedEventIdForDraw, setSelectedEventIdForDraw);
    clearIfDeleted(selectedEventIdForSchedule, setSelectedEventIdForSchedule);
    clearIfDeleted(selectedEventIdForLive, setSelectedEventIdForLive);
    clearIfDeleted(selectedEventIdForKnockout, setSelectedEventIdForKnockout);
    clearIfDeleted(selectedEventIdForRanking, setSelectedEventIdForRanking);
    clearIfDeleted(selectedEventIdForSettings, setSelectedEventIdForSettings);

    if (String(publicViewedEventId) === String(eventId)) {
      setPublicViewedEventId('');
      sessionStorage.removeItem('spinmatch_public_view_event');
    }

    alert(`Event "${nama}" berhasil dihapus.`);
  };

const handleDeleteAllParticipants = async () => {
  if (!selectedEventItem) {
    alert('Pilih event terlebih dahulu!');
    return;
  }

  if (
    window.confirm(
      'Data Akan Dihapus Semua, Apakah Anda Yakin?\n\nTekan OK untuk menghapus semua peserta, atau Keluar untuk membatalkan.'
    )
  ) {
    const eventId = selectedEventItem.id;

    const { error } = await supabase
      .from('Participants')
      .delete()
      .eq('event_id', Number(eventId));

    if (error) {
      console.error('❌ Gagal menghapus semua peserta:', error);
      alert(`Semua peserta belum berhasil dihapus: ${error.message}`);
      return;
    }

    const updatedParticipants = {
      ...participants,
      [eventId]: []
    };

    setParticipants(updatedParticipants);

    localStorage.setItem(
      'spinmatch_participants',
      JSON.stringify(updatedParticipants)
    );

    setEvents(events.map(ev =>
      ev.id === eventId
        ? { ...ev, peserta: 0 }
        : ev
    ));

    alert('Semua peserta berhasil dihapus!');
  }
};

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    if (!selectedEventItem) return;
    const targetDivisi = regDivisi || (selectedEventItem.divisiList[0]?.nama || 'Divisi 5');
    const currentList = participants[selectedEventItem.id] || [];
    const generatedId = generateCustomId(targetDivisi, currentList);
    const newParticipant = {
      id: Date.now(),
      customId: generatedId,
      nama: regNama,
      ptm: regPtm,
      noTelp: regNoTelp,
      divisi: targetDivisi,
      statusBayar: regStatusBayar,
      nilaiBayar: Number(regNilaiBayar) || 0,
      usia: regUsia
    };
       const { error } = await supabase
      .from('Participants')
      .insert({
        id: Number(newParticipant.id),
        event_id: Number(selectedEventItem.id),
        custom_id: newParticipant.customId,
        nama: newParticipant.nama,
        ptm: newParticipant.ptm,
        notelp: newParticipant.noTelp,
        divisi: newParticipant.divisi,
        statusbayar: newParticipant.statusBayar,
        nilaibayar: Number(newParticipant.nilaiBayar) || 0,
        usia: Number(newParticipant.usia) || 0
      });

    if (error) {
      console.error('❌ Gagal menyimpan peserta', error);
      alert(`Peserta belum tersimpan ${error.message}`);
      return;
    }

    const updatedList = [...currentList, newParticipant];

    setParticipants({
      ...participants,
      [selectedEventItem.id]: updatedList
    });

    setEvents(events.map(ev =>
      ev.id === selectedEventItem.id
        ? { ...ev, peserta: updatedList.length }
        : ev
    ));

    setRegNama('');
    setRegPtm('');
    setRegNoTelp('');
    setRegUsia('');
    setShowRegModal(false);

    alert('Peserta berhasil disimpan');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedEventItem) return;
    const defaultDivisi = selectedEventItem.divisiList[0]?.nama || 'Divisi 5';
    const currentList = participants[selectedEventItem.id] || [];
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        if (!data || data.length === 0) {
          alert('File Excel kosong atau format tidak sesuai!');
          return;
        }
        let tempCurrentList = [...currentList];
        const importedData = data.map((row, index) => {
          const nama = row['Nama'] || row['nama'] || `Pemain ${index + 1}`;
          const ptm = row['Klub'] || row['klub'] || row['PTM'] || '-';
          const noTelp = String(row['No HP'] || row['no hp'] || row['NoHP'] || '');
          const generatedId = generateCustomId(defaultDivisi, tempCurrentList);
          const newPlayerObj = {
            id: Date.now() + index,
            customId: generatedId,
            nama: nama,
            ptm: ptm,
            noTelp: noTelp,
            divisi: defaultDivisi,
            statusBayar: 'Belum',
            nilaiBayar: 0,
            usia: 20
          };
          tempCurrentList.push(newPlayerObj);
          return newPlayerObj;
        });
        const updatedList = [...currentList, ...importedData];
        setParticipants({ ...participants, [selectedEventItem.id]: updatedList });
        setEvents(events.map(ev => ev.id === selectedEventItem.id ? { ...ev, peserta: updatedList.length } : ev));
        alert(`Berhasil mengimpor ${importedData.length} data peserta dari Excel! (Status: Belum Bayar)`);
      } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan saat membaca file Excel.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const handlePlayerLeftClick = (player) => {
    setEditingPlayer({ ...player });
    setShowEditPlayerModal(true);
  };

  const handlePlayerContextMenu = (e, player) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, player });
  };

  const handleDeletePlayer = async (player) => {
  if (!selectedEventItem) return;

  if (window.confirm(`Hapus pemain "${player.nama}" (${player.customId}) dari daftar?`)) {
    const eventId = selectedEventItem.id;

    const { error } = await supabase
      .from('Participants')
      .delete()
      .eq('id', Number(player.id))
      .eq('event_id', Number(eventId));

    if (error) {
      console.error('❌ Gagal menghapus pemain dari Supabase:', error);
      alert(`Pemain belum berhasil dihapus: ${error.message}`);
      return;
    }

    const currentList = participants[eventId] || [];
    const updatedList = currentList.filter(p => p.id !== player.id);

    const updatedParticipants = {
      ...participants,
      [eventId]: updatedList
    };

    setParticipants(updatedParticipants);

    localStorage.setItem(
      'spinmatch_participants',
      JSON.stringify(updatedParticipants)
    );

    setEvents(events.map(ev =>
      ev.id === eventId
        ? { ...ev, peserta: updatedList.length }
        : ev
    ));

    alert('Pemain berhasil dihapus!');
  }
};

const handleUpdatePlayerSubmit = async (e) => {
  e.preventDefault();

  if (!selectedEventItem || !editingPlayer) return;

  const eventId = selectedEventItem.id;

  const { error } = await supabase
    .from('Participants')
    .update({
      nama: editingPlayer.nama,
      ptm: editingPlayer.ptm,
      notelp: editingPlayer.noTelp || '',
      divisi: editingPlayer.divisi,
      statusbayar: editingPlayer.statusBayar,
      nilaibayar: Number(editingPlayer.nilaiBayar) || 0,
      usia: Number(editingPlayer.usia) || 0
    })
    .eq('id', Number(editingPlayer.id))
    .eq('event_id', Number(eventId));

  if (error) {
    console.error('❌ Gagal update pemain:', error);
    alert(`Gagal menyimpan perubahan: ${error.message}`);
    return;
  }

  const currentList = participants[eventId] || [];

  const updatedList = currentList.map(p =>
    p.id === editingPlayer.id ? { ...editingPlayer } : p
  );

  const updatedParticipants = {
    ...participants,
    [eventId]: updatedList
  };

  setParticipants(updatedParticipants);

  localStorage.setItem(
    'spinmatch_participants',
    JSON.stringify(updatedParticipants)
  );

  setShowEditPlayerModal(false);
  setEditingPlayer(null);

  alert('Data pemain berhasil diperbarui!');
};

  // ============================================================
  // PROYEKSI POOL -> KNOCKOUT -> BYE / SEEDED
  // BYE belum dibuat di tahap Pool. Jumlah Seeded = jumlah Pool.
  // Jumlah BYE dihitung terpisah dan diprioritaskan ke Seed 1..N.
  // ============================================================
  const getDrawProjection = (event = selectedDrawEvent, totalOverride = null) => {
    if (!event) return { totalPlayers: 0, poolSize: 3, numPools: 0, lolosCount: 1, knockoutPlayers: 0, bracketSize: 0, byeCount: 0 };

    const divisiConfig = event.divisiList?.[0] || {};
    const poolSize = divisiConfig.jumlahPool?.includes('4 Orang') ? 4 :
      divisiConfig.jumlahPool?.includes('5 Orang') ? 5 : 3;
    const lolosCount = divisiConfig.lolosPool === '1 Pemain' ? 1 : 2;
    const totalPlayers = totalOverride === null
      ? (participants[event.id] || []).length
      : Number(totalOverride || 0);

    const numPools = totalPlayers > 0 ? Math.ceil(totalPlayers / poolSize) : 0;
    const knockoutPlayers = numPools * lolosCount;

    let bracketSize = knockoutPlayers > 0 ? 8 : 0;
    while (bracketSize < knockoutPlayers) bracketSize *= 2;

    // Jika peserta KO < 8, bracket tetap 8 sesuai deret 8,16,32,64,...
    const byeCount = bracketSize > 0 ? Math.max(0, bracketSize - knockoutPlayers) : 0;

    return { totalPlayers, poolSize, numPools, lolosCount, knockoutPlayers, bracketSize, byeCount };
  };

  const getSeedPoolIndexes = (numPools, seedCount) => {
    if (numPools <= 0 || seedCount <= 0) return [];
    const count = Math.min(seedCount, numPools);
    const indexes = [];

    // Aturan turnamen:
    // Seed ganjil (1,3,5,...) ditempatkan dari bagian ATAS.
    // Seed genap  (2,4,6,...) ditempatkan dari bagian BAWAH.
    let top = 0;
    let bottom = numPools - 1;

    for (let seedNo = 1; seedNo <= count; seedNo++) {
      if (seedNo % 2 === 1) {
        indexes.push(top);
        top++;
      } else {
        indexes.push(bottom);
        bottom--;
      }
    }
    return indexes;
  };

  const handleOpenSeedModal = () => {
    if (!selectedDrawEvent) {
      alert('Pilih event terlebih dahulu!');
      return;
    }
    const currentList = participants[selectedDrawEvent.id] || [];
    if (currentList.length < 2) {
      alert('Minimal harus ada 2 peserta untuk melakukan seeding!');
      return;
    }

    const projection = getDrawProjection(selectedDrawEvent, currentList.length);
    const existingSeed = seededPlayers[selectedDrawEvent.id] || {};
    const nextTemp = {};

    // Jumlah Seeded = jumlah Pool yang terbentuk.
    // Jumlah BYE dihitung terpisah; BYE diprioritaskan ke Seed 1..N sesuai byeCount.
    for (let i = 1; i <= projection.numPools; i++) {
      nextTemp[`seed${i}`] = existingSeed[`seed${i}`] || '';
    }

    setTempSeedData(nextTemp);
    setShowSeedModal(true);
  };

  const handleSaveSeed = () => {
    if (!selectedDrawEvent) return;

    const projection = getDrawProjection(selectedDrawEvent);
    const cleaned = {};
    for (let i = 1; i <= projection.numPools; i++) {
      cleaned[`seed${i}`] = tempSeedData[`seed${i}`] || '';
    }

    const selectedIds = Object.values(cleaned).filter(Boolean).map(String);
    if (new Set(selectedIds).size !== selectedIds.length) {
      alert('Pemain Seeded tidak boleh dipilih lebih dari satu kali!');
      return;
    }

    setSeededPlayers({
      ...seededPlayers,
      [selectedDrawEvent.id]: cleaned
    });
    setShowSeedModal(false);
    alert(`Pengaturan Seeded berhasil disimpan!\nJumlah Seeded: ${projection.numPools} pemain (sesuai jumlah Pool).\nKebutuhan BYE: ${projection.byeCount} pemain — prioritas Seed 1 s/d ${projection.byeCount}.`);
  };

  const handleResetSeed = () => {
    if (window.confirm('Yakin ingin mereset semua data Seeded untuk event ini?')) {
      const updated = { ...seededPlayers };
      delete updated[selectedDrawEvent.id];
      setSeededPlayers(updated);
      alert('Data Seeded berhasil direset!');
    }
  };

  const handleStartDraw = () => {
    if (!selectedDrawEvent) {
      alert('Pilih event terlebih dahulu!');
      return;
    }
    const currentList = participants[selectedDrawEvent.id] || [];
    if (currentList.length < 2) {
      alert('Minimal harus ada 2 peserta untuk melakukan undian!');
      return;
    }
    const projection = getDrawProjection(selectedDrawEvent, currentList.length);
    const eventSeed = seededPlayers[selectedDrawEvent.id] || {};
    const filledSeeds = Array.from({ length: projection.numPools }, (_, i) => eventSeed[`seed${i + 1}`]).filter(Boolean).length;
    if (projection.numPools > 0 && filledSeeds < projection.numPools) {
      console.warn(`⚠️ Seeded belum lengkap: ${filledSeeds}/${projection.numPools}. Undian tetap dapat dilanjutkan.`);
    }

    setDrawPhase('spinning');
    setShowDrawAnimation(true);
    let spinCount = 0;
    const maxSpins = 30;
    spinIntervalRef.current = setInterval(() => {
      const randomNames = Array.from({ length: 4 }, () => {
        const randomPlayer = currentList[Math.floor(Math.random() * currentList.length)];
        return randomPlayer ? randomPlayer.nama : '???';
      });
      setSpinningNames(randomNames);
      spinCount++;
      if (spinCount >= maxSpins) {
        clearInterval(spinIntervalRef.current);
        performDraw(currentList);
      }
    }, 100);
  };

  const performDraw = (playerList) => {
    const projection = getDrawProjection(selectedDrawEvent, playerList.length);
    const eventSeed = seededPlayers[selectedDrawEvent.id] || {};

    const seedEntries = Array.from({ length: projection.numPools }, (_, i) => ({
      rank: i + 1,
      id: eventSeed[`seed${i + 1}`] || '',
      byePriority: (i + 1) <= projection.byeCount
    })).filter(item => item.id);

    const seededIds = seedEntries.map(item => String(item.id));
    const nonSeededPlayers = playerList.filter(p => !seededIds.includes(String(p.id)));
    const shuffled = [...nonSeededPlayers].sort(() => Math.random() - 0.5);

    const { poolSize, lolosCount, totalPlayers, numPools, knockoutPlayers, bracketSize, byeCount } = projection;
    const pools = Array.from({ length: numPools }, (_, i) => ({
      name: `Pool ${String.fromCharCode(65 + i)}`,
      players: [],
      isSeededPool: false,
      seedRank: null,
      byePriority: false
    }));

    // Tempatkan seluruh seeded ke Pool berbeda dan tersebar.
    const seedPoolIndexes = getSeedPoolIndexes(numPools, seedEntries.length);
    seedEntries.forEach((seed, i) => {
      const player = playerList.find(p => String(p.id) === String(seed.id));
      const poolIdx = seedPoolIndexes[i];
      if (player && pools[poolIdx]) {
        pools[poolIdx].players.push({ ...player, isSeed: seed.rank, seedRank: seed.rank });
        pools[poolIdx].isSeededPool = true;
        pools[poolIdx].seedRank = seed.rank;
        pools[poolIdx].byePriority = seed.byePriority;
      }
    });

    // Fungsi lama pembagian pemain non-seeded tetap round-robin.
    let poolIndex = 0;
    shuffled.forEach(player => {
      let attempts = 0;
      while (pools[poolIndex].players.length >= poolSize && attempts < pools.length) {
        poolIndex = (poolIndex + 1) % pools.length;
        attempts++;
      }
      pools[poolIndex].players.push(player);
      poolIndex = (poolIndex + 1) % pools.length;
    });

    const results = {};
    const seededPools = {};
    pools.forEach(pool => {
      results[pool.name] = pool.players;
      if (pool.isSeededPool) {
        seededPools[pool.name] = {
          isSeededPool: true,
          seedRank: pool.seedRank,
          byePriority: pool.byePriority,
          byePriorityRank: pool.byePriority ? pool.seedRank : null
        };
      }
    });

    const newPoolData = {
      pools: results, seededPools,
      config: { poolSize, lolosCount, totalPlayers, numPools, knockoutPlayers,
        bracketSize, byeCount, requiredSeeds: numPools, byePrioritySeeds: byeCount }
    };
    setPoolResults(prev => ({ ...prev, [selectedDrawEvent.id]: newPoolData }));
    saveOnlinePool(selectedDrawEvent.id, newPoolData)
      .catch(error => alert('Undian tersimpan di browser, tetapi gagal sinkron ke Supabase: ' + error.message));
    setDrawPhase('done');
  };

  const handleCloseAnimation = () => {
    setShowDrawAnimation(false);
    setDrawPhase('idle');
    setSpinningNames(['', '', '', '']);
  };

  const handleResetDraw = () => {
    if (window.confirm('Yakin ingin mereset hasil undian untuk event ini?')) {
      const updated = { ...poolResults };
      delete updated[selectedDrawEvent.id];
      setPoolResults(updated);
      const matchUpdated = { ...matchResults };
      Object.keys(matchUpdated).forEach(key => {
        if (key.startsWith(`${selectedDrawEvent.id}_`)) {
          delete matchUpdated[key];
        }
      });
      setMatchResults(matchUpdated);
      saveOnlinePool(selectedDrawEvent.id, {})
        .catch(error => alert('Gagal reset undian online: ' + error.message));
      const rankingUpdated = { ...poolRankings };
      delete rankingUpdated[selectedDrawEvent.id];
      setPoolRankings(rankingUpdated);
      alert('Hasil undian berhasil direset!');
    }
  };

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const addMinutes = (timeInMinutes, minutesToAdd) => {
    return timeInMinutes + minutesToAdd;
  };

  // Parser tanggal lokal Indonesia, tanpa bergantung pada interpretasi browser.
  // Mendukung YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, dan '24 Oktober 2026'.
  const parseEventDate = (input) => {
    const raw = String(input || '').trim()
      .replace(/^Dari Tanggal\s+/i, '').split(/\s+sd\s+/i)[0].trim();
    let year, month, day;
    let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) { year = +m[1]; month = +m[2]; day = +m[3]; }
    else {
      m = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
      if (m) { day = +m[1]; month = +m[2]; year = +m[3]; }
      else {
        m = raw.match(/^(\d{1,2})[\s/-]+([a-zA-Z]+)[\s/-]+(\d{2}|\d{4})$/);
        if (m) {
          const monthNames = ['januari','februari','maret','april','mei','juni',
            'juli','agustus','september','oktober','november','desember'];
          const aliases = {jan:1,feb:2,mar:3,apr:4,mei:5,jun:6,jul:7,
            agu:8,ags:8,sep:9,okt:10,nov:11,des:12};
          const name = m[2].toLowerCase();
          month = monthNames.indexOf(name) + 1 || aliases[name];
          day = +m[1]; year = +m[3]; if (year < 100) year += 2000;
        }
      }
    }
    if (!year || !month || !day) return null;
    const d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() === month - 1 &&
      d.getDate() === day ? d : null;
  };

  const getDayName = (dateStr) => {
    const date = parseEventDate(dateStr);
    if (!date) return '-';
    return ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()];
  };

  const formatDateShort = (dateStr) => {
    const date = parseEventDate(dateStr);
    if (!date) return String(dateStr || '-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${date.getDate()}-${months[date.getMonth()]}-${String(date.getFullYear()).slice(-2)}`;
  };

  // ITTF group ranking: match points, head-to-head among tied players,
  // then ratios of games and individual points (only among tied players).
  const buildPoolRankings = (eventId) => {
    const poolData = poolResults[eventId];
    if (!poolData?.pools) return {};
    const eventData = events.find(e => String(e.id) === String(eventId));
    const division = eventData?.divisiList?.[0] || {};
    const configured = Number(poolData?.config?.lolosCount || 0);
    const qualifyCount = configured > 0 ? configured : (division.lolosPool === '2 Pemain' ? 2 : 1);
    const rankings = {};
    Object.entries(poolData.pools).forEach(([poolName, players]) => {
      const matches = [];
      const m1 = matchResults[`${eventId}_${poolName}_M1`];
      Object.entries(matchResults).forEach(([key, result]) => {
        if (!key.startsWith(`${eventId}_${poolName}_`) || !result?.winner) return;
        const ref = key.slice(`${eventId}_${poolName}_`.length);
        let p1 = result.player1, p2 = result.player2;
        if (players.length === 3) {
          if (ref === 'M1') { p1=players[1]; p2=players[2]; }
          if (ref === 'M2' && m1?.winner) { p1=m1.winner === 'player1' ? players[2] : players[1]; p2=players[0]; }
          if (ref === 'M3' && m1?.winner) { p1=m1.winner === 'player1' ? players[1] : players[2]; p2=players[0]; }
        }
        if (!p1?.id || !p2?.id) return;
        const games = Array.isArray(result.gameHistory) ? result.gameHistory.filter(g =>
          g && g.p1 !== '' && g.p2 !== '' && g.p1 != null && g.p2 != null &&
          Number.isFinite(Number(g.p1)) && Number.isFinite(Number(g.p2)) && Number(g.p1) !== Number(g.p2)
        ) : [];
        const validPoints = games.length === Number(result.player1Score || 0) + Number(result.player2Score || 0);
        matches.push({p1:String(p1.id),p2:String(p2.id),result,games,validPoints,key});
      });
      const stats = players.map(p => ({id:p.id,nama:p.nama,ptm:p.ptm,playerCode:p.customId,
        wins:0,losses:0,matchPoints:0,gamesWon:0,gamesLost:0,
        pointsWon:0,pointsLost:0,completePoints:true, matchesPlayed:0}));
      const byId = Object.fromEntries(stats.map(s => [String(s.id),s]));
      const aggregate = (subset, ids) => {
        const out = Object.fromEntries(ids.map(id => [id,{mp:0,gw:0,gl:0,pw:0,pl:0,complete:true}]));
        subset.forEach(m => {
          if (!out[m.p1] || !out[m.p2]) return;
          const a=out[m.p1],b=out[m.p2],r=m.result;
          a.mp += r.winner==='player1' ? 2 : 1;
          b.mp += r.winner==='player2' ? 2 : 1;
          a.gw+=Number(r.player1Score||0); a.gl+=Number(r.player2Score||0);
          b.gw+=Number(r.player2Score||0); b.gl+=Number(r.player1Score||0);
          a.complete=a.complete&&m.validPoints; b.complete=b.complete&&m.validPoints;
          if (m.validPoints) m.games.forEach(g=>{a.pw+=Number(g.p1);a.pl+=Number(g.p2);b.pw+=Number(g.p2);b.pl+=Number(g.p1);});
        });
        return out;
      };
      const allIds=stats.map(s=>String(s.id));
      const totals=aggregate(matches,allIds);
      stats.forEach(s=>{
        const id=String(s.id),t=totals[id];
        s.matchPoints=t.mp;s.gamesWon=t.gw;s.gamesLost=t.gl;
        s.pointsWon=t.pw;s.pointsLost=t.pl;s.completePoints=t.complete;
        s.wins=matches.filter(m=>(m.p1===id&&m.result.winner==='player1')||(m.p2===id&&m.result.winner==='player2')).length;
        s.losses=matches.filter(m=>(m.p1===id&&m.result.winner==='player2')||(m.p2===id&&m.result.winner==='player1')).length;
        s.matchesPlayed=s.wins+s.losses;
        s.totalPoints=t.pw;
      });
      const ratio=(w,l)=>l===0 ? (w>0?Infinity:0) : w/l;
      // Recursive tie-break: after separating players, recalculate using only
      // the matches between players still tied, as required by ITTF.
      const rankGroup=(ids,depth=0) => {
        if(ids.length<2 || depth>8) return ids;
        const scoped=aggregate(matches.filter(m=>ids.includes(m.p1)&&ids.includes(m.p2)),ids);
        const groupBy=(fn)=>{
          const groups=new Map();
          ids.forEach(id=>{const v=fn(scoped[id]);const k=String(v);if(!groups.has(k))groups.set(k,[]);groups.get(k).push(id);});
          return [...groups.entries()].sort((a,b)=>Number(b[0])-Number(a[0])).map(x=>x[1]);
        };
        const mpGroups=groupBy(s=>s.mp);
        if(mpGroups.length>1) return mpGroups.flatMap(g=>g.length===ids.length?g:rankGroup(g,depth+1));
        const setGroups=groupBy(s=>ratio(s.gw,s.gl));
        if(setGroups.length>1) return setGroups.flatMap(g=>rankGroup(g,depth+1));
        if(ids.every(id=>scoped[id].complete)) {
          const pointGroups=groupBy(s=>ratio(s.pw,s.pl));
          if(pointGroups.length>1) return pointGroups.flatMap(g=>rankGroup(g,depth+1));
        }
        return ids; // still tied: do not invent a winner
      };
      const order=rankGroup(allIds);
      const fullyPlayed=matches.length >= players.length*(players.length-1)/2;
      const ordered=order.map((id,index)=>{
        const s=byId[id];
        const sameMp=stats.filter(t=>t.matchPoints===s.matchPoints);
        const unresolved=sameMp.length>1 && !sameMp.every(t=>t.completePoints);
        return {...s,ranking:index+1,ratioSet:ratio(s.gamesWon,s.gamesLost),
          ratioPoin:s.completePoints?ratio(s.pointsWon,s.pointsLost):null,
          keterangan:fullyPlayed && index<qualifyCount && !unresolved ? `Lolos Pool ${index+1}` : '',
          note:!fullyPlayed?'Pertandingan pool belum lengkap':unresolved?'Poin bola belum lengkap; verifikasi tie-break':'Perhitungan klasemen ITTF'};
      });
      rankings[poolName]=ordered;
    });
    return rankings;
  };

  const calculatePoolRankings = (eventId) => {
    const rankings=buildPoolRankings(eventId);
    setPoolRankings(prev=>({...prev,[eventId]:rankings}));
    return rankings;
  };

  // Khusus pengujian: isi hasil Pool yang kosong tanpa menimpa hasil wasit.
  const simulatePoolScores = async () => {
    if (!(isEO || isSuperAdmin) || !selectedDrawEvent || !canManageEvent(selectedDrawEvent)) return;
    if (simulationSaving) return;
    const eventId = String(selectedDrawEvent.id);
    const pools = poolResults[eventId]?.pools;
    if (!pools || !Object.keys(pools).length) {
      alert('Undian pool belum tersedia.'); return;
    }
    if (Object.values(pools).some(players => players.length > 3)) {
      alert('Simulasi ini mendukung pool berisi 2 atau 3 pemain. Data tidak diubah.'); return;
    }
    if (!window.confirm('ISI HASIL SIMULASI untuk event ini?\n\nHasil yang sudah ada tidak akan ditimpa. Hasil baru disimpan ke Supabase dan memengaruhi klasemen/Knockout. Gunakan hanya untuk pengujian.')) return;
    setSimulationSaving(true);
    try {
      const { data: online, error: readError } = await supabase.from('spinmatch_event_data')
        .select('pool_results, match_results').eq('event_id', Number(eventId)).maybeSingle();
      if (readError) throw readError;
      if (!online?.pool_results?.pools) throw new Error('Data pool online tidak ditemukan. Simulasi dibatalkan untuk melindungi data.');
      const onlinePools = online.pool_results.pools;
      if (JSON.stringify(onlinePools) !== JSON.stringify(pools)) {
        throw new Error('Data pool lokal berbeda dari Supabase. Muat ulang halaman sebelum simulasi.');
      }
      const next = { ...(online.match_results || {}) };
      const makeResult = (player1, player2, seed) => {
        const firstWins = seed % 2 === 0;
        const games = firstWins
          ? [{p1:11,p2:7},{p1:9,p2:11},{p1:11,p2:6},{p1:11,p2:8}]
          : [{p1:8,p2:11},{p1:11,p2:9},{p1:7,p2:11},{p1:6,p2:11}];
        return {
          player1Score: firstWins ? 3 : 1,
          player2Score: firstWins ? 1 : 3,
          score: firstWins ? '3 - 1' : '1 - 3',
          winner: firstWins ? 'player1' : 'player2',
          point1: games.reduce((sum,g) => sum + g.p1, 0),
          point2: games.reduce((sum,g) => sum + g.p2, 0),
          gameHistory: games,
          player1, player2,
          signatureWinner: '', signatureLoser: '', signatureReferee: '',
          simulated: true,
          updatedAt: new Date().toISOString()
        };
      };
      let added = 0;
      Object.entries(onlinePools).forEach(([poolName, players], poolIndex) => {
        if (players.length < 2) return;
        const prefix = `${eventId}_${poolName}_`;
        const add = (ref, p1, p2, seed) => {
          const key = prefix + ref;
          if (next[key]) return;
          next[key] = makeResult(p1, p2, seed);
          added++;
        };
        if (players.length === 2) {
          add('M1', players[0], players[1], poolIndex);
        } else if (players.length === 3) {
          const m1Key = prefix + 'M1';
          add('M1', players[1], players[2], poolIndex);
          const m1 = next[m1Key];
          if (m1?.winner !== 'player1' && m1?.winner !== 'player2') {
            throw new Error(`Hasil M1 ${poolName} belum mempunyai pemenang.`);
          }
          const loser = m1.winner === 'player1' ? players[2] : players[1];
          const winner = m1.winner === 'player1' ? players[1] : players[2];
          add('M2', loser, players[0], poolIndex + 1);
          add('M3', winner, players[0], poolIndex + 2);
        }
      });
      if (!added) { alert('Semua pertandingan pool sudah mempunyai hasil. Tidak ada data yang diubah.'); return; }
      const { error: saveError } = await supabase.from('spinmatch_event_data').upsert({
        event_id: Number(eventId),
        pool_results: online.pool_results,
        match_results: next,
        updated_at: new Date().toISOString()
      }, { onConflict: 'event_id' });
      if (saveError) throw saveError;
      setMatchResults(prev => ({ ...prev, ...next }));
      alert(`${added} pertandingan simulasi berhasil disimpan ke Supabase. Hasil sebelumnya tetap aman.`);
    } catch (err) {
      console.error('Simulasi pool gagal:', err);
      alert('Simulasi dibatalkan: ' + (err?.message || 'Kesalahan tidak diketahui'));
    } finally {
      setSimulationSaving(false);
    }
  };

  useEffect(() => {
    if (!selectedEventIdForDraw || !poolResults[selectedEventIdForDraw]?.pools) return;
    if (!(isEO || isSuperAdmin)) return;
    calculatePoolRankings(selectedEventIdForDraw);
  }, [matchResults, selectedEventIdForDraw]);

  const generateScheduleFromPools = (eventId) => {
    const poolData = poolResults[eventId];
    const eventData = events.find(e => String(e.id) === String(eventId));
    if (!poolData || !eventData) return [];
    const scheduleRows = [];
    const jamMulai = eventData.jamMulai || '08:00';
    const durasiMatch = parseInt(eventData.durasiMatch) || 20;
    let tanggal = eventData.tanggal;
    if (tanggal.includes('Dari Tanggal ')) {
      tanggal = tanggal.replace('Dari Tanggal ', '').split(' sd ')[0];
    }
    let currentTime = parseTime(jamMulai);
    let mejaNumber = 1;
    const maxMeja = Math.max(1, Number(eventData.jumlahMeja || eventData.jumlahmeja || 4));
    const hariMain = getDayName(tanggal);
    const tanggalShort = formatDateShort(tanggal);
    const poolEntries = Object.entries(poolData.pools);
    poolEntries.forEach(([poolName, players], poolIndex) => {
      if (players.length < 1) return;
      const poolLetter = poolName.replace('Pool ', '');
      const poolSize = players.length;
      scheduleRows.push({
        type: 'pool_header',
        pool: poolName,
        poolLetter: poolLetter
      });
      if (poolSize === 1) {
        scheduleRows.push({
          type: 'single_player',
          pool: poolName,
          playerCode: `${poolLetter}1`,
          player: players[0],
          matchLabel: '-',
          matchRef: '-',
          jam: '-',
          meja: '-',
          tanggal: tanggalShort,
          hari: hariMain,
          matchId: null,
          matchType: 'bye',
          result: null
        });
      }
      else if (poolSize === 2) {
        const [p1, p2] = players;
        const m1Id = `${eventId}_${poolName}_M1`;
        const jamStr = `${formatTime(currentTime)} - ${formatTime(currentTime + durasiMatch)}`;
        scheduleRows.push({
          type: 'player',
          pool: poolName,
          playerCode: `${poolLetter}1`,
          player: p1,
          matchLabel: `${poolLetter}1 VS ${poolLetter}2`,
          matchRef: 'M1',
          jam: jamStr,
          meja: `Meja ${mejaNumber}`,
          tanggal: tanggalShort,
          hari: hariMain,
          matchId: m1Id,
          matchType: 'direct',
          opponent: p2,
          result: matchResults[m1Id] || null,
          showMatch: true
        });
        scheduleRows.push({
          type: 'player',
          pool: poolName,
          playerCode: `${poolLetter}2`,
          player: p2,
          matchLabel: '',
          matchRef: 'M1',
          jam: jamStr,
          meja: `Meja ${mejaNumber}`,
          tanggal: tanggalShort,
          hari: hariMain,
          matchId: m1Id,
          matchType: 'direct',
          opponent: p1,
          result: matchResults[m1Id] || null,
          showMatch: false
        });
        mejaNumber = (mejaNumber % maxMeja) + 1;
        currentTime = addMinutes(currentTime, durasiMatch);
      }
      else if (poolSize === 3) {
        const [p1, p2, p3] = players;
        const m1Id = `${eventId}_${poolName}_M1`;
        const m2Id = `${eventId}_${poolName}_M2`;
        const m3Id = `${eventId}_${poolName}_M3`;
        const jam1 = `${formatTime(currentTime)} - ${formatTime(currentTime + durasiMatch)}`;
        currentTime = addMinutes(currentTime, durasiMatch);
        const jam2 = `${formatTime(currentTime)} - ${formatTime(currentTime + durasiMatch)}`;
        currentTime = addMinutes(currentTime, durasiMatch);
        const jam3 = `${formatTime(currentTime)} - ${formatTime(currentTime + durasiMatch)}`;
        scheduleRows.push({
          type: 'player',
          pool: poolName,
          playerCode: `${poolLetter}1`,
          player: p1,
          matchLabel: `${poolLetter}2 VS ${poolLetter}3`,
          matchRef: 'M1',
          jam: jam1,
          meja: `Meja ${mejaNumber}`,
          tanggal: tanggalShort,
          hari: hariMain,
          matchId: m1Id,
          matchType: 'first',
          opponent: p3,
          result: matchResults[m1Id] || null,
          showMatch: true
        });
        scheduleRows.push({
          type: 'player',
          pool: poolName,
          playerCode: `${poolLetter}2`,
          player: p2,
          matchLabel: `PK M1 VS ${poolLetter}1`,
          matchRef: 'M2',
          jam: jam2,
          meja: `Meja ${mejaNumber}`,
          tanggal: tanggalShort,
          hari: hariMain,
          matchId: m2Id,
          matchType: 'loser_vs_a1',
          opponentCode: `${poolLetter}1`,
          result: matchResults[m2Id] || null,
          showMatch: true
        });
        scheduleRows.push({
          type: 'player',
          pool: poolName,
          playerCode: `${poolLetter}3`,
          player: p3,
          matchLabel: `PM M1 VS ${poolLetter}1`,
          matchRef: 'M3',
          jam: jam3,
          meja: `Meja ${mejaNumber}`,
          tanggal: tanggalShort,
          hari: hariMain,
          matchId: m3Id,
          matchType: 'winner_vs_a1',
          opponentCode: `${poolLetter}1`,
          result: matchResults[m3Id] || null,
          showMatch: true
        });
        mejaNumber = (mejaNumber % maxMeja) + 1;
      }
      else if (poolSize === 4) {
        const [p1, p2, p3, p4] = players;
        const matches = [
          { ref: 'M1', label: `${poolLetter}2 VS ${poolLetter}3`, player: p1, playerCode: 1, type: 'first_4', opponent: p3 },
          { ref: 'M2', label: `${poolLetter}4 VS PK M1`, player: p2, playerCode: 2, type: 'a4_vs_loser_m1', opponent: p4 },
          { ref: 'M3', label: `${poolLetter}4 VS PM M1`, player: p3, playerCode: 3, type: 'a4_vs_winner_m1', opponent: p4 },
          { ref: 'M4', label: `${poolLetter}1 VS PK M1`, player: p4, playerCode: 4, type: 'a1_vs_loser_m1', opponent: p1 },
          { ref: 'M5', label: `${poolLetter}1 VS PM M1`, player: p4, playerCode: 4, type: 'a1_vs_winner_m1', opponent: p1 },
          { ref: 'M6', label: `${poolLetter}1 VS ${poolLetter}4`, player: p4, playerCode: 4, type: 'a1_vs_a4', opponent: p1 }
        ];
        matches.forEach((match) => {
          const mId = `${eventId}_${poolName}_${match.ref}`;
          const jamStr = `${formatTime(currentTime)} - ${formatTime(currentTime + durasiMatch)}`;
          scheduleRows.push({
            type: 'player',
            pool: poolName,
            playerCode: `${poolLetter}${match.playerCode}`,
            player: match.player,
            matchLabel: match.label,
            matchRef: match.ref,
            jam: jamStr,
            meja: `Meja ${mejaNumber}`,
            tanggal: tanggalShort,
            hari: hariMain,
            matchId: mId,
            matchType: match.type,
            opponent: match.opponent,
            result: matchResults[mId] || null,
            showMatch: true
          });
          currentTime = addMinutes(currentTime, durasiMatch);
          mejaNumber = (mejaNumber % maxMeja) + 1;
        });
      }
      else if (poolSize === 5) {
        const [p1, p2, p3, p4, p5] = players;
        const matches = [
          { ref: 'M1', label: `${poolLetter}2 VS ${poolLetter}3`, player: p1, playerCode: 1, type: 'first_5', opponent: p3 },
          { ref: 'M2', label: `${poolLetter}4 VS PK M1`, player: p2, playerCode: 2, type: 'a4_vs_loser_m1', opponent: p4 },
          { ref: 'M3', label: `${poolLetter}5 VS PM M1`, player: p3, playerCode: 3, type: 'a5_vs_winner_m1', opponent: p5 },
          { ref: 'M4', label: `${poolLetter}1 VS PK M1`, player: p4, playerCode: 4, type: 'a1_vs_loser_m1', opponent: p1 },
          { ref: 'M5', label: `${poolLetter}1 VS PM M1`, player: p4, playerCode: 4, type: 'a1_vs_winner_m1', opponent: p1 },
          { ref: 'M6', label: `${poolLetter}1 VS ${poolLetter}4`, player: p4, playerCode: 4, type: 'a1_vs_a4', opponent: p1 },
          { ref: 'M7', label: `${poolLetter}1 VS ${poolLetter}5`, player: p4, playerCode: 4, type: 'a1_vs_a5', opponent: p1 }
        ];
        matches.forEach((match) => {
          const mId = `${eventId}_${poolName}_${match.ref}`;
          const jamStr = `${formatTime(currentTime)} - ${formatTime(currentTime + durasiMatch)}`;
          scheduleRows.push({
            type: 'player',
            pool: poolName,
            playerCode: `${poolLetter}${match.playerCode}`,
            player: match.player,
            matchLabel: match.label,
            matchRef: match.ref,
            jam: jamStr,
            meja: `Meja ${mejaNumber}`,
            tanggal: tanggalShort,
            hari: hariMain,
            matchId: mId,
            matchType: match.type,
            opponent: match.opponent,
            result: matchResults[mId] || null,
            showMatch: true
          });
          currentTime = addMinutes(currentTime, durasiMatch);
          mejaNumber = (mejaNumber % maxMeja) + 1;
        });
      }
      else {
        let matchCounter = 1;
        for (let i = 0; i < players.length; i++) {
          for (let j = i + 1; j < players.length; j++) {
            const mId = `${eventId}_${poolName}_M${matchCounter}`;
            const jamStr = `${formatTime(currentTime)} - ${formatTime(currentTime + durasiMatch)}`;
            scheduleRows.push({
              type: 'player',
              pool: poolName,
              playerCode: `${poolLetter}${i + 1}`,
              player: players[i],
              matchLabel: `${poolLetter}${i + 1} VS ${poolLetter}${j + 1}`,
              matchRef: `M${matchCounter}`,
              jam: jamStr,
              meja: `Meja ${mejaNumber}`,
              tanggal: tanggalShort,
              hari: hariMain,
              matchId: mId,
              matchType: 'direct',
              opponent: players[j],
              result: matchResults[mId] || null,
              showMatch: true
            });
            matchCounter++;
            currentTime = addMinutes(currentTime, durasiMatch);
            mejaNumber = (mejaNumber % maxMeja) + 1;
          }
        }
      }
      if (poolIndex < poolEntries.length - 1) {
        scheduleRows.push({ type: 'empty_row' });
      }
    });
    return smApplyBreaks(scheduleRows, eventBreaks[String(eventId)] || []);
  };

  const getLiveMatchPlayers = (row, eventId) => {
    if (row?.directPlayer1 || row?.directPlayer2) return { player1: row.directPlayer1 || null, player2: row.directPlayer2 || null };
    if (!row || !eventId) {
      return { player1: row?.player || null, player2: row?.opponent || null };
    }
    const correctEventId = Object.keys(poolResults).find(key => String(key) === String(eventId));
    const poolData = correctEventId ? poolResults[correctEventId] : null;
    const players = poolData?.pools?.[row.pool] || [];
    if (players.length < 2) {
      return { player1: row.player || null, player2: row.opponent || null };
    }
    const matchRef = row.matchRef;
    if (players.length === 3 && matchRef === 'M1') {
      return { player1: players[1], player2: players[2] };
    }
    if (players.length === 3 && matchRef === 'M2') {
      const m1Id = `${correctEventId}_${row.pool}_M1`;
      const m1Result = matchResults[m1Id];
      if (!m1Result) {
        return { player1: null, player2: players[0] };
      }
      const loser = m1Result.winner === 'player1' ? players[2] : players[1];
      return { player1: loser, player2: players[0] };
    }
    if (players.length === 3 && matchRef === 'M3') {
      const m1Id = `${correctEventId}_${row.pool}_M1`;
      const m1Result = matchResults[m1Id];
      if (!m1Result) {
        return { player1: null, player2: players[0] };
      }
      const winner = m1Result.winner === 'player1' ? players[1] : players[2];
      return { player1: winner, player2: players[0] };
    }
    return { player1: row.player || null, player2: row.opponent || null };
  };

  const resolveOpponentName = (row, scheduleRows) => {
    if (!row) return 'Lawan';
    const eventId = selectedLiveEvent?.id || selectedScheduleEvent?.id;
    if (eventId) {
      const { player2 } = getLiveMatchPlayers(row, eventId);
      if (player2?.nama) return player2.nama;
    }
    if (!row.matchId || (!row.matchType?.includes('loser') && !row.matchType?.includes('winner'))) {
      return row.opponent ? row.opponent.nama : 'Lawan';
    }
    const poolName = row.pool;
    const m1Id = `${selectedScheduleEvent?.id}_${poolName}_M1`;
    const m1Result = matchResults[m1Id];
    if (!m1Result) return 'Menunggu Hasil M1';
    const poolData = poolResults[selectedScheduleEvent?.id];
    const players = poolData?.pools?.[poolName] || [];
    if (players.length < 3) return 'Lawan';
    const playerA1 = players[0];
    const playerA2 = players[1];
    const playerA3 = players[2];
    const winner = m1Result.winner;
    if (row.matchType.includes('loser')) {
      return winner === 'player1' ? playerA3.nama : playerA2.nama;
    } else {
      return winner === 'player1' ? playerA2.nama : playerA3.nama;
    }
  };

  // ============================================================
  // KNOCKOUT
  // Placeholder "Juara Pool X" otomatis berubah menjadi nama pemain
  // setelah ranking Pool tersedia. Match Knockout memakai Live Score lama.
  // ============================================================
  const isPoolCompleteForKnockout = (eventId, poolName) => {
    const poolData = poolResults[eventId];
    const players = poolData?.pools?.[poolName] || [];
    if (players.length < 2) return false;

    // Jadwal Pool 3 pemain memakai M1, M2, M3.
    // Untuk ukuran lain, gunakan jumlah pertandingan round-robin n(n-1)/2.
    const expectedMatches = (players.length * (players.length - 1)) / 2;
    let completed = 0;
    for (let i = 1; i <= expectedMatches; i++) {
      const result = matchResults[`${eventId}_${poolName}_M${i}`];
      if (result?.winner) completed++;
    }
    return completed >= expectedMatches;
  };

  const getKnockoutQualifier = (eventId, poolName, rank = 1) => {
    // KUNCI: sebelum SELURUH pertandingan Pool selesai,
    // bracket harus tetap "Juara Pool A/B/C..." dan tidak boleh menampilkan nama.
    if (!isPoolCompleteForKnockout(eventId, poolName)) return null;

    const ranking = poolRankings[eventId]?.[poolName] || [];
    const player = ranking[rank - 1] || null;
    if (!player) return null;
    const qualified = String(player.keterangan || '').toLowerCase().includes('lolos pool');
    return qualified ? player : null;
  };

  const getKnockoutEntrants = (eventId) => {
    const poolData = poolResults[eventId];
    const eventData = events.find(e => String(e.id) === String(eventId));
    if (!poolData || !eventData) return [];
    const lolosCount = Number(poolData?.config?.lolosCount || (eventData.divisiList?.[0]?.lolosPool === '2 Pemain' ? 2 : 1));
    const seededPools = poolData.seededPools || {};
    const entrants = [];
    Object.keys(poolData.pools || {}).forEach(poolName => {
      for (let rank = 1; rank <= lolosCount; rank++) {
        const qualified = getKnockoutQualifier(eventId, poolName, rank);
        const seedMeta = seededPools[poolName] || {};
        entrants.push({
          id: qualified?.id || `${poolName}-R${rank}`,
          nama: qualified?.nama ? `${poolName} - ${qualified.nama}` : (rank === 1 ? `Juara ${poolName}` : `Peringkat ${rank} ${poolName}`),
          ptm: qualified?.ptm || '',
          sourcePool: poolName,
          poolRank: rank,
          isPlaceholder: !qualified,
          seedRank: seedMeta.seedRank || null,
          byePriority: Boolean(seedMeta.byePriority && rank === 1)
        });
      }
    });
    return entrants;
  };

  const getKOWinner = (eventId, matchId, player1, player2) => {
    if (!player1) return player2 || null;
    if (!player2) return player1 || null;
    const result = matchResults[`${eventId}_${matchId}`] || knockoutResults[`${eventId}_${matchId}`];
    if (!result?.winner) return null;
    return result.winner === 'player1' ? player1 : player2;
  };

  const getITTFSeedSlots = (size) => {
    // Urutan posisi seeded standar untuk bracket power-of-two:
    // Seed 1 di paling atas, Seed 2 paling bawah; seed berikutnya
    // tersebar ke half/quarter/eighth draw.
    let order = [1, 2];
    while (order.length < size) {
      const nextSize = order.length * 2;
      const next = [];
      order.forEach(seed => {
        next.push(seed);
        next.push(nextSize + 1 - seed);
      });
      order = next;
    }
    // order adalah seed yang menempati setiap slot dari atas ke bawah.
    const slots = {};
    order.forEach((seedNo, slotIndex) => { slots[seedNo] = slotIndex; });
    return slots;
  };

  const buildKnockoutBracket = (eventId) => {
    const entrants = getKnockoutEntrants(eventId);
    if (!entrants.length) return { bracketSize:0, byeCount:0, projectedByeCount:0, rounds:[], champion:null, slots:[], drawReady:false };

    let bracketSize=8;
    while(bracketSize<entrants.length) bracketSize*=2;

    // Proyeksi BYE boleh dihitung sejak awal, tetapi BYE hanya merupakan SLOT FIRST ROUND.
    // Tidak pernah ditulis sebagai peserta pada kolom 8 Besar/Semifinal/Final.
    const projectedByeCount=Math.max(0,bracketSize-entrants.length);
    const drawReady=entrants.every(p=>!p.isPlaceholder);
    // BYE sudah pasti dari jumlah Pool, jadi tampil sejak bracket awal.
    const byeCount=projectedByeCount;

    const slots=Array(bracketSize).fill(null);
    const used=new Set();

    // LOGIKA POSISI POOL:
    // Seeded 1 / Pool teratas selalu di slot PALING ATAS.
    // Seeded 2 / Pool terakhir selalu di slot PALING BAWAH.
    // Jika ada 2 BYE: slot 2 menjadi lawan Seeded 1,
    // dan slot sebelum terakhir menjadi lawan Seeded 2.
    const seededEntrants=entrants
      .filter(p=>p.seedRank)
      .sort((a,b)=>a.seedRank-b.seedRank);

    const seed1=seededEntrants.find(p=>Number(p.seedRank)===1);
    const seed2=seededEntrants.find(p=>Number(p.seedRank)===2);

    if(seed1){
      slots[0]=seed1;
      used.add(`${seed1.sourcePool}-${seed1.poolRank}`);
    }
    if(seed2){
      slots[bracketSize-1]=seed2;
      used.add(`${seed2.sourcePool}-${seed2.poolRank}`);
    }

    const remaining=entrants.filter(p=>!used.has(`${p.sourcePool}-${p.poolRank}`));

    // BYE adalah slot FIRST ROUND, bukan peserta.
    // BYE 1 -> tepat di bawah Seeded 1 (slot 2).
    // BYE 2 -> tepat di atas Seeded 2 (slot bracketSize-1).
    // Jika BYE lebih dari 2, sisanya disebarkan dari atas/bawah tanpa
    // mengubah dua posisi prioritas tersebut.
    const reservedByeSlots=new Set();
    if(byeCount>0){
      reservedByeSlots.add(1);
      if(byeCount>1) reservedByeSlots.add(bracketSize-2);

      let top=3;
      let bottom=bracketSize-4;
      let placed=reservedByeSlots.size;
      while(placed<byeCount && top<bracketSize){
        if(top>=0 && top<bracketSize && !reservedByeSlots.has(top)){
          reservedByeSlots.add(top);
          placed++;
          if(placed>=byeCount) break;
        }
        if(bottom>=0 && bottom<bracketSize && !reservedByeSlots.has(bottom)){
          reservedByeSlots.add(bottom);
          placed++;
        }
        top+=4;
        bottom-=4;
      }
    }

    // Pool lain mengisi semua slot non-BYE dari atas ke bawah.
    let ri=0;
    for(let i=0;i<bracketSize && ri<remaining.length;i++){
      if(!slots[i] && !reservedByeSlots.has(i)) slots[i]=remaining[ri++];
    }

    // Fallback hanya untuk menjaga data tetap utuh bila konfigurasi tidak lazim.
    for(let i=0;i<bracketSize && ri<remaining.length;i++){
      if(!slots[i]) slots[i]=remaining[ri++];
    }

    const rounds=[];
    let matches=[];
    for(let i=0;i<bracketSize;i+=2){
      matches.push({
        id:`KO_R1_M${i/2+1}`,round:1,
        player1:slots[i],player2:slots[i+1],
        slot1:i+1,slot2:i+2
      });
    }
    rounds.push(matches);

    let roundNo=2;
    while(matches.length>1){
      const next=[];
      for(let i=0;i<matches.length;i+=2){
        const a=matches[i], b=matches[i+1];

        const advance=(m)=>{
          if(!m) return null;
          if(m.player1 && m.player2) return getKOWinner(eventId,m.id,m.player1,m.player2);

          // BYE otomatis memajukan pemain, tetapi hanya sesudah draw siap.
          // Yang maju adalah PEMAIN, bukan teks "BYE".
          if(m.round===1){
            if(m.player1 && !m.player2 && !m.player1.isPlaceholder) return m.player1;
            if(!m.player1 && m.player2 && !m.player2.isPlaceholder) return m.player2;
          }
          return null;
        };

        next.push({
          id:`KO_R${roundNo}_M${Math.floor(i/2)+1}`,
          round:roundNo,
          player1:advance(a),
          player2:advance(b)
        });
      }
      matches=next;
      rounds.push(matches);
      roundNo++;
    }

    const finalMatch=rounds[rounds.length-1]?.[0];
    const champion=finalMatch ? getKOWinner(eventId,finalMatch.id,finalMatch.player1,finalMatch.player2) : null;
    return {bracketSize,byeCount,projectedByeCount,rounds,champion,slots,drawReady};
  };

  const getKnockoutMatchMeta = (eventId, orderIndex = 0) => {
    const eventData = events.find(e => String(e.id) === String(eventId));
    if (!eventData) return { jam: '-', meja: '-', tanggal: '', hari: '' };

    const poolSchedule = generateScheduleFromPools(eventId).filter(r => r.type === 'player' && r.jam && r.jam !== '-');
    const durasi = parseInt(eventData.durasiMatch) || 20;
    const maxMeja = Math.max(1, Number(eventData.jumlahMeja || 4));

    let startMinute = parseTime(eventData.jamMulai || '08:00');
    poolSchedule.forEach(row => {
      const parts = String(row.jam || '').split(' - ');
      if (parts[1] && /^\d{2}:\d{2}$/.test(parts[1])) {
        startMinute = Math.max(startMinute, parseTime(parts[1]));
      }
    });

    const slotNo = Math.floor(orderIndex / maxMeja);
    const mejaNo = (orderIndex % maxMeja) + 1;
    const mulai = startMinute + (slotNo * durasi);

    let tanggal = eventData.tanggal || '';
    if (tanggal.includes('Dari Tanggal ')) tanggal = tanggal.replace('Dari Tanggal ', '').split(' sd ')[0];

    return {
      jam: `${formatTime(mulai)} - ${formatTime(mulai + durasi)}`,
      meja: `Meja ${mejaNo}`,
      tanggal: formatDateShort(tanggal),
      hari: getDayName(tanggal)
    };
  };

  const openKnockoutLiveScore = (match) => {
    if (isPublic || isWasit) return;
    if (!selectedKnockoutEvent || !match?.player1 || !match?.player2) return;
    if (match.player1.isPlaceholder || match.player2.isPlaceholder) {
      alert('Pemain belum ditentukan dari hasil Pool.');
      return;
    }
    setSelectedEventIdForLive(String(selectedKnockoutEvent.id));
    const koMatch = {
      type: 'player',
      isKnockout: true,
      matchId: `${selectedKnockoutEvent.id}_${match.id}`,
      knockoutMatchId: match.id,
      player: match.player1,
      directPlayer1: match.player1,
      directPlayer2: match.player2,
      pool: 'Knockout',
      matchRef: match.matchRef || match.id,
      jam: match.jam || '-',
      meja: match.meja || '-',
      tanggal: match.tanggal || '',
      hari: match.hari || '',
      match: `${match.player1.nama} VS ${match.player2.nama}`
    };
    openLiveScore(koMatch);
  };

  // Jadwal menyimpan meja sebagai 'Meja 1', sedangkan Supabase menyimpan angka 1.
  const normalizeMeja = (value) => {
    const found = String(value ?? '').match(/(?:^|\bmeja\s*)(\d+)\s*$/i);
    return found ? Number(found[1]) : NaN;
  };

  const openPublicLiveScore = (match, eventId) => {
    if (!isPublic || !eventId || match?.type !== 'player' || !match.matchId) return;
    const players = getLiveMatchPlayers(match, eventId);
    setSelectedEventIdForLive(String(eventId));
    setLiveScoreMatch({
      ...match,
      directPlayer1: players.player1 || match.player || null,
      directPlayer2: players.player2 || match.opponent || null
    });
  };

  const openLiveScore = (match) => {
    // Saat dibuka dari Jadwal, gunakan event jadwal (bukan pilihan Live Score yang
    // mungkin belum terisi). Tetap wajib cocok dengan event dan meja tugas wasit.
    const sourceEventId = activeView === 'SCHEDULE'
      ? selectedScheduleEvent?.id
      : selectedLiveEvent?.id;
    if (isWasit && (
      !wasitAssignment ||
      !sourceEventId ||
      String(sourceEventId) !== String(wasitAssignment.event_id) ||
      normalizeMeja(match?.meja) !== normalizeMeja(wasitAssignment.nomor_meja)
    )) { alert('Pertandingan ini bukan meja tugas Anda.'); return; }
    if (match.type !== 'player' || !match.matchId) return;
    // Menjaga proses Simpan/Hapus dan pemuatan pemain tetap memakai event yang sama.
    if (sourceEventId && String(selectedEventIdForLive) !== String(sourceEventId)) {
      setSelectedEventIdForLive(String(sourceEventId));
    }
    activeVoiceSetRef.current = 0;
    setActiveVoiceSet(0);
    if (!isPublic) setVoiceStatus('SET 1 aktif — klik mikrofon lalu sebut nama dan skor');
    setLiveScoreMatch(match);
    const existingResult = matchResults[match.matchId];
    if (existingResult) {
      setLivePlayer1Score(existingResult.player1Score || 0);
      setLivePlayer2Score(existingResult.player2Score || 0);
      setLivePoint1(existingResult.point1 || 0);
      setLivePoint2(existingResult.point2 || 0);
      setLiveWinner(existingResult.winner || '');
      setLiveGameHistory(existingResult.gameHistory || []);
      setSignatureWinner(existingResult.signatureWinner || '');
      setSignatureLoser(existingResult.signatureLoser || '');
      setSignatureReferee(existingResult.signatureReferee || '');
    } else {
      setLivePlayer1Score(0);
      setLivePlayer2Score(0);
      setLivePoint1(0);
      setLivePoint2(0);
      setLiveWinner('');
      setLiveGameHistory([]);
      setSignatureWinner('');
      setSignatureLoser('');
      setSignatureReferee('');
    }
    setCurrentGameP1(0);
    setCurrentGameP2(0);
  };

  const saveLiveScoreResult = async (closeAfterSave = true) => {
    if (isWasit && (!wasitAssignment || String(selectedLiveEvent?.id) !== String(wasitAssignment.event_id) || normalizeMeja(liveScoreMatch?.meja) !== normalizeMeja(wasitAssignment.nomor_meja))) { alert('Akses skor ditolak: bukan meja tugas Anda.'); return; }
    if (!liveScoreMatch) return;
    const calculatedScore = liveGameHistory.reduce(
      (score, game) => {
        const p1 = Number(game?.p1 || 0);
        const p2 = Number(game?.p2 || 0);
        if (p1 > p2) { score.player1 += 1; }
        if (p2 > p1) { score.player2 += 1; }
        return score;
      },
      { player1: 0, player2: 0 }
    );
    let finalWinner = liveWinner;
    if (!finalWinner) {
      if (calculatedScore.player1 > calculatedScore.player2) {
        finalWinner = 'player1';
      } else if (calculatedScore.player2 > calculatedScore.player1) {
        finalWinner = 'player2';
      } else {
        alert('Skor masih 0-0 atau seri. Mohon isi skor set terlebih dahulu.');
        return;
      }
    }
    const result = {
      player1Score: calculatedScore.player1,
      player2Score: calculatedScore.player2,
      score: `${calculatedScore.player1} - ${calculatedScore.player2}`,
      winner: finalWinner,
      point1: Number(livePoint1),
      point2: Number(livePoint2),
      gameHistory: [...liveGameHistory],
      signatureWinner,
      signatureLoser,
      signatureReferee,
      updatedAt: new Date().toISOString()
    };
    setMatchResults(prev => ({
      ...prev,
      [liveScoreMatch.matchId]: result
    }));
    try {
      await saveOnlineMatch(selectedLiveEvent?.id, liveScoreMatch.matchId, result);
    } catch (error) {
      console.error('Gagal menyimpan hasil pertandingan:', error);
      showSaveFeedback(false);
      return;
    }
    if (liveScoreMatch.isKnockout) {
      setKnockoutResults(prev => ({
        ...prev,
        [liveScoreMatch.matchId]: result
      }));
    }
    const eventId = selectedLiveEvent?.id;
    if (eventId) {
      setTimeout(() => {
        calculatePoolRankings(eventId);
      }, 100);
    }
    showSaveFeedback(true);
    const wasKnockout = Boolean(liveScoreMatch.isKnockout);
    if (closeAfterSave) {
      setLiveScoreMatch(null);
      setActiveView(wasKnockout ? 'KNOCKOUT' : 'LIVE_SCORE');
      if (wasKnockout) {
        setSelectedEventIdForKnockout(String(eventId));
      } else {
        setSelectedEventIdForLive(String(eventId));
      }
    }
  };

  // Tombol simpan menunggu sinkronisasi online sebelum menutup form.
  const handleLiveScoreSave = () => saveLiveScoreResult(true);
  const handleLiveScoreSubmit = () => saveLiveScoreResult(true);

  const handleDeleteMatch = () => {
    if (isWasit && (!wasitAssignment || String(selectedLiveEvent?.id) !== String(wasitAssignment.event_id) || normalizeMeja(liveScoreMatch?.meja) !== normalizeMeja(wasitAssignment.nomor_meja))) { alert('Akses skor ditolak: bukan meja tugas Anda.'); return; }
    if (!liveScoreMatch) return;
    if (window.confirm('Apakah Anda yakin ingin menghapus hasil pertandingan ini? Data akan dikosongkan dan bisa diisi ulang.')) {
      const matchId = liveScoreMatch.matchId;
      const updatedMatchResults = { ...matchResults };
      delete updatedMatchResults[matchId];
      setMatchResults(updatedMatchResults);
      localStorage.setItem('spinmatch_match_results', JSON.stringify(updatedMatchResults));
      saveOnlineMatch(selectedLiveEvent?.id, matchId, null)
        .catch(error => alert('Gagal menghapus skor online: ' + error.message));
      if (liveScoreMatch.isKnockout) {
        setKnockoutResults(prev => {
          const next = { ...prev };
          delete next[matchId];
          return next;
        });
      }
      const eventId = selectedLiveEvent?.id;
      if (eventId && !liveScoreMatch.isKnockout) {
        setTimeout(() => {
          calculatePoolRankings(eventId);
        }, 100);
      }
      const wasKnockout = Boolean(liveScoreMatch.isKnockout);
      alert(wasKnockout ? 'Hasil Knockout berhasil dihapus!' : 'Hasil pertandingan berhasil dihapus!');
      setLiveScoreMatch(null);
      setActiveView(wasKnockout ? 'KNOCKOUT' : 'LIVE_SCORE');
      if (wasKnockout) setSelectedEventIdForKnockout(String(eventId));
      else setSelectedEventIdForLive(String(eventId));
    }
  };



  const handleSaveMatchResult = async (matchId, result) => {
    setMatchResults({
      ...matchResults,
      [matchId]: result
    });
    if (selectedScheduleEvent?.id) {
      try {
        await saveOnlineMatch(selectedScheduleEvent.id, matchId, result);
      } catch (error) {
        console.error('Gagal menyimpan hasil pertandingan:', error);
        showSaveFeedback(false);
        return false;
      }
    }
    if (selectedScheduleEvent) {
      setTimeout(() => {
        calculatePoolRankings(selectedScheduleEvent.id);
      }, 100);
    }
    showSaveFeedback(true);
    return true;
  };

  const handleOpenMatchResult = (match) => {
    if (match.type !== 'player' || !match.matchId) return;
    setSelectedMatch(match);
    setShowMatchResultModal(true);
  };

  const handleSaveResult = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const result = {
      player1Score: formData.get('player1Score') ? parseInt(formData.get('player1Score')) : 0,
      player2Score: formData.get('player2Score') ? parseInt(formData.get('player2Score')) : 0,
      winner: formData.get('winner'),
      point1: formData.get('point1') ? parseInt(formData.get('point1')) : 0,
      point2: formData.get('point2') ? parseInt(formData.get('point2')) : 0
    };
    if (selectedMatch) {
      const saved = await handleSaveMatchResult(selectedMatch.matchId, result);
      if (!saved) return;
    }
    setShowMatchResultModal(false);
  };

  const handleDownloadSchedulePdf = () => {
    if (!selectedScheduleEvent) {
      alert('Pilih event terlebih dahulu untuk mengunduh jadwal.');
      return;
    }

    try {
      const eventId = selectedScheduleEvent.id;
      const pageWidth = 842;
      const pageHeight = 595;
      const margin = 28;
      const tableTop = 92;
      const tableWidth = pageWidth - margin * 2;
      const columnWidths = [42, 116, 95, 48, 82, 42, 68, 54, 58, 110, 71];
      const headers = ['Pool', 'Nama Pemain', 'Club/PTM', 'Match', 'Jam Main', 'Meja', 'Tgl Main', 'Hari', 'Point', 'Pemenang', 'Keterangan'];
      const rows = [];
      const rankings = poolRankings[eventId] || {};

      generateScheduleFromPools(eventId).forEach(row => {
        if (row.type === 'pool_header') {
          rows.push({ type: 'pool', cells: [row.pool] });
        } else if (row.type === 'empty_row') {
          rows.push({ type: 'space' });
        } else if (row.type === 'player' || row.type === 'single_player') {
          const poolRanking = rankings[row.pool] || [];
          const playerRanking = poolRanking.find(ranking => ranking.id === row.player.id);
          const result = row.type === 'player' ? row.result : null;
          const { player1, player2 } = result ? getLiveMatchPlayers(row, eventId) : {};
          const winner = result?.winner === 'player1' ? player1?.nama : result?.winner === 'player2' ? player2?.nama : '';
          rows.push({
            type: 'data',
            cells: [
              row.playerCode || row.pool || '-',
              row.player?.nama || '-',
              row.player?.ptm || row.player?.club || '-',
              row.type === 'player' ? row.matchLabel || '-' : '-',
              row.type === 'player' ? row.jam || '-' : '-',
              row.type === 'player' ? row.meja || '-' : '-',
              row.type === 'player' ? row.tanggal || '-' : '-',
              row.type === 'player' ? (getDayName(row.tanggal) !== '-' ? getDayName(row.tanggal) : row.hari || '-') : '-',
              result ? `${result.player1Score} - ${result.player2Score}` : '',
              winner || '',
              playerRanking?.keterangan || '',
            ],
          });
        }
      });

      const pdfSafeText = value => String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[–—]/g, '-')
        .replace(/[“”]/g, '"')
        .replace(/[’‘]/g, "'")
        .replace(/[^\x20-\x7E]/g, '?');
      const escapePdfText = value => pdfSafeText(value).replace(/[\\()]/g, '\\$&');
      const truncateText = (value, width, fontSize) => {
        const text = pdfSafeText(value);
        const maxChars = Math.max(1, Math.floor((width - 8) / (fontSize * 0.52)));
        return text.length > maxChars ? `${text.slice(0, Math.max(1, maxChars - 3))}...` : text;
      };
      const pdfPages = [];
      let commands = '';
      let cursorY = tableTop;
      let pageNumber = 0;

      const addText = (value, x, top, fontSize, color = '0.12 0.16 0.22') => {
        commands += `${color} rg BT /F1 ${fontSize} Tf 1 0 0 1 ${x} ${pageHeight - top - fontSize} Tm (${escapePdfText(value)}) Tj ET\n`;
      };
      const addRect = (x, top, width, height, fillColor, strokeColor = '0.78 0.82 0.87') => {
        commands += `${fillColor} rg ${strokeColor} RG 0.5 w ${x} ${pageHeight - top - height} ${width} ${height} re B\n`;
      };
      const startPage = () => {
        pageNumber += 1;
        commands = '';
        cursorY = tableTop;
        const title = 'JADWAL PERTANDINGAN';
        const eventName = pdfSafeText(selectedScheduleEvent.nama || '').toUpperCase();
        addText(title, (pageWidth - title.length * 9) / 2, 24, 16, '0.04 0.22 0.42');
        addText(eventName, Math.max(margin, (pageWidth - eventName.length * 6) / 2), 47, 11);
        addText(`${selectedScheduleEvent.tanggal || '-'}    |    Halaman ${pageNumber}`, margin, 67, 9, '0.35 0.39 0.44');
        headers.forEach((header, index) => {
          const x = margin + columnWidths.slice(0, index).reduce((sum, width) => sum + width, 0);
          addRect(x, cursorY, columnWidths[index], 24, '0.91 0.94 0.97');
          addText(truncateText(header, columnWidths[index], 7), x + 4, cursorY + 7, 7, '0.08 0.12 0.18');
        });
        cursorY += 24;
      };
      const finishPage = () => {
        addText('Dicetak dari SpinMatch', margin, pageHeight - 24, 8, '0.4 0.44 0.5');
        pdfPages.push(commands);
      };

      startPage();
      rows.forEach(row => {
        if (row.type === 'space') {
          cursorY += 8;
          return;
        }
        const rowHeight = row.type === 'pool' ? 20 : 22;
        if (cursorY + rowHeight > pageHeight - 38) {
          finishPage();
          startPage();
        }
        if (row.type === 'pool') {
          addRect(margin, cursorY, tableWidth, rowHeight, '0.96 0.97 0.98');
          addText(row.cells[0], margin + 5, cursorY + 5, 8, '0.12 0.16 0.22');
        } else {
          let x = margin;
          row.cells.forEach((cell, index) => {
            addRect(x, cursorY, columnWidths[index], rowHeight, '1 1 1');
            addText(truncateText(cell, columnWidths[index], 6.5), x + 4, cursorY + 7, 6.5);
            x += columnWidths[index];
          });
        }
        cursorY += rowHeight;
      });
      finishPage();

      const objects = [];
      const pageObjectIds = pdfPages.map((_, index) => 3 + index * 2);
      objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
      objects[2] = `<< /Type /Pages /Kids [${pageObjectIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pdfPages.length} >>`;
      pdfPages.forEach((content, index) => {
        const pageId = pageObjectIds[index];
        const streamId = pageId + 1;
        objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${3 + pdfPages.length * 2} 0 R >> >> /Contents ${streamId} 0 R >>`;
        objects[streamId] = `<< /Length ${content.length} >>\nstream\n${content}endstream`;
      });
      const fontId = 3 + pdfPages.length * 2;
      objects[fontId] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

      let pdf = '%PDF-1.4\n';
      const offsets = [0];
      for (let id = 1; id < objects.length; id += 1) {
        offsets[id] = pdf.length;
        pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
      }
      const xrefOffset = pdf.length;
      pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
      for (let id = 1; id < objects.length; id += 1) {
        pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
      }
      pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeEventName = pdfSafeText(selectedScheduleEvent.nama || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'event';
      link.href = url;
      link.download = `jadwal-${safeEventName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Gagal membuat PDF jadwal:', error);
      alert(`PDF jadwal gagal dibuat: ${error?.message || 'Terjadi kesalahan.'}`);
    }
  };

  const handleDownloadKnockoutPdf = () => {
    if (!selectedKnockoutEvent) {
      alert('Pilih event terlebih dahulu untuk mengunduh bagan Knockout.');
      return;
    }
    try {
      const eventId = selectedKnockoutEvent.id;
      const bracket = buildKnockoutBracket(eventId);
      const safeText = value => String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\x20-\x7E]/g, '?')
        .replace(/[\\()]/g, '\\$&');
      const rows = [];
      (bracket.rounds || []).forEach((round, roundIndex) => {
        const roundName = round.length === 1 ? 'FINAL' : round.length === 2 ? 'SEMIFINAL' : `${round.length * 2} BESAR`;
        rows.push({ title: roundName });
        round.forEach((match, matchIndex) => {
          const result = knockoutResults[`${eventId}_${match.id}`] || matchResults[`${eventId}_${match.id}`];
          const player1 = match.player1?.nama || 'Menunggu pemain';
          const player2 = match.player2?.nama || 'Menunggu pemain';
          const score = result ? `${result.player1Score ?? 0} - ${result.player2Score ?? 0}` : 'Belum dimainkan';
          const winner = result?.winner === 'player1' ? player1 : result?.winner === 'player2' ? player2 : '';
          rows.push({ text: `${match.id || `M${matchIndex + 1}`}  ${player1} vs ${player2}  |  ${score}${winner ? `  |  Pemenang: ${winner}` : ''}` });
        });
        if (roundIndex < bracket.rounds.length - 1) rows.push({ spacer: true });
      });
      const pageWidth = 842;
      const pageHeight = 595;
      const rowsPerPage = 35;
      const chunks = [];
      for (let index = 0; index < rows.length; index += rowsPerPage) chunks.push(rows.slice(index, index + rowsPerPage));
      if (!chunks.length) chunks.push([{ text: 'Belum ada peserta Knockout.' }]);
      const pages = chunks.map((chunk, pageIndex) => {
        let content = '';
        const addText = (text, x, y, size, color = '0.12 0.16 0.22') => {
          content += `${color} rg BT /F1 ${size} Tf 1 0 0 1 ${x} ${y} Tm (${safeText(text)}) Tj ET\n`;
        };
        addText('BAGAN KNOCKOUT', 320, 550, 16, '0.04 0.22 0.42');
        addText(String(selectedKnockoutEvent.nama || '').toUpperCase(), 28, 526, 11);
        addText(`Tanggal: ${selectedKnockoutEvent.tanggal || '-'}    Halaman ${pageIndex + 1}`, 28, 509, 9, '0.35 0.39 0.44');
        let y = 480;
        chunk.forEach(row => {
          if (row.spacer) {
            y -= 8;
          } else if (row.title) {
            content += `0.93 0.95 0.97 rg 28 ${y - 5} 786 18 re f\n`;
            addText(row.title, 36, y, 9, '0.08 0.12 0.18');
            y -= 24;
          } else {
            addText(row.text, 36, y, 8);
            y -= 14;
          }
        });
        addText('SpinMatch', 28, 18, 8, '0.4 0.44 0.5');
        return content;
      });
      const objects = [];
      const pageIds = pages.map((_, index) => 3 + index * 2);
      objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
      objects[2] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`;
      pages.forEach((content, index) => {
        const pageId = pageIds[index];
        const streamId = pageId + 1;
        objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${3 + pages.length * 2} 0 R >> >> /Contents ${streamId} 0 R >>`;
        objects[streamId] = `<< /Length ${content.length} >>\nstream\n${content}endstream`;
      });
      objects[3 + pages.length * 2] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
      let pdf = '%PDF-1.4\n';
      const offsets = [0];
      for (let id = 1; id < objects.length; id += 1) {
        offsets[id] = pdf.length;
        pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
      }
      const xrefOffset = pdf.length;
      pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
      for (let id = 1; id < objects.length; id += 1) pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
      pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeName = safeText(selectedKnockoutEvent.nama || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'event';
      link.href = url;
      link.download = `knockout-${safeName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Gagal membuat PDF Knockout:', error);
      alert(`PDF Knockout gagal dibuat: ${error?.message || 'Terjadi kesalahan.'}`);
    }
  };

  const handlePrint = () => {
    if (!selectedScheduleEvent) {
      alert('Pilih event terlebih dahulu untuk mencetak jadwal.');
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Jendela cetak diblokir browser. Izinkan pop-up untuk mengunduh jadwal sebagai PDF.');
      return;
    }
    const eventData = selectedScheduleEvent;
    const scheduleData = generateScheduleFromPools(selectedScheduleEvent.id);
    const rankings = poolRankings[selectedScheduleEvent.id] || {};
    let tableRows = '';
    let currentPool = '';
    scheduleData.forEach((row) => {
      if (row.type === 'pool_header') {
        if (currentPool !== '') {
          tableRows += `<tr><td colspan="11" style="height: 20px;"></td></tr>`;
        }
        tableRows += `<tr style="background-color: #f1f5f9;"><td colspan="11" style="padding: 8px; font-weight: bold; text-align: left;">${row.pool}</td></tr>`;
        currentPool = row.pool;
      } else if (row.type === 'player') {
        const hasResult = row.result !== null;
        const { player1: p1, player2: p2 } = getLiveMatchPlayers(row, selectedScheduleEvent?.id);
        const winnerName = hasResult ? (row.result.winner === 'player1' ? (p1?.nama || '-') : (p2?.nama || '-')) : '-';
        const pointStr = hasResult ? `${row.result.player1Score} - ${row.result.player2Score}` : '';
        const poolRanking = rankings[row.pool] || [];
        const playerRanking = poolRanking.find(r => r.id === row.player.id);
        const keterangan = hasResult && playerRanking ? playerRanking.keterangan : '';
        tableRows += `
          <tr>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center; font-weight: bold;">${row.playerCode}</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px;">${row.player.nama}</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px;">${row.player.ptm}</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center; color: #059669; font-weight: bold;">${row.matchLabel}</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center;">${row.jam}</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center;">${row.meja}</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center;">${row.tanggal}</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center;">${getDayName(row.tanggal) !== '-' ? getDayName(row.tanggal) : (row.hari || '-')}</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center; font-weight: bold;">${pointStr}</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center; color: #059669; font-weight: bold;">${winnerName}</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center;">${keterangan}</td>
          </tr>
        `;
      } else if (row.type === 'single_player') {
        const poolRanking = rankings[row.pool] || [];
        const playerRanking = poolRanking.find(r => r.id === row.player.id);
        const keterangan = playerRanking ? playerRanking.keterangan : '';
        tableRows += `
          <tr>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center; font-weight: bold;">${row.playerCode}</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px;">${row.player.nama}</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px;">${row.player.ptm}</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center;">-</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center;">-</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center;">-</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center;">-</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center;">-</td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center;"></td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center;"></td>
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center; color: #059669; font-weight: bold;">${keterangan}</td>
          </tr>
        `;
      }
    });
    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Jadwal Pertandingan - ${eventData?.nama}</title>
        <style>
          @page { size: ${printPaperSize} ${printOrientation}; margin: 1cm; }
          body { font-family: Arial, sans-serif; font-size: 10px; margin: 0; padding: 20px; }
          h2 { text-align: center; margin: 0 0 5px 0; font-size: 14px; }
          h3 { text-align: center; margin: 0 0 15px 0; font-size: 12px; color: #64748b; }
          table { width: max-content; min-width: 100%; border-collapse: collapse; margin-top: 10px; white-space: nowrap; }
          th { background-color: #f1f5f9; padding: 8px; text-align: center; font-weight: bold; border: 1px solid #e2e8f0; }
          td { border: 1px solid #e2e8f0; padding: 6px; white-space: nowrap; }
          .header-row { background-color: #f1f5f9; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <button onclick="window.print()" style="margin-bottom: 15px; padding: 8px 16px; background: #059669; color: white; border: none; border-radius: 6px; cursor: pointer;">🖨️ Print</button>
        <h2>JADWAL PERTANDINGAN</h2>
        <h3>${eventData?.nama?.toUpperCase()}</h3>
        <p style="text-align: center; margin-bottom: 15px;"><strong>${eventData?.tanggal}</strong></p>
        <p style="font-size: 10px; margin: 8px 0;"><strong>Keterangan:</strong> PM = Pemain Menang &nbsp; | &nbsp; PK = Pemain Kalah &nbsp; | &nbsp; M1/M2/M3 = Nomor pertandingan</p>
        <table>
          <thead>
            <tr class="header-row">
              <th>Pool</th>
              <th>Nama Pemain</th>
              <th>Club/PTM</th>
              <th>Match</th>
              <th>Jam Main</th>
              <th>Meja</th>
              <th>Tgl Main</th>
              <th>Hari</th>
              <th>Point</th>
              <th>Pemenang</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;
    printWindow.document.write(printHTML);
    printWindow.document.close();
    setShowPrintModal(false);
  };

    // ============================================================
    // DASHBOARD - DATA EVENT AKTIF
    // Semua angka dashboard mengikuti event aktif yang sama
    // ============================================================

    const activeHeroEvents = events.filter(
      e => String(e.status || '').toLowerCase() === 'aktif'
    );

    const publicSelectedEvent = isPublic && publicViewedEventId
      ? events.find(ev => String(ev.id) === String(publicViewedEventId))
      : null;

    const selectedDashboardEvent = events.find(
      eventItem => String(eventItem.id) === String(selectedDashboardEventId)
    );
    const heroEvents = publicSelectedEvent
      ? [publicSelectedEvent]
      : selectedDashboardEvent
        ? [selectedDashboardEvent]
        : (activeHeroEvents.length > 0 ? activeHeroEvents : events.slice(0, 1));

    const safeHeroIndex = heroEvents.length > 0
      ? Math.min(heroEventIndex, heroEvents.length - 1)
      : 0;

    const dashboardActiveEvent = heroEvents[safeHeroIndex] || null;
    const dashboardActiveEventId = dashboardActiveEvent?.id ?? null;

    const dashboardParticipants = dashboardActiveEventId !== null
      ? (
          participants[dashboardActiveEventId] ||
          participants[String(dashboardActiveEventId)] ||
          []
        )
      : [];

    const getEventParticipantCount = (eventItem) => {
      if (!eventItem) return 0;

      const eventId = String(eventItem.id);
      const registeredParticipants =
        participants[eventId] ||
        participants[eventItem.id] ||
        [];
      if (registeredParticipants.length > 0) return registeredParticipants.length;

      const eventPoolData = poolResults[eventId] || poolResults[eventItem.id] || {};
      const scheduledPlayers = Object.values(eventPoolData.pools || {})
        .flat()
        .filter(player => player && (player.id != null || player.nama));
      const uniqueScheduledPlayers = new Set(
        scheduledPlayers.map(player => {
          if (player.id != null) return `id:${player.id}`;
          if (player.customId) return `custom:${player.customId}`;
          return `name:${String(player.nama || '').trim().toLowerCase()}|${String(player.ptm || '').trim().toLowerCase()}|${String(player.divisi || '').trim().toLowerCase()}`;
        })
      );

      return uniqueScheduledPlayers.size ||
        Math.max(0, Number(eventPoolData.config?.totalPlayers) || 0);
    };

    const totalPeserta = getEventParticipantCount(dashboardActiveEvent);

    const goHeroPrevious = () => {
      if (heroEvents.length <= 1) return;
      setHeroEventIndex(current =>
        current <= 0 ? heroEvents.length - 1 : current - 1
      );
    };

    const goHeroNext = () => {
      if (heroEvents.length <= 1) return;
      setHeroEventIndex(current =>
        current >= heroEvents.length - 1 ? 0 : current + 1
      );
    };

    // Jumlah event yang statusnya Aktif
    const totalEventAktif = activeHeroEvents.length;

    // =====================================================
    // DASHBOARD LIVE MEJA - mengikuti event hero yang dipilih
    // =====================================================
    const dashboardJumlahMeja = Math.max(
      1,
      Number(
        dashboardActiveEvent?.jumlahMeja ||
        dashboardActiveEvent?.jumlahmeja ||
        4
      )
    );

    const dashboardScheduleRows = dashboardActiveEvent
      ? generateScheduleFromPools(dashboardActiveEvent.id).filter(
          row => row?.type === 'player' && row?.showMatch && row?.matchId
        )
      : [];

    const dashboardTableCards = Array.from(
      { length: dashboardJumlahMeja },
      (_, index) => {
        const tableNo = index + 1;
        const tableName = `Meja ${tableNo}`;

        const rowsForTable = dashboardScheduleRows.filter(
          row => String(row.meja || '').toLowerCase() === tableName.toLowerCase()
        );

        const runningRow = rowsForTable.find(
          row => liveScoreMatch?.matchId && String(row.matchId) === String(liveScoreMatch.matchId)
        );

        const unfinishedRow = rowsForTable.find(row => !matchResults[row.matchId]);
        const latestFinishedRow = [...rowsForTable]
          .reverse()
          .find(row => matchResults[row.matchId]);

        const row = runningRow || unfinishedRow || latestFinishedRow || null;
        const result = row?.matchId ? matchResults[row.matchId] : null;
        const isLive = Boolean(
          runningRow &&
          selectedLiveEvent?.id &&
          String(selectedLiveEvent.id) === String(dashboardActiveEvent?.id)
        );
        const isFinished = Boolean(result && !isLive);

        let point1 = 0;
        let point2 = 0;

        if (isLive) {
          point1 = Number(livePoint1 || currentGameP1 || 0);
          point2 = Number(livePoint2 || currentGameP2 || 0);
        } else if (result) {
          point1 = Number(result.point1 || result.player1Score || 0);
          point2 = Number(result.point2 || result.player2Score || 0);
        }

        return {
          tableNo,
          tableName,
          row,
          result,
          isLive,
          isFinished,
          point1,
          point2,
          hasSchedule: rowsForTable.length > 0
        };
      }
    );

    const dashboardLiveCount = dashboardTableCards.filter(card => card.isLive).length;
    const dashboardReadyCount = dashboardTableCards.filter(
      card => card.hasSchedule && !card.isLive && !card.isFinished
    ).length;

    const dashboardMatchResultCount = dashboardActiveEventId === null
      ? 0
      : Object.keys(matchResults || {}).filter(matchId =>
          String(matchId).startsWith(`${dashboardActiveEventId}_`)
        ).length;

    // Total uang pendaftaran KHUSUS event aktif
    const dashboardTotalOmzet = dashboardParticipants.reduce(
      (sum, p) => sum + (Number(p.nilaiBayar) || 0),
      0
    );

    const configDivisiData = selectedDivisiForConfig
    ? divisiList.find(d => d.nama === selectedDivisiForConfig)
    : null;
  const currentEventParticipants = selectedEventItem ? (participants[selectedEventItem.id] || []) : [];
  const totalSaldoDaftar = currentEventParticipants.reduce((sum, p) => sum + (p.nilaiBayar || 0), 0);
  const drawEventParticipants = selectedDrawEvent ? (participants[selectedDrawEvent.id] || []) : [];
  const currentSeedData = seededPlayers[selectedDrawEvent?.id] || {};
  const drawProjection = getDrawProjection(selectedDrawEvent, drawEventParticipants.length);
  const drawSeedKeys = Array.from({ length: drawProjection.numPools }, (_, i) => `seed${i + 1}`);
  const drawSeedPoolIndexes = getSeedPoolIndexes(drawProjection.numPools, drawProjection.numPools);
  const currentPoolData = poolResults[selectedDrawEvent?.id] || null;
  const schedulePoolData = poolResults[selectedScheduleEvent?.id] || null;
  const scheduleRows = selectedScheduleEvent ? generateScheduleFromPools(selectedScheduleEvent.id) : [];
  const currentRankings = poolRankings[selectedScheduleEvent?.id] || {};
  const liveScorePoolData = poolResults[selectedLiveEvent?.id] || null;
  const liveScoreRows = selectedLiveEvent ? generateScheduleFromPools(selectedLiveEvent.id).filter(row => {
    if (!isWasit) return true;
    // Jadwal memakai 'Meja 1', sedangkan penugasan Supabase memakai angka 1.
    // Jangan tampilkan header pool kosong atau baris meja lain untuk wasit.
    return row.type === 'player' && row.showMatch &&
      normalizeMeja(row.meja) === normalizeMeja(wasitAssignment?.nomor_meja);
  }) : [];
  const visibleLiveScoreRows = isPublic && publicLiveTable !== 'ALL' ? liveScoreRows.filter(row => row.type === 'player' && normalizeMeja(row.meja) === Number(publicLiveTable)) : liveScoreRows;
  const liveScoreRankings = poolRankings[selectedLiveEvent?.id] || {};

  const publicLiveScoreResult = liveScoreMatch
    ? matchResults[liveScoreMatch.matchId]
    : null;
  const publicLiveScoreSnapshot = liveScoreMatch
    ? onlineLiveScores[liveScoreMatch.matchId] || publicLiveScoreResult?.liveScore || null
    : null;
  const publicLiveScoreGames = [
    publicLiveScoreSnapshot?.gameHistory,
    publicLiveScoreResult?.gameHistory
  ].find(games =>
    Array.isArray(games) &&
    games.some(game =>
      game?.p1 !== '' && game?.p2 !== '' &&
      game?.p1 != null && game?.p2 != null
    )
  ) || [];
  const publicLiveSetWins = publicLiveScoreGames.reduce(
    (score, game) => {
      const p1 = Number(game?.p1);
      const p2 = Number(game?.p2);
      if (game?.p1 === '' || game?.p2 === '' || !Number.isFinite(p1) || !Number.isFinite(p2) || p1 === p2) return score;
      if (p1 > p2) score.player1 += 1;
      else score.player2 += 1;
      return score;
    },
    { player1: 0, player2: 0 }
  );

  const calculatedGameScore = liveGameHistory.reduce(
    (score, game) => {
      const p1 = Number(game?.p1 || 0);
      const p2 = Number(game?.p2 || 0);
      if (p1 > p2) { score.player1 += 1; }
      if (p2 > p1) { score.player2 += 1; }
      return score;
    },
    { player1: 0, player2: 0 }
  );

  const liveMatchPlayers = liveScoreMatch
    ? getLiveMatchPlayers(liveScoreMatch, selectedLiveEvent?.id)
    : { player1: null, player2: null };

  const automaticWinnerPlayer =
    calculatedGameScore.player1 > calculatedGameScore.player2 ? liveMatchPlayers.player1 :
    calculatedGameScore.player2 > calculatedGameScore.player1 ? liveMatchPlayers.player2 : null;
  const automaticLoserPlayer =
    calculatedGameScore.player1 > calculatedGameScore.player2 ? liveMatchPlayers.player2 :
    calculatedGameScore.player2 > calculatedGameScore.player1 ? liveMatchPlayers.player1 : null;

  const activateLiveSet = (setIndex) => {
    activeVoiceSetRef.current = setIndex;
    setActiveVoiceSet(setIndex);
    setVoiceStatus(`SET ${setIndex + 1} aktif — siap input suara, tap, atau ketik manual`);
  };

  const updateLiveSetScore = (setIndex, player, value) => {
    setLiveGameHistory((previous) => {
      const next = [...previous];
      next[setIndex] = {
        ...(next[setIndex] || { p1: '', p2: '' }),
        [player]: value === '' ? '' : Math.max(0, Number(value))
      };
      return next;
    });
  };

  const clearLiveSetScores = () => {
    setLiveGameHistory([]);
    setLivePlayer1Score(0);
    setLivePlayer2Score(0);
    setLivePoint1(0);
    setLivePoint2(0);
    setLiveWinner('');
  };

  const filteredScheduleRows = scheduleRows.filter(row => {
    if (!searchTerm) return true;
    if (row.type !== 'player' && row.type !== 'single_player') return true;
    const searchLower = searchTerm.toLowerCase();
    return row.player?.nama?.toLowerCase().includes(searchLower) ||
      row.player?.ptm?.toLowerCase().includes(searchLower);
  });


  // ============================================================
  // PERINGKAT & POIN
  // Poin awal: menang 3, kalah 0. Rumus dipusatkan di sini agar
  // mudah diganti nanti tanpa merombak UI.
  // ============================================================
  const selectedRankingEvent = events.find(
    e => String(e.id) === String(selectedEventIdForRanking)
  ) || events[0] || null;

  const rankingDivisionOptions = rankingMode === 'EVENT'
    ? (selectedRankingEvent?.divisiList || []).map(d => d.nama)
    : Array.from(new Set(
        events.flatMap(e => (e.divisiList || []).map(d => d.nama)).filter(Boolean)
      ));

  const effectiveRankingDivision =
    rankingDivisionOptions.includes(selectedDivisionForRanking)
      ? selectedDivisionForRanking
      : (rankingDivisionOptions[0] || '');

  const buildEventRanking = (eventItem, divisionName) => {
    if (!eventItem || !divisionName) return [];

    const eventPlayers = (
      participants[eventItem.id] ||
      participants[String(eventItem.id)] ||
      []
    ).filter(p => String(p.divisi || '').toLowerCase() === String(divisionName).toLowerCase());

    const allowedIds = new Set(eventPlayers.map(p => String(p.id)));
    const allowedNames = new Set(eventPlayers.map(p => String(p.nama || '').trim().toLowerCase()));
    const rows = generateScheduleFromPools(eventItem.id)
      .filter(r => r?.type === 'player' && r?.showMatch && r?.matchId);

    const stats = {};
    eventPlayers.forEach(p => {
      const key = String(p.id || p.nama);
      stats[key] = {
        id: p.id,
        nama: p.nama || '-',
        ptm: p.ptm || p.club || p.klub || '-',
        main: 0, menang: 0, kalah: 0, poin: 0, setMenang:0, setKalah:0, bolaMenang:0, bolaKalah:0, skor30:0, skor31:0, skor32:0,
        eventCount: 1
      };
    });

    rows.forEach(row => {
      const result = matchResults[row.matchId];
      if (!result || !row.player || !row.opponent) return;

      const p1Allowed = allowedIds.has(String(row.player.id)) ||
        allowedNames.has(String(row.player.nama || '').trim().toLowerCase());
      const p2Allowed = allowedIds.has(String(row.opponent.id)) ||
        allowedNames.has(String(row.opponent.nama || '').trim().toLowerCase());
      if (!p1Allowed || !p2Allowed) return;

      const key1 = String(row.player.id || row.player.nama);
      const key2 = String(row.opponent.id || row.opponent.nama);

      if (!stats[key1]) stats[key1] = { id: row.player.id, nama: row.player.nama, ptm: row.player.ptm || '-', main:0, menang:0, kalah:0, poin:0, setMenang:0, setKalah:0, bolaMenang:0, bolaKalah:0, skor30:0, skor31:0, skor32:0, eventCount:1 };
      if (!stats[key2]) stats[key2] = { id: row.opponent.id, nama: row.opponent.nama, ptm: row.opponent.ptm || '-', main:0, menang:0, kalah:0, poin:0, setMenang:0, setKalah:0, bolaMenang:0, bolaKalah:0, skor30:0, skor31:0, skor32:0, eventCount:1 };

      stats[key1].main += 1;
      stats[key2].main += 1;

      if (result.winner !== 'player1' && result.winner !== 'player2') return;
      const s1 = Number(result.player1Score || 0), s2 = Number(result.player2Score || 0);
      stats[key1].setMenang += s1; stats[key1].setKalah += s2;
      stats[key2].setMenang += s2; stats[key2].setKalah += s1;
      (result.gameHistory || []).forEach(game => {
        if (game?.p1 === '' || game?.p2 === '' || game?.p1 == null || game?.p2 == null) return;
        const a=Number(game.p1), b=Number(game.p2);
        if (!Number.isFinite(a) || !Number.isFinite(b)) return;
        stats[key1].bolaMenang += a; stats[key1].bolaKalah += b;
        stats[key2].bolaMenang += b; stats[key2].bolaKalah += a;
      });
      const winning = result.winner === 'player1' ? stats[key1] : stats[key2];
      const losing = result.winner === 'player1' ? stats[key2] : stats[key1];
      winning.menang++; winning.poin+=3; losing.kalah++;
      const loserSets = result.winner === 'player1' ? s2 : s1;
      if (loserSets === 0) winning.skor30++;
      if (loserSets === 1) winning.skor31++;
      if (loserSets === 2) winning.skor32++;
    });

    return Object.values(stats)
      .sort((a,b) => b.poin - a.poin || b.menang - a.menang || a.kalah - b.kalah || a.nama.localeCompare(b.nama))
      .map((item, index) => ({ ...item, rank: index + 1 }));
  };

  const eventRankingRows = buildEventRanking(selectedRankingEvent, effectiveRankingDivision);

  const globalRankingRows = (() => {
    if (!effectiveRankingDivision) return [];
    const aggregate = {};

    events.forEach(ev => {
      const rows = buildEventRanking(ev, effectiveRankingDivision);
      rows.forEach(p => {
        // Untuk saat ini prioritaskan ID pemain; fallback nama+club.
        const key = p.id ? `ID:${p.id}` : `NM:${String(p.nama).toLowerCase()}|${String(p.ptm).toLowerCase()}`;
        if (!aggregate[key]) {
          aggregate[key] = {
            id: p.id, nama: p.nama, ptm: p.ptm,
            main: 0, menang: 0, kalah: 0, poin: 0, setMenang:0, setKalah:0, bolaMenang:0, bolaKalah:0, skor30:0, skor31:0, skor32:0,
            eventCount: 0
          };
        }
        aggregate[key].main += p.main;
        aggregate[key].menang += p.menang;
        aggregate[key].kalah += p.kalah;
        aggregate[key].poin += p.poin;
        ['setMenang','setKalah','bolaMenang','bolaKalah','skor30','skor31','skor32'].forEach(k => { aggregate[key][k] += Number(p[k] || 0); });
        if (p.main > 0) aggregate[key].eventCount += 1;
      });
    });

    return Object.values(aggregate)
      .sort((a,b) => b.poin - a.poin || b.menang - a.menang || a.kalah - b.kalah || a.nama.localeCompare(b.nama))
      .map((item, index) => ({ ...item, rank: index + 1 }));
  })();

  const rankingRows = rankingMode === 'EVENT' ? eventRankingRows : globalRankingRows;

  // ============================================================
  // PENGATURAN TERPUSAT
  // ============================================================
  const selectedSettingsEvent = events.find(
    e => String(e.id) === String(selectedEventIdForSettings)
  ) || events[0] || null;

  // Penugasan online adalah sumber utama untuk akun yang dibuat EO.
  useEffect(() => {
    let cancelled = false;
    setOnlineReferees([]);
    setOnlineRefereesError('');
    if (!selectedSettingsEvent?.id || !isEO && !isSuperAdmin) return;
    setOnlineRefereesLoading(true);
    supabase.from('spinmatch_wasit_event')
      .select('id, kode_wasit, nama_wasit, nomor_meja, status')
      .eq('event_id', Number(selectedSettingsEvent.id))
      .order('nomor_meja')
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setOnlineRefereesError(error.message);
        else setOnlineReferees(data || []);
        setOnlineRefereesLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedSettingsEvent?.id, isEO, isSuperAdmin]);

  const onlineRefereeForTable = (tableNo) => onlineReferees.find(r =>
    Number(r.nomor_meja) === Number(tableNo)
  );
  const settingsTableCount = Math.max(
    1,
    Number(selectedSettingsEvent?.jumlahMeja || selectedSettingsEvent?.jumlahmeja || 4)
  );


  const nextRefereeId = (() => {
    const nums = refereeRegistry
      .map(r => Number(String(r.id || '').replace(/\D/g, '')))
      .filter(Number.isFinite);
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `WST-${String(next).padStart(4, '0')}`;
  })();



  const addActivityLog = (type, description, eventId = null) => {
    const entry = {
      id: `LOG-${Date.now()}`,
      type,
      description,
      eventId: eventId ? String(eventId) : null,
      at: new Date().toISOString()
    };
    setActivityLogs(prev => {
      const next = [entry, ...prev].slice(0, 500);
      localStorage.setItem('spinmatch_activity_logs', JSON.stringify(next));
      return next;
    });
  };

  const createReferee = () => {
    const nama = newRefereeName.trim();
    if (!nama) {
      alert('Nama wasit belum diisi.');
      return;
    }
    const item = {
      id: nextRefereeId,
      nama,
      status: newRefereeStatus,
      createdAt: new Date().toISOString()
    };
    setRefereeRegistry(prev => {
      const next = [...prev, item];
      localStorage.setItem('spinmatch_referee_registry', JSON.stringify(next));
      return next;
    });
    addActivityLog('WASIT_BARU', `${item.id} - ${item.nama} ditambahkan ke daftar wasit SpinMatch.`);
    setNewRefereeName('');
    setNewRefereeStatus('AKTIF');
    setRefereeModalOpen(false);
  };

  const toggleRefereeStatus = (refereeId) => {
    const current = refereeRegistry.find(r => r.id === refereeId);
    if (!current) return;
    const newStatus = current.status === 'AKTIF' ? 'NONAKTIF' : 'AKTIF';

    setRefereeRegistry(prev => {
      const next = prev.map(r => r.id === refereeId ? { ...r, status: newStatus } : r);
      localStorage.setItem('spinmatch_referee_registry', JSON.stringify(next));
      return next;
    });

    setRefereeAssignments(prev => {
      const next = JSON.parse(JSON.stringify(prev || {}));
      Object.keys(next).forEach(eventKey => {
        Object.keys(next[eventKey] || {}).forEach(tableKey => {
          if (next[eventKey][tableKey]?.refereeId === refereeId) {
            next[eventKey][tableKey].status = newStatus;
          }
        });
      });
      localStorage.setItem('spinmatch_referee_assignments', JSON.stringify(next));
      return next;
    });

    addActivityLog(
      'STATUS_WASIT',
      `${current.id} - ${current.nama} diubah menjadi ${newStatus}.`
    );
  };

  const assignRegisteredReferee = (tableNo, refereeId) => {
    if (!selectedSettingsEvent) return;
    const ref = refereeRegistry.find(r => r.id === refereeId);
    const eventKey = String(selectedSettingsEvent.id);

    if (refereeId && (!ref || ref.status !== 'AKTIF')) {
      alert('Wasit ini tidak aktif. Aktifkan terlebih dahulu di Master Wasit.');
      return;
    }

    setRefereeAssignments(prev => {
      const next = {
        ...prev,
        [eventKey]: {
          ...(prev[eventKey] || {}),
          [String(tableNo)]: refereeId && ref ? {
            refereeId: ref.id,
            refereeName: ref.nama,
            status: ref.status
          } : {}
        }
      };
      localStorage.setItem('spinmatch_referee_assignments', JSON.stringify(next));
      return next;
    });

    addActivityLog(
      'PENUGASAN_WASIT',
      refereeId && ref
        ? `${ref.id} - ${ref.nama} ditugaskan ke Meja ${tableNo}.`
        : `Penugasan wasit Meja ${tableNo} dibatalkan.`,
      selectedSettingsEvent.id
    );
  };


  // Status kerja wasit dihitung otomatis dari pertandingan pada meja:
  // MENUNGGU -> BERTUGAS -> SIAP. Status akun AKTIF/NONAKTIF tetap
  // hanya diatur dari Master Wasit oleh EO/Super Admin.
  const getRefereeWorkStatus = (tableNo, assignment) => {
    if (!assignment?.refereeId) {
      return { code: 'KOSONG', label: 'KOSONG', match: null };
    }

    const onlineRegistered = onlineReferees.find(r => `ONLINE-${r.id}` === assignment.refereeId);
    const registered = onlineRegistered || refereeRegistry.find(r => r.id === assignment.refereeId);
    if (!registered) {
      return { code: 'KOSONG', label: 'KOSONG', match: null };
    }
    if (registered.status !== 'AKTIF') {
      return { code: 'NONAKTIF', label: 'NONAKTIF', match: null };
    }
    if (!selectedSettingsEvent) {
      return { code: 'MENUNGGU', label: 'MENUNGGU', match: null };
    }

    const schedule = generateScheduleFromPools(selectedSettingsEvent.id)
      .filter(row =>
        row?.type === 'player' &&
        row?.showMatch &&
        row?.matchId &&
        normalizeMeja(row?.meja || row?.table || row?.tableNo) === Number(tableNo)
      );

    if (!schedule.length) {
      return { code: 'MENUNGGU', label: 'MENUNGGU', match: null };
    }

    // Hindari pasangan player/opponent terhitung dua kali bila generator
    // mengembalikan dua baris untuk match yang sama.
    const uniqueMatches = [];
    const seen = new Set();
    schedule.forEach(row => {
      if (!seen.has(String(row.matchId))) {
        seen.add(String(row.matchId));
        uniqueMatches.push(row);
      }
    });

    const unfinished = uniqueMatches.filter(row => {
      const result = matchResults[row.matchId];
      return !(result?.winner === 'player1' || result?.winner === 'player2');
    });

    if (!unfinished.length) {
      return { code: 'SIAP', label: 'SIAP', match: null };
    }

    // Pertandingan dianggap sedang berjalan bila sudah ada input skor/set
    // pada matchResults tetapi belum mempunyai winner final.
    const activeMatch = unfinished.find(row => {
      const result = matchResults[row.matchId];
      if (!result) return false;

      const hasScoreValue = (value) =>
        value !== undefined && value !== null && String(value).trim() !== '' &&
        Number(value) > 0;

      if (Array.isArray(result.sets)) {
        return result.sets.some(set =>
          hasScoreValue(set?.player1) || hasScoreValue(set?.player2) ||
          hasScoreValue(set?.p1) || hasScoreValue(set?.p2)
        );
      }

      return (
        hasScoreValue(result.player1Score) ||
        hasScoreValue(result.player2Score) ||
        hasScoreValue(result.score1) ||
        hasScoreValue(result.score2) ||
        (Array.isArray(result.gameHistory) && result.gameHistory.some(game =>
          hasScoreValue(game?.p1) || hasScoreValue(game?.p2)
        ))
      );
    });

    if (activeMatch) {
      return {
        code: 'BERTUGAS',
        label: 'BERTUGAS',
        match: activeMatch
      };
    }

    // Bila meja pernah menyelesaikan match sebelumnya dan sekarang menunggu
    // match berikutnya, wasit sudah kembali free/siap.
    const hasFinishedMatch = uniqueMatches.some(row => {
      const result = matchResults[row.matchId];
      return result?.winner === 'player1' || result?.winner === 'player2';
    });

    return hasFinishedMatch
      ? { code: 'SIAP', label: 'SIAP', match: unfinished[0] || null }
      : { code: 'MENUNGGU', label: 'MENUNGGU', match: unfinished[0] || null };
  };

  const currentRefereeAssignments = (() => {
    const local = refereeAssignments[String(selectedSettingsEvent?.id)] || {};
    const merged = { ...local };
    onlineReferees.forEach(r => {
      merged[String(r.nomor_meja)] = {
        refereeId: `ONLINE-${r.id}`,
        refereeName: r.nama_wasit,
        status: r.status
      };
    });
    return merged;
  })();

  const assignedRefereeCount = Array.from({ length: settingsTableCount }, (_, i) => i + 1)
    .filter(no => {
      const id = currentRefereeAssignments[String(no)]?.refereeId;
      return !!id && (refereeRegistry.some(r => r.id === id) || onlineReferees.some(r => `ONLINE-${r.id}` === id));
    }).length;

  const refereeWorkSummary = Array.from({ length: settingsTableCount }, (_, i) => i + 1)
    .map(no => getRefereeWorkStatus(no, currentRefereeAssignments[String(no)] || {}));

  const workingRefereeCount = refereeWorkSummary.filter(s => s.code === 'BERTUGAS').length;
  const readyRefereeCount = refereeWorkSummary.filter(s => s.code === 'SIAP').length;
  const waitingRefereeCount = refereeWorkSummary.filter(s => s.code === 'MENUNGGU').length;

  const updateRefereeAssignment = (tableNo, field, value) => {
    if (!selectedSettingsEvent) return;
    const eventKey = String(selectedSettingsEvent.id);
    setRefereeAssignments(prev => {
      const next = {
        ...prev,
        [eventKey]: {
          ...(prev[eventKey] || {}),
          [String(tableNo)]: {
            ...((prev[eventKey] || {})[String(tableNo)] || {}),
            [field]: value
          }
        }
      };
      localStorage.setItem('spinmatch_referee_assignments', JSON.stringify(next));
      return next;
    });
  };

  const saveRefereeAssignments = () => {
    localStorage.setItem('spinmatch_referee_assignments', JSON.stringify(refereeAssignments));
    if (selectedSettingsEvent) {
      addActivityLog(
        'SIMPAN_PENUGASAN',
        `Penugasan wasit disimpan untuk ${selectedSettingsEvent.nama}.`,
        selectedSettingsEvent.id
      );
    }
    alert('Pengaturan wasit untuk event ini berhasil disimpan.');
  };

  const currentFinance = financeDrafts[String(selectedSettingsEvent?.id)] || {
    registrationIncome: '',
    otherIncome: '',
    refereeFee: '',
    operationalCost: '',
    otherExpense: ''
  };

  const updateFinance = (field, value) => {
    if (!selectedSettingsEvent) return;
    const eventKey = String(selectedSettingsEvent.id);
    setFinanceDrafts(prev => {
      const next = {
        ...prev,
        [eventKey]: {
          ...(prev[eventKey] || {}),
          [field]: value
        }
      };
      localStorage.setItem('spinmatch_finance_drafts', JSON.stringify(next));
      return next;
    });
  };

  const financeIncome =
    Number(currentFinance.registrationIncome || 0) +
    Number(currentFinance.otherIncome || 0);
  const financeExpense =
    Number(currentFinance.refereeFee || 0) +
    Number(currentFinance.operationalCost || 0) +
    Number(currentFinance.otherExpense || 0);
  const financeBalance = financeIncome - financeExpense;

  return (
    <div className="spinmatch-app flex h-[100dvh] bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <div className="hidden h-screen sticky top-0 shrink-0 md:block">
        <SpinMatchSidebar
          activeView={activeView}
          setActiveView={setActiveView}
          role={userRole}
          refereeSectionActive={activeView === 'SETTINGS' && settingsSection === 'REFEREE'}
          supervisorSectionActive={activeView === 'SETTINGS' && settingsSection === 'SUPERVISOR'}
          onManageSupervisor={() => { setSettingsSection('SUPERVISOR'); setActiveView('SETTINGS'); }}
          onManageReferees={() => { setSettingsSection('REFEREE'); setActiveView('SETTINGS'); }}
          onMyEvents={() => {
            if (isPublic) { alert('Event Saya hanya berlaku untuk akun EO. Untuk akun Public, silakan pilih Semua Event.'); return; }
            setActiveView('DASHBOARD');
            setDashboardEventBrowser('MINE');
          }}
          onAllEvents={() => { setActiveView('DASHBOARD'); setDashboardEventBrowser('ALL'); }}
          onLogout={logout}
        />
      </div>

      <main className="min-w-0 flex-1 flex flex-col h-[100dvh] overflow-hidden">
        <div className="spinmatch-page-head relative shrink-0 bg-slate-50 px-3 pt-3 pb-2 z-[100] border-b border-slate-200/60 shadow-xs sm:px-5 sm:pt-5 md:px-8 md:pt-8 md:pb-4">
          <div className="relative z-50 flex items-center justify-end gap-2 md:hidden">
            <span className="rounded-full border border-blue-200 bg-white px-3 py-2 text-[11px] font-black text-[#0a3971]">{accountRoleLabel}</span>
            <button
              type="button"
              onClick={() => setShowMobileMoreMenu(prev => !prev)}
              className="sm-mobile-more-trigger flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm active:scale-95"
              aria-label="Menu lainnya"
              title="Menu lainnya"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {showMobileMoreMenu && (
              <>
                <button
                  type="button"
                  aria-label="Tutup menu"
                  onClick={() => setShowMobileMoreMenu(false)}
                  className="fixed inset-0 z-40 cursor-default bg-transparent"
                />
                <div className="sm-mobile-more-panel absolute right-0 top-11 z-50 w-[min(310px,calc(100vw-24px))] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,.24)]">
                  {isReferee && <button type="button" onClick={() => { setActiveView('DASHBOARD'); setShowMobileMoreMenu(false); }} className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] font-extrabold ${activeView === 'DASHBOARD' ? 'bg-blue-700 text-white' : 'text-slate-700 hover:bg-blue-50'}`}><Activity className="h-4 w-4 shrink-0" />Dashboard</button>}
                  {isSuperAdmin && <>
                    <button type="button" onClick={() => { setShowMobileMoreMenu(false); setSettingsSection('PRICING'); setActiveView('SETTINGS'); }} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] font-extrabold text-orange-700 hover:bg-orange-50"><Wallet className="h-4 w-4"/>Tarif & Pembayaran</button>
                    <button type="button" onClick={() => { setShowMobileMoreMenu(false); setSettingsSection('PAYMENT_REVIEW'); setActiveView('SETTINGS'); }} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] font-extrabold text-slate-700 hover:bg-slate-100"><CheckCircle2 className="h-4 w-4"/>Verifikasi Pembayaran EO</button>
                    <div className="my-1 border-t border-slate-100"/>
                  </>}

                  {(isEO || isSuperAdmin) && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMobileMoreMenu(false);
                        const eventToManage = canManageEvent(selectedSettingsEvent)
                          ? selectedSettingsEvent
                          : myEvents[0];
                        if (eventToManage) {
                          setSelectedEventIdForSettings(String(eventToManage.id));
                        }
                        setSettingsSection('SUPERVISOR');
                        setActiveView('SETTINGS');
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] font-extrabold text-slate-700 hover:bg-slate-100"
                    >
                      <ShieldCheck className="h-4 w-4 text-indigo-600" />
                      Kelola Referee
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleMobileRestart}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] font-extrabold text-slate-700 hover:bg-slate-100"
                  >
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    Restart
                  </button>
                  <button
                    type="button"
                    onClick={handleMobileLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[12px] font-extrabold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="hidden md:block">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 pt-0.5">
                <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">
                  SEPTEMBER 2026 • {String(userRole || 'USER').replace('_', ' ')} WORKSPACE
                </p>
                <h1 className="mt-1 text-[22px] font-black tracking-tight text-slate-950">
                  Selamat datang di SpinMatch
                </h1>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-[9px] font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Sistem online
                  </span>

                  <div className="relative">
                    <button type="button" onClick={() => setShowAccountMenu(v => !v)} aria-expanded={showAccountMenu} aria-label="Lihat identitas akun" className="flex max-w-[205px] items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-2.5 py-1 text-left shadow-sm hover:border-orange-300">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0a3971] text-[10px] font-black text-white">{isSuperAdmin ? 'SA' : isEO ? 'EO' : isPublic ? 'PU' : isReferee ? 'RF' : 'WS'}</span>
                      <span className="min-w-0"><span className="block truncate text-[10px] font-black text-slate-900">{accountRoleLabel}</span><span className="block truncate text-[9px] text-slate-500">{isPublic ? 'Pengunjung SpinMatch' : currentUserName}</span></span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                    </button>
                    {showAccountMenu && <div className="absolute right-0 top-full z-[100] mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                      <p className="text-xs font-black text-[#0a3971]">{accountRoleLabel}</p>
                      <p className="mt-1 break-words text-xs font-semibold text-slate-800">{isPublic ? 'Pengunjung' : currentUserName}</p>
                      {!isPublic && user?.email && <p className="mt-1 break-all text-[11px] text-slate-500">{user.email}</p>}
                      <button type="button" onClick={() => { setShowAccountMenu(false); logout(); }} className="mt-3 flex w-full items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" /> Keluar</button>
                    </div>}
                  </div>


                </div>

                {/* Tombol persiapan fitur berikutnya - sengaja belum diberi aksi */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Fitur Berita Pingpong akan diaktifkan berikutnya"
                    className="inline-flex h-7 cursor-default items-center gap-1.5 rounded-full border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-2.5 text-[9px] font-black text-[#0a3971] shadow-sm"
                  >
                    <FileText className="h-3.5 w-3.5 text-cyan-600" />
                    Berita Pingpong
                  </button>

                  <button
                    type="button"
                    title="Fitur Cari Pelatih akan diaktifkan berikutnya"
                    className="inline-flex h-7 cursor-default items-center gap-1.5 rounded-full border border-lime-200 bg-gradient-to-r from-lime-50 to-emerald-50 px-2.5 text-[9px] font-black text-emerald-700 shadow-sm"
                  >
                    <Search className="h-3.5 w-3.5 text-emerald-600" />
                    Cari Pelatih
                  </button>
                  {(isEO || isSuperAdmin) && (
                    <button
                      type="button"
                      onClick={handleOpenCreate}
                      className="inline-flex h-8 items-center gap-1.5 rounded-xl bg-[#07101f] px-3 text-[10px] font-black text-white shadow-[0_5px_14px_rgba(2,6,23,.22)] transition hover:-translate-y-0.5 hover:bg-[#0a3971]"
                    >
                      <Plus className="h-4 w-4 text-[#8DFF63]" />
                      Buat Event
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {activeView === 'RANKING' && (
            <div className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#071b3b] via-[#0a3971] to-[#0874c9] p-5 text-white shadow-[0_12px_30px_rgba(7,27,59,.18)]">
              <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute right-8 top-1/2 h-[2px] w-44 -rotate-[18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="relative flex w-full items-center justify-center">
                  <button onClick={() => setActiveView('DASHBOARD')} className="absolute left-0 rounded-xl border border-white/15 bg-white/10 p-2 hover:bg-white/20">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="px-10 text-center">
                    <h2 className="text-lg font-black">Peringkat & Poin</h2>
                    <p className="text-xs text-blue-100/75">Peringkat Event dan peringkat keseluruhan SpinMatch per divisi</p>
                  </div>
                </div>
                <div className="flex w-full justify-center">
                  <div className="flex max-w-full rounded-xl border border-white/15 bg-white/10 p-1">
                    <button onClick={() => setRankingMode('EVENT')} className={`whitespace-nowrap rounded-lg px-3 py-2 text-[10px] font-black ${rankingMode === 'EVENT' ? 'bg-[#8DFF63] text-[#09243e]' : 'text-white/80'}`}>Peringkat Event</button>
                    <button onClick={() => setRankingMode('GLOBAL')} className={`whitespace-nowrap rounded-lg px-3 py-2 text-[10px] font-black ${rankingMode === 'GLOBAL' ? 'bg-[#8DFF63] text-[#09243e]' : 'text-white/80'}`}>Peringkat SpinMatch</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'SETTINGS' && (
            <div className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#071b3b] via-[#0a3971] to-[#0874c9] p-5 text-white shadow-[0_12px_30px_rgba(7,27,59,.18)]">
              <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute right-8 top-1/2 h-[2px] w-44 -rotate-[18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  <button onClick={() => { setActiveView('DASHBOARD'); setSettingsSection('HOME'); }} className="rounded-xl border border-white/15 bg-white/10 p-2 hover:bg-white/20">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h2 className="text-lg font-black">Pengaturan</h2>
                    <p className="text-xs text-blue-100/75">Pertandingan, wasit, keuangan, dan tarif platform</p>
                  </div>
                </div>
                {settingsSection !== 'PRICING' && <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                  <Filter className="h-4 w-4 text-cyan-200" />
                  <select
                    value={selectedEventIdForSettings}
                    onChange={(e) => { selectDashboardEvent(events.find(ev => String(ev.id) === e.target.value)); setSettingsSection('HOME'); }}
                    className="max-w-[280px] bg-transparent text-xs font-black text-white outline-none [&>option]:text-slate-900"
                  >
                    {events.map(ev => <option key={ev.id} value={ev.id}>{ev.nama}</option>)}
                  </select>
                </div>}
              </div>
            </div>
          )}

          {activeView === 'REGISTRATION' && (
            <div className={`sm-mobile-page-header p-5 rounded-3xl border border-white/10 shadow-xs flex gap-4 mt-4 relative overflow-hidden bg-gradient-to-r from-[#052a4a] via-[#075a91] to-[#0b83c9] text-white ${isPublic ? 'flex-col items-center justify-center text-center' : 'flex-col items-start justify-between md:flex-row md:items-center'}`}>
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/15 blur-3xl" />
                <div className="absolute right-[12%] top-1/2 h-[2px] w-52 -rotate-[14deg] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                <div className="absolute left-[34%] -top-10 h-24 w-52 rotate-[8deg] rounded-full bg-cyan-200/10 blur-3xl" />
              </div>
              <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
                <button onClick={() => setActiveView('DASHBOARD')} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer text-blue-50" title="Kembali ke Dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-white">Manajemen Peserta</h2>
                  <p className="text-xs text-blue-100/70">Kelola data peserta turnamen</p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-2xl border border-white/20">
                  <Filter className="w-4 h-4 text-blue-100/80" />
                  <span className="text-xs font-bold text-slate-200">Pilih Event:</span>
                  <select value={selectedEventIdForReg} onChange={(e) => selectDashboardEvent(events.find(ev => String(ev.id) === e.target.value))} className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer">
                    {events.filter(ev => !isWasit || String(ev.id) === String(wasitAssignment?.event_id)).map((ev) => (<option key={ev.id} value={ev.id}>{ev.nama} ({ev.tanggal})</option>))}
                  </select>
                </div>
                <button onClick={() => setShowRegModal(true)} className="flex items-center gap-1.5 text-xs font-bold bg-[#bef264] hover:bg-[#a3e635] text-slate-950 px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm whitespace-nowrap">
                  <UserPlus className="w-4 h-4" /> Tambah Peserta
                </button>
              </div>
            </div>
          )}

          {activeView === 'DRAW' && (
            <div className="sm-mobile-page-header p-5 rounded-3xl border border-white/10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4 relative overflow-hidden bg-gradient-to-r from-[#052a4a] via-[#075a91] to-[#0b83c9] text-white">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/15 blur-3xl" />
                <div className="absolute right-[12%] top-1/2 h-[2px] w-52 -rotate-[14deg] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                <div className="absolute left-[34%] -top-10 h-24 w-52 rotate-[8deg] rounded-full bg-cyan-200/10 blur-3xl" />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={() => setActiveView('DASHBOARD')} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer text-blue-50" title="Kembali ke Dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Dices className="w-5 h-5 text-emerald-600" /> Undian Peserta
                  </h2>
                  <p className="text-xs text-blue-100/70">Acak pemain ke dalam pool secara adil</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-2xl border border-white/20">
                  <Filter className="w-4 h-4 text-blue-100/80" />
                  <span className="text-xs font-bold text-slate-200">Pilih Event:</span>
                  <select value={selectedEventIdForDraw} onChange={(e) => selectDashboardEvent(events.find(ev => String(ev.id) === e.target.value))} className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer">
                    {events.filter(ev => !isWasit || String(ev.id) === String(wasitAssignment?.event_id)).map((ev) => (<option key={ev.id} value={ev.id}>{ev.nama} ({ev.tanggal})</option>))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeView === 'SCHEDULE' && (
            <div className="sm-mobile-page-header sm-schedule-header relative overflow-hidden bg-gradient-to-r from-[#052a4a] via-[#075a91] to-[#0b83c9] p-3 sm:p-5 rounded-3xl border border-white/10 shadow-[0_14px_35px_rgba(3,35,68,.20)] flex flex-col md:flex-row items-start md:items-center justify-between gap-2 sm:gap-4 mt-3 sm:mt-4 text-white">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/15 blur-3xl" />
                <div className="absolute right-[12%] top-1/2 h-[2px] w-52 -rotate-[14deg] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                <div className="absolute left-[34%] -top-10 h-24 w-52 rotate-[8deg] rounded-full bg-cyan-200/10 blur-3xl" />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={() => setActiveView('DASHBOARD')} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer text-blue-50" title="Kembali ke Dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" /> Jadwal Pertandingan
                  </h2>
                  <p className="text-xs text-blue-100/70">Jadwal match berdasarkan hasil undian pool</p>
                </div>
              </div>
              <div className="grid grid-cols-[repeat(4,minmax(0,1fr))] gap-2 w-full min-w-0 md:w-auto md:flex md:items-center md:justify-end md:flex-wrap">
                <div className="col-span-4 w-full min-w-0 flex items-center gap-2 bg-white/10 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border border-white/20">
                  <Filter className="w-4 h-4 text-blue-100/80" />
                  <span className="text-xs font-bold text-slate-200">Pilih Event:</span>
                  <select value={selectedEventIdForSchedule} onChange={(e) => selectDashboardEvent(events.find(ev => String(ev.id) === e.target.value))} className="min-w-0 flex-1 bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer">
                    {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.nama} ({ev.tanggal})</option>))}
                  </select>
                </div>
                <div className={isPublic || isReferee ? 'col-span-4 flex justify-center gap-2' : 'contents'}>
                {!isPublic && !isReferee && <button onClick={() => { if (isWasit) setSelectedEventIdForDraw(String(wasitAssignment?.event_id || '')); setActiveView('DRAW'); }} className="w-full min-w-0 md:w-auto justify-center whitespace-nowrap px-1.5 py-1.5 sm:px-4 sm:py-2 bg-[#bef264] hover:bg-[#a3e635] text-slate-950 font-bold rounded-lg md:rounded-xl text-[10px] md:text-xs transition cursor-pointer shadow-sm flex items-center gap-1 md:gap-1.5">
                  <Shuffle className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" /> Undian
                </button>}
                {selectedScheduleEvent && canManageEvent(selectedScheduleEvent) && <button type="button" onClick={() => setShowScheduleBreakEditor(value => !value)} aria-expanded={showScheduleBreakEditor} className={`w-full min-w-0 md:w-auto justify-center whitespace-nowrap px-1.5 py-1.5 sm:px-4 sm:py-2 ${showScheduleBreakEditor ? 'bg-amber-300 hover:bg-amber-400' : 'bg-amber-400 hover:bg-amber-500'} text-amber-950 font-bold rounded-lg md:rounded-xl text-[10px] md:text-xs transition cursor-pointer shadow-sm flex items-center gap-1 md:gap-1.5`}>
                  <Pause className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" /> Jeda Main
                </button>}
                <button onClick={() => setShowPrintModal(true)} className={`${isPublic || isReferee ? 'w-auto' : 'w-full'} min-w-0 md:w-auto justify-center whitespace-nowrap px-1.5 py-1.5 sm:px-4 sm:py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg md:rounded-xl text-[10px] md:text-xs transition cursor-pointer shadow-sm flex items-center gap-1 md:gap-1.5`}>
                  <Printer className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" /> Print
                </button>
                <button type="button" onClick={handleDownloadSchedulePdf} disabled={!selectedScheduleEvent || !schedulePoolData} title="Unduh jadwal sebagai PDF" className={`${isPublic || isReferee ? 'w-auto' : 'w-full'} min-w-0 md:w-auto justify-center whitespace-nowrap px-1.5 py-1.5 sm:px-4 sm:py-2 bg-emerald-500 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 text-white font-bold rounded-lg md:rounded-xl text-[10px] md:text-xs transition cursor-pointer shadow-sm flex items-center gap-1 md:gap-1.5`}>
                  <Download className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" /> PDF
                </button>
                </div>

              </div>
            </div>
          )}

          {activeView === 'KNOCKOUT' && (
            <div className="relative overflow-hidden bg-gradient-to-r from-[#052a4a] via-[#075a91] to-[#0b83c9] p-5 rounded-3xl border border-white/10 shadow-[0_14px_35px_rgba(3,35,68,.20)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4 text-white">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/15 blur-3xl" />
                <div className="absolute right-[12%] top-1/2 h-[2px] w-52 -rotate-[14deg] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                <div className="absolute left-[34%] -top-10 h-24 w-52 rotate-[8deg] rounded-full bg-cyan-200/10 blur-3xl" />
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <button onClick={() => setActiveView('DASHBOARD')} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Knockout</h2>
                  <p className="text-xs text-blue-100/70">Bagan gugur • klik Match untuk Live Score</p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-2xl border border-white/20">
                  <Filter className="w-4 h-4 text-blue-100/80" />
                  <span className="text-xs font-bold text-slate-200">Pilih Event:</span>
                  <select value={selectedEventIdForKnockout} onChange={(e)=>selectDashboardEvent(events.find(ev => String(ev.id) === e.target.value))} className="bg-transparent text-xs font-bold text-white focus:outline-none [&>option]:text-white">
                    {events.filter(ev => !isWasit || String(ev.id) === String(wasitAssignment?.event_id)).map(ev=><option key={ev.id} value={ev.id}>{ev.nama} ({ev.tanggal})</option>)}
                  </select>
                </div>
                <button onClick={()=>window.print()} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5" /> Print Bagan
                </button>
                <button type="button" onClick={handleDownloadKnockoutPdf} disabled={!selectedKnockoutEvent} title="Unduh bagan Knockout sebagai PDF" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>
          )}

          {activeView === 'LIVE_SCORE' && (
            <div className="sm-mobile-page-header p-5 rounded-3xl border border-white/10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4 relative overflow-hidden bg-gradient-to-r from-[#052a4a] via-[#075a91] to-[#0b83c9] text-white">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/15 blur-3xl" />
                <div className="absolute right-[12%] top-1/2 h-[2px] w-52 -rotate-[14deg] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                <div className="absolute left-[34%] -top-10 h-24 w-52 rotate-[8deg] rounded-full bg-cyan-200/10 blur-3xl" />
              </div>
              <div className={`relative flex items-center gap-3 w-full ${isPublic ? 'justify-center' : 'md:w-auto'}`}>
                <button onClick={() => setActiveView('DASHBOARD')} className={`p-2 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer text-blue-50 ${isPublic ? 'absolute left-0' : ''}`} title="Kembali ke Dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className={isPublic ? 'px-10' : ''}>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-red-600" /> Live Skor Pertandingan
                  </h2>
                  <p className="text-xs text-blue-100/70">{isPublic ? 'Pantau skor pertandingan — hanya lihat' : 'Input skor real-time untuk dilihat publik'}</p>
                </div>
              </div>
              <div className={`flex items-center gap-3 w-full flex-wrap ${isPublic ? 'justify-center' : 'justify-end md:w-auto'}`}>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-2xl border border-white/20">
                  <Filter className="w-4 h-4 text-blue-100/80" />
                  <span className="text-xs font-bold text-slate-200">Pilih Event:</span>
                  <select value={selectedEventIdForLive} onChange={(e) => selectDashboardEvent(events.find(ev => String(ev.id) === e.target.value))} className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer">
                    {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.nama} ({ev.tanggal})</option>))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`spinmatch-main-content ${activeView === 'DASHBOARD' ? 'sm-dashboard-screen' : ''} flex-1 overflow-y-auto overflow-x-hidden px-3 pb-6 pt-3 sm:px-5 sm:pt-4 md:p-8 md:pt-6 md:pb-8`}>
{isPublic && (
  <div className="mx-auto mb-3 w-full max-w-[1500px] rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-bold text-blue-700 md:mb-4 md:px-4 md:py-3 md:text-xs">
    Mode Publik • Hanya lihat. Pembuatan event, pendaftaran peserta, undian, dan pengaturan dinonaktifkan.
  </div>
)}
{isReferee && activeView !== 'RANKING' ? (
  <RefereeWorkspace user={user} activeView={activeView} setActiveView={setActiveView} events={events} getSchedule={generateScheduleFromPools} getWasit={getScheduledReferee} getMatchPlayers={getLiveMatchPlayers} eventBreaks={eventBreaks} onBreaksSaved={loadEventBreaks} />
) : isWasit && (wasitAssignmentLoading || !wasitAssignment) ? (
  <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm font-bold text-amber-900">{wasitAssignmentLoading ? 'Memeriksa penugasan wasit...' : 'Belum ada penugasan wasit aktif. Hubungi EO.'}</div>
) : activeView === 'DASHBOARD' ? (
  <>
    {/* =========================================================
        SPINMATCH PREMIUM DASHBOARD
        Mobile-first • Premium Blue • Responsive
    ========================================================== */}

    <div className="sm-dashboard-layout mx-auto w-full max-w-[1500px] space-y-4 md:space-y-6">

      {!isPublic && <div className="sm-dashboard-event-buttons hidden md:hidden">
        <button type="button" className="sm-btn-my-events" onClick={() => {
          setDashboardEventBrowser('MINE');
        }}><Trophy className="h-4 w-4" /> Event Saya</button>
        <button type="button" className="sm-btn-all-events" onClick={() => setDashboardEventBrowser('ALL')}><FileText className="h-4 w-4" /> Semua Event</button>
      </div>}

      {dashboardEventBrowser && (
        <section className="sm-event-browser order-[1] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm md:order-none">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
            <div>
              <h2 className="text-[13px] font-black text-slate-900">{dashboardEventBrowser === 'MINE' ? 'Event Saya' : 'Semua Event'}</h2>
              <p className="text-[9px] font-semibold text-slate-400">Pilih event untuk ditampilkan di Dashboard</p>
            </div>
            <button type="button" onClick={() => setDashboardEventBrowser(null)} className="rounded-lg bg-slate-100 p-1.5 text-slate-500"><X className="h-4 w-4" /></button>
          </div>
          <div className="max-h-[48vh] overflow-auto">
            {(dashboardEventBrowser === 'MINE' ? myEvents : events).length === 0 ? (
              <div className="p-5 text-center text-xs font-bold text-slate-400">Belum ada event.</div>
            ) : (dashboardEventBrowser === 'MINE' ? myEvents : events).map(ev => (
              <div key={ev.id} className="border-b border-slate-100 px-3 py-3 last:border-b-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-black text-slate-900">{ev.nama}</div>
                    <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] font-semibold text-slate-500">
                      <span><b>EO:</b> {ev.ownerName || ev.eo || '-'}</span>
                      <span><b>Tanggal:</b> {ev.tanggal || '-'}</span>
                      <span><b>Lokasi:</b> {ev.lokasi || '-'}</span>
                      <span><b>Contact:</b> {ev.contactPerson || '-'}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => {
                    selectDashboardEvent(ev);
                    setDashboardEventBrowser(null);
                    setActiveView('DASHBOARD');
                  }} className="shrink-0 rounded-lg bg-[#0a3971] px-2.5 py-1.5 text-[9px] font-black text-white">Pilih</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===================== HERO ===================== */}
      <section className="sm-dashboard-hero relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#071b3b] via-[#0a3971] to-[#0874c9] text-white shadow-[0_18px_48px_rgba(8,55,110,0.24)]">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-[35%] h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="pointer-events-none absolute left-[-70px] top-[-80px] h-52 w-52 rounded-full bg-indigo-300/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[38%] opacity-15">
          <div className="absolute bottom-6 left-[7%] right-[7%] h-[2px] bg-white/80" />
          <div className="absolute bottom-6 left-1/2 h-20 w-[2px] -translate-x-1/2 bg-white/70" />
          <div className="absolute bottom-6 left-[7%] h-14 w-[2px] bg-white/60" />
          <div className="absolute bottom-6 right-[7%] h-14 w-[2px] bg-white/60" />
        </div>

        <div className="sm-dashboard-hero-inner relative z-10 grid min-h-[220px] grid-cols-1 items-center gap-4 px-6 py-6 sm:px-7 md:grid-cols-[1.28fr_.72fr] md:px-9 md:py-7 lg:px-10 lg:py-7">
          <div className="sm-dashboard-hero-copy flex min-w-0 flex-col justify-center">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] backdrop-blur-md sm:text-xs">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#7CFF6B]" />
                Event Aktif
              </span>
              <span className="hidden rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-bold text-cyan-100 sm:inline-flex">
                LIVE TOURNAMENT
              </span>
              {heroEvents.length > 1 && (
                <span className="hidden rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black text-white/85 sm:inline-flex">
                  {safeHeroIndex + 1} / {heroEvents.length}
                </span>
              )}
            </div>

            <div className="sm-dashboard-mobile-paddle hidden"><div className="sm-dashboard-mobile-glow" /><img src={heroPingpong} alt="SpinMatch Table Tennis" /></div>

            <h1 className="max-w-3xl text-[25px] font-black leading-[1.04] tracking-[-0.03em] sm:text-3xl md:text-[34px] lg:text-[38px]">
              {dashboardActiveEvent?.nama || 'Belum Ada Event'}
            </h1>

            <p className="sm-dashboard-hero-desc mt-2.5 max-w-2xl text-xs font-medium leading-relaxed text-blue-100/85 sm:text-sm">
              Kelola pertandingan tenis meja lebih cepat, terintegrasi dan real-time.
            </p>

            <div className="sm-dashboard-hero-meta mt-4 flex flex-wrap gap-2 text-[10px] font-bold sm:text-xs">
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                <Calendar className="h-4 w-4 text-cyan-300" />
                <span>{dashboardActiveEvent?.tanggal || 'Tanggal belum ditentukan'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                <Users className="h-4 w-4 text-[#8BFF77]" />
                <span>{totalPeserta} Peserta</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                <Trophy className="h-4 w-4 text-yellow-300" />
                <span>{dashboardActiveEvent?.divisiList?.length || 0} Divisi</span>
              </div>
            </div>

            <div className="sm-dashboard-hero-actions mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
              <button
                onClick={() => {
                  const eventForRanking = dashboardActiveEvent || events[0];
                  if (eventForRanking) selectDashboardEvent(eventForRanking);
                  setRankingMode('EVENT');
                  setActiveView('RANKING');
                }}
                className="flex h-9 w-[145px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-[#8DFF63] px-2 text-[10px] font-black text-[#09243e] shadow-lg shadow-lime-950/20 transition hover:-translate-y-0.5 hover:bg-[#a2ff80]"
              >
                <Medal className="h-4 w-4 shrink-0" /> Peringkat &amp; Poin
              </button>
              {isPublic ? (
                <button
                  type="button"
                  onClick={() => setDashboardEventBrowser('ALL')}
                  className="flex h-9 w-[145px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-white/25 bg-white/10 px-2 text-[10px] font-black text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  <FileText className="h-4 w-4 text-cyan-200" /> Semua Event
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!dashboardActiveEvent) return;
                    selectDashboardEvent(dashboardActiveEvent);
                    setActiveView('LIVE_SCORE');
                  }}
                  className="flex h-9 w-[145px] items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-gradient-to-r from-[#6857d9] to-[#9581ef] px-2 text-[10px] font-black text-white shadow-md backdrop-blur-md transition hover:brightness-110"
                >
                  <Radio className="h-4 w-4 shrink-0 text-white" /> Live Score
                </button>
              )}
            </div>
          </div>

          <div className="relative hidden min-h-[185px] items-center justify-center overflow-visible md:flex">
            <div className="absolute left-1/2 top-1/2 h-[180px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/15 blur-[58px]" />
            <img
              src={heroPingpong}
              alt="SpinMatch Table Tennis"
              className="relative z-10 w-[300px] max-w-full -translate-y-2 object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.24)] md:-translate-y-4 lg:w-[330px] xl:w-[350px]"
            />
          </div>
        </div>

        {heroEvents.length > 1 && (
          <div className="absolute bottom-4 right-5 z-30 hidden items-center gap-2.5 md:flex">
            <button type="button" onClick={goHeroPrevious}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              title="Event sebelumnya">‹</button>

            <div className="flex max-w-[180px] items-center gap-1.5 overflow-hidden">
              {heroEvents.map((ev, index) => (
                <button key={ev.id} type="button" onClick={() => setHeroEventIndex(index)}
                  title={ev.nama}
                  className={`h-2 shrink-0 rounded-full transition-all duration-300 ${
                    index === safeHeroIndex ? 'w-6 bg-[#8DFF63]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <span className="min-w-[38px] text-center text-[10px] font-black text-white/75">
              {safeHeroIndex + 1}/{heroEvents.length}
            </span>

            <button type="button" onClick={goHeroNext}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              title="Event berikutnya">›</button>
          </div>
        )}

        {heroEvents.length > 1 && (
          <div className="relative z-30 flex items-center justify-center gap-3 px-5 pb-5 md:hidden">
            <button type="button" onClick={goHeroPrevious}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg font-bold text-white">‹</button>
            <span className="text-[10px] font-black text-white/80">
              Event {safeHeroIndex + 1} dari {heroEvents.length}
            </span>
            <button type="button" onClick={goHeroNext}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg font-bold text-white">›</button>
          </div>
        )}
      </section>


      {/* ===================== STATISTICS ===================== */}
      <section className={`sm-dashboard-stats ${isPublic ? 'sm-dashboard-stats-public' : ''} grid grid-cols-2 gap-3 ${isPublic ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>

        <div className={`group rounded-[22px] border border-blue-100 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:shadow-xl ${isPublic ? 'flex flex-col items-center text-center' : ''}`}>
          <div className={`flex items-start ${isPublic ? 'hidden' : 'justify-between'}`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
              <Trophy className="h-5 w-5 text-blue-600" />
            </div>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-blue-600">
              Event
            </span>
          </div>
          <div className={`mt-4 text-3xl font-black tracking-tight text-slate-950 ${isPublic ? 'w-full text-center' : ''}`}>
            {totalEventAktif < 10 ? `0${totalEventAktif}` : totalEventAktif}
          </div>
          <div className={`mt-1 text-[11px] font-bold text-slate-500 ${isPublic ? 'w-full text-center' : ''}`}>
            Event Aktif
          </div>
        </div>


        <div className={`group rounded-[22px] border border-emerald-100 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:shadow-xl ${isPublic ? 'flex flex-col items-center text-center' : ''}`}>
          <div className={`flex items-start ${isPublic ? 'hidden' : 'justify-between'}`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-600">
              Peserta
            </span>
          </div>
          <div className={`mt-4 text-3xl font-black tracking-tight text-slate-950 ${isPublic ? 'w-full text-center' : ''}`}>
            {totalPeserta}
          </div>
          <div className={`mt-1 text-[11px] font-bold text-slate-500 ${isPublic ? 'w-full text-center' : ''}`}>
            Pemain Terdaftar
          </div>
        </div>


        <div className={`group rounded-[22px] border border-orange-100 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:shadow-xl ${isPublic ? 'flex flex-col items-center text-center' : ''}`}>
          <div className={`flex items-start ${isPublic ? 'hidden' : 'justify-between'}`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
              <Activity className="h-5 w-5 text-orange-500" />
            </div>
            <span className="rounded-full bg-orange-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-orange-600">
              Match
            </span>
          </div>
          <div className={`mt-4 text-3xl font-black tracking-tight text-slate-950 ${isPublic ? 'w-full text-center' : ''}`}>
            {dashboardMatchResultCount}
          </div>
          <div className={`mt-1 text-[11px] font-bold text-slate-500 ${isPublic ? 'w-full text-center' : ''}`}>
            Hasil Pertandingan
          </div>
        </div>


{!isPublic && (
        <div className="group rounded-[22px] border border-purple-100 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50">
              <Wallet className="h-5 w-5 text-purple-600" />
            </div>
            <span className="rounded-full bg-purple-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-purple-600">
              Saldo
            </span>
          </div>
          <div className="mt-4 truncate text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
            Rp {dashboardTotalOmzet.toLocaleString('id-ID')}
          </div>
          <div className="mt-1 text-[11px] font-bold text-slate-500">
            Pendaftaran
          </div>
        </div>
        )}

      </section>


      {/* ===================== LOWER CONTENT ===================== */}
      <section className="sm-dashboard-lower grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_.65fr]">

        {/* EVENTS: Publik melihat daftar meja, EO/Super Admin tetap Event Saya */}
        {isPublic && (
          <div id="dashboard-live-meja-publik" className="overflow-hidden rounded-[26px] border border-blue-100 bg-white shadow-[0_10px_35px_rgba(15,23,42,.06)]">
            <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white px-4 py-3">
              <h2 className="flex items-center gap-2 text-base font-black text-[#0a3971]"><Radio className="h-5 w-5 text-emerald-600" /> Live Meja</h2>
              <p className="mt-1 truncate text-[11px] font-semibold text-slate-600">{dashboardActiveEvent?.nama || 'Pilih event untuk melihat meja'}</p>
              <p className="text-[10px] text-slate-500">Ketuk meja untuk melihat skor. Gulir daftar jika lebih dari enam meja.</p>
            </div>
            <div className="sm-public-tables-scroll max-h-[340px] overflow-y-auto overscroll-contain p-3" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }} tabIndex={0} aria-label="Daftar Live Meja Publik">
              <div className="grid grid-cols-2 gap-2">
                {dashboardTableCards.map(card => (
                  <button key={card.tableNo} type="button" disabled={!card.row} onClick={() => {
                    if (!dashboardActiveEvent || !card.row) return;
                    setSelectedEventIdForLive(String(dashboardActiveEvent.id));
                    if (isPublic) {
                      setPublicLiveTable(String(card.tableNo));
                      setActiveView('LIVE_SCORE');
                      return;
                    }
                    openLiveScore(card.row);
                  }} className={`flex min-w-0 flex-col items-center rounded-xl border p-2 text-center transition ${card.isLive ? 'border-emerald-400 bg-emerald-50' : card.isFinished ? 'border-blue-200 bg-blue-50' : card.hasSchedule ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'} ${card.row ? 'cursor-pointer active:scale-[.98]' : 'cursor-default'}`}>
                    <div className="flex w-full items-center justify-between gap-1"><span className="text-[11px] font-black text-slate-900">Meja {card.tableNo}</span><span className={`rounded-md px-1.5 py-0.5 text-[8px] font-black ${card.isLive ? 'bg-emerald-600 text-white' : card.isFinished ? 'bg-blue-600 text-white' : card.hasSchedule ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>{card.isLive ? 'LIVE' : card.isFinished ? 'SELESAI' : card.hasSchedule ? 'SIAP' : 'KOSONG'}</span></div>
                    <svg viewBox="0 0 120 67" className="mt-1 h-[49px] w-[96px]" aria-hidden="true"><path d="M14 25 60 9 106 25 60 42Z" fill="#0874c9" stroke="#064374" strokeWidth="2"/><path d="M60 9V42M14 25h92" fill="none" stroke="#fff" strokeWidth="2"/><path d="M22 31v28M98 31v28" stroke="#475569" strokeWidth="4" strokeLinecap="round"/><path d="M60 12v27" stroke="white" strokeWidth="3" strokeDasharray="3 2"/><circle cx="85" cy="8" r="5" fill="#f97316"/></svg>
                    <span className="text-[11px] font-black text-[#0a3971]">{card.isLive ? `${card.point1} - ${card.point2}` : card.isFinished ? (card.result?.score || 'Selesai') : card.hasSchedule ? 'Menunggu mulai' : 'Belum ada jadwal'}</span>
                  </button>
                ))}
                {!dashboardActiveEvent && <p className="col-span-2 py-6 text-center text-xs text-slate-500">Belum ada event aktif.</p>}
              </div>
            </div>
          </div>
        )}
        {/* EVENTS */}
        {!isPublic && <div id="dashboard-event-saya" className="scroll-mt-24 overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-[0_10px_35px_rgba(15,23,42,.06)]">

          <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
            <div>
              <h2 className="text-base font-black text-slate-950">
                Event Saya
              </h2>
              <p className="mt-0.5 text-[10px] font-medium text-slate-400 sm:text-xs">
                Event dan turnamen yang sedang dikelola
              </p>
            </div>

            {!isPublic && (isEO || isSuperAdmin) && <button
              onClick={handleOpenCreate}
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[#0a3971] px-3 py-2 text-[10px] font-black text-white shadow-md transition hover:bg-[#0874c9] sm:px-4 sm:text-xs"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Buat Event</span>
              <span className="sm:hidden">Baru</span>
            </button>}
          </div>


          {myEvents.length === 0 ? (

            <div className="flex min-h-[140px] flex-col items-center justify-center px-5 py-5 text-center sm:min-h-[220px] sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                <Trophy className="h-7 w-7 text-blue-300" />
              </div>
              <p className="mt-3 text-sm font-black text-slate-600">
                Belum ada event
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Buat event pertama untuk memulai turnamen.
              </p>
            </div>

          ) : (

            <div className="sm-event-scroll divide-y divide-slate-100 max-h-[330px] overflow-y-auto overscroll-contain sm:max-h-[330px]" aria-label="Daftar Event Saya, gulir ke bawah untuk melihat event lainnya" tabIndex={0}>

              {myEvents.map((item) => (

                <div
                  key={item.id}
                  onClick={() => selectDashboardEvent(item)}
                  className={`group flex cursor-pointer flex-wrap items-center gap-3 p-4 transition hover:bg-slate-50 sm:flex-nowrap sm:p-5 ${String(dashboardActiveEvent?.id) === String(item.id) ? 'bg-blue-50/70 ring-1 ring-inset ring-blue-200' : ''}`}
                >

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50">
                    <Trophy className="h-5 w-5 text-blue-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-black text-slate-900 sm:text-sm">
                      {item.nama}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] font-semibold text-slate-400 sm:text-[10px]">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.tanggal}
                      </span>

                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {getEventParticipantCount(item)} Peserta
                      </span>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-black ${
                      item.status === 'Aktif'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.status}
                  </span>

                  {canManageEvent(item) && (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRowClick(item)}
                        className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[9px] font-black text-slate-600 transition hover:bg-blue-600 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteEvent(item.id, item.nama);
                        }}
                        className="flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-[9px] font-black text-red-600 transition hover:bg-red-600 hover:text-white"
                        title="Hapus event"
                      >
                        <Trash2 className="h-3 w-3" /> Hapus
                      </button>
                    </div>
                  )}

                </div>

              ))}

            </div>
          )}
        </div>}


        {/* RIGHT COLUMN */}
        <div className="space-y-4">

          {/* TOURNAMENT STATUS */}
          <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#071b3b] via-[#0a3971] to-[#0874c9] p-5 text-white shadow-[0_15px_35px_rgba(7,27,59,.20)]">

            {/* cahaya putih/cyan - satu keluarga visual dengan Hero dan Live Meja */}
            <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-cyan-200/10 blur-3xl" />
            <div className="pointer-events-none absolute right-[-25px] top-[42%] h-[2px] w-[190px] -rotate-[18deg] bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[1px]" />
            <div className="pointer-events-none absolute right-[10px] top-[30%] h-24 w-24 rounded-full border border-white/10" />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-blue-200">
                  Tournament Status
                </p>
                <h3 className="mt-1 text-lg font-black">
                  SpinMatch Live
                </h3>
              </div>

              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <Activity className="h-5 w-5 text-[#8DFF63]" />
              </span>
            </div>

            <div className="relative z-10 mt-5 grid grid-cols-3 gap-2">

              <div className="rounded-2xl bg-white/10 p-3 text-center">
                <div className="text-xl font-black">{events.length}</div>
                <div className="mt-1 text-[9px] font-bold text-blue-200">
                  Event
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-3 text-center">
                <div className="text-xl font-black">{totalPeserta}</div>
                <div className="mt-1 text-[9px] font-bold text-blue-200">
                  Peserta
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-3 text-center">
                <div className="text-xl font-black">
                  {dashboardMatchResultCount}
                </div>
                <div className="mt-1 text-[9px] font-bold text-blue-200">
                  Match
                </div>
              </div>

            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#8DFF63]/10 px-3 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#8DFF63]" />
              <span className="text-[10px] font-bold text-[#baff9e]">
                Sistem turnamen aktif dan siap digunakan
              </span>
            </div>

          </div>


          {/* LIVE MEJA - DINAMIS MENGIKUTI EVENT HERO */}
          <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#071b3b] via-[#0a3971] to-[#0874c9] p-5 text-white shadow-[0_15px_35px_rgba(7,27,59,.20)]">

            {/* variasi sinar putih/cyan agar match dengan hero */}
            <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-cyan-200/10 blur-3xl" />
            <div className="pointer-events-none absolute right-[-18px] top-[42%] h-[2px] w-[180px] -rotate-[18deg] bg-gradient-to-r from-transparent via-white/45 to-transparent blur-[1px]" />
            <div className="pointer-events-none absolute right-[-30px] top-[49%] h-[1px] w-[220px] -rotate-[18deg] bg-gradient-to-r from-transparent via-cyan-100/35 to-transparent" />
            <div className="pointer-events-none absolute right-[18px] top-[35%] h-28 w-28 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute right-[32px] top-[39%] h-20 w-20 rounded-full border border-cyan-100/10" />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-cyan-100/80">Live sekarang</p>
                  <h3 className="mt-1 truncate text-[13px] font-black text-white">
                    {dashboardActiveEvent?.nama || 'Belum Ada Event'}
                  </h3>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#8DFF63] px-3 py-1 text-[9px] font-black text-[#09243e]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#09243e]" />
                  LIVE
                </span>
              </div>

              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <div className="text-[22px] font-black leading-none">
                    {dashboardJumlahMeja} meja
                  </div>
                  <div className="mt-1 text-[9px] font-bold text-blue-100/70">
                    {dashboardLiveCount > 0
                      ? `${dashboardLiveCount} sedang live`
                      : dashboardReadyCount > 0
                        ? `${dashboardReadyCount} siap dimainkan`
                        : 'Menunggu jadwal pertandingan'}
                  </div>
                </div>

                {heroEvents.length > 1 && (
                  <div className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[9px] font-black text-white/80 backdrop-blur-md">
                    Event {safeHeroIndex + 1}/{heroEvents.length}
                  </div>
                )}
              </div>

              <div
                className={`mt-4 grid gap-2 ${
                  dashboardJumlahMeja <= 2
                    ? 'grid-cols-2'
                    : dashboardJumlahMeja <= 6
                      ? 'grid-cols-3'
                      : 'grid-cols-4'
                }`}
              >
                {dashboardTableCards.map(card => {
                  const scoreText = card.isLive
                    ? `${String(card.point1).padStart(2, '0')}-${String(card.point2).padStart(2, '0')}`
                    : card.isFinished
                      ? (card.result?.score || `${card.result?.player1Score || 0}-${card.result?.player2Score || 0}`)
                      : card.hasSchedule
                        ? 'READY'
                        : '--';

                  return (
                    <button
                      key={card.tableNo}
                      type="button"
                      disabled={!card.row}
                      onClick={() => {
                        if (!card.row || !dashboardActiveEvent) return;
                        setSelectedEventIdForLive(String(dashboardActiveEvent.id));
                        if (isPublic) {
                          setPublicLiveTable(String(card.tableNo));
                          setActiveView('LIVE_SCORE');
                          return;
                        }
                        openLiveScore(card.row);
                      }}
                      title={
                        card.row
                          ? `${card.tableName} • ${card.row.pool || ''} ${card.row.matchRef || ''} • ${card.row.jam || ''}`
                          : `${card.tableName} belum memiliki jadwal`
                      }
                      className={`group relative min-h-[58px] rounded-2xl border px-2 py-2.5 text-center transition ${
                        card.isLive
                          ? 'border-[#a7ff72] bg-[#8DFF63] text-[#09243e] shadow-[0_8px_22px_rgba(141,255,99,.22)]'
                          : card.isFinished
                            ? 'border-white/10 bg-white/10 text-white hover:bg-white/15'
                            : card.hasSchedule
                              ? 'border-cyan-200/15 bg-[#0b2c55]/75 text-white hover:-translate-y-0.5 hover:border-cyan-200/30 hover:bg-[#103965]'
                              : 'cursor-default border-white/5 bg-[#071b3b]/45 text-white/35'
                      }`}
                    >
                      {card.isLive && (
                        <span className="absolute right-2 top-2 h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                      )}

                      <div className={`text-[8px] font-black uppercase tracking-wide ${
                        card.isLive ? 'text-[#164426]' : 'text-blue-100/70'
                      }`}>
                        M{card.tableNo}
                      </div>

                      <div className="mt-1 text-[12px] font-black leading-none">
                        {scoreText}
                      </div>

                      <div className={`mt-1 truncate text-[7px] font-bold ${
                        card.isLive ? 'text-[#164426]/75' : 'text-blue-100/55'
                      }`}>
                        {card.isLive
                          ? 'SEDANG MAIN'
                          : card.isFinished
                            ? 'SELESAI'
                            : card.hasSchedule
                              ? (card.row?.jam || 'SIAP')
                              : 'KOSONG'}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-cyan-300" />
                  <span className="truncate text-[8px] font-medium text-blue-100/70">
                    Skor mengikuti event, meja dan Live Score secara real-time
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!dashboardActiveEvent) return;
                    selectDashboardEvent(dashboardActiveEvent);
                    setActiveView('LIVE_SCORE');
                  }}
                  className="shrink-0 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-[8px] font-black text-white transition hover:bg-white/20"
                >
                  Buka Live
                </button>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ===================== QUICK MENU ===================== */}
      <section className="sm-dashboard-quick rounded-[26px] border border-slate-100 bg-white p-4 shadow-[0_10px_35px_rgba(15,23,42,.06)] sm:p-5">
        <div className="mb-4 text-center md:text-left">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <span className="h-6 w-1.5 rounded-full bg-[#0874c9]" />
            <h2 className="text-base font-black text-slate-950">Menu Cepat</h2>
          </div>
          <p className="mt-1 text-[10px] font-medium text-slate-400 sm:text-xs md:ml-3.5">
            Akses pengelolaan turnamen
          </p>
        </div>

        {/* Mobile: enam tombol dalam 2 baris x 3 kolom */}
        <div className={`mx-auto grid w-full gap-2 md:hidden ${isPublic ? 'sm-public-quick-grid max-w-2xl grid-cols-2' : 'grid-cols-3'}`}>
          {!isPublic && <button
            onClick={() => (() => { if (isPublic || isWasit) { alert('Kelola Event hanya untuk EO atau Super Admin.'); return; } const ev = (dashboardActiveEvent && canManageEvent(dashboardActiveEvent)) ? dashboardActiveEvent : myEvents[0]; if (ev) handleRowClick(ev); else alert('Belum ada event yang dapat dikelola.'); })()}
            className="flex min-w-0 items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-[#1478f2] to-[#0b96ff] px-4 py-3.5 text-[12px] font-black text-white shadow-[0_8px_20px_rgba(20,120,242,.24)] active:scale-[.98]"
          >
            <Settings className="h-5 w-5" /> Kelola Event
          </button>}

          {!isPublic && <button
            onClick={() => {
              if (dashboardActiveEvent) selectDashboardEvent(dashboardActiveEvent);
              setActiveView('REGISTRATION');
            }}
            className="flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1788f5] to-[#26a7ff] px-3 py-3 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(23,136,245,.20)] active:scale-[.98]"
          >
            <Users className="h-5 w-5 shrink-0" /> Kelola Pemain
          </button>}

          {!isPublic && <button
            onClick={() => {
              if (dashboardActiveEvent) selectDashboardEvent(dashboardActiveEvent);
              setActiveView('DRAW');
            }}
            className="flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#08b978] to-[#14d69a] px-3 py-3 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(8,185,120,.20)] active:scale-[.98]"
          >
            <Shuffle className="h-5 w-5 shrink-0" /> Undian Pool
          </button>}

          <button
            onClick={() => {
              if (dashboardActiveEvent) selectDashboardEvent(dashboardActiveEvent);
              setActiveView('SCHEDULE');
            }}
            className={`flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff8a16] to-[#ffad24] px-3 py-3 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(255,138,22,.20)] active:scale-[.98] ${isPublic ? 'min-h-[72px] text-sm' : ''}`}
          >
            <Calendar className="h-5 w-5 shrink-0" /> Jadwal
          </button>

          <button
            onClick={() => {
              if (dashboardActiveEvent) selectDashboardEvent(dashboardActiveEvent);
              setActiveView('KNOCKOUT');
            }}
            className={`flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ef3655] to-[#f54d6c] px-3 py-3 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(239,54,85,.20)] active:scale-[.98] ${isPublic ? 'min-h-[72px] text-sm' : ''}`}
          >
            <Trophy className="h-5 w-5 shrink-0" /> Knockout
          </button>

          {!isPublic && (
            <button
              type="button"
              onClick={() => { setSettingsSection('REFEREE'); setActiveView('SETTINGS'); }}
              className="flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6857d9] to-[#9581ef] px-3 py-3 text-[11px] font-black text-white shadow-md active:scale-[.98]"
            >
              <Users className="h-5 w-5 shrink-0" /> Kelola Wasit
            </button>
          )}
        </div>

        {/* Tablet/Desktop: 6 menu termasuk Kelola Wasit untuk EO/Admin */}
        <div className={`hidden grid-cols-3 gap-4 md:grid xl:grid-cols-6 ${isPublic ? 'mx-auto max-w-2xl md:grid-cols-2 xl:grid-cols-2' : ''}`}>
          {[
            { label: 'Kelola Event', icon: Settings, action: () => (() => { if (isPublic || isWasit) { alert('Kelola Event hanya untuk EO atau Super Admin.'); return; } const ev = (dashboardActiveEvent && canManageEvent(dashboardActiveEvent)) ? dashboardActiveEvent : myEvents[0]; if (ev) handleRowClick(ev); else alert('Belum ada event yang dapat dikelola.'); })(), box: 'from-blue-50 to-blue-100', iconColor: 'text-blue-600' },
            { label: 'Kelola Pemain', icon: Users, action: () => { if (dashboardActiveEvent) selectDashboardEvent(dashboardActiveEvent); setActiveView('REGISTRATION'); }, box: 'from-sky-50 to-cyan-100', iconColor: 'text-sky-600' },
            { label: 'Undian Pool', icon: Shuffle, action: () => { if (dashboardActiveEvent) selectDashboardEvent(dashboardActiveEvent); setActiveView('DRAW'); }, box: 'from-emerald-50 to-emerald-100', iconColor: 'text-emerald-600' },
            { label: 'Jadwal', icon: Calendar, action: () => { if (dashboardActiveEvent) selectDashboardEvent(dashboardActiveEvent); setActiveView('SCHEDULE'); }, box: 'from-amber-50 to-orange-100', iconColor: 'text-orange-500' },
            { label: 'Knockout', icon: Trophy, action: () => { if (dashboardActiveEvent) selectDashboardEvent(dashboardActiveEvent); setActiveView('KNOCKOUT'); }, box: 'from-rose-50 to-red-100', iconColor: 'text-rose-600' },
            ...(!isPublic ? [{ label: 'Kelola Wasit', icon: Users, action: () => { setSettingsSection('REFEREE'); setActiveView('SETTINGS'); }, box: 'from-violet-50 to-purple-100', iconColor: 'text-violet-600' }] : []),
          ].filter(item => !isPublic || ['Jadwal', 'Knockout'].includes(item.label)).map(({ label, icon: Icon, action, box, iconColor }) => (
            <button key={label} onClick={action} className={`group flex items-center gap-3 ${isPublic ? 'min-h-[72px] flex-row justify-center rounded-2xl border border-slate-100 bg-white px-4 shadow-sm' : 'flex-col gap-2'}`}>
              <span className={`flex items-center justify-center rounded-[20px] bg-gradient-to-br ${box} transition group-hover:-translate-y-1 group-hover:shadow-lg ${isPublic ? 'h-12 w-12 shrink-0' : 'aspect-square w-full max-w-[84px]'}`}>
                <Icon className={`h-7 w-7 ${iconColor}`} />
              </span>
              <span className={`text-center font-black text-slate-700 ${isPublic ? 'text-sm' : 'text-xs'}`}>{label}</span>
            </button>
          ))}
        </div>
      </section>


    </div>
  </>

          ) : activeView === 'REGISTRATION' ? (
            <div className="sm-registration space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Daftar Peserta: <span className="text-lime-700">{selectedEventItem?.nama || 'Pilih Event'}</span></h3>
                    <p className="text-[11px] text-slate-400">💡 <span className="font-semibold text-slate-600">Klik Kiri</span> pada baris pemain untuk Edit | <span className="font-semibold text-slate-600">Klik Kanan</span> untuk Opsi Lain.</p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                      <Wallet className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-600">Saldo Daftar:</span>
                      <span className="text-xs font-black text-emerald-700">Rp {totalSaldoDaftar.toLocaleString('id-ID')}</span>
                    </div>
                    <label className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition border border-slate-200">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Upload Excel
                      <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-2 rounded-xl border border-slate-200">Total: {currentEventParticipants.length} Pemain</span>
                    <button onClick={handleDeleteAllParticipants} disabled={currentEventParticipants.length === 0} className="flex items-center gap-1.5 px-3.5 py-2 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm border border-red-600">
                      <Trash2 className="w-4 h-4" /> Hapus Semua
                    </button>
                  </div>
                </div>
                <div className="sm-participant-table overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700 text-center">
                        <th className="py-3.5 px-3 w-12">No</th>
                        <th className="py-3.5 px-4 text-left">ID Peserta</th>
                        <th className="py-3.5 px-4 text-left">Nama Lengkap</th>
                        <th className="py-3.5 px-4 text-left">Klub / PTM</th>
                        <th className="py-3.5 px-3">No HP / WA</th>
                        <th className="py-3.5 px-3">Divisi</th>
                        <th className="py-3.5 px-3">Status Bayar</th>
                        <th className="py-3.5 px-4 text-right">Nilai (Rp)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {(!selectedEventItem || currentEventParticipants.length === 0) ? (
                        <tr><td colSpan="8" className="py-12 text-center text-slate-400">Belum ada peserta terdaftar untuk event ini.</td></tr>
                      ) : (
                        currentEventParticipants.map((p, idx) => (
                          <tr key={p.id} onClick={() => handlePlayerLeftClick(p)} onContextMenu={(e) => handlePlayerContextMenu(e, p)} className="hover:bg-lime-50/60 cursor-pointer text-center select-none transition-colors">
                            <td className="py-3.5 px-3 text-slate-400 font-medium">{idx + 1}</td>
                            <td className="py-3.5 px-4 text-left font-mono font-bold text-indigo-700">{p.customId}</td>
                            <td className="py-3.5 px-4 text-left font-bold text-slate-900">{p.nama}</td>
                            <td className="py-3.5 px-4 text-left font-semibold text-slate-600">{p.ptm}</td>
                            <td className="py-3.5 px-3 font-mono text-slate-500">{p.noTelp || '-'}</td>
                            <td className="py-3.5 px-3 font-semibold text-slate-700">{p.divisi}</td>
                            <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                              <select value={p.statusBayar} onChange={(e) => {
                                const eventId = selectedEventItem.id;
                                const updatedList = participants[eventId].map(item =>
                                  item.id === p.id ? { ...item, statusBayar: e.target.value, nilaiBayar: e.target.value === 'Bayar' ? (item.nilaiBayar || 50000) : 0 } : item
                                );
                                setParticipants({ ...participants, [eventId]: updatedList });
                              }} className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${p.statusBayar === 'Bayar' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                <option value="Bayar">Bayar</option>
                                <option value="Belum">Belum</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">{p.nilaiBayar ? p.nilaiBayar.toLocaleString('id-ID') : 0}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeView === 'DRAW' ? (
            <div className="sm-draw space-y-6">
              {selectedDrawEvent && (
                <div className="bg-gradient-to-r from-emerald-50 to-lime-50 border border-emerald-200 rounded-3xl p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Event Terpilih</span>
                      </div>
                      <h2 className="text-xl font-black text-slate-900">{selectedDrawEvent.nama}</h2>
                      <p className="text-xs text-slate-600 mt-1">{selectedDrawEvent.tanggal}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center px-4 py-2 bg-white rounded-2xl border border-emerald-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-500">Total Peserta</div>
                        <div className="text-2xl font-black text-emerald-700">{drawEventParticipants.length}</div>
                      </div>
                      <div className="text-center px-4 py-2 bg-white rounded-2xl border border-emerald-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-500">Divisi</div>
                        <div className="text-lg font-black text-slate-900">{selectedDrawEvent.divisiList?.[0]?.nama || '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {(isEO || isSuperAdmin) && selectedDrawEvent && canManageEvent(selectedDrawEvent) && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
                  <div className="font-black text-sm text-amber-950">Mode Pengujian Hasil Pool</div>
                  <p className="my-2 text-xs text-amber-900">Isi skor simulasi otomatis untuk pertandingan Pool A–F yang belum selesai. Hasil yang sudah ada tidak ditimpa. Hanya untuk event uji, bukan pertandingan resmi.</p>
                  <button type="button" disabled={simulationSaving} onClick={simulatePoolScores}
                    className="rounded-xl bg-amber-700 px-4 py-2 text-xs font-black text-white disabled:opacity-50">
                    {simulationSaving ? 'Menyimpan simulasi...' : 'Isi Hasil Simulasi Otomatis'}
                  </button>
                </div>
              )}
              {!isWasit && !isPublic && <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-slate-700" />
                  <h3 className="text-base font-bold text-slate-900">Panel Kontrol Undian</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold text-slate-700">Pengaturan Seeded</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Jumlah Seeded mengikuti jumlah Pool. Kebutuhan BYE dihitung terpisah dari ukuran bracket Knockout.
                      <span className="block mt-1 font-bold text-amber-700">Seeded: {drawProjection.numPools} pemain • BYE: {drawProjection.byeCount}</span>
                    </p>
                    <button onClick={handleOpenSeedModal} className="w-full px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5">
                      <Settings className="w-3.5 h-3.5" /> Atur Seeded
                    </button>
                    {Object.keys(currentSeedData).length > 0 && (
                      <button onClick={handleResetSeed} className="w-full mt-2 px-3 py-2 bg-white hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-xs transition cursor-pointer border border-slate-200 flex items-center justify-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" /> Reset Seeded
                      </button>
                    )}
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <button
                      type="button"
                      onClick={() => setShowSeedStatusList(v => !v)}
                      className="w-full flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Medal className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-700">Status Seeded Saat Ini</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showSeedStatusList ? 'rotate-180' : ''}`} />
                    </button>

                    <div className="mt-3 bg-white px-2.5 py-2 rounded-lg border border-slate-200 flex items-center justify-between gap-2 text-[11px]">
                      <span className="font-semibold text-slate-600">Terisi</span>
                      <span className="font-black text-slate-900">
                        {Object.values(currentSeedData).filter(Boolean).length} / {drawProjection.numPools} Seeded
                      </span>
                    </div>

                    {showSeedStatusList && (
                      <div className="mt-2 space-y-1.5 max-h-56 overflow-y-auto pr-1">
                        {drawSeedKeys.map((seedKey, idx) => {
                          const seedPlayer = drawEventParticipants.find(p => String(p.id) === String(currentSeedData[seedKey]));
                          const poolIdx = drawSeedPoolIndexes[idx];
                          const poolLabel = Number.isInteger(poolIdx) ? `Pool ${String.fromCharCode(65 + poolIdx)}` : '-';
                          return (
                            <div key={seedKey} className="flex items-center justify-between bg-white px-2 py-1.5 rounded-lg border border-slate-200">
                              <span className="font-semibold text-slate-600">
                                Seed {idx + 1} ({poolLabel}) {(idx + 1) <= drawProjection.byeCount ? '• BYE' : ''}
                              </span>
                              <span className="font-bold text-slate-900 truncate ml-2 max-w-[105px]">{seedPlayer ? seedPlayer.nama : '--'}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="text-xs font-black text-slate-800 mb-2">Proyeksi Knockout Otomatis</div>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <div className="bg-white rounded-lg border border-slate-200 px-2 py-1.5">Pool: <b>{drawProjection.numPools}</b></div>
                      <div className="bg-white rounded-lg border border-slate-200 px-2 py-1.5">Lolos/Pool: <b>{drawProjection.lolosCount}</b></div>
                      <div className="bg-white rounded-lg border border-slate-200 px-2 py-1.5">Peserta KO: <b>{drawProjection.knockoutPlayers}</b></div>
                      <div className="bg-white rounded-lg border border-slate-200 px-2 py-1.5">Bracket: <b>{drawProjection.bracketSize || '-'}</b></div>
                    </div>
                    <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-2 py-2 text-[11px] font-black text-amber-800">
                      Kebutuhan BYE: {drawProjection.byeCount} • Jumlah Seeded: {drawProjection.numPools}
                    </div>
                  </div>
                  <div className="self-start bg-gradient-to-br from-emerald-50 to-lime-50 border-2 border-dashed border-emerald-300 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Dices className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-bold text-emerald-800">Mesin Undian Otomatis</span>
                    </div>
                    <p className="text-[11px] leading-4 text-emerald-700 mb-3">
                      Acak seluruh pemain secara adil ke dalam sistem Pool.
                    </p>
                    <button onClick={handleStartDraw} disabled={drawEventParticipants.length < 2} className="w-full px-3 py-2.5 bg-[#bef264] hover:bg-[#a3e635] disabled:bg-slate-300 disabled:cursor-not-allowed text-slate-950 font-black rounded-xl text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5">
                      <Play className="w-3.5 h-3.5" /> Mulai Acak & Undi Pemain
                    </button>
                  </div>
                </div>
              </div>}
              {currentPoolData && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-base font-black text-slate-900">Hasil Pembagian Pool</h3>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{currentPoolData.config.totalPlayers} Pemain • {Object.keys(currentPoolData.pools).length} Pool</span>
                    </div>
                    {!isWasit && !isPublic && <div className="flex items-center gap-2 flex-wrap">
                      <button type="button" onClick={async () => {
                        if (!selectedDrawEvent?.id || !currentPoolData) return;
                        try {
                          await saveOnlinePool(selectedDrawEvent.id, currentPoolData);
                          alert('Hasil undian berhasil dikirim ke Supabase. Silakan buka ulang halaman Wasit.');
                        } catch (error) { alert('Gagal sinkron undian: ' + error.message); }
                      }} className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold rounded-xl text-xs transition cursor-pointer">
                        Sinkron Undian ke Wasit
                      </button>
                      <button onClick={handleResetDraw} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" /> Reset Undian
                      </button>
                      <button onClick={() => { setActiveView('SCHEDULE'); setTimeout(() => calculatePoolRankings(selectedDrawEvent.id), 100); }} className="px-4 py-2 bg-[#bef264] hover:bg-[#a3e635] text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Lanjut ke Jadwal
                      </button>
                    </div>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Object.entries(currentPoolData.pools).map(([poolName, players]) => (
                      <div key={poolName} className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-4 hover:border-emerald-300 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <h4 className="text-sm font-black text-slate-900">{poolName}</h4>
                          </div>
                          <span className="text-[10px] font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md">{players.length} Pemain</span>
                        </div>
                        <div className="space-y-1.5">
                          {players.map((player, idx) => (
                            <div key={player.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white transition">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-xs font-bold text-slate-400 w-4">{idx + 1}.</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-slate-900 truncate">{player.nama}</span>
                                    {player.isSeed && (
                                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${player.isSeed === 1 ? 'bg-amber-100 text-amber-700' : player.isSeed === 2 ? 'bg-slate-200 text-slate-700' : 'bg-orange-100 text-orange-700'}`}>
                                        ★ Seed {player.isSeed}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate">{player.ptm}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!currentPoolData && (
                <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
                  <Dices className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-500 mb-1">Belum Ada Hasil Undian</h4>
                  <p className="text-xs text-slate-400">{isWasit || isPublic ? 'Hasil undian belum tersedia.' : <>Klik tombol <span className="font-bold text-emerald-600">"Mulai Acak & Undi Pemain"</span> untuk memulai.</>}</p>
                </div>
              )}
            </div>
          ) : activeView === 'SCHEDULE' ? (
            <div className="sm-schedule space-y-6">
              {eventBreaksReadError && <div role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs font-semibold text-amber-900">Jeda pertandingan belum dapat dibaca dari Supabase. Jam jadwal mungkin belum mengikuti jeda. Periksa izin SELECT tabel spinmatch_event_breaks. ({eventBreaksReadError})</div>}
              {showScheduleBreakEditor && selectedScheduleEvent && canManageEvent(selectedScheduleEvent) && <SpinMatchBreakEditor eventId={selectedScheduleEvent.id} breaks={eventBreaks[String(selectedScheduleEvent.id)] || []} onSaved={() => { setShowScheduleBreakEditor(false); loadEventBreaks(); }} canEdit={isEO || isSuperAdmin} />}
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
                {selectedScheduleEvent && <div className="border-b border-slate-200 p-4 text-center">
                  <h2 className="mb-1 text-lg font-black text-slate-900">JADWAL PERTANDINGAN</h2>
                  <h3 className="mb-1 text-base font-bold text-slate-800">{selectedScheduleEvent.nama?.toUpperCase()}</h3>
                  <p className="text-sm font-semibold text-slate-600">{selectedScheduleEvent.tanggal}</p>
                </div>}
                <div className="flex items-center gap-3 border-b border-slate-200 p-3 sm:p-4">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="schedule-player-search" className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                      <Search className="h-4 w-4 shrink-0 text-slate-500" />
                      Cari Pemain / Club:
                    </label>
                    <input id="schedule-player-search" type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Ketik nama pemain atau club..." className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none" />
                  </div>
                  <button type="button" onClick={() => setShowScheduleLegend(true)} aria-label="Buka keterangan jadwal" title="Keterangan Jadwal" className="mt-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-sm transition hover:bg-red-700">
                    <Info className="h-5 w-5" />
                  </button>
                </div>
              {selectedScheduleEvent && schedulePoolData && filteredScheduleRows.length > 0 ? (
                <div className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-max min-w-full whitespace-nowrap text-[12px] border-collapse [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap [&_th]:!px-1 [&_td]:!px-1 [&_th]:py-1.5 [&_td]:py-1.5 [&_th]:!text-[12px] [&_td]:!text-[12px]">
                      <thead>
                        <tr className="bg-slate-100 border-2 border-slate-300">
                          <th className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-300">Pool</th>
                          <th className="px-1 py-1 text-center font-bold text-slate-700 border border-slate-300">Nama Pemain</th>
                          <th className="px-1 py-1 text-center font-bold text-slate-700 border border-slate-300">Club/PTM</th>
                          <th className="py-1.5 px-1 text-center font-bold text-slate-700 border border-slate-300">Match</th>
                          <th className="py-1.5 px-1 text-center font-bold text-slate-700 border border-slate-300">Jam Main</th>
                          <th className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-300">Meja</th>
                          <th className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-300">Wasit</th>
                          <th className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-300">Tgl Main</th>
                          <th className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-300">Hari</th>
                          <th className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-300">Point</th>
                          <th className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-300">Pemenang</th>
                          <th className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-300">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredScheduleRows.map((row, index) => {
                          if (row.type === 'pool_header') {
                            return (
                              <tr key={index} className="bg-slate-50">
                                <td colSpan="12" className="py-2 px-2 font-bold text-slate-900 border border-slate-300 text-left">
                                  {row.pool}
                                  {schedulePoolData?.seededPools?.[row.pool]?.isSeededPool && (
                                    <span className="ml-1 text-amber-500" title={`Seed ${schedulePoolData.seededPools[row.pool].seedRank}`}>★</span>
                                  )}
                                </td>
                              </tr>
                            );
                          } else if (row.type === 'empty_row') {
                            return (
                              <tr key={index} className="h-4">
                                <td colSpan="12" className="border-0"></td>
                              </tr>
                            );
                          } else if (row.type === 'player') {
                            const hasResult = row.result !== null;
                            const eventId = selectedScheduleEvent?.id;
                            const { player1: p1, player2: p2 } = getLiveMatchPlayers(row, eventId);
                            const winnerName = hasResult ? (row.result.winner === 'player1' ? (p1?.nama || '-') : (p2?.nama || '-')) : '-';
                            const pointStr = hasResult ? `${row.result.player1Score} - ${row.result.player2Score}` : '';
                            const poolRanking = currentRankings[row.pool] || [];
                            const playerRanking = poolRanking.find(r => r.id === row.player.id);
                            const keterangan = hasResult && playerRanking ? playerRanking.keterangan : '';
                            return (
                              <tr key={index} className={`hover:bg-slate-50 transition cursor-pointer ${hasResult ? 'bg-emerald-50/30' : ''}`} onClick={() => isPublic ? openPublicLiveScore(row, selectedScheduleEvent?.id) : openLiveScore(row)}>
                                <td className="py-2 px-2 border border-slate-300 text-center font-bold text-slate-900">{row.playerCode}</td>
                                <td className="px-1 py-1 border border-slate-300 font-semibold text-slate-900">
                                  {row.player.nama}
                                  {(row.player.isSeed || row.player.seedRank) && (
                                    <span className="ml-1 text-amber-500" title={`Seed ${row.player.seedRank || row.player.isSeed}`}>★</span>
                                  )}
                                </td>
                                <td className="px-1 py-1 border border-slate-300 font-semibold text-slate-600">{row.player.ptm}</td>
                                <td className="py-1.5 px-1 border border-slate-300 text-center font-bold text-emerald-700">{row.matchLabel}</td>
                                <td className="py-2 px-3 border border-slate-300 text-center font-mono font-bold text-slate-700">{row.jam}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center font-bold text-slate-700">{row.meja}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center text-[10px] font-semibold text-indigo-700">{getScheduledReferee(selectedScheduleEvent?.id, row.meja)}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center text-slate-600">{row.tanggal}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center text-slate-600">{getDayName(row.tanggal) !== '-' ? getDayName(row.tanggal) : (row.hari || '-')}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center font-bold text-slate-700">{pointStr}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center font-bold text-emerald-700">{winnerName}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center whitespace-nowrap">
                                  <div className="inline-flex items-center gap-2 whitespace-nowrap">
                                  <button type="button" className={`inline-block shrink-0 rounded px-1.5 py-1 text-[10px] font-bold ${keterangan ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`} onClick={e=>{e.stopPropagation();setRatioDetail({pool:row.pool,eventId:selectedScheduleEvent?.id});}} title="Klik untuk melihat perhitungan rasio pool">{keterangan || 'Detail Rasio'}</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          } else if (row.type === 'single_player') {
                            const poolRanking = currentRankings[row.pool] || [];
                            const playerRanking = poolRanking.find(r => r.id === row.player.id);
                            const keterangan = playerRanking ? playerRanking.keterangan : '';
                            return (
                              <tr key={index} className="bg-slate-50">
                                <td className="py-2 px-2 border border-slate-300 text-center font-bold text-slate-900">{row.playerCode}</td>
                                <td className="py-2 px-3 border border-slate-300 font-semibold text-slate-900">
                                  {row.player.nama}
                                  {(row.player.isSeed || row.player.seedRank) && (
                                    <span className="ml-1 text-amber-500" title={`Seed ${row.player.seedRank || row.player.isSeed}`}>★</span>
                                  )}
                                </td>
                                <td className="py-2 px-3 border border-slate-300 font-semibold text-slate-600">{row.player.ptm}</td>
                                <td className="py-2 px-3 border border-slate-300 text-center text-slate-400">-</td>
                                <td className="py-2 px-3 border border-slate-300 text-center text-slate-400">-</td>
                                <td className="py-2 px-2 border border-slate-300 text-center text-slate-400">-</td>
                                <td className="py-2 px-2 border border-slate-300 text-center text-slate-400">-</td>
                                <td className="py-2 px-2 border border-slate-300 text-center text-slate-400">-</td>
                                <td className="py-2 px-2 border border-slate-300 text-center text-[10px] text-slate-500">-</td>
                                <td className="py-2 px-2 border border-slate-300 text-center"></td>
                                <td className="py-2 px-2 border border-slate-300 text-center"></td>
                                <td className="py-2 px-2 border border-slate-300 text-center">
<button type="button" className={`inline-block shrink-0 rounded px-2 py-1 text-[10px] font-bold ${keterangan ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`} onClick={e=>{e.stopPropagation();setRatioDetail({pool:row.pool,eventId:selectedScheduleEvent?.id});}} title="Klik untuk melihat perhitungan rasio pool">{keterangan || 'Detail Rasio'}</button>
                                </td>
                              </tr>
                            );
                          }
                          return null;
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 text-center">
                    <span className="font-semibold"> Klik pada baris pertandingan</span> untuk input skor via Live Skor
                  </div>
                </div>
              ) : selectedScheduleEvent && !schedulePoolData ? (
                <div className="border-t-2 border-dashed border-slate-200 p-8 text-center">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-500 mb-1">Belum Ada Hasil Undian</h4>
                  <p className="text-xs text-slate-400 mb-4">Lakukan undian terlebih dahulu untuk membuat jadwal pertandingan.</p>
                  {!isPublic && <button onClick={() => setActiveView('DRAW')} className="px-4 py-2 bg-[#bef264] hover:bg-[#a3e635] text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-sm">Buka Halaman Undian</button>}
                </div>
              ) : null}
              </div>
              {showScheduleLegend && <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={() => setShowScheduleLegend(false)}>
                <div role="dialog" aria-modal="true" aria-labelledby="schedule-legend-title" className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl" onClick={event => event.stopPropagation()}>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 id="schedule-legend-title" className="text-base font-black text-slate-900">Keterangan Jadwal</h3>
                    <button type="button" onClick={() => setShowScheduleLegend(false)} aria-label="Tutup keterangan jadwal" className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
                  </div>
                  <ol className="space-y-3 text-sm text-slate-700">
                    <li><strong>1. PM</strong> = Pemain Menang</li>
                    <li><strong>2. PK</strong> = Pemain Kalah</li>
                    <li><strong>3. M1/M2/M3</strong> = Nomor Pertandingan</li>
                  </ol>
                </div>
              </div>}
            </div>
          ) : activeView === 'KNOCKOUT' ? (
            <div className="sm-knockout space-y-5">
              {selectedKnockoutEvent && poolResults[selectedKnockoutEvent.id] ? (() => {
                const ko = buildKnockoutBracket(selectedKnockoutEvent.id);
                const divisi = selectedKnockoutEvent.divisiList?.[0]?.nama || '-';
                const finalMatch = ko.rounds[ko.rounds.length - 1]?.[0];
                const finalResult = finalMatch ? knockoutResults[`${selectedKnockoutEvent.id}_${finalMatch.id}`] : null;
                const runnerUp = finalResult?.winner === 'player1' ? finalMatch?.player2 : finalResult?.winner === 'player2' ? finalMatch?.player1 : null;
                const semiRound = ko.rounds.length >= 2 ? ko.rounds[ko.rounds.length - 2] : [];
                const bronze = semiRound.map(m => {
                  const r = knockoutResults[`${selectedKnockoutEvent.id}_${m.id}`];
                  if (!r?.winner) return null;
                  return r.winner === 'player1' ? m.player2 : m.player1;
                }).filter(Boolean);
                const quarterRound = ko.rounds.find(round => round.length === 4) || [];
                const topEight = quarterRound.flatMap(match => [match.player1, match.player2])
                  .filter(player => player && !player.isPlaceholder).slice(0, 8);
                const awardPrefix = `${selectedKnockoutEvent.id}_${divisi}`;
                const eventDate = String(selectedKnockoutEvent.tanggal || '');
                const eventYear = eventDate.match(/\b20\d{2}\b/)?.[0] || new Date().getFullYear();
                const setPrize = (place, value) => setKnockoutPrizes(previous => ({
                  ...previous,
                  [`${awardPrefix}_${place}`]: value
                }));
                const awardRows = [
                  { place: 'champion', label: 'Juara 1', players: ko.champion ? [ko.champion] : [] },
                  { place: 'runner-up', label: 'Juara 2', players: runnerUp ? [runnerUp] : [] },
                  { place: 'bronze-1', label: 'Juara 3 Bersama 1', players: bronze[0] ? [bronze[0]] : [] },
                  { place: 'bronze-2', label: 'Juara 3 Bersama 2', players: bronze[1] ? [bronze[1]] : [] },
                ];
                const topEightRows = topEight.map((player, index) => ({
                  place: `top-eight-${index}`,
                  label: '8 Besar • Tentative',
                  players: [player],
                }));
                const displayedAwardRows = [...awardRows, ...(showKnockoutTopEight ? topEightRows : [])];
                const awardTableWidth = 620;
                const awardTableHeight = 38 + displayedAwardRows.length * 28;

                return (
                  <>
                    <style>{`
                      @media print {
                        @page { size: A4 landscape; margin: 7mm; }
                        body * { visibility: hidden !important; }
                        #spinmatch-knockout-print-area,
                        #spinmatch-knockout-print-area * {
                          visibility: visible !important;
                        }
                        #spinmatch-knockout-print-area {
                          position: absolute !important;
                          left: 0 !important;
                          top: 0 !important;
                          width: 100% !important;
                          margin: 0 !important;
                          padding: 0 !important;
                          background: #fff !important;
                        }
                        #spinmatch-knockout-print-area #spinmatch-knockout-print {
                          overflow: visible !important;
                          border: 0 !important;
                          box-shadow: none !important;
                          padding: 4mm !important;
                        }
                        #spinmatch-knockout-print-area .knockout-screen-only {
                          display: none !important;
                        }
                        #spinmatch-knockout-print-area .min-w-max {
                          min-width: 0 !important;
                        }
                        #spinmatch-knockout-print-area .relative[style*="900px"] {
                          transform: scale(0.92);
                          transform-origin: top left;
                        }
                      }
                    `}</style>
                    <div id="spinmatch-knockout-print-area" className="space-y-3">
                    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs text-center">
                      <h1 className="text-xl font-black text-slate-950 uppercase">HASIL KEJUARAAN {selectedKnockoutEvent.nama}</h1>
                      <div className="mt-1 text-xs font-bold text-slate-500">
                        Tgl {selectedKnockoutEvent.tanggal || '-'} • Thn {eventYear}
                      </div>
                    </div>

                    <div id="spinmatch-knockout-print" className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto p-6">
                      {(() => {
                        // Bracket responsif mengikuti jumlah qualifier, bukan model tetap A-J.
                        const rounds = ko.rounds || [];
                        if (!rounds.length) return <p className="p-8 text-center text-sm text-slate-500">Belum ada peserta Knockout.</p>;
                        const eventId = selectedKnockoutEvent.id;
                        const W = 160, H = 86, GAP = 12, COLUMN_GAP = 62, LEFT = 14, TOP = 62;
                        const stride = H + GAP;
                        const columnStep = W + COLUMN_GAP;
                        const totalW = LEFT + rounds.length * columnStep - COLUMN_GAP + 24;
                        const totalH = TOP + (ko.bracketSize / 2) * stride + 30;
                        const matchY = (r, i) => TOP + ((2 ** r) * (i + 0.5) - 0.5) * stride;
                        const matchX = r => LEFT + r * columnStep;
                        const getName = p => p?.nama || 'Menunggu pemenang';
                        const canScore = isSuperAdmin || (isEO && canManageEvent(selectedKnockoutEvent));
                        return <div className="min-w-max" style={{width: totalW * knockoutZoom}}>
                          <div className="knockout-screen-only mb-3 flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-600">
                            <span className="rounded-lg bg-slate-100 px-3 py-1">Bracket {ko.bracketSize} slot</span>
                            <span className="rounded-lg bg-slate-100 px-3 py-1">BYE {ko.byeCount}</span>
                            <span className="rounded-lg bg-slate-100 px-3 py-1">{ko.drawReady ? 'Juara pool sudah tersedia' : 'Menunggu hasil lengkap pool'}</span>
                            <span className="ml-auto inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
                              <button type="button" aria-label="Perkecil bracket" title="Perkecil bracket" disabled={knockoutZoom <= 0.5} onClick={() => setKnockoutZoom(value => Math.max(0.5, Number((value - 0.1).toFixed(1))))} className="rounded px-2 py-1 text-sm font-black disabled:opacity-40">−</button>
                              <span className="min-w-10 text-center">{Math.round(knockoutZoom * 100)}%</span>
                              <button type="button" aria-label="Perbesar bracket" title="Perbesar bracket" disabled={knockoutZoom >= 1.3} onClick={() => setKnockoutZoom(value => Math.min(1.3, Number((value + 0.1).toFixed(1))))} className="rounded px-2 py-1 text-sm font-black disabled:opacity-40">+</button>
                            </span>
                          </div>
                          <div
                            className="relative"
                            style={{width:totalW,height:totalH * knockoutZoom,transform:`scale(${knockoutZoom})`,transformOrigin:'top left',touchAction:'pan-x pan-y'}}
                            onTouchStart={event => {
                              if (event.touches.length !== 2) return;
                              const [first, second] = event.touches;
                              const distance = Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
                              knockoutPinchRef.current = { distance, zoom: knockoutZoom };
                            }}
                            onTouchMove={event => {
                              if (event.touches.length !== 2 || !knockoutPinchRef.current) return;
                              const [first, second] = event.touches;
                              const distance = Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
                              const nextZoom = knockoutPinchRef.current.zoom * distance / knockoutPinchRef.current.distance;
                              setKnockoutZoom(Math.max(0.5, Math.min(1.3, Number(nextZoom.toFixed(2)))));
                            }}
                            onTouchEnd={event => {
                              if (event.touches.length < 2) knockoutPinchRef.current = null;
                            }}
                          >
                            <svg className="pointer-events-none absolute inset-0" width={totalW} height={totalH} aria-hidden="true">
                              <g fill="none" stroke="#64748b" strokeWidth="2" strokeLinejoin="round">
                                {rounds.slice(0,-1).flatMap((round,r) => round.map((m,i) => {
                                  const x1=matchX(r)+W, x2=matchX(r+1), y1=matchY(r,i)+H/2;
                                  const y2=matchY(r+1,Math.floor(i/2))+H/2;
                                  const mid=(x1+x2)/2;
                                  return <path key={`connector-${r}-${i}`} d={`M ${x1} ${y1} H ${mid} V ${y2} H ${x2}`} />;
                                }))}
                              </g>
                            </svg>
                            {rounds.map((round,r) => <React.Fragment key={r}>
                              <div className="absolute text-center text-[11px] font-black text-slate-600" style={{left:matchX(r),top:9,width:W}}>
                                {round.length===1?'FINAL':round.length===2?'SEMIFINAL':`${round.length*2} BESAR`}
                              </div>
                              {round.map((m,i) => {
                                const ready=Boolean(m.player1 && m.player2 && !m.player1.isPlaceholder && !m.player2.isPlaceholder);
                                const result=knockoutResults[`${eventId}_${m.id}`] || matchResults[`${eventId}_${m.id}`];
                                const meta=getKnockoutMatchMeta(eventId,rounds.slice(0,r).reduce((sum,arr)=>sum+arr.length,0)+i);
                                const byeRound=r===0 && (!m.player1 || !m.player2);
                                const p1=m.player1, p2=m.player2;
                                return <button type="button" key={m.id} disabled={!ready || !canScore}
                                  onClick={()=>ready && canScore && openKnockoutLiveScore({...m,...meta,matchRef:m.id})}
                                  title={ready ? (canScore?'Klik untuk Live Score':'Hanya EO yang dapat memasukkan skor Knockout'):'Menunggu pemain'}
                                  className={`absolute overflow-hidden rounded-xl border bg-white text-left shadow-sm ${ready&&canScore?'cursor-pointer border-blue-300 hover:border-lime-500 hover:shadow-md':'cursor-default border-slate-200'}`}
                                  style={{left:matchX(r),top:matchY(r,i),width:W,height:H}}>
                                  <div className={`flex h-[24px] items-center justify-between border-b px-2 text-[9px] font-bold ${result?.winner==='player1'?'bg-emerald-50 text-emerald-800':'text-slate-800'}`}>
                                    <span className="min-w-0 truncate"><span className="block truncate">{getName(p1)}</span><span className="block truncate text-[7px] font-semibold text-slate-500">{p1?.ptm || 'PTM/Club belum diisi'}</span></span><span className="ml-1">{result?.player1Score ?? ''}</span>
                                  </div>
                                  <div className={`flex h-[24px] items-center justify-between border-b px-2 text-[9px] font-bold ${result?.winner==='player2'?'bg-emerald-50 text-emerald-800':'text-slate-800'}`}>
                                    <span className="min-w-0 truncate"><span className="block truncate">{byeRound&&!p2?'BYE':getName(p2)}</span><span className="block truncate text-[7px] font-semibold text-slate-500">{p2?.ptm || (byeRound&&!p2 ? '' : 'PTM/Club belum diisi')}</span></span><span className="ml-1">{result?.player2Score ?? ''}</span>
                                  </div>
                                  <div className="truncate px-2 py-0 text-[7px] font-semibold text-sky-700">{meta.jam} · {meta.meja}</div>
                                  <div className="truncate border-t border-slate-100 px-2 py-0 text-[7px] font-semibold text-indigo-700" title={`Wasit: ${getScheduledReferee(eventId, meta.meja)}`}>
                                    Wasit: {getScheduledReferee(eventId, meta.meja)}
                                  </div>
                                </button>;
                              })}
                            </React.Fragment>)}
                          </div>
                        </div>;
                      })()}
                    </div>
                    </div>

                    <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
                      <div className="border-b border-slate-300 bg-slate-50 p-4 text-center">
                        <h2 className="text-sm font-black uppercase text-slate-900">HASIL KEJUARAAN {selectedKnockoutEvent.nama}</h2>
                        <p className="mt-1 text-xs font-bold text-slate-600">Tgl {selectedKnockoutEvent.tanggal || '-'} • Thn {eventYear}</p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-blue-50 px-3 py-2">
                        <div className="text-xs font-black text-blue-950">Kategori: {divisi}</div>
                        <div className="knockout-screen-only inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-[10px] font-bold">
                          <button type="button" aria-label="Perkecil tabel hasil" title="Perkecil tabel hasil" disabled={knockoutAwardsZoom <= 0.5} onClick={() => setKnockoutAwardsZoom(value => Math.max(0.5, Number((value - 0.1).toFixed(1))))} className="rounded px-2 py-1 text-sm font-black disabled:opacity-40">−</button>
                          <span className="min-w-10 text-center">{Math.round(knockoutAwardsZoom * 100)}%</span>
                          <button type="button" aria-label="Perbesar tabel hasil" title="Perbesar tabel hasil" disabled={knockoutAwardsZoom >= 1.3} onClick={() => setKnockoutAwardsZoom(value => Math.min(1.3, Number((value + 0.1).toFixed(1))))} className="rounded px-2 py-1 text-sm font-black disabled:opacity-40">+</button>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <div
                          style={{width:awardTableWidth * knockoutAwardsZoom,height:awardTableHeight * knockoutAwardsZoom,touchAction:'pan-x'}}
                          onTouchStart={event => {
                            if (event.touches.length !== 2) return;
                            const [first, second] = event.touches;
                            const distance = Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
                            knockoutAwardsPinchRef.current = { distance, zoom: knockoutAwardsZoom };
                          }}
                          onTouchMove={event => {
                            if (event.touches.length !== 2 || !knockoutAwardsPinchRef.current) return;
                            const [first, second] = event.touches;
                            const distance = Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
                            const nextZoom = knockoutAwardsPinchRef.current.zoom * distance / knockoutAwardsPinchRef.current.distance;
                            setKnockoutAwardsZoom(Math.max(0.5, Math.min(1.3, Number(nextZoom.toFixed(2)))));
                          }}
                          onTouchEnd={event => {
                            if (event.touches.length < 2) knockoutAwardsPinchRef.current = null;
                          }}
                        >
                        <table className="w-full min-w-[620px] border-collapse text-left text-[10px]" style={{transform:`scale(${knockoutAwardsZoom})`,transformOrigin:'top left'}}>
                          <thead className="bg-slate-100 text-[9px] font-black uppercase text-slate-700">
                            <tr>
                              <th className="border border-slate-300 px-2 py-1.5">Hasil Juara</th>
                              <th className="border border-slate-300 px-2 py-1.5">Nama Juara</th>
                              <th className="border border-slate-300 px-2 py-1.5">PTM/Club</th>
                              <th className="border border-slate-300 px-2 py-1.5">Hadiah</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayedAwardRows.map(row => {
                              const players = row.players;
                              const rowKey = `${awardPrefix}_${row.place}`;
                              return <tr key={row.place} className="odd:bg-white even:bg-slate-50">
                                <td className="h-7 border border-slate-300 px-2 py-1 font-black leading-tight text-slate-800">{row.label}</td>
                                <td className="h-7 border border-slate-300 px-2 py-1 font-bold leading-tight text-slate-900">{players.length ? players.map(player => player.nama).join(' & ') : '-'}</td>
                                <td className="h-7 border border-slate-300 px-2 py-1 leading-tight text-slate-700">{players.length ? players.map(player => player.ptm || '-').join(' & ') : '-'}</td>
                                <td className="h-7 border border-slate-300 px-2 py-0.5">
                                  <input type="number" min="0" step="1" inputMode="numeric" aria-label={`Hadiah ${row.label}`} placeholder="Nominal" value={knockoutPrizes[rowKey] || ''} onChange={event => setPrize(row.place, event.target.value)} className="h-6 w-full min-w-24 rounded border border-slate-300 bg-white px-1 text-[10px] font-bold leading-none text-slate-900" />
                                </td>
                              </tr>;
                            })}
                          </tbody>
                        </table>
                        </div>
                      </div>
                      <button type="button" onClick={() => setShowKnockoutTopEight(value => !value)} className="flex w-full items-center justify-center gap-2 border-t border-slate-200 bg-white px-4 py-3 text-xs font-black text-blue-800 hover:bg-blue-50">
                        <span className="text-lg leading-none">{showKnockoutTopEight ? '−' : '+'}</span>
                        {showKnockoutTopEight ? 'Sembunyikan 8 Besar Tentative' : 'Tampilkan 8 Besar Tentative'}
                      </button>
                      {showKnockoutTopEight && topEight.length === 0 && <p className="border-t border-slate-200 p-3 text-center text-xs text-slate-500">Data 8 besar tersedia setelah bracket mencapai babak 8 besar.</p>}
                    </section>
                  </>
                );
              })() : (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                  <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-500">Belum Ada Data Pool</h4>
                  <p className="text-xs text-slate-400 mt-1">Lakukan Undian Pool terlebih dahulu.</p>
                </div>
              )}
            </div>
          ) : activeView === 'LIVE_SCORE' ? (
            <div className="sm-live space-y-6">
              {selectedLiveEvent && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-3xl p-6">
                  <div className={`flex flex-wrap gap-4 ${isPublic ? 'flex-col items-center justify-center text-center' : 'items-center justify-between'}`}>
                    <div className={isPublic ? 'text-center' : ''}>
                      <div className={`flex items-center gap-2 mb-1 ${isPublic ? 'justify-center' : ''}`}>
                        <Radio className="w-5 h-5 text-red-600" />
                        <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Live Skor</span>
                      </div>
                      <h2 className="text-xl font-black text-slate-900">{selectedLiveEvent.nama}</h2>
                      <p className="text-xs text-slate-600 mt-1">{selectedLiveEvent.tanggal}</p>
                    </div>
                    <div className={`flex items-center gap-3 ${isPublic ? 'justify-center' : ''}`}>
                      <div className="text-center px-4 py-2 bg-white rounded-2xl border border-red-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-500">Total Match</div>
                        <div className="text-2xl font-black text-red-700">{liveScoreRows.filter(r => r.type === 'player' && r.showMatch).length}</div>
                      </div>
                      <div className="text-center px-4 py-2 bg-white rounded-2xl border border-red-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-500">Selesai</div>
                        <div className="text-2xl font-black text-emerald-700">{liveScoreRows.filter(r => r.type === 'player' && r.result !== null).length}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {selectedLiveEvent && liveScorePoolData && liveScoreRows.length > 0 ? (
                <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                  <div className={`p-4 bg-slate-50 border-b border-slate-200 ${isPublic ? 'text-center' : ''}`}>
                    <h3 className={`text-sm font-bold text-slate-700 flex items-center gap-2 ${isPublic ? 'justify-center' : ''}`}>
                      <Radio className="w-4 h-4 text-red-500" /> {isPublic ? 'Pantau Skor Pertandingan' : 'Pilih Match untuk Input Skor'}
                    </h3>
                    {isPublic ? <div className="mt-3 flex flex-wrap items-center justify-center gap-2"><label htmlFor="public-live-table" className="text-xs font-bold text-slate-700">Pilih meja:</label><select id="public-live-table" value={publicLiveTable} onChange={e => setPublicLiveTable(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800"><option value="ALL">Semua Meja</option>{Array.from({ length: Math.max(1, Number(selectedLiveEvent?.jumlahMeja || 4)) }, (_, i) => <option key={i+1} value={String(i+1)}>Meja {i+1}</option>)}</select><span className="text-xs text-slate-500">Hanya melihat, tidak dapat mengubah skor.</span></div> : <p className="text-xs text-slate-500 mt-1">Klik pada baris match untuk membuka form Live Skor</p>}
                  </div>
                  <div className="overflow-x-auto">
                    <table className={`w-full text-xs border-collapse ${isPublic ? 'min-w-max whitespace-nowrap' : ''}`}>
                      <thead>
                        <tr className="bg-slate-100 border-2 border-slate-300">
                          <th className={`${isPublic ? 'py-1 px-2' : 'py-2 px-2'} text-center font-bold text-slate-700 border border-slate-300`}>Pool</th>
                          <th className={`${isPublic ? 'py-1 px-2' : 'py-2 px-3'} text-center font-bold text-slate-700 border border-slate-300`}>Nama Pemain</th>
                          <th className={`${isPublic ? 'py-1 px-2' : 'py-2 px-3'} text-center font-bold text-slate-700 border border-slate-300`}>Club/PTM</th>
                          <th className={`${isPublic ? 'py-1 px-2' : 'py-2 px-3'} text-center font-bold text-slate-700 border border-slate-300`}>Match</th>
                          <th className={`${isPublic ? 'py-1 px-2' : 'py-2 px-3'} text-center font-bold text-slate-700 border border-slate-300`}>Jam Main</th>
                          <th className={`${isPublic ? 'py-1 px-2' : 'py-2 px-2'} text-center font-bold text-slate-700 border border-slate-300`}>Meja</th>
                          <th className={`${isPublic ? 'py-1 px-2' : 'py-2 px-2'} text-center font-bold text-slate-700 border border-slate-300`}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleLiveScoreRows.map((row, index) => {
                          if (row.type === 'pool_header') {
                            return (
                              <tr key={index} className="bg-slate-50">
                                <td colSpan="7" className={`${isPublic ? 'py-1 px-2 whitespace-nowrap' : 'py-2 px-2'} font-bold text-slate-900 border border-slate-300 text-left`}>{row.pool}</td>
                              </tr>
                            );
                          } else if (row.type === 'empty_row') {
                            return (
                              <tr key={index} className={isPublic ? 'h-2' : 'h-4'}>
                                <td colSpan="7" className="border-0"></td>
                              </tr>
                            );
                          } else if (row.type === 'player' && row.showMatch) {
                            const hasResult = row.result !== null;
                            const statusLabel = hasResult ? '✓ Selesai' : '⏳ Belum';
                            const statusColor = hasResult ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
                            return (
                              <tr key={index} className={`cursor-pointer transition hover:bg-slate-50 ${hasResult ? 'bg-emerald-50/30' : ''}`} onClick={() => isPublic ? openPublicLiveScore(row, selectedLiveEvent?.id) : openLiveScore(row)}>
                                <td className={`${isPublic ? 'py-1 px-2' : 'py-2 px-2'} border border-slate-300 text-center font-bold text-slate-900`}>{row.playerCode}</td>
                                <td className={`${isPublic ? 'py-1 px-2' : 'py-2 px-3'} border border-slate-300 font-semibold text-slate-900`}>
                                  {row.player.nama}
                                  {(row.player.isSeed || row.player.seedRank) && (
                                    <span className="ml-1 text-amber-500" title={`Seed ${row.player.seedRank || row.player.isSeed}`}>★</span>
                                  )}
                                </td>
                                <td className={`${isPublic ? 'py-1 px-2' : 'py-2 px-3'} border border-slate-300 font-semibold text-slate-600`}>{row.player.ptm}</td>
                                <td className={`${isPublic ? 'py-1 px-2' : 'py-2 px-3'} border border-slate-300 text-center font-bold text-emerald-700`}>{row.matchLabel}</td>
                                <td className={`${isPublic ? 'py-1 px-2' : 'py-2 px-3'} border border-slate-300 text-center font-mono font-bold text-slate-700`}>{row.jam}</td>
                                <td className={`${isPublic ? 'py-1 px-2' : 'py-2 px-2'} border border-slate-300 text-center font-bold text-slate-700`}>{row.meja}</td>
                                <td className={`${isPublic ? 'py-1 px-2' : 'py-2 px-2'} border border-slate-300 text-center`}>
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${statusColor}`}>{statusLabel}</span>{isPublic && hasResult && <span className="ml-1 font-black text-emerald-700">{row.result.player1Score} - {row.result.player2Score}</span>}{isPublic && hasResult && Array.isArray(row.result.gameHistory) && row.result.gameHistory.length > 0 && <span className="ml-1 text-[10px] text-slate-600">{row.result.gameHistory.filter(g => g && g.p1 !== '' && g.p2 !== '').map((g,i) => `S${i+1}: ${g.p1}-${g.p2}`).join(' | ')}</span>}
                                </td>
                              </tr>
                            );
                          }
                          return null;
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : selectedLiveEvent && !liveScorePoolData ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                  <Radio className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-500 mb-1">Belum Ada Jadwal</h4>
                  <p className="text-xs text-slate-400 mb-4">Lakukan undian terlebih dahulu.</p>
                  {!isPublic && <button onClick={() => setActiveView('DRAW')} className="px-4 py-2 bg-[#bef264] hover:bg-[#a3e635] text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-sm">Buka Halaman Undian</button>}
                </div>
              ) : null}
            </div>
          ) : activeView === 'RANKING' ? (
            <div className="sm-ranking-print-area mx-auto w-full max-w-[1500px] space-y-3">
              <div className="rounded-[24px] border border-slate-100 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,.05)] sm:p-4">
                <div className="flex flex-wrap items-end gap-2">
                  {rankingMode === 'EVENT' && (
                    <div className="min-w-[180px] flex-1">
                      <label className="mb-1 block text-[9px] font-black uppercase tracking-wide text-slate-400">Pilih Event</label>
                      <select
                        value={selectedEventIdForRanking}
                        onChange={(e) => selectDashboardEvent(events.find(ev => String(ev.id) === e.target.value))}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-bold outline-none focus:border-blue-500"
                      >
                        {events.map(ev => <option key={ev.id} value={ev.id}>{ev.nama} • {ev.tanggal}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="min-w-[140px] flex-1">
                    <label className="mb-1 block text-[9px] font-black uppercase tracking-wide text-slate-400">Pilih Divisi</label>
                    <select
                      value={effectiveRankingDivision}
                      onChange={(e) => setSelectedDivisionForRanking(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-bold outline-none focus:border-blue-500"
                    >
                      {rankingDivisionOptions.length === 0
                        ? <option value="">Belum ada divisi</option>
                        : rankingDivisionOptions.map(div => <option key={div} value={div}>{div}</option>)}
                    </select>
                  </div>

                  <div className="rounded-lg bg-blue-50 px-3 py-1.5">
                    <div className="text-[8px] font-black uppercase text-blue-500">Mode</div>
                    <div className="whitespace-nowrap text-[10px] font-black text-[#0a3971]">
                      {rankingMode === 'EVENT' ? 'Event Tertentu' : 'Seluruh Event SpinMatch'}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <button type="button" onClick={() => document.getElementById('sm-ranking-table')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="inline-flex h-8 items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 text-[10px] font-black text-blue-800 hover:bg-blue-100">
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </button>
                    <button type="button" onClick={() => window.print()} className="inline-flex h-8 items-center gap-1 rounded-lg bg-[#6857d9] px-2.5 text-[10px] font-black text-white hover:bg-[#5746c5]">
                      <Printer className="h-3.5 w-3.5" /> Print
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,.05)]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-2.5 sm:px-4">
                  <div className="min-w-0">
                    <h3 className="whitespace-nowrap text-xs font-black text-slate-900">
                      {rankingMode === 'EVENT'
                        ? effectiveRankingDivision || 'Pilih Divisi'
                        : `Akumulasi Seluruh Event yang menggunakan SpinMatch. (Total ${rankingRows.length} Pemain)`}
                    </h3>
                    {rankingMode === 'EVENT' && <p className="mt-0.5 whitespace-nowrap text-[9px] text-slate-400">{selectedRankingEvent?.nama || '-'}</p>}
                    {rankingMode === 'GLOBAL' && <p className="mt-0.5 text-[9px] font-semibold text-slate-500">Divisi: {effectiveRankingDivision || 'Semua'}</p>}
                  </div>
                  {rankingMode === 'EVENT' && <div className="rounded-full bg-[#071b3b] px-2.5 py-1 text-[9px] font-black text-white">{rankingRows.length} Pemain</div>}
                </div>

                <div id="sm-ranking-table" className="max-h-[60vh] min-h-[240px] overflow-auto">
                  <table className="w-full min-w-[760px] whitespace-nowrap">
                    <thead className="text-[9px] uppercase tracking-wide text-slate-400">
                      <tr>
                        <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2 text-left">Rank</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2 text-left">Pemain</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2 text-left">PTM / Club</th>
                        {rankingMode === 'GLOBAL' && <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2 text-center">Event</th>}
                        <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2 text-center">Main</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2 text-center">Menang</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2 text-center">Kalah</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2 text-center">Set +/-</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2 text-center">Rasio Set</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2 text-center">Rasio Bola</th>
                        <th className="sticky top-0 z-10 bg-slate-50 px-3 py-2 text-right">Poin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rankingRows.length === 0 ? (
                        <tr><td colSpan={rankingMode === 'GLOBAL' ? 12 : 11} className="px-5 py-8 text-center text-xs font-bold text-slate-400">Belum ada hasil pertandingan untuk divisi ini.</td></tr>
                      ) : rankingRows.map(row => (
                        <tr key={`${row.id || row.nama}-${row.rank}`} className="hover:bg-slate-50">
                          <td className="px-3 py-1.5">
                            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-black ${
                              row.rank === 1 ? 'bg-amber-100 text-amber-700' :
                              row.rank === 2 ? 'bg-slate-200 text-slate-700' :
                              row.rank === 3 ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-50 text-blue-700'
                            }`}>{row.rank}</span>
                          </td>
                          <td className="px-3 py-1.5 text-[11px] font-black text-slate-900">{row.nama}</td>
                          <td className="px-3 py-1.5 text-[10px] font-semibold text-slate-500">{row.ptm}</td>
                          {rankingMode === 'GLOBAL' && <td className="px-3 py-1.5 text-center text-[10px] font-bold">{row.eventCount}</td>}
                          <td className="px-3 py-1.5 text-center text-[10px] font-bold">{row.main}</td>
                          <td className="px-3 py-1.5 text-center text-[10px] font-black text-emerald-600">{row.menang}</td>
                          <td className="px-3 py-1.5 text-center text-[10px] font-black text-rose-500">{row.kalah}</td>
                          <td className="px-3 py-1.5 text-center text-[10px] font-bold">{row.setMenang}–{row.setKalah}</td>
                          <td className="px-3 py-1.5 text-center text-[10px] font-bold">{row.setKalah ? (row.setMenang / row.setKalah).toFixed(3) : row.setMenang ? '∞' : '-'}</td>
                          <td className="px-3 py-1.5 text-center text-[10px] font-bold">{row.bolaKalah ? (row.bolaMenang / row.bolaKalah).toFixed(3) : row.bolaMenang ? '∞' : '-'}</td>
                          <td className="px-3 py-1.5 text-right text-xs font-black text-[#0a3971]">{row.poin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-[9px] font-semibold text-slate-400">
                  Rasio = total set menang ÷ set kalah; rasio bola = total poin bola menang ÷ poin bola kalah. Poin ranking SpinMatch sementara: menang 3, kalah 0 (bukan Match Point klasemen ITTF).
                </div>
              </div>
              <style>{`
                @media print {
                  @page { size: landscape; margin: 8mm; }
                  body * { visibility: hidden !important; }
                  .sm-ranking-print-area,
                  .sm-ranking-print-area * { visibility: visible !important; }
                  .sm-ranking-print-area {
                    position: absolute !important;
                    inset: 0 auto auto 0 !important;
                    width: 100% !important;
                    max-width: none !important;
                    margin: 0 !important;
                    overflow: visible !important;
                    background: #fff !important;
                    color: #000 !important;
                  }
                  .sm-ranking-print-area button { display: none !important; }
                  .sm-ranking-print-area,
                  .sm-ranking-print-area > div,
                  .sm-ranking-print-area #sm-ranking-table {
                    max-height: none !important;
                    min-height: 0 !important;
                    overflow: visible !important;
                    box-shadow: none !important;
                  }
                  .sm-ranking-print-area thead th { position: static !important; }
                }
              `}</style>
            </div>

          ) : activeView === 'SETTINGS' ? (
            <div className="mx-auto w-full max-w-[1500px] space-y-4">
              {settingsSection === 'PRICING' && isSuperAdmin ? (
                <div><button type="button" onClick={() => setSettingsSection('HOME')} className="mb-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-black"><ArrowLeft className="h-4 w-4"/>Kembali</button><PricingAdminPanel /></div>
              ) : settingsSection === 'PAYMENT_REVIEW' && isSuperAdmin ? (
                <div className="space-y-4"><button type="button" onClick={() => setSettingsSection('HOME')} className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-black"><ArrowLeft className="h-4 w-4"/>Kembali</button><PaymentReviewPanel onEventUpdated={async () => { const {data,error}=await supabase.from('Events').select('*').order('id',{ascending:true}); if(!error && Array.isArray(data)) setEvents(data.map(eventFromSupabase)); }} /></div>
              ) : !selectedSettingsEvent && !(isSuperAdmin && settingsSection === 'HOME') ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm font-bold text-slate-400">Belum ada event.</div>
              ) : settingsSection === 'HOME' ? (
                <>
                  {isSuperAdmin && <button type="button" onClick={() => setSettingsSection('PRICING')} className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-left font-black text-white shadow-lg"><span>Tarif & Pembayaran — Super Admin</span><span>ATUR →</span></button>}
                  {selectedSettingsEvent && <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,.05)]">
                    <div className="text-[10px] font-black uppercase tracking-wide text-slate-400">Event yang diatur</div>
                    <div className="mt-1 text-lg font-black text-slate-950">{selectedSettingsEvent.nama}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-400">{selectedSettingsEvent.tanggal}</div>
                  </div>}

                  {selectedSettingsEvent && canManageEvent(selectedSettingsEvent) && <button type="button" onClick={() => setSettingsSection('SUPERVISOR')} className="flex w-full items-center justify-between rounded-2xl border border-blue-200 bg-white p-4 text-left shadow-sm"><span className="flex items-center gap-3 text-sm font-black text-blue-950"><ShieldCheck className="h-6 w-6 text-blue-700" />Kelola Referee (Pengawas Pertandingan)</span><span className="text-xs font-bold text-blue-700">BUKA →</span></button>}
                  {selectedSettingsEvent && <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <button onClick={() => { handleRowClick(selectedSettingsEvent); }} className="group relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#071b3b] via-[#0a3971] to-[#0874c9] p-5 text-left text-white shadow-lg transition hover:-translate-y-1">
                      <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                      <Settings className="relative z-10 h-7 w-7 text-cyan-200" />
                      <div className="relative z-10 mt-4 text-sm font-black">Pengaturan Pertandingan</div>
                      <div className="relative z-10 mt-1 text-[10px] text-blue-100/70">{settingsTableCount} meja • {selectedSettingsEvent.durasiMatch || '20 Menit'} • {selectedSettingsEvent.jamMulai || '08:00'}–{selectedSettingsEvent.jamSelesai || '18:00'}</div>
                      <div className="relative z-10 mt-5 text-[9px] font-black text-[#8DFF63]">BUKA PENGATURAN →</div>
                    </button>

                    <button onClick={() => setSettingsSection('REFEREE')} className="group relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#071b3b] via-[#0a3971] to-[#0874c9] p-5 text-left text-white shadow-lg transition hover:-translate-y-1">
                      <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                      <Users className="relative z-10 h-7 w-7 text-cyan-200" />
                      <div className="relative z-10 mt-4 text-sm font-black">Pengaturan Wasit</div>
                      <div className="relative z-10 mt-1 text-[10px] text-blue-100/70">{assignedRefereeCount}/{settingsTableCount} meja sudah memiliki wasit</div>
                      <div className="relative z-10 mt-5 text-[9px] font-black text-[#8DFF63]">ATUR WASIT →</div>
                    </button>

                    <button onClick={() => setSettingsSection('FINANCE')} className="group relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#071b3b] via-[#0a3971] to-[#0874c9] p-5 text-left text-white shadow-lg transition hover:-translate-y-1">
                      <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                      <Wallet className="relative z-10 h-7 w-7 text-cyan-200" />
                      <div className="relative z-10 mt-4 text-sm font-black">Pengaturan Keuangan</div>
                      <div className="relative z-10 mt-1 text-[10px] text-blue-100/70">Pemasukan, pengeluaran dan laporan event</div>
                      <div className="relative z-10 mt-5 text-[9px] font-black text-[#8DFF63]">BUKA KEUANGAN →</div>
                    </button>
                  </div>}
                </>
              ) : settingsSection === 'SUPERVISOR' && (isEO || isSuperAdmin) ? (
                <div className="space-y-4">
                  <div className="rounded-[24px] border border-sky-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setSettingsSection('HOME')} className="rounded-xl bg-slate-100 p-2 text-slate-700"><ArrowLeft className="h-4 w-4" /></button>
                      <ShieldCheck className="h-7 w-7 text-blue-700" />
                      <div><h3 className="text-lg font-black text-slate-900">Kelola Referee</h3><p className="text-xs text-slate-500">Pengawas pertandingan — berbeda dari Wasit meja</p></div>
                    </div>
                    <div className="mt-5 rounded-xl bg-blue-50 p-4">
                      <p className="text-sm font-bold text-blue-950">{selectedSettingsEvent?.nama || 'Pilih event terlebih dahulu'}</p>
                      <p className="mt-1 text-xs text-blue-800">Satu event memiliki satu Referee aktif. Akun Referee boleh digunakan kembali untuk event berikutnya setelah penugasan sebelumnya selesai.</p>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 p-4"><h4 className="text-sm font-black text-slate-800">Kewenangan Referee</h4><p className="mt-2 text-xs leading-6 text-slate-600">Memantau pertandingan, mengatur urutan dan pemanggilan, penempatan meja, pergantian Wasit, serta status operasional pertandingan.</p></div>
                      <div className="rounded-xl border border-rose-100 bg-rose-50 p-4"><h4 className="text-sm font-black text-rose-900">Tidak boleh mengubah hasil</h4><p className="mt-2 text-xs leading-6 text-rose-800">Tidak dapat mengubah skor, poin klasemen, ranking, peserta, undian, atau menghapus event.</p></div>
                    </div>
                    {selectedSettingsEvent && canManageEvent(selectedSettingsEvent) && <SupervisorManagementPanel eventItem={selectedSettingsEvent} />}
                  </div>
                </div>
              ) : settingsSection === 'REFEREE' ? (
                <div className="space-y-4">
                  {canManageEvent(selectedSettingsEvent) && <RefereeOnlineAccounts eventItem={selectedSettingsEvent} tableCount={settingsTableCount} onAccountsChanged={setOnlineReferees} />}

                  <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,.05)]">
                    <div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setSettingsSection('HOME')} className="rounded-xl bg-slate-100 p-2 text-slate-700"><ArrowLeft className="h-4 w-4" /></button>
                        <div>
                          <h3 className="text-sm font-black text-slate-900">Pengaturan Wasit</h3>
                          <p className="text-[10px] text-slate-400">{selectedSettingsEvent.nama} • {settingsTableCount} meja</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setRefereeModalOpen(true)} className="rounded-xl bg-[#071b3b] px-4 py-2.5 text-[10px] font-black text-white hover:bg-[#0a3971]">+ Tambah Wasit</button>
                        <button onClick={saveRefereeAssignments} className="rounded-xl bg-[#8DFF63] px-4 py-2.5 text-[10px] font-black text-[#09243e]">Simpan Penugasan</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 p-5 lg:grid-cols-5">
                      <div className="rounded-2xl bg-blue-50 p-4"><div className="text-[9px] font-black text-blue-500">JUMLAH MEJA</div><div className="mt-1 text-2xl font-black text-[#0a3971]">{settingsTableCount}</div></div>
                      <div className="rounded-2xl bg-emerald-50 p-4"><div className="text-[9px] font-black text-emerald-600">DITUGASKAN</div><div className="mt-1 text-2xl font-black text-emerald-700">{assignedRefereeCount}</div></div>
                      <div className="rounded-2xl bg-rose-50 p-4"><div className="text-[9px] font-black text-rose-600">SEDANG BERTUGAS</div><div className="mt-1 text-2xl font-black text-rose-700">{workingRefereeCount}</div></div>
                      <div className="rounded-2xl bg-cyan-50 p-4"><div className="text-[9px] font-black text-cyan-600">SIAP / MENUNGGU</div><div className="mt-1 text-2xl font-black text-cyan-800">{readyRefereeCount + waitingRefereeCount}</div></div>
                      <div className="rounded-2xl bg-amber-50 p-4"><div className="text-[9px] font-black text-amber-600">MEJA KOSONG</div><div className="mt-1 text-2xl font-black text-amber-700">{Math.max(0, settingsTableCount - assignedRefereeCount)}</div></div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,.05)]">
                    <div className="border-b border-slate-100 p-5">
                      <h4 className="text-xs font-black text-slate-900">Penugasan Meja</h4>
                      {onlineRefereesLoading && <p className="text-xs text-blue-600">Memuat penugasan online...</p>}
                      {onlineRefereesError && <p className="text-xs text-red-600">Gagal memuat akun wasit online: {onlineRefereesError}</p>}
                      <p className="mt-1 text-[9px] font-semibold text-slate-400">Akun wasit online otomatis ditugaskan ke meja yang dipilih saat pembuatan. Wasit lokal lama tetap tersedia untuk meja lain. Status tugas berubah otomatis: MENUNGGU → BERTUGAS saat skor mulai diinput → SIAP setelah hasil final disimpan.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[760px]">
                        <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-wide text-slate-400">
                          <tr><th className="px-5 py-3 text-left">Meja</th><th className="px-4 py-3 text-left">ID Wasit</th><th className="px-4 py-3 text-left">Nama Wasit</th><th className="px-4 py-3 text-center">Status Akun</th><th className="px-4 py-3 text-center">Status Tugas</th><th className="px-5 py-3 text-right">Aksi</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {Array.from({ length: settingsTableCount }, (_, i) => i + 1).map(no => {
                            const a = currentRefereeAssignments[String(no)] || {};
                            const onlineRegistered = onlineRefereeForTable(no);
                            const registered = onlineRegistered ? { id: `ONLINE-${onlineRegistered.id}`, nama: onlineRegistered.nama_wasit, status: onlineRegistered.status, kode: onlineRegistered.kode_wasit } : refereeRegistry.find(r => r.id === a.refereeId);
                            const hasValidAssignment = !!registered;
                            const status = registered?.status || '';
                            const workStatus = getRefereeWorkStatus(no, a);
                            return (
                              <tr key={no} className="hover:bg-slate-50/70">
                                <td className="px-5 py-4"><span className="inline-flex h-8 min-w-8 items-center justify-center rounded-xl bg-[#071b3b] px-2 text-[10px] font-black text-white">{no}</span></td>
                                <td className="px-4 py-4">
                                  <select disabled={!!onlineRegistered} value={hasValidAssignment ? registered.id : ''} onChange={e => assignRegisteredReferee(no, e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black text-slate-800 outline-none focus:border-blue-500">
                                    <option value="">Belum Ditugaskan</option>
                                    {onlineRegistered && <option value={`ONLINE-${onlineRegistered.id}`}>{onlineRegistered.kode_wasit} • {onlineRegistered.nama_wasit}</option>}
                                    {refereeRegistry.map(r => <option key={r.id} value={r.id} disabled={r.status !== 'AKTIF'}>{r.id} {r.status !== 'AKTIF' ? '• NONAKTIF' : ''}</option>)}
                                  </select>
                                </td>
                                <td className="px-4 py-4 text-xs font-black text-slate-800">{hasValidAssignment ? registered.nama : '-'}</td>
                                <td className="px-4 py-4 text-center">
                                  {!hasValidAssignment ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[8px] font-black text-slate-500">-</span>
                                    : status === 'AKTIF' ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[8px] font-black text-emerald-700">AKTIF</span>
                                    : <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[8px] font-black text-rose-700">NONAKTIF</span>}
                                </td>
                                <td className="px-4 py-4 text-center">
                                  {workStatus.code === 'BERTUGAS' ? <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[8px] font-black text-rose-700">BERTUGAS</span>
                                    : workStatus.code === 'SIAP' ? <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-[8px] font-black text-cyan-800">SIAP</span>
                                    : workStatus.code === 'MENUNGGU' ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[8px] font-black text-amber-700">MENUNGGU</span>
                                    : workStatus.code === 'NONAKTIF' ? <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[8px] font-black text-slate-600">NONAKTIF</span>
                                    : <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[8px] font-black text-slate-500">KOSONG</span>}
                                </td>
                                <td className="px-5 py-4 text-right">
                                  {hasValidAssignment && !onlineRegistered && <button onClick={() => assignRegisteredReferee(no, '')} className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-1.5 text-[8px] font-black text-rose-600">Batalkan Tugas</button>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,.05)]">
                    <div className="flex items-center justify-between border-b border-slate-100 p-5">
                      <div><h4 className="text-xs font-black text-slate-900">Master Wasit SpinMatch</h4><p className="mt-1 text-[9px] font-semibold text-slate-400">Status AKTIF/NONAKTIF adalah status akun dan hanya diatur EO/Super Admin. Status tugas pertandingan berubah otomatis.</p></div>
                      <button onClick={() => setRefereeModalOpen(true)} className="rounded-xl bg-[#8DFF63] px-4 py-2 text-[9px] font-black text-[#09243e]">+ Tambah Wasit</button>
                    </div>
                    {refereeRegistry.length === 0 ? (
                      <div className="p-10 text-center text-xs font-bold text-slate-400">Belum ada Master Wasit. Klik + Tambah Wasit untuk membuat ID pertama.</div>
                    ) : (
                      <div className="overflow-x-auto"><table className="w-full min-w-[620px]">
                        <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400"><tr><th className="px-5 py-3 text-left">ID Wasit</th><th className="px-4 py-3 text-left">Nama</th><th className="px-4 py-3 text-center">Status</th><th className="px-5 py-3 text-right">Ubah Status</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">{refereeRegistry.map(r => (
                          <tr key={r.id}>
                            <td className="px-5 py-3 text-xs font-black text-[#0a3971]">{r.id}</td>
                            <td className="px-4 py-3 text-xs font-black text-slate-800">{r.nama}</td>
                            <td className="px-4 py-3 text-center"><span className={`rounded-full px-2.5 py-1 text-[8px] font-black ${r.status === 'AKTIF' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{r.status}</span></td>
                            <td className="px-5 py-3 text-right"><button onClick={() => toggleRefereeStatus(r.id)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[8px] font-black text-slate-600">{r.status === 'AKTIF' ? 'Nonaktifkan' : 'Aktifkan'}</button></td>
                          </tr>
                        ))}</tbody>
                      </table></div>
                    )}
                  </div>

                  <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,.05)]">
                    <div className="border-b border-slate-100 p-5"><h4 className="text-xs font-black text-slate-900">Aktivitas Terakhir</h4><p className="mt-1 text-[9px] font-semibold text-slate-400">Fondasi monitoring Super Admin. Log ini tidak menyediakan tombol hapus untuk EO/Wasit.</p></div>
                    <div className="divide-y divide-slate-100">
                      {activityLogs.filter(l => !l.eventId || String(l.eventId) === String(selectedSettingsEvent.id)).slice(0, 8).map(log => (
                        <div key={log.id} className="flex items-center justify-between gap-4 px-5 py-3">
                          <div><div className="text-[10px] font-black text-slate-800">{log.description}</div><div className="mt-1 text-[8px] font-semibold uppercase text-slate-400">{log.type}</div></div>
                          <div className="whitespace-nowrap text-[8px] font-bold text-slate-400">{new Date(log.at).toLocaleString('id-ID')}</div>
                        </div>
                      ))}
                      {activityLogs.length === 0 && <div className="p-8 text-center text-[10px] font-bold text-slate-400">Belum ada aktivitas wasit.</div>}
                    </div>
                  </div>

                  {refereeModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                      <div className="w-full max-w-md overflow-hidden rounded-[24px] bg-white shadow-2xl">
                        <div className="bg-gradient-to-br from-[#071b3b] via-[#0a3971] to-[#0874c9] p-5 text-white">
                          <div className="text-sm font-black">Tambah Wasit</div>
                          <div className="mt-1 text-[9px] font-semibold text-blue-100/75">SpinMatch membuat ID wasit secara otomatis.</div>
                        </div>
                        <div className="space-y-4 p-5">
                          <div><label className="mb-1 block text-[9px] font-black text-slate-400">ID WASIT</label><div className="rounded-xl bg-blue-50 px-3 py-3 text-sm font-black text-[#0a3971]">{nextRefereeId}</div></div>
                          <div><label className="mb-1 block text-[9px] font-black text-slate-400">NAMA WASIT</label><input autoFocus value={newRefereeName} onChange={e=>setNewRefereeName(e.target.value)} placeholder="Masukkan nama lengkap" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-bold outline-none focus:border-blue-500" /></div>
                          <div><label className="mb-1 block text-[9px] font-black text-slate-400">STATUS</label><select value={newRefereeStatus} onChange={e=>setNewRefereeStatus(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold outline-none"><option value="AKTIF">Aktif</option><option value="NONAKTIF">Nonaktif</option></select></div>
                          <div className="rounded-xl bg-amber-50 p-3 text-[9px] font-semibold leading-relaxed text-amber-800">ID WST ini menjadi identitas permanen wasit. Password login akan dibuat pada tahap Authentication dan tidak disimpan sebagai teks di App.jsx/localStorage.</div>
                          <div className="flex justify-end gap-2 pt-2"><button onClick={()=>{setRefereeModalOpen(false);setNewRefereeName('');}} className="rounded-xl border border-slate-200 px-4 py-2.5 text-[9px] font-black text-slate-600">Batal</button><button onClick={createReferee} className="rounded-xl bg-[#8DFF63] px-4 py-2.5 text-[9px] font-black text-[#09243e]">Simpan Wasit</button></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,.05)]">
                  <div className="flex items-center gap-3 border-b border-slate-100 p-5">
                    <button onClick={() => setSettingsSection('HOME')} className="rounded-xl bg-slate-100 p-2 text-slate-700"><ArrowLeft className="h-4 w-4" /></button>
                    <div><h3 className="text-sm font-black text-slate-900">Pengaturan Keuangan</h3><p className="text-[10px] text-slate-400">{selectedSettingsEvent.nama} • draft laporan event</p></div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                      <div className="mb-3 text-xs font-black text-emerald-800">Pemasukan</div>
                      {[['registrationIncome','Pendaftaran Peserta'],['otherIncome','Pemasukan Lain']].map(([key,label]) => (
                        <div key={key} className="mb-3"><label className="mb-1 block text-[9px] font-black text-slate-500">{label}</label><input type="number" min="0" value={currentFinance[key] || ''} onChange={e=>updateFinance(key,e.target.value)} className="w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs font-bold outline-none" placeholder="0" /></div>
                      ))}
                    </div>
                    <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
                      <div className="mb-3 text-xs font-black text-rose-800">Pengeluaran</div>
                      {[['refereeFee','Fee Wasit'],['operationalCost','Biaya Operasional'],['otherExpense','Pengeluaran Lain']].map(([key,label]) => (
                        <div key={key} className="mb-3"><label className="mb-1 block text-[9px] font-black text-slate-500">{label}</label><input type="number" min="0" value={currentFinance[key] || ''} onChange={e=>updateFinance(key,e.target.value)} className="w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-xs font-bold outline-none" placeholder="0" /></div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 border-t border-slate-100 p-5">
                    <div className="rounded-2xl bg-emerald-50 p-4"><div className="text-[9px] font-black text-emerald-600">PEMASUKAN</div><div className="mt-1 text-sm font-black text-emerald-800">Rp {financeIncome.toLocaleString('id-ID')}</div></div>
                    <div className="rounded-2xl bg-rose-50 p-4"><div className="text-[9px] font-black text-rose-600">PENGELUARAN</div><div className="mt-1 text-sm font-black text-rose-800">Rp {financeExpense.toLocaleString('id-ID')}</div></div>
                    <div className="rounded-2xl bg-blue-50 p-4"><div className="text-[9px] font-black text-blue-600">SALDO EVENT</div><div className="mt-1 text-sm font-black text-[#0a3971]">Rp {financeBalance.toLocaleString('id-ID')}</div></div>
                  </div>
                  <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-[9px] font-semibold text-slate-400">Modul laporan keuangan disiapkan di sini. Cetak/export dan sinkron database dapat ditambahkan pada tahap berikutnya.</div>
                </div>
              )}
            </div>

          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-700">Pilih menu di sidebar</h3>
                <button onClick={() => setActiveView('DASHBOARD')} className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold">Kembali ke Dashboard</button>
              </div>
            </div>
          )}
        </div>
      </main>


      {/* MOBILE BOTTOM NAVIGATION DIHAPUS - menu utama HP sudah tersedia di Dashboard */}

      <style>{`
        /* =========================================================
           SPINMATCH RESPONSIVE GLOBAL
           Desktop >= 768px tetap mempertahankan layout lama.
           Aturan berikut hanya merapikan semua halaman pada HP.
        ========================================================= */
        @media (max-width: 767px) {
          html, body, #root { width: 100%; max-width: 100%; overflow-x: hidden; }
          .spinmatch-app { width: 100vw; max-width: 100vw; }

          .spinmatch-page-head > div[class*="bg-white"] {
            margin-top: 0 !important;
            padding: 8px !important;
            border-radius: 14px !important;
            gap: 8px !important;
          }
          .spinmatch-page-head h2 {
            font-size: 13px !important;
            line-height: 1.15 !important;
          }
          .spinmatch-page-head p {
            font-size: 9px !important;
            line-height: 1.2 !important;
          }
          .spinmatch-page-head select {
            max-width: 58vw !important;
            min-width: 0 !important;
            font-size: 9px !important;
          }
          .spinmatch-page-head button {
            min-height: 32px;
          }

          .spinmatch-main-content {
            width: 100%;
            max-width: 100%;
          }
          .spinmatch-main-content h1,
          .spinmatch-main-content h2,
          .spinmatch-main-content h3 {
            overflow-wrap: anywhere;
          }

          /* Semua tabel boleh digeser horizontal, bukan memaksa halaman melebar. */
          .spinmatch-main-content table {
            max-width: none;
          }
          .spinmatch-main-content div:has(> table) {
            max-width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          /* Form/modal umum agar nyaman di layar HP. */
          .spinmatch-app input,
          .spinmatch-app select,
          .spinmatch-app textarea,
          .spinmatch-app button {
            max-width: 100%;
          }
          .spinmatch-app input,
          .spinmatch-app select,
          .spinmatch-app textarea {
            font-size: 16px;
          }

          /* Card/panel yang memakai padding desktop dipadatkan di HP. */
          .spinmatch-main-content .rounded-3xl {
            border-radius: 16px;
          }

          /* Knockout tetap mempertahankan geometri; HP menggeser bagan horizontal. */
          .spinmatch-main-content [class*="overflow-x-auto"] {
            -webkit-overflow-scrolling: touch;
          }

          /* Modal umum tidak keluar viewport Android. */
          .spinmatch-app > div.fixed:not(.spinmatch-signature-popup) {
            max-width: 100vw;
          }
        }
      `}</style>

      {/* LIVE SCORE MODAL — di atas header sticky (z-[100]) */}
      {liveScoreMatch && (isPublic ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-md">
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Skor pertandingan, hanya baca"
            className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <header className="flex items-start justify-between gap-3 bg-gradient-to-r from-blue-800 to-blue-600 px-4 py-3 text-white">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
                  <Radio className="h-3.5 w-3.5" /> Skor Pertandingan • Baca Saja
                </div>
                <h3 className="mt-1 break-words text-sm font-black">
                  {liveMatchPlayers.player1?.nama || liveScoreMatch.player?.nama || 'Pemain 1'}
                  {' VS '}
                  {liveMatchPlayers.player2?.nama || resolveOpponentName(liveScoreMatch, liveScoreRows) || 'Pemain 2'}
                </h3>
                <p className="mt-1 text-[10px] font-semibold text-white/80">
                  {liveScoreMatch.pool} - {liveScoreMatch.matchRef}, {liveScoreMatch.jam}, {liveScoreMatch.meja}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLiveScoreMatch(null)}
                className="shrink-0 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
                aria-label="Tutup skor pertandingan"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="overflow-y-auto p-4">
              {publicLiveScoreGames.some(game => game?.p1 !== '' && game?.p2 !== '' && game?.p1 != null && game?.p2 != null) ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-[10px] font-black uppercase text-slate-500">
                    <span>Pemain</span><span className="text-center">Set Menang</span><span className="text-center">Skor Set</span>
                  </div>
                  {[liveMatchPlayers.player1, liveMatchPlayers.player2].map((player, playerIndex) => (
                    <div key={playerIndex} className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-xl border px-3 py-3 ${playerIndex === 0 ? 'border-emerald-100 bg-emerald-50/60' : 'border-sky-100 bg-sky-50/60'}`}>
                      <div className="min-w-0">
                        <div className="truncate text-xs font-black text-slate-900">{player?.nama || (playerIndex === 0 ? 'Pemain 1' : 'Pemain 2')}</div>
                        <div className="truncate text-[10px] text-slate-500">{player?.ptm || '-'}</div>
                      </div>
                      <div className="text-center text-lg font-black text-slate-700">
                        {playerIndex === 0 ? publicLiveSetWins.player1 : publicLiveSetWins.player2}
                      </div>
                      <div className="flex gap-1">
                        {publicLiveScoreGames.map((game, setIndex) => (
                          <span key={setIndex} className="min-w-8 rounded-md bg-white px-1.5 py-1 text-center text-xs font-black text-slate-700 shadow-sm">
                            {game?.[playerIndex === 0 ? 'p1' : 'p2'] ?? '-'}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {publicLiveScoreSnapshot?.updatedAt && (
                    <p className="text-center text-[10px] text-slate-400">
                      Skor diperbarui {new Date(publicLiveScoreSnapshot.updatedAt).toLocaleTimeString('id-ID')}
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
                  <div className="text-sm font-black text-slate-600">Menunggu skor pertandingan</div>
                  <p className="mt-1 text-xs text-slate-500">Skor langsung akan tampil di sini saat wasit mulai menginput skor.</p>
                </div>
              )}
              <p className="mt-3 text-center text-[10px] font-semibold text-slate-400">
                Tampilan publik hanya untuk melihat. Skor tidak dapat diubah dari halaman ini.
              </p>
            </div>
          </section>
        </div>
      ) : (
        <div className="spinmatch-live-overlay fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 p-0 backdrop-blur-md sm:p-3">
          <div className="spinmatch-live-compact flex h-[100dvh] w-full max-w-4xl flex-col overflow-hidden rounded-none border border-slate-200 bg-white shadow-2xl sm:h-[min(96vh,720px)] sm:rounded-[28px]">
            <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-2.5 py-1.5 text-white sm:px-5 sm:py-1.5">
              <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border-[16px] border-white/10" />
              <div className="pointer-events-none absolute -bottom-16 right-20 h-28 w-28 rounded-full border-[10px] border-white/10" />
              <div className="pointer-events-none absolute -right-20 top-10 h-7 w-80 rotate-[-25deg] bg-white/10" />
              <div className="relative z-10 flex items-start justify-between gap-1.5 sm:gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                  <div className="hidden h-8 w-11 shrink-0 items-center justify-center rounded-lg border border-white/30 bg-white/15 p-1.5 shadow-lg sm:flex">
                    <img src={logoSpinMatch} alt="Logo SpinMatch" className="h-full w-full rounded-lg object-contain" />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
                      <Radio className="h-3.5 w-3.5 animate-pulse text-[#39ff14] drop-shadow-[0_0_8px_rgba(57,255,20,0.95)]" /> Live Skor
                    </div>
                    <h3 className="break-words text-[13px] font-black leading-tight sm:text-lg">
                      {liveMatchPlayers.player1?.nama || liveScoreMatch.player?.nama || 'Pemain 1'}
                      {' VS '}
                      {liveMatchPlayers.player2?.nama || resolveOpponentName(liveScoreMatch, liveScoreRows) || 'Pemain 2'}
                    </h3>
                    <p className="break-words text-[10px] font-semibold text-white/85">
                      {liveScoreMatch.pool} - {liveScoreMatch.matchRef}
                      {', '}
                      {liveScoreMatch.jam}
                      {', '}
                      {liveScoreMatch.meja}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                  <div className="hidden rounded-2xl bg-black/30 backdrop-blur-sm border-2 border-white/40 px-2 py-1 min-[420px]:block">
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-white/70 uppercase">Match</div>
                      <div className="text-base font-black text-white whitespace-nowrap">{liveScoreMatch.matchLabel || '-'}</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => setLiveScoreMatch(null)} className="rounded-full bg-white/15 p-2 text-white/80 transition hover:bg-white/25 hover:text-white" aria-label="Tutup form Live Score">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-1 sm:px-3 sm:py-1.5">
              <div className="mb-1.5 grid grid-cols-4 gap-1 rounded-lg border border-slate-200 bg-slate-50 px-1.5 py-1.5 text-[8px] sm:mb-2 sm:gap-2 sm:px-4 sm:py-3 sm:text-[10px]">
                <div className="text-center"><div className="text-slate-400">Tanggal</div><div className="font-bold text-slate-700">{liveScoreMatch.tanggal || '-'}</div></div>
                <div className="text-center"><div className="text-slate-400">Waktu</div><div className="font-bold text-slate-700">{liveScoreMatch.jam || '-'}</div></div>
                <div className="text-center"><div className="text-slate-400">Pool</div><div className="font-bold text-slate-700">{liveScoreMatch.pool || '-'}</div></div>
                <div className="text-center"><div className="text-slate-400">Meja</div><div className="font-bold text-slate-700">{liveScoreMatch.meja || '-'}</div></div>
              </div>
              {voiceStatus && (
                <div className={`mb-1 mx-auto w-full rounded-md px-2 py-0.5 text-center text-[9px] font-medium transition sm:w-1/2 ${
                  voiceStatus.includes('✅') ? 'bg-emerald-100 text-emerald-700' :
                  voiceStatus.includes('❌') ? 'bg-red-100 text-red-700' :
                  voiceStatus.includes('Mendengarkan') ? 'bg-blue-100 text-blue-700 animate-pulse' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {voiceStatus}
                </div>
              )}
              <div className="mb-2 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-1 bg-slate-50 px-2 py-1">
                  <div className="flex min-w-0 flex-1 items-center gap-1 text-[8px] font-normal leading-tight text-slate-600 sm:text-[10px]">
                    <style>{`
                      input.spinmatch-score-input::-webkit-inner-spin-button,
                      input.spinmatch-score-input::-webkit-outer-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                      }
                    
  .spinmatch-signature-compact canvas { max-height: 92px !important; }
  @media (min-width: 768px) {
    .spinmatch-signature-compact { margin-top: 4px !important; }
  }

  /* SpinMatch Live Score compact desktop */
  .spinmatch-live-compact { overflow: hidden !important; }
  .spinmatch-live-compact .spinmatch-score-input {
    min-height: 30px !important;
    line-height: 1 !important;
  }
  @media (min-width: 768px) {
    .spinmatch-live-compact { max-height: 96vh !important; }
  }

  .spinmatch-live-compact > div:last-child::-webkit-scrollbar { width: 5px; }
  .spinmatch-live-compact > div:last-child::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 999px; }

  /* Android / HP: Live Score muat lebar layar tanpa merusak layout desktop */
  @media (max-width: 639px) {
    .spinmatch-live-overlay .spinmatch-live-compact {
      width: 100vw !important;
      height: 100dvh !important;
      max-height: 100dvh !important;
      border-radius: 0 !important;
    }
    .spinmatch-live-score-grid {
      grid-template-columns: minmax(74px, 1.45fr) repeat(5, minmax(38px, 1fr)) !important;
      gap: 3px !important;
      max-width: none !important;
    }
    .spinmatch-live-score-grid .spinmatch-player-cell {
      padding: 4px !important;
    }
    .spinmatch-live-score-grid .spinmatch-player-name {
      font-size: 9px !important;
      line-height: 1.05 !important;
      overflow-wrap: anywhere !important;
    }
    .spinmatch-live-score-grid .spinmatch-player-club {
      font-size: 7px !important;
      line-height: 1.05 !important;
      overflow-wrap: anywhere !important;
    }
    .spinmatch-live-score-grid .spinmatch-set-box {
      height: 48px !important;
    }
    .spinmatch-live-score-grid .spinmatch-score-input {
      font-size: 20px !important;
    }
    .spinmatch-live-final-score {
      padding-left: 6px !important;
      padding-right: 6px !important;
    }
    .spinmatch-live-final-score .spinmatch-final-name {
      font-size: 9px !important;
      line-height: 1.05 !important;
      overflow-wrap: anywhere !important;
    }
    .spinmatch-live-final-score .spinmatch-final-number {
      font-size: 27px !important;
      white-space: nowrap !important;
    }
    .spinmatch-live-footer {
      padding-left: 4px !important;
      padding-right: 4px !important;
    }
    .spinmatch-live-footer > div {
      gap: 4px !important;
    }
    .spinmatch-live-footer button {
      padding: 6px 8px !important;
      font-size: 8px !important;
    }
      .spinmatch-live-footer .spinmatch-live-mic-button {
        width: 40px !important;
        height: 40px !important;
        min-width: 40px !important;
        padding: 0 !important;
        border-radius: 9999px !important;
      }
    }

  @media print {
    @page { size: A4 portrait; margin: 8mm; }
    html,
    body,
    #root { width: 100% !important; height: auto !important; overflow: visible !important; }
    body .spinmatch-app {
      position: static !important;
      width: 100% !important;
      height: auto !important;
      min-height: 0 !important;
      overflow: visible !important;
    }
    body * { visibility: hidden !important; }
    .spinmatch-live-overlay {
      position: absolute !important;
      inset: 0 auto auto 0 !important;
      display: block !important;
      width: 100% !important;
      height: auto !important;
      padding: 0 !important;
      overflow: visible !important;
      background: #fff !important;
    }
    .spinmatch-live-compact,
    .spinmatch-live-compact * { visibility: visible !important; }
    .spinmatch-live-compact {
      position: relative !important;
      margin: 0 auto !important;
      width: 100% !important;
      max-width: none !important;
      height: auto !important;
      max-height: none !important;
      overflow: visible !important;
      border: 0 !important;
      border-radius: 0 !important;
      background: #fff !important;
      color: #000 !important;
      box-shadow: none !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .spinmatch-live-compact *,
    .spinmatch-live-compact *::before,
    .spinmatch-live-compact *::after {
      color: #000 !important;
      border-color: #000 !important;
      background-color: #fff !important;
      background-image: none !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    .spinmatch-live-overlay .spinmatch-live-compact > div:last-child {
      height: auto !important;
      min-height: 0 !important;
      overflow: visible !important;
    }
    .spinmatch-live-footer,
    .spinmatch-live-compact button,
    .spinmatch-live-compact input[type="button"] {
      display: none !important;
    }
    .spinmatch-live-compact canvas { border: 1px solid #000 !important; }
    .spinmatch-live-signatures { break-inside: avoid; }
  }
`}</style>
                    <Activity className="h-4 w-4 text-red-500" /> Input Skor Set (Kotak yang sama: Tap 1x +1 • Tap 2x -1 • Ketik Manual • Suara)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={handleLiveScoreSave} className="rounded-lg bg-blue-600 px-2.5 py-1 text-[9px] font-black text-white transition hover:bg-blue-700">
                      <CheckCircle2 className="mr-1 inline h-3 w-3" /> Simpan
                    </button>
                    <button type="button" onClick={clearLiveSetScores} className="rounded-lg bg-red-50 px-2 py-1 text-[9px] font-bold text-red-600 transition hover:bg-red-100">
                      <Trash2 className="mr-1 inline h-3 w-3" /> Reset
                    </button>
                  </div>
                </div>
                <div className="overflow-x-hidden p-1 sm:overflow-x-auto sm:p-2">
                  <div className="spinmatch-live-score-grid mx-auto grid w-full max-w-[760px] grid-cols-[145px_repeat(5,minmax(72px,1fr))] gap-1.5">
                    <div className="flex items-end pb-2 text-[10px] font-bold text-slate-500">PEMAIN</div>
                    {[1, 2, 3, 4, 5].map((setNum) => {
                      const setIndex = setNum - 1;
                      const isSetActive = activeVoiceSet === setIndex;
                      return (
                        <button
                          type="button"
                          key={setNum}
                          onClick={() => activateLiveSet(setIndex)}
                          className={`rounded-md px-1 py-0.5 text-center text-[8px] font-bold transition ${
                            isSetActive
                              ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-500 shadow-sm'
                              : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                          title={`Klik untuk mengaktifkan SET ${setNum}`}
                        >
                          SET {setNum}
                          {isSetActive && <span className="block text-[8px] font-black">AKTIF</span>}
                        </button>
                      );
                    })}
                    <div className="spinmatch-player-cell flex flex-col justify-center rounded-lg bg-emerald-50 p-2 border border-emerald-100">
                      <span className="spinmatch-player-name break-words text-xs font-black text-slate-800">{liveMatchPlayers.player1?.nama || '-'}</span>
                      <span className="spinmatch-player-club break-words text-[9px] text-slate-500">{liveMatchPlayers.player1?.ptm || '-'}</span>
                    </div>
                    {[0, 1, 2, 3, 4].map((setIndex) => {
                      const val = liveGameHistory[setIndex]?.p1;
                      const isActive = val !== undefined && val !== '';
                      return (
                        <div key={setIndex} className={`spinmatch-set-box overflow-hidden rounded-lg border-2 transition-all active:scale-95 ${activeVoiceSet === setIndex ? 'ring-2 ring-amber-400' : ''} ${isActive ? 'bg-emerald-500 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`} style={{ height: '60px' }}>
                          <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            value={isActive ? val : ''}
                            onFocus={() => activateLiveSet(setIndex)}
                            onClick={() => { activateLiveSet(setIndex); handleTapInteraction(setIndex, 'p1'); }}
                            onKeyDown={cancelPendingScoreTap}
                            onInput={cancelPendingScoreTap}
                            onChange={(e) => updateLiveSetScore(setIndex, 'p1', e.target.value)}
                            placeholder="-"
                            title="Tap 1x +1 • Tap 2x -1 • atau ketik angka langsung"
                            style={{ MozAppearance: "textfield", WebkitAppearance: "none", appearance: "textfield" }}
                            className={`spinmatch-score-input h-full w-full cursor-pointer bg-transparent text-center text-2xl font-black outline-none ${isActive ? 'text-white placeholder:text-white/70' : 'text-slate-700 placeholder:text-slate-400'}`}
                            aria-label={`Skor ${liveMatchPlayers.player1?.nama || 'Pemain 1'} Set ${setIndex + 1}. Bisa ditap atau diketik manual.`}
                          />
                        </div>
                      );
                    })}
                    <div className="spinmatch-player-cell flex flex-col justify-center rounded-lg bg-sky-50 p-2 border border-sky-100">
                      <span className="spinmatch-player-name break-words text-xs font-black text-slate-800">{liveMatchPlayers.player2?.nama || '-'}</span>
                      <span className="spinmatch-player-club break-words text-[9px] text-slate-500">{liveMatchPlayers.player2?.ptm || '-'}</span>
                    </div>
                    {[0, 1, 2, 3, 4].map((setIndex) => {
                      const val = liveGameHistory[setIndex]?.p2;
                      const isActive = val !== undefined && val !== '';
                      return (
                        <div key={setIndex} className={`spinmatch-set-box overflow-hidden rounded-lg border-2 transition-all active:scale-95 ${activeVoiceSet === setIndex ? 'ring-2 ring-amber-400' : ''} ${isActive ? 'bg-sky-500 border-sky-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`} style={{ height: '60px' }}>
                          <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            value={isActive ? val : ''}
                            onFocus={() => activateLiveSet(setIndex)}
                            onClick={() => { activateLiveSet(setIndex); handleTapInteraction(setIndex, 'p2'); }}
                            onKeyDown={cancelPendingScoreTap}
                            onInput={cancelPendingScoreTap}
                            onChange={(e) => updateLiveSetScore(setIndex, 'p2', e.target.value)}
                            placeholder="-"
                            title="Tap 1x +1 • Tap 2x -1 • atau ketik angka langsung"
                            style={{ MozAppearance: "textfield", WebkitAppearance: "none", appearance: "textfield" }}
                            className={`spinmatch-score-input h-full w-full cursor-pointer bg-transparent text-center text-2xl font-black outline-none ${isActive ? 'text-white placeholder:text-white/70' : 'text-slate-700 placeholder:text-slate-400'}`}
                            aria-label={`Skor ${liveMatchPlayers.player2?.nama || 'Pemain 2'} Set ${setIndex + 1}. Bisa ditap atau diketik manual.`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="spinmatch-live-final-score relative mb-2 overflow-hidden rounded-lg border-2 border-emerald-400 bg-emerald-50 px-4 py-1.5 text-center shadow-sm sm:mb-3">
                <Trophy className="absolute left-3 top-3 h-5 w-5 text-emerald-500/40" />
                <Trophy className="absolute right-3 top-3 h-5 w-5 text-emerald-500/40" />
                <div className="text-[10px] font-medium text-slate-500">Skor Akhir</div>
                <div className="my-1 grid grid-cols-3 items-center gap-2">
                  <div className="spinmatch-final-name break-words text-right text-sm font-black text-emerald-700">{liveMatchPlayers.player1?.nama || '-'}</div>
                  <div className="spinmatch-final-number text-4xl font-black tracking-wide text-emerald-600">{calculatedGameScore.player1} - {calculatedGameScore.player2}</div>
                  <div className="spinmatch-final-name break-words text-left text-sm font-black text-emerald-700">{liveMatchPlayers.player2?.nama || '-'}</div>
                </div>
                <div className="text-[10px] font-medium text-slate-500">{liveScoreMatch.pool} - {liveScoreMatch.matchRef}</div>
              </div>
              <div className="mb-2">
                <div className="mb-1 grid grid-cols-2 gap-1.5">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-center">
                  <div className="text-[8px] font-black uppercase text-emerald-600">Pemenang</div>
                  <div className="text-[10px] font-black text-emerald-800">{automaticWinnerPlayer?.nama || '-'}</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-center">
                  <div className="text-[8px] font-black uppercase text-slate-500">Pemain Kalah</div>
                  <div className="text-[10px] font-black text-slate-700">{automaticLoserPlayer?.nama || '-'}</div>
                </div>
              </div>
              </div>

              <section className="spinmatch-live-signatures mb-2 rounded-xl border border-slate-200 bg-slate-50 p-2 sm:p-3">
                <div className="mb-2 text-center">
                  <h4 className="text-[10px] font-black uppercase tracking-wide text-slate-800 sm:text-xs">Tanda Tangan</h4>
                  <p className="text-[8px] text-slate-500 sm:text-[10px]">Tanda tangan pemain dan wasit di kotak masing-masing</p>
                </div>
                <div className="mx-auto grid max-w-3xl grid-cols-3 gap-1.5 sm:gap-3">
                  <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-1 sm:p-2">
                    <div className="mb-1 min-h-7 text-center text-[8px] font-black leading-tight text-slate-700 sm:min-h-0 sm:text-[10px]">
                      Pemenang<br className="sm:hidden" />: {automaticWinnerPlayer?.nama || '-'}
                    </div>
                    <SignaturePad label="Tanda tangan" value={signatureWinner} onChange={setSignatureWinner} />
                  </div>
                  <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-1 sm:p-2">
                    <div className="mb-1 min-h-7 text-center text-[8px] font-black leading-tight text-slate-700 sm:min-h-0 sm:text-[10px]">
                      Pemain kalah<br className="sm:hidden" />: {automaticLoserPlayer?.nama || '-'}
                    </div>
                    <SignaturePad label="Tanda tangan" value={signatureLoser} onChange={setSignatureLoser} />
                  </div>
                  <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-1 sm:p-2">
                    <div className="mb-1 min-h-7 text-center text-[8px] font-black leading-tight text-slate-700 sm:min-h-0 sm:text-[10px]">Wasit</div>
                    <SignaturePad label="Tanda tangan" value={signatureReferee} onChange={setSignatureReferee} />
                  </div>
                </div>
              </section>

              <div className="spinmatch-live-footer sticky bottom-0 z-10 flex justify-center border-t border-slate-200 bg-white py-1.5">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button type="button" onClick={() => { if (typeof window !== 'undefined') { window.print(); } }} className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-[10px] font-black text-white shadow-sm transition hover:bg-emerald-600">
                    <Printer className="h-3.5 w-3.5" /> Print
                  </button>
                  <button type="button" onClick={handleDeleteMatch} className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-[10px] font-black text-white shadow-sm transition hover:bg-red-600">
                    <Trash2 className="h-3.5 w-3.5" /> Hapus Match
                  </button>
                  <button
                    type="button"
                    onClick={toggleVoiceRecognition}
                    className={`spinmatch-live-mic-button flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition focus:outline-none focus:ring-4 focus:ring-emerald-300 ${
                      isListening
                        ? 'border-emerald-300 bg-emerald-500 text-white shadow-[0_0_18px_rgba(16,185,129,.7)] animate-pulse'
                        : 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md hover:bg-emerald-100'
                    }`}
                    title={isListening ? 'Mikrofon aktif — tekan untuk berhenti' : 'Aktifkan input suara'}
                    aria-label={isListening ? 'Hentikan input suara' : 'Aktifkan input suara'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" x2="12" y1="19" y2="22"/>
                    </svg>
                  </button>
                  <button type="button" onClick={handleLiveScoreSubmit} className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-black text-white shadow-sm transition hover:bg-blue-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Simpan & Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {showPrintModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-slate-100">
            <button onClick={() => setShowPrintModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
                <Printer className="w-5 h-5 text-sky-600" /> Cetak Jadwal
              </h3>
              <p className="text-xs text-slate-400">Pilih pengaturan cetak</p>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Ukuran Kertas</label>
                <select value={printPaperSize} onChange={(e) => setPrintPaperSize(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-sky-500">
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Orientasi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setPrintOrientation('portrait')} className={`px-4 py-3 rounded-lg border-2 text-xs font-bold transition ${printOrientation === 'portrait' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Portrait</button>
                  <button type="button" onClick={() => setPrintOrientation('landscape')} className={`px-4 py-3 rounded-lg border-2 text-xs font-bold transition ${printOrientation === 'landscape' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Landscape</button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowPrintModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer">Batal</button>
              <button onClick={handlePrint} className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
            </div>
          </div>
        </div>
      )}

      {showRegModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative border border-slate-100">
            <button onClick={() => setShowRegModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <form onSubmit={handleAddParticipant} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-lime-600" /> Tambah Peserta Baru
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Event: <span className="font-bold text-slate-700">{selectedEventItem?.nama}</span></p>
              </div>
              <div className="space-y-3 text-xs font-semibold text-slate-700 pt-2">
                <div>
                  <label className="block mb-1">Nama Peserta</label>
                  <input type="text" required value={regNama} onChange={(e) => setRegNama(e.target.value)} placeholder="Nama Lengkap Pemain" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-normal" />
                </div>
                <div>
                  <label className="block mb-1">Klub / PTM</label>
                  <input type="text" required value={regPtm} onChange={(e) => setRegPtm(e.target.value)} placeholder="Contoh: PTM Merdeka" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-normal" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">No. HP / WA</label>
                    <input type="text" value={regNoTelp} onChange={(e) => setRegNoTelp(e.target.value)} placeholder="0811..." className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-mono font-normal" />
                  </div>
                  <div>
                    <label className="block mb-1">Usia</label>
                    <input type="number" value={regUsia} onChange={(e) => setRegUsia(e.target.value)} placeholder="Tahun" className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-normal" />
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Divisi / Kategori</label>
                  <select value={regDivisi} onChange={(e) => setRegDivisi(e.target.value)} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-white font-normal">
                    {selectedEventItem?.divisiList?.length > 0 ? (
                      selectedEventItem.divisiList.map((d, i) => (<option key={i} value={d.nama}>{d.nama}</option>))
                    ) : (<option value="Divisi 5">Divisi 5</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">Status Bayar</label>
                    <select value={regStatusBayar} onChange={(e) => setRegStatusBayar(e.target.value)} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-white font-semibold">
                      <option value="Bayar">Bayar</option>
                      <option value="Belum">Belum</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Nilai Bayar (Rp)</label>
                    <input type="number" value={regNilaiBayar} onChange={(e) => setRegNilaiBayar(e.target.value)} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-mono font-normal" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setShowRegModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-[#bef264] hover:bg-[#a3e635] text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm">Simpan Peserta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {contextMenu.visible && (
        <div style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }} className="fixed z-50 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 w-44 text-xs font-semibold" onClick={(e) => e.stopPropagation()}>
          <div className="px-3 py-1.5 text-[10px] text-slate-400 font-bold uppercase border-b border-slate-100 mb-1">{contextMenu.player?.nama}</div>
          <button onClick={() => { setEditingPlayer({ ...contextMenu.player }); setShowEditPlayerModal(true); setContextMenu(prev => ({ ...prev, visible: false })); }} className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer">
            <Edit3 className="w-3.5 h-3.5 text-amber-500" /> Edit Pemain
          </button>
          <button onClick={() => { handleDeletePlayer(contextMenu.player); setContextMenu(prev => ({ ...prev, visible: false })); }} className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer font-bold">
            <Trash2 className="w-3.5 h-3.5 text-red-500" /> Hapus Pemain
          </button>
        </div>
      )}

      {showEditPlayerModal && editingPlayer && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative border border-slate-100">
            <button onClick={() => setShowEditPlayerModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <form onSubmit={handleUpdatePlayerSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-1">Edit Data Pemain</h3>
              <p className="text-xs text-indigo-600 font-mono font-bold mb-2">ID: {editingPlayer.customId}</p>
              <div className="space-y-3 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block mb-1">Nama Pemain</label>
                  <input type="text" required value={editingPlayer.nama} onChange={(e) => setEditingPlayer({ ...editingPlayer, nama: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-normal" />
                </div>
                <div>
                  <label className="block mb-1">Klub / PTM</label>
                  <input type="text" required value={editingPlayer.ptm} onChange={(e) => setEditingPlayer({ ...editingPlayer, ptm: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-normal" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">No HP / WA</label>
                    <input type="text" value={editingPlayer.noTelp || ''} onChange={(e) => setEditingPlayer({ ...editingPlayer, noTelp: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-mono font-normal" />
                  </div>
                  <div>
                    <label className="block mb-1">Usia</label>
                    <input type="number" value={editingPlayer.usia || ''} onChange={(e) => setEditingPlayer({ ...editingPlayer, usia: e.target.value })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-normal" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">Status Bayar</label>
                    <select value={editingPlayer.statusBayar} onChange={(e) => setEditingPlayer({ ...editingPlayer, statusBayar: e.target.value, nilaiBayar: e.target.value === 'Bayar' ? (editingPlayer.nilaiBayar || 50000) : 0 })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-white font-semibold">
                      <option value="Bayar">Bayar</option>
                      <option value="Belum">Belum</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Nilai Bayar (Rp)</label>
                    <input type="number" value={editingPlayer.nilaiBayar || 0} onChange={(e) => setEditingPlayer({ ...editingPlayer, nilaiBayar: Number(e.target.value) })} className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-mono font-normal" />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button type="button" onClick={() => setShowEditPlayerModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer">Batal</button>
                <button type="submit" className="px-5 py-2 bg-[#bef264] hover:bg-[#a3e635] text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {eventPaymentPreview && showModal && !isEditMode && isEO && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/65 p-4">
          <div role="dialog" aria-modal="true" aria-label="Konfirmasi tarif event" className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-black text-slate-900">Biaya Pembuatan Event</h3><p className="text-xs text-slate-500 mt-1">{formNama}</p></div><button type="button" onClick={() => setEventPaymentPreview(null)} className="rounded-lg p-2 text-slate-600"><X className="h-5 w-5"/></button></div>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4"><p className="text-xs font-bold text-orange-700">{eventPaymentPreview.category} • per event</p><p className="mt-1 text-3xl font-black text-slate-900">Rp {eventPaymentPreview.price.toLocaleString('id-ID')}</p></div>
            {eventPaymentPreview.price > 0 ? <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700 space-y-1"><p className="font-black">Transfer ke rekening:</p><p>{eventPaymentPreview.bank || 'Bank belum diatur'}</p><p className="font-black select-all">{eventPaymentPreview.account || 'Nomor rekening belum diatur'}</p><p>a.n. {eventPaymentPreview.holder || 'Belum diatur'}</p></div> : <p className="rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-800">Tarif Rp0 — fasilitas gratis dari Super Admin.</p>}
            <p className="text-xs text-slate-600">{eventPaymentPreview.price === 0 ? 'Event gratis akan langsung aktif tanpa transfer atau verifikasi pembayaran.' : 'Event akan dibuat dengan status Menunggu Pembayaran. Transfer dan konfirmasi ke admin sebelum event diaktifkan. Jangan melakukan transfer dua kali.'}</p>
            {eventPaymentPreview.price > 0 && eventPaymentPreview.whatsapp && <a href={`https://wa.me/${String(eventPaymentPreview.whatsapp).replace(/\D/g,'')}?text=${encodeURIComponent(`Konfirmasi pembayaran SpinMatch untuk event ${formNama}, nominal Rp ${eventPaymentPreview.price.toLocaleString('id-ID')}.`)}`} target="_blank" rel="noopener noreferrer" className="block rounded-xl border border-emerald-300 p-3 text-center text-sm font-black text-emerald-700">Konfirmasi melalui WhatsApp</a>}
            <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setEventPaymentPreview(null)} className="rounded-xl bg-slate-100 px-3 py-3 text-sm font-bold">Kembali</button><button type="button" disabled={eventPaymentBusy} onClick={() => document.getElementById('spinmatch-event-create-form')?.requestSubmit()} className="rounded-xl bg-orange-500 px-3 py-3 text-sm font-black text-white disabled:opacity-50">{eventPaymentBusy ? 'Menyimpan...' : eventPaymentPreview.price === 0 ? 'Buat Event Gratis' : 'Buat Event'}</button></div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative border border-slate-100 my-8">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Pencil className="w-4 h-4 text-amber-500" /> {isEditMode ? 'Edit Event Pertandingan' : 'Buat Event Pertandingan Baru'}
              </h3>
              <button onClick={() => { setShowModal(false); setIsEditMode(false); setSelectedDivisiForConfig(null); }} className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <form id="spinmatch-event-create-form" onSubmit={handleFormSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Event</label>
                <input type="text" required value={formNama} onChange={(e) => setFormNama(e.target.value)} placeholder="Contoh: Turnamen Pingpong Divisi 5 2026" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 text-sm" />
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-900">Durasi Pelaksanaan</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="dt" checked={!isMultiDate} onChange={() => { setIsMultiDate(false); }} className="accent-slate-900 w-3.5 h-3.5" />
                    <span className="text-xs font-semibold text-slate-700">1 Tanggal</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" name="dt" checked={isMultiDate} onChange={() => { setIsMultiDate(true); }} className="accent-slate-900 w-3.5 h-3.5" />
                    <span className="text-xs font-semibold text-slate-700">Rentang</span>
                  </label>
                </div>
                {!isMultiDate ? (
                  <div className="relative">
                    <input type="date" required value={formSingleDate} onChange={(e) => setFormSingleDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-800 text-sm" />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input type="date" required value={formStartDate} onChange={(e) => setFormStartDate(e.target.value)} placeholder="Mulai" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm" />
                      <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <input type="date" required value={formEndDate} onChange={(e) => setFormEndDate(e.target.value)} placeholder="Selesai" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm" />
                      <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Durasi/Match</label>
                  <select value={durasiMatch} onChange={(e) => setDurasiMatch(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-slate-800">
                    <option value="15 Menit">15 Menit</option>
                    <option value="20 Menit">20 Menit</option>
                    <option value="25 Menit">25 Menit</option>
                  </select>
                </div>
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Mulai</label>
                  <input type="time" value={jamMulai} onChange={(e) => setJamMulai(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-slate-800" />
                </div>
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jam Selesai</label>
                  <input type="time" value={jamSelesai} onChange={(e) => setJamSelesai(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jumlah Meja</label>
                  <select
                    value={jumlahMeja}
                    onChange={(e) => setJumlahMeja(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:border-slate-800"
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n} Meja</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tambah Divisi</label>
                <div className="flex gap-2">
                  <input type="text" value={inputDivisi} onChange={(e) => setInputDivisi(e.target.value)} placeholder="Contoh: Divisi 5" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 text-sm" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDivisi())} />
                  <button type="button" onClick={handleAddDivisi} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg text-xs transition cursor-pointer whitespace-nowrap">+ Tambah</button>
                </div>
              </div>
              {divisiList.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Divisi Terdaftar <span className="text-[10px] font-normal text-slate-500">(Klik untuk atur aturan)</span>:</label>
                  <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 min-h-[45px]">
                    {divisiList.map((d, i) => (
                      <div key={i} onClick={() => { setActiveDivisiTab(d.nama); setSelectedDivisiForConfig(d.nama); }} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold cursor-pointer transition border text-xs ${selectedDivisiForConfig === d.nama ? 'bg-[#bef264] text-slate-900 border-[#a3e635]' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}>
                        <span>{d.nama}</span>
                        <X className="w-3 h-3 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleRemoveDivisi(d.nama); }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedDivisiForConfig && configDivisiData && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200">
                    <Settings className="w-3.5 h-3.5 text-slate-700" />
                    <h4 className="text-xs font-black text-slate-900">Aturan: <span className="text-emerald-600">{configDivisiData.nama}</span></h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Sistem Match</label>
                      <select value={configDivisiData.sistemMatch} onChange={(e) => handleDivisiConfigChange(selectedDivisiForConfig, 'sistemMatch', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-800">
                        <option value="Best of 5">Best of 5</option>
                        <option value="Best of 7">Best of 7</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-1">Jumlah Pool</label>
                      <select value={configDivisiData.jumlahPool} onChange={(e) => handleDivisiConfigChange(selectedDivisiForConfig, 'jumlahPool', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-800">
                        <option value="1 Pool isi 3 Orang">3 Orang</option>
                        <option value="1 Pool isi 4 Orang">4 Orang</option>
                        <option value="1 Pool isi 5 Orang">5 Orang</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Lolos dari Pool</label>
                    <select value={configDivisiData.lolosPool} onChange={(e) => handleDivisiConfigChange(selectedDivisiForConfig, 'lolosPool', e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-slate-800">
                      <option value="1 Pemain">Juara (1 Pemain)</option>
                      <option value="2 Pemain">Juara & Runner-up (2 Pemain)</option>
                    </select>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => { setShowModal(false); setIsEditMode(false); setSelectedDivisiForConfig(null); }} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition cursor-pointer">Batal</button>
                <button type="submit" className="px-4 py-2 bg-[#bef264] hover:bg-[#a3e635] text-slate-950 font-black rounded-lg text-xs shadow-sm cursor-pointer flex items-center gap-1.5">
                  💾 {isEditMode ? 'Simpan' : 'Simpan Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSeedModal && selectedDrawEvent && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative border border-slate-100 my-8">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-700" /> Pengaturan Pemain Seeded
              </h3>
              <button onClick={() => setShowSeedModal(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-4 h-4 bg-amber-500 rounded flex items-center justify-center"><span className="text-white text-[10px] font-black">i</span></div>
                  <span className="text-xs font-black text-amber-800">Informasi:</span>
                </div>
                <ul className="text-[11px] text-amber-900 space-y-0.5 ml-5.5">
                  <li>• Total Pemain di Divisi Ini: <span className="font-black text-amber-700">{drawEventParticipants.length}</span></li>
                  <li>• Jumlah Pool: <span className="font-black">{drawProjection.numPools}</span> × lolos <span className="font-black">{drawProjection.lolosCount}</span> pemain</li>
                  <li>• Proyeksi Knockout: <span className="font-black">{drawProjection.knockoutPlayers}</span> pemain → bracket <span className="font-black">{drawProjection.bracketSize || '-'}</span></li>
                  <li>• Jumlah Seeded: <span className="font-black text-amber-700">{drawProjection.numPools}</span> pemain (sama dengan jumlah Pool)</li>
                  <li>• Kebutuhan BYE: <span className="font-black text-amber-700">{drawProjection.byeCount}</span> — prioritas Seed 1 s/d {drawProjection.byeCount}</li>
                  <li>• Seed ganjil dari atas, Seed genap dari bawah.</li>
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {drawSeedKeys.map((seedKey, idx) => {
                  const poolIdx = drawSeedPoolIndexes[idx];
                  const poolLabel = Number.isInteger(poolIdx) ? `Pool ${String.fromCharCode(65 + poolIdx)}` : '-';
                  const selectedElsewhere = new Set(
                    Object.entries(tempSeedData)
                      .filter(([key, value]) => key !== seedKey && value)
                      .map(([, value]) => String(value))
                  );
                  return (
                    <div key={seedKey} className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <span>
                          Seed {idx + 1} <span className="text-slate-400 font-normal">({poolLabel})</span>
                          {(idx + 1) <= drawProjection.byeCount && <span className="ml-1 text-amber-600">• Prioritas BYE</span>}
                        </span>
                      </label>
                      <div className="relative">
                        <select
                          value={tempSeedData[seedKey] || ''}
                          onChange={(e) => setTempSeedData({ ...tempSeedData, [seedKey]: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800 transition appearance-none cursor-pointer pr-7"
                        >
                          <option value="">-- Tidak Ada --</option>
                          {drawEventParticipants.map(p => (
                            <option key={p.id} value={p.id} disabled={selectedElsewhere.has(String(p.id))}>{p.nama}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowSeedModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition cursor-pointer">Batal</button>
                <button type="button" onClick={handleSaveSeed} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-lg text-xs shadow-sm cursor-pointer flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" /> Simpan & Terapkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDrawAnimation && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lime-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl w-full">
            {drawPhase === 'spinning' ? (
              <>
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                    <Dices className="w-5 h-5 text-lime-400 animate-spin" />
                    <span className="text-sm font-bold text-white">Mesin Undian Sedang Berputar...</span>
                  </div>
                  <h2 className="text-4xl font-black text-white mb-2">🎰 Mengacak Pemain</h2>
                  <p className="text-sm text-slate-300">Mohon tunggu, sistem sedang melakukan undian adil...</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border-2 border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {spinningNames.map((name, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-4 min-h-[80px] flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-[10px] font-bold text-lime-400 uppercase tracking-wider mb-1">Slot {idx + 1}</div>
                          <div className="text-sm font-black text-white truncate animate-pulse">{name || '...'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full transition-all duration-100" style={{ width: `${((spinningNames.filter(n => n).length / 4) * 100)}%`, animation: 'pulse 0.5s ease-in-out infinite' }}></div>
                  </div>
                </div>
              </>
            ) : drawPhase === 'done' ? (
              <>
                <div className="mb-8 animate-in fade-in zoom-in">
                  <div className="inline-flex items-center gap-2 bg-lime-500/20 border border-lime-400/50 rounded-full px-4 py-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-lime-400" />
                    <span className="text-sm font-bold text-lime-300">Undian Selesai!</span>
                  </div>
                  <h2 className="text-5xl font-black text-white mb-2">🎉 Hasil Undian Siap!</h2>
                  <p className="text-sm text-slate-300">{drawEventParticipants.length} pemain telah berhasil diacak ke dalam {Object.keys(currentPoolData?.pools || {}).length} pool</p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={handleCloseAnimation} className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-xl text-sm transition cursor-pointer shadow-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Lihat Hasil Pembagian Pool
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {ratioDetail && (()=>{
        const list=buildPoolRankings(ratioDetail.eventId)?.[ratioDetail.pool]||[];
        const fmt=v=>v===null?'Data belum lengkap':v===Infinity?'∞':Number(v).toFixed(3).replace('.',',');
        return <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/65 p-4" onClick={()=>setRatioDetail(null)}>
          <div className="max-h-[85vh] w-full max-w-[850px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between"><h3 className="text-lg font-black">Detail Rasio ITTF — {ratioDetail.pool}</h3><button className="rounded-lg bg-slate-100 p-2" onClick={()=>setRatioDetail(null)}>Tutup ✕</button></div>
            <p className="mb-3 text-xs text-slate-600">MP: menang 2, kalah 1. Jika MP seri, hitung ulang hanya pertandingan antarpemain seri, kemudian rasio set dan rasio poin bola.</p>
            <div className="overflow-x-auto"><table className="w-full min-w-[690px] border-collapse text-xs"><thead><tr className="bg-slate-100">{['Pos','Pemain','M–K','MP','Set M–K','Rasio Set','Poin Bola M–K','Rasio Poin'].map(h=><th key={h} className="border p-2">{h}</th>)}</tr></thead><tbody>{list.map(p=><tr key={p.id}><td className="border p-2 text-center">{p.ranking}</td><td className="border p-2 font-bold">{p.nama}{p.keterangan?' ✓':''}</td><td className="border p-2 text-center">{p.wins}–{p.losses}</td><td className="border p-2 text-center">{p.matchPoints}</td><td className="border p-2 text-center">{p.gamesWon}–{p.gamesLost}</td><td className="border p-2 text-center">{fmt(p.ratioSet)}</td><td className="border p-2 text-center">{p.completePoints?`${p.pointsWon}–${p.pointsLost}`:'Belum lengkap'}</td><td className="border p-2 text-center">{fmt(p.ratioPoin)}</td></tr>)}</tbody></table></div>
            <p className="mt-3 text-xs text-slate-600">Rasio set = set menang ÷ set kalah. Rasio poin = total poin bola menang ÷ total poin bola kalah. Data poin bola diambil dari skor tiap set yang tersimpan, tidak dikarang dari skor 3–1.</p>
            {list.some(p=>!p.completePoints)&&<p className="mt-2 rounded-lg bg-amber-50 p-3 text-xs font-bold text-amber-800">Ada pertandingan tanpa skor poin bola lengkap. Penentuan juara yang memerlukan rasio poin harus diverifikasi sebelum Knockout.</p>}
          </div>
        </div>;
      })()}
      {showMatchResultModal && selectedMatch && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative border border-slate-100">
            <button onClick={() => setShowMatchResultModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <form onSubmit={handleSaveResult} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-emerald-600" /> Input Hasil Pertandingan
                </h3>
                <p className="text-xs text-slate-400 mt-1">{selectedMatch.pool} - {selectedMatch.matchRef} - {selectedMatch.jam} - {selectedMatch.meja}</p>
                <p className="text-xs font-bold text-emerald-700 mt-1">Match: {selectedMatch.matchLabel}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="bg-white p-3 rounded-xl border-2 border-emerald-200">
                  <div className="text-xs font-bold text-emerald-700 mb-1">Pemain 1 ({selectedMatch.playerCode})</div>
                  <div className="text-sm font-black text-slate-900 mb-3">{selectedMatch.player.nama}</div>
                  <div className="text-[10px] text-slate-500 mb-2">{selectedMatch.player.ptm}</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Score (Game)</label>
                      <input type="number" name="player1Score" defaultValue={selectedMatch.result?.player1Score || ''} placeholder="0" min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-center font-bold text-lg focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Point Total</label>
                      <input type="number" name="point1" defaultValue={selectedMatch.result?.point1 || ''} placeholder="0" min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-center font-bold focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-xs font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full">VS</span>
                </div>
                <div className="bg-white p-3 rounded-xl border-2 border-slate-200">
                  <div className="text-xs font-bold text-slate-700 mb-1">
                    Pemain 2 (Lawan)
                    {selectedMatch.matchType.includes('loser') && ' - PK M1'}
                    {selectedMatch.matchType.includes('winner') && ' - PM M1'}
                  </div>
                  <div className="text-sm font-black text-slate-900 mb-3">{resolveOpponentName(selectedMatch, scheduleRows)}</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Score (Game)</label>
                      <input type="number" name="player2Score" defaultValue={selectedMatch.result?.player2Score || ''} placeholder="0" min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-center font-bold text-lg focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Point Total</label>
                      <input type="number" name="point2" defaultValue={selectedMatch.result?.point2 || ''} placeholder="0" min="0" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-center font-bold focus:outline-none focus:border-emerald-500" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Pemenang</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(() => {
                      const { player1, player2 } = getLiveMatchPlayers(selectedMatch, selectedScheduleEvent?.id);
                      return (
                        <>
                          <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition ${selectedMatch.result?.winner === 'player1' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                            <input type="radio" name="winner" value="player1" defaultChecked={selectedMatch.result?.winner === 'player1'} className="accent-emerald-600" />
                            <span className="text-xs font-bold text-slate-900">{player1?.nama || selectedMatch.player?.nama || 'Pemain 1'}</span>
                          </label>
                          <label className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition ${selectedMatch.result?.winner === 'player2' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                            <input type="radio" name="winner" value="player2" defaultChecked={selectedMatch.result?.winner === 'player2'} className="accent-emerald-600" />
                            <span className="text-xs font-bold text-slate-900 truncate">{player2?.nama || resolveOpponentName(selectedMatch, scheduleRows) || 'Pemain 2'}</span>
                          </label>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setShowMatchResultModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer">Batal</button>
                <button type="submit" className="px-5 py-2.5 bg-[#bef264] hover:bg-[#a3e635] text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm">Simpan Hasil</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .sm-mobile-page-header { margin-top: 10px !important; padding: 14px !important; border-radius: 24px !important; gap: 10px !important; }
          .sm-mobile-page-header > div { position: relative; z-index: 2; }
          .sm-mobile-page-header button[title=\"Kembali ke Dashboard\"] { padding: 8px !important; border-radius: 13px !important; }
          .sm-mobile-page-header h2 { font-size: 15px !important; line-height: 1.15 !important; }
          .sm-mobile-page-header p { font-size: 10px !important; line-height: 1.2 !important; }
          .sm-mobile-page-header > div:last-child { width: 100% !important; display: grid !important; grid-template-columns: 1fr auto !important; gap: 8px !important; justify-content: stretch !important; }
          .sm-mobile-page-header > div:last-child > div { min-width: 0 !important; padding: 8px 10px !important; border-radius: 14px !important; }
          .sm-mobile-page-header select { min-width: 0 !important; max-width: 100% !important; width: 100% !important; text-overflow: ellipsis !important; font-size: 10px !important; }
          .sm-mobile-page-header span { font-size: 10px !important; }
          .sm-mobile-page-header > div:last-child > button { padding: 9px 12px !important; border-radius: 13px !important; font-size: 11px !important; white-space: nowrap !important; }
          /* Jadwal EO: tiga aksi tetap sejajar setelah baris pemilihan event. */
          .sm-mobile-page-header.sm-schedule-header > div:last-child { grid-template-columns: repeat(4, minmax(0, 1fr)) !important; gap: 5px !important; }
          .sm-mobile-page-header.sm-schedule-header > div:last-child > div:first-child { grid-column: 1 / -1 !important; }
          .sm-mobile-page-header.sm-schedule-header > div:last-child > button { width: 100% !important; min-width: 0 !important; min-height: 34px !important; padding: 5px 2px !important; gap: 3px !important; border-radius: 9px !important; font-size: 9px !important; }
          .sm-mobile-page-header.sm-schedule-header > div:last-child > button svg { width: 12px !important; height: 12px !important; }

          .sm-registration, .sm-draw, .sm-schedule, .sm-live, .sm-knockout { margin-top: 12px !important; gap: 12px !important; }
          .sm-registration > div, .sm-draw > div, .sm-schedule > div, .sm-live > div, .sm-knockout > div { border-radius: 22px !important; }
          .sm-registration > div { padding: 14px !important; }
          .sm-registration h3 { font-size: 15px !important; line-height: 1.25 !important; }
          .sm-registration h3 + p { font-size: 9px !important; margin-top: 3px !important; }
          .sm-registration > div > div:first-child { margin-bottom: 10px !important; gap: 8px !important; }
          .sm-registration > div > div:first-child > div:last-child { display:grid !important; grid-template-columns:1fr 1fr !important; width:100% !important; gap:7px !important; }
          .sm-registration > div > div:first-child > div:last-child > * { min-height:38px !important; padding:7px 9px !important; justify-content:center !important; border-radius:12px !important; font-size:10px !important; }
          .sm-registration > div > div:first-child > div:last-child > *:first-child { grid-column:1 / -1 !important; }
          .sm-participant-table { overflow:visible !important; border:0 !important; border-radius:0 !important; }
          .sm-participant-table table, .sm-participant-table tbody { display:block !important; width:100% !important; }
          .sm-participant-table thead { display:none !important; }
          .sm-participant-table tbody { display:grid !important; gap:8px !important; }
          .sm-participant-table tr { display:grid !important; grid-template-columns:54px 1fr auto !important; gap:4px 9px !important; padding:11px 12px !important; border:1px solid #e2e8f0 !important; border-radius:15px !important; background:#fff !important; box-shadow:0 4px 14px rgba(15,23,42,.04) !important; }
          .sm-participant-table td { display:block !important; padding:0 !important; border:0 !important; text-align:left !important; font-size:10px !important; }
          .sm-participant-table td:nth-child(1) { display:none !important; }
          .sm-participant-table td:nth-child(2) { grid-column:1; grid-row:1 / span 2; align-self:center; font-size:9px !important; line-height:1.2; word-break:break-word; }
          .sm-participant-table td:nth-child(3) { grid-column:2; grid-row:1; font-size:13px !important; }
          .sm-participant-table td:nth-child(4) { grid-column:2; grid-row:2; color:#64748b !important; }
          .sm-participant-table td:nth-child(5) { grid-column:3; grid-row:2; color:#64748b !important; }
          .sm-participant-table td:nth-child(6) { grid-column:3; grid-row:1; font-weight:800 !important; }
          .sm-participant-table td:nth-child(7), .sm-participant-table td:nth-child(8) { display:none !important; }

          .sm-draw > div { padding:14px !important; }
          .sm-draw h2 { font-size:18px !important; }
          .sm-draw h3 { font-size:15px !important; }
          .sm-draw .grid { gap:9px !important; }
          .sm-draw .rounded-2xl { border-radius:14px !important; }
          .sm-draw .p-4 { padding:11px !important; }
          .sm-draw .p-6 { padding:14px !important; }
          .sm-draw button { min-height:38px; }

          .sm-schedule > div { padding:14px !important; }
          .sm-schedule h2 { font-size:18px !important; }
          .sm-schedule input { min-height:42px !important; font-size:13px !important; }
          .sm-schedule .p-12 { padding:34px 16px !important; }

          .sm-live > div { padding:14px !important; }
          .sm-live h2 { font-size:18px !important; }
          .sm-live .text-2xl { font-size:20px !important; }
          .sm-live .p-12 { padding:34px 16px !important; }

          .sm-knockout > div { padding:14px !important; }
          .sm-knockout .p-12 { padding:34px 16px !important; }
          .sm-knockout .overflow-x-auto { -webkit-overflow-scrolling:touch; scrollbar-width:thin; }


          /* DASHBOARD MOBILE FINAL COMPACT V2 */
          .sm-dashboard-layout { display:flex !important; flex-direction:column !important; gap:10px !important; }
          .sm-dashboard-event-buttons { display:grid !important; grid-template-columns:1fr 1fr !important; gap:8px !important; order:0 !important; width:100% !important; }
          .sm-dashboard-event-buttons button { min-height:32px !important; border-radius:13px !important; display:flex !important; align-items:center !important; justify-content:center !important; gap:6px !important; font-size:11px !important; font-weight:900 !important; color:#fff !important; border:0 !important; box-shadow:0 5px 16px rgba(15,23,42,.06) !important; }
          .sm-btn-my-events { background:linear-gradient(135deg,#0a3971,#0874c9) !important; }
          .sm-btn-all-events { background:linear-gradient(135deg,#f97316,#fb923c) !important; }
          .sm-event-browser { width:100% !important; }
          .sm-dashboard-hero { order:2 !important; width:100% !important; margin:0 auto !important; border-radius:22px !important; }
          .sm-dashboard-hero-inner { min-height:0 !important; display:block !important; padding:6px 12px 7px !important; }
          .sm-dashboard-hero-copy { align-items:center !important; text-align:center !important; }
          .sm-dashboard-hero-copy > div:first-child { align-self:flex-start !important; margin-bottom:0 !important; }
          .sm-dashboard-hero-copy > div:first-child span { padding:4px 8px !important; font-size:8px !important; }
          .sm-dashboard-mobile-paddle { display:flex !important; position:relative !important; height:38px !important; width:100% !important; align-items:center !important; justify-content:center !important; margin:0 !important; }
          .sm-dashboard-mobile-paddle img { position:relative !important; z-index:2 !important; width:76px !important; height:44px !important; object-fit:contain !important; }
          .sm-dashboard-mobile-glow { position:absolute !important; z-index:1 !important; width:112px !important; height:36px !important; border-radius:999px !important; background:rgba(255,255,255,.45) !important; filter:blur(18px) !important; }
          .sm-dashboard-hero h1 { width:100% !important; max-width:none !important; text-align:center !important; font-size:15px !important; line-height:1.08 !important; margin-top:0 !important; }
          .sm-dashboard-hero-desc { display:none !important; }
          .sm-dashboard-hero-meta { margin-top:5px !important; justify-content:center !important; gap:4px !important; }
          .sm-dashboard-hero-meta > div { padding:4px 7px !important; border-radius:9px !important; font-size:8px !important; }
          .sm-dashboard-hero-meta > div:nth-child(2), .sm-dashboard-hero-meta > div:nth-child(3) { display:none !important; }
          .sm-dashboard-hero-actions { margin-top:6px !important; justify-content:center !important; gap:5px !important; }
          .sm-dashboard-hero-actions button { padding:6px 10px !important; border-radius:9px !important; font-size:9px !important; }
          .sm-dashboard-hero > div:last-child { padding-bottom:5px !important; }
          .sm-dashboard-stats { order:2 !important; grid-template-columns:repeat(4,minmax(0,1fr)) !important; gap:5px !important; }
          .sm-dashboard-stats-public { grid-template-columns:repeat(3,minmax(0,1fr)) !important; }
          .sm-dashboard-stats > div { min-width:0 !important; height:42px !important; padding:4px 3px !important; border-radius:13px !important; display:flex !important; flex-direction:column !important; justify-content:center !important; text-align:center !important; }
          .sm-dashboard-stats > div > div:first-child { display:none !important; }
          .sm-dashboard-stats > div > div:nth-child(2) { margin-top:0 !important; font-size:12px !important; line-height:1 !important; overflow:hidden !important; text-overflow:ellipsis !important; }
          .sm-dashboard-stats > div > div:nth-child(3) { margin-top:3px !important; font-size:7.5px !important; line-height:1 !important; }
          .sm-dashboard-lower { order:3 !important; gap:8px !important; }
          .sm-dashboard-lower > div:first-child { border-radius:18px !important; }
          .sm-dashboard-lower > div:first-child > div:first-child { padding:10px 11px !important; }
          .sm-dashboard-lower > div:first-child > div:first-child h2 { font-size:13px !important; }
          .sm-dashboard-lower > div:first-child > div:first-child p { font-size:8px !important; }
          .sm-dashboard-lower > div:first-child > div:nth-child(2) > div { padding:9px 11px !important; }
          .sm-dashboard-lower > div:last-child { display:none !important; }
          .sm-dashboard-quick { order:99 !important; padding:11px !important; border-radius:19px !important; margin-bottom:0 !important; }
          .sm-dashboard-quick .mb-4 { margin-bottom:8px !important; }
          .sm-dashboard-quick p { display:none !important; }
          .sm-dashboard-quick .mx-auto.grid { gap:6px !important; }
          .sm-dashboard-quick .mx-auto.grid button { min-height:42px !important; padding:8px 9px !important; border-radius:12px !important; }
          .sm-dashboard-quick .sm-public-quick-grid button { min-height:60px !important; }
          .spinmatch-main-content { padding-bottom:8px !important; }
          /* SPINMATCH MOBILE DASHBOARD V3: kontras abu-abu & ruang lebih efisien */
          .spinmatch-app { background:#cbd2dc !important; }
          .spinmatch-page-head { background:#cbd2dc !important; padding:4px 12px 3px !important; min-height:0 !important; }
          /* Tombol titik tiga saja yang berukuran 32x32; tombol menu harus lebar penuh. */
          .spinmatch-page-head .sm-mobile-more-trigger { height:32px !important; width:32px !important; flex-shrink:0 !important; }
          .spinmatch-page-head .sm-mobile-more-panel { background-color:#fff !important; opacity:1 !important; isolation:isolate; z-index:110 !important; }
          .spinmatch-page-head .sm-mobile-more-panel button { display:flex !important; width:100% !important; height:auto !important; min-height:44px !important; align-items:center !important; justify-content:flex-start !important; white-space:normal !important; line-height:1.3 !important; text-align:left !important; }
          .spinmatch-page-head .sm-mobile-more-panel button svg { flex-shrink:0 !important; }
          .spinmatch-main-content { background:#cbd2dc !important; padding:7px 12px 18px !important; }
          .sm-dashboard-layout { gap:9px !important; }
          .sm-dashboard-event-buttons button { min-height:40px !important; font-size:12px !important; }
          .sm-dashboard-hero { order:2 !important; border-radius:21px !important; }
          .sm-dashboard-hero-inner { padding:9px 12px 10px !important; }
          .sm-dashboard-mobile-paddle { height:43px !important; }
          .sm-dashboard-mobile-paddle img { height:47px !important; }
          .sm-dashboard-hero h1 { font-size:16px !important; }
          .sm-dashboard-hero-actions button { min-height:34px !important; font-size:10px !important; }
          .sm-dashboard-stats { order:3 !important; gap:6px !important; }
          .sm-dashboard-stats > div { height:49px !important; background:#fff !important; border-radius:15px !important; }
          .sm-dashboard-stats > div > div:nth-child(2) { font-size:14px !important; }
          .sm-dashboard-stats > div > div:nth-child(3) { font-size:8px !important; }
          .sm-dashboard-lower { order:4 !important; }
          .sm-dashboard-lower > div:first-child { background:#fff !important; border-radius:20px !important; }
          .sm-dashboard-lower > div:first-child > div:first-child { padding:12px !important; }
          .sm-dashboard-lower > div:first-child > div:first-child h2 { font-size:14px !important; }
          .sm-dashboard-lower > div:first-child > div:first-child p { font-size:9px !important; }
          .sm-dashboard-lower #dashboard-event-saya > div:nth-child(2):has(> div.flex-col) > div { min-height:0 !important; }
          .sm-dashboard-quick { order:5 !important; padding:12px !important; border-radius:20px !important; background:#fff !important; }
          .sm-dashboard-quick .mx-auto.grid button { min-height:46px !important; font-size:11px !important; }
          .sm-dashboard-quick .mx-auto.grid button:first-child { min-height:43px !important; }
          .sm-dashboard-lower #dashboard-event-saya .group { flex-wrap:wrap !important; }
          .sm-dashboard-lower #dashboard-event-saya .group > div:last-child { margin-left:auto !important; }
          /* Mobile refinement: ringkas area atas, perlihatkan menu cepat lebih awal */
          .sm-dashboard-layout { gap:6px !important; }
          .sm-dashboard-hero-inner { padding:5px 12px 6px !important; }
          .sm-dashboard-mobile-paddle { height:30px !important; }
          .sm-dashboard-mobile-paddle img { height:38px !important; }
          .sm-dashboard-hero h1 { font-size:15px !important; }
          .sm-dashboard-hero-actions { margin-top:4px !important; }
          .sm-dashboard-hero-actions button { min-height:29px !important; padding:5px 9px !important; }
          .sm-dashboard-stats > div { height:43px !important; }
          .sm-dashboard-lower > div:first-child > div:first-child { padding:8px 11px !important; }
          .sm-dashboard-quick { order:5 !important; padding:10px !important; margin-top:38px !important; }
          .sm-dashboard-lower { order:4 !important; }
          .sm-dashboard-quick .mx-auto.grid { gap:6px !important; }
          .sm-dashboard-quick .mx-auto.grid { grid-template-columns:repeat(3,minmax(0,1fr)) !important; }
          .sm-dashboard-quick .mx-auto.grid button { min-width:0 !important; min-height:55px !important; padding:7px 3px !important; flex-direction:column !important; gap:4px !important; font-size:10px !important; line-height:1.15 !important; text-align:center !important; }
          .sm-dashboard-quick .mx-auto.grid button:first-child { min-width:0 !important; width:100% !important; min-height:55px !important; }
          .sm-dashboard-quick .mx-auto.grid button svg { width:19px !important; height:19px !important; }
          /* HP: tepat tiga baris event ringkas; scrollbar selalu tampak. */
          .sm-dashboard-screen #dashboard-event-saya { overflow:hidden !important; }
          .sm-dashboard-screen #dashboard-event-saya > div:first-child { padding:10px 12px !important; }
          .sm-dashboard-screen #dashboard-event-saya > div:first-child p { display:none !important; }
          .sm-dashboard-screen #dashboard-event-saya .sm-event-scroll {
            height:186px !important;
            max-height:186px !important;
            overflow-y:scroll !important;
            overflow-x:hidden !important;
            scrollbar-width:auto !important;
            scrollbar-color:#1685d4 #e2e8f0 !important;
            padding-right:5px !important;
            touch-action:pan-y !important;
          }
          .sm-dashboard-screen #dashboard-event-saya .sm-event-scroll::-webkit-scrollbar { width:8px !important; display:block !important; }
          .sm-dashboard-screen #dashboard-event-saya .sm-event-scroll::-webkit-scrollbar-track { background:#e2e8f0 !important; border-radius:9px !important; }
          .sm-dashboard-screen #dashboard-event-saya .sm-event-scroll::-webkit-scrollbar-thumb { background:#1685d4 !important; border-radius:9px !important; }
          .sm-dashboard-screen #dashboard-event-saya .sm-event-scroll > .group {
            height:62px !important;
            min-height:62px !important;
            max-height:62px !important;
            display:grid !important;
            grid-template-columns:35px minmax(0,1fr) auto !important;
            grid-template-rows:1fr 1fr !important;
            column-gap:7px !important;
            row-gap:0 !important;
            padding:3px 7px !important;
            align-items:center !important;
            flex-wrap:nowrap !important;
          }
          .sm-dashboard-screen #dashboard-event-saya .sm-event-scroll > .group > div:first-child { grid-column:1; grid-row:1 / 3; width:32px !important; height:32px !important; border-radius:10px !important; }
          .sm-dashboard-screen #dashboard-event-saya .sm-event-scroll > .group > div:nth-child(2) { grid-column:2; grid-row:1 / 3; min-width:0 !important; }
          .sm-dashboard-screen #dashboard-event-saya .sm-event-scroll > .group > div:nth-child(2) > div:first-child { font-size:10px !important; }
          .sm-dashboard-screen #dashboard-event-saya .sm-event-scroll > .group > div:nth-child(2) > div:nth-child(2) { font-size:8px !important; gap:2px !important; margin-top:2px !important; }
          .sm-dashboard-screen #dashboard-event-saya .sm-event-scroll > .group > span { grid-column:3; grid-row:1; justify-self:end; padding:3px 7px !important; font-size:8px !important; }
          .sm-dashboard-screen #dashboard-event-saya .sm-event-scroll > .group > div:last-child { grid-column:3; grid-row:2; justify-self:end; margin:0 !important; gap:3px !important; }
          .sm-dashboard-screen #dashboard-event-saya .sm-event-scroll > .group > div:last-child button { padding:4px 6px !important; font-size:8px !important; }
          /* Publik: tiga baris kartu meja terlihat, sisanya scroll internal. */
          .sm-dashboard-screen #dashboard-live-meja-publik { overflow:hidden !important; }
          .sm-dashboard-screen .sm-public-tables-scroll {
            max-height:315px !important;
            overflow-y:scroll !important;
            overflow-x:hidden !important;
            overscroll-behavior-y:contain !important;
            -webkit-overflow-scrolling:touch !important;
            touch-action:pan-y !important;
            scrollbar-width:auto !important;
            scrollbar-color:#1685d4 #e2e8f0 !important;
            padding-right:7px !important;
          }
          .sm-dashboard-screen .sm-public-tables-scroll::-webkit-scrollbar { width:8px !important; display:block !important; }
          .sm-dashboard-screen .sm-public-tables-scroll::-webkit-scrollbar-track { background:#e2e8f0 !important; border-radius:9px !important; }
          .sm-dashboard-screen .sm-public-tables-scroll::-webkit-scrollbar-thumb { background:#1685d4 !important; border-radius:9px !important; }
          /* Dashboard HP: Event Saya scroll sendiri, Menu Cepat selalu di dasar layar. */
          .sm-dashboard-screen { padding-bottom:calc(410px + env(safe-area-inset-bottom, 0px)) !important; }
          .sm-dashboard-screen #dashboard-event-saya > div[aria-label^="Daftar Event Saya"] {
            max-height:186px !important;
            overflow-y:scroll !important;
            overscroll-behavior:contain !important;
            -webkit-overflow-scrolling:touch;
            scrollbar-width:thin;
          }
          .sm-dashboard-screen .sm-dashboard-quick {
            position:fixed !important;
            z-index:40 !important;
            left:10px !important;
            right:10px !important;
            bottom:calc(8px + env(safe-area-inset-bottom, 0px)) !important;
            margin:0 !important;
            padding:9px 10px !important;
            border:1px solid rgba(80,192,255,.85) !important;
            border-radius:27px !important;
            background:linear-gradient(180deg,#f4fbff 0%,#fff 24%,#fff 100%) !important;
            box-shadow:0 -5px 18px rgba(15,114,222,.24), 0 -1px 9px rgba(60,190,255,.55), inset 0 2px 0 rgba(165,228,255,.85) !important;
          }
          /* Garis cahaya biru mengikuti lengkung tepi atas Menu Cepat. */
          .sm-dashboard-screen .sm-dashboard-quick::before {
            content:"";
            position:absolute;
            pointer-events:none;
            top:-2px;
            left:18px;
            right:18px;
            height:12px;
            border-top:2px solid rgba(42,164,255,.92);
            border-radius:50% 50% 0 0 / 100% 100% 0 0;
            filter:drop-shadow(0 0 5px rgba(12,155,255,.85));
          }
          .sm-dashboard-screen .sm-dashboard-quick .mb-4 { margin-bottom:6px !important; }
          .sm-dashboard-screen .sm-dashboard-quick .mx-auto.grid { gap:6px !important; }
          .sm-dashboard-screen .sm-dashboard-quick .mx-auto.grid button { min-height:49px !important; }
          .sm-dashboard-screen .sm-dashboard-stats-public { grid-template-columns:repeat(3,minmax(0,1fr)) !important; }
          .sm-dashboard-screen .sm-dashboard-quick .sm-public-quick-grid { grid-template-columns:repeat(2,minmax(0,1fr)) !important; max-width:640px !important; }
          .sm-dashboard-screen .sm-dashboard-quick .sm-public-quick-grid button { min-height:64px !important; flex-direction:row !important; font-size:12px !important; }
          /* hero pingpong glow: cahaya putih/cyan lembut di belakang gambar */
          img[src*=\"hero-pingpong\"] { filter: drop-shadow(0 0 10px rgba(255,255,255,.95)) drop-shadow(0 0 24px rgba(125,211,252,.75)) drop-shadow(0 0 42px rgba(255,255,255,.38)) !important; }
        }
      `}</style>
      {saveFeedback !== null && (
        <div
          role={saveFeedback ? 'status' : 'alert'}
          aria-live={saveFeedback ? 'polite' : 'assertive'}
          className={`fixed bottom-5 left-1/2 z-[300] w-[min(92vw,360px)] -translate-x-1/2 rounded-2xl border px-4 py-3 text-center shadow-2xl ${
            saveFeedback
              ? 'border-emerald-300 bg-emerald-950 text-white'
              : 'border-red-300 bg-red-950 text-white'
          }`}
        >
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">SpinMatch</div>
          <div className="mt-0.5 text-sm font-black">{saveFeedback ? 'Data telah disimpan' : 'Data Gagal disimpan'}</div>
        </div>
      )}
    </div>
  );
};

// LoginPage dan Dashboard adalah komponen terpisah agar urutan React Hooks stabil.
const MainContent = () => {
  const { user } = useAuth();
  return user ? <AuthenticatedContent key={user.id || 'PUBLIC'} /> : <LoginPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}