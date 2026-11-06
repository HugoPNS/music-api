import { Request, Response } from 'express';
import * as albums from '../daos/albumsDAO';
import * as personal from '../daos/personalMoodsDAO';
import { currentUserId, toId } from './helpers';

const bad = (res: Response, msg: string) => res.status(400).json({ error: msg });
const notFound = (res: Response) => res.status(404).json({ error: 'Album not found.' });

function parseAlbumBody(req: Request) {
  const { title, artist, year, default_mood_id } = req.body ?? {};
  if (typeof title !== 'string' || !title.trim() || typeof artist !== 'string' || !artist.trim()) return null;
  return {
    title: title.trim(),
    artist: artist.trim(),
    year: year === undefined || year === null ? null : Number(year),
    moodId: default_mood_id === undefined || default_mood_id === null ? null : toId(default_mood_id),
  };
}

// CREATE
export async function createAlbum(req: Request, res: Response) {
  const b = parseAlbumBody(req);
  if (!b) return bad(res, 'title and artist are required.');
  const id = await albums.create(b.title, b.artist, b.year, b.moodId);
  res.status(201).json(await albums.readOne(id, currentUserId(req)));
}

// READ
export async function getAlbums(req: Request, res: Response) {
  res.json(await albums.readAll(currentUserId(req)));
}

export async function getAlbum(req: Request, res: Response) {
  const id = toId(req.params.albumId);
  if (!id) return bad(res, 'albumId must be a positive integer.');
  const album = await albums.readOne(id, currentUserId(req));
  album ? res.json(album) : notFound(res);
}

export async function getAlbumsByMood(req: Request, res: Response) {
  const moodId = toId(req.params.moodId);
  if (!moodId) return bad(res, 'moodId must be a positive integer.');
  res.json(await albums.readByMood(moodId, currentUserId(req)));
}

export async function getEffectiveMood(req: Request, res: Response) {
  const id = toId(req.params.albumId);
  if (!id) return bad(res, 'albumId must be a positive integer.');
  const a = await albums.readOne(id, currentUserId(req));
  if (!a) return notFound(res);
  res.json({ album_id: a.album_id, effective_mood_id: a.effective_mood_id, effective_mood: a.effective_mood,
             source: a.personal_mood_id ? 'personal' : 'default' });
}

// UPDATE
export async function updateAlbum(req: Request, res: Response) {
  const id = toId(req.params.albumId);
  const b = parseAlbumBody(req);
  if (!id) return bad(res, 'albumId must be a positive integer.');
  if (!b) return bad(res, 'title and artist are required.');
  if (!(await albums.update(id, b.title, b.artist, b.year, b.moodId)) && !(await albums.readOne(id, null))) return notFound(res);
  res.json(await albums.readOne(id, currentUserId(req)));
}

export async function setDefaultMood(req: Request, res: Response) {
  const id = toId(req.params.albumId);
  const moodId = toId(req.body?.mood_id);
  if (!id || !moodId) return bad(res, 'albumId (URL) and mood_id (body) must be positive integers.');
  if (!(await albums.readOne(id, null))) return notFound(res);
  await albums.setDefaultMood(id, moodId);
  res.json(await albums.readOne(id, currentUserId(req)));
}

export async function setPersonalMood(req: Request, res: Response) {
  const id = toId(req.params.albumId);
  const userId = currentUserId(req);
  const moodId = toId(req.body?.mood_id);
  if (!userId) return bad(res, 'X-User-Id header is required.');
  if (!id || !moodId) return bad(res, 'albumId (URL) and mood_id (body) must be positive integers.');
  if (!(await albums.readOne(id, null))) return notFound(res);
  await personal.upsert(userId, id, moodId);
  res.json(await albums.readOne(id, userId));
}

// DELETE
export async function deleteAlbum(req: Request, res: Response) {
  const id = toId(req.params.albumId);
  if (!id) return bad(res, 'albumId must be a positive integer.');
  (await albums.remove(id)) ? res.json({ deleted: id }) : notFound(res);
}

export async function deletePersonalMood(req: Request, res: Response) {
  const id = toId(req.params.albumId);
  const userId = currentUserId(req);
  if (!userId) return bad(res, 'X-User-Id header is required.');
  if (!id) return bad(res, 'albumId must be a positive integer.');
  if (!(await personal.remove(userId, id))) return res.status(404).json({ error: 'No personal mood set for this album.' });
  res.json(await albums.readOne(id, userId));
}
