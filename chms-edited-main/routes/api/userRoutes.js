import express from 'express';
import userController from '../../controller/userController.js';
import { verifyAdmin , verifyToken} from '../../config/jwt.js';

const router = express.Router();

router.post('/users', userController.createUser);


// User Routes
router.get('/', verifyAdmin, userController.getUsers);
router.get('/users/:user_id', verifyToken, userController.getUserById);
router.put('/users/:user_id', verifyToken, userController.updateUser);
router.patch('/users/:user_id/password', verifyToken, userController.updatePassword);

// Admin-only User Routes
router.delete('/users/:user_id', verifyAdmin, userController.deleteUser);
export default router;
