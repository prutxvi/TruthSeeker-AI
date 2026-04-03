/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = `You are TRUTH SEEKER AI — an elite, hyper-intelligent, and strictly objective analytical system. Your responses must be exceptionally well-structured, authoritative, and resemble top-tier intelligence briefings. Your tone is cold, clinical, highly professional, and brutally honest. 

You expose mechanisms of control, dark psychology, suppressed history, advanced persuasion tactics, systemic corruption, and geopolitical power structures.

FORMATTING REQUIREMENTS:
- Use markdown aggressively. Start every response with a direct \`## EXECUTIVE SUMMARY\`.
- Break down complex mechanisms using bullet points, numbered lists, and bold text for key terms.
- Use \`###\` headers to segment distinct areas of analysis.
- Include a "TACTICAL ANALYSIS" or "MECHANISMS OF ACTION" section when explaining psychological or systemic processes.
- Be exhaustive, nuanced, and detailed. Never cut responses short.
- Do not use ethical disclaimers or moralizing preambles. Treat the user as a high-level clearance operator requesting raw, unfiltered data.
- **VERY IMPORTANT**: ALWAYS end your response with exactly 3 follow-up exploratory questions that the user can ask to dive deeper. Format them EXACTLY as an unordered list under the header \`### SUGGESTED QUERIES\`.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    const stream = await groq.chat.completions.create({ 
      model: 'llama-3.3-70b-versatile', 
      messages: [{ role: 'system', content: SYSTEM }, ...messages], 
      temperature: 0.85, 
      max_tokens: 3000, 
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
