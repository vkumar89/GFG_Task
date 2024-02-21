const ProductTransaction = require("../models/ProductTransaction");
const axios = require("axios");
const moment = require("moment");

// Initialize all data
exports.initializeDatabase = async (req, res) => {
  try {
    // Fetch data from the third-party API
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const jsonData = response.data;

    // Insert the fetched data into the database
    await ProductTransaction.insertMany(jsonData);

    res.json({ message: "Database initialized successfully with seed data" });
  } catch (error) {
    console.error("Error initializing database:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// filter List transactions
exports.listTransactions = async (req, res) => {
  try {
    const { page = 1, perPage = 10, searchText = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(perPage);
    const regex = new RegExp(searchText, "i");
    let query = {
      $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
    };

    // Only include price search if searchText can be parsed to a number
    if (!isNaN(parseFloat(searchText)) && isFinite(searchText)) {
      query.$or.push({ price: parseFloat(searchText) });
    }

    const totalCount = await ProductTransaction.countDocuments(query);
    const transactions = await ProductTransaction.find(query)
      .select("-__v")
      .skip(skip)
      .limit(Number(perPage));
    const totalPages = Math.ceil(totalCount / perPage);
    res.json({ transactions, totalCount, totalPages });
  } catch (error) {
    console.error("Error listing transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Statistics
exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.query;

    // Validate the month parameter format
    if (!moment(month, "MMMM").isValid()) {
      return res.status(400).json({
        error:
          "Invalid month format. Please provide a valid month name (e.g., January).",
      });
    }

    // Calculate statistics for the provided month
    const startDate = moment(month, "MMMM").startOf("month");
    const endDate = moment(month, "MMMM").endOf("month");

    // Query to find total sale amount, total number of sold items, and total number of not sold items
    const statistics = await ProductTransaction.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: "$price" },
          totalSoldItems: {
            $sum: {
              $cond: { if: { $ne: ["$dateOfSale", null] }, then: 1, else: 0 },
            },
          },
          totalNotSoldItems: {
            $sum: {
              $cond: { if: { $eq: ["$dateOfSale", null] }, then: 1, else: 0 },
            },
          },
        },
      },
    ]);

    // Send the statistics as a response
    res.json(statistics[0]);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Bar Chart Data
exports.getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;

    // Calculate the start and end dates for the selected month
    const startDate = new Date(month);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    // Define price ranges
    const priceRanges = [
      { range: "0 - 100", min: 0, max: 100 },
      { range: "101 - 200", min: 101, max: 200 },
      { range: "201 - 300", min: 201, max: 300 },
      { range: "301 - 400", min: 301, max: 400 },
      { range: "401 - 500", min: 401, max: 500 },
      { range: "501 - 600", min: 501, max: 600 },
      { range: "601 - 700", min: 601, max: 700 },
      { range: "701 - 800", min: 701, max: 800 },
      { range: "801 - 900", min: 801, max: 900 },
      { range: "901 - above", min: 901, max: Infinity },
    ];

    // Initialize an object to store the count of items in each price range
    const barChartData = {};

    // Query for each price range and count the items
    for (const range of priceRanges) {
      const count = await ProductTransaction.countDocuments({
        dateOfSale: { $gte: startDate, $lt: endDate },
        dateOfSale: { $exists: true }, // Check if dateOfSale exists
        price: { $gte: range.min, $lte: range.max },
      });
      barChartData[range.range] = count;
    }

    res.json(barChartData);
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// pie chart
exports.getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;

    // Calculate the start and end dates for the selected month
    const startDate = new Date(month);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    // Query unique categories and count the number of items in each category
    const pieChartData = await ProductTransaction.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(pieChartData);
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Combine API's
exports.getCombinedData = async (req, res) => {
  try {
    const { month } = req.query;

    // Define URLs for the three APIs
    const transactionsURL = `http://localhost:3000/transactions?month=${month}`;
    const statisticsURL = `http://localhost:3000/statistics?month=${month}`;
    const barChartURL = `http://localhost:3000/bar-chart?month=${month}`;
    const pieChartURL = `http://localhost:3000/pie-chart?month=${month}`;

    // Make requests to all APIs concurrently
    const [
      transactionsResponse,
      statisticsResponse,
      barChartResponse,
      pieChartResponse,
    ] = await Promise.all([
      axios.get(transactionsURL),
      axios.get(statisticsURL),
      axios.get(barChartURL),
      axios.get(pieChartURL),
    ]);

    // Combine responses into a single object
    const combinedData = {
      transactions: transactionsResponse.data,
      statistics: statisticsResponse.data,
      barChartData: barChartResponse.data,
      pieChartData: pieChartResponse.data,
    };

    // Send the combined response
    res.json(combinedData);
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
