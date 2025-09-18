
import express from 'express';

import eventController from '../../controller/eventController.js';
import { verifyAdmin, verifyAll, verifyStaffOrAdmin, verifyToken } from '../../config/jwt.js';

const router = express.Router();


router.post('/', verifyAll,eventController.createEvent);
router.get('/',verifyStaffOrAdmin, eventController.getAllEvents);
router.get('/active',verifyAll, eventController.getAllActiveEvents);
router.get('/:id', verifyAll,eventController.getEventById);
router.put('/:id', verifyAll,eventController.updateEvent);
router.delete('/:id', verifyStaffOrAdmin,eventController.deleteEvent);

export default router;
