'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  color?: 'blue' | 'purple' | 'green' | 'orange';
}

const colorGradients = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
};

const iconBgColors = {
  blue: 'bg-blue-100 dark:bg-blue-900/30',
  purple: 'bg-purple-100 dark:bg-purple-900/30',
  green: 'bg-green-100 dark:bg-green-900/30',
  orange: 'bg-orange-100 dark:bg-orange-900/30',
};

const iconColors = {
  blue: 'text-blue-600 dark:text-blue-400',
  purple: 'text-purple-600 dark:text-purple-400',
  green: 'text-green-600 dark:text-green-400',
  orange: 'text-orange-600 dark:text-orange-400',
};

export function StatCard({ title, value, icon: Icon, trend, color = 'blue' }: StatCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('p-3 rounded-xl', iconBgColors[color])}>
            <Icon className={cn('h-6 w-6', iconColors[color])} />
          </div>
          {trend !== undefined && (
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trend >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              <span>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </CardContent>
      <div className={cn('h-1 bg-gradient-to-r', colorGradients[color])} />
    </Card>
  );
}