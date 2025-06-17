const API_BASE = "http://localhost:5000/api"; // Update if hosted elsewhere

export interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
}

export const registerUser = async (payload: RegisterPayload) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Registration failed");
    return await res.json();
};

export const loginUser = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return await res.json(); // expect { token, user }
};
