import express from 'express';

import ministryTeamController from '../../controller/ministryTeamController.js';
import { verifyAdmin, verifyStaff, verifyStaffOrAdmin, verifyToken } from '../../config/jwt.js';

const router = express.Router();

router.post('/',verifyStaff, ministryTeamController.createTeam);
router.get('/', verifyStaffOrAdmin,ministryTeamController.getAllTeams);
router.get('/:id', verifyStaff,ministryTeamController.getTeamById);
router.put('/:id', verifyStaff,ministryTeamController.updateTeam);
router.delete('/:id',verifyStaff, ministryTeamController.deleteTeam);

export default router;
