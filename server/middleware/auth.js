const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const isAuthenticatedUser = (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);

  /**/ if (!token) {
    return res.status(401).json({ message: " Please login to access to resource" });
  }

  // Verify and decode the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, async(err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Please login to access to resource" });
    }

    // If the token is valid, you can access the user's data in `decoded`

    req.user = await UserModel.findById(decoded.id);
    console.log("User find is :",req.user);

    next();
  });
};

const authorizeRoles = function (...roles) {
  return (req, res, next) => {
   console.log("Role:",req.user.role);
    if (!roles.includes(req.user.role)) {
      return res.status(400).json({
        success: false,
        Role: `${req.user?.role} is not allowed to access resource`,
      });
    }

    next();
  };
};



module.exports = {
  isAuthenticatedUser,
  authorizeRoles,
};
