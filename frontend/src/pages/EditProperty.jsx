import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import api from "../services/api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

function EditProperty() {
  const { id } = useParams();
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
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProperty = async () => {
      try {
        const { data } = await api.get(`/properties/${id}`);
        const p = data.property;
        setFormData({
          title: p.title || "",
          description: p.description || "",
          price: p.price || "",
          location: p.location || "",
          address: p.address || "",
          type: p.type || "apartment",
          status: p.status || "for-sale",
          bedrooms: p.bedrooms || 1,
          bathrooms: p.bathrooms || 1,
          area: p.area || "",
          amenities: Array.isArray(p.amenities) ? p.amenities.join(", ") : "",
          images: Array.isArray(p.images) ? p.images.join(", ") : "",
          featured: p.featured || false,
        });
      } catch {
        toast.error("Could not load property");
        navigate("/dashboard");
      } finally {
        setFetching(false);
      }
    };

    fetchProperty();
  }, [id, user, navigate]);

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

      await api.put(`/properties/${id}`, payload);
      toast.success("Property updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update property");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full py-3.5 px-4 bg-white/5 rounded-xl outline-none border border-white/10 focus:border-yellow-400 transition text-white placeholder-slate-600 font-sans text-sm";

  const selectClass =
    "w-full py-3.5 px-4 bg-[#141d2e] rounded-xl outline-none border border-white/10 focus:border-yellow-400 transition text-white font-sans text-sm";

  if (fetching) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-slate-400 hover:text-yellow-400 transition mb-8 text-sm"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>

          <h1 className="text-4xl font-bold mb-2">Edit Property</h1>
          <p className="text-slate-400 mb-10">Update your listing details</p>

          <form onSubmit={handleSubmit} className="glass p-10 rounded-3xl">
            <div className="grid md:grid-cols-2 gap-6">

              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-2">Title</label>
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

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm text-slate-400 mb-2">Description</label>
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

              {/* Price */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Price ($)</label>
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

              {/* Location */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Location</label>
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

              {/* Address */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Ocean Drive"
                  className={inputClass}
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Area (sq ft)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="2500"
                  className={inputClass}
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className={selectClass}>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="commercial">Commercial</option>
                  <option value="farmhouse">Farm House</option>
                  <option value="beach-house">Beach House</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={selectClass}>
                  <option value="for-sale">For Sale</option>
                  <option value="for-rent">For Rent</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className={inputClass}
                  min={0}
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className={inputClass}
                  min={0}
                />
              </div>

              {/* Images */}
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

              {/* Amenities */}
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

              {/* Featured */}
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-5 h-5 accent-yellow-400"
                  id="featured-checkbox"
                />
                <label htmlFor="featured-checkbox" className="text-slate-300 cursor-pointer">
                  Mark as Featured Property
                </label>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 glass py-4 rounded-xl text-slate-300 hover:text-white border border-white/10 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 gold-gradient text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}

export default EditProperty;
