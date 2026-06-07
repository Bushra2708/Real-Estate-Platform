import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaSignOutAlt, FaUser, FaPlus, FaBars, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import api from "../../services/api";
import toast from "react-hot-toast";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    } finally {
      dispatch(logout());
      toast.success("Logged out");
      navigate("/");
      setMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass">
      <div className="container-custom flex items-center justify-between py-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="gold-gradient p-2 rounded-lg">
            <FaHome className="text-xl text-black" />
          </div>
          <span className="text-2xl font-black tracking-tight">
            Estate<span className="gold-text">Pro</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm hover:text-yellow-400 transition duration-200">
            Home
          </Link>
          <Link to="/properties" className="text-sm hover:text-yellow-400 transition duration-200">
            Properties
          </Link>

          {user ? (
            <>
              <Link
                to="/create-property"
                className="flex items-center gap-2 text-sm hover:text-yellow-400 transition duration-200"
              >
                <FaPlus className="text-xs" />
                List Property
              </Link>
              <Link
                to="/dashboard"
                className="text-sm hover:text-yellow-400 transition duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 text-sm hover:text-yellow-400 transition duration-200"
              >
                <div className="gold-gradient w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                {user.name?.split(" ")[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition duration-200"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm hover:text-yellow-400 transition duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="gold-gradient text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:scale-105 transition duration-300"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-dark border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition">Home</Link>
          <Link to="/properties" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition">Properties</Link>
          {user ? (
            <>
              <Link to="/create-property" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition">List Property</Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition">Dashboard</Link>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition">Profile</Link>
              <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-300 transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400 transition">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="gold-gradient text-black font-bold px-6 py-3 rounded-xl text-center">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;