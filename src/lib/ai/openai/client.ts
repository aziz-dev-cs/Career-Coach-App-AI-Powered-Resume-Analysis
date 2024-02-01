import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const AI_MODEL = 'gpt-4-turbo-preview';
export const FAST_MODEL = 'gpt-3.5-turbo';

export interface AIAnalysisResponse {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: Array<{
    section: string;
    original: string;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  keywordMatches: Record<string, number>;
}

export async function callOpenAI(
  prompt: string,
  systemPrompt?: string,
  model: string = AI_MODEL
): Promise<string> {
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to process AI request');
  }
}

export async function streamOpenAI(
  prompt: string,
  systemPrompt?: string,
  onChunk?: (chunk: string) => void
): Promise<string> {
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });

    const stream = await openai.chat.completions.create({
      model: AI_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    let fullResponse = '';
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      if (onChunk) {
        onChunk(content);
      }
    }
    
    return fullResponse;
  } catch (error) {
    console.error('OpenAI streaming error:', error);
    throw new Error('Failed to process streaming AI request');
  }
}