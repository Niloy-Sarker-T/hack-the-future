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
import CreateHackathonPage from "./pages/hackathons/create-hackathon";
import ManageHackathonsPage from "./pages/hackathons/manage-hackathons";
import EditHackathonPage from "./pages/hackathons/edit-hacakthon";

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
            <Route path="/edit-profile" element={<EditProfilePage />} />  /chat, chat.jsx -- er chat page
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route
              path="/hackathons/create-hackathon"
              element={<CreateHackathonPage />}
            />
          </Route>
          <Route element={<ProtectedRoute role={"organizer"} />}>
            <Route
              path="/hackathons/:hackathonId/edit"
              element={<EditHackathonPage />}
            />
            <Route
              path="/manage-hackathon"
              element={<ManageHackathonsPage />}
            />
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
