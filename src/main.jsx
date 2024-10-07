import { createRoot } from "react-dom/client"; // Import the createRoot function for renderin
import App from "./App.jsx"; // Import the main App component
import "./index.css"; // Import global styles
import { Provider } from "react-redux"; // Import Provider for Redux state management
import store from "./App/Store.js"; // Import the Redux store

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {" "}
    {/* Provide the Redux store to the App */}
    <App />
  </Provider>
);
