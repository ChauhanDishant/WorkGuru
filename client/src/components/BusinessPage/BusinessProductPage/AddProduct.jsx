import React, { useEffect, useState } from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import axios from "axios";
import categories from "./Categories";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet";

const AddProduct = () => {
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productRoles, setProductRoles] = useState([]);
  const [rolesum, setRoleSum] = useState(0);
  const [roleInputs, setRoleInputs] = useState([{ role: "", wages: "" }]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subcategoryadded, setSubCategoryAdded] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]); // State to manage selected images

  axios.defaults.baseURL =
    process.env.NODE_ENV === "production"
      ? "https://workguru-server.onrender.com"
      : "http://localhost:5000/";

  useEffect(() => {
    const fetchProductRoles = async () => {
      try {
        const res = await axios.get("/workguru/business/listofroles", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          setProductRoles(res.data.data);
          setAvailableRoles(res.data.data);
          toast.success("Roles fetched successfully");
        }
      } catch (error) {
        toast.error("Error fetching roles");
        console.error("Error fetching roles:", error);
      }
    };

    fetchProductRoles();
  }, []);

  useEffect(() => {
    const sum = roleInputs.reduce((acc, input) => {
      const wages = parseFloat(input.wages);
      return acc + (isNaN(wages) ? 0 : wages);
    }, 0);
    setRoleSum(sum);
  }, [roleInputs]);

  const handleCategoryChange = (e) => {
    const categoryName = e.target.value;
    setSelectedCategory(categoryName);
    const category = categories.find((cat) => cat.name === categoryName);
    setSubCategories(category ? category.subcategories : []);
  };

  const handleRoleChange = (index, value) => {
    const isRoleAlreadySelected = roleInputs.some(
      (input, i) => i !== index && input.role === value
    );

    if (isRoleAlreadySelected) {
      toast.error("This role is already selected");
      return;
    }

    const updatedRoleInputs = [...roleInputs];
    updatedRoleInputs[index].role = value;
    setRoleInputs(updatedRoleInputs);
  };

  const handleWagesChange = (index, value) => {
    const updatedRoleInputs = [...roleInputs];
    updatedRoleInputs[index].wages = value;
    setRoleInputs(updatedRoleInputs);
  };

  const addRoleInput = () => {
    const newRoleInputs = [...roleInputs, { role: "", wages: "" }];
    setRoleInputs(newRoleInputs);
    setAvailableRoles(productRoles);
  };

  const deleteRoleInput = (index) => {
    const updatedRoleInputs = [...roleInputs];
    updatedRoleInputs.splice(index, 1);
    setRoleInputs(updatedRoleInputs);
    setAvailableRoles(productRoles);
  };

  const isLastRoleInputValid = () => {
    const lastRoleInput = roleInputs[roleInputs.length - 1];
    return lastRoleInput.role !== "" && lastRoleInput.wages !== "";
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]); // Set selected files to state
  };

  // Submit Method
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("category", selectedCategory);
    formData.append("subcategory", subcategoryadded);
    formData.append("totalLabourCost", rolesum);
    formData.append("roles", JSON.stringify(roleInputs));

    images.forEach((image) => {
      formData.append("images", image);
    });
    axios.defaults.baseURL =
      process.env.NODE_ENV === "production"
        ? "https://workguru-server.onrender.com"
        : "http://localhost:5000/";

    try {
      const res = await axios.post("/workguru/business/addproducts", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        toast.success("Product added successfully");
        setProductName("");
        setSelectedCategory("");
        setSubCategories([]);
        setRoleInputs([{ role: "", wages: "" }]);
        setRoleSum(0);
        setImages([]); // Clear images after successful submission
        navigate("/business/listofproducts");
      } else {
        toast.error("Error adding product");
      }
    } catch (error) {
      toast.error("Error adding product");
      console.error("Error adding product:", error);
    }
  };

  return (
    <>
      <BusinessSideBarPage>
        <Helmet>
          <title>Products Section</title>
        </Helmet>
        <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-3 max-w-3xl shadow-lg">
          <h2 className="text-2xl font-medium mb-4 text-center">Add Product</h2>
          <div className="my-2 bg-blue-500 h-[1.1px]"></div>
          <div className="rounded-lg px-2 py-6 mx-auto my-1 max-w-2xl">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="Submissible Motor"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-[45%_auto] gap-4 mb-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Product Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCategory && (
                  <div>
                    <label
                      htmlFor="subcategory"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Product SubCategory
                    </label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                      onChange={(e) => {
                        setSubCategoryAdded(e.target.value);
                      }}
                      required
                    >
                      <option value="">Select SubCategory</option>
                      {subCategories.map((subCat, index) => (
                        <option key={index} value={subCat}>
                          {subCat}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role Wages
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {roleInputs.map((roleInput, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                            value={roleInput.role}
                            onChange={(e) =>
                              handleRoleChange(index, e.target.value)
                            }
                            required
                          >
                            <option value="">Select Roles</option>
                            {availableRoles.map((role, roleIndex) => (
                              <option key={roleIndex} value={role.rolename}>
                                {role.rolename}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <input
                              type="number"
                              className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                              placeholder="100"
                              value={roleInput.wages}
                              onChange={(e) =>
                                handleWagesChange(index, e.target.value)
                              }
                              required
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center pr-2">
                              <span className="text-blue-500">/pieces</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {index > 0 && (
                            <button
                              type="button"
                              className="bg-red-500 text-gray-100 py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 ease-in-out"
                              onClick={() => deleteRoleInput(index)}
                            >
                              Delete Row
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center">
                        <button
                          type="button"
                          className="bg-green-500 text-gray-100 py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out"
                          onClick={addRoleInput}
                          disabled={!isLastRoleInputValid()}
                        >
                          Add More
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  <span className="sr-only">Choose product images</span>
                  <input
                    type="file"
                    className="block w-full text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none dark:text-neutral-500 dark:file:bg-blue-500dark:hover:file:bg-blue-400"
                    multiple
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div className="mb-4 grid grid-cols-1">
                <div className="text-orange-400 font-bold text-2xl">
                  <span className="text-blue-500 font-medium text-md">
                    Unit Labor Cost:
                  </span>{" "}
                  <span>Rs. </span>
                  {rolesum}
                </div>
              </div>

              <button
                className="mt-6 tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                type="submit"
              >
                <svg
                  className="w-6 h-6 -ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy={7} r={4} />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                <span className="ml-3">Add Product</span>
              </button>
            </form>
          </div>
        </div>
      </BusinessSideBarPage>
    </>
  );
};

export default AddProduct;
