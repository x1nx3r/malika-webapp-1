import Auth from "./components/Auth";

// The AuthIndex component serves as the main container for the authentication page.
// It uses Tailwind CSS for styling and applies custom theme colors defined in the global CSS file.

function AuthIndex() {
  return (
    // Main container with flexbox layout to center content both vertically and horizontally
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Inner container with a fixed width, margin, padding, and background color */}
      <div className="flex flex-col min-w-2xl max-w-2xl items-center m-5 p-5 rounded-sm bg-white">
        {/* Auth component which contains the login form */}
        <Auth />
        {/* Additional container for any extra content or elements */}
      </div>
    </div>
  );
}

export default AuthIndex;
