import express from "express";
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from "cookie-parser";
import tourRoute from './routes/tours.js'
import userRoute from './routes/users.js'
import authRoute from './routes/auth.js'
import reviewRoute from './routes/reviews.js'
import bookingRoute from './routes/bookings.js'
import hotelRoute from './routes/hotels.js'
import itineraryRoute from './routes/itinerary.js'
import restaurantRoute from './routes/restaurants.js'
import paymentRoute from './routes/paymentRoute.js'; // Import paymentRoute
import Tour from "./models/Tour.js"
import Booking from "./models/Booking.js"
import User from "./models/User.js"

dotenv.config()
const app = express()
const port = process.env.PORT || 8000
const corsOptions = {
   origin: true,
   credentials: true
}

mongoose.set("strictQuery", false)
const connect = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true
      })

      console.log('MongoDB connected')
   } catch (error) {
      console.log('MongoDB connected failed')
   }
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/tours", tourRoute)
app.use("/api/v1/users", userRoute)
app.use("/api/v1/review", reviewRoute)
app.use("/api/v1/booking", bookingRoute)
app.use("/api/v1/hotels", hotelRoute)
app.use("/api/v1/itinerary", itineraryRoute)
app.use("/api/v1/restaurants", restaurantRoute)
app.use("/api/v1/payment", paymentRoute); 

app.get("/tours/low-rated", async (req, res) => {
   try {
       const minRating = parseFloat(req.query.minRating) || 1;
       const maxRating = parseFloat(req.query.maxRating) || 3;

       // Lấy tất cả tour và populate review
       const tours = await Tour.find().populate("reviews").exec();

       // Lọc ra những tour có rating trung bình trong khoảng minRating - maxRating
       const filteredTours = tours.filter((tour) => {
           if (!tour.reviews.length) return false; // Nếu không có đánh giá, bỏ qua

           // Tính trung bình rating
           const avgRating =
               tour.reviews.reduce((sum, review) => sum + review.rating, 0) /
               tour.reviews.length;

           return avgRating >= minRating && avgRating <= maxRating;
       });

       res.json(filteredTours);
   } catch (error) {
       console.error("Error fetching tours:", error);
       res.status(500).json({ error: "Internal Server Error" });
   }
});

app.get("/api/users/booked-by-year", async (req, res) => {
   try {
       const { year } = req.query;
       if (!year) return res.status(400).json({ message: "Không có booking nào!" });

       const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
       const endDate = new Date(`${Number(year) + 1}-01-01T00:00:00.000Z`);

       const bookings = await Booking.find({
           createdAt: { $gte: startDate, $lt: endDate }
       });

       res.json(bookings);
   } catch (error) {
       res.status(500).json({ message: "Lỗi server", error: error.message });
   }
});


app.get("/api/users/not-booked", async (req, res) => {
   try {
       // Lấy danh sách userId từ bảng Booking
       const bookedUserIds = await Booking.distinct("userId");
       console.log("User IDs đã booking:", bookedUserIds);

       // Lọc những userId hợp lệ
       const validBookedUserIds = bookedUserIds.filter(id => mongoose.Types.ObjectId.isValid(id));

       // Tìm những user **KHÔNG** có trong danh sách đã booking
       const notBookedUsers = await User.find({ _id: { $nin: validBookedUserIds } });

       res.json(notBookedUsers);
   } catch (error) {
       console.error("Lỗi truy vấn API:", error);
       res.status(500).json({ message: "Lỗi server", error: error.message });
   }
});




app.listen(port, () => {
   connect()
   console.log('server listening on port', port)
})
