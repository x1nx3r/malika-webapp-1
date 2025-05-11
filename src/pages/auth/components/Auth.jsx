import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../../firebase"; // Keep this import for Google auth

const AuthIndex = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app); // Initialize Firebase auth for Google sign-in

  // Check auth status when component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Updated to use the correct endpoint
        const response = await axios.get("/api/auth");
        if (response.data.isAuthenticated) {
          navigate("/");
        }
      } catch (error) {
        // User is not authenticated, stay on login page
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // Updated to use the single endpoint with action parameter
      const response = await axios.post("/api/auth", {
        email,
        password,
        action: isLogin ? "login" : "register",
      });

      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrorMsg(error.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      // Send the token to our backend
      const response = await axios.post("/api/auth", {
        idToken: token,
        action: "google",
      });

      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setErrorMsg(error.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-lg max-w-lg mx-auto p-8">
      <h2
        className={`text-6xl font-bold mb-6 text-center ${isLogin ? "text-[#03081F]" : "text-orange-500"}`}
      >
        {isLogin ? "Login" : "Daftar"}
      </h2>

      {errorMsg && <p className="text-red-500 mb-4 text-center">{errorMsg}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex flex-col items-center"
      >
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[350px] px-4 py-2 border border-gray-700 shadow text-center text-lg leading-tight rounded-full bg-white text-gray-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition-all duration-200 ease-in"
            placeholder="Email Anda..."
            required
          />
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[350px] px-4 py-2 border border-gray-700 shadow text-center text-lg leading-tight rounded-full bg-white text-gray-800 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500 transition-all duration-200 ease-in"
            placeholder="Password Anda..."
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-1/3 text-white mt-2 mb-6 py-2 text-xl font-light rounded-full transition-all duration-200 ease-in ${
            loading ? "bg-gray-500" : "bg-[#03081B] hover:bg-[#081649]"
          }`}
        >
          {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
        </button>
      </form>

      {/* Only show Google sign-in section when isLogin is true */}
      {isLogin && (
        <>
          <div className="my-2 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-black">Atau Gunakan:</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-2/4 flex items-center justify-center gap-2 bg-white text-gray-800 py-2 rounded-full border border-gray-700 hover:bg-gray-100 transition-all duration-200 ease-in disabled:opacity-50"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google logo"
                className="w-8 h-8"
              />
              Masuk Dengan Google
            </button>
          </div>
        </>
      )}

      <div className="mt-6 mb-2 flex items-center">
        <div className="flex-grow border-t border-2 border-orange-400"></div>
        <p className="mx-4 text-center text-black text-[17px]">
          {isLogin ? "Belum Punya Akun?" : "Sudah Punya Akun?"}{" "}
        </p>
        <div className="flex-grow border-t border-2 border-orange-400"></div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          disabled={loading}
          className="disabled:opacity-50"
        >
          <u className="text-[#03081B] font-bold text-lg text-center">
            {isLogin ? "Daftar" : "Masuk"}
          </u>
        </button>
      </div>
    </div>
  );
};

export default AuthIndex;
