// app/lib/db.ts or src/lib/db.ts
import { Pool } from 'pg';

// 1. Create a single pool instance that gets reused across your backend
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Export a clean helper function to execute SQL statements safely
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query successfully', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};