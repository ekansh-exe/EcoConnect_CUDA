// controllers/authController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const MunicipalOfficer = require('../models/MunicipalOfficer');
const GarbageCollector = require('../models/GarbageCollector');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
  const { email, password, name, role, municipalityId, carNumber } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, name, role });
  // create role-specific profile
  if (role === 'municipal_officer') {
    const profile = await MunicipalOfficer.create({ userId: user._id, municipalityId });
    user.municipalOfficerProfile = profile._id;
  } else if (role === 'garbage_collector') {
    const profile = await GarbageCollector.create({ userId: user._id, carNumber, municipalityId });
    user.garbageCollectorProfile = profile._id;
  }
  await user.save();
  const token = generateToken(user);
  res.status(201).json({ token, user: { id: user._id, email, name, role } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = generateToken(user);
  res.json({ token, user: { id: user._id, email, name: user.name, role: user.role } });
};