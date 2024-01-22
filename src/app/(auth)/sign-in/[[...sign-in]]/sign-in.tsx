'use client';

import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Briefcase, Sparkles } from 'lucide-react';

export default function SignInPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Briefcase className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Sign in to continue your career journey
        </p>
      </div>
      
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white dark:bg-gray-800 shadow-xl rounded-2xl",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton: "rounded-lg border-2 hover:border-primary transition-all",
            formButtonPrimary: "bg-primary hover:bg-primary/90 rounded-lg",
            footerActionLink: "text-primary hover:text-primary/90",
          },
        }}
        routing="path"
        path="/sign-in"
      />
      
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span>Secure authentication powered by Clerk</span>
        </div>
      </div>
    </motion.div>
  );
}