import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'motos_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function query(sql: string, values?: any[]) {
  const [rows] = await pool.execute(sql, values);
  return rows;
}

export async function initDatabase() {
  const connection = await pool.getConnection();
  try {
    const schemaPath = path.join(process.cwd(), 'schema.sql');
    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        const statements = schema.split(';').filter(s => s.trim().length > 0);
        for (const statement of statements) {
            await connection.query(statement);
        }
        console.log('Database tables verified/created.');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    connection.release();
  }
}

export default pool;
