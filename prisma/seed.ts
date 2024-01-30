import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed default interview questions
  const defaultQuestions = [
    'Tell me about yourself.',
    'Why do you want to work here?',
    'What are your greatest strengths?',
    'What are your weaknesses?',
    'Where do you see yourself in 5 years?',
    'Why should we hire you?',
    'Describe a challenging situation and how you overcame it.',
    'How do you handle pressure and stress?',
  ];

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });