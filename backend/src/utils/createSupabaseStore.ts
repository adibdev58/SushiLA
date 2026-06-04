import { CustomError, ErrorStatus } from "@sushila/shared";
import pgSession from "connect-pg-simple";
import session from "express-session";
import { env } from "node:process";
import pg from "pg";

export default function createSupabaseStore(): pgSession.PGStore {
    process.loadEnvFile('./.env');

    const host = env.SUPABASE_SESSION_HOST;
    const port:number = parseInt(env.SUPABASE_SESSION_PORT ?? '');
    const database = env.SUPABASE_SESSION_DATABASE;
    const user = env.SUPABASE_SESSION_USER;
    const password = env.SUPABASE_SESSION_PASSWORD;

    if(!host || !port || !database || !user || !password) throw new CustomError(ErrorStatus.NotFoundInEnv, `Some important SUPABASE_SESSION value is missing in .env-file!`, `SUPABASE_SESSION_HOST or SUPABASE_SESSION_PORT or SUPABASE_SESSION_DATABASE or SUPABASE_SESSION_USER or SUPABASE_SESSION_PASSWORD is missing in .env-file`,500);
    
    const pgPool = new pg.Pool({
        host:host,
        port:port,
        database:database,
        user:user,
        password: password
        
    })

    const pgStoreObject = pgSession(session);
    const pgStore = new pgStoreObject({
        pool: pgPool,
        tableName: 'session',
        createTableIfMissing: true
    })

    return pgStore
}