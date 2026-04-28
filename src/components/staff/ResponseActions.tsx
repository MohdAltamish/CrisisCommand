'use client';
import { Incident } from '@/types';
import { acknowledgeIncident, resolveIncident } from '@/lib/firestore';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ResponseActions({ incident }: { incident: Incident }) {
  const [loading, setLoading] = useState(false);

  const handleAck = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await acknowledgeIncident(incident.id, 'Staff Member');
      toast.success('Incident acknowledged');
    } catch { toast.error('Failed to update'); }
    finally { setLoading(false); }
  };

  const handleResolve = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await resolveIncident(incident.id);
      toast.success('Incident resolved ✓');
    } catch { toast.error('Failed to update'); }
    finally { setLoading(false); }
  };

  return (
    <>
      {incident.status === 'active' && (
        <button onClick={handleAck} disabled={loading}
          className="flex-1 bg-[#F5F5F5] text-[#080808] font-h2 text-sm py-2 rounded-lg active:scale-95 transition-transform">
          RESPOND
        </button>
      )}
      <button onClick={handleResolve} disabled={loading}
        className="flex-1 border border-[#2C2C2E] text-[#34C759] font-h2 text-sm py-2 rounded-lg hover:bg-[#2C2C2E] transition-colors">
        RESOLVE
      </button>
      <button className="px-3 border border-[#2C2C2E] text-[#F5F5F5] rounded-lg hover:bg-[#2C2C2E] transition-colors flex items-center justify-center">
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
    </>
  );
}
