import React from 'react';

export const StatCard = ({ title, value, subtitle, icon, iconBg }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500">{title}</span>
        <div className={`p-2.5 rounded-full ${iconBg}`}>{icon}</div>
      </div>
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{value}</h2>
        <p className="text-xs font-semibold text-emerald-600">{subtitle}</p>
      </div>
    </div>
  );
};