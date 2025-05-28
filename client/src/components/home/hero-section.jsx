import { Button } from "@/components/ui/button";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Link } from "react-router-dom";
import heroimage from "@/assets/HB_Illustration.svg";
import hackathon from "@/assets/Hackathon.jpg";

function HeroSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-4 max-w-7xl mx-auto">
      <div className="space-y-6 my-16">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Join or Organize Hackathons Across Bangladesh
        </h1>
        <p className="text-muted-foreground">
          Build innovative projects, collaborate with developers, and compete
          for prizes.
        </p>
        <div className="flex gap-4">
          <Button className="md:w-44 md:h-10 px-4 hover:bg-primary/90 hover:scale-105 hover:rotate-[-1deg] hover:shadow-lg hover:translate-x-2 transition-transform duration-200">
            <Link to="/hackathons">Participate</Link>
          </Button>
          <Button
            variant="outline"
            className="md:w-44 md:h-10 px-4 hover:bg-accent/80 hover:scale-105 hover:rotate-[1deg] hover:shadow-lg hover:-translate-x-2 transition-transform duration-200"
          >
            <Link to="/organize">Organize</Link>
          </Button>
        </div>
      </div>
      <div className="w-full h-[400px] rounded-lg ">
        <AspectRatio ratio={16 / 9} className="w-fit h-fit mx-auto">
          <img
            src={hackathon}
            alt="Hackathon Hero"
            className="object-cover w-full h-full rounded-lg"
          />
        </AspectRatio>
      </div>
    </section>
  );
}
export default HeroSection;
