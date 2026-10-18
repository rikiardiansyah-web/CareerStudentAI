import { create } from "zustand";

export type TabId = "dashboard" | "cv-analyzer" | "skill-gap" | "mock-interview" | "career-discovery";

export interface UserPersona {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  summary?: string;
  educationLevel: "FINAL_YEAR_STUDENT" | "FRESH_GRADUATE";
  targetRoleTitle: string;
  targetRoleId: string;
  isAuthenticated: boolean;
}

interface AppState {
  persona: UserPersona;
  activeTab: TabId;
  offlineDraftCount: number;
  setPersona: (persona: Partial<UserPersona>) => void;
  clearPersona: () => void;
  setActiveTab: (tab: TabId) => void;
  incrementDraftCount: () => void;
  resetDraftCount: () => void;
}

const DEFAULT_GUEST_PERSONA: UserPersona = {
  name: "Tamu",
  educationLevel: "FINAL_YEAR_STUDENT",
  targetRoleTitle: "Pilih Target Karier",
  targetRoleId: "pm_jr",
  isAuthenticated: false,
};

export const useAppStore = create<AppState>((set) => ({
  persona: DEFAULT_GUEST_PERSONA,
  activeTab: "dashboard",
  offlineDraftCount: 0,
  setPersona: (newPersona) =>
    set((state) => ({ persona: { ...state.persona, ...newPersona } })),
  clearPersona: () =>
    set({ persona: DEFAULT_GUEST_PERSONA }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  incrementDraftCount: () =>
    set((state) => ({ offlineDraftCount: state.offlineDraftCount + 1 })),
  resetDraftCount: () => set({ offlineDraftCount: 0 }),
}));
