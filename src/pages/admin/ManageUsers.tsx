// src/pages/admin/ManageUsers.tsx
import { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../../services/user";
import "./ManageUsers.scss";

interface User {
    userId: number;
    fullName: string;
    email: string;
    user_type: "admin" | "author" | "member";
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
    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await deleteUser(id.toString());
            setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== id));
        } catch (error) {
            console.error("Delete user failed:", error);
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
                        <th>User Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.userId}>
                            <td>{user.fullName || "—"}</td>
                            <td>{user.email}</td>
                            <td>{user.user_type}</td>
                            <td>
                                <button onClick={() => alert("TODO: Edit User")}>✏️ Edit</button>
                                <button onClick={() => handleDelete(user.userId)}>🗑 Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
