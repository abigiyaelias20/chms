const express = require('express');
const router = express.Router();
const bibleStudyGroupController = require('../controllers/bibleStudyGroupController');

router.post('/', bibleStudyGroupController.createBibleStudyGroup);
router.get('/', bibleStudyGroupController.getAllBibleStudyGroups);
router.get('/:id', bibleStudyGroupController.getBibleStudyGroupById);
router.put('/:id', bibleStudyGroupController.updateBibleStudyGroup);
router.delete('/:id', bibleStudyGroupController.deleteBibleStudyGroup);

module.exports = router;
