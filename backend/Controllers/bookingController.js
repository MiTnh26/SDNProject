import Booking from './../models/Booking.js'


// create new booking
export const createBooking = async (req, res) => {
   const newBooking = new Booking(req.body)

   try {
      const savedBooking = await newBooking.save()

      res.status(200).json({ success: true, message: "Your tour is booked!", data: savedBooking })
   } catch (error) {
      res.status(500).json({ success: true, message: "Internal server error!" })
   }
}

// get single booking
export const getBooking = async (req, res) => {
   const id = req.params.id

   try {
      const book = await Booking.findById(id)

      res.status(200).json({ success: true, message: "Successful!", data: book })
   } catch (error) {
      res.status(404).json({ success: true, message: "Not Found!" })
   }
}


// get all booking
export const getAllBooking = async (req, res) => {

   try {
      const books = await Booking.find()

      res.status(200).json({ success: true, message: "Successful!", data: books })
   } catch (error) {
      res.status(500).json({ success: true, message: "Internal server error!" })
   }
}


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
}
// get all bookings by userId
export const getAllBookingByUserId = async (req, res) => {
   const userId = req.params.userId;

   try {
      const bookings = await Booking.find({ userId });

      if (!bookings.length) {
         return res.status(404).json({ success: false, message: 'No bookings found for this user' });
      }

      res.status(200).json({ success: true, message: 'Successful!', data: bookings });
   } catch (error) {
      console.error('Error fetching bookings by userId:', error);
      res.status(500).json({ success: false, message: 'Internal server error!' });
   }
};