import {Router} from "express"

const router = Router();

router.post("/", (req, res, next)=> {
    res.json({
        message: " hi"
    })
})

export default router;