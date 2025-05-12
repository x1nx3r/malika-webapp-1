import ProductCard from "./ProductCard";
import FrozenFoodCard from "./FrozenFoodCard";

function ProductSection({ title, isFrozenFood = false, products }) {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 md:mt-16">
      <div className="container mx-auto">
        <h2 className="text-[#0E0E0E] text-xl sm:text-3xl md:text-[2.75rem] font-bold font-['Poppins'] mb-4 sm:mb-6 md:mb-8">
          {title}
        </h2>

        <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 justify-center sm:justify-start">
          {products.map((product) =>
            isFrozenFood ? (
              <FrozenFoodCard key={product.id} product={product} />
            ) : (
              <ProductCard key={product.id} product={product} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default ProductSection;
