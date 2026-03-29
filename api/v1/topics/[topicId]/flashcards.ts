import type { IncomingMessage, ServerResponse } from 'http';
import { Flashcard } from '../../../../backend/models.js';
import { connectDBServerless } from '../../../../backend/db.js';
import { getJsonBody } from '../../../_lib/json-body.js';

export const config = { maxDuration: 60 };

function getTopicId(req: IncomingMessage & { query?: Record<string, unknown> }): string {
  const q = req.query?.topicId;
  if (typeof q === 'string') return q;
  if (Array.isArray(q) && q[0]) return String(q[0]);
  const path = (req.url || '').split('?')[0];
  const m = path.match(/\/topics\/([^/]+)\/flashcards\/?$/);
  return m?.[1] ?? '';
}

/** GET/POST /api/v1/topics/:topicId/flashcards */
export default async function handler(
  req: IncomingMessage & { body?: unknown; query?: Record<string, string | string[]> },
  res: ServerResponse
) {
  const topicId = getTopicId(req);
  if (!topicId) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing topicId' }));
    return;
  }

  try {
    await connectDBServerless();
  } catch {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Database connection failed' }));
    return;
  }

  if (req.method === 'GET') {
    try {
      const flashcards = await Flashcard.find({ topicId }).sort({ createdAt: -1 });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(flashcards));
    } catch {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to fetch flashcards' }));
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = await getJsonBody(req);
      const flashcard = new Flashcard({ ...body, topicId });
      await flashcard.save();
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(flashcard));
    } catch {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to create flashcard' }));
    }
    return;
  }

  res.statusCode = 405;
  res.setHeader('Allow', 'GET, POST');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}
