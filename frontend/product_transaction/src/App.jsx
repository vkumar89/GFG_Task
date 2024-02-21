import React from "react";
import Transactions from "./components/Transactions";
import TransactionsStatistics from "./components/TransactionsStatistics";
import TransactionsBarChart from "./components/TransactionsBarChart";

function App() {
  return (
    <>
      <Transactions />
      <TransactionsStatistics />
      <TransactionsBarChart />
    </>
  );
}

export default App;
