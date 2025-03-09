import Header from "../../components/Header";
import UserInfo from "./components/UserInfo";
import { useNavigate } from "react-router-dom";

// The Index component serves as the main container for the home page.
// It uses Tailwind CSS for styling and applies custom theme colors defined in the global CSS file.

function Index() {
  const navigate = useNavigate(); // Hook to programmatically navigate to different routes

  return (
    // Main container with flexbox layout to center content both vertically and horizontally
    <div className="flex flex-col items-center justify-center min-h-screen bg-macchiato-base">
      {/* Inner container with a fixed width, margin, padding, and background color */}
      <div className="flex flex-col min-w-4xl max-w-4xl items-center m-5 p-5 rounded-sm bg-macchiato-crust">
        {/* Header component */}
        <Header />
        {/* UserInfo component to display user information */}
        <UserInfo />
        {/* Additional container for any extra content or elements */}
        <div className="text-xl max-w-4xl min-w-3xl w-full flex flex-row justify-between items-start"></div>
      </div>
    </div>
  );
}

export default Index;
