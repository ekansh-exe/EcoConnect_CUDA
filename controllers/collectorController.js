const GarbageCollector = require('../models/GarbageCollector');
const CollectionRoute = require('../models/CollectionRoute');
const WasteRequest = require('../models/WasteRequest');

// @desc    Get today's route (or specified date) by entering car number
// @route   POST /api/collector/route
// @access  Private (garbage_collector)
exports.getRoute = async (req, res) => {
  const { carNumber, date } = req.body;

  if (!carNumber) {
    return res.status(400).json({ message: 'Car number is required' });
  }

  // Verify collector belongs to the logged-in user
  const collector = await GarbageCollector.findOne({ carNumber, userId: req.user.id });
  if (!collector) {
    return res.status(403).json({ message: 'Unauthorized: Car number does not match your profile' });
  }

  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);
  const nextDay = new Date(targetDate);
  nextDay.setDate(targetDate.getDate() + 1);

  const route = await CollectionRoute.findOne({
    carNumber,
    date: { $gte: targetDate, $lt: nextDay },
  }).populate({
    path: 'wasteRequestIds',
    populate: { path: 'userId', select: 'name address phone' },
  });

  if (!route) {
    return res.json({ message: 'No route assigned for this date', stops: [] });
  }

  // Use optimizedOrder if available, otherwise use original order
  let stops = route.wasteRequestIds;
  if (route.optimizedOrder && route.optimizedOrder.length > 0) {
    const orderedIds = route.optimizedOrder.map(id => id.toString());
    stops = route.wasteRequestIds.sort((a, b) => {
      return orderedIds.indexOf(a._id.toString()) - orderedIds.indexOf(b._id.toString());
    });
  }

  // Remove phone numbers from stops until arrival
  const stopsSafe = stops.map(stop => ({
    _id: stop._id,
    address: stop.address,
    location: stop.location,
    garbageDetails: stop.garbageDetails,
    status: stop.status,
    // phone number omitted here; will be sent only on arrival
  }));

  res.json({
    carNumber,
    date: route.date,
    stops: stopsSafe,
  });
};

// @desc    Mark arrival at a waste request location -> reveal phone number
// @route   PATCH /api/collector/route/:requestId/arrive
// @access  Private (garbage_collector)
exports.arriveAtLocation = async (req, res) => {
  const { requestId } = req.params;

  const wasteRequest = await WasteRequest.findById(requestId).populate('userId', 'phone name');
  if (!wasteRequest) {
    return res.status(404).json({ message: 'Waste request not found' });
  }

  // Verify the collector is assigned to this request
  const collector = await GarbageCollector.findOne({ userId: req.user.id });
  if (!collector || wasteRequest.assignedCollectorId.toString() !== collector._id.toString()) {
    return res.status(403).json({ message: 'You are not assigned to this waste request' });
  }

  // Optional: update status to 'in_progress' or similar if needed
  // For now, just return the phone number and details
  res.json({
    message: 'Arrived at location',
    phoneNumber: wasteRequest.userId.phone,
    name: wasteRequest.userId.name,
    address: wasteRequest.address,
    garbageDetails: wasteRequest.garbageDetails,
    requestId: wasteRequest._id,
  });
};

// (Optional) Mark as collected after verification
exports.markCollected = async (req, res) => {
  const { requestId } = req.params;
  const wasteRequest = await WasteRequest.findById(requestId);
  if (!wasteRequest) return res.status(404).json({ message: 'Not found' });

  const collector = await GarbageCollector.findOne({ userId: req.user.id });
  if (!collector || wasteRequest.assignedCollectorId.toString() !== collector._id.toString()) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  wasteRequest.status = 'collected';
  wasteRequest.collectedAt = new Date();
  await wasteRequest.save();

  res.json({ message: 'Waste marked as collected', wasteRequest });
};