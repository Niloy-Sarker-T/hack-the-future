import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Github } from "lucide-react";
import axiosInstance from "@/lib/axios-setup";
import axios from "axios";
import useAuthStore from "@/store/authStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "", general: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({ email: "", password: "", general: "" });

    try {
      const res = await login({
        email: formData.email,
        password: formData.password,
      });

      // Verify token was properly set
      // console.group("🔐 Login Success Debug");
      // console.log("Login response:", res);
      // console.log("User data:", res.data?.user);
      // console.log("Access token received:", !!res.data?.accessToken);
      // if (res.data?.accessToken) {
      //   console.log("Token length:", res.data.accessToken.length);
      //   console.log(
      //     "Token preview:",
      //     `${res.data.accessToken.substring(0, 10)}...`
      //   );
      // }
      // console.groupEnd();

      toast(res.message, {
        type: "success",
        richColors: true,
        closeButton: true,
      });
      navigate("/");
    } catch (err) {
      // console.group("❌ Login Error Debug");
      // console.log("Error object:", err);
      // console.log("Response data:", err.response?.data);
      // console.log("Status code:", err.response?.status);
      // console.groupEnd();

      if (axios.isAxiosError(err)) {
        toast(err.response?.data?.message || "Login failed", {
          type: "error",
          richColors: true,
          closeButton: true,
        });
      }

      setErrors((prev) => ({
        ...prev,
        general:
          err.response?.data?.message ||
          err.message ||
          "Invalid email or password. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1E1E1E] flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-to-br from-[#1A1A1A] to-[#222222] border-[#2A2A2A]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">
              Sign in
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {showSuccessMessage && (
              <Alert className="bg-green-900/20 border-green-800 text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Account created successfully! You can now sign in.
                </AlertDescription>
              </Alert>
            )}

            {errors.general && (
              <Alert className="bg-red-900/20 border-red-800 text-red-400">
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-[#121212] border-[#2A2A2A] focus:border-[#14B8A6] text-white ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#14B8A6] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`bg-[#121212] border-[#2A2A2A] focus:border-[#14B8A6] text-white ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#14B8A6] hover:bg-[#0E9384] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-[#2A2A2A]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1A1A1A] px-2 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="bg-transparent border-[#2A2A2A] hover:bg-[#2A2A2A] text-white"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-[#2A2A2A] hover:bg-[#2A2A2A] text-white"
              >
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
