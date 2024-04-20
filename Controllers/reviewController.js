import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const getAllReviews = async (req, res) => {

    try {
        const reviews = await Review.find({});

        res.status(200).json({ message: "Reviews retrived successfully", data: reviews });

    } catch (error) {
        res.status(404).json({message: "reviews not found" ,message: "failed" , err : error})
    }
}

export const createReview = async (req, res) => {
    
    if (!req.body.doctor) {
        req.body.doctor = req.params.doctorId;
    }
    if (!req.body.user) {
        req.body.user = req.userID
    }
    
    const newReview = new Review(req.body);

    try {

        // console.log(req.params.doctorId);
        // console.log(req.userID);

        const savedReview = await newReview.save();

        await Doctor.findByIdAndUpdate(req.body.doctor, {
            $push: {reviews: savedReview._id }
        })

        res.status(200).json({message: "the review is added" , success : "true" , data: savedReview})
        
    } catch (error) {
        res.status(500).json({message: "the review is not added " , success : "false" , err: error})
    }
}