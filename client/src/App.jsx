import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Layout from "@/components/layout/layout";
import HomePage from "@/pages/home";
import NotFoundPage from "./pages/page-not-found";
import Login from "./pages/auth/Login";
import Signup from "./pages/signup";
import { Toaster } from "./components/ui/sonner";
import PortfolioPage from "./pages/portfolio/ProfolioPage";
import OtherUserPortfolioPage from "./pages/portfolio/OtherUserPortfolioPage";
import EditProfilePage from "./pages/portfolio/EditProfilePage";
import ProtectedRoute from "./components/layout/protected-layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/portfolio/:username"
            element={<OtherUserPortfolioPage />}
          />
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Add protected routes here */}
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Route>
          {/* Others */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
