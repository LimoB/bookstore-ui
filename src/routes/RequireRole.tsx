import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

interface RequireRoleProps {
  children: JSX.Element;
  requiredRole: string;
}

export const RequireRole = ({ children, requiredRole }: RequireRoleProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role =
    user?.role || user?.user_type || user?.userType || user?.type || "";

  if (!role || role.toLowerCase() !== requiredRole.toLowerCase()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-2">🚫 Unauthorized</h2>
          <p className="text-lg">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
};
