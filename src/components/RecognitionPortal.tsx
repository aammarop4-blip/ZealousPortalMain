import React from 'react';
import { Award, Star, Heart, ShieldAlert, Trash2, Plus, Download } from 'lucide-react';
import { motion } from 'motion/react';

export default function RecognitionPortal() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Recognition & Disciplinary</h1>
          <p className="text-zinc-500">Manage employee awards, appreciation letters, and disciplinary actions</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-zinc-900 border border-zinc-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-zinc-800 transition-all flex items-center gap-2">
            <Plus size={18} /> New Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="text-orange-500" size={24} /> Recognition & Awards
          </h2>
          <div className="space-y-4">
            {[
              { name: 'Sarah Connor', award: 'Employee of the Month', date: '2026-03-31', type: 'AWARD' },
              { name: 'Mark Smith', award: 'Outstanding Performance', date: '2026-03-15', type: 'APPRECIATION' },
              { name: 'Emily Blunt', award: '5 Year Service Award', date: '2026-02-28', type: 'AWARD' }
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-orange-600/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-600/10 rounded-xl flex items-center justify-center text-orange-500">
                    <Star size={24} />
                  </div>
                  <div>
                    <div className="text-white font-bold">{item.name}</div>
                    <div className="text-sm text-zinc-400">{item.award}</div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div className="hidden md:block">
                    <div className="text-zinc-500 text-xs font-mono">{item.date}</div>
                  </div>
                  <button className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all">
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-red-500" size={24} /> Disciplinary Actions
          </h2>
          <div className="space-y-4">
            {[
              { name: 'John Doe', action: 'Verbal Warning - Attendance', date: '2026-04-05', level: 'LOW' },
              { name: 'Anonymous', action: 'Written Warning - Conduct', date: '2026-03-10', level: 'MEDIUM' }
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <div className="text-white font-bold">{item.name}</div>
                    <div className="text-sm text-zinc-400">{item.action}</div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div className="hidden md:block">
                    <div className="text-zinc-500 text-xs font-mono">{item.date}</div>
                  </div>
                  <button className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-red-500 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
