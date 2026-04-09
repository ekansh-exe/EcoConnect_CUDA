// models/CollectionRoute.js
const mongoose = require("mongoose");

const collectionRouteSchema = new mongoose.Schema({
  date: { type: Date, required: true }, // day of collection
  carNumber: { type: String, required: true },
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'GarbageCollector', required: true },
  wasteRequestIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WasteRequest' }], // ordered sequence
  optimizedOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WasteRequest' }] // after route optimization
});

module.exports = mongoose.model("CollectionRoute", collectionRouteSchema);