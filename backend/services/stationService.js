// backend/services/stationService.js
const axios = require("axios");

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Find fuel stations in a bounding box using Nominatim
 * bbox = { minLat, maxLat, minLon, maxLon }
 */
async function findFuelStations(bbox) {
  const { minLat, maxLat, minLon, maxLon } = bbox;

  const viewbox = `${minLon},${maxLat},${maxLon},${minLat}`; // left,top,right,bottom

  const response = await axios.get(NOMINATIM_BASE_URL, {
    params: {
      format: "json",
      amenity: "fuel",
      bounded: 1,
      viewbox,
    },
    headers: {
      "User-Agent": "smart-petrol-project/1.0 (your-email@example.com)",
    },
  });

  const data = response.data || [];

  return data.map((place) => ({
    name: place.display_name,
    lat: parseFloat(place.lat),
    lon: parseFloat(place.lon),
  }));
}

/**
 * Build bounding box from route coordinates
 */
function buildBoundingBoxFromRoute(coordinates) {
  let minLat = Infinity,
    maxLat = -Infinity,
    minLon = Infinity,
    maxLon = -Infinity;

  coordinates.forEach((point) => {
    if (point.lat < minLat) minLat = point.lat;
    if (point.lat > maxLat) maxLat = point.lat;
    if (point.lon < minLon) minLon = point.lon;
    if (point.lon > maxLon) maxLon = point.lon;
  });

  return { minLat, maxLat, minLon, maxLon };
}

module.exports = {
  findFuelStations,
  buildBoundingBoxFromRoute,
};
