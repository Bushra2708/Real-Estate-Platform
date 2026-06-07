import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import PropertyCard from "../components/property/PropertyCard";
import api from "../services/api";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaFilter,
  FaSlidersH,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    type: searchParams.get("type") || "",
    status: searchParams.get("status") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedrooms: searchParams.get("bedrooms") || "",
    sort: searchParams.get("sort") || "newest",
    page: Number(searchParams.get("page")) || 1,
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.set(k, v);
      });
      const { data } = await api.get(`/properties?${params.toString()}`);
      setProperties(data.properties);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePage = (p) => {
    setFilters((prev) => ({ ...prev, page: p }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputClass =
    "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 transition w-full";

  return (
    <Layout>
      <div className="container-custom py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-yellow-400 font-semibold tracking-widest uppercase text-sm mb-2">
            Browse Listings
          </p>
          <h1 className="text-5xl font-bold">
            All <span className="gold-text">Properties</span>
          </h1>
          <p className="text-slate-400 mt-2">
            {total} properties found
          </p>
        </motion.div>

        {/* Filters bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 mb-10"
        >
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative lg:col-span-2">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilter("search", e.target.value)}
                placeholder="Search location or title..."
                className={`${inputClass} pl-10`}
              />
            </div>

            {/* Type */}
            <select
              value={filters.type}
              onChange={(e) => handleFilter("type", e.target.value)}
              className={inputClass}
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="penthouse">Penthouse</option>
              <option value="beach-house">Beach House</option>
              <option value="commercial">Commercial</option>
              <option value="farmhouse">Farm House</option>
            </select>

            {/* Status */}
            <select
              value={filters.status}
              onChange={(e) => handleFilter("status", e.target.value)}
              className={inputClass}
            >
              <option value="">For Sale & Rent</option>
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
            </select>

            {/* Bedrooms */}
            <select
              value={filters.bedrooms}
              onChange={(e) => handleFilter("bedrooms", e.target.value)}
              className={inputClass}
            >
              <option value="">Any Beds</option>
              <option value="1">1+ Bed</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5">5+ Beds</option>
            </select>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => handleFilter("sort", e.target.value)}
              className={inputClass}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Price range */}
          <div className="grid sm:grid-cols-2 gap-4 mt-4 max-w-sm">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilter("minPrice", e.target.value)}
              placeholder="Min Price ($)"
              className={inputClass}
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilter("maxPrice", e.target.value)}
              placeholder="Max Price ($)"
              className={inputClass}
            />
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton rounded-3xl h-96" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="glass rounded-3xl p-20 text-center">
            <FaFilter className="text-6xl text-slate-600 mx-auto mb-5" />
            <h3 className="text-2xl font-bold mb-2">No properties found</h3>
            <p className="text-slate-400">
              Try adjusting your search filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
              {properties.map((property, i) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  index={i}
                />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-14">
                <button
                  onClick={() => handlePage(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="glass p-3 rounded-xl hover:text-yellow-400 transition disabled:opacity-30"
                >
                  <FaChevronLeft />
                </button>

                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePage(p)}
                    className={`w-11 h-11 rounded-xl font-semibold transition ${
                      p === filters.page
                        ? "gold-gradient text-black"
                        : "glass hover:text-yellow-400"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePage(filters.page + 1)}
                  disabled={filters.page === pages}
                  className="glass p-3 rounded-xl hover:text-yellow-400 transition disabled:opacity-30"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Properties;
