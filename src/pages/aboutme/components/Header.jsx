import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <header className="bg-green-600 p-4 relative">
      <div className="flex justify-end">
        <button 
          onClick={handleBackToHome}
          className="bg-white text-green-600 px-4 py-2 rounded-md flex items-center text-sm hover:bg-gray-100 transition-colors cursor-pointer"
        >
          ← Kembali Ke Halaman Utama
        </button>
      </div>
    </header>
  );
};

export default Header;
