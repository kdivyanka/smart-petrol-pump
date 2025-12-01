// backend/services/gapService.js
const { haversineDistance } = require("../utils/haversine");

/**
 * Roughly align each station to nearest route point index
 */
function mapStationsToRouteIndices(routeCoords, stations) {
  return stations.map((station) => {
    let bestIndex = 0;
    let bestDistance = Infinity;

    routeCoords.forEach((point, index) => {
      const d = haversineDistance(
        station.lat,
        station.lon,
        point.lat,
        point.lon
      );
      if (d < bestDistance) {
        bestDistance = d;
        bestIndex = index;
      }
    });

    return {
      ...station,
      routeIndex: bestIndex,
    };
  });
}

/**
 * Analyze gaps between fuel stations
 * gapThresholdKm: e.g. 15 km
 */
function analyzeGaps(routeCoords, stations, gapThresholdKm) {
  if (stations.length === 0) {
    return [
      {
        message: "No fuel stations found along this route.",
      },
    ];
  }

  // Map each station to nearest route index
  const mappedStations = mapStationsToRouteIndices(routeCoords, stations);

  // Sort by route index (order along route)
  mappedStations.sort((a, b) => a.routeIndex - b.routeIndex);

  const gaps = [];

  // 1. Gap from start to first station
  const firstStation = mappedStations[0];
  const startPoint = routeCoords[0];
  const startGap = haversineDistance(
    startPoint.lat,
    startPoint.lon,
    firstStation.lat,
    firstStation.lon
  );

  if (startGap > gapThresholdKm) {
    gaps.push({
      type: "start-to-first-station",
      distanceKm: startGap,
      description: `Long gap of ~${startGap.toFixed(
        1
      )} km before the first fuel station.`,
    });
  }

  // 2. Gaps between stations
  for (let i = 0; i < mappedStations.length - 1; i++) {
    const s1 = mappedStations[i];
    const s2 = mappedStations[i + 1];

    const d = haversineDistance(s1.lat, s1.lon, s2.lat, s2.lon);

    if (d > gapThresholdKm) {
      gaps.push({
        type: "station-to-station",
        distanceKm: d,
        description: `Gap of ~${d.toFixed(
          1
        )} km between fuel stations.\nFrom: ${s1.name}\nTo: ${s2.name}`,
      });
    }
  }

  // 3. Gap from last station to end
  const lastStation = mappedStations[mappedStations.length - 1];
  const endPoint = routeCoords[routeCoords.length - 1];
  const endGap = haversineDistance(
    lastStation.lat,
    lastStation.lon,
    endPoint.lat,
    endPoint.lon
  );

  if (endGap > gapThresholdKm) {
    gaps.push({
      type: "last-station-to-end",
      distanceKm: endGap,
      description: `Long gap of ~${endGap.toFixed(
        1
      )} km after the last fuel station.`,
    });
  }

  return gaps;
}

module.exports = {
  analyzeGaps,
};
