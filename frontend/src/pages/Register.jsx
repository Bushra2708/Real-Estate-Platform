import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import api from "../services/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHome } from "react-icons/fa";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", formData);
      dispatch(setUser(data.user));
      toast.success("Welcome to EstatePro!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="w-full max-w-md px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl p-8 gold-border"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 gold-gradient rounded-2xl mb-5">
                <FaHome className="text-2xl text-black" />
              </div>
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="text-slate-400 mt-2 text-sm">
                Join thousands of property seekers on EstatePro
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Full Name</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 pointer-events-none text-slate-500 text-sm">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="input-dark py-3.5 pl-11 pr-4"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Email Address</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 pointer-events-none text-slate-500 text-sm">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="input-dark py-3.5 pl-11 pr-4"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Password</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 pointer-events-none text-slate-500 text-sm">
                    <FaLock />
                  </span>
                  <input
                    type={showPwd ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="input-dark py-3.5 pl-11 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 text-slate-500 hover:text-yellow-400 transition text-sm"
                  >
                    {showPwd ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient text-black font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 mt-2"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-yellow-400 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export default Register;