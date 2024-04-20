import jwt from "jsonwebtoken";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const verifyToken = async (req, res, next) => {
  // console.log("inside the token verify");
  const authToken = req.headers.authorization;
  // console.log(authToken);

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "there is no token in the response", success: "false" });
  }

  try {
    const token = authToken.split(" ")[1];

    const decoded = jwt.decode(token, process.env.JWT_SECTRET_KEY);

    req.userID = decoded.id;
    req.role = decoded.role;

    next();
  } catch (err) {
    if (err === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    } else {
      // console.log(err);
      return res
        .status(401)
        .json({ message: "invalid token", success: "false"});
    }
  }
};

export const restrict = (roles) => async (req, res, next) => {
  let userid = req.userID;

  let user;
  const patient = await User.findById(userid);
  const doctor = await Doctor.findById(userid);

  if (patient) {
    user = patient;
  }
  if (doctor) {
    user = doctor;
  }

  if (!roles.includes(user.role)) {
    return res.status(401).json({ message: "you are not allowed" });
  }
  next();
};
