import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppMode = "party" | "solo" | "recovery" | null;

export interface PartyData {
  people: number;
  budget: number;
  splitType: "equally" | "custom";
  drinkPrefs: string[];
  tastePrefs: string[];
  foodItems: { name: string; qty: number }[];
  date: string;
  state: string;
  drinkSegment: string;
}

export interface SoloData {
  mood: string;
  occasion: string;
  budget: number;
  preferences: string[];
  dateTime: string;
}

export interface RecoveryData {
  symptoms: string[];
  drinkingLevel: string;
  lastDrinkTime: string;
  foodPref: string;
  ingredients: string[];
}

export interface PlanOutput {
  type: AppMode;
  data: string | null; // raw JSON string from API
  generatedAt: string | null;
}

interface AppStore {
  // Mode
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // Party planner
  partyData: PartyData;
  updatePartyData: (updates: Partial<PartyData>) => void;
  resetPartyData: () => void;

  // Solo mode
  soloData: SoloData;
  updateSoloData: (updates: Partial<SoloData>) => void;
  resetSoloData: () => void;

  // Recovery
  recoveryData: RecoveryData;
  updateRecoveryData: (updates: Partial<RecoveryData>) => void;
  resetRecoveryData: () => void;

  // Plan output
  planOutput: PlanOutput;
  setPlanOutput: (data: string) => void;
  clearPlanOutput: () => void;

  // Global reset
  resetAll: () => void;
}

const defaultPartyData: PartyData = {
  people: 8,
  budget: 7000,
  splitType: "equally",
  drinkPrefs: [],
  tastePrefs: [],
  foodItems: [],
  date: "",
  state: "",
  drinkSegment: "mid",
};

const defaultSoloData: SoloData = {
  mood: "",
  occasion: "",
  budget: 1500,
  preferences: [],
  dateTime: "",
};

const defaultRecoveryData: RecoveryData = {
  symptoms: [],
  drinkingLevel: "",
  lastDrinkTime: "",
  foodPref: "",
  ingredients: [],
};

const defaultPlanOutput: PlanOutput = {
  type: null,
  data: null,
  generatedAt: null,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      mode: null,
      setMode: (mode) => set({ mode }),

      partyData: defaultPartyData,
      updatePartyData: (updates) =>
        set((state) => ({ partyData: { ...state.partyData, ...updates } })),
      resetPartyData: () => set({ partyData: defaultPartyData }),

      soloData: defaultSoloData,
      updateSoloData: (updates) =>
        set((state) => ({ soloData: { ...state.soloData, ...updates } })),
      resetSoloData: () => set({ soloData: defaultSoloData }),

      recoveryData: defaultRecoveryData,
      updateRecoveryData: (updates) =>
        set((state) => ({ recoveryData: { ...state.recoveryData, ...updates } })),
      resetRecoveryData: () => set({ recoveryData: defaultRecoveryData }),

      planOutput: defaultPlanOutput,
      setPlanOutput: (data) =>
        set((state) => ({
          planOutput: { type: state.mode, data, generatedAt: new Date().toISOString() },
        })),
      clearPlanOutput: () => set({ planOutput: defaultPlanOutput }),

      resetAll: () =>
        set({
          mode: null,
          partyData: defaultPartyData,
          soloData: defaultSoloData,
          recoveryData: defaultRecoveryData,
          planOutput: defaultPlanOutput,
        }),
    }),
    {
      name: "dtd-app-store",
      partialize: (state) => ({
        mode: state.mode,
        partyData: state.partyData,
        soloData: state.soloData,
        recoveryData: state.recoveryData,
      }),
    }
  )
);
