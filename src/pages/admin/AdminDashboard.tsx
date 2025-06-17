// src/pages/admin/AdminDashboard.tsx
import { Link } from "react-router-dom";
import { FaUser, FaBook, FaUsers } from "react-icons/fa";
import "./AdminDashboard.scss";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>📊 Admin Dashboard</h1>

      <div className="admin-sections">
        <Link to="/admin/authors" className="admin-card" aria-label="Manage Authors">
          <FaUser className="icon" />
          <div className="card-content">
            <h2>Manage Authors</h2>
            <p>Add, edit, and delete author profiles.</p>
          </div>
        </Link>

        <Link to="/admin/books" className="admin-card" aria-label="Manage Books">
          <FaBook className="icon" />
          <div className="card-content">
            <h2>Manage Books</h2>
            <p>Maintain the book catalog and metadata.</p>
          </div>
        </Link>

        <Link to="/admin/users" className="admin-card" aria-label="Manage Users">
          <FaUsers className="icon" />
          <div className="card-content">
            <h2>Manage Users</h2>
            <p>View and manage user accounts and roles.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
