// backend/services/tripService.js
const { geocodeAddress } = require("./geocodingService");
const { getRoute } = require("./routingService");
const { findFuelStations, buildBoundingBoxFromRoute } = require("./stationService");
const { calculateFuel } = require("./fuelService");
const { analyzeGaps } = require("./gapService");

/**
 * Main function: planTrip
 * Body expected from frontend:
 * {
 *   startAddress: string,
 *   endAddress: string,
 *   mileage: number,
 *   tankCapacity: number,
 *   currentFuel: number,
 *   bufferPercentage: number,
 *   gapThresholdKm: number
 * }
 */
async function planTrip(body) {
  const {
    startAddress,
    endAddress,
    mileage,
    tankCapacity,
    currentFuel,
    bufferPercentage,
    gapThresholdKm,
  } = body;

  if (
    !startAddress ||
    !endAddress ||
    !mileage ||
    !tankCapacity ||
    bufferPercentage === undefined
  ) {
    throw new Error("Missing required fields in request body.");
  }

  // 1. Geocode start and end addresses
  const startLocation = await geocodeAddress(startAddress);
  const endLocation = await geocodeAddress(endAddress);

  // 2. Get route from OSRM
  const routeData = await getRoute(startLocation, endLocation);
  const { distanceKm, coordinates } = routeData;

  // 3. Fuel calculation
  const fuelResult = calculateFuel({
    distanceKm,
    mileage,
    tankCapacity,
    currentFuel: currentFuel || 0,
    bufferPercentage,
  });

  // 4. Find fuel stations along route
  const bbox = buildBoundingBoxFromRoute(coordinates);
  const stations = await findFuelStations(bbox);

  // 5. Gap analysis
  const gaps = analyzeGaps(
    coordinates,
    stations,
    gapThresholdKm || 15 // default 15 km
  );

  // 6. Return everything to frontend
  return {
    startLocation,
    endLocation,
    route: {
      distanceKm,
      coordinates,
    },
    fuel: fuelResult,
    stations,
    gaps,
  };
}

module.exports = {
  planTrip,
};
