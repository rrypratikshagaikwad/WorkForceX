const { getDistanceInMeters } = require("./locationUtils");

function detectOffice(userLat, userLng, offices) {
  let nearestOffice = null;
  let minDistance = Infinity;

  for (const office of offices) {
    const distance = getDistanceInMeters(
      office.latitude,
      office.longitude,
      userLat,
      userLng
    );

    if (distance <= office.radius_meters && distance < minDistance) {
      minDistance = distance;
      nearestOffice = {
        ...office,
        distance
      };
    }
  }

  return nearestOffice;
}

module.exports = { detectOffice };
