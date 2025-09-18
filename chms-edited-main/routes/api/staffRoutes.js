import express from 'express';
import staffController from '../../controller/staffController.js';
import { verifyAdmin, verifyToken } from '../../config/jwt.js';

const router = express.Router();
// Staff Routes
router.post('/staff', verifyAdmin, staffController.createStaff);
router.get('/staff', verifyToken, staffController.getStaff);
router.get('/staff/:staff_id', verifyToken, staffController.getStaffById);
router.put('/staff/:staff_id', verifyAdmin, staffController.updateStaff);
router.delete('/staff/:staff_id', verifyAdmin, staffController.deleteStaff);
export default router;
