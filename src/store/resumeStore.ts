import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: any[];
  keywordMatches: Record<string, number>;
}

interface ResumeState {
  currentResumeId: string | null;
  currentResumeContent: string | null;
  analysis: ResumeAnalysis | null;
  isAnalyzing: boolean;
  tailoringSessionId: string | null;
  tailoredContent: string | null;
  
  setCurrentResume: (id: string, content: string) => void;
  setAnalysis: (analysis: ResumeAnalysis) => void;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setTailoredContent: (sessionId: string, content: string) => void;
  clearTailoredContent: () => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      currentResumeId: null,
      currentResumeContent: null,
      analysis: null,
      isAnalyzing: false,
      tailoringSessionId: null,
      tailoredContent: null,
      
      setCurrentResume: (id, content) =>
        set({ currentResumeId: id, currentResumeContent: content }),
      
      setAnalysis: (analysis) =>
        set({ analysis }),
      
      setIsAnalyzing: (isAnalyzing) =>
        set({ isAnalyzing }),
      
      setTailoredContent: (sessionId, content) =>
        set({ tailoringSessionId: sessionId, tailoredContent: content }),
      
      clearTailoredContent: () =>
        set({ tailoringSessionId: null, tailoredContent: null }),
      
      reset: () =>
        set({
          currentResumeId: null,
          currentResumeContent: null,
          analysis: null,
          isAnalyzing: false,
          tailoringSessionId: null,
          tailoredContent: null
        })
    }),
    {
      name: 'resume-storage'
    }
  )
);