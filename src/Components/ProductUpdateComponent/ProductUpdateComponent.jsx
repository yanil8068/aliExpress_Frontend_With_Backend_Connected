import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const ProductUpdateComponent = ({ product, onClose, setAllProducts }) => {
  console.log("product", product);
  const [title, setTitle] = useState(product.title || "");
  const [price, setPrice] = useState(product.price || 0);
  const [category, setCategory] = useState(product.category._id || "");
  const [categoryname, setCategoryname] = useState(product.category.name || "");
  const [description, setDescription] = useState(product.description || "");
  const [quantity, setQuantity] = useState(product.quantity || 0);
  const [image, setImage] = useState(product.image || "");
  console.log("image", image);

  const token = Cookies.get("Job") || null;

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCategory({ name: "electronics", _id: "66fe5eab29844a67fee27143" });
    // Prepare form data for the image upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("productimage", image);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URI}/api/product/${product._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Assuming the updated product is returned in response.data
      const updatedProduct = response.data.data;
      updatedProduct.category = {};
      updatedProduct.category._id = category;
      updatedProduct.category.name = categoryname;
      setAllProducts((prevProducts) =>
        prevProducts.map((p) => (p._id === product._id ? updatedProduct : p))
      );
      console.log("Product updated successfully:", updatedProduct);

      onClose(); // Close the dialog after updating
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full md:w-1/2">
        <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block text-gray-700">Product Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          {/* <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 p-2 w-full"
            />
          </div> */}
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border border-gray-300 p-2 w-full"
              required
            />
          </div>
          {/* <div className="mb-4">
            <label className="block text-gray-700">Upload Image</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="border border-gray-300 p-2 w-full"
            />
          </div> */}
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="productimage">
              Upload Image:
            </label>
            <input
              type="file"
              id="productimage"
              onChange={(e) => setImage(e.target.files[0])}
              className="border border-gray-300 p-2 w-full"
              // required // changed
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
            >
              Update Product
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUpdateComponent;
