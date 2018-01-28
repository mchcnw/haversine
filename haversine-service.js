const convertToRadians = (location) => {
  return location * Math.PI / 180;
};

const calculateDistance = (
  startLatitude,
  endLatitude,
  startLongitude,
  endLongitude
) => {
  try {
    const earthRadius = 6373;
    const latitudeRadianStart = convertToRadians(endLatitude);
    const latitudeRadianEnd = convertToRadians(endLatitude);
    const longitudeRadianCustomer = convertToRadians(endLongitude);
    const distanceLatitude = convertToRadians(startLatitude - endLatitude);
    const distanceLongitude = convertToRadians(startLongitude - endLongitude);
    const a = squareHalfChordLengthTwoPoints(distanceLatitude, distanceLongitude, latitudeRadianStart, latitudeRadianEnd);
    const c = distanceTwoPoints(a);
    // allow customers who live 100.5 km from office ? assumed yes
    return Math.floor(earthRadius * c);
  } catch (error) {
    // don't call error service. bubble up to consumer and let consumer decide which way to handle error
    throw new Error('Calculation error. Please verify values');
  }

};

const distanceTwoPoints = (a) => {
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const squareHalfChordLengthTwoPoints = (distanceLatitude, distanceLongitude, latRadianStart, latRadianEnd) => {
  return Math.sin(distanceLatitude / 2) * Math.sin(distanceLatitude / 2) +
  Math.cos(latRadianStart) *
  Math.cos(latRadianEnd) *
  Math.sin(distanceLongitude / 2) *
  Math.sin(distanceLongitude / 2);
}

module.exports = {
  calculateDistance: calculateDistance
};
