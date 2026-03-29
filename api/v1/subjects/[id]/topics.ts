import type { IncomingMessage, ServerResponse } from 'http';
import { Topic } from '../../../../backend/models.js';
import { connectDBServerless } from '../../../../backend/db.js';
import { getJsonBody } from '../../../_lib/json-body.js';

export const config = { maxDuration: 60 };

function getSubjectId(req: IncomingMessage & { query?: Record<string, unknown> }): string {
  const q = req.query?.id;
  if (typeof q === 'string') return q;
  if (Array.isArray(q) && q[0]) return String(q[0]);
  const path = (req.url || '').split('?')[0];
  const m = path.match(/\/subjects\/([^/]+)\/topics\/?$/);
  return m?.[1] ?? '';
}

/** GET/POST /api/v1/subjects/:id/topics */
export default async function handler(
  req: IncomingMessage & { body?: unknown; query?: Record<string, string | string[]> },
  res: ServerResponse
) {
  const subjectId = getSubjectId(req);
  if (!subjectId) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing subject id' }));
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
      const topics = await Topic.find({ subjectId }).sort({ createdAt: -1 });
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(topics));
    } catch {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to fetch topics' }));
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = await getJsonBody(req);
      const topic = new Topic({ ...body, subjectId });
      await topic.save();
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(topic));
    } catch {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to create topic' }));
    }
    return;
  }

  res.statusCode = 405;
  res.setHeader('Allow', 'GET, POST');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}
