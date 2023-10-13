const express = require("express");
const { registerUser, loginUser, logOut, forgotPassword } = require("../controllers/user.controller");


const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/logout',logOut);

userRouter.post('/password/forgot',forgotPassword);

module.exports = {userRouter};
