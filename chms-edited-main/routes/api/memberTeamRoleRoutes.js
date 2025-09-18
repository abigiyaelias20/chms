const memberTeamRoleController = require('../controllers/memberTeamRoleController');

router.post('/', memberTeamRoleController.createMemberTeamRole);
router.get('/', memberTeamRoleController.getAllMemberTeamRoles);
router.get('/:id', memberTeamRoleController.getMemberTeamRoleById);
router.put('/:id', memberTeamRoleController.updateMemberTeamRole);
router.delete('/:id', memberTeamRoleController.deleteMemberTeamRole);

module.exports = router;