import { useState } from "react";
import {
  useGetAllAuthorsQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
  type Author,
} from "../../features/authorApi";
import AuthorForm from "./components/AuthorForm";
import "./ManageAuthors.scss";

export default function ManageAuthors() {
  const { data: authors = [], isLoading, error } = useGetAllAuthorsQuery();
  const [createAuthor] = useCreateAuthorMutation();
  const [updateAuthor] = useUpdateAuthorMutation();
  const [deleteAuthor] = useDeleteAuthorMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this author?")) return;
    try {
      await deleteAuthor(id).unwrap();
    } catch {
      alert("Failed to delete author.");
    }
  };

  const handleFormSubmit = async (author: Partial<Author>) => {
    try {
      if (editingAuthor) {
        await updateAuthor({
          id: editingAuthor.authorId,
          data: {
            authorName: author.authorName!,
            genreId: author.genreId!,
          },
        }).unwrap();
      } else {
        await createAuthor({
          authorName: author.authorName!,
          genreId: author.genreId!,
        }).unwrap();
      }
      setShowForm(false);
      setEditingAuthor(null);
    } catch {
      alert("Failed to save author.");
    }
  };

  return (
    <div className="manage-authors">
      <div className="author-table-wrapper">
        <h2>Manage Authors</h2>
        <button onClick={() => setShowForm(true)}>➕ Add Author</button>

        {isLoading && <p>Loading...</p>}
        {error && <p className="error">Failed to load authors.</p>}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Genre ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <tr key={author.authorId}>
                <td>{author.authorName}</td>
                <td>{author.genreId}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditingAuthor(author);
                      setShowForm(true);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(author.authorId)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <AuthorForm
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingAuthor(null);
          }}
          initialData={editingAuthor || undefined}
        />
      )}
    </div>
  );
}
