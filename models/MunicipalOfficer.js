// models/MunicipalOfficer.js
const mongoose = require("mongoose");


const municipalOfficerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  municipalityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Municipality', required: true }
});

module.exports = mongoose.model("MunicipalOfficer", municipalOfficerSchema);