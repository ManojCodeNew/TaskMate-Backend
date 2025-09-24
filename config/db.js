import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // example: postgres://user:pass@localhost:5432/dbname
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export default pool;
