const UserModel = require("../models/user.model");
const bryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const sendToken = require("../utils/jwtToken");

console.log(UserModel);

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "User Already exist with this email." });

    const hashPassword = await bryptjs.hash(password, 10);

    const user = await UserModel.create({
      name,
      email,
      password: hashPassword,
      avatar: {
        public_id: "This is sample id",
        url: "ImageUrl",
      },
    });
    const token = user.getJWTToken();
    console.log("Token",token);
    res.cookie("jwt", token, { expiresIn: process.env.JWT_EXPIRE });

    res.status(200).json({
      success: "true",
      Token:token,
      message:"Successfully Register",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error,
    });
  }
}

async function loginUser(req, res) {
  console.log("User request reach");

  try {
    const { email, password } = req.body;
    console.log({ email, password });
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser)
      return res
        .status(404)
        .json({ message: `User does'not exist with this email` });

   /* const isPasswordCorrect = await bryptjs.compare(
      password,
      existingUser.password
    );*/

    const isPasswordCorrect= existingUser.comparePassword(password);
    
    console.log(isPasswordCorrect);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid password" });

   /* const token = existingUser.getJWTToken();
    
    await jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET_KEY
    );

    res.cookie("jwt", token, { expiresIn: process.env.JWT_EXPIRE });

    res.status(201).json({
      success: "ok",
      token:token,
       message:"Successfully Logged in" ,
    });*/

    sendToken(existingUser,200,res);
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error,
    });
  }
}

async function logOut(req,res,next){


  res.cookie("token",null,{
    expires:new Date(new Date().getTime()),
    httpOnly:true,
  })

  res.status(200).json({
    success:true,
    message:"Logged Out",
  })
 }

module.exports = {
  registerUser,
  loginUser,
  logOut,
};
