import { useState, useEffect, useMemo } from "react";
import {
  useGetAllAuthorsQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
  type Author,
} from "../../features/authorApi";
import { useGetAllGenresQuery } from "../../features/genreApi";
import AuthorForm from "./components/AuthorForm";

interface AuthorFormInput {
  authorName: string;
  genreId: number;
}

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

  const genreMap = useMemo(
    () =>
      new Map<number, string>(
        genres.map(({ genreId, genreName }) => [genreId, genreName])
      ),
    [genres]
  );

  useEffect(() => {
    if (authorsError || genresError) {
      console.group("📊 Debug Info: ManageAuthors");
      if (authorsError) console.error("❌ Error loading authors:", authorsError);
      if (genresError) console.error("❌ Error loading genres:", genresError);
      console.groupEnd();
    }
  }, [authorsError, genresError]);

  const handleDelete = async (authorId: number) => {
    if (!confirm("Are you sure you want to delete this author?")) return;
    try {
      await deleteAuthor(authorId).unwrap();
    } catch (error) {
      console.error("❌ Failed to delete author:", error);
      alert("Failed to delete author. Please try again.");
    }
  };

  const handleFormSubmit = async ({ authorName, genreId }: AuthorFormInput) => {
    if (!authorName.trim() || !genreId) {
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
          <td colSpan={3} className="text-center py-4 text-gray-500 border">
            No authors found.
          </td>
        </tr>
      );
    }

    return authors.map((author) => {
      const genreName = genreMap.get(author.genreId);

      return (
        <tr
          key={author.authorId}
          className="hover:bg-indigo-100 even:bg-indigo-50 transition animate-slideUpFade"
        >
          <td className="px-4 py-3 border">
            {author.authorName || (
              <span className="text-gray-400 italic">Unnamed</span>
            )}
          </td>
          <td className="px-4 py-3 border">
            {author.genreId} –{" "}
            {genreName || (
              <span className="text-red-500 italic">Unknown Genre</span>
            )}
          </td>
          <td className="px-4 py-3 border flex gap-2">
            <button
              onClick={() => setEditingAuthor(author)}
              disabled={isCreating || isUpdating}
              className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-purple-700 transition"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => handleDelete(author.authorId)}
              disabled={isDeleting}
              className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600 transition"
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
    <div className="flex flex-wrap gap-8 justify-between items-start p-8 min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 animate-fadeIn">
      {/* Author Table */}
      <div className="flex-1 min-w-[320px] max-w-[60%]">
        <h2 className="text-2xl text-indigo-700 mb-6 animate-slideDown">
          Manage Authors
        </h2>

        {isLoading && <p>Loading authors and genres...</p>}

        {hasError && (
          <p className="text-red-600 font-semibold mt-4">
            ❌ Failed to load authors or genres. Please try refreshing the page.
          </p>
        )}

        {!isLoading && !hasError && (
          <table className="w-full border border-gray-300 border-collapse rounded-xl overflow-hidden shadow text-sm animate-fadeIn">
            <thead>
              <tr className="bg-indigo-600 text-white font-semibold text-base">
                <th className="px-4 py-3 text-left border border-gray-300">
                  Name
                </th>
                <th className="px-4 py-3 text-left border border-gray-300">
                  Genre
                </th>
                <th className="px-4 py-3 text-left border border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>{renderAuthorRows()}</tbody>
          </table>
        )}
      </div>

      {/* Author Form */}
      <div className="flex-1 min-w-[280px] max-w-[35%] flex flex-col items-center p-6 animate-fadeIn">
        <h3 className="text-2xl text-indigo-700 mb-6 animate-slideDown">
          {editingAuthor ? "✏️ Edit Author" : "➕ Add Author"}
        </h3>

        <AuthorForm
          onSubmit={handleFormSubmit}
          onClose={() => setEditingAuthor(null)}
          initialData={
            editingAuthor
              ? {
                authorName: editingAuthor.authorName,
                genreId: editingAuthor.genreId,
              }
              : undefined
          }
          isLoading={isCreating || isUpdating}
          genres={genres}
          existingAuthors={authors}
        />

      </div>
    </div>
  );
}
