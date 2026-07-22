import { getTimeStampNowUtcIso } from '@sushila/shared';
import * as zod from "zod";
import {hash} from "@sushila/shared"
import {type Response} from 'express'

export enum ErrorStatus {
    NoRessourceFound = "NoRessourceFound",
    LoginRequired = "LoginRequired",
    AlreadyLoggedIn = "AlreadyLoggedIn",
    NotAuthorized = "NotAuthorized",
    InvalidCredentials = "InvalidCredentials",
    ServerError = "ServerError",
    DatabaseError = "DatabaseError",
    NotFoundInEnv = "NotFoundInEnv",
    ValidationError="ValidationError",
    userExistsAlready="userExistsAlready",
    PasswordHashingError = "PasswordHashingError"
}
export class CustomError {
    readonly status;
    readonly messageShort;
    readonly messageDetailed;
    readonly statusCode?;

    constructor(status: ErrorStatus, messageShort: string, messageDetailed: string, statusCode?:number) {
        this.status = status;
        this.messageShort = messageShort;
        this.messageDetailed = messageDetailed;
        if(!statusCode) {
            return
        }
        this.statusCode = statusCode;
    }
}
export class CustomResponse<T> {
    readonly isSuccess: boolean;
    readonly data: T;
    readonly error: CustomError | undefined;
    readonly timeStamp: string;

    constructor(isSuccess: boolean, data:T, error?: CustomError) {
        this.isSuccess = isSuccess;
        this.data = data;
        this.error = error; 
        this.timeStamp = getTimeStampNowUtcIso();
    }
}
export type ResponseObjectType<T> = Response<CustomResponse<T>>;
//---------------------------------------------------------------------------
export const ProductPostSchema = zod.object({
    creator: zod.string().trim().min(1).max(99),
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
export type ProductPostResponseData = ProductPost;
//---------------------------------------------------------------------------

export const CategorySchema = zod.object({
    name: zod.string().trim().min(1).max(99)
});
export type CategoryPost = zod.infer<typeof CategorySchema>;
export type CategoryPostResponseData = CategoryPost;
//---------------------------------------------------------------------------
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
export type SignupPost = zod.infer<typeof SignupPostSchema>;
export type SignupPostResponseData = Omit<SignupPost , 'password'>;
//---------------------------------------------------------------------------
export const LoginPostSchema = zod.object({
    email: zod.email().trim().toLowerCase(),
    password: zod.string()
})
export type LoginPostResponseData = Omit<UserQueryData, 'password'>
//---------------------------------------------------------------------------
export enum StoredProcedureName {
    insert_product_atomic = "insert_product_atomic",
    insert_category = "insert_category",
    insert_user = "insert_user"
}
//---------------------------------------------------------------------------
export type UserQueryData = {
    "id": number,
    "forename": string,
    "lastname": string,
    "email": string,
    "password": string
}
