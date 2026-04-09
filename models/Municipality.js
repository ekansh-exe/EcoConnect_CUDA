// models/Municipality.js
const mongoose = require("mongoose");


const municipalitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] },
  areaPolygon: { type: Object } // optional GeoJSON
});
municipalitySchema.index({ location: '2dsphere' });

module.exports = mongoose.model("Municipality", municipalitySchema);