import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        resumes: true,
        interviews: {
          where: { status: 'completed' }
        },
        progressMetrics: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate stats
    const latestResume = user.resumes.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    )[0];
    
    const resumeScore = latestResume?.analysisScore || 0;
    
    const avgInterviewScore = user.interviews.length > 0
      ? user.interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / user.interviews.length
      : 0;
    
    const improvementRate = calculateImprovementRate(user.progressMetrics);

    return NextResponse.json({
      resumeScore,
      interviewScore: avgInterviewScore,
      totalInterviews: user.interviews.length,
      improvements: improvementRate,
      recentActivity: getRecentActivity(user)
    });
    
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

function calculateImprovementRate(metrics: any[]): number {
  if (metrics.length < 2) return 0;
  
  const sorted = metrics.sort((a, b) => 
    a.recordedAt.getTime() - b.recordedAt.getTime()
  );
  
  const first = sorted[0].value;
  const last = sorted[sorted.length - 1].value;
  
  return Math.round(((last - first) / first) * 100);
}

function getRecentActivity(user: any): any[] {
  const activities = [];
  
  // Add resume uploads
  user.resumes.slice(0, 3).forEach(resume => {
    activities.push({
      type: 'resume_upload',
      title: `Uploaded "${resume.title}"`,
      date: resume.createdAt,
      icon: 'FileText'
    });
  });
  
  // Add completed interviews
  user.interviews.slice(0, 3).forEach(interview => {
    activities.push({
      type: 'interview_completed',
      title: `Completed ${interview.type} interview${interview.role ? ` for ${interview.role}` : ''}`,
      date: interview.completedAt || interview.createdAt,
      score: interview.overallScore,
      icon: 'Mic'
    });
  });
  
  return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
}