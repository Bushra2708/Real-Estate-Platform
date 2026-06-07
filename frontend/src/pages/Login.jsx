import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import api from "../services/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { motion } from "framer-motion";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      dispatch(setUser(data.user));
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
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
                <FaLock className="text-2xl text-black" />
              </div>
              <h1 className="text-3xl font-bold">Welcome Back</h1>
              <p className="text-slate-400 mt-2 text-sm">
                Sign in to your EstatePro account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
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
                <label className="block text-sm text-slate-400 mb-2">
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 pointer-events-none text-slate-500 text-sm">
                    <FaLock />
                  </span>
                  <input
                    type={showPwd ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient text-black font-bold py-3.5 rounded-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 mt-2"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-yellow-400 font-semibold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export default Login;