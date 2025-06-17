// src/services/user.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const fetchUsers = () => axios.get(`${API_BASE}/users`);
export const deleteUser = (id: string) => axios.delete(`${API_BASE}/users/${id}`);
