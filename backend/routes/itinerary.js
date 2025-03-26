import express from "express";
import {
   
    getAllItineraries,
    getAllItinerariesByTourId
} from '../Controllers/itineraryController.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router();



// Get all itineraries
router.get("/",  getAllItineraries);

// Get all itineraries by tour ID
router.get("/tour/:tourId", getAllItinerariesByTourId);

export default router;
