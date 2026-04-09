// models/User.js
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, // not required for Google OAuth users
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'municipal_officer', 'garbage_collector'],
    required: true
  },
  // References for role-specific profiles
  municipalOfficerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'MunicipalOfficer' },
  garbageCollectorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'GarbageCollector' }
});

module.exports = mongoose.model("User", userSchema);