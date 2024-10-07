import { useState } from "react";

import { useDispatch } from "react-redux"; // Redux hook for dispatching actions
import { setUser } from "../../Redux/Authentication/usersSlice.js"; // Redux action for setting the user
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { fetchCart } from "../../Redux/features/cartSlice.js"; // Import the fetchCart thunk

function LoginComponent({ togglePopup }) {
  // State to track loading status, login/signup type, user credentials, and error messages
  const [isLoading, setIsLoading] = useState(true);
  const [loginType, setLoginType] = useState("login"); // Switch between login and signup modes
  const [userCredentials, setUserCredentials] = useState({}); // Store user input for email and password
  const [error, setError] = useState(""); // Store any error messages

  const dispatch = useDispatch(); // Redux dispatch function
  // const token = Cookies.get("Job") || null; // Retrieve token from cookies

  function handleCredentials(e) {
    setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
    console.log(userCredentials);
  }

  // Function to handle user signup
  function handleSignup(e) {
    e.preventDefault();
    console.log("signup");
    setError("");

    const signupUser = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URI}/api/user/register`,
          {
            email: userCredentials.email,
            password: userCredentials.password,
            name: userCredentials.name,
          }
        );
        console.log("response.status", response.status);
        if (response.status == 201) {
          const loginUser = async () => {
            try {
              const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URI}/api/user/login`,
                {
                  email: userCredentials.email,
                  password: userCredentials.password,
                }
              );

              Cookies.set("Job", response.data.token, {
                expires: 7,
                path: "/",
                secure: true,
              });
              console.log("LoginCompomentLoginuserToken", response.data.token);
              const token = Cookies.get("Job") || null;

              const initializecart = await axios.post(
                `${
                  import.meta.env.VITE_BACKEND_URI
                }/api/cart/initializeemptycart`,
                {}, // An empty object since there is no data to send in the body
                {
                  headers: { Authorization: `Bearer ${token}` }, // Headers should be the third argument
                }
              );

              await axios
                .get(`${import.meta.env.VITE_BACKEND_URI}/api/user/me`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                  console.log("user", response.data.user);
                  dispatch(
                    setUser({
                      name: response.data.user.name,
                      role: response.data.user.role,
                    })
                  );

                  // Fetch and initialize the cart after login/signup
                  dispatch(fetchCart());
                })
                .catch((error) => {
                  console.error("Error fetching user data:", error);
                  // Clear token if invalid
                  Cookies.remove("Job");
                });
              console.log("..", response.data);
              toast.success("USer logged in successfully");
            } catch (error) {
              console.log("error in logging in user", error);
              toast.error("Invalid credentials", error);
            }
          };
          loginUser();
        }
      } catch (error) {
        console.log("error in logging in user", error);
        toast.error("Invalid credentials", error);
      }
    };
    signupUser();

    togglePopup(); // Close the login/signup popup after signup
  }

  // Function to handle user login
  function handleLogin(e) {
    e.preventDefault();
    //console.log("login");
    setError("");

    const loginUser = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URI}/api/user/login`,
          {
            email: userCredentials.email,
            password: userCredentials.password,
          }
        );
        Cookies.set("Job", response.data.token, {
          expires: 7,
          path: "/",
          secure: true,
        });

        axios
          .get(`${import.meta.env.VITE_BACKEND_URI}/api/user/me`, {
            headers: { Authorization: `Bearer ${response.data.token}` },
          })
          .then((response) => {
            console.log("user", response.data.user);
            dispatch(
              setUser({
                name: response.data.user.name,
                role: response.data.user.role,
              })
            );
            // Fetch and initialize cart after successful login
            dispatch(fetchCart(response.data.token));
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            // Clear token if invalid
            Cookies.remove("Job");
          });
        console.log("..", response.data);
        toast.success("USer logged in successfully");
      } catch (error) {
        console.log("error in logging in user", error);
        toast.error("Invalid credentials", error);
      }
    };
    loginUser();
    togglePopup(); // Close the popup after login
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white  rounded shadow-lg">
        <div className="flex items-center justify-center  ">
          {/* Show loading spinner until authentication state is resolved */}
          {/* {isLoading ? (
            <div>Loading...</div>
          ) : ( */}
          <div className="container login-page w-full max-w-md p-8 space-y-8 bg-white  rounded-lg">
            <section>
              <div className="flex  justify-end">
                {/* Button to close the login/signup popup */}
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded flex items-end "
                  onClick={
                    // Handle sign in or join actions
                    togglePopup
                  }
                >
                  X
                </button>
              </div>

              <h1 className="text-3xl font-bold text-center">
                Welcome to AliExpress
              </h1>
              <p className="text-center">
                Login or create an account to continue
              </p>
              <div className="login-type flex justify-center space-x-4 mb-4">
                {/* Button to toggle between login and signup modes */}
                <button
                  className={`btn px-4 py-2 font-bold  rounded ${
                    loginType == "login" ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onClick={() => setLoginType("login")}
                >
                  Login
                </button>
                <button
                  className={`btn btn px-4 py-2 font-bold  rounded ${
                    loginType == "signup" ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onClick={() => setLoginType("signup")}
                >
                  Signup
                </button>
              </div>
              <form className="add-form login space-y-4">
                {/* Email input field */}
                <div className="form-control ">
                  <label className="block text-sm font-medium">Email *</label>
                  <input
                    onChange={(e) => {
                      handleCredentials(e);
                    }}
                    type="text"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </div>
                {/* Password input field */}
                <div className="form-control">
                  <label className="block text-sm font-medium">
                    Password *
                  </label>
                  <input
                    onChange={(e) => {
                      handleCredentials(e);
                    }}
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                  />
                </div>

                {loginType === "signup" && (
                  <div className="form-control">
                    <label className="block text-sm font-medium">name</label>
                    <input
                      onChange={(e) => {
                        handleCredentials(e);
                      }}
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>
                )}

                {/* Conditional rendering of login or signup button based on the selected mode */}
                {loginType == "login" ? (
                  <button
                    onClick={(e) => {
                      handleLogin(e);
                    }}
                    className="active btn btn-block  w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                  >
                    Login
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      handleSignup(e);
                    }}
                    className="active btn btn-block w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                  >
                    Sign Up
                  </button>
                )}

                {/* Display error message if one exists */}
                {error && (
                  <div className="error text-red-500 text-sm">{error}</div>
                )}
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
