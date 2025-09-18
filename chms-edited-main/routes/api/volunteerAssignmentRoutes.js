const volunteerAssignmentController = require('../controllers/volunteerAssignmentController');

router.post('/', volunteerAssignmentController.createVolunteerAssignment);
router.get('/', volunteerAssignmentController.getAllVolunteerAssignments);
router.get('/:id', volunteerAssignmentController.getVolunteerAssignmentById);
router.put('/:id', volunteerAssignmentController.updateVolunteerAssignment);
router.delete('/:id', volunteerAssignmentController.deleteVolunteerAssignment);

module.exports = router;