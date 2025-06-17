// src/pages/admin/ManageAuthors.tsx
import { useEffect, useState } from "react";
import { fetchAuthors, deleteAuthor } from "../../services/author";
import "./ManageAuthors.scss";

interface Author {
  id: string;
  name: string;
  bio?: string;
}

export default function ManageAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAuthors = async () => {
    try {
      setLoading(true);
      const res = await fetchAuthors();
      setAuthors(res.data);
    } catch (err) {
      setError("Failed to load authors.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this author?")) return;
    try {
      await deleteAuthor(id);
      setAuthors(authors.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete author.");
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  return (
    <div className="manage-authors">
      <h2>Manage Authors</h2>
      <button onClick={() => alert("TODO: Open author form")}>➕ Add Author</button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Bio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.name}</td>
              <td>{author.bio || "—"}</td>
              <td>
                <button onClick={() => alert("TODO: Edit Author")}>✏️ Edit</button>
                <button onClick={() => handleDelete(author.id)}>🗑 Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
