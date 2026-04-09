const express = require('express');
const { createWasteRequest, getMyRequests } = require('../controllers/wasteRequestController.js');
const { protect, authorize } = require('../middleware/auth.js');

const router = express.Router();

router.use(protect);
router.use(authorize('user'));

router.post('/waste-requests', createWasteRequest);
router.get('/waste-requests/my', getMyRequests);

module.exports = router;