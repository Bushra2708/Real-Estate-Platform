import { FaHome, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-700 mt-20">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <FaHome className="text-2xl text-yellow-400" />
              <h2 className="text-xl font-bold">EstatePro</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Premium luxury real estate platform. Find your dream home with
              the finest selection of properties worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-yellow-400">Quick Links</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-bold mb-4 text-yellow-400">Property Types</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>Luxury Villas</li>
              <li>Apartments</li>
              <li>Penthouses</li>
              <li>Commercial</li>
              <li>Beach Houses</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold mb-4 text-yellow-400">Follow Us</h3>
            <div className="flex gap-4 text-xl text-slate-400">
              <a href="#" className="hover:text-yellow-400 transition">
                <FaFacebook />
              </a>
              <a href="#" className="hover:text-yellow-400 transition">
                <FaTwitter />
              </a>
              <a href="#" className="hover:text-yellow-400 transition">
                <FaInstagram />
              </a>
              <a href="#" className="hover:text-yellow-400 transition">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} EstatePro. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;