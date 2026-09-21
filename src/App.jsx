import { supabase } from './lib/supabaseClient'
import React, { useState, useEffect, useRef } from 'react';
import logoSpinMatch from './assets/logo-spinmatch.png';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { LiveTables } from './components/LiveTables';
import { LoginPage } from './components/LoginPage';
import * as XLSX from 'xlsx';
import {
  Trophy, Users, Activity, DollarSign, Plus, X, Trash2, Edit3,
  ArrowLeft, Upload, FileSpreadsheet, UserPlus, Filter, Shuffle,
  Settings, ChevronDown, Pencil, Wallet, Play, RotateCcw,
  Crown, Medal, Sparkles, Target, Dices, CheckCircle2, Calendar,
  Printer, Search, FileText, Radio
} from 'lucide-react';

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

  // ============================================
  // SEMUA HOOKS HARUS DI SINI (SEBELUM RETURN APAPUN)
  // ============================================
  
  const [activeView, setActiveView] = useState('DASHBOARD');
  const [selectedEventIdForReg, setSelectedEventIdForReg] = useState('');
  const [selectedEventIdForDraw, setSelectedEventIdForDraw] = useState('');
  const [selectedEventIdForSchedule, setSelectedEventIdForSchedule] = useState('');
  const [selectedEventIdForLive, setSelectedEventIdForLive] = useState('');
  const [selectedEventIdForKnockout, setSelectedEventIdForKnockout] = useState('');

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
    metodePengundian: row.metodeundian || 'PER_DIVISI',
    divisiList: Array.isArray(row.divisilist) ? row.divisilist : []
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
  }, [user, activeView, events, selectedEventIdForReg, selectedEventIdForDraw, selectedEventIdForSchedule, selectedEventIdForLive, selectedEventIdForKnockout]);

  useEffect(() => {
    if (!selectedScheduleEvent?.id || !poolResults[selectedScheduleEvent.id]) return;

    // Perbarui ulang status Lolos sesuai aturan Event aktif.
    // Tidak mengubah skor/match; hanya ranking/keterangan.
    calculatePoolRankings(selectedScheduleEvent.id);
  }, [selectedScheduleEvent?.id, matchResults, poolResults]);

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
    setMetodePengundian('PER_DIVISI');
    setDivisiList([]);
    setActiveDivisiTab(null);
    setSelectedDivisiForConfig(null);
    setShowModal(true);
  };

  const handleRowClick = (eventItem) => {
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
    let formattedTanggal = isMultiDate
      ? `Dari Tanggal ${formStartDate} sd ${formEndDate}`
      : (formSingleDate || '21 Sep 2026');

    if (isEditMode && selectedEventIdForReg) {
      const eventId = Number(selectedEventIdForReg);
      const currentEvent = events.find(ev => Number(ev.id) === eventId);
      if (!currentEvent) return;

      const updatedEvent = {
        ...currentEvent,
        nama: formNama,
        tanggal: formattedTanggal,
        status: formStatus,
        durasiMatch,
        jamMulai,
        jamSelesai,
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
        metodePengundian,
        divisiList
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
    const maxMeja = 4;
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

  const totalEventAktif = events.filter(e => e.status === 'Aktif').length;
  const totalPeserta = events.reduce((sum, e) => sum + e.peserta, 0);
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

  return (
    <div className="spinmatch-app flex h-[100dvh] bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <div className="hidden h-screen sticky top-0 shrink-0 md:block">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
      </div>

      <main className="min-w-0 flex-1 flex flex-col h-[100dvh] overflow-hidden">
        <div className="spinmatch-page-head shrink-0 bg-slate-50 px-3 pt-3 pb-2 z-10 border-b border-slate-200/60 shadow-xs sm:px-5 sm:pt-5 md:px-8 md:pt-8 md:pb-4">
          <div className="hidden md:block"><Header /></div>

          {activeView === 'REGISTRATION' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={() => setActiveView('DASHBOARD')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer text-slate-700" title="Kembali ke Dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Manajemen Peserta</h2>
                  <p className="text-xs text-slate-400">Kelola data peserta turnamen</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-600">Pilih Event:</span>
                  <select value={selectedEventIdForReg} onChange={(e) => setSelectedEventIdForReg(e.target.value)} className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer">
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
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={() => setActiveView('DASHBOARD')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer text-slate-700" title="Kembali ke Dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Dices className="w-5 h-5 text-emerald-600" /> Undian Peserta
                  </h2>
                  <p className="text-xs text-slate-400">Acak pemain ke dalam pool secara adil</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-600">Pilih Event:</span>
                  <select value={selectedEventIdForDraw} onChange={(e) => setSelectedEventIdForDraw(e.target.value)} className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer">
                    {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.nama} ({ev.tanggal})</option>))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeView === 'SCHEDULE' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={() => setActiveView('DASHBOARD')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer text-slate-700" title="Kembali ke Dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" /> Jadwal Pertandingan
                  </h2>
                  <p className="text-xs text-slate-400">Jadwal match berdasarkan hasil undian pool</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-600">Pilih Event:</span>
                  <select value={selectedEventIdForSchedule} onChange={(e) => setSelectedEventIdForSchedule(e.target.value)} className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer">
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
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveView('DASHBOARD')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Knockout</h2>
                  <p className="text-xs text-slate-400">Bagan gugur • klik Match untuk Live Score</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-600">Pilih Event:</span>
                  <select value={selectedEventIdForKnockout} onChange={(e)=>setSelectedEventIdForKnockout(e.target.value)} className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none">
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
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button onClick={() => setActiveView('DASHBOARD')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer text-slate-700" title="Kembali ke Dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-red-600" /> Live Skor Pertandingan
                  </h2>
                  <p className="text-xs text-slate-400">Input skor real-time untuk dilihat publik</p>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-600">Pilih Event:</span>
                  <select value={selectedEventIdForLive} onChange={(e) => setSelectedEventIdForLive(e.target.value)} className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer">
                    {events.map((ev) => (<option key={ev.id} value={ev.id}>{ev.nama} ({ev.tanggal})</option>))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="spinmatch-main-content flex-1 overflow-y-auto overflow-x-hidden px-3 pb-24 pt-3 sm:px-5 sm:pt-4 md:p-8 md:pt-6 md:pb-8">
          {activeView === 'DASHBOARD' ? (
            <>
              {/* =========================================================
                  SPINMATCH LIVE TOURNAMENT DASHBOARD
                  Mobile-first: hero event + compact stats + menu cepat
              ========================================================== */}
              <div className="space-y-3 md:space-y-5 mb-4 md:mb-7">

                {/* HERO EVENT AKTIF */}
                <div className="relative overflow-hidden rounded-[24px] md:rounded-[30px] bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#0f2740] text-white shadow-[0_16px_40px_rgba(6,78,59,0.20)]">
                  <div className="absolute -right-12 -top-16 w-44 h-44 rounded-full bg-emerald-300/10 blur-2xl" />
                  <div className="absolute -left-16 -bottom-20 w-52 h-52 rounded-full bg-cyan-300/10 blur-3xl" />

                  <div className="relative p-4 sm:p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-300 px-3 py-1 text-[10px] md:text-xs font-black uppercase tracking-wide text-emerald-950 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
                          Event Aktif
                        </span>

                        <h2 className="mt-3 text-[20px] sm:text-2xl md:text-3xl font-black leading-tight tracking-tight truncate">
                          {(events.find(e => e.status === 'Aktif') || events[0])?.nama || 'Belum Ada Event Aktif'}
                        </h2>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] sm:text-xs md:text-sm text-emerald-50/90">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-emerald-300" />
                            {(events.find(e => e.status === 'Aktif') || events[0])?.tanggal || 'Tanggal belum ditentukan'}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-emerald-300" />
                            {((events.find(e => e.status === 'Aktif') || events[0])?.id
                              ? (participants[(events.find(e => e.status === 'Aktif') || events[0]).id] || []).length
                              : 0)} Peserta
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Trophy className="w-4 h-4 text-emerald-300" />
                            {(events.find(e => e.status === 'Aktif') || events[0])?.jumlahMeja || 0} Meja
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl bg-white/95 p-1.5 shadow-lg ring-1 ring-white/30">
                        <img src={logoSpinMatch} alt="SpinMatch" className="w-full h-full object-contain rounded-xl" />
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-emerald-50/80">
                        <span>Turnamen siap dikelola</span>
                        <span>{totalPeserta} peserta terdaftar</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/15 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-lime-300 transition-all"
                          style={{ width: `${Math.min(100, Math.max(8, totalPeserta > 0 ? 65 : 8))}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* STATISTIK COMPACT */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
                  <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-3.5 md:p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Trophy className="w-4.5 h-4.5 text-emerald-700" />
                      </div>
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-emerald-600">Event</span>
                    </div>
                    <div className="mt-2 text-2xl md:text-3xl font-black text-slate-950 leading-none">
                      {totalEventAktif < 10 ? `0${totalEventAktif}` : totalEventAktif}
                    </div>
                    <div className="mt-1 text-[10px] md:text-xs font-semibold text-slate-500">Event Aktif</div>
                  </div>

                  <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-3.5 md:p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center">
                        <Users className="w-4.5 h-4.5 text-sky-700" />
                      </div>
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-sky-600">Peserta</span>
                    </div>
                    <div className="mt-2 text-2xl md:text-3xl font-black text-slate-950 leading-none">
                      {totalPeserta < 10 && totalPeserta > 0 ? `0${totalPeserta}` : totalPeserta}
                    </div>
                    <div className="mt-1 text-[10px] md:text-xs font-semibold text-slate-500">Terdaftar</div>
                  </div>

                  <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50 p-3.5 md:p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
                        <Activity className="w-4.5 h-4.5 text-orange-700" />
                      </div>
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-orange-600">Match</span>
                    </div>
                    <div className="mt-2 text-2xl md:text-3xl font-black text-slate-950 leading-none">0</div>
                    <div className="mt-1 text-[10px] md:text-xs font-semibold text-slate-500">Hari Ini</div>
                  </div>

                  <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-purple-50 p-3.5 md:p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                        <DollarSign className="w-4.5 h-4.5 text-purple-700" />
                      </div>
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-purple-600">Omzet</span>
                    </div>
                    <div className="mt-2 text-lg md:text-2xl font-black text-slate-950 leading-none">Rp 0</div>
                    <div className="mt-1 text-[10px] md:text-xs font-semibold text-slate-500">Pendaftaran</div>
                  </div>
                </div>

                {/* MENU CEPAT */}
                <div className="rounded-[22px] md:rounded-[26px] border border-slate-100 bg-white p-3.5 md:p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-6 rounded-full bg-emerald-500" />
                      <div>
                        <h3 className="text-sm md:text-base font-black text-slate-900">Menu Cepat</h3>
                        <p className="hidden sm:block text-[10px] text-slate-400">Kelola turnamen dari satu tempat</p>
                      </div>
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-emerald-600">Kelola Turnamen</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 md:gap-3">
                    <button onClick={() => { if (events[0]) setSelectedEventIdForReg(String(events[0].id)); setActiveView('REGISTRATION'); }} className="group flex flex-col items-center gap-1.5 cursor-pointer">
                      <span className="w-full aspect-[1.25/1] max-h-16 rounded-xl md:rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition">
                        <UserPlus className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                      </span>
                      <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-700">Peserta</span>
                    </button>

                    <button onClick={() => { if (events[0]) setSelectedEventIdForDraw(String(events[0].id)); setActiveView('DRAW'); }} className="group flex flex-col items-center gap-1.5 cursor-pointer">
                      <span className="w-full aspect-[1.25/1] max-h-16 rounded-xl md:rounded-2xl bg-sky-50 flex items-center justify-center group-hover:bg-sky-100 transition">
                        <Shuffle className="w-5 h-5 md:w-6 md:h-6 text-sky-600" />
                      </span>
                      <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-700">Undian</span>
                    </button>

                    <button onClick={() => { if (events[0]) setSelectedEventIdForSchedule(String(events[0].id)); setActiveView('SCHEDULE'); }} className="group flex flex-col items-center gap-1.5 cursor-pointer">
                      <span className="w-full aspect-[1.25/1] max-h-16 rounded-xl md:rounded-2xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition">
                        <Calendar className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                      </span>
                      <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-700">Jadwal</span>
                    </button>

                    <button onClick={() => { if (events[0]) setSelectedEventIdForLive(String(events[0].id)); setActiveView('LIVE_SCORE'); }} className="group flex flex-col items-center gap-1.5 cursor-pointer">
                      <span className="w-full aspect-[1.25/1] max-h-16 rounded-xl md:rounded-2xl bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition">
                        <Radio className="w-5 h-5 md:w-6 md:h-6 text-rose-600" />
                      </span>
                      <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-700">Live Score</span>
                    </button>

                    <button onClick={() => { if (events[0]) setSelectedEventIdForKnockout(String(events[0].id)); setActiveView('KNOCKOUT'); }} className="group flex flex-col items-center gap-1.5 cursor-pointer">
                      <span className="w-full aspect-[1.25/1] max-h-16 rounded-xl md:rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition">
                        <Trophy className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                      </span>
                      <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-700">Knockout</span>
                    </button>
                  </div>
                </div>

                {/* STATUS TURNAMEN */}
                <div className="rounded-[22px] md:rounded-[26px] border border-slate-100 bg-white p-4 md:p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-6 rounded-full bg-sky-500" />
                      <h3 className="text-sm md:text-base font-black text-slate-900">Status Turnamen</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] md:text-[10px] font-black text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      SIAP
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <div className="text-lg md:text-2xl font-black text-slate-900">{events.length}</div>
                      <div className="text-[9px] md:text-[10px] font-semibold text-slate-500">Total Event</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <div className="text-lg md:text-2xl font-black text-slate-900">{totalPeserta}</div>
                      <div className="text-[9px] md:text-[10px] font-semibold text-slate-500">Peserta</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 text-center">
                      <div className="text-lg md:text-2xl font-black text-slate-900">
                        {(events.find(e => e.status === 'Aktif') || events[0])?.jumlahMeja || 0}
                      </div>
                      <div className="text-[9px] md:text-[10px] font-semibold text-slate-500">Meja</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
                <div className="lg:col-span-2 bg-white p-3 sm:p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Event EO Saya</h2>
                      <p className="text-xs text-slate-400">Kelola event dan pantau jumlah peserta turnamen</p>
                    </div>
                    <button onClick={handleOpenCreate} className="flex items-center gap-1.5 text-xs font-bold bg-[#bef264] hover:bg-[#a3e635] text-slate-950 px-3.5 py-2 rounded-xl transition cursor-pointer shadow-sm">
                      <Plus className="w-4 h-4" /> Buat Event Baru
                    </button>
                  </div>
                  {events.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                      <Trophy className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-sm font-semibold text-slate-500">Belum ada event yang dibuat</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700 text-center">
                            <th className="py-3 px-3 w-12">No</th>
                            <th className="py-3 px-4 text-left">Nama Event</th>
                            <th className="py-3 px-4 text-left">Tgl Pelaksanaan</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-3">Peserta</th>
                            <th className="py-3 px-4">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {events.map((item, index) => (
                            <tr key={item.id} className="hover:bg-slate-50 text-center font-medium">
                              <td className="py-3 px-3 font-semibold text-slate-500">{index + 1}</td>
                              <td className="py-3 px-4 text-left font-bold text-slate-900">{item.nama}</td>
                              <td className="py-3 px-4 text-left text-slate-600">{item.tanggal}</td>
                              <td className="py-3 px-3">
                                <span className={`font-bold px-2.5 py-1 rounded-md text-[11px] ${item.status === 'Aktif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 font-bold text-slate-900">{(participants[item.id] || []).length}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button onClick={() => handleRowClick(item)} className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-md text-[11px] transition cursor-pointer">Edit</button>
                                  <button onClick={() => { setSelectedEventIdForReg(String(item.id)); setActiveView('REGISTRATION'); }} className="px-2.5 py-1 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-md text-[11px] transition cursor-pointer">Peserta</button>
                                  <button onClick={() => handleDeleteEvent(item.id, item.nama)} className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md text-[11px] transition cursor-pointer">Hapus</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="lg:col-span-1"><LiveTables /></div>
              </div>
            </>
          ) : activeView === 'REGISTRATION' ? (
            <div className="space-y-6">
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
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
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
            <div className="space-y-6">
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
            <div className="space-y-6">
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
            <div className="space-y-5">
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
            <div className="space-y-6">
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


      {/* MOBILE NAVIGATION - hanya tampil di HP; desktop tetap memakai Sidebar lama */}
      <nav className="spinmatch-mobile-nav fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-1.5 pb-[max(6px,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-8px_24px_rgba(15,23,42,0.10)] backdrop-blur-md md:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-6 gap-0.5">
          {[
            { view: 'DASHBOARD', label: 'Home', icon: <Activity className="h-4 w-4" /> },
            { view: 'REGISTRATION', label: 'Peserta', icon: <Users className="h-4 w-4" /> },
            { view: 'DRAW', label: 'Undian', icon: <Dices className="h-4 w-4" /> },
            { view: 'SCHEDULE', label: 'Jadwal', icon: <Calendar className="h-4 w-4" /> },
            { view: 'LIVE_SCORE', label: 'Skor', icon: <Radio className="h-4 w-4" /> },
            { view: 'KNOCKOUT', label: 'KO', icon: <Trophy className="h-4 w-4" /> },
          ].map((item) => (
            <button
              type="button"
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`flex min-w-0 flex-col items-center justify-center rounded-xl px-0.5 py-1.5 text-[8px] font-black transition ${
                activeView === item.view
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.icon}
              <span className="mt-0.5 max-w-full truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

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
              <div className="grid grid-cols-3 gap-3">
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