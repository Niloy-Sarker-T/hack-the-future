import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="relative">
        <h1 className="text-9xl font-extrabold tracking-widest text-primary-foreground">
          404
        </h1>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="bg-gradient-to-r from-sky-500 to-yellow-500 w-32 h-1 animate-pulse"></div>
        </div>
      </div>

      <p className="text-2xl mt-8 font-semibold text-primary-foreground">
        Page Not Found
      </p>

      <p className="text-gray-300 mt-4 max-w-md">
        Oops! The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      <div className="mt-10">
        <Button asChild variant="default" size="lg">
          <Link to="/" className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
