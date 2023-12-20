
const express=require('express');
const app=require('../app');
const { newOrder, getSingleOrder, myOrders, getAllOrders, deleteOrder, updateOrder} = require('../controllers/order.controller');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const orderRouter=express.Router();

orderRouter.post("/order/new",isAuthenticatedUser,newOrder);
orderRouter.get("/order/:id",isAuthenticatedUser,getSingleOrder);
orderRouter.get("/order/me",isAuthenticatedUser,myOrders);
orderRouter.get("/admin/orders",isAuthenticatedUser,authorizeRoles("admin"),getAllOrders)
orderRouter.put("/admin/order:id",isAuthenticatedUser,authorizeRoles("admin"),updateOrder)
orderRouter.delete("/admin/order:id",isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)

module.exports={orderRouter};
