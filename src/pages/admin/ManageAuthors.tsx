import { useState, useEffect, useMemo } from "react";
import {
  useGetAllAuthorsQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
  type Author,
} from "../../features/authorApi";
import {
  useGetAllGenresQuery,
  type Genre,
} from "../../features/genreApi";
import AuthorForm from "./components/AuthorForm";
import "./ManageAuthors.scss";

export default function ManageAuthors() {
  const {
    data: authors = [],
    isLoading: isLoadingAuthors,
    error: authorsError,
  } = useGetAllAuthorsQuery();

  const {
    data: genres = [],
    isLoading: isLoadingGenres,
    error: genresError,
  } = useGetAllGenresQuery();

  const [createAuthor, { isLoading: isCreating }] = useCreateAuthorMutation();
  const [updateAuthor, { isLoading: isUpdating }] = useUpdateAuthorMutation();
  const [deleteAuthor, { isLoading: isDeleting }] = useDeleteAuthorMutation();

  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const genreMap = useMemo(() => {
    return new Map<number, string>(
      genres.map(({ genreId, genreName }) => [genreId, genreName])
    );
  }, [genres]);

  useEffect(() => {
    if (authorsError || genresError) {
      console.group("📊 Debug Info: ManageAuthors");
      if (authorsError) console.error("❌ Error loading authors:", authorsError);
      if (genresError) console.error("❌ Error loading genres:", genresError);
      console.groupEnd();
    }
  }, [authorsError, genresError]);

  const handleDelete = async (authorId: number) => {
    const confirmed = confirm("Are you sure you want to delete this author?");
    if (!confirmed) return;

    try {
      await deleteAuthor(authorId).unwrap();
    } catch (error) {
      console.error("❌ Failed to delete author:", error);
      alert("Failed to delete author. Please try again.");
    }
  };

  const handleFormSubmit = async (authorData: Partial<Author>) => {
    const { authorName, genreId } = authorData;

    if (!authorName?.trim() || !genreId) {
      alert("Author name and genre are required.");
      return;
    }

    try {
      if (editingAuthor) {
        await updateAuthor({
          id: editingAuthor.authorId,
          data: { authorName, genreId },
        }).unwrap();
      } else {
        await createAuthor({ authorName, genreId }).unwrap();
      }
      setEditingAuthor(null);
    } catch (error) {
      console.error("❌ Failed to save author:", error);
      alert("Failed to save author. Please check your input and try again.");
    }
  };

  const renderAuthorRows = () => {
    if (authors.length === 0) {
      return (
        <tr>
          <td colSpan={3} className="text-center">
            No authors found.
          </td>
        </tr>
      );
    }

    return authors.map((author) => {
      const genreName = genreMap.get(author.genreId);

      return (
        <tr key={author.authorId}>
          <td>{author.authorName || <span className="text-muted">Unnamed</span>}</td>
          <td>
            {author.genreId} –{" "}
            {genreName || <span className="text-danger">Unknown Genre</span>}
          </td>
          <td>
            <button
              onClick={() => setEditingAuthor(author)}
              disabled={isCreating || isUpdating}
              aria-label="Edit author"
            >
              ✏️ Edit
            </button>
            <button
              className="delete"
              onClick={() => handleDelete(author.authorId)}
              disabled={isDeleting}
              aria-label="Delete author"
            >
              🗑 Delete
            </button>
          </td>
        </tr>
      );
    });
  };

  const isLoading = isLoadingAuthors || isLoadingGenres;
  const hasError = !!authorsError || !!genresError;

  return (
    <div className="manage-authors">
      <div className="author-table-wrapper">
        <h2>Manage Authors</h2>

        {isLoading && <p>Loading authors and genres...</p>}

        {hasError && (
          <p className="error">
            ❌ Failed to load authors or genres. Please try refreshing the page.
          </p>
        )}

        {!isLoading && !hasError && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Genre</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{renderAuthorRows()}</tbody>
          </table>
        )}
      </div>

      <div className="author-form-wrapper">
        <h3>{editingAuthor ? "Edit Author" : "Add Author"}</h3>
        <AuthorForm
          onSubmit={handleFormSubmit}
          onClose={() => setEditingAuthor(null)}
          initialData={editingAuthor ?? undefined}
        />
      </div>
    </div>
  );
}
