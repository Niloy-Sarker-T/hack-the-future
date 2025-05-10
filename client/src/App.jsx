import Home from "./page/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./page/auth/login";
import Layout from "./page/Layout";
import RegisterPage from "./page/auth/register";
import NotFound from "./page/NotFound";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
