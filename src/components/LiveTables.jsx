import React from 'react';

export const LiveTables = () => {
  const tables = [
    { id: 'M1', score: '08–11' },
    { id: 'M2', score: '12–09', isGreen: true },
    { id: 'M3', score: '08–11' },
    { id: 'M4', score: '12–09' },
    { id: 'M5', score: '08–11' },
    { id: 'M6', score: '12–09' },
    { id: 'M7', score: '08–11' },
    { id: 'M8', score: '12–09' },
  ];

  return (
    <div className="bg-[#0b1329] text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-medium text-slate-400">Live sekarang</span>
          <span className="flex items-center gap-1.5 bg-[#bef264] text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
            LIVE
          </span>
        </div>
        <h3 className="text-2xl font-extrabold mb-6">8 meja aktif</h3>
        <div className="grid grid-cols-4 gap-2.5">
          {tables.map((tbl) => (
            <div
              key={tbl.id}
              className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition ${
                tbl.isGreen ? 'bg-[#bef264] text-slate-950 font-bold' : 'bg-slate-800/80 text-white'
              }`}
            >
              <span className={`text-[10px] font-bold ${tbl.isGreen ? 'text-slate-800' : 'text-slate-400'}`}>{tbl.id}</span>
              <span className="text-sm font-black tracking-tight">{tbl.score}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        Skor diperbarui real-time oleh wasit meja
      </div>
    </div>
  );
};