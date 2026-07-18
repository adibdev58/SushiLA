import {Router} from "express";
import productsRouter from "./products.js";

const router = Router();

router.use('/products', (req,res,next) => {
    req.isFromAdminEndpoint = true;
    next();
});

router.use('/products',productsRouter)

export default router;