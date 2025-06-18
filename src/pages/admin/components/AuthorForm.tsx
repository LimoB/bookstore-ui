import { useState } from "react";
import type { Author } from "../../../features/authorApi";

interface AuthorFormProps {
  onSubmit: (author: Partial<Author>) => void | Promise<void>;
  onClose: () => void;
  initialData?: Author;
}

export default function AuthorForm({
  onSubmit,
  onClose,
  initialData,
}: AuthorFormProps) {
  const [authorName, setAuthorName] = useState(initialData?.authorName || "");
  const [genreId, setGenreId] = useState(initialData?.genreId || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      authorId: initialData?.authorId,
      authorName,
      genreId,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{initialData ? "Edit Author" : "Add Author"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Author Name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Genre ID"
            value={genreId}
            onChange={(e) => setGenreId(parseInt(e.target.value))}
            required
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">{initialData ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
