import * as zod from "zod";
import { CustomError ,ErrorStatus } from '@sushila/shared';

export function validateZodScheme<T>(schema: zod.ZodType<T>, data: unknown):T {
    const result = schema.safeParse(data);
    if(!result.success) {
        let errMessages = ""
        result.error.issues.forEach((errObj)=> {
            errMessages+=`${errObj.message}. \\n `
        })
        throw new CustomError(ErrorStatus.ValidationError, `Data couldn't be parsed cause it does not match the schema! \\n ${errMessages}`, 400)
    }
    return result.data
}

