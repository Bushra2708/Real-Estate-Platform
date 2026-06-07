import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import api from "../services/api";
import toast from "react-hot-toast";
import { setUser } from "../redux/slices/authSlice";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaSave,
  FaCamera,
} from "react-icons/fa";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/users/profile", { name });
      dispatch(setUser({ ...user, name: data.user.name }));
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Layout>
      <div className="container-custom py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Avatar card */}
            <div className="glass rounded-3xl p-10 text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="w-28 h-28 gold-gradient rounded-full flex items-center justify-center text-4xl font-black text-black mx-auto">
                  {initials}
                </div>
                <button className="absolute bottom-0 right-0 glass p-2 rounded-full border border-yellow-400/40 hover:bg-yellow-400 hover:text-black transition">
                  <FaCamera className="text-sm" />
                </button>
              </div>

              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-slate-400 mt-1">{user.email}</p>

              <div className="mt-4">
                <span
                  className={`badge ${
                    user.role === "admin" ? "badge-gold" : "badge-blue"
                  }`}
                >
                  <FaShieldAlt className="mr-1.5" />
                  {user.role === "admin" ? "Administrator" : "Member"}
                </span>
              </div>
            </div>

            {/* Edit form */}
            <div className="glass rounded-3xl p-10">
              <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

              <form onSubmit={handleSave} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 pointer-events-none text-slate-500 text-sm">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-dark py-3.5 pl-11 pr-4"
                      required
                    />
                  </div>
                </div>

                {/* Email — read only */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 pointer-events-none text-slate-500 text-sm">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="input-dark py-3.5 pl-11 pr-4 opacity-50 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">
                    Email cannot be changed
                  </p>
                </div>

                {/* Role — read only */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Account Role
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 pointer-events-none text-slate-500 text-sm">
                      <FaShieldAlt />
                    </span>
                    <input
                      type="text"
                      value={user.role === "admin" ? "Administrator" : "Member"}
                      readOnly
                      className="input-dark py-3.5 pl-11 pr-4 opacity-50 cursor-not-allowed capitalize"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 gold-gradient text-black font-bold py-4 rounded-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 mt-2"
                >
                  <FaSave />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;