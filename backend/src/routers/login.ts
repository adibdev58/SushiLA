import {Router} from "express"
import { type LoginPost, LoginPostSchema } from "@sushila/shared";
import { validateZodScheme } from "../utils/validateZodScheme.js";
import { queryUser } from "../utils/db.js";
import * as bcrypt from "bcrypt"

const router = Router();


//Todo Login implementieren!
router.post("/", async (req, res, next)=> {
    const parsedData = await validateZodScheme(LoginPostSchema,req.body);
    const {email, password} = parsedData;
    const userQuery = await queryUser(email);
    const plainPassword = password;
    const hashedPassword  = userQuery.data.password;

    const passwordIsCorrect = await bcrypt.compare(plainPassword, hashedPassword);
    

    res.json({...userQuery, passwordIsCorrect})
})

export default router;