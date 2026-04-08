import {Router} from "express"
import { CustomError ,ErrorStatus, CategorySchema, type CategoryPost } from '@sushila/shared';
import {insert} from "../utils/db.js"

const router = Router();

router.post("/", async (req,res,next)=> {
    try {
        const parsedBody: CategoryPost = CategorySchema.parse(req.body);
        res.status(201).json(await insert(parsedBody))
    } catch(err) {
        if( err instanceof CustomError) {
            throw err
        } else {
            throw new CustomError(ErrorStatus.ServerError,`Something went wrong with inserting in DB! ${err}`,500)
        }
       
    }
})

export default router;