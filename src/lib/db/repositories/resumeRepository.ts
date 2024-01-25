import { prisma } from '../prisma';
import { Resume } from '@prisma/client';

export class ResumeRepository {
  async create(data: {
    userId: string;
    title: string;
    content: string;
    originalFileName: string;
    fileUrl?: string;
  }) {
    return prisma.resume.create({
      data: {
        ...data,
        version: 1
      }
    });
  }

  async findById(id: string, userId?: string) {
    const where: any = { id };
    if (userId) {
      const user = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (user) {
        where.userId = user.id;
      }
    }
    
    return prisma.resume.findUnique({
      where,
      include: {
        tailoringSessions: {
          orderBy: { createdAt: 'desc' }
        },
        feedback: true
      }
    });
  }

  async findByUser(clerkId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) return [];
    
    return prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateAnalysis(id: string, score: number, analysisData: any) {
    return prisma.resume.update({
      where: { id },
      data: {
        analysisScore: score,
        analysisData,
        updatedAt: new Date()
      }
    });
  }

  async createTailoringSession(data: {
    resumeId: string;
    jobDescription: string;
    jobTitle?: string;
    company?: string;
    tailoredContent: string;
    matchScore?: number;
  }) {
    return prisma.tailoringSession.create({
      data
    });
  }

  async getTailoringSessions(resumeId: string) {
    return prisma.tailoringSession.findMany({
      where: { resumeId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async delete(id: string, userId: string) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return null;
    
    return prisma.resume.deleteMany({
      where: {
        id,
        userId: user.id
      }
    });
  }
}

export const resumeRepository = new ResumeRepository();