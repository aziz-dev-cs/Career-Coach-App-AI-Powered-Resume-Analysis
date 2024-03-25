import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface InterviewState {
  sessionId: string | null;
  type: 'text' | 'voice' | null;
  role: string | null;
  experienceLevel: string | null;
  questions: string[];
  currentQuestionIndex: number;
  answers: string[];
  messages: Message[];
  isRecording: boolean;
  isProcessing: boolean;
  
  setSession: (sessionId: string, type: 'text' | 'voice', role: string, experienceLevel: string) => void;
  setQuestions: (questions: string[]) => void;
  addAnswer: (answer: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  nextQuestion: () => void;
  setIsRecording: (isRecording: boolean) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set) => ({
      sessionId: null,
      type: null,
      role: null,
      experienceLevel: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      messages: [],
      isRecording: false,
      isProcessing: false,
      
      setSession: (sessionId, type, role, experienceLevel) =>
        set({ sessionId, type, role, experienceLevel }),
      
      setQuestions: (questions) =>
        set({ questions }),
      
      addAnswer: (answer) =>
        set((state) => ({
          answers: [...state.answers, answer]
        })),
      
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: Math.random().toString(36).substring(7),
              timestamp: new Date()
            }
          ]
        })),
      
      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: state.currentQuestionIndex + 1
        })),
      
      setIsRecording: (isRecording) =>
        set({ isRecording }),
      
      setIsProcessing: (isProcessing) =>
        set({ isProcessing }),
      
      reset: () =>
        set({
          sessionId: null,
          type: null,
          role: null,
          experienceLevel: null,
          questions: [],
          currentQuestionIndex: 0,
          answers: [],
          messages: [],
          isRecording: false,
          isProcessing: false
        })
    }),
    {
      name: 'interview-storage'
    }
  )
);