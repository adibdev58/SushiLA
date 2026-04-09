import {Router} from "express"

const router = Router();

//Todo
//Doch ne scheiß Idee. 2 Router erstellen. Je für Login und Signup. Ist flexibler und wartbarer.
router.use((req, res, next)=> {
    console.log(req.path)
})
export default router;