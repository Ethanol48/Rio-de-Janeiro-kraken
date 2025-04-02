import { env } from '$env/dynamic/private';
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from 'pg';

const {Pool} = pkg;

//if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const url = "postgresql://user:password@localhost:5432/mydatabase";

const pool = new Pool({
  connectionString: url
});


export const db = drizzle({ client: pool });
 
