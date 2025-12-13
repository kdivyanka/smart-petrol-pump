const { geocodeAddress } = require("./geocodingService");
const { getRoute } = require("./routingService");

async function planTrip(data) {
  const {
    startAddress,
    endAddress,
    mileage,
    tankCapacity,
    currentFuel,
    bufferPercentage,
    gapThresholdKm,
  } = data;

  // 1. Geocode start & end
  const start = await geocodeAddress(startAddress);
  const end = await geocodeAddress(endAddress);

  // 2. Get route
  const routeData = await getRoute(
    start.lon,
    start.lat,
    end.lon,
    end.lat
  );

  const distanceMeters = routeData.routes[0].summary.distance;
  const distanceKm = distanceMeters / 1000;

  // 3. Fuel calculations
  const fuelNeeded = distanceKm / mileage;
  const bufferFuel = (bufferPercentage / 100) * fuelNeeded;
  const totalFuelRequired = fuelNeeded + bufferFuel;

  const fuelShortage =
    totalFuelRequired > currentFuel
      ? totalFuelRequired - currentFuel
      : 0;

  return {
    startLocation: start.name,
    endLocation: end.name,
    distanceKm: Number(distanceKm.toFixed(2)),
    mileage,
    fuelNeeded: Number(fuelNeeded.toFixed(2)),
    bufferFuel: Number(bufferFuel.toFixed(2)),
    totalFuelRequired: Number(totalFuelRequired.toFixed(2)),
    currentFuel,
    fuelShortage: Number(fuelShortage.toFixed(2)),
    message:
      fuelShortage > 0
        ? "Refueling required for this trip"
        : "Sufficient fuel available",
  };
}

module.exports = { planTrip };
