'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/hooks/useLocation';
import { createIncident } from '@/lib/firestore';
import { CrisisType } from '@/types';
import toast from 'react-hot-toast';

const CRISIS_OPTIONS: { type: CrisisType; label: string; icon: string; color: string; bg: string }[] = [
  { type: 'fire',       label: 'Fire',              icon: 'local_fire_department', color: '#FF3B30', bg: 'rgba(255,59,48,0.1)' },
  { type: 'flood',      label: 'Flood',             icon: 'water_damage',          color: '#007AFF', bg: 'rgba(0,122,255,0.1)' },
  { type: 'earthquake', label: 'Earthquake',        icon: 'broken_image',          color: '#FF9500', bg: 'rgba(255,149,0,0.1)' },
  { type: 'medical',    label: 'Medical Emergency', icon: 'medical_services',      color: '#34C759', bg: 'rgba(52,199,89,0.1)' },
  { type: 'stampede',   label: 'Stampede',          icon: 'groups',                color: '#AF52DE', bg: 'rgba(175,82,222,0.1)' },
];

type Step = 'idle' | 'select' | 'details' | 'submitted';

export default function GuestPage() {
  const router = useRouter();
  const { location, error: locationError } = useLocation();
  const [step, setStep] = useState<Step>('idle');
  const [selectedCrisis, setSelectedCrisis] = useState<CrisisType | null>(null);
  const [roomNumber, setRoomNumber] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [incidentId, setIncidentId] = useState('');

  const handleSOSPress = () => setStep('select');
  const handleCrisisSelect = (type: CrisisType) => { setSelectedCrisis(type); setStep('details'); };

  const handleSubmit = async () => {
    if (!selectedCrisis) return;
    setLoading(true);
    try {
      const locationData = {
        lat: location?.lat ?? 28.6139,
        lng: location?.lng ?? 77.2090,
        address: `Venue${roomNumber ? ` — Room ${roomNumber}` : ''}`,
        ...(roomNumber && { roomNumber }),
      };

      const id = await createIncident({
        crisisType: selectedCrisis,
        location: locationData,
        reportedBy: 'Guest — Anonymous',
        affectedCount: 1,
        ...(description && { description }),
      });
      fetch('/api/ai-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incident: { id, crisisType: selectedCrisis, location, description } }),
      });
      setIncidentId(id);
      setStep('submitted');
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      } catch {}
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('permission') || msg.includes('api-key') || msg.includes('projectId')) {
        toast.error('Firebase not configured. Check .env.local credentials.', { duration: 8000 });
      } else {
        toast.error(`Alert failed: ${msg.slice(0, 80)}`, { duration: 8000 });
      }
      console.error('[CrisisCommand] Alert submission error:', err);
    } finally { setLoading(false); }
  };

  const selected = CRISIS_OPTIONS.find(c => c.type === selectedCrisis);

  return (
    <div className="bg-[#080808] text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container min-h-[100dvh] flex flex-col overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.6); opacity: 0; } }
        .pulse-effect { position: absolute; border-radius: 9999px; background-color: #FF3B30; z-index: 0; animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite; }
        .pulse-effect-delayed { animation-delay: 1.25s; }
      `}} />

      {/* Top Navigation */}
      <header className="flex justify-between items-center w-full px-6 py-6 z-10">
        {step !== 'submitted' ? (
          <button onClick={() => step === 'idle' ? router.push('/') : setStep(step === 'details' ? 'select' : 'idle')} aria-label="Go back" className="w-12 h-12 flex items-center justify-center rounded-full bg-[#111111] border border-[#2C2C2E] active:scale-95 transition-transform hover:bg-[#181818]">
            <span className="material-symbols-outlined text-[#F5F5F5]">arrow_back</span>
          </button>
        ) : (
          <div className="w-12 h-12" />
        )}
        <div className="bg-[#FF3B30] text-[#F5F5F5] p-1 rounded-sm text-sm font-black font-h1 tracking-tighter">CC</div>
        <div className="w-12"></div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-margin text-center z-10 w-full max-w-md mx-auto">
        
        {step === 'idle' && (
          <div className="flex flex-col items-center w-full animate-[fade-up_0.3s_ease-out]">
            <div className="mb-xl">
              <h1 className="font-h1 text-h1 text-[#F5F5F5] mb-2">Emergency?</h1>
              <p className="font-body-md text-on-surface-variant max-w-[280px] mx-auto opacity-80">
                Press the button below to alert venue staff instantly.
              </p>
            </div>

            <div className="relative flex items-center justify-center w-[320px] h-[320px]">
              <div className="pulse-effect w-[200px] h-[200px]"></div>
              <div className="pulse-effect pulse-effect-delayed w-[200px] h-[200px]"></div>
              <button onClick={handleSOSPress} className="relative z-10 w-[200px] h-[200px] bg-[#FF3B30] rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,59,48,0.4)] border-4 border-[#FF3B30] active:scale-90 transition-transform duration-150">
                <span className="font-h1 text-[56px] text-[#F5F5F5] leading-none mb-1">SOS</span>
                <span className="font-tactical-label text-badge tracking-[0.2em] text-[#F5F5F5] opacity-90">TAP TO ALERT</span>
              </button>
            </div>

            <div className="mt-xl flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 bg-[#111111] border border-[#2C2C2E] px-4 py-2 rounded-full">
                <span className="material-symbols-outlined text-[#34C759] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                <span className="font-tactical-label text-badge text-[#34C759]">{location ? 'LOCATION CAPTURED' : 'LOCATING...'}</span>
              </div>
              <div className="font-tactical-data text-[10px] text-outline-variant uppercase tracking-widest mt-2">
                Secure link active • Encryption verified
              </div>
            </div>
          </div>
        )}

        {step === 'select' && (
          <div className="w-full flex flex-col w-full animate-[fade-up_0.3s_ease-out]">
            <h2 className="font-h2 text-h2 text-[#F5F5F5] mb-2 text-center">What&apos;s happening?</h2>
            <p className="text-center font-body-md text-on-surface-variant opacity-80 mb-8">Select the type of emergency</p>
            
            <div className="flex flex-col gap-3 w-full">
              {CRISIS_OPTIONS.map(c => (
                <button key={c.type} onClick={() => handleCrisisSelect(c.type)}
                  className="flex items-center gap-4 px-5 py-4 rounded-[20px] border border-[#2C2C2E] bg-[#181818] text-left transition-all hover:bg-[#202020] active:scale-[0.98]"
                  style={{ borderColor: '#2C2C2E' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.background = c.bg; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#2C2C2E'; e.currentTarget.style.background = '#181818'; }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
                    <span className="material-symbols-outlined text-2xl" style={{ color: c.color, fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
                  </div>
                  <span className="font-h3 text-[20px] text-[#F5F5F5]">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'details' && selected && (
          <div className="w-full flex flex-col w-full animate-[fade-up_0.3s_ease-out]">
            <div className="flex items-center gap-4 mb-8 bg-[#181818] border border-[#2C2C2E] p-4 rounded-[20px]">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: selected.bg }}>
                <span className="material-symbols-outlined text-3xl" style={{ color: selected.color, fontVariationSettings: "'FILL' 1" }}>{selected.icon}</span>
              </div>
              <div className="text-left">
                <p className="font-tactical-label text-badge text-outline-variant mb-1">REPORTING</p>
                <h2 className="font-h2 text-[24px] text-[#F5F5F5] leading-none">{selected.label}</h2>
              </div>
            </div>

            <div className="flex flex-col gap-5 w-full text-left">
              <div>
                <label className="font-tactical-label text-badge text-on-surface-variant mb-2 block uppercase tracking-widest">ROOM / FLOOR (OPTIONAL)</label>
                <input value={roomNumber} onChange={e => setRoomNumber(e.target.value)}
                  placeholder="e.g. Room 204, Lobby, Basement"
                  className="w-full px-5 py-4 rounded-[16px] border border-[#2C2C2E] bg-[#111111] font-body-md text-[#F5F5F5] outline-none focus:border-primary-container transition-colors" />
              </div>
              
              <div>
                <label className="font-tactical-label text-badge text-on-surface-variant mb-2 block uppercase tracking-widest">BRIEF DESCRIPTION (OPTIONAL)</label>
                <textarea value={description} onChange={e => setDescription(e.target.value.slice(0, 100))}
                  placeholder="What do you see? Max 100 characters." rows={3}
                  className="w-full px-5 py-4 rounded-[16px] border border-[#2C2C2E] bg-[#111111] font-body-md text-[#F5F5F5] outline-none resize-none focus:border-primary-container transition-colors" />
                <p className="font-tactical-data text-[10px] text-right mt-2 text-outline-variant">{description.length}/100</p>
              </div>

              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-4 rounded-[16px] font-h2 text-lg text-[#F5F5F5] mt-4 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                style={{ background: selected.color, opacity: loading ? 0.7 : 1 }}>
                <span className="material-symbols-outlined">warning</span>
                {loading ? 'SENDING ALERT...' : 'SEND EMERGENCY ALERT'}
              </button>
            </div>
          </div>
        )}

        {step === 'submitted' && selected && (
          <div className="w-full flex flex-col items-center text-center animate-[fade-up_0.3s_ease-out]">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(52,199,89,0.1)' }}>
              <span className="material-symbols-outlined text-[48px] text-[#34C759]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            
            <h2 className="font-h1 text-[32px] text-[#F5F5F5] mb-2">Alert Sent</h2>
            <p className="font-body-md text-on-surface-variant mb-8 max-w-[280px]">Help is on the way. Stay calm and follow staff instructions.</p>
            
            <div className="w-full rounded-[20px] p-6 bg-[#181818] border border-[#2C2C2E] text-left">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#2C2C2E]">
                <span className="material-symbols-outlined text-[#F5F5F5] text-sm">shield</span>
                <p className="font-tactical-label text-badge tracking-[0.2em] text-[#F5F5F5]">EMERGENCY PROTOCOLS</p>
              </div>
              
              <ul className="flex flex-col gap-3">
                {selected.type === 'fire' && (
                  <>
                    <li className="flex items-start gap-3"><span className="text-[#FF3B30] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Do NOT use elevators</span></li>
                    <li className="flex items-start gap-3"><span className="text-[#FF3B30] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Move to nearest exit/staircase</span></li>
                    <li className="flex items-start gap-3"><span className="text-[#FF3B30] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Stay low if there is smoke</span></li>
                    <li className="flex items-start gap-3"><span className="text-[#FF3B30] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Meet at assembly point outside</span></li>
                  </>
                )}
                {selected.type === 'flood' && (
                  <>
                    <li className="flex items-start gap-3"><span className="text-[#007AFF] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Move to higher floors immediately</span></li>
                    <li className="flex items-start gap-3"><span className="text-[#007AFF] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Avoid basement and parking areas</span></li>
                    <li className="flex items-start gap-3"><span className="text-[#007AFF] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Do not touch electrical switches</span></li>
                  </>
                )}
                {selected.type === 'earthquake' && (
                  <>
                    <li className="flex items-start gap-3"><span className="text-[#FF9500] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Drop, Cover, Hold On</span></li>
                    <li className="flex items-start gap-3"><span className="text-[#FF9500] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Stay away from windows</span></li>
                    <li className="flex items-start gap-3"><span className="text-[#FF9500] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Do not run outside during shaking</span></li>
                  </>
                )}
                {selected.type === 'medical' && (
                  <>
                    <li className="flex items-start gap-3"><span className="text-[#34C759] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Keep the person calm and still</span></li>
                    <li className="flex items-start gap-3"><span className="text-[#34C759] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Do not move them if injured</span></li>
                    <li className="flex items-start gap-3"><span className="text-[#34C759] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Medical team is being dispatched</span></li>
                  </>
                )}
                {selected.type === 'stampede' && (
                  <>
                    <li className="flex items-start gap-3"><span className="text-[#AF52DE] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Move to side walls / edges</span></li>
                    <li className="flex items-start gap-3"><span className="text-[#AF52DE] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Stay on your feet</span></li>
                    <li className="flex items-start gap-3"><span className="text-[#AF52DE] mt-1">•</span><span className="font-body-md text-[#A1A1AA]">Follow staff evacuation signals</span></li>
                  </>
                )}
              </ul>
            </div>
            <p className="font-tactical-data text-[10px] text-outline-variant mt-6 uppercase tracking-widest">REF: {incidentId.slice(0, 8)}</p>
          </div>
        )}
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-[#1F0F0D]/40 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#2C2C2E]/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#2C2C2E]/10 rounded-full"></div>
      </div>

      {/* Bottom Contextual Footer */}
      {step === 'idle' && (
        <footer className="p-margin flex justify-center items-center gap-6 z-10 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
            <span className="font-tactical-label text-[10px] text-on-surface-variant tracking-widest">GPS ACCURACY: ±3M</span>
          </div>
          <div className="w-px h-3 bg-[#2C2C2E]"></div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-tactical-label text-[10px] text-on-surface-variant tracking-widest">SIGNAL: EXCELLENT</span>
          </div>
        </footer>
      )}
    </div>
  );
}
