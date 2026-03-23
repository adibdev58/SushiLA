import express from 'express';

import productsRouter from "./products.js";
import adminRouter from './admin.js';


const rootRouterV1 = express.Router();

rootRouterV1.use(express.json())
rootRouterV1.use("/admin", adminRouter);
rootRouterV1.use("/products",productsRouter);


export {rootRouterV1};