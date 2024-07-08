import express from 'express'
import { createBooking, getAllBooking, getBooking, deleteBooking, getAllBookingByUserId, updateBookingById, cancelBookingById } from '../Controllers/bookingController.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.post('/', verifyUser, createBooking)
router.get('/:id', verifyUser, getBooking)
router.get('/', verifyUser, getAllBooking)
router.delete('/:bookingId', verifyUser, deleteBooking)
router.get('/user/:userId', verifyUser, getAllBookingByUserId)
router.put("/:bookingId", verifyUser, updateBookingById);
router.put("/cancel/:bookingId", verifyUser, cancelBookingById);

export default router