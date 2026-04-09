// models/WasteRequest.js

const mongoose = require("mongoose");


const wasteRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  municipalityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Municipality', required: true },
  garbageDetails: [{
    type: { type: String, enum: ['plastic', 'paper', 'glass', 'organic', 'electronic'], required: true },
    numberOfBags: { type: Number, required: true, min: 1 }
  }],
  pictures: [{ type: String }], // Cloudinary URLs
  address: { type: String, required: true },
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] }, // GeoJSON
  scheduledDate: { type: Date, required: true }, // date of pickup
  status: {
    type: String,
    enum: ['pending', 'assigned', 'collected', 'verified'],
    default: 'pending'
  },
  assignedCollectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'GarbageCollector' },
  collectedAt: Date,
  createdAt: { type: Date, default: Date.now }
});
wasteRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("WasteRequest", wasteRequestSchema);