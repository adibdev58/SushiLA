import {Router} from "express"
import { type LoginPost, LoginPostSchema } from "@sushila/shared";
import { validateZodScheme } from "../utils/validateZodScheme.js";
import { queryUser } from "../utils/db.js";

const router = Router();


//Todo Login implementieren!
router.post("/", async (req, res, next)=> {
    const parsedData = await validateZodScheme(LoginPostSchema,req.body);
    const {email, password} = parsedData;
    const userQuery = await queryUser(email);
    

    res.json(userQuery)
})

export default router;