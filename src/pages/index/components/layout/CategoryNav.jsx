import { useState, useEffect } from "react";

function CategoryButton({ name, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(name)}
      className={`
        flex-shrink-0 rounded-full px-14 py-1
        transition-all duration-200 hover:scale-[1.02]
        ${
          isActive
            ? "bg-black text-white font-bold"
            : "text-white hover:bg-white/10 font-bold"
        }
        font-poppins whitespace-nowrap mx-1
      `}
    >
      {name}
    </button>
  );
}

function CategoryNav({
  onCategoryClick,
  activeCategory: externalActiveCategory,
}) {
  const [localActiveCategory, setLocalActiveCategory] = useState("Rekomendasi");

  // Sync local state with external state if provided
  useEffect(() => {
    if (externalActiveCategory) {
      setLocalActiveCategory(externalActiveCategory);
    }
  }, [externalActiveCategory]);

  const categories = [
    { name: "Rekomendasi" },
    { name: "Paket Porsian" },
    { name: "Paket Family" },
    { name: "Paket Hampers" },
    { name: "Frozen Food & Sambal" },
  ];

  const handleCategoryClick = (categoryName) => {
    setLocalActiveCategory(categoryName);
    if (onCategoryClick) {
      onCategoryClick(categoryName);
    }
  };

  return (
    <div className="w-full py-2 overflow-x-auto no-scrollbar">
      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-[#FC8A06] to-[#FF6B35] rounded-full flex items-center py-2 px-4 h-12">
          {categories.map((category, index) => (
            <CategoryButton
              key={index}
              name={category.name}
              isActive={localActiveCategory === category.name}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          height: 3px;
        }
        .no-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .no-scrollbar::-webkit-scrollbar-thumb {
          background: #fc8a06;
          border-radius: 10px;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: thin;
        }
      `}</style>
    </div>
  );
}

export default CategoryNav;
