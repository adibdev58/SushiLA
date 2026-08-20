import {Router} from "express"
import {CustomResponse, type ResponseObjectType, CustomError, ErrorStatus, SignupPostReqSchema, type SignupDbInsert, type SignupPostResponse, StoredProcedureName, roles} from "@sushila/shared"
import {validateZodScheme } from "../utils/validateZodScheme.js";
import {insertUser, queryRoleId,userExists } from "../utils/db.js";

const router = Router();

//completed
router.post("/", async (req, res:ResponseObjectType<SignupPostResponse>, next) => {
    try {
        const parsedData = await validateZodScheme(SignupPostReqSchema,req.body);
        const userIsAlreadyRegistered = await userExists(parsedData.email);

        if(userIsAlreadyRegistered){
            throw new CustomError(ErrorStatus.EmailIsAlreadyRegistered, `User is already registered!`,`The user's email is already saved in the database.`,400)
        }
        
        const defaultRoleId = await queryRoleId(roles.user);

        const dataToInsert:SignupDbInsert = 
        {
            ...parsedData,
            roleId: defaultRoleId
        };

        const result:SignupPostResponse = await insertUser(dataToInsert);

        const responseObject:CustomResponse<SignupPostResponse> = new CustomResponse(true, result);
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