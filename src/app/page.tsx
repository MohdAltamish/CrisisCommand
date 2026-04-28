'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const STAFF_PIN = process.env.NEXT_PUBLIC_STAFF_PIN || '1234';

export default function LandingPage() {
  const router = useRouter();
  const [pinModal, setPinModal] = useState<'staff' | 'admin' | null>(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleProtectedEntry = (role: 'staff' | 'admin') => {
    setPinModal(role);
    setPin('');
    setPinError(false);
  };

  const submitPin = () => {
    if (pin === STAFF_PIN) {
      router.push(`/${pinModal}`);
    } else {
      setPinError(true);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .role-card:hover { box-shadow: 0 0 30px rgba(255, 59, 48, 0.15); }
        .pulse-red { animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse-ring { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      ` }} />

      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#080808] border-b border-[#2C2C2E]">
        <div className="flex items-center gap-3">
          <div className="bg-[#FF3B30] text-[#F5F5F5] p-1 rounded-sm text-xl font-black flex items-center justify-center">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
          <span className="font-['Syne'] font-bold tracking-tight text-[#F5F5F5] text-2xl">CRISISCOMMAND</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="font-tactical-label text-outline uppercase">SOLUTION CHALLENGE 2026</span>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors">notifications_active</button>
            <button className="material-symbols-outlined text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors">account_circle</button>
          </div>
        </div>
      </header>

      <main className="relative min-h-screen pt-24 pb-20 px-margin flex flex-col items-center justify-center overflow-hidden">
        {/* Background Ambient Image */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9SzwnLzSM_w8jkcVF_m46K17Qf3RG0CXfSP-OkQ7Ff8CqHzYmEPCgya4fTj0LVVSgWrc7RNTb3mm3COxqEld3yzg5m2qyR4iwtdE3e90BnFDYYUR09Amgalplb8TPbImiGcKDKw8Yn6C-H6T9rXxzQbMbjHGtAoxUYPzhtPcGzZo78lBts49SFl7VPcVfM8Xe4y6evCGeNIZ8z2eLP6yK8JIrP5_rbcQcPv24dXRjNrZuPSvtsMRE6799Vu1LqLak1wFX8_U3AV8g')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]"></div>
        </div>

        {/* Hero Section */}
        <section className="relative z-10 text-center max-w-4xl mx-auto mb-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-container/30 bg-primary-container/10 mb-md">
            <span className="w-2 h-2 rounded-full bg-primary-container pulse-red"></span>
            <span className="font-badge text-badge text-primary-container tracking-[0.2em] uppercase">EMERGENCY RESPONSE SYSTEM</span>
          </div>
          <h1 className="font-h1 text-[56px] md:text-[80px] leading-[1] mb-xs">
            <span className="block text-[#F5F5F5]">Instant. Coordinated.</span>
            <span className="block text-[#FF3B30]">Life-saving.</span>
          </h1>
          <p className="font-body-lg text-outline-variant max-w-2xl mx-auto mt-6">
            Real-time crisis detection and response for hospitality venues across India. Precision engineering for high-stakes environments.
          </p>
        </section>

        {/* Role Selection Bento Grid */}
        <section className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-gutter w-full max-w-6xl mx-auto">
          {/* Guest Role Card */}
          <div className="role-card group bg-[#181818] border border-[#2C2C2E] p-md rounded-[20px] transition-all duration-300 hover:border-primary-container/50 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center mb-md group-hover:bg-primary-container/20 transition-colors">
                <span className="material-symbols-outlined text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>person_pin_circle</span>
              </div>
              <h3 className="font-h3 text-on-surface mb-xs">Venue Guest</h3>
              <p className="font-body-md text-outline-variant">Immediate assistance, emergency reporting, and evacuation guidance in the palm of your hand.</p>
            </div>
            <button onClick={() => router.push('/guest')} className="mt-lg w-full py-3 px-6 rounded-full bg-[#F5F5F5] text-[#080808] font-h2 text-sm flex items-center justify-center gap-2 group-hover:scale-[0.98] transition-transform">
              REPORT EMERGENCY <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Staff Role Card */}
          <div className="role-card group bg-[#181818] border border-[#2C2C2E] p-md rounded-[20px] transition-all duration-300 hover:border-tertiary/50 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center mb-md group-hover:bg-tertiary/20 transition-colors">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>engineering</span>
              </div>
              <h3 className="font-h3 text-on-surface mb-xs">Hospitality Staff</h3>
              <p className="font-body-md text-outline-variant">Receive tactical alerts, coordinate room sweeps, and communicate with emergency responders.</p>
            </div>
            <button onClick={() => handleProtectedEntry('staff')} className="mt-lg w-full py-3 px-6 rounded-full border border-tertiary/30 text-tertiary font-h2 text-sm flex items-center justify-center gap-2 hover:bg-tertiary/10 transition-all">
              STAFF PORTAL <span className="material-symbols-outlined text-sm">login</span>
            </button>
          </div>

          {/* Admin Role Card */}
          <div className="role-card group bg-[#181818] border border-[#2C2C2E] p-md rounded-[20px] transition-all duration-300 hover:border-secondary/50 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-md group-hover:bg-secondary/20 transition-colors">
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              </div>
              <h3 className="font-h3 text-on-surface mb-xs">System Admin</h3>
              <p className="font-body-md text-outline-variant">Command center operations, data telemetry, and multisite security management for operations.</p>
            </div>
            <button onClick={() => handleProtectedEntry('admin')} className="mt-lg w-full py-3 px-6 rounded-full border border-[#2C2C2E] text-[#F5F5F5] font-h2 text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              ADMIN DASHBOARD <span className="material-symbols-outlined text-sm">monitoring</span>
            </button>
          </div>
        </section>

        {/* Telemetry Readout Decorations */}
        <div className="mt-xl hidden md:flex items-center gap-12 border-t border-[#2C2C2E]/30 pt-md w-full max-w-6xl">
          <div className="flex flex-col">
            <span className="font-tactical-label text-[10px] text-outline uppercase">Active Nodes</span>
            <span className="font-tactical-data text-primary">1,204 ONLINE</span>
          </div>
          <div className="flex flex-col">
            <span className="font-tactical-label text-[10px] text-outline uppercase">Response Latency</span>
            <span className="font-tactical-data text-[#F5F5F5]">142ms</span>
          </div>
          <div className="flex flex-col">
            <span className="font-tactical-label text-[10px] text-outline uppercase">System Status</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="font-tactical-data text-[#F5F5F5]">OPTIMAL</span>
            </div>
          </div>
        </div>
      </main>

      {/* PIN Modal Overlay */}
      {pinModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/80 backdrop-blur-sm">
          <div className="bg-[#181818] border border-[#2C2C2E] rounded-2xl p-8 w-80 animate-[fade-up_0.3s_ease-out]">
            <h3 className="text-xl font-bold font-h2 text-on-surface mb-2">Enter PIN</h3>
            <p className="text-sm text-outline-variant mb-6">
              {pinModal === 'staff' ? 'Staff' : 'Admin'} access required
            </p>
            <input
              type="password"
              value={pin}
              onChange={e => { setPin(e.target.value); setPinError(false); }}
              onKeyDown={e => e.key === 'Enter' && submitPin()}
              placeholder="Enter PIN"
              className="w-full px-4 py-3 rounded-xl font-tactical-data text-lg text-center outline-none border mb-2 bg-[#080808] text-white"
              style={{ borderColor: pinError ? '#FF3B30' : '#2C2C2E' }}
              autoFocus
            />
            {pinError && <p className="text-xs text-center mb-4 text-[#FF3B30]">Incorrect PIN</p>}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setPinModal(null)} className="flex-1 py-3 rounded-xl text-sm font-semibold border border-[#2C2C2E] text-outline-variant hover:bg-[#2C2C2E] transition-colors">
                Cancel
              </button>
              <button onClick={submitPin} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-primary-container hover:bg-primary-container/80 transition-colors">
                Enter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
