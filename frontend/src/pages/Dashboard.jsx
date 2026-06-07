import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/layout/Layout";
import api from "../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaHome,
  FaEye,
  FaCheckCircle,
  FaBed,
  FaBath,
  FaMapMarkerAlt,
} from "react-icons/fa";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80";

function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMyProperties();
  }, [user, navigate]);

  const fetchMyProperties = async () => {
    try {
      const { data } = await api.get("/properties/user/my-properties");
      setProperties(data.properties);
    } catch {
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;
    setDeleting(id);
    try {
      await api.delete(`/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      toast.success("Property deleted");
    } catch {
      toast.error("Failed to delete property");
    } finally {
      setDeleting(null);
    }
  };

  const stats = [
    { label: "Total Listings", value: properties.length, icon: FaHome },
    {
      label: "Active",
      value: properties.filter((p) => p.status !== "sold").length,
      icon: FaCheckCircle,
    },
    {
      label: "For Sale",
      value: properties.filter((p) => p.status === "for-sale").length,
      icon: FaHome,
    },
    {
      label: "For Rent",
      value: properties.filter((p) => p.status === "for-rent").length,
      icon: FaHome,
    },
  ];

  return (
    <Layout>
      <div className="container-custom py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between flex-wrap gap-4 mb-10"
        >
          <div>
            <h1 className="text-4xl font-bold">
              My Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Welcome back,{" "}
              <span className="text-yellow-400 font-semibold">
                {user?.name}
              </span>
            </p>
          </div>

          <Link
            to="/create-property"
            className="flex items-center gap-2 gold-gradient text-black font-bold px-7 py-3 rounded-xl hover:scale-105 transition"
          >
            <FaPlus />
            Add Property
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="stat-card"
            >
              <stat.icon className="text-2xl text-yellow-400 mb-3" />
              <p className="text-4xl font-bold">{stat.value}</p>
              <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Properties Table / Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">My Listings</h2>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton rounded-2xl h-64" />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl p-16 text-center"
            >
              <FaHome className="text-6xl text-slate-600 mx-auto mb-5" />
              <h3 className="text-2xl font-bold mb-2">No properties yet</h3>
              <p className="text-slate-400 mb-6">
                Start by creating your first property listing
              </p>
              <Link
                to="/create-property"
                className="inline-flex items-center gap-2 gold-gradient text-black font-bold px-8 py-3 rounded-xl hover:scale-105 transition"
              >
                <FaPlus />
                Create Listing
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property, i) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl overflow-hidden property-card"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={property.images?.[0] || FALLBACK_IMAGE}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`badge ${
                          property.status === "for-rent"
                            ? "badge-blue"
                            : "badge-gold"
                        }`}
                      >
                        {property.status === "for-rent"
                          ? "For Rent"
                          : "For Sale"}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg line-clamp-1">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                      <FaMapMarkerAlt className="text-yellow-400 shrink-0" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>

                    <p className="text-yellow-400 font-bold text-xl mt-3">
                      ${Number(property.price).toLocaleString()}
                    </p>

                    <div className="flex gap-4 text-slate-400 text-sm mt-2">
                      <span className="flex items-center gap-1">
                        <FaBed className="text-yellow-400" />
                        {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaBath className="text-yellow-400" />
                        {property.bathrooms}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4">
                      <Link
                        to={`/property/${property._id}`}
                        className="flex-1 flex items-center justify-center gap-2 glass py-2 rounded-xl text-sm hover:text-yellow-400 transition"
                      >
                        <FaEye />
                        View
                      </Link>
                      <Link
                        to={`/edit-property/${property._id}`}
                        className="flex-1 flex items-center justify-center gap-2 glass py-2 rounded-xl text-sm hover:text-yellow-400 transition"
                      >
                        <FaEdit />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(property._id)}
                        disabled={deleting === property._id}
                        className="flex-1 flex items-center justify-center gap-2 glass py-2 rounded-xl text-sm hover:text-red-400 transition disabled:opacity-50"
                      >
                        <FaTrash />
                        {deleting === property._id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;