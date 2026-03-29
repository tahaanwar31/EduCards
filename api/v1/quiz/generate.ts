import type { IncomingMessage, ServerResponse } from 'http';
import { GoogleGenAI } from '@google/genai';
import { getJsonBody } from '../../_lib/json-body.js';

export const config = { maxDuration: 60 };

/** POST /api/v1/quiz/generate */
export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    const body = (await getJsonBody(req)) as { flashcards?: { question: string; answer: string }[] };
    const { flashcards } = body;
    if (!flashcards || flashcards.length < 2) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Need at least 2 flashcards' }));
      return;
    }

    const selected = [...flashcards].sort(() => Math.random() - 0.5).slice(0, 10);

    const prompt = `You are a quiz generator. Given these flashcard question-answer pairs, generate 3 plausible but WRONG answer options for each question. The wrong options should be related to the topic and sound convincing but be clearly incorrect.

Flashcards:
${selected.map((f, i) => `${i + 1}. Q: ${f.question}\n   Correct A: ${f.answer}`).join('\n')}

Return ONLY a valid JSON array with this exact format, no markdown, no code fence:
[
  {
    "question": "the question text",
    "correctAnswer": "the correct answer",
    "wrongOptions": ["wrong1", "wrong2", "wrong3"]
  }
]`;

    let text = '';
    let aiUsed = false;

    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && !aiUsed) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
          }),
        });
        if (groqRes.ok) {
          const groqData = await groqRes.json();
          text = groqData.choices?.[0]?.message?.content?.trim() || '';
          aiUsed = true;
        }
      } catch (e: unknown) {
        console.error('Groq error:', e instanceof Error ? e.message : e);
      }
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && !aiUsed) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
        });
        text = response.text?.trim() || '';
        aiUsed = true;
      } catch (e: unknown) {
        console.error('Gemini error:', e instanceof Error ? e.message : e);
      }
    }

    if (!aiUsed) {
      res.statusCode = 503;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'AI service is currently unavailable. Please try again later.' }));
      return;
    }

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const generated = JSON.parse(cleaned);

    const questions = generated.map((item: { question: string; correctAnswer: string; wrongOptions: string[] }) => {
      const options = [item.correctAnswer, ...item.wrongOptions.slice(0, 3)].sort(() => Math.random() - 0.5);
      return {
        question: item.question,
        options,
        correctIndex: options.indexOf(item.correctAnswer),
      };
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ questions, aiPowered: true }));
  } catch (error: unknown) {
    console.error('Quiz AI error:', error instanceof Error ? error.message : error);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'AI service is currently unavailable. Please try again later.' }));
  }
}
