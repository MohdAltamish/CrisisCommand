'use client';
import { Incident, CrisisType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import ResponseActions from './ResponseActions';

const CRISIS_CONFIG: Record<CrisisType, { icon: string; color: string; bg: string; label: string }> = {
  fire:       { icon: 'local_fire_department', color: '#FF3B30', bg: 'rgba(255,59,48,0.12)',  label: 'FIRE' },
  flood:      { icon: 'water_damage',          color: '#007AFF', bg: 'rgba(0,122,255,0.12)',  label: 'FLOOD' },
  earthquake: { icon: 'broken_image',          color: '#FF9500', bg: 'rgba(255,149,0,0.12)',  label: 'EARTHQUAKE' },
  medical:    { icon: 'medical_services',      color: '#34C759', bg: 'rgba(52,199,89,0.12)',  label: 'MEDICAL' },
  stampede:   { icon: 'groups',                color: '#AF52DE', bg: 'rgba(175,82,222,0.12)', label: 'STAMPEDE' },
};

interface Props {
  incident: Incident;
  isSelected: boolean;
  onClick: () => void;
}

export default function IncidentCard({ incident, isSelected, onClick }: Props) {
  const cfg = CRISIS_CONFIG[incident.crisisType];

  return (
    <div onClick={onClick}
      className={`bg-[#181818] border ${isSelected ? 'border-[#4b8eff]' : 'border-[#2C2C2E]'} border-l-4 rounded-xl p-5 transition-all cursor-pointer group hover:bg-[#202020]`}
      style={{ borderLeftColor: cfg.color }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ color: cfg.color, fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
          <span className="font-h3 text-body-lg text-[#F5F5F5]">{cfg.label} - {incident.reportedBy}</span>
        </div>
        <span className="font-badge text-[10px] px-2 py-0.5 rounded uppercase" style={{
          background: incident.status === 'active' ? cfg.color : incident.status === 'acknowledged' ? 'var(--crisis-earthquake)' : 'var(--crisis-medical)',
          color: incident.status === 'active' ? '#FFFFFF' : '#FFFFFF',
        }}>{incident.status === 'active' ? 'CRITICAL' : incident.status}</span>
      </div>

      <div className="space-y-2">
        {incident.location?.address && (
          <div className="flex items-center gap-2 text-[#A1A1AA]">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="font-tactical-data">{incident.location.address}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-[#A1A1AA]">
          <span className="material-symbols-outlined text-sm">schedule</span>
          <span className="font-tactical-data">{incident.reportedAt ? formatDistanceToNow(new Date(incident.reportedAt), { addSuffix: true }) : '—'}</span>
        </div>
      </div>

      {incident.description && (
        <div className="mt-3 text-sm text-[#A1A1AA] italic font-body-md border-l-2 border-[#2C2C2E] pl-3 py-1">
          &quot;{incident.description}&quot;
        </div>
      )}

      {isSelected && incident.status !== 'resolved' && (
        <div className="mt-4 flex gap-2" onClick={e => e.stopPropagation()}>
          <ResponseActions incident={incident} />
        </div>
      )}
    </div>
  );
}
