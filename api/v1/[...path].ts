import express from 'express';
import 'express-async-errors';
import { GoogleGenAI } from '@google/genai';
import { Subject, Topic, Flashcard } from '../../backend/models.js';
import { connectDBServerless } from '../../backend/db.js';
import serverless from 'serverless-http';

/** Longer cold-start + Mongo connect on Vercel (plan limits still apply). */
export const config = { maxDuration: 30 };

const app = express();

// Vercel often invokes this function with a stripped path (e.g. /subjects) while routes are /api/v1/...
app.use((req, _res, next) => {
  const u = req.url || '/';
  if (!u.startsWith('/api/v1')) {
    req.url = '/api/v1' + (u.startsWith('/') ? u : `/${u}`);
  }
  next();
});

app.use(express.json());

// Middleware: connect DB before every request
app.use(async (req, res, next) => {
  try {
    await connectDBServerless();
    next();
  } catch {
    res.status(503).json({ error: 'Database connection failed' });
  }
});

// GET /api/v1/subjects is rewritten to /api/v1/list-subjects (see vercel.json). Nested /api/v1/subjects/:id/* hits this file.

// --- Subjects ---
app.post('/api/v1/subjects', async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

app.delete('/api/v1/subjects/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    await Topic.deleteMany({ subjectId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

// --- Topics ---
app.get('/api/v1/subjects/:subjectId/topics', async (req, res) => {
  try {
    const topics = await Topic.find({ subjectId: req.params.subjectId }).sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

app.post('/api/v1/subjects/:subjectId/topics', async (req, res) => {
  try {
    const topic = new Topic({ ...req.body, subjectId: req.params.subjectId });
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

app.delete('/api/v1/topics/:id', async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    await Flashcard.deleteMany({ topicId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

// --- Flashcards ---
app.get('/api/v1/topics/:topicId/flashcards', async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ topicId: req.params.topicId }).sort({ createdAt: -1 });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flashcards' });
  }
});

app.post('/api/v1/topics/:topicId/flashcards', async (req, res) => {
  try {
    const flashcard = new Flashcard({ ...req.body, topicId: req.params.topicId });
    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create flashcard' });
  }
});

app.delete('/api/v1/flashcards/:id', async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete flashcard' });
  }
});

// Quiz generation with AI (Groq primary, Gemini fallback)
app.post('/api/v1/quiz/generate', async (req, res) => {
  try {
    const { flashcards } = req.body;
    if (!flashcards || flashcards.length < 2) {
      return res.status(400).json({ error: 'Need at least 2 flashcards' });
    }

    const selected = [...flashcards].sort(() => Math.random() - 0.5).slice(0, 10);

    const prompt = `You are a quiz generator. Given these flashcard question-answer pairs, generate 3 plausible but WRONG answer options for each question. The wrong options should be related to the topic and sound convincing but be clearly incorrect.

Flashcards:
${selected.map((f: any, i: number) => `${i + 1}. Q: ${f.question}\n   Correct A: ${f.answer}`).join('\n')}

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
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
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
      } catch (e: any) {
        console.error('Groq error:', e.message);
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
      } catch (e: any) {
        console.error('Gemini error:', e.message);
      }
    }

    if (!aiUsed) {
      return res.status(503).json({ error: 'AI service is currently unavailable. Please try again later.' });
    }

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const generated = JSON.parse(cleaned);

    const questions = generated.map((item: any) => {
      const options = [item.correctAnswer, ...item.wrongOptions.slice(0, 3)].sort(() => Math.random() - 0.5);
      return {
        question: item.question,
        options,
        correctIndex: options.indexOf(item.correctAnswer),
      };
    });

    res.json({ questions, aiPowered: true });
  } catch (error: any) {
    console.error('Quiz AI error:', error.message || error);
    res.status(503).json({ error: 'AI service is currently unavailable. Please try again later.' });
  }
});

export default serverless(app);
