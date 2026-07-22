import express from 'express';

import productsRouter from "./products.js";
import adminRouter from './admin.js';
import categoriesRouter from "./categories.js"
import signupRouter from "./signup.js"
import loginRouter from "./login.js"

import {createSession, errRespIfLoggedIn, errRespIfNotLoggedIn, errRespIfNotAuthorized} from "../middleware/index.js"

const rootRouterV1 = express.Router();

rootRouterV1.use(createSession())

//Todo: save it under @sushila/shared
enum roles {
  admin = 'admin',
  user = 'user'
}

rootRouterV1.use(express.json())
//Todo: Add roles in DB!
rootRouterV1.use("/admin", errRespIfNotLoggedIn, errRespIfNotAuthorized([roles.admin]), adminRouter);
rootRouterV1.use("/products",productsRouter);
rootRouterV1.use("/categories",categoriesRouter);
rootRouterV1.use("/signup", errRespIfLoggedIn, signupRouter);
rootRouterV1.use("/login", errRespIfLoggedIn, loginRouter);

export {rootRouterV1};