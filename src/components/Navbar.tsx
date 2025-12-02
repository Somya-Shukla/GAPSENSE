import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { mockAuth } from '../utils/mockAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = mockAuth.isAuthenticated();
  const user = mockAuth.getCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    mockAuth.logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="text-xl sm:text-2xl font-bold neon-glow"
            >
              GapSense
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-crimson-accent transition-colors">
              Home
            </Link>
            <Link to="/submit" className="hover:text-crimson-accent transition-colors">
              Submit Struggle
            </Link>
            <Link to="/community" className="hover:text-crimson-accent transition-colors">
              Community
            </Link>
            <Link to="/dashboard" className="hover:text-crimson-accent transition-colors">
              Dashboard
            </Link>
            {isAuthenticated && (
              <>
                {user?.role === 'mentor' && (
                  <Link to="/mentor-dashboard" className="hover:text-crimson-accent transition-colors">
                    Mentor Dashboard
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-crimson-accent transition-colors">
                    Admin Panel
                  </Link>
                )}
                <Link to="/profile" className="hover:text-crimson-accent transition-colors">
                  Profile
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 bg-crimson-accent/20 border border-crimson-accent/50 rounded-lg hover:bg-crimson-accent/30 transition-colors"
                >
                  Logout
                </motion.button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="hover:text-crimson-accent transition-colors">
                  Login
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 bg-crimson-accent/20 border border-crimson-accent/50 rounded-lg hover:bg-crimson-accent/30 transition-colors"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3 border-t border-white/10 bg-dark-blue/50 backdrop-blur-lg">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="block py-2 hover:text-crimson-accent transition-colors"
              >
                Home
              </Link>
              <Link
                to="/submit"
                onClick={closeMobileMenu}
                className="block py-2 hover:text-crimson-accent transition-colors"
              >
                Submit Struggle
              </Link>
              <Link
                to="/community"
                onClick={closeMobileMenu}
                className="block py-2 hover:text-crimson-accent transition-colors"
              >
                Community
              </Link>
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                className="block py-2 hover:text-crimson-accent transition-colors"
              >
                Dashboard
              </Link>
              {isAuthenticated && (
                <>
                  {user?.role === 'mentor' && (
                    <Link
                      to="/mentor-dashboard"
                      onClick={closeMobileMenu}
                      className="block py-2 hover:text-crimson-accent transition-colors"
                    >
                      Mentor Dashboard
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="block py-2 hover:text-crimson-accent transition-colors"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="block py-2 hover:text-crimson-accent transition-colors"
                  >
                    Profile
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="w-full text-left px-0 py-2 text-crimson-accent hover:opacity-80 transition-opacity"
                  >
                    Logout
                  </motion.button>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block py-2 hover:text-crimson-accent transition-colors"
                  >
                    Login
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      navigate('/signup');
                      closeMobileMenu();
                    }}
                    className="w-full text-left px-0 py-2 text-crimson-accent hover:opacity-80 transition-opacity"
                  >
                    Sign Up
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

