import type { IncomingMessage, ServerResponse } from 'http';
import { Subject } from '../../../backend/models.js';
import { connectDBServerless } from '../../../backend/db.js';
import { getJsonBody } from '../../_lib/json-body.js';

export const config = { maxDuration: 60 };

/** POST /api/v1/subjects/create — create subject (avoids Express on Vercel). */
export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Allow', 'POST');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }
  try {
    await connectDBServerless();
    const body = await getJsonBody(req);
    const subject = new Subject(body);
    await subject.save();
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(subject));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to create subject';
    console.error('[POST /api/v1/subjects/create]', msg);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to create subject' }));
  }
}
