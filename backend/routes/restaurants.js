import express from "express";
import {
    createRestaurant,
    updateRestaurant,
    getAllRestaurants,
    getAllRestaurantsByTourId
} from "../Controllers/restaurantController.js";
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router();

// Create a new restaurant
router.post("/", createRestaurant);

// Update a restaurant by ID
router.put("/:id", verifyAdmin, updateRestaurant);

// Get all restaurants
router.get("/", verifyUser, getAllRestaurants);

// Get all restaurants by tour ID
router.get("/tour/:tourId", getAllRestaurantsByTourId);

export default router;
