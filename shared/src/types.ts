import { getTimeStampNowLocal } from 'backend/dist/utils/getTimeStampNowLocal.js';
import * as zod from "zod";

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

export const ProductPostSchema = zod.object({
          name: zod.string().trim().min(1).max(99),
          imgUrls: zod.array(
            zod.object({url: zod.string().trim().min(1).max(1000) }),
          ),
          description: zod.string().trim().min(1).max(2000),
          ingredients: zod.array(zod.object({name: zod.string().trim().min(1).max(1000) })),
          weight: zod.int().min(1).max(9999),
          price: zod.float32().min(0).max(999.999),
          discountPrice: zod.float32().min(0).max(999.999),
          isAvailable: zod.boolean(),
          specialFeatures: zod.array(
            zod.object({ id: zod.int().nonnegative()}),
          ),
          categories: zod.array(
            zod.object({ id: zod.int().nonnegative()}),
          ),
        }).transform(
            (val)=> {
                return {
                    creationDate: getTimeStampNowLocal(),
                  ...val
                }
            }
        );

export type ProductPost = zod.infer<typeof ProductPostSchema>;