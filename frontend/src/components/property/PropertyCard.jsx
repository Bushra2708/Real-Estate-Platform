import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaHeart,
} from "react-icons/fa";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80";

// ── helpers for localStorage likes ──────────────────────────────
const getLikedIds = () => {
  try {
    return JSON.parse(localStorage.getItem("liked_properties") || "[]");
  } catch {
    return [];
  }
};

const saveLikedIds = (ids) => {
  localStorage.setItem("liked_properties", JSON.stringify(ids));
};

function PropertyCard({ property, index = 0 }) {
  const propertyId = property._id || property.id;
  const image = property.images?.[0] || property.image || FALLBACK_IMAGE;

  const statusLabel = property.status === "for-rent" ? "For Rent" : "For Sale";
  const statusClass = property.status === "for-rent" ? "badge-blue" : "badge-gold";

  // ── Like state from localStorage ────────────────────────────
  const [liked, setLiked] = useState(() => getLikedIds().includes(propertyId));

  const handleLike = useCallback(
    (e) => {
      e.preventDefault(); // prevent Link navigation
      e.stopPropagation();

      const current = getLikedIds();
      let updated;
      if (current.includes(propertyId)) {
        updated = current.filter((i) => i !== propertyId);
        setLiked(false);
      } else {
        updated = [...current, propertyId];
        setLiked(true);
      }
      saveLikedIds(updated);
    },
    [propertyId]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass rounded-3xl overflow-hidden property-card group"
    >
      {/* Image area */}
      <div className="relative overflow-hidden h-64">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
          onError={(e) => {
            e.target.src = FALLBACK_IMAGE;
          }}
        />

        {/* Status badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`badge ${statusClass}`}>{statusLabel}</span>
          {property.featured && (
            <span className="badge badge-gold">Featured</span>
          )}
        </div>

        {/* Like / wishlist button — always visible */}
        <button
          onClick={handleLike}
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          className={`heart-btn absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm border transition-all duration-200 ${
            liked
              ? "liked bg-red-500/20 border-red-400/50"
              : "bg-black/30 border-white/20 hover:bg-red-500/20 hover:border-red-400/50 hover:text-red-400"
          }`}
        >
          <FaHeart
            className={`text-sm ${liked ? "text-red-400" : "text-white/70"}`}
          />
        </button>

        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-bold leading-tight line-clamp-1">
            {property.title}
          </h3>
          <span className="text-yellow-400 text-lg font-bold whitespace-nowrap">
            ${Number(property.price).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2 text-slate-400 text-sm">
          <FaMapMarkerAlt className="text-yellow-400 shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 mt-4 text-slate-300 text-sm">
          <div className="flex items-center gap-1.5">
            <FaBed className="text-yellow-400" />
            <span>{property.bedrooms ?? property.beds ?? 0} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaBath className="text-yellow-400" />
            <span>{property.bathrooms ?? property.baths ?? 0} Baths</span>
          </div>
          {property.area > 0 && (
            <div className="flex items-center gap-1.5">
              <FaRulerCombined className="text-yellow-400" />
              <span>{property.area} ft²</span>
            </div>
          )}
        </div>

        {/* CTA */}
        <Link
          to={`/property/${propertyId}`}
          className="block w-full mt-5 py-3 rounded-xl gold-gradient text-black font-bold text-center text-sm hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

export default PropertyCard;