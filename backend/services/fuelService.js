// backend/services/fuelService.js

function calculateFuel({ distanceKm, mileage, tankCapacity, currentFuel, bufferPercentage }) {
  const requiredFuel = distanceKm / mileage; // liters
  const bufferFuel = (requiredFuel * bufferPercentage) / 100;
  const totalRecommended = requiredFuel + bufferFuel;

  const needRefuel = currentFuel < totalRecommended;

  // How many full tanks needed (optional info)
  const tanksNeeded = totalRecommended / tankCapacity;

  return {
    requiredFuel,
    bufferFuel,
    totalRecommended,
    needRefuel,
    tanksNeeded,
  };
}

module.exports = {
  calculateFuel,
};
