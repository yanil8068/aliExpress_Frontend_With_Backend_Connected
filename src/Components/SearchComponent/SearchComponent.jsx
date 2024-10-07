import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import LoginComponent from "../LoginComponent/LoginComponent";

import { Link } from "react-router-dom";

const SearchComponent = () => {
  const [products, setProducts] = useState([]); // State to hold search results
  const location = useLocation(); // Get current location to read query params
  const queryParams = new URLSearchParams(location.search); // Create URLSearchParams object to parse query params
  const query = queryParams.get("query"); // Get the search query from URL

  // Effect to fetch search results whenever the query changes
  useEffect(() => {
    if (query) {
      fetchSearchResults(query); // Call the function to fetch results
    }
  }, [query]); // Dependency array includes query

  // Function to fetch products based on the search term
  async function fetchSearchResults(searchTerm) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/product/details`
      ); // Fetch all products
      const filtered = response.data.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) // Filter products by title
      );
      setProducts(filtered); // Update state with filtered products
    } catch (error) {
      console.error("Error fetching search results:", error); // Handle error
    }
  }

  // Local state to handle the popup for login/signup
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to toggle the login/signup popup
  function togglePopup() {
    setIsPopupOpen((prevState) => !prevState);
  }

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h1>Search Results for "{query}"</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.length > 0 ? ( // Check if there are products to display
            products?.map(
              (
                product // Map over each product
              ) => (
                <div
                  key={product?._id}
                  className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between"
                >
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={product?.image?.url}
                      alt={product?.title}
                      className="w-full h-48 object-cover mb-4 rounded"
                    />
                    <h2 className="text-lg font-semibold">{product?.title}</h2>{" "}
                    {/* Product title */}
                    <p className="text-gray-700 mt-2">${product?.price}</p>
                  </Link>
                </div>
              )
            )
          ) : (
            <p>No products found for "{query}".</p> // Message when no products are found
          )}
        </div>
      </div>
      {/* popup for signup and login */}
      {isPopupOpen && <LoginComponent togglePopup={togglePopup} />}
    </>
  );
};

export default SearchComponent;
