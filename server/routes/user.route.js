const express = require("express");
const { registerUser, loginUser, logOut, forgotPassword, resetPassword, userDetails, updatePassword, updateProfile} = require("../controllers/user.controller");
const { isAuthenticatedUser } = require("../middleware/auth");


const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/logout',logOut);
userRouter.post('/password/forgot',forgotPassword);
userRouter.put('/password/reset',resetPassword);
userRouter.post('/password/update',isAuthenticatedUser,updatePassword);
userRouter.get('/me',isAuthenticatedUser,userDetails);
userRouter.post('/password/updateProfile',isAuthenticatedUser,updateProfile);

module.exports = {userRouter};
