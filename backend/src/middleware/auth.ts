import session, { MemoryStore } from "express-session";
import { env } from "process";
import pgSession from "connect-pg-simple"
import { CustomError, ErrorStatus } from "@sushila/shared";



//Todo
export const createSession = async () => {

    const secretKey = env.SECRET_SESSION_KEY;
    const postgresConnectionString = env.SUPABASE_POSTGRESQL_DIRECT_CONNECTION_URI;

    if(!secretKey || !postgresConnectionString) throw new CustomError(ErrorStatus.NotFoundInEnv, `Some important value is missing in .env-file! ${secretKey}`,500);

    const pgStore = pgSession(session);

    const sessionMiddleware = session({
        secret: secretKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 604800000, //7 days
            httpOnly: true
        },
        //Todo:Fix! Promise is not resolving. 
        store: new pgStore({
            conString: postgresConnectionString,
            tableName: 'user_session',
            createTableIfMissing: true
        })
    })

    return sessionMiddleware
}
