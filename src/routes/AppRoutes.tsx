import { Routes, Route, Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "../hooks/useAuth";

// Layouts
import AdminLayout from "../layouts/AdminLayout";

// Public pages
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageAuthors from "../pages/admin/ManageAuthors";
import { BookManager } from "../pages/admin/ManageBooks";
import ManageUsers from "../pages/admin/ManageUsers";

// Utility pages
import Unauthorized from "../pages/Unauthorized";

const ProtectedRoute = ({
  children,
  roles,
}: {
  children: JSX.Element;
  roles?: string[];
}) => {
  const { isAuthenticated, user } = useAuth();
  const role = user?.role || "";

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Member or Admin */}
      <Route
        path="/books"
        element={
          <ProtectedRoute roles={["admin", "member"]}>
            <BookManager />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes with Sidebar Layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="authors" element={<ManageAuthors />} />
        <Route path="books" element={<BookManager />} />
        <Route path="users" element={<ManageUsers />} />
      </Route>

      {/* Utility */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Catch-all 404 */}
      <Route
        path="*"
        element={
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <h2>404 - Page Not Found</h2>
            <p>The page you're looking for doesn't exist.</p>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
