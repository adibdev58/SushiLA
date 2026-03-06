import express from 'express';

import productsRouter from "./products.js"

const rootRouterV1 = express.Router();





rootRouterV1.use("/products", productsRouter);

export {rootRouterV1};