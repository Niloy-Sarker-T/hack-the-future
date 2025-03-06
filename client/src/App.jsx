import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="container bg-red-400 p-4 m-auto ">
        Welcome to Our Site.
      </div>
    </>
  );
}

export default App;
