'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Incident, CrisisType } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

const CRISIS_COLORS: Record<CrisisType, string> = {
  fire: '#FF3B30', flood: '#007AFF', earthquake: '#FF9500', medical: '#34C759', stampede: '#AF52DE',
};

export default function AdminPage() {
  const router = useRouter();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const q = query(collection(db, 'incidents'), orderBy('reportedAt', 'desc'), limit(200));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data(), reportedAt: d.data().reportedAt?.toDate() })) as Incident[];
      setIncidents(data);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const active = incidents.filter(i => i.status === 'active').length;
  const resolved = incidents.filter(i => i.status === 'resolved').length;
  const avgResponse = incidents
    .filter(i => i.acknowledgedAt && i.reportedAt)
    .map(i => (new Date(i.acknowledgedAt!).getTime() - new Date(i.reportedAt).getTime()) / 60000)
    .reduce((a, b, _, arr) => a + b / arr.length, 0);

  const byType = ['fire', 'flood', 'earthquake', 'medical', 'stampede'].map(type => ({
    name: type.toUpperCase(),
    count: incidents.filter(i => i.crisisType === type).length,
    fill: CRISIS_COLORS[type as CrisisType],
  }));

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const day = startOfDay(subDays(new Date(), 6 - i));
    return {
      date: format(day, 'MMM d'),
      count: incidents.filter(inc => inc.reportedAt && startOfDay(new Date(inc.reportedAt)).getTime() === day.getTime()).length,
    };
  });

  return (
    <div className="bg-[#080808] text-[#F5F5F5] font-body-md min-h-screen pb-24 selection:bg-primary-container selection:text-white">
      {/* TopAppBar */}
      <header className="bg-[#080808] border-b border-[#2C2C2E] flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="hover:bg-[#111111] p-1 rounded transition-colors flex items-center">
            <div className="bg-[#FF3B30] text-[#F5F5F5] p-1 rounded-sm text-xl font-black font-h1">CC</div>
          </button>
          <nav className="hidden md:flex gap-6 ml-8 font-h2 text-[16px]">
            <span className="text-[#A1A1AA] cursor-not-allowed px-2 py-1">Status</span>
            <span className="text-[#A1A1AA] cursor-not-allowed px-2 py-1">Tactical</span>
            <span className="text-[#A1A1AA] cursor-not-allowed px-2 py-1">Map</span>
            <span className="text-[#F5F5F5] border-b-2 border-[#FF3B30] px-2 py-1">Admin</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#F5F5F5] cursor-pointer hover:bg-[#111111] p-2 rounded transition-colors">notifications_active</span>
          <span className="material-symbols-outlined text-[#F5F5F5] cursor-pointer hover:bg-[#111111] p-2 rounded transition-colors hidden md:block">account_circle</span>
        </div>
      </header>

      <main className="pt-8 px-6 max-w-7xl mx-auto space-y-8">
        {/* Dashboard Header */}
        <div className="space-y-1">
          <h1 className="font-h1 text-[40px] leading-tight text-[#F5F5F5]">Admin Overview</h1>
          <p className="font-tactical-label text-[12px] text-[#FFB4AA] tracking-widest uppercase">INCIDENT ANALYTICS</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-[#A1A1AA] font-tactical-data animate-pulse">LOADING ANALYTICS...</div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#181818] border border-[#2C2C2E] p-6 rounded-[20px] flex flex-col justify-between h-32 hover:bg-[#202020] transition-colors cursor-default">
                <div className="flex justify-between items-start">
                  <span className="font-tactical-label text-[10px] text-[#ad8883] uppercase">TOTAL INCIDENTS</span>
                  <span className="material-symbols-outlined text-[#68d3fc]" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                </div>
                <div className="font-h2 text-[32px]">{incidents.length}</div>
              </div>

              <div className="bg-[#181818] border border-[#2C2C2E] p-6 rounded-[20px] flex flex-col justify-between h-32 border-l-4 border-l-[#FF3B30] hover:bg-[#202020] transition-colors cursor-default">
                <div className="flex justify-between items-start">
                  <span className="font-tactical-label text-[10px] text-[#ad8883] uppercase">ACTIVE NOW</span>
                  <span className="material-symbols-outlined text-[#FFB4AA]" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-h2 text-[32px] text-[#FF3B30]">{active}</span>
                  {active > 0 && <span className="font-tactical-data text-[14px] text-[#FFB4AA] animate-pulse">CRITICAL</span>}
                </div>
              </div>

              <div className="bg-[#181818] border border-[#2C2C2E] p-6 rounded-[20px] flex flex-col justify-between h-32 hover:bg-[#202020] transition-colors cursor-default">
                <div className="flex justify-between items-start">
                  <span className="font-tactical-label text-[10px] text-[#ad8883] uppercase">RESOLVED</span>
                  <span className="material-symbols-outlined text-[#adc6ff]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <div className="font-h2 text-[32px]">{resolved}</div>
              </div>

              <div className="bg-[#181818] border border-[#2C2C2E] p-6 rounded-[20px] flex flex-col justify-between h-32 hover:bg-[#202020] transition-colors cursor-default">
                <div className="flex justify-between items-start">
                  <span className="font-tactical-label text-[10px] text-[#ad8883] uppercase">AVG RESPONSE</span>
                  <span className="material-symbols-outlined text-[#68d3fc]" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
                </div>
                <div className="font-h2 text-[32px]">{avgResponse ? `${Math.floor(avgResponse)}m ${Math.round((avgResponse % 1) * 60)}s` : '—'}</div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-[#181818] border border-[#2C2C2E] p-6 rounded-[20px]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-h3 text-[24px] text-[#F5F5F5]">Incidents by Type</h3>
                  <span className="material-symbols-outlined text-[#ad8883]">bar_chart</span>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={byType} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fill: '#8E8E93', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8E8E93', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#202020' }} contentStyle={{ background: '#111111', border: '1px solid #2C2C2E', borderRadius: 8, color: '#F5F5F5', fontFamily: 'Space Mono', fontSize: 12 }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
                      {byType.map((entry, i) => (
                        <rect key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[#181818] border border-[#2C2C2E] p-6 rounded-[20px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-h3 text-[24px] text-[#F5F5F5]">Last 7 Days</h3>
                  <span className="material-symbols-outlined text-[#ad8883]">show_chart</span>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={last7} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="date" tick={{ fill: '#8E8E93', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8E8E93', fontSize: 10, fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#111111', border: '1px solid #2C2C2E', borderRadius: 8, color: '#F5F5F5', fontFamily: 'Space Mono', fontSize: 12 }} />
                    <Line type="monotone" dataKey="count" stroke="#68d3fc" strokeWidth={3} dot={{ fill: '#68d3fc', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#FFFFFF' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Incident Table */}
            <div className="bg-[#181818] border border-[#2C2C2E] rounded-[20px] overflow-hidden">
              <div className="p-6 border-b border-[#2C2C2E] flex justify-between items-center">
                <h3 className="font-h3 text-[24px] text-[#F5F5F5]">Recent Incidents</h3>
                <button className="bg-[#F5F5F5] text-[#080808] font-h2 text-[14px] px-6 py-2 rounded-xl active:scale-95 duration-100 uppercase tracking-widest hover:bg-white/90">EXPORT DATA</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#111111] border-b border-[#2C2C2E]">
                      <th className="p-4 font-tactical-label text-[10px] text-[#ad8883] uppercase tracking-widest">TYPE</th>
                      <th className="p-4 font-tactical-label text-[10px] text-[#ad8883] uppercase tracking-widest">LOCATION</th>
                      <th className="p-4 font-tactical-label text-[10px] text-[#ad8883] uppercase tracking-widest">STATUS</th>
                      <th className="p-4 font-tactical-label text-[10px] text-[#ad8883] uppercase tracking-widest">REPORTED BY</th>
                      <th className="p-4 font-tactical-label text-[10px] text-[#ad8883] uppercase tracking-widest">TIME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2C2C2E]">
                    {incidents.slice(0, 20).map(inc => (
                      <tr key={inc.id} className="hover:bg-[#202020] transition-colors cursor-pointer">
                        <td className="p-4">
                          <span className="px-2 py-1 bg-[#111111] border font-tactical-label text-[10px] rounded uppercase" style={{ color: CRISIS_COLORS[inc.crisisType], borderColor: CRISIS_COLORS[inc.crisisType] }}>
                            {inc.crisisType}
                          </span>
                        </td>
                        <td className="p-4 font-body-md text-[#F5F5F5] text-[14px]">{inc.location?.address || '—'}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-[#111111] border font-tactical-label text-[10px] rounded uppercase" style={{
                            borderColor: inc.status === 'active' ? '#FF3B30' : inc.status === 'acknowledged' ? '#FF9500' : '#34C759',
                            color: inc.status === 'active' ? '#FF3B30' : inc.status === 'acknowledged' ? '#FF9500' : '#34C759',
                          }}>{inc.status}</span>
                        </td>
                        <td className="p-4 font-body-md text-[#A1A1AA] text-[14px]">{inc.reportedBy}</td>
                        <td className="p-4 font-tactical-data text-[12px] text-[#F5F5F5]">
                          {inc.reportedAt ? format(new Date(inc.reportedAt), 'HH:mm:ss') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
