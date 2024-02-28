import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db/prisma';
import { evaluateAnswer } from '@/lib/ai/openai/answerEvaluation';

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answer, questionIndex } = await req.json();

    const interview = await prisma.interview.findUnique({
      where: { id: params.sessionId },
      include: { user: true }
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Get the question
    const questions = interview.questions as any[];
    const question = questions[questionIndex];

    // Evaluate answer with AI
    const evaluation = await evaluateAnswer(question, answer);

    // Save feedback
    const feedback = await prisma.interviewFeedback.create({
      data: {
        interviewId: interview.id,
        questionIndex,
        question,
        answer,
        score: evaluation.score,
        clarity: evaluation.clarity,
        confidence: evaluation.confidence,
        relevance: evaluation.relevance,
        suggestions: evaluation.suggestions
      }
    });

    // Update interview answers array
    const currentAnswers = (interview.answers as any[]) || [];
    currentAnswers[questionIndex] = answer;
    
    await prisma.interview.update({
      where: { id: interview.id },
      data: { answers: currentAnswers }
    });

    // Check if interview is complete
    const isComplete = questionIndex === questions.length - 1;
    
    if (isComplete) {
      // Calculate overall score
      const allFeedback = await prisma.interviewFeedback.findMany({
        where: { interviewId: interview.id }
      });
      
      const overallScore = allFeedback.reduce((sum, f) => sum + f.score, 0) / allFeedback.length;
      
      await prisma.interview.update({
        where: { id: interview.id },
        data: {
          status: 'completed',
          overallScore,
          completedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      feedback: evaluation,
      isComplete
    });
    
  } catch (error) {
    console.error('Answer evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}