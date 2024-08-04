import React, { useEffect, useState } from "react";
import BusinessSideBarPage from "../BusinessSideBarPage/BusinessSideBarPage";
import axios from "axios";
import categories from "./Categories";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router";
import { Helmet } from "react-helmet";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [productRoles, setProductRoles] = useState([]);
  const [roleSum, setRoleSum] = useState(0);
  const [roleInputs, setRoleInputs] = useState([{ role: "", wages: "" }]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]); // State to manage selected images

  axios.defaults.baseURL = "http://localhost:5000/";

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
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/workguru/business/listofproducts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success) {
          const foundProduct = res.data.data.find(
            (product) => product._id === productId
          );
          if (foundProduct) {
            setProduct(foundProduct);
            setRoleInputs(foundProduct.roles || [{ role: "", wages: "" }]);
            setSelectedCategory(foundProduct.category);
            const category = categories.find(
              (cat) => cat.name === foundProduct.category
            );
            setSubCategories(category ? category.subcategories : []);
          } else {
            toast.error("Product not found");
          }
        }
      } catch (err) {
        toast.error(err.message);
        console.log(err);
      }
    };
    fetchProduct();
  }, [productId]);

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
  };

  const deleteRoleInput = (index) => {
    const updatedRoleInputs = [...roleInputs];
    updatedRoleInputs.splice(index, 1);
    setRoleInputs(updatedRoleInputs);
  };

  const isLastRoleInputValid = () => {
    const lastRoleInput = roleInputs[roleInputs.length - 1];
    return lastRoleInput.role !== "" && lastRoleInput.wages !== "";
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]); // Set selected files to state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", selectedCategory);
    formData.append("subcategory", product.subcategory);
    formData.append("totalLabourCost", roleSum);
    formData.append("roles", JSON.stringify(roleInputs));

    // Append images
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const res = await axios.put(
        `/workguru/business/updateproduct/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Product updated successfully");
        navigate("/business/listofproducts");
      } else {
        toast.error("Error updating product");
      }
    } catch (error) {
      toast.error("Error updating product");
      console.error("Error updating product:", error);
    }
  };

  return (
    <BusinessSideBarPage>
      <Helmet>
        <title>Products Section</title>
      </Helmet>
      <div className="bg-white border rounded-lg px-8 py-6 mx-auto my-3 max-w-3xl shadow-lg">
        <h2 className="text-2xl font-medium mb-4 text-center">Edit Product</h2>
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
                value={product.name || ""}
                onChange={(e) =>
                  setProduct((prev) => ({ ...prev, name: e.target.value }))
                }
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
                    value={product.subcategory || ""}
                    onChange={(e) =>
                      setProduct((prev) => ({
                        ...prev,
                        subcategory: e.target.value,
                      }))
                    }
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
                          <option value="">Select Role</option>
                          {productRoles.map((role) => (
                            <option key={role._id} value={role.rolename}>
                              {role.rolename}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                          value={roleInput.wages}
                          onChange={(e) =>
                            handleWagesChange(index, e.target.value)
                          }
                          required
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {roleInputs.length > 1 && (
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteRoleInput(index)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-2 flex justify-center">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg ${
                  isLastRoleInputValid()
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={addRoleInput}
                disabled={!isLastRoleInputValid()}
              >
                Add More
              </button>
            </div>

            <div className="mt-4">
              <p className="block text-gray-700 font-medium mb-2">
                Total Labour Wages: ₹{roleSum}
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="images"
                className="block text-gray-700 font-medium mb-2"
              >
                Upload Images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
                onChange={handleImageChange}
              />
              <div className="mt-2">
                {product.images && product.images.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {product.images.map((image, index) => (
                        <img
                          key={index}
                          src={`http://localhost:5000/${product.images}`}
                          alt={`Product ${index}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </BusinessSideBarPage>
  );
};

export default EditProduct;
