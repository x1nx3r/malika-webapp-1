/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

function CategoryButton({ name, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(name)}
      className={`
        flex-shrink-0 rounded-full px-4 sm:px-6 py-2 sm:py-3 
        transition-all duration-300 transform hover:scale-105
        ${
          isActive
            ? 'bg-white text-[#FC8A06] shadow-lg font-bold'
            : 'text-[#F0F0F0] hover:bg-white/20 font-semibold'
        }
        text-sm sm:text-base md:text-lg whitespace-nowrap
      `}
    >
      {name}
    </button>
  );
}

function CategoryNav({ onCategoryClick, activeCategory: externalActiveCategory }) {
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
    <div className="w-full px-4 sm:px-6 lg:px-8 my-4 overflow-x-auto custom-scrollbar">
      <div className="container mx-auto flex justify-center">
        <div className="min-w-max bg-gradient-to-r from-[#FC8A06] to-[#FF6B35] rounded-[2rem] sm:rounded-[3.69rem] flex items-center px-6 py-4 sm:px-8 sm:h-[5rem] space-x-3 sm:space-x-4 md:space-x-6 shadow-lg">
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
          background: #FC8A06;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

export default CategoryNav;
