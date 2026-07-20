import {Router} from "express";
import productsRouter from "./products.js";
import categoriesRouter from "./categories.js";

const router = Router();

router.use('/products', (req,res,next) => {
    req.isFromAdminEndpoint = true;
    next();
});

router.use('/categories', (req,res,next) => {
    req.isFromAdminEndpoint = true;
    next();
});

router.use('/products',productsRouter)
router.use('/categories',categoriesRouter)

export default router;