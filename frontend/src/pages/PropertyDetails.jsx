import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import api from "../services/api";
import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaArrowLeft,
  FaHeart,
  FaShare,
  FaPhone,
  FaEnvelope,
  FaTag,
} from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

/* ── Demo data (matches FeaturedProperties fallback) ─────────── */
const DEMO_MAP = {
  demo1: {
    _id: "demo1",
    title: "Luxury Beach Villa",
    description:
      "A breathtaking beachfront villa nestled on the shores of Miami. This architectural masterpiece boasts panoramic ocean views, private beach access, and world-class amenities. The open-plan living spaces flow seamlessly to expansive terraces designed for indoor-outdoor living.",
    price: 850000,
    location: "Miami, FL",
    address: "100 Ocean Drive, Miami Beach, FL 33139",
    type: "villa",
    status: "for-sale",
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    featured: true,
    amenities: ["Private Pool", "Beach Access", "Gym", "Home Theater", "Smart Home", "Garage"],
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"],
    owner: { name: "EstatePro Agent" },
  },
  demo2: {
    _id: "demo2",
    title: "Modern Penthouse",
    description:
      "Soaring above the Manhattan skyline, this ultra-luxury penthouse redefines elevated living. Floor-to-ceiling windows reveal iconic city views in every direction. Bespoke Italian finishes, a private rooftop terrace, and concierge services make this a once-in-a-generation offering.",
    price: 1200000,
    location: "New York, NY",
    address: "432 Park Avenue, New York, NY 10022",
    type: "penthouse",
    status: "for-sale",
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    featured: true,
    amenities: ["Rooftop Terrace", "Concierge", "Wine Cellar", "Private Elevator", "Spa"],
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"],
    owner: { name: "EstatePro Agent" },
  },
  demo3: {
    _id: "demo3",
    title: "Skyline Apartment",
    description:
      "Contemporary luxury apartment in the heart of Dubai's most prestigious district. Floor-to-ceiling glazing captures the shimmering city skyline and desert horizon. Designer kitchen, Italian marble bathrooms, and access to an exclusive residents' club.",
    price: 920000,
    location: "Dubai, UAE",
    address: "Downtown Dubai, UAE",
    type: "apartment",
    status: "for-rent",
    bedrooms: 3,
    bathrooms: 2,
    area: 2100,
    featured: true,
    amenities: ["Infinity Pool", "24/7 Security", "Valet Parking", "Club Lounge", "Children's Play Area"],
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80"],
    owner: { name: "EstatePro Agent" },
  },
  demo4: {
    _id: "demo4",
    title: "Mountain Retreat",
    description:
      "An extraordinary mountain estate perched above Aspen with breathtaking ski-in/ski-out access. Featuring six bedrooms with en-suite marble baths, a grand stone fireplace, chef's kitchen, and heated outdoor pool with mountain views.",
    price: 2500000,
    location: "Aspen, CO",
    address: "Snowmass Village, Aspen, CO 81615",
    type: "villa",
    status: "for-sale",
    bedrooms: 6,
    bathrooms: 5,
    area: 6000,
    featured: true,
    amenities: ["Ski-in/Ski-out", "Heated Pool", "Wine Cellar", "Sauna", "Mountain Views"],
    images: ["https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=80"],
    owner: { name: "EstatePro Agent" },
  },
  demo5: {
    _id: "demo5",
    title: "Seaside Cottage",
    description:
      "A Malibu icon. This spectacular oceanfront estate sits directly on one of the most coveted stretches of private beach in California. Freshly reimagined interiors blend coastal elegance with understated luxury.",
    price: 3100000,
    location: "Malibu, CA",
    address: "Malibu Colony, Malibu, CA 90265",
    type: "beach-house",
    status: "for-sale",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    featured: true,
    amenities: ["Private Beach", "Outdoor Kitchen", "Fire Pit", "Ocean Terrace", "Surfboard Storage"],
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"],
    owner: { name: "EstatePro Agent" },
  },
  demo6: {
    _id: "demo6",
    title: "Urban Loft",
    description:
      "A stunning industrial-chic loft in Chicago's vibrant West Loop neighborhood. Exposed brick, soaring ceilings, original hardwood floors, and chef-quality finishes throughout. Steps from award-winning restaurants and galleries.",
    price: 480000,
    location: "Chicago, IL",
    address: "West Loop, Chicago, IL 60661",
    type: "apartment",
    status: "for-rent",
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    featured: false,
    amenities: ["Rooftop Deck", "Bike Storage", "Dog-Friendly", "Package Lockers"],
    images: ["https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80"],
    owner: { name: "EstatePro Agent" },
  },
};

/* ── Like helpers (same as PropertyCard) ─────────────────────── */
const getLikedIds = () => {
  try {
    return JSON.parse(localStorage.getItem("liked_properties") || "[]");
  } catch {
    return [];
  }
};
const saveLikedIds = (ids) =>
  localStorage.setItem("liked_properties", JSON.stringify(ids));

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [liked, setLiked] = useState(() => getLikedIds().includes(id));

  useEffect(() => {
    // Check demo map first (for featured demo cards)
    if (DEMO_MAP[id]) {
      setProperty(DEMO_MAP[id]);
      setLoading(false);
      return;
    }

    // Validate MongoDB ObjectId format (24 hex chars)
    const isValidObjectId = /^[a-f\d]{24}$/i.test(id);
    if (!isValidObjectId) {
      toast.error("Property not found");
      navigate("/");
      return;
    }

    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        setProperty(data.property);
      } catch {
        toast.error("Property not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate]);

  const handleLike = useCallback(() => {
    const current = getLikedIds();
    let updated;
    if (current.includes(id)) {
      updated = current.filter((i) => i !== id);
      setLiked(false);
    } else {
      updated = [...current, id];
      setLiked(true);
      toast("Added to favourites", { icon: "❤️" });
    }
    saveLikedIds(updated);
  }, [id]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400" />
        </div>
      </Layout>
    );
  }

  if (!property) return null;

  const images =
    property.images?.length > 0
      ? property.images
      : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80"];

  const typeLabel = {
    apartment: "Apartment",
    villa: "Villa",
    penthouse: "Penthouse",
    commercial: "Commercial",
    farmhouse: "Farm House",
    "beach-house": "Beach House",
  }[property.type] || property.type;

  return (
    <Layout>
      <div className="container-custom py-10">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-yellow-400 transition mb-8 text-sm"
        >
          <FaArrowLeft />
          Back to listings
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* ── Left: Image Gallery ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-3xl overflow-hidden mb-4 relative">
              <img
                src={images[activeImage]}
                alt={property.title}
                className="w-full h-[480px] object-cover"
                onError={(e) =>
                  (e.target.src =
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80")
                }
              />
              {/* image count pill */}
              {images.length > 1 && (
                <span className="absolute bottom-4 right-4 glass text-xs px-3 py-1.5 rounded-full">
                  {activeImage + 1} / {images.length}
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    onClick={() => setActiveImage(i)}
                    className={`w-24 h-20 object-cover rounded-xl cursor-pointer transition-all ${
                      i === activeImage
                        ? "ring-2 ring-yellow-400 opacity-100"
                        : "opacity-50 hover:opacity-80"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Right: Info ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top row: status + type + actions */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`badge ${
                    property.status === "for-rent" ? "badge-blue" : "badge-gold"
                  }`}
                >
                  {property.status === "for-rent" ? "For Rent" : "For Sale"}
                </span>
                <span className="badge badge-green flex items-center gap-1">
                  <FaTag className="text-[10px]" />
                  {typeLabel}
                </span>
                {property.featured && (
                  <span className="badge badge-gold">Featured</span>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleLike}
                  className={`heart-btn glass p-3 rounded-xl border transition-all ${
                    liked
                      ? "liked border-red-400/40 bg-red-500/10"
                      : "border-white/10 hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-400"
                  }`}
                  title={liked ? "Remove from favourites" : "Save to favourites"}
                >
                  <FaHeart
                    className={liked ? "text-red-400" : "text-slate-400"}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="glass p-3 rounded-xl border border-white/10 hover:border-yellow-400/40 hover:text-yellow-400 transition-all"
                  title="Copy link"
                >
                  <FaShare className="text-slate-400" />
                </button>
              </div>
            </div>

            <h1 className="text-4xl font-black leading-tight">{property.title}</h1>

            <div className="flex items-center gap-2 mt-3 text-slate-400">
              <FaMapMarkerAlt className="text-yellow-400" />
              <span>{property.address || property.location}</span>
            </div>

            <div className="mt-6">
              <span className="text-sm text-slate-400">
                {property.status === "for-rent" ? "Monthly Rent" : "Listing Price"}
              </span>
              <h2 className="text-5xl font-black gold-text mt-1">
                ${Number(property.price).toLocaleString()}
              </h2>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="glass rounded-2xl p-4 text-center">
                <FaBed className="text-2xl text-yellow-400 mx-auto mb-2" />
                <p className="font-bold text-lg">{property.bedrooms}</p>
                <p className="text-xs text-slate-400 mt-0.5">Bedrooms</p>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <FaBath className="text-2xl text-yellow-400 mx-auto mb-2" />
                <p className="font-bold text-lg">{property.bathrooms}</p>
                <p className="text-xs text-slate-400 mt-0.5">Bathrooms</p>
              </div>
              <div className="glass rounded-2xl p-4 text-center">
                <FaRulerCombined className="text-2xl text-yellow-400 mx-auto mb-2" />
                <p className="font-bold text-lg">{property.area?.toLocaleString()}</p>
                <p className="text-xs text-slate-400 mt-0.5">Sq Ft</p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 gold-gradient rounded-full block" />
                Description
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 gold-gradient rounded-full block" />
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a, i) => (
                    <span
                      key={i}
                      className="glass text-sm px-4 py-1.5 rounded-full text-slate-300 gold-border"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Agent */}
            <div className="glass rounded-2xl p-6 mt-8">
              <h3 className="text-lg font-bold mb-1">Contact Agent</h3>
              {property.owner && (
                <p className="text-slate-400 text-sm mb-4">
                  Listed by{" "}
                  <span className="text-yellow-400 font-semibold">
                    {property.owner.name}
                  </span>
                </p>
              )}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 gold-gradient text-black font-bold py-3 rounded-xl hover:scale-[1.02] transition text-sm">
                  <FaPhone />
                  Call Agent
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 glass py-3 rounded-xl hover:text-yellow-400 transition border border-white/10 text-sm">
                  <FaEnvelope />
                  Send Email
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export default PropertyDetails;