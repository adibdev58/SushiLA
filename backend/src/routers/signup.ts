import {Router} from "express"
import {CustomResponse, type ResponseObjectType, CustomError, ErrorStatus, SignupPostSchema, type SignupPost, type SignupPostResponseData, StoredProcedureName, roles} from "@sushila/shared"
import { validateZodScheme } from "../utils/validateZodScheme.js";
import { insert, queryRoleId,userExists } from "../utils/db.js";

const router = Router();

//completed
router.post("/", async (req, res:ResponseObjectType<SignupPostResponseData>, next) => {
    try {
        const parsedData: Omit<SignupPost,'roleId'> = await validateZodScheme(SignupPostSchema,req.body);
        const userIsAlreadyRegistered = await userExists(parsedData.email);

        if(userIsAlreadyRegistered){
            throw new CustomError(ErrorStatus.EmailIsAlreadyRegistered, `User is already registered!`,`The user's email is already saved in the database.`,400)
        }
        
        const defaultRoleId = await queryRoleId(roles.user);

        const dataToInsert:SignupPost = {...parsedData,roleId: defaultRoleId};

        const result = await insert(dataToInsert,StoredProcedureName.insert_user);
        
        const responseData:SignupPostResponseData = {
            email: dataToInsert.email,
            forename: dataToInsert.forename,
            lastname: dataToInsert.lastname,
            roleId: dataToInsert.roleId
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