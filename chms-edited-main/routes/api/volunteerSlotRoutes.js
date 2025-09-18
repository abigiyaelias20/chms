const volunteerSlotController = require('../controllers/volunteerSlotController');

router.post('/', volunteerSlotController.createVolunteerSlot);
router.get('/', volunteerSlotController.getAllVolunteerSlots);
router.get('/:id', volunteerSlotController.getVolunteerSlotById);
router.put('/:id', volunteerSlotController.updateVolunteerSlot);
router.delete('/:id', volunteerSlotController.deleteVolunteerSlot);

module.exports = router;