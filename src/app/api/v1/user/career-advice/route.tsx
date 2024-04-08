import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db/prisma';
import { generateCareerAdvice } from '@/lib/ai/openai/careerAdvice';

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        resumes: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        interviews: {
          where: { status: 'completed' },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const latestResume = user.resumes[0];
    const recentInterviews = user.interviews;

    // Generate AI-powered career advice
    const advice = await generateCareerAdvice(latestResume, recentInterviews);

    return NextResponse.json(advice);
    
  } catch (error) {
    console.error('Career advice error:', error);
    return NextResponse.json(
      { error: 'Failed to generate career advice' },
      { status: 500 }
    );
  }
}