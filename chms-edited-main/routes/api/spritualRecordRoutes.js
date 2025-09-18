const spiritualRecordController = require('../controllers/spiritualRecordController');

router.post('/', spiritualRecordController.createSpiritualRecord);
router.get('/', spiritualRecordController.getAllSpiritualRecords);
router.get('/:id', spiritualRecordController.getSpiritualRecordById);
router.put('/:id', spiritualRecordController.updateSpiritualRecord);
router.delete('/:id', spiritualRecordController.deleteSpiritualRecord);

module.exports = router;