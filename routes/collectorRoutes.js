const express = require('express');
const { getRoute, arriveAtLocation, markCollected } = require('../controllers/collectorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('garbage_collector'));

router.post('/route', getRoute);
router.patch('/route/:requestId/arrive', arriveAtLocation);
router.patch('/route/:requestId/collect', markCollected); // optional

module.exports = router;