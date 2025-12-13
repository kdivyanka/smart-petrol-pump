
// ------------------ USER TEST API ------------------

app.get("/test-save", async (req, res) => {
  try {
    const user = new User({
      name: "Divyanka",
      email: "test@gmail.com",
      mileage: 18,
      tankCapacity: 40
    });

    await user.save();
    res.send("✅ User saved in MongoDB");

  } catch (error) {
    console.log(error);
    res.status(500).send("❌ Error saving user");
  }
});

// ------------------ ROUTE SAVE API ------------------

app.get("/add-route", async (req, res) => {
  const r = new Route({
    source: "Hubli",
    destination: "Goa",
    distance: 210
  });

  await r.save();
  res.send("✅ Route saved");
});

// ------------------ PETROL PUMP API ------------------

app.get("/add-pump", async (req, res) => {
  const p = new PetrolPump({
    name: "Indian Oil",
    location: "NH48 Dharwad"
  });

  await p.save();
  res.send("✅ Petrol Pump saved");
});

// ------------------ FUEL DATA API ------------------

app.get("/add-fuel", async (req, res) => {
  const fuel = new Fuel({
    userId: "SAMPLE_USER_ID",
    routeId: "SAMPLE_ROUTE_ID",
    requiredFuel: 11.6,
    decision: "Refuel Needed"
  });

  await fuel.save();
  res.send("✅ Fuel record saved");
});

// ------------------ TRIP ROUTES ------------------

app.use("/api/trip", tripRoutes);

// ------------------ START SERVER ------------------

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
