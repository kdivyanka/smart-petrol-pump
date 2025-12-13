const axios = require("axios");

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;

async function geocodeAddress(address) {
  const response = await axios.get(
    "https://api.geoapify.com/v1/geocode/search",
    {
      params: {
        text: address,
        limit: 1,
        apiKey: GEOAPIFY_KEY,
      },
    }
  );

  const features = response.data.features;

  if (!features || features.length === 0) {
    throw new Error(`Location not found: ${address}`);
  }

  return {
    lat: features[0].geometry.coordinates[1],
    lon: features[0].geometry.coordinates[0],
    name: features[0].properties.formatted,
  };
}

module.exports = { geocodeAddress };
