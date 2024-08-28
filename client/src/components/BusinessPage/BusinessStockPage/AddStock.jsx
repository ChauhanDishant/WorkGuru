import React, { useState, useEffect } from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";

const AddStock = () => {
  axios.defaults.baseURL =
    process.env.NODE_ENV === "production"
      ? "https://workguru-server.onrender.com"
      : "http://localhost:5000/";

  const [products, setProducts] = useState([]);

  const [productname, setProductName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [itemsperset, setItemsPerSet] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.baseURL =
      process.env.NODE_ENV === "production"
        ? "https://workguru-server.onrender.com"
        : "http://localhost:5000/";
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/workguru/business/listofproducts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          toast.success(res.data.message);
          setProducts(res.data.data);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        console.log(err);
        toast.error(err.message);
      }
    };
    fetchProducts();
  }, []);

  // Update totalQuantity whenever quantity or itemsperset changes
  useEffect(() => {
    setTotalQuantity(quantity);
  }, [quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.baseURL =
      process.env.NODE_ENV === "production"
        ? "https://workguru-server.onrender.com"
        : "http://localhost:5000/";

    try {
      const token = localStorage.getItem("token");

      console.log("Token is : ", token);
      const res = await axios.post(
        "/workguru/business/addstocks",
        { productname, quantity, itemsperset, totalQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/business/listofstocks");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <>
      <BusinessSideBarPage>
        <Helmet>
          <title>Add Stocks</title>
        </Helmet>
        <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-6 max-w-2xl shadow-lg">
          <h2 className="text-2xl font-medium mb-4 text-center">Add Stocks</h2>
          <div className="my-2 bg-blue-500 h-[1.1px]"></div>
          <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-2xl">
            <form>
              <table className="w-full text-left text-gray-700 border-2">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Field</th>
                    <th className="border px-4 py-2">Input</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">
                      <label
                        htmlFor="productname"
                        className="block font-medium"
                      >
                        Product-Name
                      </label>
                    </td>
                    <td className="border px-4 py-2">
                      <select
                        name="products"
                        id="products"
                        className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                        value={productname}
                        onChange={(e) => setProductName(e.target.value)}
                      >
                        <option value="">Select Product</option>
                        {products.length > 0 &&
                          products.map((product, index) => (
                            <option key={index} value={product.name}>
                              {product.name}
                            </option>
                          ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">
                      <label htmlFor="quantity" className="block font-medium">
                        Quantity (in sets)
                      </label>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="relative">
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          className="border border-gray-400 p-[6px] w-full pr-16 rounded-lg focus:outline-none focus:border-blue-400"
                          placeholder="100"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <span className="text-blue-500">Sets</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">
                      <label
                        htmlFor="itemsperset"
                        className="block font-medium"
                      >
                        Items per Set
                      </label>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="relative">
                        <input
                          type="number"
                          id="itemsperset"
                          name="itemsperset"
                          className="border border-gray-400 p-[6px] w-full pr-16 rounded-lg focus:outline-none focus:border-blue-400"
                          placeholder="5"
                          value={itemsperset}
                          onChange={(e) =>
                            setItemsPerSet(Number(e.target.value))
                          }
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <span className="text-blue-500">/Set</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">
                      <label
                        htmlFor="totalQuantity"
                        className="block font-medium"
                      >
                        Total Quantity
                      </label>
                    </td>
                    <td className="border px-4 py-2">
                      <p className="text-3xl text-red-500 p-[6px] w-full">
                        {totalQuantity > 0 ? totalQuantity : "N/A"}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">
                      <label htmlFor="add-stock" className="block font-medium">
                        Add Stock
                      </label>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        type="submit"
                        id="enter"
                        className="tracking-wide font-semibold bg-green-500 text-gray-100 w-full p-[6px] rounded-lg hover:bg-green-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                        onClick={handleSubmit}
                      >
                        <i className="bi bi-wrench-adjustable"></i>
                        <span className="ml-3">Add Stocks</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>
        </div>
      </BusinessSideBarPage>
    </>
  );
};

export default AddStock;
