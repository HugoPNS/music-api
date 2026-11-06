import { RowDataPacket } from 'mysql2';
import { pool } from '../db';

export async function readAll() {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT mood_id, name FROM moods ORDER BY mood_id');
  return rows;
}
