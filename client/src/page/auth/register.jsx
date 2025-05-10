import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import axiosInstance from "@/lib/axios-setup";
import { toast } from "sonner";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      valid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }

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
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/api/auth/register", formData); // Use axiosInstance for API call
      if (res.status === 201) {
        toast(`Registration with ${formData.email} is successful.`, {
          type: "success",
          richColors: true,
          closeButton: true,
        });
      }
      if (res.status === 200) {
        toast(`Registration is complete`, {
          type: "info",
          richColors: true,
          closeButton: true,
          description: "Please verify your email.",
        });
      }
    } catch (error) {
      console.error("Registration failed", error);
      toast(`Registration with ${formData.email} is successful.`, {
        type: "error",
        richColors: true,
        closeButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center z-10">
      <main className="w-full max-w-md px-4">
        <Card className="bg-gradient-to-br from-[#1A1A1A] to-[#222222] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Create an account
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter your information to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`bg-[#121212] border-[#2A2A2A] text-white ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`bg-[#121212] border-[#2A2A2A] text-white ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-[#121212] border-[#2A2A2A] text-white ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`bg-[#121212] border-[#2A2A2A] text-white ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                {isLoading ? "Creating account..." : "Create account"}
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

            <Button
              variant="outline"
              className="w-full bg-transparent border-[#2A2A2A] hover:bg-[#2A2A2A] text-white"
            >
              Continue with Google
            </Button>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login">
                <span className="text-[#14B8A6] hover:underline">Log in</span>
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
