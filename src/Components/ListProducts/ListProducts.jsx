// import { Header } from "../../Components/Header/Header";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function ListProducts({ ProductType, RelativePath }) {
  const { categoryid } = useParams();
  // console.log("id___", categoryid);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [originalProducts, setOriginalProducts] = useState([]); // To keep track of unfiltered products

  const [isFilterByPrice, setIsFilterByPrice] = useState(false);
  const [isFilterByPriceAscending, setIsFilterByPriceAscending] =
    useState(false);
  const [isFilterByBelow50, setIsFilterByBelow50] = useState(false);
  const [isFilterByAbove50, setIsFilterByAbove50] = useState(false);

  const [isPriceAccordionOpen, setIsPriceAccordionOpen] = useState(false);

  useEffect(() => {
    // Fetch product details using the id
    if (categoryid) {
      getProducts(categoryid);
    }
  }, [categoryid]);

  useEffect(() => {
    getProducts(categoryid);
  }, []);

  useEffect(() => {
    getProducts(categoryid);
  }, [ProductType]);

  async function getProducts(categoryid) {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URI
        }/api/product/details/category/${categoryid}`
      );
      const data = await response.json();
      console.log("data", data);
      setProducts(data);
      setOriginalProducts(data); // Store the original product list for reset
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false); // Stop loading once products are fetched
    }
  }

  // Update products when any filter state changes
  useEffect(() => {
    let filteredProducts = [...originalProducts];

    // Apply price descending filter if checked
    if (isFilterByPrice) {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Apply price ascending filter if checked
    if (isFilterByPriceAscending) {
      filteredProducts.sort((a, b) => a.price - b.price);
    }

    // Filter products by price below 15
    if (isFilterByBelow50) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price < 15
      );
    }

    // Filter products by price above 15
    if (isFilterByAbove50) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price > 15
      );
    }

    setProducts(filteredProducts);
  }, [
    isFilterByPrice,
    isFilterByPriceAscending,
    isFilterByBelow50,
    isFilterByAbove50,

    originalProducts,
  ]);

  // Handlers for checkbox changes

  const handlePriceFilterChange = (e) => setIsFilterByPrice(e.target.checked);
  const handlePriceFilterChangeAscending = (e) =>
    setIsFilterByPriceAscending(e.target.checked);
  const handleBelow50FilterChange = (e) =>
    setIsFilterByBelow50(e.target.checked);
  const handleAbove50FilterChange = (e) =>
    setIsFilterByAbove50(e.target.checked);

  const togglePriceAccordion = () =>
    setIsPriceAccordionOpen(!isPriceAccordionOpen);

  return (
    <div className="bg-gray-300">
      {/* <Header /> */}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p>Loading...</p>
          {/* You can replace this with a spinner if you want */}
        </div>
      ) : (
        <div className="lg:flex lg:justify-evenly xl:flex xl:justify-evenly 2xl:flex 2xl:justify-evenly ">
          <div className="AllFiltersSmallScreen block lg:hidden   border-black border-2 ">
            <div className="flex justify-evenly  items-center text-xs">
              <span className="flex items-center text-xs font-semibold">
                Price:{" "}
              </span>

              <div className="flex items-center my-2 bg-white p-1 rounded-lg">
                <input
                  type="checkbox"
                  id="filterByPriceAscending"
                  checked={isFilterByPriceAscending}
                  onChange={handlePriceFilterChangeAscending}
                  className="mr-2"
                />
                <label
                  htmlFor="filterByPriceAscending"
                  className="text-gray-700"
                >
                  Low to high
                </label>
              </div>
              <div className="flex items-center my-2 bg-white p-1 rounded-lg">
                <input
                  type="checkbox"
                  id="filterByBelow50"
                  checked={isFilterByBelow50}
                  onChange={handleBelow50FilterChange}
                  className="mr-2"
                />
                <label htmlFor="filterByBelow50" className="text-gray-700">
                  Below $15
                </label>
              </div>
              <div className="flex items-center my-2 bg-white p-1 rounded-lg">
                <input
                  type="checkbox"
                  id="filterByAbove50"
                  checked={isFilterByAbove50}
                  onChange={handleAbove50FilterChange}
                  className="mr-2"
                />
                <label htmlFor="filterByAbove50" className="text-gray-700">
                  Above $15
                </label>
              </div>
            </div>
          </div>
          <div className="Allfilters md:ml-3 hidden lg:block ">
            <h2 className="font-bold text-xl">Refine by</h2>

            {/* Price Accordion */}
            <div className="w-80 md:w-60 lg:w-56 2xl:w-72 overflow-hidden border border-gray-300 rounded-md mt-4">
              <button
                className="w-full text-left px-4 py-2 font-semibold bg-gray-200 border-b border-gray-300"
                onClick={togglePriceAccordion}
              >
                Price
              </button>
              {isPriceAccordionOpen && (
                <div className="px-4 py-2 bg-white">
                  <div className="flex items-center my-4">
                    <input
                      type="checkbox"
                      id="filterByPrice"
                      checked={isFilterByPrice}
                      onChange={handlePriceFilterChange}
                      className="mr-2"
                    />
                    <label htmlFor="filterByPrice" className="text-gray-700">
                      High to low
                    </label>
                  </div>
                  <div className="flex items-center my-4">
                    <input
                      type="checkbox"
                      id="filterByPriceAscending"
                      checked={isFilterByPriceAscending}
                      onChange={handlePriceFilterChangeAscending}
                      className="mr-2"
                    />
                    <label
                      htmlFor="filterByPriceAscending"
                      className="text-gray-700"
                    >
                      Low to high
                    </label>
                  </div>
                  <div className="flex items-center my-4">
                    <input
                      type="checkbox"
                      id="filterByBelow50"
                      checked={isFilterByBelow50}
                      onChange={handleBelow50FilterChange}
                      className="mr-2"
                    />
                    <label htmlFor="filterByBelow50" className="text-gray-700">
                      Below $15
                    </label>
                  </div>
                  <div className="flex items-center my-4">
                    <input
                      type="checkbox"
                      id="filterByAbove50"
                      checked={isFilterByAbove50}
                      onChange={handleAbove50FilterChange}
                      className="mr-2"
                    />
                    <label htmlFor="filterByAbove50" className="text-gray-700">
                      Above $15
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Display products bigscreen */}
          <div className="flex justify-center ">
            <div className="grid  grid-cols-3 gap-4 sm:grid-cols-3 gap:3 md:gap-4 p-4">
              {products.map((d) => (
                <div
                  key={d._id}
                  className=" rounded-lg shadow-md overflow-hidden bg-white p-1 md:p-3 w-28 md:w-64 lg:w-80 h-64 md:h-auto lg:h-[500px]"
                >
                  <Link to={`/product/${d._id}`}>
                    <img
                      src={d.image.url}
                      alt={d.title}
                      className="w-36 h-40 md:w-80 md:h-96 object-cover rounded-sm"
                    />
                    <p className="text-xs font-semibold text-center">
                      {d.title}
                    </p>
                    <div className="flex justify-center items-center ">
                      <div className="flex items-center justify-center bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded my-2 w-fit">
                        <span className="text-xs">{d.title}</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-center text-xs">
                      ${d.price}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
