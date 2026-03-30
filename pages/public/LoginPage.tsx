import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { Role } from "../../types";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Card from "../../components/Card";
import { APP_NAME } from "../../constants";

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // Display the success message from registration, if it exists.
    if (location.state?.message) {
      toast.success(location.state.message);
      // Clear the location state to prevent the message from re-appearing on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Use the new login function that checks credentials
    const success = login(identifier, password);

    setIsLoading(false);

    if (success) {
      toast.success("Login successful! Redirecting...");
      // The role is now set in the AuthContext, so we can get it from there if needed,
      // but ProtectedRoute will handle the redirection logic based on the current user's role.
      // We can simply navigate to a generic dashboard or let the app redirect.
      // For clarity, we'll redirect based on the role found during login.
      const loggedInUser = JSON.parse(
        sessionStorage.getItem("currentUser") || "{}"
      );
      switch (loggedInUser.role) {
        case Role.CLIENT:
          navigate("/client/dashboard");
          break;
        case Role.PROVIDER:
          navigate("/provider/dashboard");
          break;
        case Role.ADMIN:
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/");
      }
    } else {
      toast.error(
        "Invalid credentials. Please check your email/phone and password."
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="p-8 md:p-10 shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-poppins font-extrabold text-primary">
              Sign in to {APP_NAME}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <Input
              label="Email or Phone Number"
              name="identifier"
              type="text"
              autoComplete="username"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="user@example.com"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-accent"
            >
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
