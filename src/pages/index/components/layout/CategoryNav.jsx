/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

function CategoryButton({ name, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(name)}
      className={`
        flex-shrink-0 rounded-full px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 
        transition-all duration-300 transform hover:scale-105
        ${
          isActive
            ? 'bg-black text-white shadow-lg font-bold'
            : 'text-white hover:bg-white/20 font-medium'
        }
        text-sm sm:text-base whitespace-nowrap
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
  const [localActiveCategory, setLocalActiveCategory] = useState('Rekomendasi');

  // Sync local state with external state if provided
  useEffect(() => {
    if (externalActiveCategory) {
      setLocalActiveCategory(externalActiveCategory);
    }
  }, [externalActiveCategory]);

  const categories = [
    { name: 'Rekomendasi' },
    { name: 'Paket Porsian' },
    { name: 'Paket Family' },
    { name: 'Paket Hampers' },
    { name: 'Frozen Food & Sambal' },
  ];

  const handleCategoryClick = (categoryName) => {
    setLocalActiveCategory(categoryName);
    if (onCategoryClick) {
      onCategoryClick(categoryName);
    } 
  };

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 my-1 overflow-x-auto custom-scrollbar">
      <div className="container mx-auto flex justify-center">
        <div className="w-full max-w-6xl bg-gradient-to-r from-[#FC8A06] to-[#FF6B35] rounded-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-3.5 h-[3rem] sm:h-[3.5rem] space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 shadow-lg">
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
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fc8a06;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

export default CategoryNav;
