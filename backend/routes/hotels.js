import express from "express";
import {
    createHotel,
    updateHotel,
    getAllHotels,
    getAllHotelsByTourId
} from '../Controllers/hotelController.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router();

// Create a new hotel
router.post("/", createHotel);

// Update a hotel by ID
router.put("/:id", verifyAdmin, updateHotel);

// Get all hotels
router.get("/", verifyUser, getAllHotels);

// Get all hotels by tour ID
router.get("/tour/:tourId", getAllHotelsByTourId);

export default router;
