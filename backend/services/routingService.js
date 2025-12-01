// backend/services/routingService.js
const axios = require("axios");

const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";

/**
 * Get driving route between two points using OSRM
 * start & end: { lat, lon }
 */
async function getRoute(start, end) {
  const url = `${OSRM_BASE_URL}/${start.lon},${start.lat};${end.lon},${end.lat}`;

  const response = await axios.get(url, {
    params: {
      overview: "full",
      geometries: "geojson",
    },
  });

  const data = response.data;

  if (!data.routes || data.routes.length === 0) {
    throw new Error("No route found between these points.");
  }

  const route = data.routes[0];

  const distanceMeters = route.distance;
  const distanceKm = distanceMeters / 1000;

  // GeoJSON coordinates: [lon, lat]
  const coordinates = route.geometry.coordinates.map((coord) => ({
    lon: coord[0],
    lat: coord[1],
  }));

  return {
    distanceKm,
    coordinates,
  };
}

module.exports = {
  getRoute,
};
