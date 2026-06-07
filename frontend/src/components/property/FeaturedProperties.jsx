import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import PropertyCard from "./PropertyCard";
import { motion } from "framer-motion";

const DEMO_PROPERTIES = [
  {
    id: "demo1",
    title: "Luxury Beach Villa",
    location: "Miami, FL",
    price: 850000,
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    status: "for-sale",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    ],
  },
  {
    id: "demo2",
    title: "Modern Penthouse",
    location: "New York, NY",
    price: 1200000,
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    status: "for-sale",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    ],
  },
  {
    id: "demo3",
    title: "Skyline Apartment",
    location: "Dubai, UAE",
    price: 920000,
    bedrooms: 3,
    bathrooms: 2,
    area: 2100,
    status: "for-rent",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    ],
  },
  {
    id: "demo4",
    title: "Mountain Retreat",
    location: "Aspen, CO",
    price: 2500000,
    bedrooms: 6,
    bathrooms: 5,
    area: 6000,
    status: "for-sale",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80",
    ],
  },
  {
    id: "demo5",
    title: "Seaside Cottage",
    location: "Malibu, CA",
    price: 3100000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    status: "for-sale",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
  },
  {
    id: "demo6",
    title: "Urban Loft",
    location: "Chicago, IL",
    price: 480000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    status: "for-rent",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80",
    ],
  },
];

function FeaturedProperties() {
  const [properties, setProperties] = useState(DEMO_PROPERTIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get("/properties/featured");
        if (data.properties?.length > 0) {
          setProperties(data.properties);
        }
      } catch {
        // keep demo data on error
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="container-custom py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-12 flex-wrap gap-6"
      >
        <div>
          <p className="text-yellow-400 font-semibold tracking-widest uppercase text-sm mb-3">
            Premium Listings
          </p>
          <h2 className="text-5xl font-bold">
            Featured{" "}
            <span className="gold-text">Properties</span>
          </h2>
          <p className="text-slate-400 mt-3 max-w-xl">
            Hand-picked premium listings curated for discerning buyers who demand the very best.
          </p>
        </div>

        <Link
          to="/properties"
          className="glass gold-border px-8 py-3 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition-all duration-300"
        >
          View All →
        </Link>
      </motion.div>

      {loading ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton rounded-3xl h-96" />
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {properties.map((property, i) => (
            <PropertyCard
              key={property._id || property.id}
              property={property}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedProperties;