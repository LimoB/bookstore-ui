// src/pages/admin/ManageUsers.tsx
import { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../../services/user";
import "./ManageUsers.scss";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "author" | "member";
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetchUsers();
      setUsers(res.data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch {
      alert("Failed to delete user.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      <button onClick={() => alert("TODO: Open user creation form")}>➕ Add User</button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name || "—"}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => alert("TODO: Edit User")}>✏️ Edit</button>
                <button onClick={() => handleDelete(user.id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
