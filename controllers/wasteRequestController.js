const WasteRequest = require('../models/WasteRequest');
const Municipality = require('../models/Municipality');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

exports.createWasteRequest = [
  upload.array('pictures', 5),
  async (req, res) => {
    try {
      const { garbageDetails, address, scheduledDate, location, municipalityName } = req.body;
      const details = JSON.parse(garbageDetails);
      const pictureUrls = [];
      for (const file of req.files) {
        const b64 = file.buffer.toString('base64');
        const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${b64}`);
        pictureUrls.push(result.secure_url);
      }
      let municipality = await Municipality.findOne({ name: municipalityName });
      if (!municipality) {
        // fallback: assign a default municipality or create one
        municipality = await Municipality.findOne(); // get first
        if (!municipality) {
          return res.status(400).json({ error: "No municipalities found. Please contact support." });
        }
      }
      const wasteRequest = await WasteRequest.create({
        userId: req.user.id,
        municipalityId: municipality._id,
        garbageDetails: details,
        pictures: pictureUrls,
        address,
        location: location ? JSON.parse(location) : undefined,
        scheduledDate: new Date(scheduledDate),
      });
      res.status(201).json(wasteRequest);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
];

exports.getMyRequests = async (req, res) => {
  const requests = await WasteRequest.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(requests);
};