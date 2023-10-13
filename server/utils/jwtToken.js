const fiveDaysInMilliseconds = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

// Calculate the expiration date
const expirationDate = new Date(new Date().getTime() + fiveDaysInMilliseconds);
//create token save in cookie
const sendToken=(user,statusCode,res)=>{
    
    const token=user.getJWTToken();

    const options={
       maxAge: expirationDate,
        httpOnly:true,
    }

    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token,
    });
}

module.exports=sendToken;