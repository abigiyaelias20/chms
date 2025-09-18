const express = require('express');
const router = express.Router();
const bibleStudySessionController = require('../controllers/bibleStudySessionController');

router.post('/', bibleStudySessionController.createBibleStudySession);
router.get('/', bibleStudySessionController.getAllBibleStudySessions);
router.get('/:id', bibleStudySessionController.getBibleStudySessionById);
router.put('/:id', bibleStudySessionController.updateBibleStudySession);
router.delete('/:id', bibleStudySessionController.deleteBibleStudySession);

module.exports = router;
