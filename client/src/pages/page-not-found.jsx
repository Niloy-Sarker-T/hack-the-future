import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import animation404 from "@/assets/animations/404-animation.lottie";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function NotFoundPage() {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 px-6 py-20 max-w-6xl mx-auto my-auto text-center md:text-left">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-primary">Page Not Found</h1>
        <p className="text-muted-foreground text-lg">
          Oops! The page you’re looking for doesn’t exist or was moved.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>

      <div className="w-full max-w-md">
        <DotLottieReact
          autoplay
          loop
          src={animation404}
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
