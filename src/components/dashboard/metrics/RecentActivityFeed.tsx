'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Mic, TrendingUp, Award, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  type: string;
  title: string;
  date: Date;
  score?: number;
  icon: string;
}

const iconMap: Record<string, any> = {
  FileText: FileText,
  Mic: Mic,
  TrendingUp: TrendingUp,
  Award: Award,
};

export function RecentActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/v1/user/activity');
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest actions and progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activity yet. Start by uploading a resume or taking an interview!
            </div>
          ) : (
            activities.map((activity, index) => {
              const IconComponent = iconMap[activity.icon] || FileText;
              return (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className="p-2 rounded-full bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                      </p>
                      {activity.score && (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span className="text-xs font-medium text-green-600">Score: {activity.score}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}