'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  date: string;
  score: number;
}

export function ResumeScoreTrend() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/v1/user/resume-trend');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch trend data:', error);
        // Mock data for demo
        setData([
          { date: 'Jan', score: 65 },
          { date: 'Feb', score: 72 },
          { date: 'Mar', score: 78 },
          { date: 'Apr', score: 85 },
          { date: 'May', score: 88 },
          { date: 'Jun', score: 92 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Score Trend</CardTitle>
        <CardDescription>Your resume improvement over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-xs" />
              <YAxis domain={[0, 100]} className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(221.2 83.2% 53.3%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(221.2 83.2% 53.3%)', strokeWidth: 2 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}