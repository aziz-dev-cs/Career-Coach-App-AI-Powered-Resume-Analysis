'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  score: number;
}

export function ScoreCard({ score }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent! Your resume is highly competitive';
    if (score >= 60) return 'Good! A few improvements could make it great';
    return 'Needs improvement. Follow our suggestions to boost your score';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="text-center border-b">
        <CardTitle>Overall Resume Score</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 mb-4">
            <span className={cn('text-5xl font-bold', getScoreColor(score))}>
              {Math.round(score)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{getScoreMessage(score)}</p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Score</span>
              <span className={cn('font-semibold', getScoreColor(score))}>{Math.round(score)}%</span>
            </div>
            <Progress value={score} className={cn('h-2', getProgressColor(score))} />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Trophy className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Top {100 - Math.min(95, Math.floor(score))}%</p>
              <p className="text-xs font-medium">of resumes</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Potential</p>
              <p className="text-xs font-medium">+{Math.max(0, 100 - Math.round(score))}% improvement</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}