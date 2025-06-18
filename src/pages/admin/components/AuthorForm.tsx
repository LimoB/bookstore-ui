import { useState, useEffect } from "react";
import type { Author } from "../../../features/authorApi";
import { useGetAllGenresQuery } from "../../../features/genreApi";
import "./AuthorForm.scss";

interface Props {
  onSubmit: (author: Partial<Author>) => void;
  onClose: () => void;
  initialData?: Partial<Author>;
}

export default function AuthorForm({ onSubmit, onClose, initialData }: Props) {
  const [authorName, setAuthorName] = useState("");
  const [genreId, setGenreId] = useState("");

  const { data: genres = [], isLoading, error } = useGetAllGenresQuery();

  useEffect(() => {
    if (initialData) {
      setAuthorName(initialData.authorName || "");
      setGenreId(initialData.genreId?.toString() || "");
    } else {
      setAuthorName("");
      setGenreId("");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !genreId) {
      alert("All fields are required.");
      return;
    }
    onSubmit({ authorName, genreId: Number(genreId) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Author Name"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        required
      />

      {isLoading ? (
        <p>Loading genres...</p>
      ) : error ? (
        <p className="error">Failed to load genres.</p>
      ) : (
        <select
          value={genreId}
          onChange={(e) => setGenreId(e.target.value)}
          required
        >
          <option value="">Select Genre</option>
          {genres.map((genre) =>
            genre && genre.genreId !== undefined ? (
              <option key={genre.genreId} value={genre.genreId}>
                {genre.genreName}
              </option>
            ) : null
          )}
        </select>
      )}

      <div className="modal-actions">
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit">Save</button>
      </div>
    </form>
  );
}
