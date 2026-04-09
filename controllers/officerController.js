const WasteRequest = require('../models/WasteRequest');
const MunicipalOfficer = require('../models/MunicipalOfficer');
const GarbageCollector = require('../models/GarbageCollector');
const CollectionRoute = require('../models/CollectionRoute');
const Municipality = require('../models/Municipality');

// @desc    Get all waste orders scheduled for tomorrow for officer's municipality
// @route   GET /api/officer/orders/tomorrow
// @access  Private (municipal_officer)
exports.getTomorrowOrders = async (req, res) => {
  const officer = await MunicipalOfficer.findOne({ userId: req.user.id });
  if (!officer) {
    return res.status(404).json({ message: 'Officer profile not found' });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(tomorrow.getDate() + 1);

  const orders = await WasteRequest.find({
    municipalityId: officer.municipalityId,
    scheduledDate: { $gte: tomorrow, $lt: dayAfter },
    status: 'pending',
  })
    .populate('userId', 'name email phone address')
    .sort({ createdAt: 1 });

  res.json({
    count: orders.length,
    date: tomorrow,
    orders,
  });
};

// @desc    Get waste statistics for officer's municipality
// @route   GET /api/officer/statistics
// @access  Private (municipal_officer)
exports.getStatistics = async (req, res) => {
  const officer = await MunicipalOfficer.findOne({ userId: req.user.id });
  if (!officer) {
    return res.status(404).json({ message: 'Officer profile not found' });
  }

  // Total bags per type (all time)
  const typeStats = await WasteRequest.aggregate([
    { $match: { municipalityId: officer.municipalityId } },
    { $unwind: '$garbageDetails' },
    {
      $group: {
        _id: '$garbageDetails.type',
        totalBags: { $sum: '$garbageDetails.numberOfBags' },
        totalRequests: { $sum: 1 },
      },
    },
  ]);

  // Daily trend (last 7 days)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  const dailyTrend = await WasteRequest.aggregate([
    {
      $match: {
        municipalityId: officer.municipalityId,
        createdAt: { $gte: last7Days },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        totalBags: { $sum: { $size: '$garbageDetails' } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Status breakdown
  const statusBreakdown = await WasteRequest.aggregate([
    { $match: { municipalityId: officer.municipalityId } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    typeStats,
    dailyTrend,
    statusBreakdown,
  });
};

// @desc    Assign waste requests to a garbage collector for a specific date
// @route   POST /api/officer/assign-route
// @access  Private (municipal_officer)
exports.assignRoute = async (req, res) => {
  const { date, carNumber, wasteRequestIds } = req.body;

  if (!date || !carNumber || !wasteRequestIds || !wasteRequestIds.length) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const officer = await MunicipalOfficer.findOne({ userId: req.user.id });
  if (!officer) {
    return res.status(404).json({ message: 'Officer profile not found' });
  }

  // Find garbage collector by car number and ensure they belong to same municipality
  const collector = await GarbageCollector.findOne({ carNumber, municipalityId: officer.municipalityId });
  if (!collector) {
    return res.status(404).json({ message: 'Collector not found in your municipality' });
  }

  // Verify all waste requests belong to officer's municipality and are pending
  const requests = await WasteRequest.find({
    _id: { $in: wasteRequestIds },
    municipalityId: officer.municipalityId,
    status: 'pending',
  });

  if (requests.length !== wasteRequestIds.length) {
    return res.status(400).json({ message: 'Some waste requests are invalid or already assigned' });
  }

  // Create collection route
  const routeDate = new Date(date);
  routeDate.setHours(0, 0, 0, 0);

  const existingRoute = await CollectionRoute.findOne({
    carNumber,
    date: routeDate,
  });
  if (existingRoute) {
    return res.status(400).json({ message: 'Route already exists for this collector on that date' });
  }

  const route = await CollectionRoute.create({
    date: routeDate,
    carNumber,
    collectorId: collector._id,
    wasteRequestIds,
    optimizedOrder: [], // can be filled later with route optimization
  });

  // Update each waste request
  await WasteRequest.updateMany(
    { _id: { $in: wasteRequestIds } },
    { $set: { assignedCollectorId: collector._id, status: 'assigned' } }
  );

  res.status(201).json({
    message: 'Route assigned successfully',
    route,
  });
};