import session, { MemoryStore } from "express-session";
import { env } from "process";
import pgSession from "connect-pg-simple"
import { CustomError, ErrorStatus } from "@sushila/shared";

import pg from "pg"
import {parse, toClientConfig} from "pg-connection-string"
import type { NextFunction,Request, Response } from "express";

//Todo
export const createSession = () => {
        /*   const secretKey = env.SECRET_SESSION_KEY;
            const postgresConnectionString = env.SUPABASE_POSTGRESQL_DIRECT_CONNECTION_URI;    
            if(!secretKey || !postgresConnectionString) throw new CustomError(ErrorStatus.NotFoundInEnv, `Some important value is missing in .env-file! ${secretKey}`,500); */
        
            const pgStore = pgSession(session);
        /*     const pgPool = new pg.Pool({
                connectionString: postgresConnectionString,
                max: 10, 
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            })
        
            pgPool.query("select * from users",(err, result) => {
                console.log(result)
                console.log(err)
            }) */
        
          const sessionMiddleware = session({
                    secret: "secretKey",
                    resave: false,
                    saveUninitialized: true,
                    cookie: {
                        maxAge: 604800000, //7 days
                        httpOnly: true,
                        secure: false
                    },
                    
                    //Todo:Fix! Promise is not resolving. 
                /*   store: new pgStore({
                        conString: postgresConnectionString,
                        tableName: 'session',
                        createTableIfMissing: true
                    }) */
            })
    
            return (req: Request, res: Response, next:NextFunction) => {
                try {
                    sessionMiddleware(req,res,next)
                } catch (err) {
                    if(err instanceof CustomError) next(err);
                    else {
                        const errCustom = new CustomError(ErrorStatus.ServerError,`Something went wrong with creating Session! ${err}`,500);
                        next(errCustom)
                    }
                }
            }

}
