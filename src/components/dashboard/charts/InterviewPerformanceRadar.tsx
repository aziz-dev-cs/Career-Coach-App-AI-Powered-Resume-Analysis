'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

interface Metric {
  subject: string;
  value: number;
  fullMark: number;
}

export function InterviewPerformanceRadar() {
  const [data, setData] = useState<Metric[]>([]);

  useEffect(() => {
    // Fetch or use mock data
    setData([
      { subject: 'Clarity', value: 85, fullMark: 100 },
      { subject: 'Confidence', value: 78, fullMark: 100 },
      { subject: 'Relevance', value: 88, fullMark: 100 },
      { subject: 'Structure', value: 82, fullMark: 100 },
      { subject: 'Examples', value: 75, fullMark: 100 },
      { subject: 'Delivery', value: 80, fullMark: 100 },
    ]);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Performance</CardTitle>
        <CardDescription>Your strengths and areas for improvement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid className="stroke-muted" />
              <PolarAngleAxis dataKey="subject" className="text-xs" tick={{ fill: 'currentColor' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
              <Radar
                name="Performance"
                dataKey="value"
                stroke="hsl(271.5 81.3% 55.9%)"
                fill="hsl(271.5 81.3% 55.9%)"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}