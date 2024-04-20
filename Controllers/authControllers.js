import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "10d",
    }
  );
};

export const register = async (req, res) => {
  const { name, email, password, gender, role, photo } = req.body;

  // console.log(req.body);

  try {
    let user = null;

    if (role === "doctor" || role === "Doctor") {
      user = await Doctor.findOne({ email });
    } else if (role === "patient") {
      user = await User.findOne({ email });
    }

    if (user) {
      return res.status(400).json({ message: "User is already present" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }
    // if (role === "Doctor") {
    //   role = "doctor"
    // }
    if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role : "doctor",
      });
    }

    await user.save();

    res
      .status(200)
      .json({ sucess: true, message: "User Sucessfully Registered" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ sucess: false, message: "internal server error , try again" , error: `${err}`  });
  }
};

export const login = async (req, res) => {
  const { email } = req.body;

  let user = null;

  try {
    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isPasswordMatch = await bcrypt.compare( req.body.password, user.password);

    if (!isPasswordMatch) {
      res.status(400).json({ message: "password doesn't match" });
    }

    const token = generateToken(user);

    const { password, role, appoinments, ...rest } = user._doc;

    res.status(200).json({
      message: "Sucessfully login",
      token,
      data: { ...rest },
      role,
    });
  } catch (error) {
    // console.log(error , "hii");
    res.status(500).json({ message: "Failed to Login" });
  }
};
