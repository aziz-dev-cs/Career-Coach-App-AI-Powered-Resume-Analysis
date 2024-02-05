import { useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';

export function useResumeAnalysis() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAnalysis, setIsAnalyzing } = useResumeStore();

  const analyzeResume = async (resumeId: string) => {
    setLoading(true);
    setError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch(`/api/v1/resume/${resumeId}/analysis`);
      
      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      setAnalysis(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
      setIsAnalyzing(false);
    }
  };

  const tailorResume = async (resumeId: string, jobDescription: string, jobTitle?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/resume/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId, jobDescription, jobTitle })
      });

      if (!response.ok) {
        throw new Error('Failed to tailor resume');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzeResume,
    tailorResume,
    loading,
    error
  };
}