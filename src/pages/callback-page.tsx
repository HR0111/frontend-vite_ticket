import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";

const CallbackPage: React.FC = () => {
  const { isLoading, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const [timeoutReached, setTimeoutReached] = useState(false);

  useEffect(() => {
    // Set a timeout to handle cases where auth process hangs
    const timeout = setTimeout(() => {
      setTimeoutReached(true);
    }, 10000); // 10 seconds timeout

    if (isLoading) {
      return () => clearTimeout(timeout);
    }

    if (isAuthenticated) {
      clearTimeout(timeout);
      const redirectPath = localStorage.getItem("redirectPath") || "/dashboard";
      localStorage.removeItem("redirectPath");
      navigate(redirectPath);
    } else if (error || timeoutReached) {
      // Handle authentication error or timeout
      clearTimeout(timeout);
      console.error("Authentication failed:", error);
      navigate("/login", { 
        state: { error: "Login failed. Please try again." } 
      });
    }

    return () => clearTimeout(timeout);
  }, [isLoading, isAuthenticated, error, navigate, timeoutReached]);

  if (isLoading && !timeoutReached) {
    return (
      <div>
        <p>Processing login...</p>
        <p>Please wait...</p>
      </div>
    );
  }

  if (error || timeoutReached) {
    return (
      <div>
        <p>Login failed. Redirecting...</p>
      </div>
    );
  }

  return <p>Completing login...</p>;
};

export default CallbackPage;
