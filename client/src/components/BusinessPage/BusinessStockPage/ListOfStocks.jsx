import React, { useEffect, useState } from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

const ListOfStocks = () => {
  const [stocks, setStocks] = useState([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState([]);
  const [editStock, setEditStock] = useState(null);

  const [editProductName, setEditProductName] = useState("");
  const [editQuantity, setEditQuantity] = useState(0);
  const [editItemsPerSet, setEditItemsPerSet] = useState(0);
  const [edittotalQuantity, setEditTotalQuantity] = useState(0);

  useEffect(() => {
    const fetchStocks = async () => {
      axios.defaults.baseURL = "http://localhost:5000/";
      try {
        const res = await axios.get("/workguru/business/listofstocks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setStocks(res.data.data);
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error("Error fetching stocks");
        console.error("Error fetching stocks:", error);
      }
    };

    fetchStocks();
  }, []);

  const toggleCheckbox = (event, stock) => {
    const { checked } = event.target;
    const stockTotal = stock.quantity;

    if (checked) {
      setSelected([...selected, stock._id]);
      setTotal(total + stockTotal);
    } else {
      setSelected(selected.filter((item) => item !== stock._id));
      setTotal(total - stockTotal);
    }
  };

  const deleteStock = async (stockId) => {
    try {
      const res = await axios.delete(
        `/workguru/business/deletestocks/${stockId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setStocks(stocks.filter((stock) => stock._id !== stockId));
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Error deleting stock");
      console.error("Error deleting stock:", error);
    }
  };

  const handleEdit = (stock) => {
    setEditStock(stock);
    setEditProductName(stock.productname);
    setEditQuantity(stock.quantity);
    setEditItemsPerSet(stock.itemsperset);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        productname: editProductName.trim(),
        quantity: parseInt(editQuantity),
        itemsperset: parseInt(editItemsPerSet),
        totalQuantity: parseInt(editQuantity),
      };

      if (
        isNaN(updatedData.quantity) ||
        updatedData.quantity <= 0 ||
        isNaN(updatedData.itemsperset) ||
        updatedData.itemsperset <= 0
      ) {
        toast.error("Quantity and Items per Set must be positive numbers");
        return;
      }

      const res = await axios.put(
        `/workguru/business/editstocks/${editStock._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedStocks = stocks.map((stock) =>
          stock._id === editStock._id ? { ...stock, ...updatedData } : stock
        );
        setStocks(updatedStocks);
        setEditStock(null);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        `Error updating stock: ${
          error.response?.data?.message || "Server error"
        }`
      );
      console.error("Error updating stock:", error);
    }
  };

  return (
    <BusinessSideBarPage>
      <Helmet>
        <title>List Of Stocks</title>
      </Helmet>

      <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-6 max-w-2xl shadow-lg">
        {editStock ? (
          <>
            <h2 className="text-2xl font-medium mb-4 text-center">
              Edit Stock
            </h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Product Name</label>
                <p className="block mt-2 py-1 text-bold pl-2 text-xl bg-gray-200 rounded outline:none ">
                  {editProductName}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Items per Set</label>
                <input
                  type="number"
                  name="itemsperset"
                  value={editItemsPerSet}
                  onChange={(e) => setEditItemsPerSet(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditStock(null)}
                  className="bg-gray-500 text-white p-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-medium mb-4 text-center">
              List of Stocks
            </h2>
            <div className="my-2 bg-blue-500 h-[1.1px]"></div>
            <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-2xl">
              <div className="mx-auto w-full max-w-2xl rounded-lg border border-gray-400 bg-white shadow-lg">
                <header className="border-b border-gray-400 px-5 py-4 text-center">
                  <div className="font-bold text-xl text-gray-800">
                    Manage Stocks
                  </div>
                </header>

                <table className="w-full table-auto">
                  <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-400">
                    <tr>
                      <th></th>
                      <th className="p-2">
                        <div className="text-left font-semibold">
                          Product Name
                        </div>
                      </th>
                      <th className="p-2">
                        <div className="text-left font-semibold">
                          Items per Set
                        </div>
                      </th>
                      <th className="p-2">
                        <div className="text-left font-semibold">Quantity</div>
                      </th>
                      <th className="p-2">
                        <div className="text-left font-semibold">
                          Total Quantity
                        </div>
                      </th>
                      <th className="p-2">
                        <div className="text-center font-semibold">Action</div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 text-sm">
                    {stocks.map((stock) => (
                      <tr key={stock._id}>
                        <td className="p-2">
                          <input
                            type="checkbox"
                            className="h-5 w-5"
                            value={stock._id}
                            onClick={(e) => toggleCheckbox(e, stock)}
                          />
                        </td>
                        <td className="p-2">
                          <div className="font-medium text-gray-800">
                            {stock.productname}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-left text-lg font-medium text-gray-800">
                            {stock.itemsperset}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-left text-lg font-medium text-gray-800">
                            {stock.quantity}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-left text-lg font-bold text-blue-500">
                            {stock.quantity}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="grid grid-cols-2">
                            <div className="flex justify-center">
                              <button onClick={() => handleEdit(stock)}>
                                <svg
                                  className="h-8 w-8 rounded-full p-1 hover:bg-gray-100 hover:text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 17.25V21h3.75l11.61-11.61-3.75-3.75L3 17.25zM14.7 6.3a1.875 1.875 0 112.65-2.65 1.875 1.875 0 01-2.65 2.65z"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                            <div className="flex justify-center">
                              <button onClick={() => deleteStock(stock._id)}>
                                <svg
                                  className="h-8 w-8 rounded-full p-1 hover:bg-gray-100 hover:text-red-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Total Amount */}
                <div className="flex justify-end space-x-4 border-t border-gray-100 px-5 py-4 text-2xl font-bold">
                  <div>Total</div>
                  <div className="text-blue-600">
                    <span>{total}</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <input
                    type="hidden"
                    className="border border-black bg-gray-50"
                    value={selected}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </BusinessSideBarPage>
  );
};

export default ListOfStocks;
