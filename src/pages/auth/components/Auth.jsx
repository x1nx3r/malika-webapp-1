import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../../../firebase";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const action = isLogin ? "login" : "register";
      const response = await axios.post("/api/auth", {
        email,
        password,
        action,
      });
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error(
        `${isLogin ? "Login" : "Registration"} error:`,
        error.response?.data || error.message,
      );
      setErrorMsg(
        error.response?.data?.error ||
          `${isLogin ? "Login" : "Registration"} failed. Please check your credentials.`,
      );
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      const response = await axios.post("/api/auth", {
        idToken,
        action: "google",
      });
      
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      setErrorMsg("Failed to sign in with Google");
    }
  };

  return (
    <div className="min-w-lg max-w-lg mx-auto p-8">
      <h2
        className={`text-6xl font-bold mb-6 text-center ${
          isLogin ? "text-[#03081F]" : "text-orange-500"
        }`}
      >
        {isLogin ? "Login" : "Daftar"}
      </h2>
      
      {errorMsg && <p className="text-red-500 mb-4 text-center">{errorMsg}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center">
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
          />
        </div>
        
        <button
          type="submit"
          className="w-1/3 bg-[#03081B] text-white mt-2 mb-6 py-2 text-xl font-light rounded-full hover:bg-[#081649] transition-all duration-200 ease-in"
        >
          {isLogin ? "Masuk" : "Daftar"}
        </button>
      </form>
      
      <div className="my-2 flex items-center">
        <div className="flex-grow"></div>
        <span className="mx-4 text-black">Atau Gunakan:</span>
        <div className="flex-grow"></div>
      </div>
      
      <div className="flex items-center justify-center">
        <button
          onClick={handleGoogleSignIn}
          className="w-2/4 flex items-center justify-center gap-2 bg-white text-gray-800 py-2 rounded-full border border-gray-700 hover:bg-gray-100 transition-all duration-200 ease-in"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google logo" 
            className="w-8 h-8"
          />
          Masuk Dengan Google
        </button>
      </div>
      
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
        >
          <u className="text-[#03081B] font-bold text-lg text-center">{isLogin ? "Daftar" : "Masuk"}</u>
        </button>
      </div>
    </div>
  );
};

export default Auth;