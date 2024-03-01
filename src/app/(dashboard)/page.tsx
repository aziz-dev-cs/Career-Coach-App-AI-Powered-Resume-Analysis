'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  TrendingUp, 
  FileText, 
  Mic, 
  Award,
  ArrowUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/dashboard/metrics/StatCard';
import { RecentActivityFeed } from '@/components/dashboard/metrics/RecentActivityFeed';
import { ResumeScoreTrend } from '@/components/dashboard/charts/ResumeScoreTrend';
import { InterviewPerformanceRadar } from '@/components/dashboard/charts/InterviewPerformanceRadar';
import Link from 'next/link';

interface DashboardStats {
  resumeScore: number;
  interviewScore: number;
  totalInterviews: number;
  improvements: number;
  recentActivity: any[];
}

export default function DashboardPage() {
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/v1/user/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || 'Professional'}! 👋
        </h1>
        <p className="text-blue-100">
          Your career journey is progressing. Keep up the great work!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Resume Score"
          value={`${stats?.resumeScore || 0}%`}
          icon={FileText}
          trend={+12}
          color="blue"
        />
        <StatCard
          title="Interview Performance"
          value={`${stats?.interviewScore || 0}%`}
          icon={Mic}
          trend={+8}
          color="purple"
        />
        <StatCard
          title="Interviews Completed"
          value={stats?.totalInterviews || 0}
          icon={TrendingUp}
          trend={+5}
          color="green"
        />
        <StatCard
          title="Improvement Rate"
          value={`${stats?.improvements || 0}%`}
          icon={Award}
          trend={+15}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResumeScoreTrend />
        <InterviewPerformanceRadar />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/resume/upload">
          <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Upload Resume
              </CardTitle>
              <CardDescription>
                Get AI-powered analysis and suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors">
                Click to upload → 
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/interview/setup">
          <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-purple-500" />
                Practice Interview
              </CardTitle>
              <CardDescription>
                Mock interview with AI feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 group-hover:text-purple-500 transition-colors">
                Start practicing →
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/career/advice">
          <Card className="hover:shadow-lg transition-all cursor-pointer group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Career Advice
              </CardTitle>
              <CardDescription>
                Personalized career recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 group-hover:text-green-500 transition-colors">
                Get insights →
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <RecentActivityFeed />
    </div>
  );
}