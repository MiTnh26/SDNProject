import express from 'express';
import { getSingleUser } from '../Controllers/userController.js';


const router = express.Router();



// Get single user
router.get('/:id',  getSingleUser);




export default router;
