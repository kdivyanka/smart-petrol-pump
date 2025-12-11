// backend/services/geocodingService.js
const axios = require("axios");

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Geocode a text address to latitude & longitude using Nominatim
 */
async function geocodeAddress(address) {
  const response = await axios.get(NOMINATIM_BASE_URL, {
    params: {
      q: address,
      format: "json",
      limit: 1,
    },
    headers: {
      // Nominatim asks for a User-Agent or email
      "User-Agent": "smart-petrol-project/1.0 (your-email@example.com)",
    },
  });

  const data = response.data;

  if (!data || data.length === 0) {
    throw new Error(`Could not find location for: ${address}`);
  }

  const place = data[0];

  return {
    lat: parseFloat(place.lat),
    lon: parseFloat(place.lon),
    displayName: place.display_name,
  };
}

module.exports = {
  geocodeAddress,
};