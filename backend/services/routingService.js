const axios = require("axios");

const ORS_API_KEY = process.env.ORS_API_KEY;

async function getRoute(startLon, startLat, endLon, endLat) {
  const response = await axios.post(
    "https://api.openrouteservice.org/v2/directions/driving-car",
    {
      coordinates: [
        [startLon, startLat],
        [endLon, endLat],
      ],
    },
    {
      headers: {
        Authorization: ORS_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

module.exports = { getRoute };
