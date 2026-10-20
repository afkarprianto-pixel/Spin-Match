import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const guestIdStorageKey = 'spinmatch_chat_guest_id';
const guestNameStorageKey = `${guestIdStorageKey}_name`;

const getGuestId = () => {
  if (typeof window === 'undefined') return '';
  let guestId = window.sessionStorage.getItem(guestIdStorageKey);
  if (!guestId) {
    guestId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(guestIdStorageKey, guestId);
  }
  return guestId;
};

const getSupabaseErrorMessage = (error, fallback) => {
  if (!error) return fallback;
  const code = error.code ? ` [${error.code}]` : '';
  const detail = error.details || error.hint;
  return `${error.message || fallback}${code}${detail ? ` — ${detail}` : ''}`;
};

const getUserId = (user) => String(user?.id || user?.user_id || user?.uid || '').trim();

const getUserDisplayName = (user) => String(
  user?.user_metadata?.full_name
  || user?.user_metadata?.name
  || user?.name
  || user?.email
  || ''
).trim();

export const EventChat = ({ eventId, eventName, user }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const guestIdRef = useRef('');

  const normalizedEventId = useMemo(() => {
    const value = String(eventId ?? '').trim();
    if (!value || !/^\d+$/.test(value)) return null;
    const numberValue = Number(value);
    return Number.isSafeInteger(numberValue) && numberValue > 0 ? numberValue : null;
  }, [eventId]);

  const userId = getUserId(user);
  const isGuest = !userId;

  useEffect(() => {
    if (!isGuest) {
      setSenderName(getUserDisplayName(user));
      return undefined;
    }

    try {
      guestIdRef.current = getGuestId();
      setSenderName(window.sessionStorage.getItem(guestNameStorageKey) || '');
    } catch (storageError) {
      setError(`Chat tidak dapat dibuka: ${storageError.message}`);
    }
    return undefined;
  }, [isGuest, user]);

  useEffect(() => {
    let cancelled = false;
    let channel;

    const loadMessages = async () => {
      setMessages([]);
      setLoading(true);
      setError('');

      if (!normalizedEventId) {
        setLoading(false);
        setError('Event chat tidak valid. Silakan pilih event kembali.');
        return;
      }

      const { data, error: loadError } = await supabase
        .from('event_chat_messages')
        .select('id, event_id, sender_name, message, created_at')
        .eq('event_id', normalizedEventId)
        .order('created_at', { ascending: true })
        .limit(200);

      if (cancelled) return;
      if (loadError) {
        setError(`Gagal memuat chat: ${getSupabaseErrorMessage(loadError, 'Query chat gagal')}`);
      } else {
        setMessages(data || []);
      }
      setLoading(false);

      channel = supabase
        .channel(`event-chat-${normalizedEventId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'event_chat_messages',
          filter: `event_id=eq.${normalizedEventId}`,
        }, (payload) => {
          setMessages((current) => {
            if (current.some((row) => row.id === payload.new.id)) return current;
            return [...current, payload.new]
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
              .slice(-200);
          });
        })
        .subscribe((status) => {
          if (!cancelled && (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT')) {
            setError('Chat berhasil dimuat, tetapi realtime tidak aktif. Refresh untuk melihat pesan terbaru.');
          }
        });
    };

    loadMessages().catch((loadException) => {
      if (!cancelled) {
        setLoading(false);
        setError(`Gagal memuat chat: ${loadException?.message || 'Kesalahan tidak diketahui'}`);
      }
    });

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [normalizedEventId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = message.trim();
    const guestName = senderName.trim();
    if (!text || sending) return;

    if (!normalizedEventId) {
      setError('Event chat tidak valid. Silakan pilih event kembali.');
      return;
    }
    if (isGuest && !guestName) {
      setError('Masukkan nama sebelum mengirim pesan.');
      return;
    }
    if (isGuest && guestName.length > 60) {
      setError('Nama maksimal 60 karakter.');
      return;
    }
    if (text.length > 500) {
      setError('Pesan maksimal 500 karakter.');
      return;
    }

    setSending(true);
    setError('');
    try {
      if (isGuest) {
        window.sessionStorage.setItem(guestNameStorageKey, guestName);
        if (!guestIdRef.current) guestIdRef.current = getGuestId();
      }

      const { error: sendError } = await supabase.rpc('send_event_chat_message', {
        p_event_id: normalizedEventId,
        p_message: text,
        p_guest_id: isGuest ? guestIdRef.current : null,
        p_sender_name: isGuest ? guestName : (getUserDisplayName(user) || 'Pengguna'),
      });

      if (sendError) throw sendError;
      setMessage('');
    } catch (sendError) {
      setError(`Gagal mengirim pesan: ${getSupabaseErrorMessage(sendError, 'RPC pengiriman chat gagal')}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mx-auto flex h-[min(70vh,680px)] min-h-[420px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-slate-200 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><MessageCircle className="h-5 w-5" /></span>
        <div className="min-w-0"><h2 className="font-black text-slate-900">Chat Publik</h2><p className="truncate text-xs text-slate-500">{eventName || 'Event'}</p></div>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {loading ? <p className="text-center text-sm text-slate-500">Memuat percakapan...</p>
          : messages.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">Belum ada pesan. Mulai percakapan di sini.</p>
            : messages.map((item) => (
              <article key={item.id} className="max-w-[90%] rounded-xl bg-slate-50 px-3 py-2">
                <div className="flex items-baseline justify-between gap-4"><strong className="truncate text-xs text-blue-800">{item.sender_name || 'Pengguna'}</strong><time className="shrink-0 text-[10px] text-slate-400">{new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</time></div>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-800">{item.message}</p>
              </article>
            ))}
        <div ref={messagesEndRef} />
      </div>
      {error && <p role="alert" className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">{error}</p>}
      <form onSubmit={sendMessage} className="flex flex-wrap items-center gap-2 border-t border-slate-200 p-3 sm:flex-nowrap">
        {isGuest && <div className="w-full sm:w-48 sm:shrink-0">
          <label className="sr-only" htmlFor="event-chat-sender">Nama pengirim</label>
          <input id="event-chat-sender" value={senderName} onChange={(event) => setSenderName(event.target.value)} maxLength={60} required placeholder="Nama Anda" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
        </div>}
        <label className="sr-only" htmlFor="event-chat-message">Tulis pesan</label>
        <input id="event-chat-message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={500} placeholder="Tulis pesan..." className="min-w-[120px] flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
        <button type="submit" disabled={sending || !message.trim() || !normalizedEventId} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-700 px-3 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /><span>{sending ? 'Mengirim...' : 'Kirim'}</span></button>
      </form>
    </section>
  );
};
