import express from 'express';
import { login, signup } from '../controllers/authController';
import { getAllUsers } from '../controllers/userController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.route('/').get(getAllUsers);

export default router;
