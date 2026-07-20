import {type Request, type Response, type NextFunction} from "express"
import {basename} from "path"
import {CustomError, ErrorStatus} from "@sushila/shared"

function isFromAdminEndpoint(req:Request, res:Response, next:NextFunction):void {
    //admin route adds true to req.isFromAdminEndpoint
    if(!req.isFromAdminEndpoint) {
        const lastEndpoint = basename(req.baseUrl);
        throw new CustomError(ErrorStatus.NoRessourceFound, `Ressource couldn't be found!`, `Send your POST-Request to admin/${lastEndpoint}.`,404)
    }
    next();
}

export {isFromAdminEndpoint};