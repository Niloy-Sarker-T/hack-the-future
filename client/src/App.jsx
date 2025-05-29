import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Layout from "@/components/layout/layout";
import HomePage from "@/pages/home";
import NotFoundPage from "./pages/page-not-found";
import Login from "./pages/auth/Login";
import Signup from "./pages/signup";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
