import React, { useState } from 'react';
import { Trophy, Calendar, MapPin, X, Save } from 'lucide-react';

// Terima props dari App.jsx agar data sinkron (events, setEvents, dan onRowClick)
// Jika digunakan secara standalone (tanpa App.jsx), ia akan memakai fallback state lokal.
export const Event = ({ events: propEvents, setEvents: propSetEvents, onRowClick: propOnRowClick }) => {
  
  // Fallback state lokal hanya jika props tidak diberikan
  const [localEvents, setLocalEvents] = useState([
    {
      id: 1,
      namaEvent: 'SpinMatch Open Championship 2026',
      tanggalMulai: '2026-10-15',
      tanggalSelesai: '2026-10-17',
      jamMulai: '09:00',
      jamSelesai: '17:00',
      durasiMatch: '20',
      lokasi: 'Gor Tenis Meja Nasional',
      divisi: ['Divisi 1', 'Divisi 2'],
      status: 'Aktif'
    }
  ]);

  // Gunakan props jika ada, jika tidak gunakan state lokal
  const events = propEvents !== undefined ? propEvents : localEvents;
  const setEvents = propSetEvents || setLocalEvents;
  const handleRowClick = propOnRowClick || ((eventItem) => {
    setSelectedEvent({ 
      ...eventItem, 
      divisi: eventItem.divisi ? [...eventItem.divisi] : [] 
    });
    setIsEditModalOpen(true);
  });

  // State untuk mengontrol Modal Edit
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newDivisiName, setNewDivisiName] = useState('');

  // Fungsi tambah divisi di dalam form edit
  const handleAddDivisiEdit = () => {
    if (!newDivisiName.trim()) return;
    setSelectedEvent({
      ...selectedEvent,
      divisi: [...selectedEvent.divisi, newDivisiName.trim()]
    });
    setNewDivisiName('');
  };

  // Fungsi hapus divisi di dalam form edit
  const handleRemoveDivisiEdit = (indexToRemove) => {
    setSelectedEvent({
      ...selectedEvent,
      divisi: selectedEvent.divisi.filter((_, idx) => idx !== indexToRemove)
    });
  };

  // Fungsi simpan perubahan event yang diedit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    // Update state (ini akan otomatis memicu useEffect localStorage di App.jsx jika setEvents berasal dari sana)
    setEvents(events.map(ev => ev.id === selectedEvent.id ? selectedEvent : ev));
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="p-6 text-slate-200 select-none">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-black text-white">Event & Divisi</h2>
          <p className="text-xs text-slate-400">Klik pada salah satu baris event di bawah untuk menyunting pengaturannya.</p>
        </div>
      </div>

      {/* TABEL EVENT */}
      <div className="bg-[#0a1120] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 bg-slate-900/50 uppercase tracking-wider">
                <th className="py-3.5 px-4 text-center w-16">No</th>
                <th className="py-3.5 px-4">Nama Event</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Lokasi</th>
                <th className="py-3.5 px-4">Divisi</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {events.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 text-xs">
                    Belum ada data event.
                  </td>
                </tr>
              ) : (
                events.map((ev, index) => (
                  <tr 
                    key={ev.id}
                    onClick={() => handleRowClick(ev)}
                    className="hover:bg-slate-800/70 cursor-pointer transition-colors duration-150 group"
                  >
                    <td className="py-3.5 px-4 text-center font-bold text-slate-400 group-hover:text-white">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-[#bef264] shrink-0" />
                      <span>{ev.nama || ev.namaEvent}</span> {/* Fallback ke 'nama' jika format dari App.jsx berbeda */}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ev.tanggal || `${ev.tanggalMulai} s/d ${ev.tanggalSelesai}`}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 text-xs">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{ev.lokasi || 'Lokasi belum diatur'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {(ev.divisiList || ev.divisi)?.map((div, i) => {
                          // Menangani format objek divisi dari App.jsx {nama: 'Divisi 5'} atau string dari Event.jsx
                          const divName = typeof div === 'string' ? div : div.nama;
                          return (
                            <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700/60 text-slate-300 text-[11px]">
                              {divName}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        ev.status === 'Aktif' 
                          ? 'bg-lime-500/10 text-[#bef264] border border-lime-500/30' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {ev.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM EDIT EVENT */}
      {isEditModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#070d18] border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative my-8">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white">Edit Pertandingan / Event</h3>
                <p className="text-xs text-slate-400">Ubah konfigurasi detail turnamen tenis meja.</p>
              </div>
              <button 
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedEvent(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Edit */}
            <form onSubmit={handleSaveEdit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Event / Turnamen</label>
                <input 
                  type="text" 
                  value={selectedEvent.nama || selectedEvent.namaEvent || ''}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, nama: e.target.value, namaEvent: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#bef264] transition"
                  required
                />
              </div>

              {/* Rentang Tanggal */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tanggal Mulai</label>
                  <input 
                    type="date" 
                    value={selectedEvent.tanggalMulai || ''}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, tanggalMulai: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#bef264] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tanggal Selesai</label>
                  <input 
                    type="date" 
                    value={selectedEvent.tanggalSelesai || ''}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, tanggalSelesai: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#bef264] transition"
                  />
                </div>
              </div>

              {/* Jam Operasional & Durasi Match */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Jam Mulai</label>
                  <input 
                    type="time" 
                    value={selectedEvent.jamMulai || ''}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, jamMulai: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#bef264] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Jam Selesai</label>
                  <input 
                    type="time" 
                    value={selectedEvent.jamSelesai || ''}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, jamSelesai: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#bef264] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Durasi/Match (Mnt)</label>
                  <input 
                    type="number" 
                    value={selectedEvent.durasiMatch || ''}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, durasiMatch: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#bef264] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Lokasi / GOR</label>
                <input 
                  type="text" 
                  value={selectedEvent.lokasi || ''}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, lokasi: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#bef264] transition"
                />
              </div>

              {/* Manajemen Divisi */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Daftar Divisi Turnamen</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text"
                    placeholder="Nama Divisi (Cth: Divisi 3)"
                    value={newDivisiName}
                    onChange={(e) => setNewDivisiName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDivisiEdit())}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#bef264]"
                  />
                  <button 
                    type="button"
                    onClick={handleAddDivisiEdit}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-900/60 border border-slate-800 rounded-xl min-h-[46px]">
                  {(!selectedEvent.divisi && !selectedEvent.divisiList) || (selectedEvent.divisiList || selectedEvent.divisi)?.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">Belum ada divisi ditambahkan.</span>
                  ) : (
                    (selectedEvent.divisiList || selectedEvent.divisi)?.map((div, index) => {
                      const divName = typeof div === 'string' ? div : div.nama;
                      return (
                        <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#bef264]/10 border border-[#bef264]/30 text-[#bef264] text-xs font-bold">
                          {divName}
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.stopPropagation(); // Mencegah trigger klik lain jika ada
                              handleRemoveDivisiEdit(index);
                            }}
                            className="hover:text-red-400 transition cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status Event</label>
                <select 
                  value={selectedEvent.status || 'Aktif'}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, status: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#bef264] transition cursor-pointer"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Draft">Draft</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              {/* Tombol Aksi Modal */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 sticky bottom-0 bg-[#070d18] pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedEvent(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-[#bef264] text-slate-950 shadow-lg shadow-lime-950/40 hover:bg-lime-400 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};