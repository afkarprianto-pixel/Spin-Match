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
  Settings, ChevronDown, Pencil, Wallet, Play, RotateCcw,
  Crown, Medal, Sparkles, Target, Dices, CheckCircle2, Calendar,
  Printer, Search, FileText, Radio
} from 'lucide-react';


const SpinMatchSidebar = ({ activeView, setActiveView, role = '' }) => {
  const normalizedRole = String(role || '').toUpperCase();
  const isPublicRole = normalizedRole === 'PUBLIC' || normalizedRole === 'PUBLIK';
  const menu = [
    { view: 'DASHBOARD', label: 'Dashboard', icon: Activity },
    { view: 'REGISTRATION', label: 'Pendaftaran', icon: Users },
    { view: 'DRAW', label: 'Undian Pool', icon: Dices },
    { view: 'SCHEDULE', label: 'Jadwal Pertandingan', icon: Calendar },
    { view: 'LIVE_SCORE', label: 'Live Score', icon: Radio },
    { view: 'RANKING', label: 'Peringkat & Poin', icon: Medal },
    { view: 'KNOCKOUT', label: 'Knockout', icon: Trophy },
  ].filter(item => !isPublicRole || ['DASHBOARD', 'SCHEDULE', 'LIVE_SCORE', 'RANKING', 'KNOCKOUT'].includes(item.view));

  return (
    <aside className="flex h-screen w-[268px] flex-col bg-gradient-to-b from-[#052a4a] via-[#063a67] to-[#052a4a] text-white shadow-2xl">
      <div className="flex min-h-[112px] items-center gap-3.5 border-b border-white/10 px-5">
        <img
          src={logoSpinMatch}
          alt="SpinMatch"
          className="h-[58px] w-[58px] shrink-0 rounded-[14px] object-contain"
        />
        <div className="min-w-0">
          <div className="whitespace-nowrap text-[20px] font-black leading-none tracking-[-0.03em]">
            <span className="text-white">Spin</span><span className="text-[#16e49b]">Match</span>
          </div>
          <div className="mt-2 flex items-start gap-1.5">
            <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#22e89d] shadow-[0_0_8px_rgba(34,232,157,.75)]" />
            <div className="text-[9px] font-black uppercase leading-[1.25] tracking-[.14em] text-[#9abbd2]">
              <div>TABLE TENNIS</div>
              <div>PLATFORM</div>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-3.5 py-5">
        {menu.map(({ view, label, icon: Icon }) => (
          <button
            key={view}
            type="button"
            onClick={() => setActiveView(view)}
            className={`flex w-full items-center gap-3.5 rounded-[13px] px-4 py-3.5 text-left text-[14px] font-extrabold transition ${
              activeView === view
                ? 'bg-gradient-to-r from-[#0b67b2] to-[#0a86d8] text-white shadow-lg shadow-blue-950/20'
                : 'text-[#d5e3ed] hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className={`h-[18px] w-[18px] shrink-0 ${activeView === view ? 'text-cyan-200' : 'text-[#8eb2cb]'}`} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {!isPublicRole && <div className="border-t border-white/10 p-3.5">
        <button
          type="button"
          onClick={() => setActiveView('SETTINGS')}
          className={`flex w-full items-center gap-3.5 rounded-[13px] px-4 py-3.5 text-left text-[14px] font-extrabold transition ${
            activeView === 'SETTINGS'
              ? 'bg-gradient-to-r from-[#0b67b2] to-[#0a86d8] text-white shadow-lg shadow-blue-950/20'
              : 'text-[#d5e3ed] hover:bg-white/10 hover:text-white'
          }`}
        >
          <Settings className="h-[18px] w-[18px] shrink-0" />
          <span className="flex-1">Pengaturan</span>
          <span className="ml-auto text-[22px] font-black leading-none text-white" aria-hidden="true">⋮</span>
        </button>
      </div>}
    </aside>
  );
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
          className="block h-[58px] w-full touch-none cursor-crosshair"
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

const MainContent = () => {
  const { user } = useAuth();
  const userRole = String(user?.role || user?.user_metadata?.role || user?.app_metadata?.role || '').toUpperCase();
  const isPublic = userRole === 'PUBLIC' || userRole === 'PUBLIK';
  const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'SUPERADMIN' || userRole === 'ADMIN';
  const isEO = userRole === 'EO';
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
  const [selectedEventIdForKnockout, setSelectedEventIdForKnockout] = useState('');
  const [dashboardEventBrowser, setDashboardEventBrowser] = useState(null); // null | 'MINE' | 'ALL'
  const [publicViewedEventId, setPublicViewedEventId] = useState(() => sessionStorage.getItem('spinmatch_public_view_event') || '');

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
  const [refereeModalOpen, setRefereeModalOpen] = useState(false);
  const [newRefereeName, setNewRefereeName] = useState('');
  const [newRefereeStatus, setNewRefereeStatus] = useState('AKTIF');
  const [activityLogs, setActivityLogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('spinmatch_activity_logs') || '[]'); }
    catch { return []; }
  });

  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('spinmatch_events');
    if (savedEvents) {
      try { return JSON.parse(savedEvents); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 1,
        nama: 'Kejuaraan Piala Gubernur 2026',
        tanggal: 'Dari Tanggal 21 Sept sd 22 Sept 2026',
        status: 'Aktif',
        peserta: 12,
        durasiMatch: '20 Menit',
        jamMulai: '08:00',
        jamSelesai: '18:00',
        jumlahMeja: 4,
        metodePengundian: 'PER_DIVISI',
        divisiList: [
          { nama: 'Divisi 5', sistemMatch: 'Best of 5', jumlahPool: '1 Pool isi 3 Orang', lolosPool: '2 Pemain' }
        ]
      },
    ];
  });

  const [participants, setParticipants] = useState(() => {
    const savedParticipants = localStorage.getItem('spinmatch_participants');
    if (savedParticipants) {
      try { return JSON.parse(savedParticipants); } catch (e) { console.error(e); }
    }
    return {
      1: [
        { id: 101, customId: 'D5-260001', nama: 'Rio Saputra', ptm: 'PTM White Ball', noTelp: '08123456789', divisi: 'Divisi 5', statusBayar: 'Bayar', nilaiBayar: 50000, usia: 24 },
        { id: 102, customId: 'D5-260002', nama: 'Yoga Firmansyah', ptm: 'PTM Putra Mandiri', noTelp: '08987654321', divisi: 'Divisi 5', statusBayar: 'Bayar', nilaiBayar: 50000, usia: 28 },
        { id: 103, customId: 'D5-260003', nama: 'Bayu Kresna', ptm: 'PTM Galaxy', noTelp: '08123456780', divisi: 'Divisi 5', statusBayar: 'Bayar', nilaiBayar: 50000, usia: 26 },
        { id: 104, customId: 'D5-260004', nama: 'Farel Mahesa', ptm: 'PTM Master Spin', noTelp: '08123456781', divisi: 'Divisi 5', statusBayar: 'Bayar', nilaiBayar: 50000, usia: 25 },
        { id: 105, customId: 'D5-260005', nama: 'Reza Kurniawan', ptm: 'PTM Topspin', noTelp: '08123456782', divisi: 'Divisi 5', statusBayar: 'Bayar', nilaiBayar: 50000, usia: 27 },
        { id: 106, customId: 'D5-260006', nama: 'Rendi Gunawan', ptm: 'PTM Power Smash', noTelp: '08123456783', divisi: 'Divisi 5', statusBayar: 'Bayar', nilaiBayar: 50000, usia: 29 },
        { id: 107, customId: 'D5-260007', nama: 'Farhan Akbar', ptm: 'PTM Fast Ball', noTelp: '08123456784', divisi: 'Divisi 5', statusBayar: 'Bayar', nilaiBayar: 50000, usia: 23 },
        { id: 108, customId: 'D5-260008', nama: 'Rizky Pratama', ptm: 'PTM Satria Pingpong', noTelp: '08123456785', divisi: 'Divisi 5', statusBayar: 'Bayar', nilaiBayar: 50000, usia: 26 },
        { id: 109, customId: 'D5-260009', nama: 'Aditiya Surya', ptm: 'PTM Garuda Smash', noTelp: '08123456786', divisi: 'Divisi 5', statusBayar: 'Bayar', nilaiBayar: 50000, usia: 28 },
        { id: 110, customId: 'D5-260010', nama: 'Haris Kurnia', ptm: 'PTM Strong Bat', noTelp: '08123456787', divisi: 'Divisi 5', statusBayar: 'Bayar', nilaiBayar: 50000, usia: 24 },
        { id: 111, customId: 'D5-260011', nama: 'Hendra Kusuma', ptm: 'PTM Lautan Smash', noTelp: '08123456788', divisi: 'Divisi 5', statusBayar: 'Bayar', nilaiBayar: 50000, usia: 30 },
        { id: 112, customId: 'D5-260012', nama: 'Reza Prakoso', ptm: 'PTM Rally Point', noTelp: '08123456789', divisi: 'Divisi 5', statusBayar: 'Bayar', nilaiBayar: 50000, usia: 25 },
      ]
    };
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

  useEffect(() => { localStorage.setItem('spinmatch_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('spinmatch_participants', JSON.stringify(participants)); }, [participants]);
  useEffect(() => { localStorage.setItem('spinmatch_seeded', JSON.stringify(seededPlayers)); }, [seededPlayers]);
  useEffect(() => { localStorage.setItem('spinmatch_pools', JSON.stringify(poolResults)); }, [poolResults]);
  useEffect(() => { localStorage.setItem('spinmatch_match_results', JSON.stringify(matchResults)); }, [matchResults]);
  useEffect(() => { localStorage.setItem('spinmatch_pool_rankings', JSON.stringify(poolRankings)); }, [poolRankings]);
  useEffect(() => { localStorage.setItem('spinmatch_knockout_results', JSON.stringify(knockoutResults)); }, [knockoutResults]);


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
    ownerId: String(row.owner_id || row.ownerid || row.created_by || row.owner || ''),
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
    metodeundian: eventItem.metodePengundian || 'PER_DIVISI',
    divisilist: Array.isArray(eventItem.divisiList) ? eventItem.divisiList : []
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

      // Jangan menghapus data lokal lama hanya karena tabel online masih kosong.
      if (Array.isArray(data) && data.length > 0) {
        const onlineEvents = data.map(eventFromSupabase);
        setEvents(onlineEvents);
        localStorage.setItem('spinmatch_events', JSON.stringify(onlineEvents));
        console.log(`✅ ${onlineEvents.length} Event dimuat dari Supabase`);
      } else {
        console.log('ℹ️ Tabel Events Supabase masih kosong; data lokal tetap dipakai.');
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
        console.log('ℹ️ Tabel Participants Supabase masih kosong; data lokal tetap dipakai.');
      }
    };

    loadParticipantsFromSupabase();
    return () => { cancelled = true; };
  }, []);

  const [showModal, setShowModal] = useState(false);
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
  const [regBuktiBayar, setRegBuktiBayar] = useState('');
  const [participantSearch, setParticipantSearch] = useState('');

  const [showEditPlayerModal, setShowEditPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, player: null });

  const [showMatchResultModal, setShowMatchResultModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const [showPrintModal, setShowPrintModal] = useState(false);
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
  const [showLiveSignatures, setShowLiveSignatures] = useState(false);

  // Event terpilih harus didefinisikan sebelum dipakai oleh dependency useEffect.
  const selectedEventItem = events.find(e => String(e.id) === String(selectedEventIdForReg));
  const selectedDrawEvent = events.find(e => String(e.id) === String(selectedEventIdForDraw));
  const selectedScheduleEvent = events.find(e => String(e.id) === String(selectedEventIdForSchedule));
  const selectedLiveEvent = events.find(e => String(e.id) === String(selectedEventIdForLive));
  const selectedKnockoutEvent = events.find(e => String(e.id) === String(selectedEventIdForKnockout));

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
    if (activeView === 'REGISTRATION' && !selectedEventIdForReg && events.length > 0) {
      setSelectedEventIdForReg(String(events[0].id));
    }
    if (activeView === 'DRAW' && !selectedEventIdForDraw && events.length > 0) {
      setSelectedEventIdForDraw(String(events[0].id));
    }
    if (activeView === 'SCHEDULE' && !selectedEventIdForSchedule && events.length > 0) {
      setSelectedEventIdForSchedule(String(events[0].id));
    }
    if (activeView === 'LIVE_SCORE' && !selectedEventIdForLive && events.length > 0) {
      setSelectedEventIdForLive(String(events[0].id));
    }
    if (activeView === 'KNOCKOUT' && !selectedEventIdForKnockout && events.length > 0) {
      setSelectedEventIdForKnockout(String(events[0].id));
    }
    if (activeView === 'RANKING' && !selectedEventIdForRanking && events.length > 0) {
      setSelectedEventIdForRanking(String(events[0].id));
    }
    if (activeView === 'SETTINGS' && !selectedEventIdForSettings && events.length > 0) {
      setSelectedEventIdForSettings(String(events[0].id));
    }
  }, [user, activeView, events, selectedEventIdForReg, selectedEventIdForDraw, selectedEventIdForSchedule, selectedEventIdForLive, selectedEventIdForKnockout]);

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

  // Semua Hooks MainContent sudah dipanggil secara konsisten.
  // Baru setelah titik ini aman melakukan conditional return untuk halaman login.
  if (!user) {
    return <LoginPage />;
  }

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

  const handleOpenCreate = () => {
    if (isPublic) { alert('Akun Public tidak dapat membuat event. Silakan pilih Semua Event.'); return; }
    if (!isEO && !isSuperAdmin) { alert('Hanya akun EO atau Super Admin yang dapat membuat event.'); return; }
    setIsEditMode(false);
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
    setFormNama(eventItem.nama);
    setFormStatus(eventItem.status);
    if (eventItem.tanggal.includes('sd') || eventItem.tanggal.includes('-')) {
      setIsMultiDate(true);
      const dates = eventItem.tanggal.replace('Dari Tanggal ', '').split(' sd ');
      setFormStartDate(dates[0] || '');
      setFormEndDate(dates[1] || '');
    } else {
      setIsMultiDate(false);
      setFormSingleDate(eventItem.tanggal.replace('Dari Tanggal ', ''));
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
    let formattedTanggal = isMultiDate
      ? `Dari Tanggal ${formStartDate} sd ${formEndDate}`
      : (formSingleDate || '21 Sep 2026');

    if (isEditMode && selectedEventIdForReg) {
      const eventId = Number(selectedEventIdForReg);
      const currentEvent = events.find(ev => Number(ev.id) === eventId);
      if (!currentEvent) return;
      if (!canManageEvent(currentEvent)) { alert('Anda tidak dapat mengubah event milik EO lain.'); return; }

      const updatedEvent = {
        ...currentEvent,
        nama: formNama,
        tanggal: formattedTanggal,
        status: formStatus,
        durasiMatch,
        jamMulai,
        jamSelesai,
        jumlahMeja: Math.max(1, Number(jumlahMeja || 4)),
        metodePengundian,
        divisiList
      };

      const { error } = await supabase
        .from('Events')
        .update(eventToSupabase(updatedEvent))
        .eq('id', eventId);

      if (error) {
        console.error('❌ Gagal memperbarui Event di Supabase:', error);
        alert(`Event belum tersimpan ${error.message}`);
        return;
      }

      const updatedEvents = events.map(ev => Number(ev.id) === eventId ? updatedEvent : ev);
      setEvents(updatedEvents);
      localStorage.setItem('spinmatch_events', JSON.stringify(updatedEvents));
      alert('Event berhasil diperbarui dan disimpan');
    } else {
      const newEvent = {
        id: Date.now(),
        nama: formNama,
        tanggal: formattedTanggal,
        status: formStatus,
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

      const { error } = await supabase
        .from('Events')
        .insert(eventToSupabase(newEvent));

      if (error) {
        console.error('❌ Gagal membuat Event di Supabase:', error);
        alert(`Event belum tersimpan ke Supabase: ${error.message}`);
        return;
      }

      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem('spinmatch_events', JSON.stringify(updatedEvents));
      alert('Event berhasil dibuat dan disimpan');
    }

    setShowModal(false);
    setIsEditMode(false);
    setSelectedEventIdForReg('');
    setSelectedDivisiForConfig(null);
  };

  const handleDeleteEvent = async (id, nama) => {
    if (guardPublicMutation()) return;
    const targetEvent = events.find(ev => Number(ev.id) === Number(id));
    if (!canManageEvent(targetEvent)) { alert('Anda tidak dapat menghapus event milik EO lain.'); return; }
    if (!window.confirm(`Apakah Anda yakin ingin menghapus event "${nama}"?`)) return;

    const { error } = await supabase
      .from('Events')
      .delete()
      .eq('id', Number(id));

    if (error) {
      console.error('❌ Gagal menghapus Event di Supabase:', error);
      alert(`Event belum dapat dihapus dari Supabase: ${error.message}`);
      return;
    }

    setEvents(prev => prev.filter(item => Number(item.id) !== Number(id)));
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

    setPoolResults({
      ...poolResults,
      [selectedDrawEvent.id]: {
        pools: results,
        seededPools,
        config: {
          poolSize,
          lolosCount,
          totalPlayers,
          numPools,
          knockoutPlayers,
          bracketSize,
          byeCount,
          requiredSeeds: numPools,
          byePrioritySeeds: byeCount
        }
      }
    });
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

  const getDayName = (dateStr) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '-';
    return days[date.getDay()];
  };

  const formatDateShort = (dateStr) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return `${date.getDate()}-${months[date.getMonth()]}-${String(date.getFullYear()).slice(-2)}`;
  };

  const calculatePoolRankings = (eventId) => {
    const poolData = poolResults[eventId];
    if (!poolData) return {};
    const rankings = {};

    // WAJIB mengikuti pengaturan Event yang sedang dihitung, bukan event lain
    // yang kebetulan sedang tersimpan di selectedScheduleEvent.
    const eventData = events.find(e => String(e.id) === String(eventId));
    const divisiConfig = eventData?.divisiList?.[0] || {};

    // poolData.config.lolosCount disimpan saat Undian dan menjadi fallback
    // agar aturan "1 Pemain / 2 Pemain" tetap konsisten sampai Jadwal.
    const configuredLolos = Number(poolData?.config?.lolosCount || 0);
    const lolosCount = configuredLolos > 0
      ? configuredLolos
      : (divisiConfig.lolosPool === '2 Pemain' ? 2 : 1);
    Object.entries(poolData.pools).forEach(([poolName, players]) => {
      const poolMatches = Object.entries(matchResults).filter(([key]) =>
        key.startsWith(`${eventId}_${poolName}_`)
      );
      const playerStats = {};
      players.forEach(p => {
        playerStats[p.id] = {
          id: p.id,
          nama: p.nama,
          ptm: p.ptm,
          playerCode: p.customId,
          wins: 0,
          losses: 0,
          points: 0,
          gamesWon: 0,
          gamesLost: 0,
          totalPoints: 0
        };
      });
      // Hitung ranking berdasarkan PEMAIN YANG BENAR-BENAR BERTANDING.
      // Seed hanya menentukan posisi undian/Pool, BUKAN menentukan siapa yang lolos.
      const m1Result = matchResults[`${eventId}_${poolName}_M1`];

      poolMatches.forEach(([matchKey, result]) => {
        if (!result || !result.winner) return;

        const parts = matchKey.split('_');
        const matchRef = parts[parts.length - 1];
        let player1 = null;
        let player2 = null;

        if (players.length === 3) {
          if (matchRef === 'M1') {
            // M1 = pemain posisi 2 vs posisi 3
            player1 = players[1] || null;
            player2 = players[2] || null;
          } else if (matchRef === 'M2') {
            // M2 = yang kalah M1 vs pemain posisi 1
            if (!m1Result?.winner) return;
            player1 = m1Result.winner === 'player1' ? players[2] : players[1];
            player2 = players[0] || null;
          } else if (matchRef === 'M3') {
            // M3 = yang menang M1 vs pemain posisi 1
            if (!m1Result?.winner) return;
            player1 = m1Result.winner === 'player1' ? players[1] : players[2];
            player2 = players[0] || null;
          }
        } else {
          // Fallback untuk format selain Pool 3 pemain:
          // gunakan data pemain yang tersimpan pada hasil bila tersedia.
          player1 = result.player1 || null;
          player2 = result.player2 || null;
        }

        if (!player1?.id || !player2?.id) return;

        const winnerPlayer = result.winner === 'player1' ? player1 : player2;
        const loserPlayer  = result.winner === 'player1' ? player2 : player1;

        if (playerStats[winnerPlayer.id]) playerStats[winnerPlayer.id].wins++;
        if (playerStats[loserPlayer.id]) playerStats[loserPlayer.id].losses++;

        // Statistik game/set dan poin harus mengikuti sisi player1/player2,
        // bukan mengikuti status seeded.
        if (playerStats[player1.id]) {
          playerStats[player1.id].gamesWon += Number(result.player1Score || 0);
          playerStats[player1.id].gamesLost += Number(result.player2Score || 0);
          playerStats[player1.id].totalPoints += Number(result.point1 || 0);
        }
        if (playerStats[player2.id]) {
          playerStats[player2.id].gamesWon += Number(result.player2Score || 0);
          playerStats[player2.id].gamesLost += Number(result.player1Score || 0);
          playerStats[player2.id].totalPoints += Number(result.point2 || 0);
        }
      });

      const sortedPlayers = Object.values(playerStats).sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        return (b.gamesWon - b.gamesLost) - (a.gamesWon - a.gamesLost);
      });
      rankings[poolName] = sortedPlayers.map((player, index) => ({
        ...player,
        ranking: index + 1,
        keterangan: index < lolosCount ? `Lolos Pool ${index + 1}` : ''
      }));
    });
    setPoolRankings(prev => ({
      ...prev,
      [eventId]: rankings
    }));
    return rankings;
  };

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
          matchLabel: `Pemain Kalah M1 VS ${poolLetter}1`,
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
          matchLabel: `Pemain Menang M1 VS ${poolLetter}1`,
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
    return scheduleRows;
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
    const result = knockoutResults[`${eventId}_${matchId}`] || matchResults[`${eventId}_${matchId}`];
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
    const maxMeja = 4;

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

  const openLiveScore = (match) => {
    if (match.type !== 'player' || !match.matchId) return;
    activeVoiceSetRef.current = 0;
    setActiveVoiceSet(0);
    setVoiceStatus('SET 1 aktif — klik mikrofon lalu sebut nama dan skor');
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

  const saveLiveScoreResult = (closeAfterSave = true) => {
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
    alert(liveScoreMatch.isKnockout
      ? 'Hasil Knockout berhasil disimpan. Pemenang otomatis maju ke babak berikutnya!'
      : 'Hasil pertandingan berhasil disimpan dan otomatis tersinkron ke Jadwal!');
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

  // Tombol SIMPAN dan SIMPAN & TUTUP sama-sama:
  // simpan -> alert -> setelah OK/ENTER form Live Score langsung keluar.
  const handleLiveScoreSave = () => saveLiveScoreResult(true);
  const handleLiveScoreSubmit = () => saveLiveScoreResult(true);

  const handleDeleteMatch = () => {
    if (!liveScoreMatch) return;
    if (window.confirm('Apakah Anda yakin ingin menghapus hasil pertandingan ini? Data akan dikosongkan dan bisa diisi ulang.')) {
      const matchId = liveScoreMatch.matchId;
      const updatedMatchResults = { ...matchResults };
      delete updatedMatchResults[matchId];
      setMatchResults(updatedMatchResults);
      localStorage.setItem('spinmatch_match_results', JSON.stringify(updatedMatchResults));
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



  const handleSaveMatchResult = (matchId, result) => {
    setMatchResults({
      ...matchResults,
      [matchId]: result
    });
    if (selectedScheduleEvent) {
      setTimeout(() => {
        calculatePoolRankings(selectedScheduleEvent.id);
      }, 100);
    }
  };

  const handleOpenMatchResult = (match) => {
    if (match.type !== 'player' || !match.matchId) return;
    setSelectedMatch(match);
    setShowMatchResultModal(true);
  };

  const handleSaveResult = (e) => {
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
      handleSaveMatchResult(selectedMatch.matchId, result);
    }
    setShowMatchResultModal(false);
    alert('Hasil pertandingan berhasil disimpan!');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
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
            <td style="border: 1px solid #e2e8f0; padding: 6px; text-align: center;">${row.hari}</td>
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
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background-color: #f1f5f9; padding: 8px; text-align: center; font-weight: bold; border: 1px solid #e2e8f0; }
          td { border: 1px solid #e2e8f0; padding: 6px; }
          .header-row { background-color: #f1f5f9; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <button onclick="window.print()" style="margin-bottom: 15px; padding: 8px 16px; background: #059669; color: white; border: none; border-radius: 6px; cursor: pointer;">🖨️ Print</button>
        <h2>JADWAL PERTANDINGAN</h2>
        <h3>${eventData?.nama?.toUpperCase()}</h3>
        <p style="text-align: center; margin-bottom: 15px;"><strong>${eventData?.tanggal}</strong></p>
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

    const heroEvents = publicSelectedEvent
      ? [publicSelectedEvent]
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

    // Jumlah peserta KHUSUS event aktif
    const totalPeserta = Object.values(participants || {})
    .reduce((total, daftarPeserta) => {
      return total + (Array.isArray(daftarPeserta) ? daftarPeserta.length : 0);
    }, 0);

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
  const liveScoreRows = selectedLiveEvent ? generateScheduleFromPools(selectedLiveEvent.id) : [];
  const liveScoreRankings = poolRankings[selectedLiveEvent?.id] || {};

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
        main: 0, menang: 0, kalah: 0, poin: 0,
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

      if (!stats[key1]) stats[key1] = { id: row.player.id, nama: row.player.nama, ptm: row.player.ptm || '-', main:0, menang:0, kalah:0, poin:0, eventCount:1 };
      if (!stats[key2]) stats[key2] = { id: row.opponent.id, nama: row.opponent.nama, ptm: row.opponent.ptm || '-', main:0, menang:0, kalah:0, poin:0, eventCount:1 };

      stats[key1].main += 1;
      stats[key2].main += 1;

      if (result.winner === 'player1') {
        stats[key1].menang += 1; stats[key1].poin += 3;
        stats[key2].kalah += 1;
      } else if (result.winner === 'player2') {
        stats[key2].menang += 1; stats[key2].poin += 3;
        stats[key1].kalah += 1;
      }
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
            main: 0, menang: 0, kalah: 0, poin: 0,
            eventCount: 0
          };
        }
        aggregate[key].main += p.main;
        aggregate[key].menang += p.menang;
        aggregate[key].kalah += p.kalah;
        aggregate[key].poin += p.poin;
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

    const registered = refereeRegistry.find(r => r.id === assignment.refereeId);
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
        Number(row?.meja || row?.table || row?.tableNo || 0) === Number(tableNo)
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
        hasScoreValue(result.score2)
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

  const currentRefereeAssignments =
    refereeAssignments[String(selectedSettingsEvent?.id)] || {};

  const assignedRefereeCount = Array.from({ length: settingsTableCount }, (_, i) => i + 1)
    .filter(no => {
      const id = currentRefereeAssignments[String(no)]?.refereeId;
      return !!id && refereeRegistry.some(r => r.id === id);
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
        <SpinMatchSidebar activeView={activeView} setActiveView={setActiveView} role={userRole} />
        <button
          type="button"
          onClick={() => {
            if (isPublicRole) {
              alert('Akun Public hanya dapat melihat data. Pengaturan hanya tersedia untuk EO dan Super Admin.');
              return;
            }
            setActiveView('SETTINGS');
          }}
          className="fixed bottom-5 right-4 z-[90] flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#0a3971] to-[#0874c9] text-[26px] font-black leading-none text-white shadow-xl shadow-blue-950/25 md:hidden"
          title="Pengaturan"
          aria-label="Buka Pengaturan"
        >
          ⋮
        </button>
      </div>

      <main className="min-w-0 flex-1 flex flex-col h-[100dvh] overflow-hidden">
        <div className="spinmatch-page-head shrink-0 bg-slate-50 px-3 pt-3 pb-2 z-10 border-b border-slate-200/60 shadow-xs sm:px-5 sm:pt-5 md:px-8 md:pt-8 md:pb-4">
          <div className="hidden md:block">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 pt-0.5">
                <p className="text-[10px] font-black uppercase tracking-[0.08em] text-slate-400">
                  SEPTEMBER 2026 • SUPER ADMIN WORKSPACE
                </p>
                <h1 className="mt-1 text-[22px] font-black tracking-tight text-slate-950">
                  Selamat datang di SpinMatch
                </h1>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Sistem online
                  </span>

                  <span className="flex h-9 min-w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-3 text-[10px] font-black text-slate-700 shadow-sm">
                    SA
                  </span>

                  {!isPublic && (
                    <button
                      type="button"
                      onClick={handleOpenCreate}
                      className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#07101f] px-4 text-[11px] font-black text-white shadow-[0_5px_14px_rgba(2,6,23,.22)] transition hover:-translate-y-0.5 hover:bg-[#0a3971]"
                    >
                      <Plus className="h-4 w-4 text-[#8DFF63]" />
                      Buat Event
                    </button>
                  )}
                </div>

                {/* Tombol persiapan fitur berikutnya - sengaja belum diberi aksi */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Fitur Berita Pingpong akan diaktifkan berikutnya"
                    className="inline-flex h-8 cursor-default items-center gap-1.5 rounded-full border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-3 text-[9px] font-black text-[#0a3971] shadow-sm"
                  >
                    <FileText className="h-3.5 w-3.5 text-cyan-600" />
                    Berita Pingpong
                  </button>

                  <button
                    type="button"
                    title="Fitur Cari Pelatih akan diaktifkan berikutnya"
                    className="inline-flex h-8 cursor-default items-center gap-1.5 rounded-full border border-lime-200 bg-gradient-to-r from-lime-50 to-emerald-50 px-3 text-[9px] font-black text-emerald-700 shadow-sm"
                  >
                    <Search className="h-3.5 w-3.5 text-emerald-600" />
                    Cari Pelatih
                  </button>
                </div>
              </div>
            </div>
          </div>

          {activeView === 'RANKING' && (
            <div className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#071b3b] via-[#0a3971] to-[#0874c9] p-5 text-white shadow-[0_12px_30px_rgba(7,27,59,.18)]">
              <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute right-8 top-1/2 h-[2px] w-44 -rotate-[18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveView('DASHBOARD')} className="rounded-xl border border-white/15 bg-white/10 p-2 hover:bg-white/20">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h2 className="text-lg font-black">Peringkat & Poin</h2>
                    <p className="text-xs text-blue-100/75">Peringkat Event dan peringkat keseluruhan SpinMatch per divisi</p>
                  </div>
                </div>
                <div className="flex rounded-xl border border-white/15 bg-white/10 p-1">
                  <button onClick={() => setRankingMode('EVENT')} className={`rounded-lg px-3 py-2 text-[10px] font-black ${rankingMode === 'EVENT' ? 'bg-[#8DFF63] text-[#09243e]' : 'text-white/80'}`}>Peringkat Event</button>
                  <button onClick={() => setRankingMode('GLOBAL')} className={`rounded-lg px-3 py-2 text-[10px] font-black ${rankingMode === 'GLOBAL' ? 'bg-[#8DFF63] text-[#09243e]' : 'text-white/80'}`}>Peringkat SpinMatch</button>
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
                    <p className="text-xs text-blue-100/75">Pertandingan, penugasan wasit, dan keuangan per event</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                  <Filter className="h-4 w-4 text-cyan-200" />
                  <select
                    value={selectedEventIdForSettings}
                    onChange={(e) => { setSelectedEventIdForSettings(e.target.value); setSettingsSection('HOME'); }}
                    className="max-w-[280px] bg-transparent text-xs font-black text-white outline-none [&>option]:text-slate-900"
                  >
                    {events.map(ev => <option key={ev.id} value={ev.id}>{ev.nama}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeView === 'REGISTRATION' && (
            <div className="sm-mobile-page-header p-5 rounded-3xl border border-white/10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4 relative overflow-hidden bg-gradient-to-r from-[#052a4a] via-[#075a91] to-[#0b83c9] text-white">
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
                  <span className="text-xs font-extrabold text-orange-400">Pilih Event:</span>
                  <select value={selectedEventIdForReg} onChange={(e) => setSelectedEventIdForReg(e.target.value)} className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer">
                    {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.nama} ({ev.tanggal})</option>))}
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
                  <span className="text-xs font-extrabold text-orange-400">Pilih Event:</span>
                  <select value={selectedEventIdForDraw} onChange={(e) => setSelectedEventIdForDraw(e.target.value)} className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer">
                    {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.nama} ({ev.tanggal})</option>))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeView === 'SCHEDULE' && (
            <div className="sm-mobile-page-header relative overflow-hidden bg-gradient-to-r from-[#052a4a] via-[#075a91] to-[#0b83c9] p-5 rounded-3xl border border-white/10 shadow-[0_14px_35px_rgba(3,35,68,.20)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4 text-white">
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
              <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-2xl border border-white/20">
                  <Filter className="w-4 h-4 text-blue-100/80" />
                  <span className="text-xs font-extrabold text-orange-400">Pilih Event:</span>
                  <select value={selectedEventIdForSchedule} onChange={(e) => setSelectedEventIdForSchedule(e.target.value)} className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer">
                    {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.nama} ({ev.tanggal})</option>))}
                  </select>
                </div>
                <button onClick={() => setActiveView('DRAW')} className="px-4 py-2 bg-[#bef264] hover:bg-[#a3e635] text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-sm flex items-center gap-1.5">
                  <Shuffle className="w-3.5 h-3.5" /> Undian
                </button>
                <button onClick={() => setShowPrintModal(true)} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>

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
                  <span className="text-xs font-extrabold text-orange-400">Pilih Event:</span>
                  <select value={selectedEventIdForKnockout} onChange={(e)=>setSelectedEventIdForKnockout(e.target.value)} className="bg-transparent text-xs font-bold text-white focus:outline-none [&>option]:text-white">
                    {events.map(ev=><option key={ev.id} value={ev.id}>{ev.nama} ({ev.tanggal})</option>)}
                  </select>
                </div>
                <button onClick={()=>window.print()} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5" /> Print Bagan
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
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={() => setActiveView('DASHBOARD')} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition cursor-pointer text-blue-50" title="Kembali ke Dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-red-600" /> Live Skor Pertandingan
                  </h2>
                  <p className="text-xs text-blue-100/70">Input skor real-time untuk dilihat publik</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-2xl border border-white/20">
                  <Filter className="w-4 h-4 text-blue-100/80" />
                  <span className="text-xs font-extrabold text-orange-400">Pilih Event:</span>
                  <select value={selectedEventIdForLive} onChange={(e) => setSelectedEventIdForLive(e.target.value)} className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer">
                    {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.nama} ({ev.tanggal})</option>))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="spinmatch-main-content flex-1 overflow-y-auto overflow-x-hidden px-3 pb-6 pt-3 sm:px-5 sm:pt-4 md:p-8 md:pt-6 md:pb-8">
{isPublic && (
  <div className="mx-auto mb-3 w-full max-w-[1500px] rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-bold text-blue-700 md:mb-4 md:px-4 md:py-3 md:text-xs">
    Mode Publik • Hanya lihat. Pembuatan event, pendaftaran peserta, undian, dan pengaturan dinonaktifkan.
  </div>
)}
{activeView === 'DASHBOARD' ? (
  <>
    {/* =========================================================
        SPINMATCH PREMIUM DASHBOARD
        Mobile-first • Premium Blue • Responsive
    ========================================================== */}

    <div className="sm-dashboard-layout mx-auto w-full max-w-[1500px] space-y-4 md:space-y-6">

      <div className="sm-dashboard-mobile-title hidden md:hidden">
        <div className="sm-dashboard-mobile-brand">
          <img src={logoSpinMatch} alt="SpinMatch" />
          <div>
            <div className="sm-dashboard-mobile-brand-name">SpinMatch</div>
            <div className="sm-dashboard-mobile-brand-page">DASHBOARD</div>
          </div>
        </div>
      </div>

      <div className="sm-dashboard-event-buttons hidden md:hidden">
        <button type="button" className="sm-btn-my-events" onClick={() => {
          if (isPublic) { alert('Event Saya hanya berlaku untuk akun EO. Untuk akun Public, silakan pilih Semua Event.'); return; }
          setDashboardEventBrowser('MINE');
        }}><Trophy className="h-4 w-4" /> Event Saya</button>
        <button type="button" className="sm-btn-all-events" onClick={() => setDashboardEventBrowser('ALL')}><FileText className="h-4 w-4" /> Semua Event</button>
      </div>

      {dashboardEventBrowser && (
        <section className="sm-event-browser order-[1] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm md:order-none">
          <div className="sm-event-browser-header flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
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
                    if (isPublic) {
                      setPublicViewedEventId(String(ev.id));
                      sessionStorage.setItem('spinmatch_public_view_event', String(ev.id));
                    } else {
                      const idx = heroEvents.findIndex(h => String(h.id) === String(ev.id));
                      if (idx >= 0) setHeroEventIndex(idx);
                    }
                    setSelectedEventIdForSchedule(String(ev.id));
                    setSelectedEventIdForLive(String(ev.id));
                    setSelectedEventIdForKnockout(String(ev.id));
                    setSelectedEventIdForRanking(String(ev.id));
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
                <span>{dashboardParticipants.length} Peserta</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur-md">
                <Trophy className="h-4 w-4 text-yellow-300" />
                <span>{dashboardActiveEvent?.divisiList?.length || 0} Divisi</span>
              </div>
            </div>

            <div className="sm-dashboard-hero-actions mt-5 flex flex-wrap gap-2.5">
              <button
                onClick={() => {
                  if (!dashboardActiveEvent) return;
                  setSelectedEventIdForSchedule(String(dashboardActiveEvent.id));
                  setActiveView('SCHEDULE');
                }}
                className="flex items-center gap-2 rounded-xl bg-[#8DFF63] px-4 py-2.5 text-xs font-black text-[#09243e] shadow-lg shadow-lime-950/20 transition hover:-translate-y-0.5 hover:bg-[#a2ff80]"
              >
                <Calendar className="h-4 w-4" /> Lihat Jadwal
              </button>
              <button
                onClick={() => {
                  if (!dashboardActiveEvent) return;
                  setSelectedEventIdForLive(String(dashboardActiveEvent.id));
                  setActiveView('LIVE_SCORE');
                }}
                className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-black text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <Radio className="h-4 w-4 text-red-300" /> Live Score
              </button>
            </div>
          </div>

          <div className="relative hidden min-h-[185px] items-center justify-center overflow-visible md:flex">
            <div className="absolute left-1/2 top-1/2 h-[180px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/15 blur-[58px]" />
            <img
              src={heroPingpong}
              alt="SpinMatch Table Tennis"
              className="relative z-10 w-[300px] max-w-full object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.24)] lg:w-[330px] xl:w-[350px]"
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
      <section className="sm-dashboard-stats grid grid-cols-2 gap-3 lg:grid-cols-4">

        <div className="group rounded-[22px] border border-blue-100 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
              <Trophy className="h-5 w-5 text-blue-600" />
            </div>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-blue-600">
              Event
            </span>
          </div>
          <div className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            {totalEventAktif < 10 ? `0${totalEventAktif}` : totalEventAktif}
          </div>
          <div className="mt-1 text-[11px] font-bold text-slate-500">
            Event Aktif
          </div>
        </div>


        <div className="group rounded-[22px] border border-emerald-100 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-600">
              Peserta
            </span>
          </div>
          <div className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            {totalPeserta}
          </div>
          <div className="mt-1 text-[11px] font-bold text-slate-500">
            Pemain Terdaftar
          </div>
        </div>


        <div className="group rounded-[22px] border border-orange-100 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,.06)] transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
              <Activity className="h-5 w-5 text-orange-500" />
            </div>
            <span className="rounded-full bg-orange-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-orange-600">
              Match
            </span>
          </div>
          <div className="mt-4 text-3xl font-black tracking-tight text-slate-950">
            {Object.keys(matchResults || {}).length}
          </div>
          <div className="mt-1 text-[11px] font-bold text-slate-500">
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

        {/* Mobile: tombol berwarna, 2 kolom, Kelola Event di tengah */}
        <div className="mx-auto grid max-w-[430px] grid-cols-2 gap-3 md:hidden">
          <button
            onClick={() => document.getElementById('dashboard-event-saya')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="col-span-2 mx-auto flex w-[calc(50%-6px)] min-w-[150px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1478f2] to-[#0b96ff] px-4 py-3.5 text-[12px] font-black text-white shadow-[0_8px_20px_rgba(20,120,242,.24)] active:scale-[.98]"
          >
            <Settings className="h-5 w-5" /> Kelola Event
          </button>

          <button
            onClick={() => {
              const ev = events.find(e => e.status === 'Aktif') || events[0];
              if (ev) setSelectedEventIdForReg(String(ev.id));
              setActiveView('REGISTRATION');
            }}
            className="flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1788f5] to-[#26a7ff] px-3 py-3 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(23,136,245,.20)] active:scale-[.98]"
          >
            <Users className="h-5 w-5 shrink-0" /> Kelola Pemain
          </button>

          <button
            onClick={() => {
              const ev = events.find(e => e.status === 'Aktif') || events[0];
              if (ev) setSelectedEventIdForDraw(String(ev.id));
              setActiveView('DRAW');
            }}
            className="flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#08b978] to-[#14d69a] px-3 py-3 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(8,185,120,.20)] active:scale-[.98]"
          >
            <Shuffle className="h-5 w-5 shrink-0" /> Undian Pool
          </button>

          <button
            onClick={() => {
              const ev = events.find(e => e.status === 'Aktif') || events[0];
              if (ev) setSelectedEventIdForSchedule(String(ev.id));
              setActiveView('SCHEDULE');
            }}
            className="flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff8a16] to-[#ffad24] px-3 py-3 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(255,138,22,.20)] active:scale-[.98]"
          >
            <Calendar className="h-5 w-5 shrink-0" /> Jadwal
          </button>

          <button
            onClick={() => {
              const ev = events.find(e => e.status === 'Aktif') || events[0];
              if (ev) setSelectedEventIdForKnockout(String(ev.id));
              setActiveView('KNOCKOUT');
            }}
            className="flex min-h-[58px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ef3655] to-[#f54d6c] px-3 py-3 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(239,54,85,.20)] active:scale-[.98]"
          >
            <Trophy className="h-5 w-5 shrink-0" /> Knockout
          </button>
        </div>

        {/* Tablet/Desktop: tetap rapi 5 menu sejajar */}
        <div className="hidden grid-cols-5 gap-4 md:grid">
          {[
            { label: 'Kelola Event', icon: Settings, action: () => document.getElementById('dashboard-event-saya')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), box: 'from-blue-50 to-blue-100', iconColor: 'text-blue-600' },
            { label: 'Kelola Pemain', icon: Users, action: () => { const ev = events.find(e => e.status === 'Aktif') || events[0]; if (ev) setSelectedEventIdForReg(String(ev.id)); setActiveView('REGISTRATION'); }, box: 'from-sky-50 to-cyan-100', iconColor: 'text-sky-600' },
            { label: 'Undian Pool', icon: Shuffle, action: () => { const ev = events.find(e => e.status === 'Aktif') || events[0]; if (ev) setSelectedEventIdForDraw(String(ev.id)); setActiveView('DRAW'); }, box: 'from-emerald-50 to-emerald-100', iconColor: 'text-emerald-600' },
            { label: 'Jadwal', icon: Calendar, action: () => { const ev = events.find(e => e.status === 'Aktif') || events[0]; if (ev) setSelectedEventIdForSchedule(String(ev.id)); setActiveView('SCHEDULE'); }, box: 'from-amber-50 to-orange-100', iconColor: 'text-orange-500' },
            { label: 'Knockout', icon: Trophy, action: () => { const ev = events.find(e => e.status === 'Aktif') || events[0]; if (ev) setSelectedEventIdForKnockout(String(ev.id)); setActiveView('KNOCKOUT'); }, box: 'from-rose-50 to-red-100', iconColor: 'text-rose-600' },
          ].map(({ label, icon: Icon, action, box, iconColor }) => (
            <button key={label} onClick={action} className="group flex flex-col items-center gap-2">
              <span className={`flex aspect-square w-full max-w-[84px] items-center justify-center rounded-[20px] bg-gradient-to-br ${box} transition group-hover:-translate-y-1 group-hover:shadow-lg`}>
                <Icon className={`h-7 w-7 ${iconColor}`} />
              </span>
              <span className="text-center text-xs font-black text-slate-700">{label}</span>
            </button>
          ))}
        </div>
      </section>


      {/* ===================== LOWER CONTENT ===================== */}
      <section className="sm-dashboard-lower grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_.65fr]">

        {/* EVENTS */}
        <div id="dashboard-event-saya" className="scroll-mt-24 overflow-hidden rounded-[26px] border border-slate-100 bg-white shadow-[0_10px_35px_rgba(15,23,42,.06)]">

          <div className="sm-my-events-header flex items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-5">
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
              className="sm-new-event-btn flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-black shadow-md transition sm:px-4 sm:text-xs"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Buat Event</span>
              <span className="sm:hidden">Baru</span>
            </button>}
          </div>


          {myEvents.length === 0 ? (

            <div className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
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

            <div className="divide-y divide-slate-100">

              {myEvents.slice(0, 5).map((item) => (

                <div
                  key={item.id}
                  className="group flex items-center gap-3 p-4 transition hover:bg-slate-50 sm:p-5"
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
                        {(participants[item.id] || []).length} Peserta
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

                  {canManageEvent(item) && <button
                    onClick={() => handleRowClick(item)}
                    className="hidden rounded-lg bg-slate-100 px-2.5 py-1.5 text-[9px] font-black text-slate-600 transition hover:bg-blue-600 hover:text-white sm:block"
                  >
                    Edit
                  </button>}

                </div>

              ))}

            </div>
          )}
        </div>


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
                  {Object.keys(matchResults || {}).length}
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
                    setSelectedEventIdForLive(String(dashboardActiveEvent.id));
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
                    <button onClick={handleDeleteAllParticipants} disabled={currentEventParticipants.length === 0} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm border border-red-600">
                      <Trash2 className="w-3.5 h-3.5" /> Hapus Semua
                    </button>
                  </div>
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input value={participantSearch} onChange={(e) => setParticipantSearch(e.target.value)} placeholder="Cari pemain / ID / PTM..." className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none focus:border-blue-400" />
                  </div>
                </div>
                <div className="sm-player-list-shell overflow-hidden rounded-[20px] border border-slate-200">
                  <div className="sm-player-list-header flex items-center justify-between px-4 py-3">
                    <div><h3 className="text-sm font-black text-white">Daftar Pemain</h3><p className="text-[9px] font-semibold text-white/85">No. ID | Nama Pemain | PTM | Divisi | Status Bayar</p></div>
                    <button type="button" onClick={() => window.print()} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/80 text-[#0a3971] shadow"><Printer className="h-4 w-4" /></button>
                  </div>
                <div className="sm-participant-table max-h-[420px] overflow-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#073a72] via-[#0874c9] to-[#1598e8] border-b border-blue-700 font-bold text-white text-center">
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
                        currentEventParticipants.filter((p) => { const q=participantSearch.trim().toLowerCase(); return !q || [p.customId,p.nama,p.ptm,p.divisi,p.statusBayar].some(v=>String(v||'').toLowerCase().includes(q)); }).map((p, idx) => (
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
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
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
              </div>
              {currentPoolData && (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6">
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-base font-black text-slate-900">Hasil Pembagian Pool</h3>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{currentPoolData.config.totalPlayers} Pemain • {Object.keys(currentPoolData.pools).length} Pool</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={handleResetDraw} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" /> Reset Undian
                      </button>
                      <button onClick={() => { setActiveView('SCHEDULE'); setTimeout(() => calculatePoolRankings(selectedDrawEvent.id), 100); }} className="px-4 py-2 bg-[#bef264] hover:bg-[#a3e635] text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Lanjut ke Jadwal
                      </button>
                    </div>
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
                  <p className="text-xs text-slate-400">Klik tombol <span className="font-bold text-emerald-600">"Mulai Acak & Undi Pemain"</span> untuk memulai.</p>
                </div>
              )}
            </div>
          ) : activeView === 'SCHEDULE' ? (
            <div className="sm-schedule space-y-6">
              {selectedScheduleEvent && (
                <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
                  <h2 className="text-lg font-black text-slate-900 mb-1">JADWAL PERTANDINGAN</h2>
                  <h3 className="text-base font-bold text-slate-800 mb-1">{selectedScheduleEvent.nama?.toUpperCase()}</h3>
                  <p className="text-sm text-slate-600 font-semibold">{selectedScheduleEvent.tanggal}</p>
                </div>
              )}
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                  <Search className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-bold text-slate-700">Cari Pemain / Club:</span>
                </div>
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Ketik nama pemain atau club..." className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 text-sm" />
              </div>
              {selectedScheduleEvent && schedulePoolData && filteredScheduleRows.length > 0 ? (
                <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-2 border-slate-300">
                          <th className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-300">Pool</th>
                          <th className="py-2 px-3 text-center font-bold text-slate-700 border border-slate-300">Nama Pemain</th>
                          <th className="py-2 px-3 text-center font-bold text-slate-700 border border-slate-300">Club/PTM</th>
                          <th className="py-2 px-3 text-center font-bold text-slate-700 border border-slate-300">Match</th>
                          <th className="py-2 px-3 text-center font-bold text-slate-700 border border-slate-300">Jam Main</th>
                          <th className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-300">Meja</th>
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
                                <td colSpan="11" className="py-2 px-2 font-bold text-slate-900 border border-slate-300 text-left">
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
                                <td colSpan="11" className="border-0"></td>
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
                              <tr key={index} className={`hover:bg-slate-50 transition cursor-pointer ${hasResult ? 'bg-emerald-50/30' : ''}`} onClick={() => openLiveScore(row)}>
                                <td className="py-2 px-2 border border-slate-300 text-center font-bold text-slate-900">{row.playerCode}</td>
                                <td className="py-2 px-3 border border-slate-300 font-semibold text-slate-900">
                                  {row.player.nama}
                                  {(row.player.isSeed || row.player.seedRank) && (
                                    <span className="ml-1 text-amber-500" title={`Seed ${row.player.seedRank || row.player.isSeed}`}>★</span>
                                  )}
                                </td>
                                <td className="py-2 px-3 border border-slate-300 font-semibold text-slate-600">{row.player.ptm}</td>
                                <td className="py-2 px-3 border border-slate-300 text-center font-bold text-emerald-700">{row.matchLabel}</td>
                                <td className="py-2 px-3 border border-slate-300 text-center font-mono font-bold text-slate-700">{row.jam}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center font-bold text-slate-700">{row.meja}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center text-slate-600">{row.tanggal}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center text-slate-600">{row.hari}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center font-bold text-slate-700">{pointStr}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center font-bold text-emerald-700">{winnerName}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center">
                                  {keterangan && (<span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">{keterangan}</span>)}
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
                                <td className="py-2 px-2 border border-slate-300 text-center"></td>
                                <td className="py-2 px-2 border border-slate-300 text-center"></td>
                                <td className="py-2 px-2 border border-slate-300 text-center">
                                  {keterangan && (<span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">{keterangan}</span>)}
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
                <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-500 mb-1">Belum Ada Hasil Undian</h4>
                  <p className="text-xs text-slate-400 mb-4">Lakukan undian terlebih dahulu untuk membuat jadwal pertandingan.</p>
                  <button onClick={() => setActiveView('DRAW')} className="px-4 py-2 bg-[#bef264] hover:bg-[#a3e635] text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-sm">Buka Halaman Undian</button>
                </div>
              ) : null}
            </div>
          ) : activeView === 'KNOCKOUT' ? (
            <div className="sm-knockout space-y-5">
              {selectedKnockoutEvent && poolResults[selectedKnockoutEvent.id] ? (() => {
                const ko = buildKnockoutBracket(selectedKnockoutEvent.id);
                const divisi = selectedKnockoutEvent.divisiList?.[0]?.nama || '-';
                const roundName = (idx) => {
                  const playerCount = ko.rounds[idx]?.length * 2;
                  if (playerCount === 2) return 'FINAL';
                  if (playerCount === 4) return 'SEMIFINAL';
                  return `${playerCount} BESAR`;
                };
                const finalMatch = ko.rounds[ko.rounds.length - 1]?.[0];
                const finalResult = finalMatch ? knockoutResults[`${selectedKnockoutEvent.id}_${finalMatch.id}`] : null;
                const runnerUp = finalResult?.winner === 'player1' ? finalMatch?.player2 : finalResult?.winner === 'player2' ? finalMatch?.player1 : null;
                const semiRound = ko.rounds.length >= 2 ? ko.rounds[ko.rounds.length - 2] : [];
                const bronze = semiRound.map(m => {
                  const r = knockoutResults[`${selectedKnockoutEvent.id}_${m.id}`];
                  if (!r?.winner) return null;
                  return r.winner === 'player1' ? m.player2 : m.player1;
                }).filter(Boolean);

                const baseMatchH = 82;
                const baseGap = 18;
                const unit = baseMatchH + baseGap;

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
                      <h1 className="text-xl font-black text-slate-950 uppercase">{selectedKnockoutEvent.nama}</h1>
                      <div className="mt-1 text-xs font-bold text-slate-500">
                        DIVISI: {divisi} • {selectedKnockoutEvent.tanggal}
                      </div>
                    </div>

                    <div id="spinmatch-knockout-print" className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto p-6">
                      {(() => {
                        /*
                          v9.5 - Struktur yang diminta:
                          ATAS  : A (seed/bye) menunggu winner B-C.
                                  Winner [A vs winner B-C] melawan winner D-E.
                          BAWAH : winner F-G melawan [winner H-I vs J (seed/bye)].
                          FINAL : winner bagian atas vs winner bagian bawah.
                          BYE tidak ditulis.
                          "Juara Pool X" / nama pemenang Pool berada DI ATAS garis.
                        */
                        const entrants = getKnockoutEntrants(selectedKnockoutEvent.id);
                        const byPool = {};
                        entrants.forEach(p => { byPool[p.sourcePool] = p; });

                        const poolNames = Object.keys(byPool).sort((a,b)=>{
                          const aa=a.replace(/^Pool\s+/i,'');
                          const bb=b.replace(/^Pool\s+/i,'');
                          return aa.localeCompare(bb,undefined,{numeric:true});
                        });

                        // Model ini dipakai khusus ketika terdapat 10 qualifier Pool:
                        // A,B,C,D,E,F,G,H,I,J dengan 2 seeded pada A dan J.
                        if (poolNames.length !== 10) {
                          return (
                            <div className="p-8 text-center text-sm font-bold text-slate-500">
                              Model bracket A–J ini memerlukan 10 Juara Pool.
                            </div>
                          );
                        }

                        const poolSlots = poolNames.map(n=>byPool[n]);
                        const [poolA,poolB,poolC,poolD,poolE,poolF,poolG,poolH,poolI,poolJ] = poolSlots;
                        const eventId = selectedKnockoutEvent.id;

                        const makeMatch = (id, player1, player2, orderIndex, matchRef) => ({
                          id, round: 1, player1, player2, matchRef,
                          ...getKnockoutMatchMeta(eventId, orderIndex)
                        });
                        const winnerOf = (m) => getKOWinner(eventId, m.id, m.player1, m.player2);

                        // Struktur tetap: A menunggu B-C; J menunggu H-I.
                        const mBC   = makeMatch('KO10_BC',   poolB, poolC, 0, 'B-C');
                        const mDE   = makeMatch('KO10_DE',   poolD, poolE, 1, 'D-E');
                        const mFG   = makeMatch('KO10_FG',   poolF, poolG, 2, 'F-G');
                        const mHI   = makeMatch('KO10_HI',   poolH, poolI, 3, 'H-I');

                        const wBC = winnerOf(mBC);
                        const wDE = winnerOf(mDE);
                        const wFG = winnerOf(mFG);
                        const wHI = winnerOf(mHI);

                        const mABC  = makeMatch('KO10_A_BC', poolA, wBC, 4, 'A / Pemenang B-C');
                        const mHIJ  = makeMatch('KO10_HI_J', wHI, poolJ, 5, 'Pemenang H-I / J');

                        const wABC = winnerOf(mABC);
                        const wHIJ = winnerOf(mHIJ);

                        const mTOP = makeMatch('KO10_TOP', wABC, wDE, 6, 'Semifinal Atas');
                        const mBOT = makeMatch('KO10_BOT', wFG, wHIJ, 7, 'Semifinal Bawah');

                        const wTOP = winnerOf(mTOP);
                        const wBOT = winnerOf(mBOT);
                        const mFINAL = makeMatch('KO10_FINAL', wTOP, wBOT, 8, 'FINAL');
                        const champion10 = winnerOf(mFINAL);

                        const canvasW=900, canvasH=520;
                        const x0=20;
                        const segmentLen=120;
                        const x1=x0+segmentLen;
                        const x2=x0+(segmentLen*2);
                        const x3=x0+(segmentLen*3);
                        const x4=x0+(segmentLen*4);
                        const x5=x0+(segmentLen*5);
                        const ys=[35,80,125,185,230,300,345,405,450,495];

                        const yBC=(ys[1]+ys[2])/2;
                        const yABC=(ys[0]+yBC)/2;
                        const yDE=(ys[3]+ys[4])/2;
                        const yTOP=(yABC+yDE)/2;
                        const yFG=(ys[5]+ys[6])/2;
                        const yHI=(ys[7]+ys[8])/2;
                        const yHIJ=(yHI+ys[9])/2;
                        const yBOT=(yFG+yHIJ)/2;
                        const yFINAL=(yTOP+yBOT)/2;

                        const lines=[];
                        const hline=(key,xa,ya,xb)=>lines.push(<line key={key} x1={xa} y1={ya} x2={xb} y2={ya}/>);
                        const vline=(key,x,ya,yb)=>lines.push(<line key={key} x1={x} y1={ya} x2={x} y2={yb}/>);

                        hline('A',x0,ys[0],x2);
                        hline('B',x0,ys[1],x1); hline('C',x0,ys[2],x1);
                        vline('BCv',x1,ys[1],ys[2]); hline('BCo',x1,yBC,x2);
                        vline('ABCv',x2,ys[0],yBC); hline('ABCo',x2,yABC,x3);

                        hline('D',x0,ys[3],x1); hline('E',x0,ys[4],x1);
                        vline('DEv',x1,ys[3],ys[4]); hline('DEo',x1,yDE,x3);
                        vline('TOPv',x3,yABC,yDE); hline('TOPo',x3,yTOP,x4);

                        hline('F',x0,ys[5],x1); hline('G',x0,ys[6],x1);
                        vline('FGv',x1,ys[5],ys[6]); hline('FGo',x1,yFG,x3);

                        hline('H',x0,ys[7],x1); hline('I',x0,ys[8],x1);
                        vline('HIv',x1,ys[7],ys[8]); hline('HIo',x1,yHI,x2);

                        hline('J',x0,ys[9],x2);
                        vline('HIJv',x2,yHI,ys[9]); hline('HIJo',x2,yHIJ,x3);
                        vline('BOTv',x3,yFG,yHIJ); hline('BOTo',x3,yBOT,x4);
                        vline('FINALv',x4,yTOP,yBOT); hline('FINALo',x4,yFINAL,x5);

                        const labels=[poolA,poolB,poolC,poolD,poolE,poolF,poolG,poolH,poolI,poolJ];

                        const playerLabel = (p, left, top, width=112) => {
                          if (!p) return null;
                          return (
                            <div className="absolute leading-tight" style={{left:`${left}px`,top:`${top}px`,width:`${width}px`}}>
                              <div className={`whitespace-nowrap text-[10px] font-black ${p.isPlaceholder?'text-slate-500':'text-slate-950'}`}>
                                {p.nama}{p.seedRank ? <span className="ml-1 text-amber-500">★{p.seedRank}</span>:null}
                              </div>
                              {!p.isPlaceholder && <div className="truncate text-[8px] font-bold text-slate-500">{p.ptm || 'PTM/CLUB -'}</div>}
                            </div>
                          );
                        };

                        const matchButton = (m, left, top, width=112) => {
                          const ready = Boolean(m?.player1 && m?.player2 && !m.player1.isPlaceholder && !m.player2.isPlaceholder);
                          const winner = ready ? winnerOf(m) : null;
                          return (
                            <button
                              type="button"
                              disabled={!ready}
                              onClick={() => ready && openKnockoutLiveScore(m)}
                              className={`absolute text-left leading-tight rounded px-1 py-0.5 transition
                                ${ready ? 'cursor-pointer hover:bg-lime-100/80 hover:ring-1 hover:ring-lime-400' : 'cursor-default'}
                              `}
                              style={{left:`${left}px`,top:`${top}px`,width:`${width}px`}}
                              title={ready ? `Klik untuk Live Skor • ${m.jam} • ${m.meja}` : 'Menunggu pemain'}
                            >
                              <div className={`truncate text-[9px] font-black ${winner?'text-emerald-700':'text-slate-500'}`}>
                                {winner?.nama || 'Pemenang'}
                              </div>
                              {winner && <div className="truncate text-[8px] font-bold text-slate-500">{winner.ptm || 'PTM/CLUB -'}</div>}
                              <div className="truncate text-[8px] font-bold text-sky-700">{m.jam} • {m.meja}</div>
                            </button>
                          );
                        };

                        return (
                          <div className="min-w-max">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <div className="knockout-draw-meta ml-[10px] flex items-center gap-1.5 text-[9px] font-black text-slate-600">
                                <span className="rounded bg-slate-100 px-1.5 py-0.5">DRAW {ko.bracketSize}</span>
                                <span className="rounded bg-slate-100 px-1.5 py-0.5">Slot kosong internal: {ko.byeCount}</span>
                              </div>
                              <div className="knockout-screen-only ml-auto inline-flex w-fit flex-col rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-left text-[9px] font-bold leading-tight text-slate-500 shadow-sm">
                                <span>Klik pertandingan yang kedua pemainnya sudah tersedia</span>
                                <span>untuk membuka Live Skor.</span>
                              </div>
                            </div>
                            <div className="relative" style={{width:`${canvasW}px`,height:`${canvasH}px`}}>
                              <svg className="absolute inset-0" width={canvasW} height={canvasH}>
                                <g fill="none" stroke="#334155" strokeWidth="1.35" shapeRendering="crispEdges">{lines}</g>
                              </svg>

                              {labels.map((p,i)=>(
                                <div key={p.sourcePool}
                                  className="absolute left-[20px] leading-tight"
                                  style={{top:`${ys[i]-30}px`,width:'165px'}}>
                                  <div className={`truncate text-[10px] font-black ${p.isPlaceholder?'text-slate-500':'text-slate-950'}`}>
                                    {p.nama}{p.seedRank ? <span className="ml-1 text-amber-500">★{p.seedRank}</span>:null}
                                  </div>
                                  {!p.isPlaceholder && <div className="truncate text-[8px] font-bold text-slate-500">{p.ptm || 'PTM/CLUB -'}</div>}
                                </div>
                              ))}

                              {matchButton(mBC,  x1+4, yBC-29, 112)}
                              {matchButton(mABC, x2+4, yABC-29, 112)}
                              {matchButton(mDE,  x1+4, yDE-29, 112)}
                              {matchButton(mTOP, x3+4, yTOP-29, 112)}

                              {matchButton(mFG,  x1+4, yFG-29, 112)}
                              {matchButton(mHI,  x1+4, yHI-29, 112)}
                              {matchButton(mHIJ, x2+4, yHIJ-29, 112)}
                              {matchButton(mBOT, x3+4, yBOT-29, 112)}

                              {matchButton(mFINAL, x4+4, yFINAL-29, 128)}
                              {champion10 && playerLabel(champion10, x5+4, yFINAL-29, 120)}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                        <div className="text-[10px] font-black text-amber-700">JUARA 1</div>
                        <div className="font-black">{ko.champion?.nama || '-'}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                        <div className="text-[10px] font-black text-slate-500">JUARA 2</div>
                        <div className="font-black">{runnerUp?.nama || '-'}</div>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                        <div className="text-[10px] font-black text-orange-700">JUARA 3 BERSAMA</div>
                        <div className="font-black text-xs">{bronze.length ? bronze.map(p=>p.nama).join(' & ') : '-'}</div>
                      </div>
                      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4">
                        <div className="text-[10px] font-black text-sky-700">8 BESAR • TENTATIVE</div>
                        <div className="font-bold text-xs">Mengikuti hasil bracket</div>
                      </div>
                    </div>
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
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Radio className="w-5 h-5 text-red-600" />
                        <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Live Skor</span>
                      </div>
                      <h2 className="text-xl font-black text-slate-900">{selectedLiveEvent.nama}</h2>
                      <p className="text-xs text-slate-600 mt-1">{selectedLiveEvent.tanggal}</p>
                    </div>
                    <div className="flex items-center gap-3">
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
                  <div className="p-4 bg-slate-50 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Radio className="w-4 h-4 text-red-500" /> Pilih Match untuk Input Skor
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Klik pada baris match untuk membuka form Live Skor</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-2 border-slate-300">
                          <th className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-300">Pool</th>
                          <th className="py-2 px-3 text-center font-bold text-slate-700 border border-slate-300">Nama Pemain</th>
                          <th className="py-2 px-3 text-center font-bold text-slate-700 border border-slate-300">Club/PTM</th>
                          <th className="py-2 px-3 text-center font-bold text-slate-700 border border-slate-300">Match</th>
                          <th className="py-2 px-3 text-center font-bold text-slate-700 border border-slate-300">Jam Main</th>
                          <th className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-300">Meja</th>
                          <th className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-300">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {liveScoreRows.map((row, index) => {
                          if (row.type === 'pool_header') {
                            return (
                              <tr key={index} className="bg-slate-50">
                                <td colSpan="7" className="py-2 px-2 font-bold text-slate-900 border border-slate-300 text-left">{row.pool}</td>
                              </tr>
                            );
                          } else if (row.type === 'empty_row') {
                            return (
                              <tr key={index} className="h-4">
                                <td colSpan="7" className="border-0"></td>
                              </tr>
                            );
                          } else if (row.type === 'player' && row.showMatch) {
                            const hasResult = row.result !== null;
                            const statusLabel = hasResult ? '✓ Selesai' : '⏳ Belum';
                            const statusColor = hasResult ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
                            return (
                              <tr key={index} className={`hover:bg-slate-50 transition cursor-pointer ${hasResult ? 'bg-emerald-50/30' : ''}`} onClick={() => openLiveScore(row)}>
                                <td className="py-2 px-2 border border-slate-300 text-center font-bold text-slate-900">{row.playerCode}</td>
                                <td className="py-2 px-3 border border-slate-300 font-semibold text-slate-900">
                                  {row.player.nama}
                                  {(row.player.isSeed || row.player.seedRank) && (
                                    <span className="ml-1 text-amber-500" title={`Seed ${row.player.seedRank || row.player.isSeed}`}>★</span>
                                  )}
                                </td>
                                <td className="py-2 px-3 border border-slate-300 font-semibold text-slate-600">{row.player.ptm}</td>
                                <td className="py-2 px-3 border border-slate-300 text-center font-bold text-emerald-700">{row.matchLabel}</td>
                                <td className="py-2 px-3 border border-slate-300 text-center font-mono font-bold text-slate-700">{row.jam}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center font-bold text-slate-700">{row.meja}</td>
                                <td className="py-2 px-2 border border-slate-300 text-center">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${statusColor}`}>{statusLabel}</span>
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
                  <button onClick={() => setActiveView('DRAW')} className="px-4 py-2 bg-[#bef264] hover:bg-[#a3e635] text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-sm">Buka Halaman Undian</button>
                </div>
              ) : null}
            </div>
          ) : activeView === 'RANKING' ? (
            <div className="mx-auto w-full max-w-[1500px] space-y-4">
              <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,.05)]">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                  {rankingMode === 'EVENT' && (
                    <div className="min-w-0 flex-1">
                      <label className="mb-1 block text-[10px] font-black uppercase tracking-wide text-slate-400">Pilih Event</label>
                      <select
                        value={selectedEventIdForRanking}
                        onChange={(e) => { setSelectedEventIdForRanking(e.target.value); setSelectedDivisionForRanking(''); }}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold outline-none focus:border-blue-500"
                      >
                        {events.map(ev => <option key={ev.id} value={ev.id}>{ev.nama} • {ev.tanggal}</option>)}
                      </select>
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-wide text-slate-400">Pilih Divisi</label>
                    <select
                      value={effectiveRankingDivision}
                      onChange={(e) => setSelectedDivisionForRanking(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold outline-none focus:border-blue-500"
                    >
                      {rankingDivisionOptions.length === 0
                        ? <option value="">Belum ada divisi</option>
                        : rankingDivisionOptions.map(div => <option key={div} value={div}>{div}</option>)}
                    </select>
                  </div>

                  <div className="rounded-xl bg-blue-50 px-4 py-2.5">
                    <div className="text-[9px] font-black uppercase text-blue-500">Mode</div>
                    <div className="text-xs font-black text-[#0a3971]">
                      {rankingMode === 'EVENT' ? 'Event Tertentu' : 'Seluruh Event SpinMatch'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,.05)]">
                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{effectiveRankingDivision || 'Pilih Divisi'}</h3>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {rankingMode === 'EVENT'
                        ? selectedRankingEvent?.nama || '-'
                        : 'Akumulasi seluruh event yang menggunakan SpinMatch'}
                    </p>
                  </div>
                  <div className="rounded-full bg-[#071b3b] px-3 py-1.5 text-[9px] font-black text-white">
                    {rankingRows.length} Pemain
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px]">
                    <thead className="bg-slate-50 text-[9px] uppercase tracking-wide text-slate-400">
                      <tr>
                        <th className="px-5 py-3 text-left">Rank</th>
                        <th className="px-4 py-3 text-left">Pemain</th>
                        <th className="px-4 py-3 text-left">PTM / Club</th>
                        {rankingMode === 'GLOBAL' && <th className="px-4 py-3 text-center">Event</th>}
                        <th className="px-4 py-3 text-center">Main</th>
                        <th className="px-4 py-3 text-center">Menang</th>
                        <th className="px-4 py-3 text-center">Kalah</th>
                        <th className="px-5 py-3 text-right">Poin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rankingRows.length === 0 ? (
                        <tr><td colSpan="8" className="px-5 py-14 text-center text-xs font-bold text-slate-400">Belum ada hasil pertandingan untuk divisi ini.</td></tr>
                      ) : rankingRows.map(row => (
                        <tr key={`${row.id || row.nama}-${row.rank}`} className="hover:bg-slate-50">
                          <td className="px-5 py-3">
                            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black ${
                              row.rank === 1 ? 'bg-amber-100 text-amber-700' :
                              row.rank === 2 ? 'bg-slate-200 text-slate-700' :
                              row.rank === 3 ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-50 text-blue-700'
                            }`}>{row.rank}</span>
                          </td>
                          <td className="px-4 py-3 text-xs font-black text-slate-900">{row.nama}</td>
                          <td className="px-4 py-3 text-[10px] font-semibold text-slate-500">{row.ptm}</td>
                          {rankingMode === 'GLOBAL' && <td className="px-4 py-3 text-center text-xs font-bold">{row.eventCount}</td>}
                          <td className="px-4 py-3 text-center text-xs font-bold">{row.main}</td>
                          <td className="px-4 py-3 text-center text-xs font-black text-emerald-600">{row.menang}</td>
                          <td className="px-4 py-3 text-center text-xs font-black text-rose-500">{row.kalah}</td>
                          <td className="px-5 py-3 text-right text-sm font-black text-[#0a3971]">{row.poin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-[9px] font-semibold text-slate-400">
                  Rumus sementara: menang = 3 poin, kalah = 0 poin. Rumus dapat diubah kemudian tanpa mengubah struktur halaman.
                </div>
              </div>
            </div>

          ) : activeView === 'SETTINGS' ? (
            <div className="mx-auto w-full max-w-[1500px] space-y-4">
              {!selectedSettingsEvent ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm font-bold text-slate-400">Belum ada event.</div>
              ) : settingsSection === 'HOME' ? (
                <>
                  <div className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,.05)]">
                    <div className="text-[10px] font-black uppercase tracking-wide text-slate-400">Event yang diatur</div>
                    <div className="mt-1 text-lg font-black text-slate-950">{selectedSettingsEvent.nama}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-400">{selectedSettingsEvent.tanggal}</div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
                  </div>
                </>
              ) : settingsSection === 'REFEREE' ? (
                <div className="space-y-4">
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
                      <p className="mt-1 text-[9px] font-semibold text-slate-400">Pilih wasit aktif dari Master Wasit SpinMatch. Status tugas berubah otomatis: MENUNGGU → BERTUGAS saat skor mulai diinput → SIAP setelah hasil final disimpan.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[760px]">
                        <thead className="bg-slate-50 text-[9px] font-black uppercase tracking-wide text-slate-400">
                          <tr><th className="px-5 py-3 text-left">Meja</th><th className="px-4 py-3 text-left">ID Wasit</th><th className="px-4 py-3 text-left">Nama Wasit</th><th className="px-4 py-3 text-center">Status Akun</th><th className="px-4 py-3 text-center">Status Tugas</th><th className="px-5 py-3 text-right">Aksi</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {Array.from({ length: settingsTableCount }, (_, i) => i + 1).map(no => {
                            const a = currentRefereeAssignments[String(no)] || {};
                            const registered = refereeRegistry.find(r => r.id === a.refereeId);
                            const hasValidAssignment = !!registered;
                            const status = registered?.status || '';
                            const workStatus = getRefereeWorkStatus(no, a);
                            return (
                              <tr key={no} className="hover:bg-slate-50/70">
                                <td className="px-5 py-4"><span className="inline-flex h-8 min-w-8 items-center justify-center rounded-xl bg-[#071b3b] px-2 text-[10px] font-black text-white">{no}</span></td>
                                <td className="px-4 py-4">
                                  <select value={hasValidAssignment ? registered.id : ''} onChange={e => assignRegisteredReferee(no, e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-black text-slate-800 outline-none focus:border-blue-500">
                                    <option value="">Belum Ditugaskan</option>
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
                                  {hasValidAssignment && <button onClick={() => assignRegisteredReferee(no, '')} className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-1.5 text-[8px] font-black text-rose-600">Batalkan Tugas</button>}
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

      {/* LIVE SCORE MODAL */}
      {liveScoreMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-0 backdrop-blur-md sm:p-3">
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
                      <Radio className="h-3.5 w-3.5 animate-pulse" /> Live Skor
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
                  <button
                    type="button"
                    onClick={toggleVoiceRecognition}
                    className={`rounded-full p-2 transition shadow-lg sm:p-2.5 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-black/30 backdrop-blur-sm border-2 border-white/40 text-white hover:bg-black/50'}`}
                    title={isListening ? "Mendengarkan... Klik untuk stop" : "Aktifkan Input Suara"}
                  >
                    {isListening ? (
                      <span className="text-[10px] font-black px-1">ON</span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                        <line x1="12" x2="12" y1="19" y2="22"/>
                      </svg>
                    )}
                  </button>
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
    .spinmatch-live-compact {
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
    .spinmatch-signature-popup {
      align-items: flex-start !important;
      overflow-y: auto !important;
      padding: 8px !important;
    }
    .spinmatch-signature-popup-card {
      margin: auto 0 !important;
      padding: 10px !important;
    }
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

              {showLiveSignatures && (
                <div className="spinmatch-signature-popup fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
                     onMouseDown={(e) => { if (e.target === e.currentTarget) setShowLiveSignatures(false); }}>
                  <div className="spinmatch-signature-popup-card w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
                       onMouseDown={(e) => e.stopPropagation()}>
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-black text-slate-900">Tanda Tangan Pertandingan</div>
                        <div className="text-[10px] font-medium text-slate-500">Pemenang, pemain kalah, dan wasit.</div>
                      </div>
                      <button type="button" onClick={() => setShowLiveSignatures(false)}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600 hover:bg-slate-200">✕</button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <div className="mb-1 text-center text-[10px] font-black text-emerald-700">
                          Pemenang: {automaticWinnerPlayer?.nama || '-'}
                        </div>
                        <SignaturePad label="Pemenang" value={signatureWinner} onChange={setSignatureWinner} />
                      </div>
                      <div>
                        <div className="mb-1 text-center text-[10px] font-black text-slate-700">
                          Pemain Kalah: {automaticLoserPlayer?.nama || '-'}
                        </div>
                        <SignaturePad label="Pemain Kalah" value={signatureLoser} onChange={setSignatureLoser} />
                      </div>
                      <div>
                        <div className="mb-1 text-center text-[10px] font-black text-blue-700">Wasit</div>
                        <SignaturePad label="Wasit" value={signatureReferee} onChange={setSignatureReferee} />
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button type="button" onClick={() => setShowLiveSignatures(false)}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-[10px] font-black text-white hover:bg-blue-700">
                        Selesai
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="spinmatch-live-footer sticky bottom-0 z-10 flex justify-center border-t border-slate-200 bg-white py-1.5">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button type="button" onClick={() => { if (typeof window !== 'undefined') { window.print(); } }} className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-[10px] font-black text-white shadow-sm transition hover:bg-emerald-600">
                    <Printer className="h-3.5 w-3.5" /> Print
                  </button>
                  <button type="button" onClick={handleDeleteMatch} className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-[10px] font-black text-white shadow-sm transition hover:bg-red-600">
                    <Trash2 className="h-3.5 w-3.5" /> Hapus Match
                  </button>
                  <button type="button" onClick={() => setShowLiveSignatures(true)} className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-black text-white shadow-sm transition hover:bg-blue-700">
                    ✍ Tanda Tangan
                  </button>
                  <button type="button" onClick={handleLiveScoreSubmit} className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-black text-white shadow-sm transition hover:bg-blue-700">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Simpan & Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <div className="bg-white w-full max-w-md rounded-[22px] p-4 shadow-2xl relative border border-slate-100">
            <button onClick={() => setShowRegModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <form onSubmit={handleAddParticipant} className="space-y-2.5">
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
                    <input type="text" inputMode="numeric" value={`${Number(regNilaiBayar || 0).toLocaleString('id-ID')},-`} onChange={(e) => setRegNilaiBayar(Number(String(e.target.value).replace(/\D/g, '')) || 0)} className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 font-mono font-normal" />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-2.5">
                <label className="mb-1 block text-[10px] font-black text-slate-600">Bukti Bayar</label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 bg-white px-3 py-2 text-[10px] font-black text-blue-700"><Upload className="h-4 w-4" />{regBuktiBayar ? 'Ganti Foto Bukti Bayar' : 'Upload Foto Bukti Bayar'}<input type="file" accept="image/*" className="hidden" onChange={(e)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setRegBuktiBayar(String(r.result||''));r.readAsDataURL(f);}} /></label>
                {regBuktiBayar && <img src={regBuktiBayar} alt="Bukti bayar" className="mt-2 h-16 w-full rounded-lg border object-cover" />}
                <p className="mt-1 text-[9px] text-slate-400">Status Bayar dikonfirmasi oleh EO.</p>
              </div>
              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 mt-3">
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
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
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
                    <input type="date" required value={formSingleDate ? new Date(formSingleDate).toISOString().split('T')[0] : ''} onChange={(e) => { const date = new Date(e.target.value); const formatted = `${date.getDate()} ${date.toLocaleString('id-ID', { month: 'short' })} ${date.getFullYear()}`; setFormSingleDate(formatted); }} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-slate-800 text-sm" />
                    <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input type="date" required value={formStartDate ? new Date(formStartDate).toISOString().split('T')[0] : ''} onChange={(e) => { const date = new Date(e.target.value); const formatted = `${date.getDate()} ${date.toLocaleString('id-ID', { month: 'short' })} ${date.getFullYear()}`; setFormStartDate(formatted); }} placeholder="Mulai" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm" />
                      <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <input type="date" required value={formEndDate ? new Date(formEndDate).toISOString().split('T')[0] : ''} onChange={(e) => { const date = new Date(e.target.value); const formatted = `${date.getDate()} ${date.toLocaleString('id-ID', { month: 'short' })} ${date.getFullYear()}`; setFormEndDate(formatted); }} placeholder="Selesai" className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm" />
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

        .sm-participant-table thead tr { background:linear-gradient(90deg,#073a72 0%,#0874c9 58%,#1598e8 100%) !important; color:#fff !important; }
        .sm-participant-table thead th { color:#fff !important; }
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

          .sm-registration, .sm-draw, .sm-schedule, .sm-live, .sm-knockout { margin-top: 12px !important; gap: 12px !important; }
          .sm-registration > div, .sm-draw > div, .sm-schedule > div, .sm-live > div, .sm-knockout > div { border-radius: 22px !important; }
          .sm-registration > div { padding: 14px !important; }
          .sm-registration h3 { font-size: 15px !important; line-height: 1.25 !important; }
          .sm-registration h3 + p { font-size: 9px !important; margin-top: 3px !important; }
          .sm-registration > div > div:first-child { margin-bottom: 10px !important; gap: 8px !important; }
          .sm-registration > div > div:first-child > div:last-child { display:grid !important; grid-template-columns:1fr 1fr !important; width:100% !important; gap:7px !important; }
          .sm-registration > div > div:first-child > div:last-child > * { min-height:30px !important; padding:7px 9px !important; justify-content:center !important; border-radius:12px !important; font-size:10px !important; }
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


          /* DASHBOARD MOBILE FINAL COMPACT V3 */
          .sm-dashboard-mobile-title { display:flex !important; order:-1 !important; width:100% !important; min-height:46px !important; align-items:center !important; justify-content:center !important; margin:0 !important; padding:4px 10px !important; border-radius:20px !important; background:linear-gradient(180deg,#07579b 0%,#1688cf 38%,#bfe3f7 76%,#ffffff 100%) !important; box-shadow:0 7px 18px rgba(8,57,113,.10) !important; }
          .sm-dashboard-mobile-brand { display:flex !important; align-items:center !important; justify-content:flex-start !important; gap:8px !important; width:100% !important; padding:0 !important; }
          .sm-dashboard-mobile-brand img { width:34px !important; height:34px !important; border-radius:9px !important; object-fit:contain !important; background:#fff !important; box-shadow:0 4px 12px rgba(8,57,113,.12) !important; }
          .sm-dashboard-mobile-brand-name { font-size:10px !important; line-height:1 !important; font-weight:900 !important; color:#eaf7ff !important; letter-spacing:.02em !important; }
          .sm-dashboard-mobile-brand-page { margin-top:1px !important; font-family:"Arial Black","Segoe UI Black","Segoe UI",sans-serif !important; font-size:18px !important; line-height:.88 !important; font-weight:900 !important; letter-spacing:-.075em !important; color:#071b3b !important; transform:scaleX(.88) !important; transform-origin:left center !important; }
          .sm-event-browser-header, .sm-my-events-header { background:linear-gradient(90deg,#0a3971 0%,#0874c9 42%,#dcefff 78%,#ffffff 100%) !important; }
          .sm-event-browser-header h2, .sm-my-events-header h2 { color:#ffffff !important; text-shadow:0 1px 2px rgba(0,0,0,.12) !important; }
          .sm-event-browser-header p, .sm-my-events-header p { color:rgba(255,255,255,.86) !important; }
          .sm-event-browser-header button { background:rgba(255,255,255,.72) !important; color:#0a3971 !important; }
          .sm-dashboard-layout { display:flex !important; flex-direction:column !important; gap:6px !important; }
          .sm-dashboard-event-buttons { display:grid !important; grid-template-columns:1fr 1fr !important; gap:8px !important; order:0 !important; width:100% !important; }
          .sm-dashboard-event-buttons button { min-height:29px !important; border-radius:13px !important; display:flex !important; align-items:center !important; justify-content:center !important; gap:6px !important; font-size:10px !important; font-weight:900 !important; color:#fff !important; border:0 !important; box-shadow:0 5px 16px rgba(15,23,42,.06) !important; }
          .sm-btn-my-events { background:linear-gradient(135deg,#0a3971,#0874c9) !important; }
          .sm-btn-all-events { background:linear-gradient(135deg,#f97316,#fb923c) !important; }
          .sm-event-browser { width:100% !important; }
          .sm-dashboard-hero { order:2 !important; width:100% !important; margin:-3px auto 0 !important; border-radius:22px !important; }
          .sm-dashboard-hero-inner { min-height:0 !important; display:block !important; padding:4px 10px 5px !important; }
          .sm-dashboard-hero-copy { align-items:center !important; text-align:center !important; }
          .sm-dashboard-hero-copy > div:first-child { align-self:flex-start !important; margin-bottom:0 !important; }
          .sm-dashboard-hero-copy > div:first-child span { padding:4px 8px !important; font-size:8px !important; }
          .sm-dashboard-mobile-paddle { display:flex !important; position:relative !important; height:38px !important; width:100% !important; align-items:center !important; justify-content:center !important; margin:0 !important; }
          .sm-dashboard-mobile-paddle img { position:relative !important; z-index:2 !important; width:62px !important; height:34px !important; object-fit:contain !important; }
          .sm-dashboard-mobile-glow { position:absolute !important; z-index:1 !important; width:112px !important; height:36px !important; border-radius:999px !important; background:rgba(255,255,255,.45) !important; filter:blur(18px) !important; }
          .sm-dashboard-hero h1 { width:100% !important; max-width:none !important; text-align:center !important; font-size:14px !important; line-height:1.05 !important; margin-top:0 !important; }
          .sm-dashboard-hero-desc { display:none !important; }
          .sm-dashboard-hero-meta { margin-top:5px !important; justify-content:center !important; gap:4px !important; }
          .sm-dashboard-hero-meta > div { padding:4px 7px !important; border-radius:9px !important; font-size:8px !important; }
          .sm-dashboard-hero-meta > div:nth-child(2), .sm-dashboard-hero-meta > div:nth-child(3) { display:none !important; }
          .sm-dashboard-hero-actions { margin-top:6px !important; justify-content:center !important; gap:5px !important; }
          .sm-dashboard-hero-actions button { padding:6px 10px !important; border-radius:9px !important; font-size:9px !important; }
          .sm-dashboard-hero > div:last-child { padding-bottom:5px !important; }
          .sm-dashboard-stats { order:2 !important; grid-template-columns:repeat(4,minmax(0,1fr)) !important; gap:5px !important; }
          .sm-dashboard-stats > div { min-width:0 !important; height:36px !important; padding:3px 2px !important; border-radius:13px !important; display:flex !important; flex-direction:column !important; justify-content:center !important; text-align:center !important; }
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
          .sm-dashboard-quick { order:99 !important; padding:9px 10px !important; border-radius:19px !important; margin:-3px 0 0 !important; }
          .sm-dashboard-quick .mb-4 { margin-bottom:6px !important; }
          .sm-dashboard-quick p { display:none !important; }
          .sm-dashboard-quick .mx-auto.grid { gap:5px !important; }
          .sm-dashboard-quick .mx-auto.grid button { min-height:29px !important; height:29px !important; padding:3px 8px !important; border-radius:13px !important; font-size:9px !important; line-height:1 !important; }
          .sm-dashboard-quick .mx-auto.grid button svg { width:15px !important; height:15px !important; }
          .sm-new-event-btn { background:linear-gradient(135deg,#f8fbff 0%,#e7eef6 52%,#cbd8e6 100%) !important; color:#0a3971 !important; border:1px solid rgba(10,57,113,.16) !important; box-shadow:0 4px 12px rgba(10,57,113,.10) !important; }
          .sm-new-event-btn:hover { background:linear-gradient(135deg,#ffffff 0%,#edf4fa 52%,#d6e2ed 100%) !important; color:#0874c9 !important; }
          .spinmatch-main-content { padding-bottom:8px !important; }
          /* hero pingpong glow: cahaya putih/cyan lembut di belakang gambar */
          img[src*=\"hero-pingpong\"] { filter: drop-shadow(0 0 10px rgba(255,255,255,.95)) drop-shadow(0 0 24px rgba(125,211,252,.75)) drop-shadow(0 0 42px rgba(255,255,255,.38)) !important; }
        }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}