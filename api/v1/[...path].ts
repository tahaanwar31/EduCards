import express from 'express';
import 'express-async-errors';
import { GoogleGenAI } from '@google/genai';
import { Subject, Topic, Flashcard } from '../../backend/models.js';
import { connectDBServerless } from '../../backend/db.js';
import serverless from 'serverless-http';

export const config = { maxDuration: 60 };

const app = express();

// Vercel catch-all may pass a path without /api/v1 — normalize (preserve query string).
app.use((req, _res, next) => {
  const u = req.url || '/';
  const qIndex = u.indexOf('?');
  const pathPart = qIndex === -1 ? u : u.slice(0, qIndex);
  const query = qIndex === -1 ? '' : u.slice(qIndex);
  if (!pathPart.startsWith('/api/v1')) {
    req.url = '/api/v1' + (pathPart.startsWith('/') ? pathPart : `/${pathPart}`) + query;
  }
  next();
});

app.use(express.json());

const v1 = express.Router();

v1.use(async (req, res, next) => {
  try {
    await connectDBServerless();
    next();
  } catch {
    res.status(503).json({ error: 'Database connection failed' });
  }
});

v1.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

v1.post('/subjects', async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

v1.delete('/subjects/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    await Topic.deleteMany({ subjectId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

v1.get('/subjects/:subjectId/topics', async (req, res) => {
  try {
    const topics = await Topic.find({ subjectId: req.params.subjectId }).sort({ createdAt: -1 });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

v1.post('/subjects/:subjectId/topics', async (req, res) => {
  try {
    const topic = new Topic({ ...req.body, subjectId: req.params.subjectId });
    await topic.save();
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

v1.delete('/topics/:id', async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    await Flashcard.deleteMany({ topicId: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete topic' });
  }
});

v1.get('/topics/:topicId/flashcards', async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ topicId: req.params.topicId }).sort({ createdAt: -1 });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch flashcards' });
  }
});

v1.post('/topics/:topicId/flashcards', async (req, res) => {
  try {
    const flashcard = new Flashcard({ ...req.body, topicId: req.params.topicId });
    await flashcard.save();
    res.status(201).json(flashcard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create flashcard' });
  }
});

v1.delete('/flashcards/:id', async (req, res) => {
  try {
    await Flashcard.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete flashcard' });
  }
});

v1.post('/quiz/generate', async (req, res) => {
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

app.use('/api/v1', v1);

export default serverless(app);
