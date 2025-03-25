import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#121212] border-t border-[#2A2A2A]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#14B8A6] flex items-center justify-center">
                <span className="font-bold text-black">HF</span>
              </div>
              <span className="font-bold text-xl">hack-the-future</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Bangladesh's premier hackathon platform connecting innovators,
              sponsors, and institutions.
            </p>
            <div className="flex space-x-4">
              <a
                to="#"
                className="text-gray-400 hover:text-[#14B8A6] transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                to="#"
                className="text-gray-400 hover:text-[#14B8A6] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                to="#"
                className="text-gray-400 hover:text-[#14B8A6] transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                to="#"
                className="text-gray-400 hover:text-[#14B8A6] transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-[#14B8A6] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="#events"
                  className="text-gray-400 hover:text-[#14B8A6] transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="#benefits"
                  className="text-gray-400 hover:text-[#14B8A6] transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="#stories"
                  className="text-gray-400 hover:text-[#14B8A6] transition-colors"
                >
                  Success Stories
                </Link>
              </li>
              <li>
                <Link
                  to="#sponsors"
                  className="text-gray-400 hover:text-[#14B8A6] transition-colors"
                >
                  Sponsors
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">For Users</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-[#14B8A6] transition-colors"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-[#14B8A6] transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-[#14B8A6] transition-colors"
                >
                  Find a Hackathon
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-[#14B8A6] transition-colors"
                >
                  Team Formation
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-[#14B8A6] transition-colors"
                >
                  Submit Project
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-[#14B8A6] mr-3 mt-0.5" />
                <span className="text-gray-400">info@hackthefuture.bd</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-[#14B8A6] mr-3 mt-0.5" />
                <span className="text-gray-400">+880 1712-345678</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#14B8A6] mr-3 mt-0.5" />
                <span className="text-gray-400">
                  ICT Tower, Agargaon, Dhaka-1207, Bangladesh
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2A2A2A] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} hack-the-future. All rights
            reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="#"
              className="text-gray-400 hover:text-[#14B8A6] transition-colors text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-gray-400 hover:text-[#14B8A6] transition-colors text-sm"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              className="text-gray-400 hover:text-[#14B8A6] transition-colors text-sm"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
