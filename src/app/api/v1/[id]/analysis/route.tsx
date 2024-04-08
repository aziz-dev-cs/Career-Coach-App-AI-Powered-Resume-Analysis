import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resume = await prisma.resume.findUnique({
      where: { id: params.id },
      include: { user: true }
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Verify ownership
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (resume.userId !== user?.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Return analysis data
    return NextResponse.json({
      score: resume.analysisScore,
      analysisData: resume.analysisData,
      createdAt: resume.createdAt
    });
    
  } catch (error) {
    console.error('Analysis fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
}