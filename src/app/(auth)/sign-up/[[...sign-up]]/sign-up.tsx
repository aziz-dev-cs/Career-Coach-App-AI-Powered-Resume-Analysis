'use client';

import { SignUp } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Rocket, Sparkles } from 'lucide-react';

export default function SignUpPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
          <Rocket className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Start your journey to landing your dream job
        </p>
      </div>
      
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white dark:bg-gray-800 shadow-xl rounded-2xl",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton: "rounded-lg border-2 hover:border-primary transition-all",
            formButtonPrimary: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg",
            footerActionLink: "text-primary hover:text-primary/90",
          },
        }}
        routing="path"
        path="/sign-up"
      />
      
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span>Join 10,000+ professionals who leveled up their careers</span>
        </div>
      </div>
    </motion.div>
  );
}