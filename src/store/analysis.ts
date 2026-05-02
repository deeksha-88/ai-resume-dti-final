import { create } from "zustand";
import { AnalysisResult } from "@/lib/analysis";

type State = {
  result: AnalysisResult | null;
  setResult: (r: AnalysisResult | null) => void;
};

export const useAnalysis = create<State>((set) => ({
  result: null,
  setResult: (r) => set({ result: r }),
}));
