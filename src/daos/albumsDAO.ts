import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../db';

// Effective mood = the user's personal override if one exists, otherwise the admin default.
const SELECT_EFFECTIVE = `
  SELECT a.album_id, a.title, a.artist, a.year, a.default_mood_id,
         dm.name AS default_mood,
         uam.mood_id AS personal_mood_id,
         COALESCE(uam.mood_id, a.default_mood_id) AS effective_mood_id,
         em.name AS effective_mood
  FROM albums a
  LEFT JOIN moods dm ON dm.mood_id = a.default_mood_id
  LEFT JOIN user_album_moods uam ON uam.album_id = a.album_id AND uam.user_id = ?
  LEFT JOIN moods em ON em.mood_id = COALESCE(uam.mood_id, a.default_mood_id)`;

export async function readAll(userId: number | null) {
  const [rows] = await pool.query<RowDataPacket[]>(`${SELECT_EFFECTIVE} ORDER BY a.album_id`, [userId]);
  return rows;
}

export async function readOne(albumId: number, userId: number | null) {
  const [rows] = await pool.query<RowDataPacket[]>(`${SELECT_EFFECTIVE} WHERE a.album_id = ?`, [userId, albumId]);
  return rows[0];
}

export async function readByMood(moodId: number, userId: number | null) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `${SELECT_EFFECTIVE} WHERE COALESCE(uam.mood_id, a.default_mood_id) = ? ORDER BY a.album_id`,
    [userId, moodId]);
  return rows;
}

export async function create(title: string, artist: string, year: number | null, moodId: number | null) {
  const [r] = await pool.query<ResultSetHeader>(
    'INSERT INTO albums (title, artist, year, default_mood_id) VALUES (?, ?, ?, ?)',
    [title, artist, year, moodId]);
  return r.insertId;
}

export async function update(albumId: number, title: string, artist: string, year: number | null, moodId: number | null) {
  const [r] = await pool.query<ResultSetHeader>(
    'UPDATE albums SET title = ?, artist = ?, year = ?, default_mood_id = ? WHERE album_id = ?',
    [title, artist, year, moodId, albumId]);
  return r.affectedRows;
}

export async function setDefaultMood(albumId: number, moodId: number) {
  const [r] = await pool.query<ResultSetHeader>('UPDATE albums SET default_mood_id = ? WHERE album_id = ?', [moodId, albumId]);
  return r.affectedRows;
}

export async function remove(albumId: number) {
  const [r] = await pool.query<ResultSetHeader>('DELETE FROM albums WHERE album_id = ?', [albumId]);
  return r.affectedRows;
}
