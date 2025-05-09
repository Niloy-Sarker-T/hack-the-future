import Home from "./page/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./page/auth/login";
import Layout from "./page/Layout";
import RegisterPage from "./page/auth/register";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
