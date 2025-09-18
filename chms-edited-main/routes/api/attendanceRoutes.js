const express = require('express');
const router = express.Router();
import { verifyAdmin, verifyToken } from '../../config/jwt.js';

const attendanceController = require('../controllers/attendanceController');

router.post('/', attendanceController.createAttendance);
router.get('/', attendanceController.getAllAttendances);
router.get('/:id', attendanceController.getAttendanceById);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
