import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <nav className="hidden md:flex items-center space-x-8">
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
              <Button
                variant="outline"
                className="border-[#14B8A6] text-[#14B8A6] hover:bg-[#14B8A6] hover:text-white w-full"
              >
                Log In
              </Button>
              <Button className="bg-[#14B8A6] hover:bg-[#0E9384] text-white w-full">
                Register
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
