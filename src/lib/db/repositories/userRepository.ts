import { prisma } from '../prisma';
import { User, UserPreference } from '@prisma/client';

export class UserRepository {
  async findByClerkId(clerkId: string) {
    return prisma.user.findUnique({
      where: { clerkId },
      include: {
        preferences: true,
        resumes: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        interviews: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
  }

  async createOrUpdate(data: {
    clerkId: string;
    email: string;
    name?: string;
    imageUrl?: string;
  }) {
    return prisma.user.upsert({
      where: { clerkId: data.clerkId },
      update: {
        email: data.email,
        name: data.name,
        imageUrl: data.imageUrl,
        updatedAt: new Date()
      },
      create: {
        clerkId: data.clerkId,
        email: data.email,
        name: data.name,
        imageUrl: data.imageUrl
      }
    });
  }

  async getStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        resumes: true,
        interviews: {
          where: { status: 'completed' }
        },
        progressMetrics: {
          orderBy: { recordedAt: 'desc' },
          take: 30
        }
      }
    });

    if (!user) return null;

    const latestResume = user.resumes[0];
    const avgInterviewScore = user.interviews.length > 0
      ? user.interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / user.interviews.length
      : 0;

    return {
      resumeScore: latestResume?.analysisScore || 0,
      interviewScore: avgInterviewScore,
      totalInterviews: user.interviews.length,
      totalResumes: user.resumes.length,
      recentActivity: this.getRecentActivity(user)
    };
  }

  private getRecentActivity(user: any) {
    const activities = [];
    
    user.resumes.slice(0, 3).forEach((resume: any) => {
      activities.push({
        type: 'resume_upload',
        title: `Uploaded "${resume.title}"`,
        date: resume.createdAt,
        icon: 'FileText'
      });
    });
    
    user.interviews.slice(0, 3).forEach((interview: any) => {
      activities.push({
        type: 'interview_completed',
        title: `Completed ${interview.type} interview for ${interview.role || 'general role'}`,
        date: interview.completedAt || interview.createdAt,
        score: interview.overallScore,
        icon: 'Mic'
      });
    });
    
    return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
  }

  async updatePreferences(userId: string, preferences: Partial<UserPreference>) {
    return prisma.userPreference.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        theme: preferences.theme || 'light',
        emailNotifications: preferences.emailNotifications ?? true,
        interviewDifficulty: preferences.interviewDifficulty || 'medium'
      }
    });
  }

  async recordProgress(userId: string, metricType: string, value: number, metadata?: any) {
    return prisma.progressMetric.create({
      data: {
        userId,
        metricType,
        value,
        metadata: metadata || {}
      }
    });
  }
}

export const userRepository = new UserRepository();