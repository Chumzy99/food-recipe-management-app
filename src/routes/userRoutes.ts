import express from 'express';
import { login, protect, signup } from '../controllers/authController';
import { deleteMe, getAllUsers, updateMe } from '../controllers/userController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers);

export default router;
