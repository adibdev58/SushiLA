import type { NextFunction, Request, Response } from "express";
import { ErrorStatus, CustomError } from "@sushila/shared";

export function errRespIfLoggedIn(req: Request, res: Response, next: NextFunction) {
    if(req.session.email) {
        throw new CustomError(ErrorStatus.AlreadyLoggedIn,`Already logged in!`,`You are already logged in! Use the logout-endpoint or delete the cookie to log out.`,400)
    }
    next();
}