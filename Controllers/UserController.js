import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";

export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({ data:updatedUser, message: "successfully updated" });
  } catch (error) {
    res.status(500).json({ message: "failed to update" });
  }
};

export const findUser = async (req, res) => {
  const id = req.params.id;

  try {
    const foundUser = await User.findById(id).select("-password");

    res
      .status(200)
      .json({ data: foundUser, message: "found the user", success: "true" });
  } catch (error) {
    res.status(404).json({ message: "user not found", success: "false" });
  }
};

export const findAllUser = async (req, res) => {
  try {
    const updatedUser = await User.find({}).select("-password");

    res.status(200).json({data: updatedUser, message: "found all the users" });
  } catch (error) {
    res.status(404).json({ message: "no users found", success: "false" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndDelete(id);

    res.status(200).json({data: updatedUser, message: "Deleted the user" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete" });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userID;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "user not found in db", success: "false" });
    }

    const { password, ...rest } = user._doc;


    res.status(200).json({
      success: false,
      message: "Profile info is getting",
      data: { ...rest },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong , cannot get" });
  }
};

export const getMyAppoinments = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId });

    const doctorIds = bookings.map((el) => el.doctor.id);

    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );

    res.status(200).json({
      success: "true",
      message: "Appoinments for you",
      data: doctors,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: "false", message: "Something went wrong , cannot get" });
  }
};
