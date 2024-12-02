import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import LoginComponent from "../LoginComponent/LoginComponent";
import TopBannerInHomePage from "../../assets/TopBannerInHomePage.avif"; // Adjust the path based on your folder structure
import { FaStar } from "react-icons/fa";

const HomeComponent = () => {
  const [womensProducts, setWomensProducts] = useState([]);
  const [mensProducts, setMensProducts] = useState([]);
  const [jewelleryProducts, setJewelleryProducts] = useState([]);
  const [electronicsProducts, setElectronicsProducts] = useState([]);
  const [isLoadingWomen, setIsLoadingWomen] = useState(true);
  const [isLoadingMen, setIsLoadingMen] = useState(true);
  const [isLoadingJewellery, setIsLoadingJewellery] = useState(true);
  const [isLoadingElectronics, setIsLoadingElectronics] = useState(true);

  // Local state to handle the popup for login/signup
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to toggle the login/signup popup
  function togglePopup() {
    setIsPopupOpen((prevState) => !prevState);
  }

  useEffect(() => {
    getWomensProducts();
    getMensProducts();
    getJewelleryProducts();
    getElectronicsProducts();
  }, []);

  async function getWomensProducts() {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URI
        }/api/product/details/category/674db33ba53b6d7edaf4b16d`
      );

      setWomensProducts(response.data);
      // console.log("womensproduct", womensProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoadingWomen(false); // Stop loading once products are fetched
    }
  }
  async function getMensProducts() {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URI
        }/api/product/details/category/66fe5ecd29844a67fee27147`
      );

      setMensProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoadingMen(false); // Stop loading once products are fetched
    }
  }

  async function getJewelleryProducts() {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URI
        }/api/product/details/category/66fe5ec429844a67fee27145`
      );

      setJewelleryProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoadingJewellery(false); // Stop loading once products are fetched
    }
  }

  async function getElectronicsProducts() {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URI
        }/api/product/details/category/66fe5eab29844a67fee27143`
      );

      setElectronicsProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoadingElectronics(false); // Stop loading once products are fetched
    }
  }
  // console.log("womensproduct", womensProducts);

  return (
    <>
      <div className="mx-4 my-2 flex justify-center items-center ">
        <img
          src={TopBannerInHomePage}
          alt="My AVIF"
          className="w-full md:mx-3   lg:w-[1150px]"
        />
      </div>

      <div className="flex flex-wrap gap-4 py-4 bg-gray-300">
        <div className=" bg-orange-200 rounded-2xl mx-4 md:mx-auto  ">
          <div className=" text-center text-4xl font-semibold ">
            Mens Products
          </div>
          {isLoadingMen ? (
            <div className="flex  h-screen">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="flex justify-center items-center ">
              {mensProducts?.slice(0, 3).map((product) => (
                <div
                  key={product._id}
                  className="flex justify-center m-2 items-center rounded-lg shadow-md overflow-hidden bg-white p-1 md:p-3  "
                >
                  <Link to={`/list/${product.category._id}`}>
                    <div className="md:w-48  md:flex md:justify-center md:items-center">
                      <img
                        src={product?.image?.url}
                        alt={product.name}
                        className="w-36 h-40 md:w-52 md:h-80 sm:w-48 sm:h-80 object-cover rounded-2xl  md:px-2 "
                      />
                    </div>

                    <div className="flex justify-center items-center ">
                      <div className="flex items-center justify-center bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded my-2 w-fit">
                        <div>
                          <span className="text-xs sm:block hidden">
                            {product.title.split(" ").slice(0, 2).join(" ") +
                              "..."}
                          </span>
                          <span className="text-xs sm:hidden block">
                            {product.title.split(" ").slice(0, 1).join(" ") +
                              "..."}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-center text-xs">
                      ${product.price}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className=" bg-pink-300 rounded-2xl  mx-4 md:mx-auto">
          <div className=" text-center text-4xl font-semibold    ">
            Womens Products
          </div>
          {isLoadingWomen ? (
            <div className="flex  h-screen">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="flex justify-center items-center ">
              {womensProducts?.slice(0, 3).map((product) => (
                <div
                  key={product._id}
                  className="flex justify-center m-2 items-center rounded-lg shadow-md overflow-hidden bg-white p-1 md:p-3  "
                >
                  <Link to={`/list/${product.category._id}`}>
                    <div className="md:w-48  md:flex md:justify-center md:items-center">
                      <img
                        src={product?.image?.url || ""}
                        alt={product.name}
                        className="w-36 h-40 md:w-52 md:h-80 sm:w-48 sm:h-80 object-cover rounded-2xl  md:px-2 "
                      />
                    </div>

                    <div className="flex justify-center items-center ">
                      <div className="flex items-center justify-center bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded my-2 w-fit">
                        <div>
                          <span className="text-xs sm:block hidden">
                            {product.title.split(" ").slice(0, 2).join(" ") +
                              "..."}
                          </span>
                          <span className="text-xs sm:hidden block">
                            {product.title.split(" ").slice(0, 1).join(" ") +
                              "..."}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-center text-xs">
                      ${product.price}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className=" bg-yellow-200 rounded-2xl mx-4 md:mx-auto">
          <div className=" text-center text-4xl font-semibold  ">
            Jewellery Products
          </div>
          {isLoadingJewellery ? (
            <div className="flex  h-screen">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="flex justify-center items-center ">
              {jewelleryProducts?.slice(0, 3).map((product) => (
                <div
                  key={product._id}
                  className="flex justify-center m-2 items-center rounded-lg shadow-md overflow-hidden bg-white p-1 md:p-3  "
                >
                  <Link to={`/list/${product.category._id}`}>
                    <div className="md:w-48  md:flex md:justify-center md:items-center">
                      <img
                        src={product?.image?.url}
                        alt={product.title}
                        className="w-36 h-40 md:w-52 md:h-80 sm:w-48 sm:h-80 object-cover rounded-2xl  md:px-2 "
                      />
                    </div>

                    <div className="flex justify-center items-center ">
                      <div className="flex items-center justify-center bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded my-2 w-fit">
                        <div>
                          <span className="text-xs sm:block hidden">
                            {product.title.split(" ").slice(0, 2).join(" ") +
                              "..."}
                          </span>
                          <span className="text-xs sm:hidden block">
                            {product.title.split(" ").slice(0, 1).join(" ") +
                              "..."}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-center text-xs">
                      ${product.price}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className=" bg-gray-400 rounded-2xl  mx-4 md:mx-auto">
          <div className=" text-center text-4xl font-semibold  ">
            Electronics Products
          </div>
          {isLoadingElectronics ? (
            <div className="flex  h-screen">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="flex justify-center items-center ">
              {electronicsProducts?.slice(0, 3).map((product) => (
                <div
                  key={product._id}
                  className="flex justify-center m-2 items-center rounded-lg shadow-md overflow-hidden bg-white p-1 md:p-3  "
                >
                  <Link to={`/list/${product.category._id}`}>
                    <div className="md:w-48  md:flex md:justify-center md:items-center">
                      <img
                        src={product?.image?.url}
                        alt={product.title}
                        className="w-36 h-40 md:w-52 md:h-80 sm:w-48 sm:h-80 object-cover rounded-2xl  md:px-2 "
                      />
                    </div>

                    <div className="flex justify-center items-center ">
                      <div className="flex items-center justify-center bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded my-2 w-fit">
                        <div>
                          <span className="text-xs sm:block hidden">
                            {product.title.split(" ").slice(0, 2).join(" ") +
                              "..."}
                          </span>
                          <span className="text-xs sm:hidden block">
                            {product.title.split(" ").slice(0, 1).join(" ") +
                              "..."}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-center text-xs">
                      ${product.price}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* popup for signup and login */}
      {isPopupOpen && <LoginComponent togglePopup={togglePopup} />}
    </>
  );
};

export default HomeComponent;
