// shared/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: 'liliaadmin2',
  host: 'localhost',
  database: 'lilia2',
  password: 'lilia2024',
  port: 5432,
});

export default pool;
