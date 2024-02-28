import { callOpenAI } from './client';

const EVALUATION_SYSTEM_PROMPT = `You are an expert interview coach. Evaluate the candidate's answer and provide detailed feedback.
Consider:
1. Clarity of communication (0-100)
2. Confidence in delivery (0-100)
3. Relevance to the question (0-100)
4. Use of specific examples (STAR method)
5. Overall effectiveness

Provide feedback that is constructive, specific, and actionable.`;

export interface AnswerEvaluation {
  score: number;
  clarity: number;
  confidence: number;
  relevance: number;
  suggestions: string;
  strengths: string[];
  improvements: string[];
}

export async function evaluateAnswer(
  question: string,
  answer: string
): Promise<AnswerEvaluation> {
  const prompt = `
Question: ${question}

Candidate's Answer: ${answer}

Evaluate this answer and return in JSON format:
{
  "score": number (0-100 overall),
  "clarity": number (0-100),
  "confidence": number (0-100),
  "relevance": number (0-100),
  "suggestions": "string with specific improvement tips",
  "strengths": ["string array of what was done well"],
  "improvements": ["string array of specific areas to improve"]
}
`;

  try {
    const response = await callOpenAI(prompt, EVALUATION_SYSTEM_PROMPT, 'gpt-4-turbo-preview');
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanedResponse) as AnswerEvaluation;
  } catch (error) {
    console.error('Answer evaluation error:', error);
    return {
      score: 70,
      clarity: 70,
      confidence: 70,
      relevance: 70,
      suggestions: 'Try to provide more specific examples using the STAR method (Situation, Task, Action, Result).',
      strengths: ['Attempted to answer the question'],
      improvements: ['Add more specific details', 'Structure your answer clearly']
    };
  }
}

export async function evaluateVoiceAnswer(
  question: string,
  transcription: string,
  audioMetrics?: {
    pace: number;
    pauses: number;
    fillerWords: number;
  }
): Promise<AnswerEvaluation> {
  const metricsText = audioMetrics ? `
Audio Metrics:
- Speaking pace: ${audioMetrics.pace} words/minute (optimal: 140-160)
- Number of pauses: ${audioMetrics.pauses}
- Filler words count: ${audioMetrics.fillerWords} (e.g., "um", "uh", "like")
` : '';

  const prompt = `
Question: ${question}

Transcribed Answer: ${transcription}
${metricsText}

Evaluate this voice interview answer, paying special attention to delivery, clarity, and confidence.
Return in JSON format as before, with additional notes on vocal delivery if metrics are available.
`;

  try {
    const response = await callOpenAI(prompt, EVALUATION_SYSTEM_PROMPT, 'gpt-4-turbo-preview');
    const cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanedResponse) as AnswerEvaluation;
  } catch (error) {
    console.error('Voice answer evaluation error:', error);
    return {
      score: 70,
      clarity: 70,
      confidence: 70,
      relevance: 70,
      suggestions: 'Speak clearly and at a moderate pace. Avoid filler words like "um" and "uh".',
      strengths: ['Completed the answer'],
      improvements: ['Work on pacing', 'Reduce filler words']
    };
  }
}