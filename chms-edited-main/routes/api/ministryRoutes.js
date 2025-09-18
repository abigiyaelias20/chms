import express from 'express';
// Import necessary controllers and middleware
import ministryController from '../../controller/ministryController.js';
import { verifyAdmin, verifyToken } from '../../config/jwt.js';
const router = express.Router();

router.post('/', verifyAdmin,ministryController.createMinistry);
router.get('/',ministryController.getAllMinistries);
router.get('/:id', ministryController.getMinistryById);
router.put('/:id', verifyAdmin,ministryController.updateMinistry);
router.delete('/:id',verifyAdmin, ministryController.deleteMinistry);



export default router;