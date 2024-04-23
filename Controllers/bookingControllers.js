import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import Stripe from "stripe";

export const getCheckoutSession = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    const user = await User.findById(req.userID);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if (isNaN(doctor.ticketPrice)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid ticket price for the doctor ",
        });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      customer_email: user?.email,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: "inr",
            unit_amount: doctor.ticketPrice * 100,
            product_data: {
              name: doctor.name,
              description: doctor?.bio,
              images: [doctor?.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    // console.log(session);

    const booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice,
      session: session._id,
    });

    await booking.save();

    res
      .status(200)
      .json({ success: true, message: "Successfully Paid", session });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Error creating checkout session" });
  }
};
