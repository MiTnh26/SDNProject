import User from '../models/User.js';
import path from 'path';

// Update User


// Create new User with file upload
export const createUser = async (req, res) => {
   const newUser = new User(req.body);
   console.log(req.body);
   // if (req.file) {
   //    const imagePath = 'user_images/' + req.file.filename; // Đường dẫn tương đối đến ảnh
   //    newUser.avatar = imagePath; // Lưu đường dẫn của tệp ảnh
   // }

   try {
      const savedUser = await newUser.save();
      res.status(200).json({ success: true, message: 'Successfully created', data: savedUser });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create. Try again!' });
   }
};




// Lấy thông tin User đơn lẻ
export const getSingleUser = async (req, res) => {
   const id = req.params.id;

   try {
      const user = await User.findById(id);
      res.status(200).json({ success: true, message: 'Successfully', data: user });
   } catch (error) {
      res.status(404).json({ success: false, message: 'Not Found' });
   }
};



