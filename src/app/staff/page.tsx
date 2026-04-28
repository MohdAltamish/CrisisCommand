'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIncidents } from '@/hooks/useIncidents';
import { useCrisisStore } from '@/store/crisisStore';
import AlertFeed from '@/components/staff/AlertFeed';
import VenueMap from '@/components/staff/VenueMap';
import AIResponsePanel from '@/components/shared/AIResponsePanel';
import toast from 'react-hot-toast';

export default function StaffPage() {
  const router = useRouter();
  const incidents = useIncidents();
  const { selectedIncident, setSelectedIncident, isAlertSoundEnabled, toggleAlertSound } = useCrisisStore();
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    const active = incidents.filter(i => i.status === 'active');
    if (active.length > prevCount && prevCount > 0) {
      toast.error(`🚨 New emergency alert!`, { duration: 5000 });
      if (isAlertSoundEnabled) {
        try {
          const ctx = new AudioContext();
          [0, 0.3, 0.6].forEach(delay => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.value = 660;
            gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.25);
          });
        } catch {}
      }
    }
    setPrevCount(active.length);
  }, [incidents, prevCount, isAlertSoundEnabled]);

  const activeCount = incidents.filter(i => i.status === 'active').length;

  return (
    <div className="bg-[#080808] text-[#F5F5F5] font-body-md min-h-[100dvh] flex flex-col overflow-hidden selection:bg-primary-container selection:text-white">
      {/* TopAppBar */}
      <header className="flex justify-between items-center w-full px-6 py-4 bg-[#080808] border-b border-[#2C2C2E] flex-shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="hover:bg-[#181818] p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined text-[#F5F5F5]">arrow_back</span>
          </button>
          <div className="bg-[#FF3B30] text-[#F5F5F5] p-1 rounded-sm text-xl font-black font-h1">CRISISCOMMAND</div>
          <div className="hidden md:block h-6 w-px bg-[#2C2C2E]"></div>
          <h1 className="hidden md:block font-h3 text-h3 tracking-tight">Staff Dashboard</h1>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#111111] border border-[#2C2C2E] rounded-full">
            <span className={`w-2 h-2 rounded-full ${activeCount > 0 ? 'bg-[#FF3B30] animate-pulse' : 'bg-[#34C759]'}`}></span>
            <span className={`font-tactical-label text-badge uppercase ${activeCount > 0 ? 'text-[#FF3B30]' : 'text-[#34C759]'}`}>
              {activeCount > 0 ? `${activeCount} ACTIVE INCIDENT${activeCount > 1 ? 'S' : ''}` : 'ALL CLEAR'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleAlertSound} className="material-symbols-outlined text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors">
              {isAlertSoundEnabled ? 'notifications_active' : 'notifications_off'}
            </button>
            <span className="material-symbols-outlined text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors cursor-pointer hidden md:block">account_circle</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Incident Feed (40%) */}
        <section className="w-full md:w-[40%] border-r border-[#2C2C2E] flex flex-col bg-[#080808] overflow-hidden">
          <AlertFeed incidents={incidents} selected={selectedIncident} onSelect={setSelectedIncident} />
        </section>

        {/* Right Panel: Venue Map (60%) */}
        <section className="hidden md:flex w-[60%] relative bg-[#111111] overflow-hidden flex-col">
          <div className="flex-1 relative">
            <VenueMap incidents={incidents} selected={selectedIncident} onSelect={setSelectedIncident} />
          </div>
          {selectedIncident && (
            <div className="relative z-30 p-6 bg-[#080808]/90 backdrop-blur-xl border-t border-[#2C2C2E] shadow-[inset_0_0_20px_rgba(29,156,195,0.1)]">
              <AIResponsePanel incident={selectedIncident} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
