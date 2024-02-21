const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const DBconnection = require("./src/config/db");
const transactionRoutes = require("./src/routes/transactionRoutes");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Database connection
DBconnection();

// transaction routes
app.use("/", transactionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
