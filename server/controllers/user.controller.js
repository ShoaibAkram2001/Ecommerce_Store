const UserModel = require("../models/user.model");
const bryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const sendToken = require("../utils/jwtToken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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
    console.log("Token", token);
    res.cookie("jwt", token, { expiresIn: process.env.JWT_EXPIRE });

    res.status(200).json({
      success: "true",
      Token: token,
      message: "Successfully Register",
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

    const isPasswordCorrect = existingUser.comparePassword(password);

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

    sendToken(existingUser, 200, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
}

async function logOut(req, res, next) {
  res.cookie("token", null, {
    expires: new Date(new Date().getTime()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
}

async function forgotPassword(req, res, next) {
  console.log("User forgot password works");
  const email = req.body.email;

  //console.log("email :",email);
  const user = await UserModel.findOne({ email }).maxTime(2000);

  console.log(user.email);

  if (!user)
    return res.status(404).json({
      message: "User not found with this email",
    });

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const messege = `Your password reset Token is :-\n\n${resetPasswordUrl}\n\n If you have not requested this email then , please ignore it`;

  console.log("Messege :", messege);

  try {
    const send = await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      messege,
    });

    console.log(send);
    res.status(200).json({
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    (user.resetPasswordToken = undefined),
      (user.resetPasswordExpire = undefined);

    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      success: false,
      messege: error,
    });
  }
}

const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = UserModel.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(404).json({
      message: "Reset Password token is invalid or has been expired",
    });
  }

  if (req.body.password !== req.body.confirmPassword)
    return res.status(404).json({
      message: " Password dees not match",
    });

  user.password = req.body.password;
  user.resetPassword = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
};

async function userDetails(req, res) {
  //const email=req.body.email;

  const user = await userModel.findById(req.user);

  res.status(200).json({
    success: true,
    user,
  });
}

async function updatePassword(req, res, next) {
  try {
    const user = await userModel.findById(req.user);
    console.log(user);
    console.log(req.body.oldPassword);

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);
    console.log(isPasswordMatch);

    if (!isPasswordMatch)
      return res.status(404).json({
        success: false,
        message: "old password is incorrect ",
      });

    if (req.body.newPassword !== req.body.confirmPassword)
      return res.status(404).json({
        success: false,
        message: "Passwords does not match ",
      });

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error,
    });
  }
}

async function updateProfile(req, res, next) {
  console.log("Body data :", req.body);

  const newUserData = {
    name: req.body.name,
    email: req.body.email,

  };
  const newUser = await UserModel.findById(req.user);
  console.log(newUser);

  newUser.name = newUserData.name;
  newUser.email = newUserData.email;
  await newUser.save();

  console.log(newUser);
  res.status(200).json({
    success: true,
    newUser,
  });
}
//Admin (get All users)
 async function getAllUsers(req,res){
const users=await userModel.find();

  res.status(200).json({
    success:true,
    users,
  })

 }
//updateUserRole
 async function updateUserRole(req, res, next) {
  console.log("Body data :", req.body);

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
   role:req.body.role
  };
  const newUser = await UserModel.findById(req.user);
  console.log(newUser);

  newUser.name = newUserData.name;
  newUser.email = newUserData.email;
  await newUser.save();

  console.log(newUser);
  res.status(200).json({
    success: true,
    newUser,
  });
}

// get Single user(admin)
 async function getSingleUser(req,res){
  const user=await userModel.findById(req.params.id);

  if(!user) return `User not found with id : ${req.params.id}`;


    res.status(200).json({
      success:true,
      user,
    })
  
   }

   
   async  function deleteUser(req,res){

    const user=await userModel.deleteOne({ _id: req.params.id });


    console.log("Deleted user :",user);
    

    res.status(200).json({
      success:true,

      messege:"Successfully user Removed",
    })
   }

module.exports = {
  registerUser,
  loginUser,
  logOut,
  forgotPassword,
  resetPassword,
  userDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  deleteUser,
};
