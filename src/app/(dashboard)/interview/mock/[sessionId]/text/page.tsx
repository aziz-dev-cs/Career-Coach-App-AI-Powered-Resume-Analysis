'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MockInterviewChat } from '@/components/interview/chatbot/MockInterviewChat';
import { Card } from '@/components/ui/card';

export default function TextInterviewPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    // Fetch interview questions
    const fetchQuestions = async () => {
      const response = await fetch(`/api/v1/interview/${sessionId}/questions`);
      const data = await response.json();
      setQuestions(data.questions);
    };

    fetchQuestions();
  }, [sessionId]);

  const handleAnswer = async (answer: string) => {
    // Submit answer and get feedback
    const response = await fetch(`/api/v1/interview/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer, questionIndex: currentQuestion }),
    });
    const feedback = await response.json();

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Interview complete
      window.location.href = `/interview/results/${sessionId}`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Text Interview</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <Card className="p-6">
        <MockInterviewChat
          questions={questions}
          currentQuestion={currentQuestion}
          onAnswer={handleAnswer}
        />
      </Card>
    </div>
  );
}