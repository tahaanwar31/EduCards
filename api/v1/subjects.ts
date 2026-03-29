import type { IncomingMessage, ServerResponse } from 'http';
import { connectDBServerless } from '../../backend/db.js';
import { Subject } from '../../backend/models.js';

export const config = { maxDuration: 60 };

/**
 * GET /api/v1/subjects only (exact path). Other methods and /subjects/* are handled by [...path].ts.
 * Native handler avoids Express+serverless-http cold hangs on Vercel for the dashboard list.
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
