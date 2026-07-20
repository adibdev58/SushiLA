import {Router} from "express"
import {type Request, type NextFunction} from "express"
import {CustomError ,ErrorStatus, CustomResponse ,type ResponseObjectType ,CategorySchema, type CategoryPost, type CategoryPostResponseData, StoredProcedureName } from '@sushila/shared';
import {insert} from "../utils/db.js"
import { isFromAdminEndpoint } from "../middleware/isFromAdminEndpoint.js";

const router = Router();

//Completed
router.post("/" ,isFromAdminEndpoint ,async(req:Request,res:ResponseObjectType<CategoryPostResponseData> ,next:NextFunction)=> {
    try { 
        const parsedBody: CategoryPost = CategorySchema.parse(req.body);
        const result = await insert(parsedBody, StoredProcedureName.insert_category);

        const responseData: CategoryPostResponseData = parsedBody;
        const response:CustomResponse<CategoryPostResponseData> = new CustomResponse(true, responseData);
        res.status(201).json(response);
    } catch(err) {
        if( err instanceof CustomError) {
            throw err
        } else {
            throw new CustomError(ErrorStatus.ServerError,`Inserting in DB failed!`, `${err}`,500)
        } 
    }
})

export default router;