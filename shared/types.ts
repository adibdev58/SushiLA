import { getTimeStampNowLocal } from '../backend/utils/getTimeStampNowLocal.js';

export enum ErrorStatus {
    NoRessourceFound = "NoRessourceFound",
    LoginRequired = "LoginRequired",
    AdminRightsRequired = "AdminRightsRequired",
    InvalidCredentials = "InvalidCredentials",
    ServerError = "ServerError",
    DatabaseError = "DatabaseError",
    NotFoundInEnv = "NotFoundInEnv",
    ValidationError="ValidationError"
}


export class CustomError {
    readonly status;
    readonly message;
    readonly statusCode?;
    readonly timeStamp = getTimeStampNowLocal();

    constructor(status: ErrorStatus, message: string, statusCode?:number) {
        this.status = status;
        this.message = message;
        if(!statusCode) {
            return
        }
        this.statusCode = statusCode;
    }
}
export class CustomErrorObject {
    constructor(err: CustomError) {
        Object.assign(this,err);
    }
}