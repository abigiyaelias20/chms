import express from 'express';

import memberController from '../../controller/memberController.js';
import { verifyAdmin, verifyToken } from '../../config/jwt.js';

const router = express.Router();

// Member Routes
router.post('/members', verifyAdmin, memberController.createMember);
router.get('/members', verifyToken, memberController.getMembers);
router.get('/members/:member_id', verifyToken, memberController.getMemberById);
router.put('/members/:member_id', verifyAdmin, memberController.updateMember);
router.post('/members/:member_id/teams', verifyAdmin, memberController.addTeamParticipation);

// Admin-only Member Routes
router.delete('/members/:member_id', verifyAdmin, memberController.deleteMember);
export default router;
