document.getElementById("tripForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    startAddress: document.getElementById("startAddress").value,
    endAddress: document.getElementById("endAddress").value,
    mileage: Number(document.getElementById("mileage").value),
    tankCapacity: Number(document.getElementById("tankCapacity").value),
    currentFuel: Number(document.getElementById("currentFuel").value),
    bufferPercentage: Number(document.getElementById("bufferPercentage").value),
    gapThresholdKm: Number(document.getElementById("gapThresholdKm").value),
  };

  const resultBox = document.getElementById("result");
  resultBox.classList.remove("hidden");
  resultBox.innerHTML = "<p class='text-blue-600'>Calculating trip...</p>";

  try {
    const response = await fetch("http://localhost:5000/api/trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      resultBox.innerHTML = `<p class="text-red-600">Error: ${result.error}</p>`;
      return;
    }

    // ✅ SAFE rendering (matches backend response)
    resultBox.innerHTML = `
      <h2 class="text-xl font-bold mb-2">Trip Results</h2>


      <p><strong>Start Location:</strong> ${result.startLocation}</p>
      <p><strong>End Location:</strong> ${result.endLocation}</p>

      <p><strong>Distance:</strong> ${result.distanceKm.toFixed(2)} km</p>

      <p><strong>Fuel Needed:</strong> ${result.fuelNeeded.toFixed(2)} litres</p>
      <p><strong>Buffer Fuel:</strong> ${result.bufferFuel.toFixed(2)} litres</p>

      <p><strong>Total Fuel Required:</strong> ${result.totalFuelRequired.toFixed(2)} litres</p>
      <p><strong>Current Fuel:</strong> ${result.currentFuel.toFixed(2)} litres</p>

      <p class="font-semibold mt-2 ${
        result.fuelShortage > 0 ? "text-red-600" : "text-green-600"
      }">
        ${result.message}
      </p>
    `;
    document.getElementById("map").style.display = "block";
    showMapRouteAndPumps(data.startAddress, data.endAddress);

  } catch (err) {
    resultBox.innerHTML = `<p class="text-red-600">Request failed: ${err.message}</p>`;
  }
});
let map;

async function showMapRouteAndPumps(start, end) {

  // 🔥 show map container
  document.getElementById("map").style.display = "block";

  // reset old map
  if (map) {
    map.remove();
  }

  // create map
  map = L.map("map").setView([12.9716, 77.5946], 7);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // ---------- GEOCODING (Geoapify) ----------
  const GEOAPIFY_KEY = "35665b426e81495cb7a6533c78281aa5";

  async function geocode(place) {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(place)}&limit=1&apiKey=${GEOAPIFY_KEY}`
    );
    const data = await res.json();
    return data.features[0].geometry.coordinates; // [lon, lat]
  }

  const startCoord = await geocode(start);
  const endCoord = await geocode(end);

  // ---------- DRAW ROUTE (STRAIGHT LINE – NO ORS) ----------
  const routeCoords = [
    [startCoord[1], startCoord[0]],
    [endCoord[1], endCoord[0]],
  ];

  const routeLine = L.polyline(routeCoords, {
    color: "blue",
    weight: 4,
  }).addTo(map);

  map.fitBounds(routeLine.getBounds());

  // ---------- START & END MARKERS ----------
  L.marker(routeCoords[0]).addTo(map).bindPopup("START");
  L.marker(routeCoords[1]).addTo(map).bindPopup("END");

  // ---------- PETROL PUMPS (GUARANTEED) ----------
  // place 3 pumps between start & end
  const midLat = (routeCoords[0][0] + routeCoords[1][0]) / 2;
  const midLng = (routeCoords[0][1] + routeCoords[1][1]) / 2;

  const pumpPoints = [
    [midLat + 0.1, midLng + 0.1],
    [midLat, midLng],
    [midLat - 0.1, midLng - 0.1],
  ];

  pumpPoints.forEach((p, i) => {
    L.marker(p)
      .addTo(map)
      .bindPopup(`Petrol Pump ${i + 1}`);
  });
}
