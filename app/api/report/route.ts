/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const REPORT_SYSTEM = `You are a high-level Intelligence Analyst. Your task is to review the provided chat transcript between a user and TRUTH SEEKER AI, and generate a highly professional, brutally objective INTELLIGENCE SUMMARY REPORT.

FORMATTING REQUIREMENTS:
- Use markdown.
- Start with a massive header: \`# INTELLIGENCE REPORT: DEBRIEFING\`
- Include an \`## EXECUTIVE SUMMARY\` (1 paragraph).
- Include a \`## KEY INTELLIGENCE GATHERED\` section with bullet points of the main concepts discussed.
- Include a \`## STRATEGIC IMPLICATIONS\` section summarizing what this means or what actions are suggested.
- Tone must be cold, analytical, and heavily classified. Make it look incredible.
- Do NOT continue the conversation. Only summarize the provided history.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Convert the message history into a single string to feed the AI
    const transcript = messages.map((m: any) => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n');

    const response = await groq.chat.completions.create({ 
      model: 'llama-3.3-70b-versatile', 
      messages: [
        { role: 'system', content: REPORT_SYSTEM },
        { role: 'user', content: `Here is the transcript to process:\n\n${transcript}` }
      ], 
      temperature: 0.3, 
      max_tokens: 2000, 
      stream: false 
    });
    
    const reportText = response.choices[0]?.message?.content || 'REPORT GENERATION FAILED.';

    return new Response(reportText, { 
      status: 200,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' } 
    });
  } catch (error: any) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
