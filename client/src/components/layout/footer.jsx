import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white dark:bg-gray-950 text-sm">
      <div className="container mx-auto px-4 py-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Column 1: Brand */}
        <div className="flex flex-col gap-2">
          <Link to="/" className="text-xl font-bold">
            HackBD
          </Link>
          <p className="text-muted-foreground">
            A platform to join and organize hackathons across Bangladesh.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">Quick Links</h3>
          <Link to="/hackathons" className="hover:text-primary">
            Join Hackathon
          </Link>
          <Link to="/organize" className="hover:text-primary">
            Organize Hackathon
          </Link>
          <Link to="/portfolio" className="hover:text-primary">
            Portfolio
          </Link>
        </div>

        {/* Column 3: Legal & Contact */}
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">Support</h3>
          <Link to="/terms" className="hover:text-primary">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-primary">
            Privacy Policy
          </Link>
          <a href="mailto:support@hackbd.dev" className="hover:text-primary">
            support@hackbd.dev
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t mt-6 py-4 text-center text-muted-foreground text-xs">
        &copy; {new Date().getFullYear()} HackBD. All rights reserved.
      </div>
    </footer>
  );
}
