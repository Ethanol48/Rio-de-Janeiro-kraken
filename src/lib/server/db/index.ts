import { env } from '$env/dynamic/private';
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from 'pg';

const {Pool} = pkg;

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


const db = drizzle({ client: pool });
 
