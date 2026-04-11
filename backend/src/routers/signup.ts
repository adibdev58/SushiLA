import {Router} from "express"
import * as zod from "zod"
import {CustomError, ErrorStatus} from "@sushila/shared"
import { validateZodScheme } from "../utils/validateZodScheme.js";

const router = Router();


const SignupPostSchema = zod.object({
    forename: zod.string().trim().min(1).max(99),
    lastname: zod.string().trim().min(1).max(99),
    email: zod.email().trim().min(1).max(99),
    password: zod.string().min(8).regex(/[a-z]/).regex(/[A-Z]/).regex(/[!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@\[\]\^_`{\|}~]/).regex(/[0-9]/)
})


router.post("/", (req, res, next)=> {
    try {
        const parsedData = validateZodScheme(SignupPostSchema,req.body);
        res.json(parsedData)
    } catch (err) {
        if(err instanceof CustomError) {
            throw err
        }
        else {
            throw new CustomError(ErrorStatus.ServerError, `Something went wrong with POST-operation! ${err}`,500)
        }
    }

    
})

export default router;