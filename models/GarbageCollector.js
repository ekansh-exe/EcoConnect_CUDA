// models/GarbageCollector.js

const mongoose = require("mongoose");


const garbageCollectorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  carNumber: { type: String, required: true, unique: true },
  municipalityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Municipality', required: true },
  assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'CollectionRoute' } // current day's route
});

module.exports = mongoose.model("GarbageCollector", garbageCollectorSchema);