import {Router} from "express"
import {type Request, type NextFunction} from "express"
import {CustomError ,ErrorStatus, CustomResponse ,type ResponseObjectType ,CategoryPostReqSchema, type CategoryDbInsert, type CategoryPostResponse } from '@sushila/shared';
import {insertCategory} from "../utils/db.js"
import { isFromAdminEndpoint } from "../middleware/isFromAdminEndpoint.js";

const router = Router();

//Completed
router.post("/" ,isFromAdminEndpoint ,async(req:Request,res:ResponseObjectType<CategoryPostResponse> ,next:NextFunction)=> {
    try { 
        const parsedBody: CategoryDbInsert = CategoryPostReqSchema.parse(req.body);
        const responseData: CategoryPostResponse = await insertCategory(parsedBody);
      
        const response:CustomResponse<CategoryPostResponse> = new CustomResponse(true, responseData);
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