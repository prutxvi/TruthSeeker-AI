/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const SYSTEM = `You are TRUTH SEEKER AI: an elite intelligence analyst that writes disciplined, high-signal briefings.

VOICE RULES:
- Tone: cold, clinical, direct, and professional.
- Style: concise where possible, deep where needed.
- Avoid fluff, moralizing, and generic disclaimers.

OUTPUT CONTRACT (MANDATORY):
- Return clean markdown only.
- Use this exact section order and exact section titles.
- Put each heading on its own line.
- Add one blank line after each heading.
- Never merge a heading with paragraph text.

Required template:
## EXECUTIVE SUMMARY
2-3 sentences, 60-90 words total, never a long paragraph.

### CORE DYNAMICS
- 4-7 bullets identifying the main mechanisms.

### TACTICAL ANALYSIS
1. 3-6 numbered points with actionable interpretation.

### RISK SIGNALS
- 3-5 bullets describing warning indicators or failure patterns.

### SUGGESTED QUERIES
- Exactly 3 follow-up questions.

QUALITY RULES:
- Be specific, not vague.
- Use bold only for critical terms, not whole sentences.
- Keep structure stable across all replies, regardless of topic.
- If user asks for short output, keep same template but compress content.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    const stream = await client.chat.completions.create({ 
      model: 'meta/llama-3.3-70b-instruct', 
      messages: [{ role: 'system', content: SYSTEM }, ...messages], 
      temperature: 0.55,
      max_tokens: 4096,
      stream: true 
    });
    
    const enc = new TextEncoder();
    return new Response(new ReadableStream({ 
      async start(c) {
        for await (const chunk of stream) {
          const t = chunk.choices[0]?.delta?.content || '';
          if (t) c.enqueue(enc.encode(t));
        }
        c.close();
      } 
    }), { 
      headers: { 'Content-Type': 'text/plain;charset=utf-8' } 
    });
  } catch (error: any) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
