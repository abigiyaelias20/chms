import express from 'express';
import teamRoleController from '../../controller/teamRoleController.js';
import { verifyAll, verifyStaffOrAdmin } from '../../config/jwt.js';

const router = express.Router();

router.post('/', verifyStaffOrAdmin, teamRoleController.createTeamRole);
router.post('/assign', verifyStaffOrAdmin, teamRoleController.assignTeamRole);
router.get('/', verifyAll, teamRoleController.getAllTeamRoles);
router.get('/:id', verifyAll, teamRoleController.getTeamRoleById);
router.put('/:id', verifyStaffOrAdmin, teamRoleController.updateTeamRole);
router.delete('/:id', verifyStaffOrAdmin, teamRoleController.deleteTeamRole);

export default router;