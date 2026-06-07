import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const BG_URL =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80";

function Hero() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("for-sale");
  const [type, setType] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `url(${BG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Multi-layer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1e]/95 via-[#0a0f1e]/75 to-[#0a0f1e]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent" />

      {/* Glow accents */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10 py-32">
        {/* Pre-title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-0.5 bg-yellow-400" />
          <span className="text-yellow-400 font-semibold tracking-widest uppercase text-sm">
            Premium Real Estate
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black max-w-4xl leading-[1.05] tracking-tight"
        >
          Find Your
          <br />
          <span className="gold-text">Dream Home</span>
          <br />
          <span className="text-slate-300 text-5xl md:text-6xl font-bold">Today</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-slate-300 mt-6 max-w-xl leading-relaxed"
        >
          Discover premium apartments, villas, penthouses and dream properties
          across the globe — curated for discerning buyers.
        </motion.p>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-dark p-3 rounded-2xl mt-12 max-w-3xl gold-border"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
              <FaMapMarkerAlt className="text-yellow-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="City, neighborhood, or address..."
                className="bg-transparent w-full outline-none text-sm placeholder-slate-500"
              />
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-white/5 rounded-xl px-4 py-3 text-sm outline-none border border-white/10 focus:border-yellow-400 transition"
            >
              <option value="for-sale">For Sale</option>
              <option value="for-rent">For Rent</option>
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-white/5 rounded-xl px-4 py-3 text-sm outline-none border border-white/10 focus:border-yellow-400 transition"
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="penthouse">Penthouse</option>
              <option value="beach-house">Beach House</option>
              <option value="commercial">Commercial</option>
            </select>

            <button
              type="submit"
              className="gold-gradient text-black font-bold rounded-xl px-8 py-3 flex items-center gap-2 hover:scale-105 transition duration-300 whitespace-nowrap"
            >
              <FaSearch />
              Search
            </button>
          </div>
        </motion.form>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center gap-8 mt-12 flex-wrap"
        >
          {[
            { val: "10K+", label: "Properties" },
            { val: "8K+", label: "Happy Clients" },
            { val: "150+", label: "Cities" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-yellow-400">{s.val}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;