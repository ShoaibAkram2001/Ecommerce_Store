const express = require("express");
const app = require("../app");
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/product.controller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
//const errorMiddleware=require('../middleware/Error');
const productRouter = express.Router();

productRouter.get("/products", getAllProducts);
productRouter.post("/product/new",isAuthenticatedUser,authorizeRoles("admin"),createProduct);
productRouter.put("/product/:id",isAuthenticatedUser,authorizeRoles("admin"),updateProduct);
productRouter.delete("/product/:id",isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);


module.exports={
    productRouter,
}