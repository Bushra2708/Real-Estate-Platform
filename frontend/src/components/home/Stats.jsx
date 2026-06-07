import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Properties Listed", icon: "🏠" },
  { value: "8K+", label: "Happy Clients", icon: "🤝" },
  { value: "150+", label: "Cities Worldwide", icon: "🌍" },
  { value: "500+", label: "Expert Agents", icon: "👔" },
];

function Stats() {
  return (
    <section className="container-custom py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="stat-card text-center"
          >
            <div className="text-4xl mb-3">{stat.icon}</div>
            <h2 className="text-4xl font-black gold-text">{stat.value}</h2>
            <p className="mt-2 text-slate-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Stats;