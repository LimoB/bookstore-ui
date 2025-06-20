import { useState } from "react";
import "./Book.scss";
import {
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetBooksQuery,
  type Book as BookType,
} from "../../features/bookApi";

import { useGetAllAuthorsQuery } from "../../features/authorApi";

import BookForm, { type BookFormInput } from "./components/BookForm";

export const BookManager = () => {
  const { data: books = [], isLoading, isError, refetch } = useGetBooksQuery();
  const {
    data: authors = [],
    isLoading: authorsLoading,
    isError: authorsError,
  } = useGetAllAuthorsQuery();

  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();

  const [editBook, setEditBook] = useState<BookType | null>(null);
  const [toast, setToast] = useState<string>("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSubmit = async (data: BookFormInput) => {
    try {
      const payload = {
        title: data.title,
        authorId: Number(data.authorId),
        isbn: data.isbn,
        description: data.description,
        publishedDate: data.publishedDate,
        publicationYear: Number(data.publicationYear),
      };

      if (editBook) {
        await updateBook({ id: editBook.bookId, data: payload }).unwrap();
        showToast("✅ Book updated!");
      } else {
        await createBook(payload).unwrap();
        showToast("✅ Book added!");
      }

      setEditBook(null);
      refetch();
    } catch (err: any) {
      console.error("Book submit error:", err);
      showToast("❌ Error saving book");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBook(id).unwrap();
      showToast("🗑️ Book deleted!");
      refetch();
    } catch (err: any) {
      console.error("Book delete error:", err);
      showToast("❌ Error deleting book");
    }
  };

  return (
    <div className="book-section">
      <div className="book-table-wrapper">
        <h3>📚 All Books</h3>
        {isLoading && <p>Loading books...</p>}
        {isError && <p className="error-message">Failed to load books.</p>}

        {!isLoading && books.length > 0 ? (
          <table className="book-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Year</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, idx) => (
                <tr
                  key={book.bookId}
                  className={editBook?.bookId === book.bookId ? "highlighted" : ""}
                >
                  <td>{idx + 1}</td>
                  <td>{book.title}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.author?.authorName ?? `ID: ${book.authorId}`}</td>
                  <td>
                    <button onClick={() => setEditBook(book)}>✏️ Edit</button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(book.bookId)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !isLoading && <p>No books found.</p>
        )}
      </div>

      <div className="book-form-wrapper">
        <h3>{editBook ? "✏️ Edit Book" : "➕ Add Book"}</h3>
        {authorsLoading ? (
          <p>Loading authors...</p>
        ) : authorsError ? (
          <p className="error-message">Failed to load authors</p>
        ) : (
          <BookForm
            onSubmit={handleSubmit}
            initialData={editBook || undefined}
            authors={authors}
            isLoading={isCreating || isUpdating}
          />
        )}
        {toast && <div className="toast show">{toast}</div>}
      </div>
    </div>
  );
};
