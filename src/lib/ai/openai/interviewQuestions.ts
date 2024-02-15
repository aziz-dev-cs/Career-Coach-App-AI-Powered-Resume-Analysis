import { callOpenAI } from './client';

const QUESTION_GENERATION_PROMPT = `You are an expert interviewer. Generate realistic interview questions based on the role and experience level.
Questions should:
1. Be relevant to the role and industry
2. Test both technical and soft skills
3. Include behavioral questions (STAR method)
4. Be appropriate for the experience level
5. Vary in difficulty

Return only a JSON array of strings, no additional text.`;

export async function generateInterviewQuestions(
  role: string = 'Software Engineer',
  experienceLevel: string = 'mid',
  type: string = 'text'
): Promise<string[]> {
  const prompt = `
Role: ${role}
Experience Level: ${experienceLevel} (entry/junior/mid/senior/lead)
Interview Type: ${type}

Generate 5-7 interview questions appropriate for this combination.
Include a mix of:
- Technical questions (if applicable)
- Behavioral questions (e.g., "Tell me about a time...")
- Situational questions (e.g., "How would you handle...")
- General questions about motivation and fit

Return as JSON array.
`;

  try {
    const response = await callOpenAI(prompt, QUESTION_GENERATION_PROMPT, 'gpt-4-turbo-preview');
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const questions = JSON.parse(cleanedResponse);
    return Array.isArray(questions) ? questions : getDefaultQuestions(role);
  } catch (error) {
    console.error('Question generation error:', error);
    return getDefaultQuestions(role);
  }
}

function getDefaultQuestions(role: string): string[] {
  return [
    `Tell me about yourself and why you're interested in the ${role} role.`,
    'What are your greatest strengths and how do they apply to this position?',
    'Describe a challenging project you worked on and how you overcame obstacles.',
    'Where do you see yourself in 5 years?',
    'Why should we hire you for this role?',
    'How do you handle feedback and criticism?',
    'Describe your ideal work environment and team culture.'
  ];
}

export async function generateFollowUpQuestion(
  previousAnswer: string,
  context: string
): Promise<string> {
  const prompt = `
Previous Answer: ${previousAnswer}

Interview Context: ${context}

Generate a natural follow-up question that digs deeper into the candidate's response.
The question should be conversational and seek more specific details or examples.

Return only the question text.
`;

  try {
    const followUp = await callOpenAI(prompt, 'You are an experienced interviewer asking thoughtful follow-up questions.', 'gpt-3.5-turbo');
    return followUp;
  } catch (error) {
    console.error('Follow-up generation error:', error);
    return "Could you elaborate on that with a specific example?";
  }
}