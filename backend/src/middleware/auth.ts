import session, { MemoryStore } from "express-session";
import { env } from "process";
import pgSession from "connect-pg-simple"

const secretKey= env.SECRET_SESSION_KEY ?? 'randomAhhKey';

//Todo
export const createSession = session({
        secret: secretKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 604800000, //7 days
            httpOnly: true
        },
        store: new pgSession({

        })
    })
