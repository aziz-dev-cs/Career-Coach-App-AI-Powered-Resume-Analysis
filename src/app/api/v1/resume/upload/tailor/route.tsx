import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db/prisma';
import { tailorResumeWithAI } from '@/lib/ai/openai/resumeTailoring';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resumeId, jobDescription, jobTitle, company } = await req.json();

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId }
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Generate tailored resume
    const tailoredContent = await tailorResumeWithAI(
      resume.content,
      jobDescription,
      jobTitle
    );

    // Calculate match score
    const matchScore = calculateMatchScore(tailoredContent, jobDescription);

    // Save tailoring session
    const tailoringSession = await prisma.tailoringSession.create({
      data: {
        resumeId,
        jobDescription,
        jobTitle,
        company,
        tailoredContent,
        matchScore,
        suggestions: {}
      }
    });

    return NextResponse.json({
      success: true,
      tailoredContent,
      matchScore,
      sessionId: tailoringSession.id
    });
    
  } catch (error) {
    console.error('Tailor error:', error);
    return NextResponse.json(
      { error: 'Failed to tailor resume' },
      { status: 500 }
    );
  }
}

function calculateMatchScore(content: string, jobDescription: string): number {
  // Simple keyword matching algorithm
  const keywords = extractKeywords(jobDescription);
  let matches = 0;
  
  keywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword.toLowerCase())) {
      matches++;
    }
  });
  
  return (matches / keywords.length) * 100;
}

function extractKeywords(text: string): string[] {
  // Extract important keywords from job description
  const commonKeywords = ['react', 'typescript', 'node', 'python', 'java', 'aws', 
    'docker', 'kubernetes', 'leadership', 'team', 'management', 'agile', 'scrum'];
  
  return commonKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}
