import Booking from './../models/Booking.js';

// create new booking
export const createBooking = async (req, res) => {
   const newBooking = new Booking(req.body);

   try {
      const savedBooking = await newBooking.save();
      res.status(200).json({ success: true, message: "Your tour is booked!", data: savedBooking });
   } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error!" });
   }
};

// get single booking
export const getBooking = async (req, res) => {
   const id = req.params.id;

   try {
      const book = await Booking.findById(id);
      res.status(200).json({ success: true, message: "Successful!", data: book });
   } catch (error) {
      res.status(404).json({ success: false, message: "Not Found!" });
   }
};

// get all bookings
export const getAllBooking = async (req, res) => {
   try {
      const books = await Booking.find().sort({ bookAt: -1 }); // Sắp xếp theo ngày giảm dần
      res.status(200).json({ success: true, message: "Successful!", data: books });
   } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error!" });
   }
};

// delete booking
export const deleteBooking = async (req, res) => {
   const { bookingId } = req.params;

   try {
      const deletedBooking = await Booking.findByIdAndDelete(bookingId);

      if (!deletedBooking) {
         return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      res.status(204).json({ success: true, message: 'Booking deleted successfully' });
   } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ success: false, message: 'Failed to delete booking' });
   }
};

// get all bookings by userId
export const getAllBookingByUserId = async (req, res) => {
   const userId = req.params.userId;

   try {
      const bookings = await Booking.find({ userId }).sort({ bookAt: -1 }); // Sắp xếp theo ngày giảm dần

      if (!bookings.length) {
         return res.status(404).json({ success: false, message: 'No bookings found for this user' });
      }

      res.status(200).json({ success: true, message: 'Successful!', data: bookings });
   } catch (error) {
      console.error('Error fetching bookings by userId:', error);
      res.status(500).json({ success: false, message: 'Internal server error!' });
   }
};

// update booking by ID
export const updateBookingById = async (req, res) => {
   const { bookingId } = req.params;

   try {
      const updatedBooking = await Booking.findByIdAndUpdate(
         bookingId,
         { $set: req.body },
         { new: true }
      );

      if (!updatedBooking) {
         return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      res.status(200).json({ success: true, message: 'Booking updated successfully', data: updatedBooking });
   } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ success: false, message: 'Failed to update booking' });
   }
};

// cancel booking by ID
export const cancelBookingById = async (req, res) => {
   const { bookingId } = req.params;

   try {
      const cancelledBooking = await Booking.findByIdAndUpdate(
         bookingId,
         { $set: { status: 'cancelled' } },
         { new: true }
      );

      if (!cancelledBooking) {
         return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: cancelledBooking });
   } catch (error) {
      console.error('Error cancelling booking:', error);
      res.status(500).json({ success: false, message: 'Failed to cancel booking' });
   }
};
