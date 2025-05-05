import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// The UserInfo component fetches and displays the user's information if they are logged in.
// It also provides login and logout functionality.
const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user information on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/api/auth");
        if (response.status === 200 && response.data.isAuthenticated) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error(
          "Error fetching user info:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/logout");
      if (response.status === 200) {
        // Clear user state and navigate to the login page
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    }
  };

  if (loading) {
    return <p className="text-macchiato-text">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="text-macchiato-text">
        <p>Not logged in</p>
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          onClick={() => navigate("/auth")}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-macchiato-surface1 p-4 rounded-md shadow-md mb-4">
      <h2 className="text-xl text-macchiato-text mb-2">User Info</h2>
      <p className="text-macchiato-text">Email: {user.email}</p>
      <p className="text-macchiato-text">UID: {user.uid}</p>
      <button
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default UserInfo;
