const express = require('express');
const router = express.Router();
const eventOccurrenceController = require('../controllers/eventOccurrenceController');

router.post('/', eventOccurrenceController.createEventOccurrence);
router.get('/', eventOccurrenceController.getAllEventOccurrences);
router.get('/:id', eventOccurrenceController.getEventOccurrenceById);
router.put('/:id', eventOccurrenceController.updateEventOccurrence);
router.delete('/:id', eventOccurrenceController.deleteEventOccurrence);

module.exports = router;
