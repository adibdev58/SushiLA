import { getTimeStampNowUtcIso } from '@sushila/shared';
import * as zod from "zod";
import {hash} from "@sushila/shared"

export enum ErrorStatus {
    NoRessourceFound = "NoRessourceFound",
    LoginRequired = "LoginRequired",
    AdminRightsRequired = "AdminRightsRequired",
    InvalidCredentials = "InvalidCredentials",
    ServerError = "ServerError",
    DatabaseError = "DatabaseError",
    NotFoundInEnv = "NotFoundInEnv",
    ValidationError="ValidationError",
    PasswordHashingError = "PasswordHashingError"
}
export class CustomError {
    readonly status;
    readonly message;
    readonly statusCode?;
    readonly timeStamp = getTimeStampNowUtcIso();

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
            creationDate: getTimeStampNowUtcIso(),
            ...val
        }
    }
);
    
export type ProductPost = zod.infer<typeof ProductPostSchema>;

export const CategorySchema = zod.object({
    name: zod.string().trim().min(1).max(99)
});

export type CategoryPost = zod.infer<typeof CategorySchema>;

export enum StoredProcedureName {
    insert_product_atomic = "insert_product_atomic",
    insert_category = "insert_category",
    insert_user = "insert_user"
}

export const SignupPostSchema = zod.object({
    forename: zod.string().trim().min(1).max(99).toLowerCase(),
    lastname: zod.string().trim().min(1).max(99).toLowerCase(),
    email: zod.email().trim().min(1).max(99).toLowerCase(),
    password: zod.string().min(
        8,
        "Your password must be at least eight characters long!"
    ).regex(/[a-z]/).regex(
        /[A-Z]/,
        "Your password should contain at least one capital letter!"
    ).regex(
        /[!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@\[\]\^_`{\|}~]/,
        "Your password must contain at least one special character!"
    ).regex(
        /[0-9]/,
        "Your password must contain at least one digit number!"
    ).transform(async (pass)=> {
        return await hash(pass);
    })
})

export type SignupPost = zod.infer<typeof SignupPostSchema>

export const LoginPostSchema = zod.object({
    email: zod.email().trim().toLowerCase(),
    password: zod.string()
})


export type LoginPost = zod.infer<typeof LoginPostSchema>