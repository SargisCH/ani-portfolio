import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Store your connection string in .env
});

export default pool;
