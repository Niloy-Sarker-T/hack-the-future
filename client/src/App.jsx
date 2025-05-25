import Home from "./page/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./page/auth/login";
import Layout from "./page/Layout";
import RegisterPage from "./page/auth/register";
import NotFound from "./page/NotFound";
import Profile from "./page/profile/profile";
import ProfilePreview from "./page/profile/profile-preview";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import EditProfilePage from "./page/profile/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit/profile" element={<EditProfilePage />} />
            <Route path="/user/:userName" element={<ProfilePreview />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
