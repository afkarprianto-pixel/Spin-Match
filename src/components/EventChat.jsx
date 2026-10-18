import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const guestIdStorageKey = 'spinmatch_chat_guest_id';

const getGuestId = () => {
  let guestId = sessionStorage.getItem(guestIdStorageKey);
  if (!guestId) {
    guestId = crypto.randomUUID();
    sessionStorage.setItem(guestIdStorageKey, guestId);
  }
  return guestId;
};

export const EventChat = ({ eventId, eventName, user }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const guestIdRef = useRef('');

  useEffect(() => {
    if (!user?.id) {
      try {
        guestIdRef.current = getGuestId();
        setSenderName(sessionStorage.getItem(`${guestIdStorageKey}_name`) || '');
      } catch (storageError) {
        setError(`Chat tidak dapat dibuka: ${storageError.message}`);
        setLoading(false);
        return undefined;
      }
    }

    let cancelled = false;
    const loadMessages = async () => {
      setError('');
      const { data, error: loadError } = await supabase
        .from('event_chat_messages')
        .select('id, sender_name, message, created_at')
        .eq('event_id', Number(eventId))
        .order('created_at', { ascending: true })
        .limit(200);
      if (cancelled) return;
      if (loadError) {
        setError(`Gagal memuat chat: ${loadError.message}`);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };

    setLoading(true);
    loadMessages();
    const channel = supabase.channel(`event-chat-${eventId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'event_chat_messages',
        filter: `event_id=eq.${Number(eventId)}`,
      }, (payload) => {
        setMessages((current) => current.some((row) => row.id === payload.new.id)
          ? current
          : [...current, payload.new].slice(-200));
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setError('Koneksi chat real-time gagal. Muat ulang halaman untuk mencoba lagi.');
        }
      });

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [eventId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = message.trim();
    if (!text || sending) return;
    const guestName = senderName.trim();
    if (!user?.id && !guestName) {
      setError('Masukkan nama sebelum mengirim pesan.');
      return;
    }
    if (!user?.id && guestName.length > 60) {
      setError('Nama maksimal 60 karakter.');
      return;
    }
    setSending(true);
    setError('');
    try {
      if (!user?.id) sessionStorage.setItem(`${guestIdStorageKey}_name`, guestName);
      const { error: sendError } = await supabase.rpc('send_event_chat_message', {
        p_event_id: Number(eventId),
        p_message: text,
        p_guest_id: user?.id ? null : guestIdRef.current,
        p_sender_name: user?.id ? null : guestName,
      });
      if (sendError) throw sendError;
      setMessage('');
    } catch (sendError) {
      setError(`Gagal mengirim pesan: ${sendError.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mx-auto flex h-[min(70vh,680px)] min-h-[420px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-slate-200 p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><MessageCircle className="h-5 w-5" /></span>
        <div className="min-w-0"><h2 className="font-black text-slate-900">Chat Pengundian</h2><p className="truncate text-xs text-slate-500">{eventName}</p></div>
      </header>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {loading ? <p className="text-center text-sm text-slate-500">Memuat percakapan...</p>
          : messages.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">Belum ada pesan. Mulai percakapan pengundian di sini.</p>
            : messages.map((item) => (
              <article key={item.id} className="max-w-[90%] rounded-xl bg-slate-50 px-3 py-2">
                <div className="flex items-baseline justify-between gap-4"><strong className="truncate text-xs text-blue-800">{item.sender_name}</strong><time className="shrink-0 text-[10px] text-slate-400">{new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</time></div>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-800">{item.message}</p>
              </article>
            ))}
        <div ref={messagesEndRef} />
      </div>
      {error && <p role="alert" className="border-t border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">{error}</p>}
      <form onSubmit={sendMessage} className="flex flex-wrap items-center gap-2 border-t border-slate-200 p-3 sm:flex-nowrap">
        {!user?.id && <div className="w-full sm:w-48 sm:shrink-0">
          <label className="sr-only" htmlFor="event-chat-sender">Nama pengirim</label>
          <input id="event-chat-sender" value={senderName} onChange={(event) => setSenderName(event.target.value)} maxLength={60} required placeholder="Nama Anda" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
        </div>}
        <label className="sr-only" htmlFor="event-chat-message">Tulis pesan</label>
        <input id="event-chat-message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={500} placeholder="Tulis pesan..." className="min-w-[120px] flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" />
        <button type="submit" disabled={sending || !message.trim()} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-700 px-3 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /><span>{sending ? 'Mengirim...' : 'Kirim'}</span></button>
      </form>
    </section>
  );
};
