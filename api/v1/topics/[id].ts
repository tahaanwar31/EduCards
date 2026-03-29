import type { IncomingMessage, ServerResponse } from 'http';
import { Topic, Flashcard } from '../../../backend/models.js';
import { connectDBServerless } from '../../../backend/db.js';

export const config = { maxDuration: 60 };

function getId(req: IncomingMessage & { query?: Record<string, unknown> }): string {
  const q = req.query?.id;
  if (typeof q === 'string') return q;
  if (Array.isArray(q) && q[0]) return String(q[0]);
  const path = (req.url || '').split('?')[0];
  const m = path.match(/\/topics\/([^/]+)\/?$/);
  return m?.[1] ?? '';
}

/** DELETE /api/v1/topics/:id */
export default async function handler(req: IncomingMessage & { query?: Record<string, unknown> }, res: ServerResponse) {
  if (req.method !== 'DELETE') {
    res.statusCode = 405;
    res.setHeader('Allow', 'DELETE');
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const id = getId(req);
  if (!id) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing id' }));
    return;
  }

  try {
    await connectDBServerless();
    await Topic.findByIdAndDelete(id);
    await Flashcard.deleteMany({ topicId: id });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true }));
  } catch {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to delete topic' }));
  }
}
