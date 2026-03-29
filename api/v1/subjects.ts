import type { IncomingMessage, ServerResponse } from 'http';
import { connectDBServerless } from '../../backend/db.js';
import { Subject } from '../../backend/models.js';

export const config = { maxDuration: 60 };

/**
 * Dedicated handler for GET /api/v1/subjects (bypasses Express + serverless-http).
 * Vercel routes this file to /api/v1/subjects — avoids known hangs with nested catch-alls.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    await connectDBServerless();
    const subjects = await Subject.find().sort({ createdAt: -1 }).lean().exec();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(subjects));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Database error';
    console.error('[GET /api/v1/subjects]', msg);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: msg }));
  }
}
