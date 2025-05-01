function CategoryNav() {
  const categories = [
    { name: "Rekomendasi", isActive: true },
    { name: "Paket Porsian", isActive: false },
    { name: "Paket Family", isActive: false },
    { name: "Paket Hampers", isActive: false },
    { name: "Frozen Food & Sambal", isActive: false },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 my-2 sm:my-4 overflow-x-auto">
      <div className="container mx-auto flex justify-center">
        <div className="min-w-max bg-[#FC8A06] rounded-[2rem] sm:rounded-[3.69rem] flex items-center px-4 py-3 sm:px-8 sm:h-[5rem] space-x-3 sm:space-x-4 md:space-x-6 lg:justify-between">
          {categories.map((category, index) => (
            <CategoryButton
              key={index}
              name={category.name}
              isActive={category.isActive}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryButton({ name, isActive }) {
  return (
    <div
      className={`flex-shrink-0 ${isActive ? "bg-[#03081F]" : ""} rounded-full px-4 sm:px-6 py-2 sm:py-3 sm:w-auto md:w-[18.5rem] sm:h-[2.5rem] flex items-center justify-center`}
    >
      <div className="text-center text-[#F0F0F0] text-sm sm:text-base md:text-[1.375rem] font-bold font-['Poppins'] whitespace-nowrap">
        {name}
      </div>
    </div>
  );
}

export default CategoryNav;
