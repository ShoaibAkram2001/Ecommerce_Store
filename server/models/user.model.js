const moongose=require('mongoose');
const validator=require('validator');
const jwt =require('jsonwebtoken');
const bcryptjs=require('bcryptjs');
const crypto=require('crypto');
const { token } = require('morgan');

const userSchema=moongose.Schema({

    name:{
        type:String,
        required:[true,"Please enter name"],
        maxLength:[30, "Name can't exceed 30 characters"],
        minLength:[4,"Name should be greater than 4 characters"]
    },
    email:{
        type:String,
        required:[true,"Please enter email"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid email address"]
    },
    password:{
        type:String,
        required:[true,"Please enter password"],
        minLength:[8,"Password should be greater than 8 charcters"]
    },
    avatar:{
        public_id: {
            type: String,
            required:true,
          },
          url: {
            type: String,
            required: true,
          },
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
})

 userSchema.methods.getJWTToken=function(){

    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env. JWT_EXPIRE,
    })
 }

 userSchema.methods.comparePassword= async function(enterPassword){

  return await bcryptjs.compare(enterPassword,this.password);

 }

 userSchema.methods.getResetPasswordToken=function(){

    const resetToken=crypto.randomBytes(20).toString('hex');

    console.log(resetToken);
    //Convert into hash
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest('hex');

    this.resetPasswordExpire=Date.now()+15*60*1000;

    return resetToken;
 }

 

module.exports= moongose.model("User",userSchema);

