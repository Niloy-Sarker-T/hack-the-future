import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Link, replace, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import userStore from "@/store/user-store";
import { toast } from "sonner";

// ✅ Validation schema using Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const login = userStore((state) => state.login);
  const isLoading = userStore((state) => state.isLoading);
  const error = userStore((state) => state.error);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    const result = await login(values);
    if (result?.success) {
      // redirect to home and show success richtext toast
      toast.success("Login Successful", {
        description: "You have successfully logged in.",
        action: {
          label: "x",
          onClick: () => toast.dismiss(),
        },
        richColors: true,
        duration: 3000,
      });
      navigate("/", { replace: true });
    } else {
      // show error toast
      toast.error("Login Failed", {
        description: result?.error || "An error occurred during login.",
        action: {
          label: "x",
          onClick: () => toast.dismiss(),
        },
        richColors: true,
        duration: 3000,
      });
    }
    // error is handled in store, can show error from `error`
  };

  return (
    <div className="flex justify-center items-center px-4 h-[calc(100lvh-24rem)]">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </Form>
          {error && (
            <div className="mt-4 text-red-600 text-sm text-center">{error}</div>
          )}
          <div className="flex mt-4 justify-center text-sm">
            <Link
              to="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="flex justify-between mt-4 relative">
            <Separator className="my-6 data-[orientation=horizontal]:w-[45%] -translate-y-3" />
            <span>or</span>
            <Separator className="my-6 data-[orientation=horizontal]:w-[45%] -translate-y-3" />
          </div>
          <p className="text-center text-sm">
            Not registered?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
