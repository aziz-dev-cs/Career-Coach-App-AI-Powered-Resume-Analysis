'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { JobDescriptionInput } from '@/components/resume/tailoring/JobDescriptionInput';
import { TailoredVersion } from '@/components/resume/tailoring/TailoredVersion';
import { SideBySideCompare } from '@/components/resume/tailoring/SideBySideCompare';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ResumeTailorPage() {
  const params = useParams();
  const resumeId = params.id as string;
  const [tailoredContent, setTailoredContent] = useState<string | null>(null);
  const [originalContent, setOriginalContent] = useState<string>('');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tailor Resume for Job</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Paste a job description to get a customized version of your resume
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>
              Paste the job description to optimize your resume for ATS
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobDescriptionInput 
              resumeId={resumeId}
              onTailored={(content, original) => {
                setTailoredContent(content);
                setOriginalContent(original);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tailored Resume</CardTitle>
            <CardDescription>
              AI-optimized version matched to the job description
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tailoredContent ? (
              <Tabs defaultValue="tailored" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tailored">Tailored Version</TabsTrigger>
                  <TabsTrigger value="compare">Side-by-Side</TabsTrigger>
                </TabsList>
                <TabsContent value="tailored">
                  <TailoredVersion content={tailoredContent} />
                </TabsContent>
                <TabsContent value="compare">
                  <SideBySideCompare 
                    original={originalContent} 
                    tailored={tailoredContent} 
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Enter a job description to see tailored resume
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}