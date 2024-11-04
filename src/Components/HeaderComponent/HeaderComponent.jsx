import React, { useEffect, useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { HiOutlineUser } from "react-icons/hi2";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

import { useDispatch, useSelector } from "react-redux";
import { setUser, selectUsers } from "../../Redux/Authentication/usersSlice";
import { Link, useNavigate } from "react-router-dom";
import LoginComponent from "../LoginComponent/LoginComponent";
import { emptycartIteam, fetchCart } from "../../Redux/features/cartSlice";
import axios from "axios";
import { FaLaptop, FaGem, FaMale, FaFemale } from "react-icons/fa"; // Import your icons
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const HeaderComponent = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // New state for slider menu
  const [category, setCategory] = useState([]);
  const { carts } = useSelector((state) => state.allCart);
  const [searchTerm, setSearchTerm] = useState("");

  // Local state to handle the popup for login/signup
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // State to track if categories have been fetched
  const [categoriesFetched, setCategoriesFetched] = useState(false);

  // Redux dispatch for state management and navigation for routing
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetching the current user from the Redux store
  const { currentUser } = useSelector(selectUsers);
  // console.log("User", currentUser);
  // console.log("auth.currentUser", auth.currentUser);
  const token = Cookies.get("Job") || null; // Retrieve token from cookies
  // Fetch user data if token exists and user is not already set
  useEffect(() => {
    if (token && !currentUser) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URI}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          dispatch(
            setUser({
              name: response.data.user.name,
              role: response.data.user.role,
            })
          );
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          Cookies.remove("Job");
        });
    }
  }, [token, currentUser, dispatch]);

  // Fetch categories once
  useEffect(() => {
    if (!categoriesFetched) {
      getCategories();
    }
  }, [categoriesFetched]);

  // Function to toggle the login/signup popup
  function togglePopup() {
    setIsPopupOpen((prevState) => !prevState);
  }

  // Handle category click
  const handleCategoryClick = (categoryid) => {
    navigate(`/list/${categoryid}`); // Redirect to the electronics list page

    setIsDropdownOpen(false); // Close the dropdown menu after selection
    setIsMenuOpen(false); // Close the menu when a category is clicked
  };

  // Function to handle the sign-out process
  async function handleSignOut() {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/user/logout`); // Call your logout API
      Cookies.remove("Job"); // Remove cookie

      dispatch(setUser(null)); // Clear user from Redux state
      dispatch(emptycartIteam);
      dispatch(fetchCart);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out", error);
      toast.error("Logout failed");
    }
  }

  // Function to handle the sign-out process
  async function handleDashboardClick() {
    navigate(`/admindashboard`); // Redirect to the electronics list page
    setIsDropdownOpen(false); // Close the dropdown menu after selection
    setIsMenuOpen(false); // Close the menu when a category is clicked
  }

  function handleCartButtonClick() {
    if (currentUser) {
      navigate("/cart"); // Navigate to the cart if the user is logged in
    } else {
      togglePopup(); // Open the login/signup modal if the user is not logged in
    }
  }

  //get categories
  useEffect(() => {
    getCategories();
  }, []);

  const categoryIcons = {
    electronics: <FaLaptop />,
    jewelery: <FaGem />,
    "men's clothing": <FaMale />,
    "women's clothing": <FaFemale />,
  };

  //get all categories
  async function getCategories() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/category/details`
      );
      // console.log("response", response.data);

      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  // Handle search input change
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle search button click
  const handleSearchButtonClick = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    } else {
      alert("Please enter a search term."); // Optional: Alert the user
    }
  };
  // console.log("currentUser", currentUser?.role);

  return (
    <>
      <div className="sticky top-0  w-full h-16 flex justify-around items-center bg-black text-white z-10">
        <div className="w-full flex justify-start items-center p-1 lg:p-4 z-50">
          <div className="w-full flex justify-center items-center">
            <div
              className="bg-gray-300 p-2 rounded-full mx-1 lg:mx-5  relative block lg:hidden"
              onClick={() => setIsMenuOpen(true)} // Toggle sliding menu
            >
              <GiHamburgerMenu />
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="block lg:hidden absolute top-8  w-52 bg-gray-200 text-black shadow-lg rounded-md transition-opacity duration-200">
                  <ul className="flex flex-col">
                    <li className="flex items-center px-1 lg:px-4 py-3  cursor-pointer transition-colors duration-150">
                      <span className="mr-0 lg:mr-2">
                        {" "}
                        <GiHamburgerMenu />
                      </span>
                      All Category
                    </li>
                    {category.map((eachCategory) => (
                      <li
                        className="flex items-center px-4 py-3 hover:bg-white cursor-pointer transition-colors duration-150"
                        key={eachCategory._id}
                        onClick={() => handleCategoryClick(eachCategory._id)}
                      >
                        <span className="mr-2">
                          {categoryIcons[eachCategory.name]}
                        </span>
                        {eachCategory.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="text-4xl font-bold  mx-5">
              <Link to={"/"}>AliExpress</Link>
            </div>

            <div
              className="bg-gray-600 p-2 rounded-full mx-5  relative hidden lg:block"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <GiHamburgerMenu />
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="hidden lg:block absolute top-8 left-1/2 transform -translate-x-1/2 w-52 bg-gray-200 text-black shadow-lg rounded-md transition-opacity duration-200">
                  <ul className="flex flex-col">
                    <li className="flex items-center px-4 py-3  cursor-pointer transition-colors duration-150">
                      <span className="mr-2">
                        {" "}
                        <GiHamburgerMenu />
                      </span>
                      All Category
                    </li>
                    {category.map((eachCategory) => (
                      <li
                        className="flex items-center px-4 py-3 hover:bg-white cursor-pointer transition-colors duration-150"
                        key={eachCategory._id}
                        onClick={() => handleCategoryClick(eachCategory._id)}
                      >
                        <span className="mr-2">
                          {categoryIcons[eachCategory.name]}
                        </span>
                        {eachCategory.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="w-full flex items-center justify-center hidden lg:block">
              <div className="relative w-full max-w-lg flex">
                <input
                  type="text"
                  className="text-black w-full px-4 py-1.5 rounded-l-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  placeholder="Search for products"
                />
                <button
                  className="font-bold flex items-center justify-center bg-black text-white px-4 py-1.5 rounded-r-full border-2 border-gray-300 cursor-pointer hover:bg-gray-800 transition duration-300"
                  onClick={handleSearchButtonClick}
                >
                  <HiMiniMagnifyingGlass className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end items-center p-1 lg:p-4">
          <div className="w-full flex justify-end items-center ">
            <div className=" lg:justify-center lg:items-center  lg:mx-5 hidden lg:flex">
              <div className="flex-col justify-center items-start ml-2 text-xs hidden lg:block">
                {/* Sign In / Join AJIO section */}
                {currentUser?.role == "admin" ? (
                  <div className="flex flex-col">
                    <div
                      className="text-white cursor-pointer font-bold"
                      onClick={handleDashboardClick}
                    >
                      Dashboard
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className=" lg:justify-center lg:items-center  lg:mx-5 hidden lg:flex">
              <div className="flex justify-center items-center text-3xl">
                <HiOutlineUser />
              </div>
              <div className="flex-col justify-center items-start ml-2 text-xs hidden lg:block">
                {/* Sign In / Join AJIO section */}
                {currentUser ? (
                  <div className="flex flex-col">
                    <div className="text-white cursor-pointer mb-1 font-bold">
                      Hey {currentUser.name}
                    </div>
                    <div
                      className="text-white cursor-pointer font-bold"
                      onClick={handleSignOut}
                    >
                      Logout
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-white font-bold">Welcome</div>
                    <div
                      className="text-white cursor-pointer"
                      onClick={togglePopup}
                    >
                      Sign In / Register
                    </div>
                  </>
                )}
              </div>
            </div>

            <div
              className="flex justify-center items-center  mx-5    "
              onClick={handleCartButtonClick}
            >
              <div className="flex justify-center items-center text-3xl ">
                {" "}
                <CiShoppingCart />
              </div>
              <div className="flex-col justify-center items-center text-xs hidden lg:block">
                {" "}
                <div className="bg-white text-black rounded-full flex justify-center">
                  {carts?.length}
                </div>
                <div>Cart</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center  lg:hidden p-2  -z-10">
        {/* small screen */}
        <div className="relative w-full max-w-lg flex">
          <input
            type="text"
            className="text-black w-full ml-3  px-4 py-1.5 rounded-l-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={searchTerm}
            onChange={handleSearchInputChange}
            placeholder="Search for products small"
          />
          <button
            className="font-bold flex items-center justify-center mr-3 bg-black text-white px-4 py-1.5 rounded-r-full border-2 border-gray-300 cursor-pointer hover:bg-gray-800 transition duration-300"
            onClick={handleSearchButtonClick}
          >
            <HiMiniMagnifyingGlass className="text-lg" />
          </button>
        </div>
      </div>
      {/* Sliding Menu */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Categories</h2>
            <button
              className="text-white text-2xl"
              onClick={() => setIsMenuOpen(false)}
            >
              &times;
            </button>
          </div>
          <ul className="flex flex-col">
            {category.map((eachCategory) => (
              <li
                className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150"
                key={eachCategory._id}
                onClick={() => handleCategoryClick(eachCategory._id)}
              >
                <span className="mr-2">{categoryIcons[eachCategory.name]}</span>
                {eachCategory.name}
              </li>
            ))}
            <li className="border-t border-gray-700 my-4"></li>
            {currentUser?.role == "admin" ? (
              <li
                className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer"
                onClick={handleDashboardClick}
              >
                Dashboard
              </li>
            ) : (
              <></>
            )}
            {/* Login/Logout based on authentication */}
            {currentUser ? (
              <li
                className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer"
                onClick={handleSignOut}
              >
                Logout
              </li>
            ) : (
              <li
                className="flex items-center px-4 py-3 hover:bg-gray-700 cursor-pointer"
                onClick={togglePopup}
              >
                Sign In / Register
              </li>
            )}
          </ul>
        </div>
      )}

      {/* popup for signup and login */}
      {isPopupOpen && <LoginComponent togglePopup={togglePopup} />}
    </>
  );
};

export default HeaderComponent;
