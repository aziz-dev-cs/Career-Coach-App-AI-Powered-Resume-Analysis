'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ResumeAnalyzer } from '@/components/resume/analysis/ResumeAnalyzer';
import { ScoreCard } from '@/components/resume/analysis/ScoreCard';
import { WeaknessList } from '@/components/resume/analysis/WeaknessList';
import { SuggestionItem } from '@/components/resume/analysis/SuggestionItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface AnalysisData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: Array<{
    section: string;
    original: string;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  keywordMatches: Record<string, number>;
}

export default function ResumeAnalysisPage() {
  const params = useParams();
  const resumeId = params.id as string;
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/v1/resume/${resumeId}/analysis`);
        const data = await response.json();
        setAnalysis(data);
      } catch (error) {
        console.error('Failed to fetch analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Analyzing your resume with AI...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load analysis. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Resume Analysis</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's how your resume performs and how to improve it
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ScoreCard score={analysis.score} />
        </div>
        <div className="lg:col-span-2">
          <WeaknessList weaknesses={analysis.weaknesses} />
        </div>
      </div>

      <Tabs defaultValue="suggestions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suggestions">Improvement Suggestions</TabsTrigger>
          <TabsTrigger value="keywords">Keyword Analysis</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          {analysis.suggestions.map((suggestion, index) => (
            <SuggestionItem key={index} {...suggestion} />
          ))}
        </TabsContent>

        <TabsContent value="keywords">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Keyword Matches</h3>
            <div className="space-y-3">
              {Object.entries(analysis.keywordMatches).map(([keyword, count]) => (
                <div key={keyword} className="flex items-center justify-between">
                  <span className="text-sm">{keyword}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${Math.min(count * 10, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{count}x</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="strengths">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Your Strengths</h3>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}