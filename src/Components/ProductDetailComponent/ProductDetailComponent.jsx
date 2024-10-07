import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart as addProductToCart } from "../../Redux/features/cartSlice"; // Rename for clarity
import toast from "react-hot-toast";
import LoginComponent from "../LoginComponent/LoginComponent";
import { useSelector } from "react-redux";
import { selectUsers } from "../../Redux/Authentication/usersSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { fetchCart } from "../../Redux/features/cartSlice";

const ProductDetailComponent = () => {
  const { productid } = useParams(); // Get the product ID from the route
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const navigate = useNavigate(); // For programmatic navigation

  // Fetching the current user from the Redux store
  const { currentUser } = useSelector(selectUsers);
  // console.log("User", currentUser);

  // Local state to handle the popup for login/signup
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to toggle the login/signup popup
  function togglePopup() {
    setIsPopupOpen((prevState) => !prevState);
  }

  function handleCartButtonClick(product) {
    if (currentUser) {
      sendToCart(product);
      // navigate("/cart"); // Navigate to the cart if the user is logged in
    } else {
      togglePopup(); // Open the login/signup modal if the user is not logged in
    }
  }

  const dispatch = useDispatch();

  const sendToCart = async (product) => {
    const token = Cookies.get("Job"); // Get the token from cookies
    if (!token) {
      toast.error("You need to log in first!");
      togglePopup(); // Show the login popup if the user is not logged in
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/cart/addToCart`,
        {
          productId: product._id, // Send the product ID in the request body
          quantity: 1,
          price: product.price,
          title: product.title,
          image: product.image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        }
      );

      dispatch(fetchCart());
      toast.success("Product added to the cart!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("An error occurred while adding to the cart");
    }
  };

  // Fetch the main product based on the product ID
  useEffect(() => {
    console.log("productid", productid);

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URI}/api/product/${productid}`
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productid]); // Depend on id so it refetches when id changes

  // Fetch related products based on the category of the main product
  useEffect(() => {
    console.log("product", product);
    // console.log("product._id", product?._id);
    if (product) {
      const fetchRelatedProducts = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URI}/api/product/details/category/${
              product.category
            }`
          );
          const data = await response.json();
          // console.log("dataofrelatedproduct", data);
          // Filter out the current product from the related products list
          const related = data.filter((item) => item._id !== product._id);
          setRelatedProducts(related);
        } catch (error) {
          console.error("Error fetching related products:", error);
        } finally {
          setRelatedLoading(false);
        }
      };

      fetchRelatedProducts();
    }
  }, [product]); // Depend on product so it fetches related products when the product changes

  if (loading) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  return (
    <div className="bg-gray-300">
      <div className="container mx-auto p-4 bg-gray-300">
        {product ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4  p-2">
              {/* Product Image and Details */}
              <div className="flex justify-center rounded-lg ">
                <img
                  src={product.image.url}
                  alt={product.title}
                  className="w-full md:h-96 h-40 max-w-xs object-cover rounded-lg "
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-xs md:text-3xl font-bold ">
                  {product.title}
                </h2>
                <p className="text-xs md:text-lg ">{product.description}</p>
                <p className="text-xs md:text-2xl font-semibold text-green-600 text-center">
                  ${product.price}
                </p>

                <div className="flex justify-center">
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-xs md:text-lg "
                    onClick={() => handleCartButtonClick(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Related Products */}
            <div className="mt-10 ">
              <hr className="border-2 border-gray-500 mt-2" />
              <h3 className="text-2xl font-bold mb-4 text-center mt-2">
                Related Products
              </h3>
              {relatedLoading ? (
                <p className="text-center ">Loading related products...</p>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-3 gap-6  ">
                  {relatedProducts.length > 0 ? (
                    relatedProducts.slice(0, 3).map((relatedProduct) => (
                      <div
                        key={relatedProduct._id}
                        className="border p-4  rounded-lg cursor-pointer hover:shadow-lg transition bg-white "
                        onClick={() =>
                          navigate(`/product/${relatedProduct._id}`)
                        } // Navigate to clicked product detail page
                      >
                        <img
                          src={relatedProduct.image.url}
                          alt={relatedProduct.title}
                          className="w-full h-12 md:h-44 object-cover mb-2"
                        />
                        <h4 className="font-semibold text-xs">
                          {relatedProduct.title
                            .split(" ")
                            .slice(0, 3)
                            .join(" ")}
                        </h4>
                        <p className="text-green-600 font-bold text-xs">
                          ${relatedProduct.price}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No related products found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center py-10">Product not found</p>
        )}
      </div>
      {isPopupOpen && <LoginComponent togglePopup={togglePopup} />}
    </div>
  );
};

export default ProductDetailComponent;
