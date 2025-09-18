const pastoralCareController = require('../controllers/pastoralCareController');

router.post('/', pastoralCareController.createPastoralCare);
router.get('/', pastoralCareController.getAllPastoralCases);
router.get('/:id', pastoralCareController.getPastoralCareById);
router.put('/:id', pastoralCareController.updatePastoralCare);
router.delete('/:id', pastoralCareController.deletePastoralCare);

module.exports = router;