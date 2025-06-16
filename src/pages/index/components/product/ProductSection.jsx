import ProductCard from "./ProductCard";
import FrozenFoodCard from "./FrozenFoodCard";

function ProductSection({
  title,
  products,
  onAddToCart,
  addingItems,
  showEmptyMessage = false,
}) {
  // Check if no products and should show empty message
  if (products.length === 0 && showEmptyMessage) {
    return (
      <section className="py-8">
        <div className="text-center font-poppins py-46 flex flex-col items-center gap-4">
          <h2 className="text-2xl font-medium text-gray-700 mb-2">{title}</h2>
          <p className="text-gray-600">No products found matching</p>
        </div>
      </section>
    );
  }

  return (
    <section className="my-8 pt-4" id={title.toLowerCase().replace(/\s+/g, "-")}>
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-poppins font-bold mb-4">
        {title}
      </h2>

      <div
        className={`grid gap-6 ${
          title === "Frozen Food & Sambal"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        {products.map((product) => {
          const isLoading = addingItems?.has(product.id);

          return title === "Frozen Food & Sambal" ? (
            <FrozenFoodCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              isLoading={isLoading}
            />
          ) : (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              isLoading={isLoading}
            />
          );
        })}
      </div>
    </section>
  );
}

export default ProductSection;
