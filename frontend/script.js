document.getElementById("tripForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
        startAddress: document.getElementById("startAddress").value,
        endAddress: document.getElementById("endAddress").value,
        mileage: Number(document.getElementById("mileage").value),
        tankCapacity: Number(document.getElementById("tankCapacity").value),
        currentFuel: Number(document.getElementById("currentFuel").value),
        bufferPercentage: Number(document.getElementById("bufferPercentage").value),
        gapThresholdKm: Number(document.getElementById("gapThresholdKm").value)
    };

    const resultBox = document.getElementById("result");
    resultBox.classList.remove("hidden");
    resultBox.innerHTML = "<p class='text-blue-600'>Processing...</p>";

    try {
        const response = await fetch("http://localhost:5000/api/trip", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            resultBox.innerHTML = `<p class='text-red-600'>Error: ${result.error}</p>`;
            return;
        }

        resultBox.innerHTML = `
            <h2 class="text-xl font-bold mb-2">Trip Results</h2>
            <p><strong>Start:</strong> ${result.startLocation.displayName}</p>
            <p><strong>End:</strong> ${result.endLocation.displayName}</p>
            <p><strong>Distance:</strong> ${result.route.distanceKm.toFixed(2)} km</p>
            <p><strong>Fuel Needed:</strong> ${result.fuel.requiredFuel.toFixed(2)} L</p>
            <p><strong>Recommended Buffer:</strong> ${result.fuel.bufferFuel.toFixed(2)} L</p>
            <p><strong>Stations Found:</strong> ${result.stations.length}</p>
            <p><strong>Gap Alerts:</strong> ${result.gaps.length}</p>
        `;
    } catch (err) {
        resultBox.innerHTML = `<p class='text-red-600'>Request failed: ${err.message}</p>`;
    }
});
