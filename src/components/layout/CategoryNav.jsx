function CategoryNav() {
  const categories = [
    { name: "Rekomendasi", isActive: true },
    { name: "Paket Porsian", isActive: false },
    { name: "Paket Family", isActive: false },
    { name: "Paket Hampers", isActive: false },
    { name: "Frozen Food & Sambal", isActive: false },
  ];

  return (
    <nav className="w-full px-4 sm:px-6 lg:px-8 py-1 fixed top-10 left-0 right-0 z-20 bg-white shadow-sm">
      <div className="container mx-auto flex justify-center">
        <div className="min-w-max bg-[#FC8A06] rounded-2xl flex items-center px-2 py-1 space-x-1 sm:space-x-2 overflow-x-auto">
          {categories.map((category, index) => (
            <CategoryButton
              key={index}
              name={category.name}
              isActive={category.isActive}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

function CategoryButton({ name, isActive }) {
  return (
    <div
      className={`flex-shrink-0 ${
        isActive ? "bg-[#03081F]" : ""
      } rounded-full px-3 py-0.5 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity`}
    >
      <div className="text-center text-[#F0F0F0] text-xs font-medium whitespace-nowrap">
        {name}
      </div>
    </div>
  );
}

export default CategoryNav;