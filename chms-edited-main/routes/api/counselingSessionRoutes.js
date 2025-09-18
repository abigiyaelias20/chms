const express = require('express');
const router = express.Router();
const counselingSessionController = require('../controllers/counselingSessionController');

router.post('/', counselingSessionController.createCounselingSession);
router.get('/', counselingSessionController.getAllCounselingSessions);
router.get('/:id', counselingSessionController.getCounselingSessionById);
router.put('/:id', counselingSessionController.updateCounselingSession);
router.delete('/:id', counselingSessionController.deleteCounselingSession);

module.exports = router;
