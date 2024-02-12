import { callOpenAI } from './client';

const TAILORING_SYSTEM_PROMPT = `You are an expert resume writer. Your task is to tailor a resume to a specific job description while:
1. Maintaining the candidate's authentic experience and achievements
2. Incorporating relevant keywords from the job description
3. Highlighting the most relevant skills and experiences
4. Using strong action verbs and quantifiable achievements
5. Keeping the same overall structure but optimizing content

Return the tailored resume in the same format as the original, with clear section headers.`;

export async function tailorResumeWithAI(
  resumeContent: string,
  jobDescription: string,
  jobTitle?: string
): Promise<string> {
  const prompt = `
Original Resume:
${resumeContent}

${jobTitle ? `Job Title: ${jobTitle}` : ''}

Job Description:
${jobDescription}

Please tailor the resume to better match this job description. Focus on:
- Incorporating relevant keywords naturally
- Rephrasing bullet points to highlight matching skills
- Reordering sections to prioritize relevant experience
- Adding specific achievements that align with job requirements

Return the complete tailored resume with the same sections but optimized content.
`;

  try {
    const tailoredResume = await callOpenAI(prompt, TAILORING_SYSTEM_PROMPT, 'gpt-4-turbo-preview');
    return tailoredResume;
  } catch (error) {
    console.error('Resume tailoring error:', error);
    return resumeContent;
  }
}

export async function calculateJobMatchScore(
  resumeContent: string,
  jobDescription: string
): Promise<number> {
  const prompt = `
Resume: ${resumeContent.substring(0, 2000)}

Job Description: ${jobDescription.substring(0, 2000)}

Calculate a match score (0-100) based on how well this resume aligns with the job description.
Consider:
- Keyword matching
- Required skills vs. existing skills
- Experience relevance
- Achievement alignment

Return only the number, no additional text.
`;

  try {
    const response = await callOpenAI(prompt, 'You are a recruitment matching expert.', 'gpt-3.5-turbo');
    const score = parseInt(response.trim());
    return isNaN(score) ? 50 : Math.min(100, Math.max(0, score));
  } catch (error) {
    console.error('Match score calculation error:', error);
    return 50;
  }
}