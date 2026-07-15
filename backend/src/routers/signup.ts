import {Router, type NextFunction, type RequestHandler, type Response, type Request} from "express"
import {CustomResponse, CustomError, ErrorStatus, SignupPostSchema, type SignupPost, type SignupPostResponseData, StoredProcedureName} from "@sushila/shared"
import { validateZodScheme } from "../utils/validateZodScheme.js";
import { insert, queryUser,userExists } from "../utils/db.js";

const router = Router();

type PostDefaultResponse = Response<CustomResponse<any>>;

//completed
router.post("/", async (req, res:PostDefaultResponse, next) => {
    try {
        const parsedData: SignupPost = await validateZodScheme(SignupPostSchema,req.body);
        const userIsAlreadyRegistered = await userExists(parsedData.email);

        if(userIsAlreadyRegistered){
            throw new CustomError(ErrorStatus.userExistsAlready, `User is already registered!`,`The user's email is already saved in the database.`,400)
        }

        const result = await insert(parsedData,StoredProcedureName.insert_user);
        const responseObject:CustomResponse<any> = new CustomResponse(true, result);
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