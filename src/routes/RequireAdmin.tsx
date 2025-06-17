import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

export const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const userType = user?.userType || user?.user_type || user?.role;

  if (userType?.toLowerCase() !== "admin") {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>🚫 Unauthorized</h2>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return children;
};
