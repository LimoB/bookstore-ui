const API_BASE = "http://localhost:5000/api"; // same base

// Reuse existing auth headers logic
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

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
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API error");
  }

  return res.status === 204 ? null : await res.json();
};

// ✅ API Methods for genres
export const fetchGenres = async () => {
  return apiFetch(`${API_BASE}/genres`);
};

export const createGenre = async (genre: {
  genre_name: string;
  genre_code: string;
}) => {
  return apiFetch(`${API_BASE}/genres`, {
    method: "POST",
    body: JSON.stringify(genre),
  });
};

export const updateGenre = async (
  id: string,
  genre: { genre_name?: string; genre_code?: string }
) => {
  return apiFetch(`${API_BASE}/genres/${id}`, {
    method: "PUT",
    body: JSON.stringify(genre),
  });
};

export const deleteGenre = async (id: string) => {
  return apiFetch(`${API_BASE}/genres/${id}`, {
    method: "DELETE",
  });
};
