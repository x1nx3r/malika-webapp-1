/**
 * This component handles user authentication (login and registration) for the web application.
 * It provides a form for users to enter their email and password, and handles
 * the login and registration processes by sending requests to the backend API.
 *
 * The component uses Tailwind CSS for styling and applies custom theme colors
 * and fonts defined in the global CSS file.
 */

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  // State variables to store email, password, error message, and mode (login/register)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Function to handle form submission for login or registration
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setErrorMsg(""); // Clear any previous error messages
    try {
      // Determine the action based on the current mode (login or register)
      const action = isLogin ? "login" : "register";
      // Send a POST request to the backend API with email, password, and action
      const response = await axios.post("/api/auth", {
        email,
        password,
        action,
      });
      if (response.status === 200) {
        // If login or registration is successful, navigate to the home page
        navigate("/");
      }
    } catch (error) {
      // If login or registration fails, log the error and set an error message
      console.error(
        `${isLogin ? "Login" : "Registration"} error:`,
        error.response?.data || error.message,
      );
      setErrorMsg(
        `${isLogin ? "Login" : "Registration"} failed. Please check your credentials.`,
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-macchiato-mantle rounded-md shadow-md">
      <h2 className="text-2xl mb-4 text-macchiato-text">
        {isLogin ? "Login" : "Register"}
      </h2>
      {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-macchiato-text">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-macchiato-surface2 rounded-md bg-macchiato-base text-macchiato-text"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-macchiato-text">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-macchiato-surface2 rounded-md bg-macchiato-base text-macchiato-text"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <p className="mt-4 text-macchiato-text">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          className="text-blue-500 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
};

export default Auth;
