import React, { useState, useEffect } from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import axios from "axios";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router";
import LoadingSpinner from "../../LoadingScreen/LoadingSpinner";
import ErrorDisplay from "../../LoadingScreen/ErrorDisplay";

const ListOfProduct = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]); // Initialize as empty array
  const [selectedImage, setSelectedImage] = useState(null); // State to store selected image
  const [searchTerm, setSearchTerm] = useState(""); // Empty string for search
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const productsPerPage = 5; // Number of products per page

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      axios.defaults.baseURL =
        process.env.NODE_ENV === "production"
          ? "https://workguru-server.onrender.com"
          : "http://localhost:5000/";
      
          try {
        const res = await axios.get("/workguru/business/listofproducts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          toast.success(res.data.message);
          console.log(res.data.message);
          setProducts(res.data.data);
        } else {
          console.log(res.data.message);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data");
        toast.error(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  // ------------------ Edit Function Starts -------------------------
  const handleEdit = (productId) => {
    navigate(`/business/editproducts/${productId}`);
  };
  // ------------------ Delete Function Starts ----------------------
  const handleDelete = async (productId) => {
    try {
      const res = await axios.delete(
        `/workguru/business/deleteproducts/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setProducts(products.filter((product) => product._id !== productId));
      }
    } catch (error) {
      toast.error("Error deleting role");
      console.error("Error deleting role:", error);
    }
  };

  const handleClickImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Improved filtering logic
  const filteredProducts = products.filter((product) => {
    if (!searchTerm) {
      return product; // Return all products if search term is empty
    }
    const searchTermLowerCase = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchTermLowerCase) ||
      product.category.toLowerCase().includes(searchTermLowerCase) ||
      product.totalLabourCost.toString().includes(searchTermLowerCase)
    );
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Helmet>
        <title>Products Section</title>
      </Helmet>
      <BusinessSideBarPage>
        <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-3 max-w-6xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">
            List of Products
          </h2>
          <div className="my-2 bg-blue-500 h-[1.1px]"></div>
          <div className="flex items-center justify-between pb-4 bg-white">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="mt-4 p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-white border border-gray-300 focus-within:ring-2 focus-within:ring-blue-300">
                <i className="bi bi-search text-lg text-gray-500"></i>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-[15px] ml-4 w-full text-gray-700 bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          <section className="py-6">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <table className="w-full table-auto shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-tight h-10">
                    <th className="text-left px-6 py-3">Image</th>
                    <th className="text-left px-6 py-3">Name</th>
                    <th className="text-left px-6 py-3">Category</th>
                    <th className="text-left px-6 py-3">SubCategory</th>
                    <th className="text-left px-6 py-3">Total Labour Cost</th>
                    <th className="text-left px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-100"
                        }`}
                      >
                        <td className="text-left px-6 py-4">
                          {product.images.length > 0 && (
                            <img
                              src={`http://localhost:5000/${product.images[0]}`}
                              alt={product.name}
                              className="w-10 h-10 rounded-full object-cover cursor-pointer"
                              onClick={() =>
                                handleClickImage(product.images[0])
                              }
                            />
                          )}
                        </td>
                        <td className="text-left px-6 py-4">{product.name}</td>
                        <td className="text-left px-6 py-4">
                          {product.category}
                        </td>
                        <td className="text-left px-6 py-4">
                          {product.subcategory}
                        </td>
                        <td className="text-left text-green-600 font-bold px-6 py-4">
                          Rs. {product.totalLabourCost}
                        </td>
                        <td className="text-center px-4 py-4">
                          <div className="grid grid-cols-[45%_auto] gap-1">
                            <button
                              onClick={() => handleEdit(product._id)}
                              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-center text-gray-400 h-20">
                      <td colSpan={6}>No products found</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-6">
                <div>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={`${
                        currentPage === index + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-700"
                      } px-4 py-2 mx-1 rounded`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <div>
                  <label htmlFor="page-select" className="mr-2">
                    Go to page:
                  </label>
                  <select
                    id="page-select"
                    value={currentPage}
                    onChange={(e) => handlePageChange(Number(e.target.value))}
                    className="border rounded px-2 py-1"
                  >
                    {Array.from({ length: totalPages }, (_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>
        </div>
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <img
              src={`http://localhost:5000/${selectedImage}`}
              alt="Enlarged Image"
              className="max-w-full max-h-screen"
              onClick={handleCloseModal}
            />
          </div>
        )}
      </BusinessSideBarPage>
    </>
  );
};

export default ListOfProduct;
