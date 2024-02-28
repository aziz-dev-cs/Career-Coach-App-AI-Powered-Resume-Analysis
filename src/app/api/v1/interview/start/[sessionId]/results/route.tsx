import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const interview = await prisma.interview.findUnique({
      where: { id: params.sessionId },
      include: { feedbackDetails: true }
    });

    if (!interview) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Compile results
    const questions = interview.questions as any[];
    const answers = interview.answers as any[] || [];
    
    const questionFeedback = interview.feedbackDetails.map((feedback, index) => ({
      question: feedback.question,
      answer: feedback.answer,
      score: feedback.score,
      feedback: feedback.suggestions
    }));

    // Calculate average metrics
    const avgClarity = interview.feedbackDetails.reduce((sum, f) => sum + (f.clarity || 0), 0) / interview.feedbackDetails.length;
    const avgConfidence = interview.feedbackDetails.reduce((sum, f) => sum + (f.confidence || 0), 0) / interview.feedbackDetails.length;
    const avgRelevance = interview.feedbackDetails.reduce((sum, f) => sum + (f.relevance || 0), 0) / interview.feedbackDetails.length;

    // Generate improvement suggestions
    const suggestions = generateSuggestions(interview.feedbackDetails);

    return NextResponse.json({
      overallScore: interview.overallScore,
      feedback: {
        clarity: avgClarity,
        confidence: avgConfidence,
        relevance: avgRelevance
      },
      questions: questionFeedback,
      suggestions
    });
    
  } catch (error) {
    console.error('Results fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}

function generateSuggestions(feedbackDetails: any[]): string[] {
  const suggestions: string[] = [];
  
  const lowScores = feedbackDetails.filter(f => f.score < 60);
  if (lowScores.length > 0) {
    suggestions.push('Focus on providing more specific examples in your answers');
  }
  
  const lowClarity = feedbackDetails.filter(f => (f.clarity || 0) < 60);
  if (lowClarity.length > 0) {
    suggestions.push('Practice structuring your answers using the STAR method');
  }
  
  const lowConfidence = feedbackDetails.filter(f => (f.confidence || 0) < 60);
  if (lowConfidence.length > 0) {
    suggestions.push('Work on your delivery and use more confident language');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Great job! Keep practicing to maintain your performance');
    suggestions.push('Try more challenging questions to continue growing');
  }
  
  return suggestions;
}
