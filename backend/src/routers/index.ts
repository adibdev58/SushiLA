import express from 'express';

import productsRouter from "./products.js";
import adminRouter from './admin.js';
import categoriesRouter from "./categories.js"
import signupRouter from "./signup.js"
import loginRouter from "./login.js"

const rootRouterV1 = express.Router();

rootRouterV1.use(express.json())
rootRouterV1.use("/admin", adminRouter);
rootRouterV1.use("/products",productsRouter);
rootRouterV1.use("/categories",categoriesRouter);
rootRouterV1.use("/signup", signupRouter);
rootRouterV1.use("/login", loginRouter);

export {rootRouterV1};