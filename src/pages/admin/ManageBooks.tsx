// src/pages/admin/ManageBooks.tsx
import { useForm } from "react-hook-form";
import { useState } from "react";
import "./Book.scss";
import {
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetBooksQuery,
  type Book as BookType,
} from "../../features/bookApi";

import {
  useGetAllAuthorsQuery,
  type Author,
} from "../../features/authorApi";

type BookFormInput = {
  title: string;
  publicationYear: number;
  authorId: number;
  description?: string;
  isbn?: string;
  publishedDate: string;
};

export const BookManager = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookFormInput>();

  const {
    data: books = [],
    isLoading,
    isError,
    refetch,
  } = useGetBooksQuery();

  const {
    data: authors = [],
    isLoading: authorsLoading,
    isError: authorsError,
  } = useGetAllAuthorsQuery();

  const [createBook] = useCreateBookMutation();
  const [updateBook] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();

  const [editId, setEditId] = useState<number | null>(null);
  const [toast, setToast] = useState<string>("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const onSubmit = async (data: BookFormInput) => {
    try {
      const payload = {
        title: data.title,
        authorId: Number(data.authorId),
        isbn: data.isbn,
        description: data.description,
        publishedDate: data.publishedDate,
        publicationYear: Number(data.publicationYear),
      };

      if (editId !== null) {
        await updateBook({ id: editId, data: payload }).unwrap();
        showToast("✅ Book updated!");
      } else {
        await createBook(payload).unwrap();
        showToast("✅ Book added!");
      }

      reset();
      setEditId(null);
      refetch();
    } catch (err: any) {
      console.error("Book submit error:", err?.response?.data || err);
      showToast("❌ Error performing action");
    }
  };

  const handleEdit = (book: BookType) => {
    setValue("title", book.title);
    setValue("publicationYear", book.publicationYear || 0);
    setValue("authorId", book.authorId);
    setValue("description", book.description || "");
    setValue("isbn", book.isbn || "");
    setValue("publishedDate", book.publishedDate || "");
    setEditId(book.bookId);
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
                <tr key={book.bookId}>
                  <td>{idx + 1}</td>
                  <td>{book.title}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.author?.authorName ?? `ID: ${book.authorId}`}</td>
                  <td>
                    <button onClick={() => handleEdit(book)}>✏️ Edit</button>
                    <button className="delete" onClick={() => handleDelete(book.bookId)}>
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
        <h3>{editId ? "✏️ Edit Book" : "➕ Add Book"}</h3>
        <form className="book-form" onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Book Title"
            {...register("title", { required: true })}
          />
          {errors.title && <span className="error">Title is required.</span>}

          <input
            type="number"
            placeholder="Publication Year"
            {...register("publicationYear", { required: true })}
          />
          {errors.publicationYear && <span className="error">Year is required.</span>}

          {authorsLoading ? (
            <p>Loading authors...</p>
          ) : authorsError ? (
            <p className="error-message">Failed to load authors</p>
          ) : (
            <select {...register("authorId", { required: true })}>
              <option value="">Select Author</option>
              {authors.map((author: Author) => (
                <option key={author.authorId} value={author.authorId}>
                  {author.authorName}
                </option>
              ))}
            </select>
          )}
          {errors.authorId && <span className="error">Author is required.</span>}

          <input
            type="text"
            placeholder="Description (optional)"
            {...register("description")}
          />

          <input
            type="text"
            placeholder="ISBN (optional)"
            {...register("isbn")}
          />

          <input
            type="date"
            placeholder="Published Date"
            {...register("publishedDate", { required: true })}
          />
          {errors.publishedDate && <span className="error">Published date is required.</span>}

          <button type="submit">
            {editId !== null ? "Update Book" : "Add Book"}
          </button>
        </form>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
};
