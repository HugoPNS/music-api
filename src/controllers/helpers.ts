import { NextFunction, Request, Response } from 'express';

export function toId(value: unknown): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// Authentication is out of scope for this milestone, so the "current user" comes from an
// X-User-Id request header. A later milestone replaces this with real login/roles.
export function currentUserId(req: Request): number | null {
  const header = req.header('X-User-Id');
  return header === undefined ? null : toId(header);
}

export function asyncHandler(fn: (req: Request, res: Response) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => fn(req, res).catch(next);
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err?.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ error: 'A referenced mood, user, or album does not exist.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error.' });
}
