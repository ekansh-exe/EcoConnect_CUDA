const express = require('express');
const {
  getTomorrowOrders,
  getStatistics,
  assignRoute,
} = require('../controllers/officerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('municipal_officer'));

router.get('/orders/tomorrow', getTomorrowOrders);
router.get('/statistics', getStatistics);
router.post('/assign-route', assignRoute);

module.exports = router;