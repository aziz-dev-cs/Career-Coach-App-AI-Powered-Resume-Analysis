import { prisma } from '../prisma';
import { Interview } from '@prisma/client';

export class InterviewRepository {
  async create(data: {
    userId: string;
    type: string;
    role?: string;
    experienceLevel?: string;
    questions: string[];
  }) {
    return prisma.interview.create({
      data: {
        ...data,
        status: 'started',
        answers: []
      }
    });
  }

  async findById(id: string, clerkId?: string) {
    const where: any = { id };
    if (clerkId) {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (user) {
        where.userId = user.id;
      }
    }
    
    return prisma.interview.findUnique({
      where,
      include: {
        feedbackDetails: {
          orderBy: { questionIndex: 'asc' }
        }
      }
    });
  }

  async findByUser(clerkId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return [];
    
    return prisma.interview.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        feedbackDetails: true
      }
    });
  }

  async addAnswer(
    id: string,
    questionIndex: number,
    answer: string,
    evaluation: any
  ) {
    // Get current answers
    const interview = await prisma.interview.findUnique({
      where: { id },
      select: { answers: true }
    });
    
    const currentAnswers = (interview?.answers as any[]) || [];
    currentAnswers[questionIndex] = answer;
    
    // Update interview
    await prisma.interview.update({
      where: { id },
      data: { answers: currentAnswers }
    });
    
    // Create feedback
    return prisma.interviewFeedback.create({
      data: {
        interviewId: id,
        questionIndex,
        question: evaluation.question || '',
        answer,
        score: evaluation.score,
        clarity: evaluation.clarity,
        confidence: evaluation.confidence,
        relevance: evaluation.relevance,
        suggestions: evaluation.suggestions
      }
    });
  }

  async completeInterview(id: string, overallScore: number) {
    return prisma.interview.update({
      where: { id },
      data: {
        status: 'completed',
        overallScore,
        completedAt: new Date()
      }
    });
  }

  async getStats(clerkId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return null;
    
    const interviews = await prisma.interview.findMany({
      where: {
        userId: user.id,
        status: 'completed'
      }
    });
    
    const totalInterviews = interviews.length;
    const avgScore = totalInterviews > 0
      ? interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / totalInterviews
      : 0;
      
    const scoresByType = {
      text: 0,
      voice: 0
    };
    
    interviews.forEach(i => {
      if (i.type === 'text') scoresByType.text += i.overallScore || 0;
      else scoresByType.voice += i.overallScore || 0;
    });
    
    return {
      total: totalInterviews,
      averageScore: avgScore,
      byType: {
        text: totalInterviews > 0 ? scoresByType.text / interviews.filter(i => i.type === 'text').length : 0,
        voice: totalInterviews > 0 ? scoresByType.voice / interviews.filter(i => i.type === 'voice').length : 0
      },
      trend: this.calculateTrend(interviews)
    };
  }

  private calculateTrend(interviews: any[]): number {
    if (interviews.length < 2) return 0;
    const sorted = interviews.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const first = sorted[0].overallScore || 0;
    const last = sorted[sorted.length - 1].overallScore || 0;
    return last - first;
  }
}

export const interviewRepository = new InterviewRepository();