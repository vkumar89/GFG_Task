import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionsStatistics = ({ selectedMonth }) => {
  const [totalSaleAmount, setTotalSaleAmount] = useState(0);
  const [totalSoldItems, setTotalSoldItems] = useState(0);
  const [totalNotSoldItems, setTotalNotSoldItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics(selectedMonth);
  }, [selectedMonth]);

  const fetchStatistics = async (month) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/statistics?month=${month}`
      );
      const { totalSaleAmount, totalSoldItems, totalNotSoldItems } =
        response.data;
      setTotalSaleAmount(totalSaleAmount);
      setTotalSoldItems(totalSoldItems);
      setTotalNotSoldItems(totalNotSoldItems);
    } catch (error) {
      setError("Error fetching statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen">
      <h2>Transactions Statistics - {selectedMonth}</h2>
      <div>Total Sale Amount: {totalSaleAmount}</div>
      <div>Total Sold Items: {totalSoldItems}</div>
      <div>Total Not Sold Items: {totalNotSoldItems}</div>
    </div>
  );
};

export default TransactionsStatistics;
