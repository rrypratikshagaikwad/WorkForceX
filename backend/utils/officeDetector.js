const { getDistanceInMeters } = require("./locationUtils");

function detectLocation(userLat, userLng, locations) {
  let nearest = null;
  let minDistance = Infinity;

  for (const loc of locations) {
    const distance = getDistanceInMeters(
      Number(loc.latitude),
      Number(loc.longitude),
      Number(userLat),
      Number(userLng)
    );

    console.log(
      `📍 ${loc.name} → ${distance.toFixed(2)}m (allowed ${loc.radius_meters}m)`
    );

    if (distance <= loc.radius_meters && distance < minDistance) {
      minDistance = distance;
      nearest = { ...loc, distance };
    }
  }

  return nearest;
}

module.exports = { detectLocation };
