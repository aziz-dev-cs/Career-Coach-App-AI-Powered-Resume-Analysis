import { callOpenAI } from './client';

const CAREER_ADVICE_SYSTEM_PROMPT = `You are an experienced career coach with expertise in tech industry hiring.
Provide personalized career advice based on the user's resume and interview performance.
Be specific, actionable, and encouraging.`;

export interface CareerAdvice {
  insights: string[];
  skills: Array<{
    name: string;
    demand: number;
    resources: string[];
  }>;
  roadmap: string[];
}

export async function generateCareerAdvice(
  resume: any,
  interviews: any[]
): Promise<CareerAdvice> {
  const resumeSummary = resume ? `
Resume Score: ${resume.analysisScore || 'N/A'}
Key Skills: ${extractSkillsFromResume(resume.content)}
` : 'No resume uploaded yet.';

  const interviewSummary = interviews.length > 0 ? `
Completed Interviews: ${interviews.length}
Average Score: ${interviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / interviews.length}
Recent Roles: ${interviews.map(i => i.role).join(', ')}
` : 'No interviews completed yet.';

  const prompt = `
User Profile:
${resumeSummary}
${interviewSummary}

Provide personalized career advice in JSON format:
{
  "insights": ["string array of 3-5 key insights about their career trajectory"],
  "skills": [
    {
      "name": "skill name",
      "demand": number (0-100 market demand),
      "resources": ["learning resource 1", "learning resource 2"]
    }
  ],
  "roadmap": ["string array of 4-6 actionable next steps"]
}

Focus on practical, actionable advice tailored to their apparent experience level.
`;

  try {
    const response = await callOpenAI(prompt, CAREER_ADVICE_SYSTEM_PROMPT, 'gpt-4-turbo-preview');
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanedResponse) as CareerAdvice;
  } catch (error) {
    console.error('Career advice generation error:', error);
    return {
      insights: [
        'Continue practicing interviews to build confidence',
        'Consider adding more quantifiable achievements to your resume',
        'Research industry-specific keywords for your target roles'
      ],
      skills: [
        { name: 'Communication', demand: 95, resources: ['Toastmasters', 'Public speaking courses'] },
        { name: 'Problem Solving', demand: 90, resources: ['LeetCode', 'System design interviews'] }
      ],
      roadmap: [
        'Update your resume with recent achievements',
        'Complete 3 mock interviews this week',
        'Apply to 5 target companies',
        'Network with industry professionals on LinkedIn'
      ]
    };
  }
}

function extractSkillsFromResume(content: string): string {
  const commonSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 'SQL'];
  const foundSkills = commonSkills.filter(skill => 
    content.toLowerCase().includes(skill.toLowerCase())
  );
  return foundSkills.join(', ') || 'Skills not clearly identified';
}