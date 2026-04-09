// In a real app, you would use a reverse geocoding service like Google Maps or OpenStreetMap
// This is a mock function that returns a municipality name based on coordinates.
// You would replace it with actual API calls.

const Municipality = require('../models/Municipality');

/**
 * Given lat,lng, find the municipality that contains this point.
 * Assumes municipalities have a GeoJSON polygon or point radius.
 * For simplicity, we'll just return a default or lookup by nearest.
 */
async function getMunicipalityFromCoordinates(lng, lat) {
  // Example using MongoDB $geoIntersects if you have polygon data
  const municipality = await Municipality.findOne({
    location: {
      $geoIntersects: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
    },
  });
  if (municipality) return municipality;
  // Fallback: find nearest by point
  const nearest = await Municipality.findOne({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: 5000, // 5km
      },
    },
  });
  return nearest;
}

async function getAddressFromCoordinates(lng, lat) {
  // Use a reverse geocoding API (e.g., OpenStreetMap Nominatim)
  const fetch = require('node-fetch');
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
  const data = await response.json();
  return data.display_name || 'Address not found';
}

module.exports = { getMunicipalityFromCoordinates, getAddressFromCoordinates };