import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/userRoutes.js"
import doctorRoute from "./Routes/docotrRoutes.js"
import reviewRoute from "./Routes/reviewRoutes.js";
import emailRoute from "./Routes/emailRoute.js"
import bookingRoute from './Routes/booking.js'
import EventEmitter from "events"

dotenv.config();

const app = express();

const myEmitter = new EventEmitter();

myEmitter.setMaxListeners(20);

const port = process.env.PORT || 8000;

const corsOptions = {
  origin: true,
};

app.get("/", (req, res) => {
  res.send("api is working");
});

mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("mongoDb connected");
  }
  catch (error)
  {
    console.log("mongoDb connection failed ::####");
  }
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/send-email", emailRoute);
app.use("/api/v1/bookings", bookingRoute);



app.listen(port, () => {
  connectDB();
  console.log(`app is listening on ${port}`);
});
