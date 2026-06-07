import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  {
    label: "Luxury Villas",
    type: "villa",
    icon: "🏡",
    desc: "Sprawling estates with private amenities",
    count: "2.4K+ listings",
  },
  {
    label: "Apartments",
    type: "apartment",
    icon: "🏢",
    desc: "Modern urban living in prime locations",
    count: "5.1K+ listings",
  },
  {
    label: "Beach Houses",
    type: "beach-house",
    icon: "🌊",
    desc: "Waterfront properties with stunning views",
    count: "890+ listings",
  },
  {
    label: "Penthouses",
    type: "penthouse",
    icon: "✨",
    desc: "Sky-high luxury with panoramic vistas",
    count: "340+ listings",
  },
  {
    label: "Commercial",
    type: "commercial",
    icon: "🏬",
    desc: "Prime office and retail spaces",
    count: "1.2K+ listings",
  },
  {
    label: "Farm Houses",
    type: "farmhouse",
    icon: "🌿",
    desc: "Serene countryside retreats",
    count: "560+ listings",
  },
];

function Categories() {
  return (
    <section className="container-custom py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <p className="text-yellow-400 font-semibold tracking-widest uppercase text-sm mb-3">
          Explore By Type
        </p>
        <h2 className="text-5xl font-bold">
          Popular <span className="gold-text">Categories</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.type}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              to={`/properties?type=${cat.type}`}
              className="block glass rounded-2xl p-8 property-card group"
            >
              <div className="text-5xl mb-5">{cat.icon}</div>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-400 transition">
                {cat.label}
              </h3>
              <p className="text-slate-400 text-sm mb-4">{cat.desc}</p>
              <span className="text-xs text-yellow-400 font-semibold">
                {cat.count} →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Categories;