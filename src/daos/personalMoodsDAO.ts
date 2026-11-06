import { ResultSetHeader } from 'mysql2';
import { pool } from '../db';

export async function upsert(userId: number, albumId: number, moodId: number) {
  await pool.query<ResultSetHeader>(
    `INSERT INTO user_album_moods (user_id, album_id, mood_id) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE mood_id = VALUES(mood_id)`,
    [userId, albumId, moodId]);
}

export async function remove(userId: number, albumId: number) {
  const [r] = await pool.query<ResultSetHeader>(
    'DELETE FROM user_album_moods WHERE user_id = ? AND album_id = ?', [userId, albumId]);
  return r.affectedRows;
}
