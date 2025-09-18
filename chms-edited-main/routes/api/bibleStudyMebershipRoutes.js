const express = require('express');
const router = express.Router();
const bibleStudyMembershipController = require('../controllers/bibleStudyMembershipController');

router.post('/', bibleStudyMembershipController.createBibleStudyMembership);
router.get('/', bibleStudyMembershipController.getAllBibleStudyMemberships);
router.get('/:id', bibleStudyMembershipController.getBibleStudyMembershipById);
router.put('/:id', bibleStudyMembershipController.updateBibleStudyMembership);
router.delete('/:id', bibleStudyMembershipController.deleteBibleStudyMembership);

module.exports = router;
