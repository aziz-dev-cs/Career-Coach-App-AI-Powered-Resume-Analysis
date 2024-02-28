import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db/prisma';
import { generateInterviewQuestions } from '@/lib/ai/openai/interviewQuestions';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, role, experienceLevel, customQuestions } = await req.json();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate questions based on parameters
    let questions = customQuestions;
    if (!questions) {
      questions = await generateInterviewQuestions(role, experienceLevel, type);
    }

    // Create interview session
    const interview = await prisma.interview.create({
      data: {
        userId: user.id,
        type: type || 'text',
        status: 'started',
        role: role || 'General',
        experienceLevel: experienceLevel || 'medium',
        questions: questions,
        answers: [],
      }
    });

    return NextResponse.json({
      success: true,
      sessionId: interview.id,
      questions
    });
    
  } catch (error) {
    console.error('Start interview error:', error);
    return NextResponse.json(
      { error: 'Failed to start interview' },
      { status: 500 }
    );
  }
}