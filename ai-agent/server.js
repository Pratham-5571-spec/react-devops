const axios = require("axios");

setInterval(async () => {
  try {
    const res = await axios.get("http://backend:5000/todos");
    console.log("Backend Healthy");
  } catch {
    console.log("Backend Down");
  }
}, 5000);