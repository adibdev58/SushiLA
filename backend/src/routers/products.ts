import express from "express"
import {type Request, type NextFunction} from "express"
import { CustomError ,ErrorStatus, ProductPostReqSchema, type ProductDbInsert, CustomResponse, type ResponseObjectType, type ProductPostResponse, getTimeStampNowUtcIso } from '@sushila/shared';
import { validateZodScheme } from '../utils/validateZodScheme.js';
import {insertProduct} from "../utils/db.js"
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

//completed
router.post("/", isFromAdminEndpoint, async (req:Request, res: ResponseObjectType<ProductPostResponse>, next:NextFunction)=> {
    try {
        const currentUserMail = req.session.UserData?.email;
        if(!currentUserMail) {
            throw new CustomError(ErrorStatus.ServerError, `Something went wrong! Please log out and try again.`, ` There is something wrong with the session/cookie data. The email could not be found in the session data.`,500)
        }
        const parsedData = await validateZodScheme(ProductPostReqSchema,req.body);
        const dataToInsert: ProductDbInsert = {
            ...parsedData, 
            creationDate: getTimeStampNowUtcIso(),
            creator: currentUserMail,
            lastUser: currentUserMail,
            lastUpdateDate: getTimeStampNowUtcIso()};

        const insertedData:ProductPostResponse = await insertProduct(dataToInsert);

        const response: CustomResponse<ProductPostResponse> = new CustomResponse(true, insertedData);

        res.status(201).json(response)
    } catch(err) {
        if(err instanceof CustomError) {
            next(err)
        } else {
            next(new CustomError(ErrorStatus.ServerError, `DB Insert Error`, ` ${err}`,500))
        }
    }   
})

//Todo: Implement Put
//Todo: Added lastUpdateDate, lastUser and creator-Colums to products table in DB. So adjust all controllers/request-handlers for products-Endpoints.
router.put('/:productId',isFromAdminEndpoint, async (req , res, next) => {
     try {
        /* const parsedBody: ProductPost = await validateZodScheme(ProductPostSchema,req.body);
        const insertionData = await insert(parsedBody, StoredProcedureName.insert_product_atomic);

        const responseData: ProductPostResponseData = parsedBody;
        const response: CustomResponse<ProductPostResponseData> = new CustomResponse(true, responseData); */

        //res.status(201).json(response)
    } catch(err) {
        if(err instanceof CustomError) {
            next(err)
        } else {
            next(new CustomError(ErrorStatus.ServerError, `DB update Error`, `${err}`,500))
        }
    }   
})

export default router