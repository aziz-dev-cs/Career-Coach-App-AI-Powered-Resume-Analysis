'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, BookOpen, ExternalLink } from 'lucide-react';

interface CareerAdvice {
  insights: string[];
  skills: Array<{
    name: string;
    demand: number;
    resources: string[];
  }>;
  roadmap: string[];
}

export default function CareerAdvicePage() {
  const [advice, setAdvice] = useState<CareerAdvice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const response = await fetch('/api/v1/user/career-advice');
        const data = await response.json();
        setAdvice(data);
      } catch (error) {
        console.error('Failed to fetch career advice:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Career Advice</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Personalized insights to accelerate your career growth
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>
            Based on your resume, interview performance, and industry trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {advice?.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>In-Demand Skills</CardTitle>
          <CardDescription>
            Skills that can boost your career prospects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {advice?.skills.map((skill) => (
              <div key={skill.name} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{skill.name}</h3>
                  <Badge variant={skill.demand > 70 ? "default" : "secondary"}>
                    {skill.demand}% Demand
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${skill.demand}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {skill.resources.map((resource) => (
                    <Button key={resource} variant="outline" size="sm">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {resource}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Career Roadmap</CardTitle>
          <CardDescription>
            Recommended next steps for your career growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-6">
              {advice?.roadmap.map((step, index) => (
                <div key={index} className="relative pl-10">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}