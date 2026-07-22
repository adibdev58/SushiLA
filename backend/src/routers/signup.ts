import {Router} from "express"
import {CustomResponse, type ResponseObjectType, CustomError, ErrorStatus, SignupPostSchema, type SignupPost, type SignupPostResponseData, StoredProcedureName} from "@sushila/shared"
import { validateZodScheme } from "../utils/validateZodScheme.js";
import { insert, queryUser,userExists } from "../utils/db.js";
import { parse } from "node:path";

const router = Router();

//completed
router.post("/", async (req, res:ResponseObjectType<SignupPostResponseData>, next) => {
    try {
        const parsedData: SignupPost = await validateZodScheme(SignupPostSchema,req.body);
        const userIsAlreadyRegistered = await userExists(parsedData.email);

        if(userIsAlreadyRegistered){
            throw new CustomError(ErrorStatus.userExistsAlready, `User is already registered!`,`The user's email is already saved in the database.`,400)
        }

        const result = await insert(parsedData,StoredProcedureName.insert_user);
        
        const responseData:SignupPostResponseData = {
            email: parsedData.email,
            forename: parsedData.forename,
            lastname: parsedData.lastname
        }
        const responseObject:CustomResponse<SignupPostResponseData> = new CustomResponse(true, responseData);
        res.status(201).json(responseObject);
        
        
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