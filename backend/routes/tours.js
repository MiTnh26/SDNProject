import express from 'express'
import { getAllTour, getFeaturedTour, getSingleTour, getTourBySearch, getTourCount} from '../Controllers/tourControllers.js'

import { verifyAdmin } from '../utils/verifyToken.js'

const router = express.Router()





//Get single tour 
router.get('/:id', getSingleTour)

//Get all tour 
router.get('/', getAllTour)

//Get tour by search
router.get("/search/getTourBySearch", getTourBySearch)
router.get("/search/getFeaturedTour", getFeaturedTour)
router.get("/search/getTourCount", getTourCount)




export default router