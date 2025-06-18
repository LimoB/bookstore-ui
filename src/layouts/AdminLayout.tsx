import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaUser, FaBook, FaUsers, FaTachometerAlt, FaCaretDown } from "react-icons/fa";
import "./AdminLayout.scss";
import { useState } from "react";

export default function AdminLayout() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2>📚 Admin</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>
                <FaTachometerAlt /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/authors" className={({ isActive }) => (isActive ? "active" : "")}>
                <FaUser /> Authors
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/books" className={({ isActive }) => (isActive ? "active" : "")}>
                <FaBook /> Books
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "active" : "")}>
                <FaUsers /> Users
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span className="profile-name">👤 Admin</span>
            <FaCaretDown />
            {dropdownOpen && (
              <ul className="dropdown">
                <li onClick={() => navigate("/admin/settings")}>My Profile</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            )}
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
