const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// initializing the database with seed data
router.post("/initialize-database", transactionController.initializeDatabase);

// List transaction
router.get("/transactions", transactionController.listTransactions);

// get statistics
router.get("/statistics", transactionController.getStatistics);

// get bar chart data
router.get("/bar-chart", transactionController.getBarChartData);

// get pie chart data
router.get("/pie-chart", transactionController.getPieChartData);

// combine API's
router.get("/combine", transactionController.getCombinedData);

module.exports = router;
