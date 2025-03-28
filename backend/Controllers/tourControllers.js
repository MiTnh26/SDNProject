import Tour from '../models/Tour.js'



//Getsingle Tour
export const getSingleTour = async (req, res) => {
   const id = req.params.id

   try {
      const tour = await Tour.findById(id).populate('reviews')

      res.status(200).json({ success: true, message: 'Successfully', data: tour })
   } catch (error) {
      res.status(404).json({ success: false, message: 'Not Found' })
   }
}

//Get All Tour
export const getAllTour = async (req, res) => {
   //For pagination
   const page = parseInt(req.query.page)

   //console.log(page)

   try {
      const tours = await Tour.find({}).populate('reviews').skip(page * 8).limit(8)

      res.status(200).json({ success: true, count: tours.length, message: 'Successfully', data: tours })
   } catch (error) {
      res.status(404).json({ success: false, message: 'Not Found' })
   }
}


// Get tour by search
export const getTourBySearch = async (req, res) => {

   // hear 'i' means case sensitive 
   const city = new RegExp(req.query.city, 'i')
   const distance = parseInt(req.query.distance)
   const maxGroupSize = parseInt(req.query.maxGroupSize)

   try {
      // gte means greater than equal
      const tours = await Tour.find({ city, distance: { $gte: distance }, maxGroupSize: { $gte: maxGroupSize } }).populate('reviews')

      res.status(200).json({ success: true, message: 'Successfully', data: tours })
   } catch (error) {
      res.status(404).json({ success: false, message: 'Not Found' })
   }
}

//Get featured Tour
export const getFeaturedTour = async (req, res) => {
   //console.log(page)

   try {
      const tours = await Tour.find({ featured: true }).populate('reviews').limit(8)

      res.status(200).json({ success: true, message: 'Successfully', data: tours })
   } catch (error) {
      res.status(404).json({ success: false, message: 'Not Found' })
   }
}

//Get tour count 
export const getTourCount = async(req,res) => {
   try {
      const tourCount = await Tour.estimatedDocumentCount()

      res.status(200).json({success:true, data:tourCount})
   } catch (error) {
      res.status(500).json({success:false, message: "Failed to fetch"})
   }
}