import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Home,
  Search,
  Calendar,
  Code,
  Users,
} from "lucide-react";
import useAuthStore from "@/store/authStore";
import { Button } from "./ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-[#2A2A2A]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 mr-8">
            <div className="w-10 h-10 rounded-full bg-[#14B8A6] flex items-center justify-center">
              <span className="font-bold text-black">HF</span>
            </div>
            <span className="font-bold text-xl hidden xl:inline-block text-white">
              hack-the-future
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/hackathons"
              className="text-gray-300 hover:text-[#14B8A6] transition-colors"
            >
              Join a Hackathon
            </Link>
            <Link
              to={isAuthenticated ? `/${user.userName}/create` : `/signin`}
              className="text-gray-300 hover:text-[#14B8A6] transition-colors"
            >
              Host a Hackathon
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <button className="text-gray-300 hover:text-white transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-full bg-[#14B8A6]/20 flex items-center justify-center text-white hover:bg-[#14B8A6]/30 transition-colors">
                    <User className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 hidden md:block bg-[#1A1A1A] border-[#2A2A2A] text-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#2A2A2A]" />
                  <DropdownMenuItem className="hover:bg-[#2A2A2A] cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-[#2A2A2A] cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#2A2A2A]" />
                  <DropdownMenuItem className="hover:bg-[#2A2A2A] p-0 cursor-pointer text-[#14B8A6]">
                    <Button
                      variant="outline"
                      className="w-full hover:text-red-400 bg-gray-800 hover:bg-gray-900 px-3 py-2 "
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                        navigate("/signin");
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="text-[#14B8A6] hover:text-[#14B8A6] text-base bg-slate-800 hover:bg-slate-900 border-gray-600 hover:border-[#14B8A6]"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
              <Button
                variant="default"
                className="bg-[#14B8A6] text-base text-black hover:bg-[#0d9488]"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </>
          )}

          <button
            className="md:hidden text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-[#121212] border-b border-[#2A2A2A]">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/hackathons"
              className="text-gray-300 hover:text-[#14B8A6] transition-colors"
            >
              Join a Hackathon
            </Link>
            <Link
              to={isAuthenticated ? `/${user.userName}/create` : `/signin`}
              className="text-gray-300 hover:text-[#14B8A6] transition-colors"
            >
              Host a Hackathon
            </Link>

            {isAuthenticated ? (
              <div className="pt-2 border-t border-[#2A2A2A]">
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-[#14B8A6] transition-colors py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="text-gray-300 hover:text-[#14B8A6] transition-colors py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
                <Button
                  variant="outline"
                  className="w-full text-red-400 hover:text-red-400 hover:bg-gray-900 bg-gray-800 px-3 py-2"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    navigate("/signin");
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-[#2A2A2A] flex flex-col space-y-2">
                <Button
                  variant="outline"
                  className="w-full text-base text-[#14B8A6] hover:text-[#14B8A6] bg-slate-800 hover:bg-slate-900 border-gray-600 hover:border-[#14B8A6]"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/signin");
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="default"
                  className="w-full bg-[#14B8A6] text-black hover:bg-[#0d9488]"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/register");
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
