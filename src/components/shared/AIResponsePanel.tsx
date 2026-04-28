'use client';
import { Incident } from '@/types';

export default function AIResponsePanel({ incident }: { incident: Incident }) {
  const ai = incident.aiResponse;

  if (!ai) {
    return (
      <div className="flex items-center gap-3 text-[#A1A1AA]">
        <span className="material-symbols-outlined text-[16px] animate-pulse">smart_toy</span>
        <p className="text-sm font-tactical-data tracking-widest uppercase">GENERATING AI RESPONSE...</p>
      </div>
    );
  }

  const severityColor = {
    critical: '#FF3B30',
    high: '#FF9500',
    medium: '#007AFF',
    low: '#34C759',
  }[ai.severity] || '#A1A1AA';

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1d9cc3]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          <h3 className="font-tactical-label text-[#1d9cc3] tracking-[0.2em] uppercase">GEMINI AI RESPONSE</h3>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-[#1d9cc3]/30 to-transparent"></div>
        <div className="flex items-center gap-3">
          <span className="font-badge text-[10px] px-2 py-0.5 rounded uppercase" style={{ background: `${severityColor}20`, color: severityColor }}>
            {ai.severity?.toUpperCase()} SEVERITY
          </span>
          <span className="font-tactical-data text-[10px] text-[#52525B]">ETA: {ai.estimatedResponseTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Immediate Actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]"></span>
            <span className="font-tactical-label text-[#FF3B30] text-[10px] uppercase">IMMEDIATE ACTIONS</span>
          </div>
          <ul className="space-y-3 text-sm text-[#F5F5F5] font-body-md">
            {ai.immediateActions?.map((a, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#FF3B30] font-bold font-tactical-data">{String(i + 1).padStart(2, '0')}.</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Staff Instructions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1d9cc3]"></span>
            <span className="font-tactical-label text-[#1d9cc3] text-[10px] uppercase">STAFF INSTRUCTIONS</span>
          </div>
          <ul className="space-y-3 text-sm text-[#A1A1AA] font-body-md">
            {ai.staffInstructions?.map((a, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-[#1d9cc3]">•</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {ai.contactNumbers && ai.contactNumbers.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[#2C2C2E]/50 flex gap-2 flex-wrap items-center">
          <span className="material-symbols-outlined text-[#A1A1AA] text-[14px]">contact_phone</span>
          {ai.contactNumbers.map((n, i) => (
            <span key={i} className="font-tactical-data text-[10px] px-2 py-1 rounded bg-[#111111] border border-[#2C2C2E] text-[#A1A1AA]">{n}</span>
          ))}
        </div>
      )}
    </>
  );
}
