'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SignInButton, SignUpButton, useAuth } from '@clerk/nextjs';
import { 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Mic, 
  Sparkles,
  ArrowRight 
} from 'lucide-react';

export default function LandingPage() {
  const { isSignedIn } = useAuth();

  const features = [
    {
      icon: FileText,
      title: 'Resume Analysis',
      description: 'AI-powered resume review with personalized suggestions',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MessageSquare,
      title: 'Mock Interviews',
      description: 'Practice with realistic questions and get instant feedback',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Mic,
      title: 'Voice Practice',
      description: 'Natural voice interviews with real-time analysis',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your improvement over time',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-8">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Career Coach</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Land Your Dream Job
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Get personalized resume feedback, practice with AI mock interviews, 
                and track your career growth — all in one place.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                {!isSignedIn ? (
                  <>
                    <SignUpButton mode="modal">
                      <button className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all transform hover:scale-105">
                        Get Started Free
                      </button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                      <button className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:border-primary hover:text-primary transition-all">
                        Sign In
                      </button>
                    </SignInButton>
                  </>
                ) : (
                  <Link href="/dashboard">
                    <button className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all transform hover:scale-105">
                      Go to Dashboard
                      <ArrowRight className="inline ml-2 w-5 h-5" />
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">Everything You Need to Succeed</h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Powerful AI tools to accelerate your career journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 dark:bg-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Career?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of professionals who landed their dream jobs with Career Coach AI
          </p>
          {!isSignedIn && (
            <SignUpButton mode="modal">
              <button className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-all">
                Start Your Free Trial
              </button>
            </SignUpButton>
          )}
        </div>
      </div>
    </div>
  );
}