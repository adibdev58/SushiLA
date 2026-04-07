import express from 'express';

import productsRouter from "./products.js";
import adminRouter from './admin.js';
import categoriesRouter from "./categories.js"

const rootRouterV1 = express.Router();

rootRouterV1.use(express.json())
rootRouterV1.use("/admin", adminRouter);
rootRouterV1.use("/products",productsRouter);
rootRouterV1.use("/categories",categoriesRouter);

export {rootRouterV1};