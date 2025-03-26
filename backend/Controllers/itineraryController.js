import Itinerary from "../models/itinerary.js";
import Tour from "../models/Tour.js";

// Create a new itinerary


// Update an itinerary by ID


// Get all itineraries
export const getAllItineraries = async (req, res) => {
    try {
        const itineraries = await Itinerary.find();
        res.status(200).json(itineraries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get all itineraries by tour ID
export const getAllItinerariesByTourId = async (req, res) => {
    try {
        const itineraries = await Itinerary.find({ tourId: req.params.tourId });
        res.status(200).json(itineraries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
