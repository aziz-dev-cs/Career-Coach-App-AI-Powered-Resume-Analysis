'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { VoiceInterview } from '@/components/interview/voice/VoiceInterview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, AlertCircle } from 'lucide-react';

export default function VoiceInterviewPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [permission, setPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // Request microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setPermission(true))
      .catch(() => setPermission(false));
  }, []);

  if (permission === false) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Microphone access is required for voice interviews. Please allow microphone access and refresh the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <div className="inline-flex p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
          <Mic className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Voice Interview</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Speak naturally and get real-time feedback on your responses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interview in Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <VoiceInterview sessionId={sessionId} />
        </CardContent>
      </Card>
    </div>
  );
}