'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OverallScore } from '@/components/interview/feedback/OverallScore';
import { PerQuestionFeedback } from '@/components/interview/feedback/PerQuestionFeedback';
import { ImprovementTips } from '@/components/interview/feedback/ImprovementTips';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, RotateCcw, Share2 } from 'lucide-react';

interface InterviewResults {
  overallScore: number;
  feedback: {
    clarity: number;
    confidence: number;
    relevance: number;
  };
  questions: Array<{
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }>;
  suggestions: string[];
}

export default function InterviewResultsPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [results, setResults] = useState<InterviewResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/v1/interview/${sessionId}/results`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load results. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Interview Results</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Here's how you performed and how to improve
        </p>
      </div>

      <OverallScore 
        score={results.overallScore}
        metrics={results.feedback}
      />

      <Tabs defaultValue="questions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questions">Question Feedback</TabsTrigger>
          <TabsTrigger value="improvements">Improvement Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <PerQuestionFeedback questions={results.questions} />
        </TabsContent>

        <TabsContent value="improvements">
          <ImprovementTips suggestions={results.suggestions} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="flex justify-center gap-4 pt-6">
          <Link href="/interview">
            <Button variant="outline">
              <RotateCcw className="mr-2 w-4 h-4" />
              Practice Again
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="mr-2 w-4 h-4" />
            Download Report
          </Button>
          <Button>
            <Share2 className="mr-2 w-4 h-4" />
            Share Progress
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}