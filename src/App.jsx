import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import HomeComponent from "./Components/HomeComponent/HomeComponent";
import HeaderComponent from "./Components/HeaderComponent/HeaderComponent";
import FooterComponent from "./Components/FooterComponent/FooterComponent";
import SearchComponent from "./Components/SearchComponent/SearchComponent";
import DashboardComponent from "./Components/DashboardComponent/DashboardComponent";
import ProductDetailComponent from "./Components/ProductDetailComponent/ProductDetailComponent";
import Cookies from "js-cookie";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { setUser, selectUsers } from "./Redux/Authentication/usersSlice";

import CartComponent from "./Components/CartComponent/CartComponent";
import toast, { Toaster } from "react-hot-toast";
import ListProducts from "./Components/ListProducts/ListProducts";
import { fetchCart } from "./Redux/features/cartSlice";

function App() {
  const dispatch = useDispatch(); // Get the dispatch function from Redux
  // const user = useSelector(selectUsers); // Select the current user from Redux state

  // Fetching the current user from the Redux store
  const { currentUser } = useSelector(selectUsers);

  const [loading, setLoading] = useState(true); // Add loading state
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
          // Fetch and initialize cart after successful login
          dispatch(fetchCart());
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          Cookies.remove("Job");
        })
        .finally(() => {
          setLoading(false); // Set loading to false after user data is fetched
        });
    } else {
      setLoading(false); // Set loading to false if there is no token
    }
  }, [token, currentUser, dispatch]);

  if (loading) {
    // Render a loading indicator while fetching user data
    return <div>Loading...</div>;
  }

  return (
    <>
      <BrowserRouter>
        <HeaderComponent />
        {currentUser ? (
          <>
            {" "}
            <Routes>
              {/* Home route */}
              <Route path="/" element={<HomeComponent />} />
              {/* Cart route */}
              <Route path="/Cart" element={<CartComponent />} />{" "}
              {/* Search route */}
              <Route path="/search" element={<SearchComponent />} />{" "}
              {/* Product lists by category */}
              <Route
                path="/list/:categoryid"
                element={
                  <ListProducts
                    ProductType="men's clothing"
                    RelativePath="mens"
                  />
                }
              />
              {/* Product detail route */}
              <Route
                path="/product/:productid"
                element={<ProductDetailComponent />}
              />
              <Route path="/admindashboard" element={<DashboardComponent />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Toaster /> {/* Toast notifications */}
          </>
        ) : (
          <>
            {" "}
            <Routes>
              {/* Home route */}
              <Route path="/" element={<HomeComponent />} />
              {/* search route */}
              <Route path="/search" element={<SearchComponent />} />
              {/* Product lists by category */}
              <Route
                path="/list/:categoryid"
                element={
                  <ListProducts
                    ProductType="men's clothing"
                    RelativePath="mens"
                  />
                }
              />
              {/* product details route */}
              <Route
                path="/product/:productid"
                element={<ProductDetailComponent />}
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            {/* Toast notifications */}
            <Toaster />
          </>
        )}
        {/* Render footer */}
        <FooterComponent />
      </BrowserRouter>
    </>
  );
}

export default App;
