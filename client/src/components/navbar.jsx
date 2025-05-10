import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import useAuthStore from "@/store/authStore";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-[#2A2A2A]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-[#14B8A6] flex items-center justify-center">
            <span className="font-bold text-black">HF</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">
            hack-the-future
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-8">
          <Link
            to="#events"
            className="text-gray-300 hover:text-[#14B8A6] transition-colors"
          >
            Events
          </Link>
          <Link
            to="#benefits"
            className="text-gray-300 hover:text-[#14B8A6] transition-colors"
          >
            Features
          </Link>
          <Link
            to="#stories"
            className="text-gray-300 hover:text-[#14B8A6] transition-colors"
          >
            Success Stories
          </Link>
          <Link
            to="#sponsors"
            className="text-gray-300 hover:text-[#14B8A6] transition-colors"
          >
            Sponsors
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-3 mr-2">
                <div className="w-8 h-8 rounded-full bg-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6]">
                  {user.avatarUrl === "avatar" ? (
                    <User size={18} />
                  ) : (
                    <img
                      src={user?.avatarUrl}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "avatar"; // Fallback to default avatar
                      }}
                    />
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <LogOut size={18} className="mr-2" />
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="border-[#14B8A6] text-[#14B8A6] hover:bg-[#14B8A6] hover:text-white"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-[#14B8A6] hover:bg-[#0E9384] text-white">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#121212] border-b border-[#2A2A2A]">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="#events"
              className="text-gray-300 hover:text-[#14B8A6] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="#benefits"
              className="text-gray-300 hover:text-[#14B8A6] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="#stories"
              className="text-gray-300 hover:text-[#14B8A6] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Success Stories
            </Link>
            <Link
              to="#sponsors"
              className="text-gray-300 hover:text-[#14B8A6] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Sponsors
            </Link>
            <div className="flex flex-col space-y-2 pt-2 border-t border-[#2A2A2A]">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 py-2">
                    {user?.avatarUrl === "avatar" ? (
                      <div className="w-8 h-8 rounded-full bg-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6]">
                        <User size={18} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#14B8A6]/20 flex items-center justify-center text-[#14B8A6]">
                        <img
                          src={user?.avatarUrl}
                          alt="User Avatar"
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = "avatar"; // Fallback to default avatar
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-full"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                      navigate("/login");
                    }}
                  >
                    <LogOut size={18} className="mr-2" />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="border-[#14B8A6] text-[#14B8A6] hover:bg-[#14B8A6] hover:text-white w-full"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-[#14B8A6] hover:bg-[#0E9384] text-white w-full">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
