import { useState } from "react";
import {
    useCreateUserMutation,
    type CreateUserInput,
    type UserRole,
} from "../../../../features/userApi";

// Strongly typed default form
const defaultForm: CreateUserInput = {
    fullName: "",
    email: "",
    password: "",
    user_type: "member", // must be one of: "admin" | "member" | "author"
};

export default function AddUserForm() {
    const [form, setForm] = useState<CreateUserInput>(defaultForm);
    const [formError, setFormError] = useState("");
    const [createUser, { isLoading }] = useCreateUserMutation();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // 🛡️ Enforce UserRole type for user_type field
        if (name === "user_type") {
            setForm((prev) => ({
                ...prev,
                user_type: value as UserRole,
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        try {
            await createUser(form).unwrap();
            setForm(defaultForm);
        } catch (err) {
            console.error("❌ Create user failed:", err);
            setFormError("❌ Failed to create user.");
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full">
            <h3 className="text-xl font-semibold text-indigo-700 mb-4">➕ Add New User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        name="user_type"
                        value={form.user_type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md"
                    >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                        <option value="author">Author</option>
                    </select>
                </div>

                {formError && <p className="text-red-600 text-sm">{formError}</p>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
                >
                    {isLoading ? "Creating..." : "Add User"}
                </button>
            </form>
        </div>
    );
}
