import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  // console.log(req.body);

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    

    res.status(200).json({ data:updatedDoctor, message: "successfully updated" });
  } catch (error) {
    res.status(500).json({ message: "failed to update" });
  }
};

export const findDoctor = async (req, res) => {
  const id = req.params.id;

  // console.log(req , "hii");

  try {
    const foundDoctor = await Doctor.findById(id).populate("reviews").select("-password");

    res.status(200).json({ data: foundDoctor, message: "found the Doctor" });
  } catch (error) {
    res.status(404).json({ message: "Doctor not found" });
  }
};

export const findAllDoctor = async (req, res) => {

  try {
    const { query } = req.query;
    // console.log(query);
    let doctors;
    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          {
            name: { $regex: query, $options: "i" },
          },
          {
            specialization: { $regex: query, $options: "i" },
          }
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }

    // console.log(doctors);

    res.status(200).json({data: doctors, message: "found all the Doctors" });
  } catch (error) {
    res.status(404).json({ message: "no Doctors found" });
  }
};


export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedDoctor = await Doctor.findByIdAndDelete(id);

    res.status(200).json({ data:updatedDoctor, message: "Deleted the Doctor" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete" });
  }
};

export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userID
  // console.log();
  
  try {
    const doctor = await Doctor.findById(doctorId)
    // console.log(doctor)
    // console.log("hiii");

    if (!doctor) {
      return res.status(404).json({message: "Doctor not found" , success : "false"})
    }

    const { password, ...rest } = doctor._doc
    const appoinments = await Booking.find({doctor:doctorId})
    
    res.status(200).json({success:true , message: "Profile info is getting" , data : {...rest , appoinments}})

  } catch (err) {
     res.status(500).json({success:false , message: "Something went wrong , cannot get"})
  }
} 
