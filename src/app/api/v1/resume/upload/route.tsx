import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/db/prisma';
import { parseResumeFile } from '@/lib/utils/fileProcessor';
import { analyzeResumeWithAI } from '@/lib/ai/openai/resumeAnalysis';

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Parse file content
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const content = await parseResumeFile(fileBuffer, file.type);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Save resume to database
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        title: file.name,
        content: content,
        originalFileName: file.name,
        version: 1,
      }
    });

    // Trigger AI analysis (async)
    const analysis = await analyzeResumeWithAI(content);
    
    // Update resume with analysis
    await prisma.resume.update({
      where: { id: resume.id },
      data: {
        analysisScore: analysis.score,
        analysisData: analysis
      }
    });

    return NextResponse.json({ 
      success: true, 
      resumeId: resume.id,
      analysis 
    });
    
  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}