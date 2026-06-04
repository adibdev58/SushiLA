import {Router} from "express"
import {CustomResponse, CustomError, ErrorStatus, SignupPostSchema, type SignupPost, StoredProcedureName} from "@sushila/shared"
import { validateZodScheme } from "../utils/validateZodScheme.js";
import { insert, queryUser } from "../utils/db.js";

const router = Router();


//Todo: Improve Error-Message! User exists already, if exists
router.post("/", async (req, res, next)=> {
    try {
        const parsedData: SignupPost = await validateZodScheme(SignupPostSchema,req.body);
        //const userQuery = await queryUser(parsedData.email);
        //const userIsAlreadyRegistered = userQuery.data.email === parsedData.email;

        const result = await insert(parsedData,StoredProcedureName.insert_user);
        res.status(201).json(result);
    } catch (err) {
        if(err instanceof CustomError) {
            throw err
        }
        else {
            throw new CustomError(ErrorStatus.ServerError, `Failed to sign up!`,`Something went wrong with POST-operation! Potential causes: Invalid schema, duplicate user, or database connection issue. rawError: ${err}`,500)
        }
    }
})

export default router;