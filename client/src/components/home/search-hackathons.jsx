import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

function SearchHackathons() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    // Redirect to /hackathons?search=your_query
    navigate(`/hackathons?search=${encodeURIComponent(search)}`);
  };

  return (
    <section className="py-10 px-4 max-w-4xl mx-auto flex items-center justify-center">
      <Input
        placeholder="Search hackathons..."
        className="text-base h-12 rounded-r-none"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSearch()}
      />
      <Button className="h-12 w-32 rounded-l-none text-lg font-bold" onClick={handleSearch}>
        Search
      </Button>
    </section>
  );
}

export default SearchHackathons;
