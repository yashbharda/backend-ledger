import "dotenv/config";
import dns from "node:dns";

// Set Google DNS servers to fix MongoDB Atlas SRV DNS lookup (ECONNREFUSED) error
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import app from "./src/app.js";
import connectToDB from "./src/config/db.js";

connectToDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
