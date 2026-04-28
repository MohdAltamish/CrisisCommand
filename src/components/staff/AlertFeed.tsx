'use client';
import { Incident } from '@/types';
import IncidentCard from './IncidentCard';
import { useState } from 'react';

interface Props {
  incidents: Incident[];
  selected: Incident | null;
  onSelect: (i: Incident) => void;
}

const SEVERITY_ORDER = { active: 0, acknowledged: 1, resolved: 2 };

export default function AlertFeed({ incidents, selected, onSelect }: Props) {
  const [filter, setFilter] = useState<string>('all');

  const sorted = [...incidents].sort((a, b) => SEVERITY_ORDER[a.status] - SEVERITY_ORDER[b.status]);
  const filtered = filter === 'all' ? sorted : sorted.filter(i => i.crisisType === filter || i.status === filter);

  return (
    <div className="flex flex-col h-full bg-[#080808]">
      <div className="p-6 border-b border-[#2C2C2E] flex justify-between items-center bg-[#111111] flex-shrink-0">
        <h2 className="font-tactical-label text-[#A1A1AA] uppercase">Incident Log</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#2C2C2E] bg-[#181818]">
          <span className="material-symbols-outlined text-[#A1A1AA] text-[16px]">filter_list</span>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="bg-transparent text-sm text-[#F5F5F5] outline-none font-tactical-data cursor-pointer">
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="fire">Fire</option>
            <option value="flood">Flood</option>
            <option value="earthquake">Earthquake</option>
            <option value="medical">Medical</option>
            <option value="stampede">Stampede</option>
          </select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filtered.length === 0 ? (
          <div className="flex-1 h-full flex items-center justify-center text-[#A1A1AA]">
            <p className="text-sm font-tactical-label tracking-widest uppercase">No Incidents to Display</p>
          </div>
        ) : (
          filtered.map(inc => (
            <IncidentCard key={inc.id} incident={inc} isSelected={selected?.id === inc.id} onClick={() => onSelect(inc)} />
          ))
        )}
      </div>
    </div>
  );
}
