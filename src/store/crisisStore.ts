import { create } from 'zustand';
import { Incident, UserRole } from '@/types';

interface CrisisStore {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  selectedIncident: Incident | null;
  setSelectedIncident: (incident: Incident | null) => void;
  isAlertSoundEnabled: boolean;
  toggleAlertSound: () => void;
}

export const useCrisisStore = create<CrisisStore>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
  selectedIncident: null,
  setSelectedIncident: (incident) => set({ selectedIncident: incident }),
  isAlertSoundEnabled: true,
  toggleAlertSound: () => set((s) => ({ isAlertSoundEnabled: !s.isAlertSoundEnabled })),
}));
