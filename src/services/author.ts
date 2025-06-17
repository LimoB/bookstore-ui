// src/services/author.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const fetchAuthors = () => axios.get(`${API_BASE}/authors`);
export const deleteAuthor = (id: string) => axios.delete(`${API_BASE}/authors/${id}`);
