import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "./components/Auth";
import { auth } from "../../firebase";

function AuthIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/"); // Redirect ke halaman utama jika sudah login
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col min-w-2xl max-w-2xl items-center m-5 p-5 rounded-sm bg-white">
        <Auth onLoginSuccess={() => navigate("/")} />
      </div>
    </div>
  );
}

export default AuthIndex;