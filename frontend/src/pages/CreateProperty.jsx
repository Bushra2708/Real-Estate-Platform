import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import api from "../services/api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

function CreateProperty() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    address: "",
    type: "apartment",
    status: "for-sale",
    bedrooms: 1,
    bathrooms: 1,
    area: "",
    amenities: "",
    images: "",
    featured: false,
  });

  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass p-10 rounded-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">Login Required</h2>
            <p className="text-slate-400 mb-6">
              You need to be logged in to create a property listing.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="gold-gradient text-black font-bold px-8 py-3 rounded-xl"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        area: Number(formData.area),
        amenities: formData.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        images: formData.images
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
      };

      await api.post("/properties", payload);
      toast.success("Property created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full p-4 bg-slate-800 rounded-xl outline-none border border-slate-700 focus:border-yellow-400 transition";

  return (
    <Layout>
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-2">Create New Property</h1>
          <p className="text-slate-400 mb-10">
            Fill in the details to list your property
          </p>

          <form onSubmit={handleSubmit} className="glass p-10 rounded-3xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Luxury Beach Villa"
                  className={inputClass}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property..."
                  rows={4}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="850000"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Miami, FL"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="commercial">Commercial</option>
                  <option value="farmhouse">Farm House</option>
                  <option value="beach-house">Beach House</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className={inputClass}
                  min={0}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className={inputClass}
                  min={0}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="2500"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Ocean Drive"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-2">
                  Image URLs (comma-separated)
                </label>
                <input
                  type="text"
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-2">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="Pool, Gym, Parking, Garden"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 accent-yellow-400"
                />
                <label className="text-slate-300">
                  Mark as Featured Property
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-black font-bold py-4 rounded-xl mt-8 hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Property"}
            </button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}

export default CreateProperty;