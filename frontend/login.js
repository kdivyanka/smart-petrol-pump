document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    mileage: Number(document.getElementById("mileage").value),
    tankCapacity: Number(document.getElementById("tankCapacity").value),
  };

  try {
    const res = await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const user = await res.json();

    if (!res.ok) {
      document.getElementById("msg").innerText = user.error;
      return;
    }

    // 🔥 STORE USER
    localStorage.setItem("userId", user._id);
    localStorage.setItem("user", JSON.stringify(user));

    // 🔁 REDIRECT
    window.location.href = "index.html";

  } catch (err) {
    document.getElementById("msg").innerText = "Server error";
  }
});
