import { useEffect } from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../features/userApi";
import AddUserForm from "../admin/components/user/AddUserForm";

export default function ManageUsers() {
  const {
    data: users = [],
    error,
    isLoading,
    refetch,
  } = useGetUsersQuery();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      await deleteUser(id).unwrap();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete user.");
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 animate-fadeIn">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">Manage Users</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-gray-600">Loading users...</p>
          ) : error ? (
            <p className="text-red-600 font-semibold">
              ❌ Failed to load users.
            </p>
          ) : (
            <table className="w-full border border-gray-300 text-sm shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="text-left px-4 py-3 border border-gray-300">Name</th>
                  <th className="text-left px-4 py-3 border border-gray-300">Email</th>
                  <th className="text-left px-4 py-3 border border-gray-300">User Type</th>
                  <th className="text-left px-4 py-3 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.userId}
                      className="hover:bg-indigo-100 transition animate-slideUpFade"
                    >
                      <td className="px-4 py-3 border">{user.fullName}</td>
                      <td className="px-4 py-3 border">{user.email}</td>
                      <td className="px-4 py-3 border capitalize">{user.user_type}</td>
                      <td className="px-4 py-3 border flex gap-2">
                        <button
                          onClick={() => alert("TODO: Edit User")}
                          className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-purple-700 transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.userId)}
                          disabled={deleting}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600 transition"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Add User Form */}
        <AddUserForm />
      </div>
    </div>
  );
}
