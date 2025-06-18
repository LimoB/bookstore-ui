const API_BASE = "http://localhost:5000/api"; // Update if hosted elsewhere

// Get headers with optional Authorization
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Centralized fetch handler with auth and error handling
const apiFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login"; // or show a message instead
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API error");
  }

  return res.status === 204 ? null : await res.json();
};

// API methods
export const fetchAuthors = async () => {
  return apiFetch(`${API_BASE}/authors`);
};

export const deleteAuthor = async (id: string) => {
  return apiFetch(`${API_BASE}/authors/${id}`, {
    method: "DELETE",
  });
};

export const createAuthor = async (author: { name: string; bio?: string }) => {
  return apiFetch(`${API_BASE}/authors`, {
    method: "POST",
    body: JSON.stringify(author),
  });
};

export const updateAuthor = async (
  id: string,
  author: { name: string; bio?: string }
) => {
  return apiFetch(`${API_BASE}/authors/${id}`, {
    method: "PUT",
    body: JSON.stringify(author),
  });
};
