import pdf from 'pdf-parse';

export async function parseResumeFile(buffer: Buffer, mimeType: string): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdf(buffer);
      return data.text;
    } else if (mimeType === 'text/plain') {
      return buffer.toString('utf-8');
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // For DOCX files, you would need a library like 'mammoth'
      // For now, return a placeholder
      return 'DOCX parsing would be implemented here. Use pdf-parse for PDFs.';
    } else {
      throw new Error(`Unsupported file type: ${mimeType}`);
    }
  } catch (error) {
    console.error('File parsing error:', error);
    throw new Error('Failed to parse resume file');
  }
}

export function extractTextFromHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function sanitizeText(text: string): string {
  return text
    .replace(/[^\w\s\.,!?\-@#\$%&*()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function chunkText(text: string, maxChunkSize: number = 2000): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence + '.';
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}