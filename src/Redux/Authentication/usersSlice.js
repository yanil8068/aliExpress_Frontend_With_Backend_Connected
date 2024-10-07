import { createSlice } from "@reduxjs/toolkit";

// Creating a slice for user-related state management using Redux Toolkit.
// A slice consists of a reducer and actions for a specific part of the app's state.
// In this case, it's for handling the user state (current user).

export const usersSlice = createSlice({
  name: "users", // Name of the slice, which will be used as a key in the global store.
  initialState: {
    currentUser: null, // Initial state where `currentUser` is set to null, meaning no user is logged in.
  },

  reducers: {
    // Reducer for setting the user state when a user logs in or signs up.
    setUser: (users, action) => {
      users.currentUser = action.payload; // Setting `currentUser` to the payload of the action, which contains the user's data.
    },
  },
});

// Exporting the `setUser` action so it can be used to update the user state from components.
export const { setUser } = usersSlice.actions;

// Selector to retrieve the current user state from the Redux store.
export const selectUsers = (state) => state.users;

// Exporting the reducer, which will be added to the Redux store.
export default usersSlice.reducer;
