import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ProductAddingForm from "../ProductAddingForm/ProductAddingForm";
import ProductUpdateComponent from "../ProductUpdateComponent/ProductUpdateComponent";

const DashboardComponent = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // For editing
  const [updatedCategoryName, setUpdatedCategoryName] = useState(""); // For the input field
  const [showDialog, setShowDialog] = useState(false); // For the dialog visibility
  const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false); // For add category dialog visibility
  const [newCategoryName, setNewCategoryName] = useState(""); // For new category input

  const [showAddProductDialog, setShowAddProductDialog] = useState(false); // For add product dialog
  const [showUpdateProductDialog, setShowUpdateProductDialog] = useState(false); // For add product dialog
  // Add new state to track the selected product for editing
  const [selectedProduct, setSelectedProduct] = useState(null);

  const token = Cookies.get("Job") || null;
  console.log("token", token);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/product/details`
        );
        console.log("allproducts", response.data);
        setAllProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/category/details`
        );
        console.log("allcategory", response.data);
        setAllCategory(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/category/create`,
        { name: newCategoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Assuming the response contains the newly created category in response.data
      const newCategory = response.data.data; // Ensure this is the correct structure
      console.log("response.data", response.data);

      // Update the state immediately
      setAllCategory((prevCategories) => [...prevCategories, newCategory]); // Add the new category to the list
      setNewCategoryName(""); // Clear the input field
      setShowAddCategoryDialog(false); // Close the dialog
      console.log("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Function to open the dialog box with the selected category
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setUpdatedCategoryName(category.name); // Prefill with current name
    setShowDialog(true); // Show the dialog
  };

  // Function to update the category
  const handleUpdateCategory = async () => {
    if (!selectedCategory || !updatedCategoryName) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URI}/api/category/${
          selectedCategory._id
        }`,
        { name: updatedCategoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the access token here
          },
        }
      );

      // Update the category name in the state
      setAllCategory(
        allCategory.map((category) =>
          category._id === selectedCategory._id
            ? { ...category, name: updatedCategoryName }
            : category
        )
      );

      setShowDialog(false); // Close the dialog
      console.log("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Function to handle category deletion
  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the access token here
          },
        }
      );
      // After deletion, update the state to remove the deleted category
      setAllCategory(
        allCategory.filter((category) => category._id !== categoryId)
      );
      console.log("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Function to open the product creation dialog
  const handleAddProductClick = () => {
    setShowAddProductDialog(true);
  };

  // Function to handle product deletion
  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the access token here
          },
        }
      );
      // After deletion, update the state to remove the deleted product
      setAllProducts(
        allProducts.filter((product) => product._id !== productId)
      );
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  // Function to open the product editing dialog
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowUpdateProductDialog(true); // Reuse the same dialog but for editing
  };

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard Component</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
          onClick={() => setShowAddCategoryDialog(true)}
        >
          Add Category
        </button>
        {/* Categories Table */}
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border-b py-3 px-4 text-left text-gray-700">
                Category Name
              </th>
              <th className="border-b py-3 px-4 text-left text-gray-700">
                Edit
              </th>
              <th className="border-b py-3 px-4 text-left text-gray-700">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {allCategory.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50">
                <td className="border-b py-3 px-4">{category.name}</td>
                <td className="border-b py-3 px-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 "
                    onClick={() => handleEditCategory(category)}
                  >
                    Edit
                  </button>
                </td>
                <td className="border-b py-3 px-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Products Table */}
        <h2 className="text-xl font-semibold mt-8 mb-4">Products</h2>
        {/* Add Product Button */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          onClick={handleAddProductClick}
        >
          Create Product
        </button>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border-b py-3 px-4 text-left text-gray-700">
                Product Name
              </th>
              <th className="border-b py-3 px-4 text-left text-gray-700">
                Edit
              </th>
              <th className="border-b py-3 px-4 text-left text-gray-700">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="border-b py-3 px-4">{product.title}</td>
                <td className="border-b py-3 px-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleEditProduct(product)} // Pass the product to edit
                  >
                    Edit
                  </button>
                </td>
                <td className="border-b py-3 px-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Add Category Dialog */}
        {showAddCategoryDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Add1 Category</h2>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="border border-gray-300 p-2 mb-4 w-full"
                required
              />
              <div className="flex justify-end">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                  onClick={handleAddCategory}
                >
                  Add
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setShowAddCategoryDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Edit Category Dialog */}
        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
              <input
                type="text"
                value={updatedCategoryName}
                onChange={(e) => setUpdatedCategoryName(e.target.value)}
                className="border border-gray-300 p-2 mb-4 w-full"
              />
              <div className="flex justify-end">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                  onClick={handleUpdateCategory}
                >
                  Update
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={() => setShowDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Add Product Dialog */}
        {showAddProductDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <ProductAddingForm
              onClose={() => setShowAddProductDialog(false)}
              setAllProducts={setAllProducts}
            />
          </div>
        )}
        {/* // In the section where you conditionally render the add/edit product
        dialog */}
        {showUpdateProductDialog && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <ProductUpdateComponent
              product={selectedProduct} // Pass the selected product
              onClose={() => {
                setShowUpdateProductDialog(false);
                setSelectedProduct(null); // Reset the selected product
              }}
              setAllProducts={setAllProducts}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardComponent;
