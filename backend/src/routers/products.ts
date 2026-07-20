import express from "express"
import {type Request, type NextFunction} from "express"
import { CustomError ,ErrorStatus, ProductPostSchema, type ProductPost, StoredProcedureName, CustomResponse, type ResponseObjectType, type ProductPostResponseData } from '@sushila/shared';
import { validateZodScheme } from '../utils/validateZodScheme.js';
import {insert} from "../utils/db.js"
import {isFromAdminEndpoint} from "../middleware/index.js";

const router = express.Router();

//max 30 newest products
router.get("/", (req, res)=> {
    res.json(
        {
            id: 1,
            name: "mango"
        }
    )
})

//Completed
router.post("/", isFromAdminEndpoint, async (req:Request, res: ResponseObjectType<ProductPostResponseData>, next:NextFunction)=> {
    try {
        const parsedBody: ProductPost = await validateZodScheme(ProductPostSchema,req.body);
        const insertionData = await insert(parsedBody, StoredProcedureName.insert_product_atomic);

        const responseData: ProductPostResponseData = parsedBody;
        const response: CustomResponse<ProductPostResponseData> = new CustomResponse(true, responseData);

        res.status(201).json(response)
    } catch(err) {
        if(err instanceof CustomError) {
            next(err)
        } else {
            next(new CustomError(ErrorStatus.ServerError, `DB Insert Error`, ` ${err}`,500))
        }
    }   
})

export default router