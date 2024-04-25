'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResumeUploader } from '@/components/resume/upload/ResumeUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function ResumeUploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleUploadSuccess = (resumeId: string) => {
    router.push(`/resume/${resumeId}/analyze`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Upload Your Resume</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Let our AI analyze your resume and provide personalized improvement suggestions
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Supported formats: PDF, DOCX, TXT (Max size: 5MB). Your data is encrypted and private.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Resume Upload</CardTitle>
          <CardDescription>
            Drag and drop your resume file or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResumeUploader onSuccess={handleUploadSuccess} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What happens next?</CardTitle>
          <CardDescription>
            Our AI will analyze your resume and provide:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
              <span>Overall resume score based on industry standards</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
              <span>Detailed feedback on structure, content, and formatting</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
              <span>Keyword optimization for ATS (Applicant Tracking Systems)</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2" />
              <span>Actionable suggestions to improve each section</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}