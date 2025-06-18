// src/layouts/AdminLayout.tsx
import { NavLink, Outlet } from "react-router-dom";
import { FaUser, FaBook, FaUsers, FaTachometerAlt } from "react-icons/fa"; // Dashboard icon
import "./AdminLayout.scss";

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            <aside className="sidebar">
                <h2>📚 Admin</h2>
                <nav>
                    <ul>
                        <li>
                            <NavLink
                                to="/admin"
                                end
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                <FaTachometerAlt /> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/authors"
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                <FaUser /> Authors
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/books"
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                <FaBook /> Books
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/users"
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                <FaUsers /> Users
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}
