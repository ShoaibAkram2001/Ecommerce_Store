const express = require("express");
const { registerUser, loginUser, logOut } = require("../controllers/user.controller");


const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/logout',logOut);

module.exports = {userRouter};
