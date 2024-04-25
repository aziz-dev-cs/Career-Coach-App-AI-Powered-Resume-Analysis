'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MessageSquare, Clock, Target, ArrowRight } from 'lucide-react';

export default function InterviewPage() {
  const interviewTypes = [
    {
      id: 'text',
      title: 'Text Interview',
      description: 'Practice with written responses',
      icon: MessageSquare,
      color: 'blue',
      href: '/interview/setup?type=text',
      features: ['Unlimited practice', 'Instant feedback', 'Review history'],
    },
    {
      id: 'voice',
      title: 'Voice Interview',
      description: 'Realistic voice conversation',
      icon: Mic,
      color: 'purple',
      href: '/interview/setup?type=voice',
      features: ['Speech analysis', 'Confidence scoring', 'Real-time feedback'],
    },
  ];

  const recentInterviews = [
    {
      id: 1,
      role: 'Senior Frontend Developer',
      date: '2024-01-15',
      score: 85,
      duration: '15 min',
    },
    {
      id: 2,
      role: 'Product Manager',
      date: '2024-01-10',
      score: 72,
      duration: '20 min',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mock Interviews</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Practice with AI-powered interviews and get instant feedback
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interviewTypes.map((type) => (
          <Card key={type.id} className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className={`inline-flex p-3 rounded-lg bg-${type.color}-100 dark:bg-${type.color}-900/30 mb-4 w-fit`}>
                <type.icon className={`w-6 h-6 text-${type.color}-600 dark:text-${type.color}-400`} />
              </div>
              <CardTitle>{type.title}</CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {type.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={type.href}>
                <Button className="w-full">
                  Start Practice
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {recentInterviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Interviews</CardTitle>
            <CardDescription>Continue practicing or review feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{interview.role}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {interview.duration}
                      </span>
                      <span>{interview.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{interview.score}%</div>
                    <div className="text-sm text-gray-500">Score</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}