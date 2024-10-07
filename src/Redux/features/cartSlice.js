// //////////////////////////////////////////////////////////////////////////////
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// Fetch cart data thunk
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const token = Cookies.get("Job");
  if (!token) {
    return response.send("No token available");
  }
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URI}/api/cart`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("responseinCartera", response.data);
  if (response.status === 404) {
    return {};
  }
  console.log("response.data.items", response.data);
  return response.data.items; // Return the cart data
});

const initialState = {
  carts: [], // Initially empty cart
  status: "idle", // Track the loading status
  error: null, // Track errors
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.carts.findIndex(
        (item) => item._id === action.payload._id
      );
      if (itemIndex >= 0) {
        state.carts[itemIndex].quantity += 1;
      } else {
        const temp = { ...action.payload, quantity: 1 };
        state.carts.push(temp);
      }
    },

    emptycartIteam: (state, action) => {
      state.carts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.carts = action.payload; // Initialize the cart with fetched data
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  emptycartIteam,
  removeSingleIteams,
  removeToCart,
} = cartSlice.actions;
export default cartSlice.reducer;
