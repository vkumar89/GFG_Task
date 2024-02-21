// TransactionTable.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState("March"); // Default to March
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // UseEffect
  useEffect(() => {
    fetchTransactions();
  }, [month, currentPage]);

  // Fetch Transactions API using third party axios
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/transactions?month=${month}&page=${currentPage}&searchText=${searchText}`
      );
      setTransactions(response.data.transactions);
      setTotalPages(Math.ceil(response.data.totalCount / 10)); // Update totalPages
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Search transaction
  const handleSearch = async () => {
    setCurrentPage(1);
    fetchTransactions();
  };

  // Handle Next Page
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  // Handle Previous Page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto px-20 mt-5">
      <h1 className="text-3xl font-bold mb-4">Transactions Table</h1>
      <div className="flex items-center justify-between">
        <div className="mb-4 flex items-center justify-between">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search transactions..."
            className="w-full border border-yellow-300 rounded-md py-2 px-4 focus:outline-none focus:border-yellow-500"
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded focus:outline-none hover:bg-yellow-600 ml-2"
          >
            Search
          </button>
        </div>

        <div className="mb-4 ">
          <label htmlFor="month" className="mr-2">
            Select Month:
          </label>
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border border-yellow-300 rounded-md py-2 px-4 focus:outline-none focus:border-yellow-500"
          >
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto bg-yellow-500 rounded-xl">
        <table className="w-full rounded-xl">
          <thead className="textgray-900 font-extrabold text-xl">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Sold</th>
              <th className="border border-gray-300 px-4 py-2">Image</th>
            </tr>
          </thead>
          <tbody className="text-white">
            {transactions.map((transaction, id) => (
              <tr key={id}>
                <td className="border border-gray-300 px-4 py-2">{id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.description}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.category}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {transaction.sold}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={transaction.image}
                    alt=""
                    className="w-16 h-16 object-cover"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-5">
        <p className="text-xl font-bold text-gray-500">
          Page No: {currentPage}
        </p>
        {/* Display current page number and total pages */}
        <div className="flex items-center">
          <div className="mr-2 flex items-center gap-10 text-lg">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500"
                  : "bg-yellow-300 text-gray-700 hover:bg-yellow-500"
              } py-2 px-4 rounded focus:outline-none`}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500"
                  : "bg-yellow-300 text-gray-700 hover:bg-yellow-500"
              } py-2 px-4 rounded focus:outline-none`}
            >
              Next
            </button>
          </div>
          <div>
            {/* Show loading indicator if transactions are being fetched */}
            {isLoading && (
              <span className="text-gray-500 ml-2">(Loading...)</span>
            )}
          </div>
        </div>
        <p className="text-xl font-bold text-gray-500">Page No: {totalPages}</p>{" "}
      </div>
    </div>
  );
};

export default TransactionTable;
