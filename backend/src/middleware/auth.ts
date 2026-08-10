import session from "express-session";
import { env } from "process";
import { CustomError, ErrorStatus } from "@sushila/shared";
import createSupabaseStore from "../utils/createSupabaseStore.js"

import type { NextFunction,Request, Response } from "express";

export const createSession = () => {
    
    process.loadEnvFile('./.env');
    const secretKey = env.SECRET_SESSION_KEY;
    if(!secretKey) throw new CustomError(ErrorStatus.NotFoundInEnv, `Some important value is missing in .env-file!`, `SECRET_SESSION_KEY is missing in .env.`,500);

    //Todo: Secure should be true (so the browser sends the cookie only encrypted to server) after the connection via https is configured. (For now let it be because of certificate headache)
    const sessionMiddleware = session({
        secret: secretKey,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 604800000,
            httpOnly: true,
            secure: false
        },
        store: createSupabaseStore()
    })

    return (req: Request, res: Response, next:NextFunction) => {
        try {
            sessionMiddleware(req,res,next)
        } catch (err) {
            if(err instanceof CustomError) next(err);
            else {
                const errCustom = new CustomError(ErrorStatus.ServerError,`Something went wrong with creating Session!`, `${err}`,500);
                next(errCustom)
            }
        }
    }

}
