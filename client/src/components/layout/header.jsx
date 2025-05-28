import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Header({ user }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out");
    navigate("/login");
  };

  return (
    <header className="w-full border-b bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-3 grid grid-cols-2 lg:grid-cols-3 items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <button
            className="lg:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" className="text-2xl font-bold">
            HackBD
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden lg:flex justify-center gap-6">
          <Link
            to="/hackathons"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Join Hackathon
          </Link>
          <Link
            to="/organize"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Organize Hackathon
          </Link>
        </nav>

        {/* Auth Buttons or User Dropdown */}
        <div className="flex justify-end">
          {!user ? (
            <Button className="md:w-32 md:h-10 px-4 hover:bg-primary/90 hover:scale-105 hover:rotate-[1deg] hover:shadow-lg hover:-translate-x-2 transition-transform duration-200">
              <Link to="/login">Login</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/portfolio">Portfolio</Link>
                </DropdownMenuItem>
                {user.role === "organizer" && (
                  <DropdownMenuItem asChild>
                    <Link to="/manage-hackathon">Manage Hackathon</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden px-4 pb-3 flex flex-col gap-3 border-t bg-white dark:bg-gray-950">
          <Link
            to="/hackathons"
            className="text-sm font-medium py-2 hover:text-primary transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Join Hackathon
          </Link>
          <Link
            to="/organize"
            className="text-sm font-medium py-2 hover:text-primary transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Organize Hackathon
          </Link>
        </div>
      )}
    </header>
  );
}
