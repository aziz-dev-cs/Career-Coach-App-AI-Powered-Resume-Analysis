import { callOpenAI, AIAnalysisResponse } from './client';

const RESUME_ANALYSIS_SYSTEM_PROMPT = `You are an expert resume reviewer with years of experience in HR and recruiting. 
Analyze the resume and provide detailed feedback in JSON format. Focus on:
1. Overall score (0-100)
2. Key strengths (list of 3-5)
3. Areas for improvement (list of 3-5)
4. Specific suggestions for each section
5. Keyword optimization opportunities

Be constructive, specific, and actionable.`;

export async function analyzeResumeWithAI(content: string): Promise<AIAnalysisResponse> {
  const prompt = `
Please analyze the following resume:

${content}

Provide your analysis in the following JSON format:
{
  "score": number,
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": [
    {
      "section": string,
      "original": string,
      "suggestion": string,
      "priority": "high" | "medium" | "low"
    }
  ],
  "keywordMatches": Record<string, number>
}
`;

  try {
    const response = await callOpenAI(prompt, RESUME_ANALYSIS_SYSTEM_PROMPT);
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanedResponse) as AIAnalysisResponse;
  } catch (error) {
    console.error('Resume analysis error:', error);
    // Return default analysis if AI fails
    return {
      score: 70,
      strengths: ['Good structure', 'Relevant experience'],
      weaknesses: ['Missing keywords', 'Could improve formatting'],
      suggestions: [],
      keywordMatches: {}
    };
  }
}

export async function extractResumeKeywords(content: string): Promise<string[]> {
  const prompt = `
Extract the top 10 most important keywords/skills from this resume:

${content}

Return only a JSON array of strings, no additional text.
`;

  try {
    const response = await callOpenAI(prompt, 'You are a keyword extraction expert.', 'gpt-3.5-turbo');
    return JSON.parse(response);
  } catch (error) {
    console.error('Keyword extraction error:', error);
    return [];
  }
}