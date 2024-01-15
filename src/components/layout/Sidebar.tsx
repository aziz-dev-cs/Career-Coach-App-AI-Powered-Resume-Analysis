'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Mic,
  TrendingUp,
  Settings,
  Award,
  MessageSquare,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Resume Analysis', href: '/resume/upload', icon: FileText },
  { name: 'Mock Interviews', href: '/interview', icon: Mic },
  { name: 'Career Advice', href: '/career/advice', icon: TrendingUp },
  { name: 'Progress', href: '/dashboard#progress', icon: Award },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:bg-background">
      <div className="flex flex-col flex-1 pt-8 pb-4 overflow-y-auto">
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground'
                  )}
                />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-1 h-8 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section with tips */}
        <div className="px-4 mt-8">
          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <MessageSquare className="h-8 w-8 mb-2" />
            <p className="text-sm font-semibold mb-1">Need help?</p>
            <p className="text-xs opacity-90 mb-3">Get personalized career advice from our AI coach</p>
            <button className="text-xs bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 transition-colors w-full">
              Chat with AI
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}