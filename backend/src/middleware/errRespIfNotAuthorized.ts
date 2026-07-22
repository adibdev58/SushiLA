import { CustomError, ErrorStatus } from "@sushila/shared";
import type {Request, Response, NextFunction} from "express"

//Todo: save it under @sushila/shared
enum roles {
  admin = 'admin',
  user = 'user'
}

export function errRespIfNotAuthorized(AllowedRoles: roles[]) {
    const middleware = (req: Request, res: Response, next: NextFunction) => {
        const usersRole = req.session.role;
        if(!usersRole) {
            throw new CustomError(ErrorStatus.ServerError, `No role found for user.`, `No role was found for your account. Please log out, clear your cookies, and try again.`,500);
        }

        const userIsAuthorized = AllowedRoles.find(allowedRole => {
            return allowedRole == usersRole
        })

        if(!userIsAuthorized) {
            throw new CustomError(ErrorStatus.NotAuthorized, `Not authorized`, `You don't have the required role to access this endpoint.`,401);
        }
        next();
    }

    return middleware;
}