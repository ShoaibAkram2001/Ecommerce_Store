const express = require("express");
const { registerUser, loginUser, logOut, forgotPassword, resetPassword, userDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, deleteUser} = require("../controllers/user.controller");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/logout',logOut);
userRouter.post('/password/forgot',forgotPassword);
userRouter.put('/password/reset',resetPassword);
userRouter.post('/password/update',isAuthenticatedUser,updatePassword);
userRouter.get('/me',isAuthenticatedUser,userDetails);
userRouter.put('/me/updateProfile',isAuthenticatedUser,updateProfile);
userRouter.get('/admin/users',isAuthenticatedUser,authorizeRoles("admin"),getAllUsers);
userRouter.get('/admin/user/:id',isAuthenticatedUser,authorizeRoles("admin"),getSingleUser);
userRouter.delete('/admin/user/:id',isAuthenticatedUser,authorizeRoles("admin"),deleteUser);


module.exports = {userRouter};
