import type { NextFunction, Request, Response } from "express";
import { ErrorStatus, CustomError } from "@sushila/shared";

export function errRespIfNotLoggedIn(req: Request, res: Response, next: NextFunction) {
    if(!req.session.email) {
        throw new CustomError(ErrorStatus.LoginRequired,`Login required!`,`Please log in and try again! `,401);
    }
    next();
}