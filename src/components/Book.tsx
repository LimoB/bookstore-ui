import { useForm } from "react-hook-form";
import { useState } from "react";
import "./Book.scss";
import {
    useCreateBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
    useGetBooksQuery,
    type Book as BookType,
} from "../features/bookApi";

type BookFormInput = {
    title: string;
    publicationYear: number;
    authorId: number;
    description?: string;
    isbn?: string;
};

export const BookManager = () => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<BookFormInput>();

    const { data: books = [], isLoading, refetch } = useGetBooksQuery();
    const [createBook] = useCreateBookMutation();
    const [updateBook] = useUpdateBookMutation();
    const [deleteBook] = useDeleteBookMutation();

    const [editId, setEditId] = useState<number | null>(null);
    const [toast, setToast] = useState("");

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    const onSubmit = async (data: BookFormInput) => {
        try {
            if (editId !== null) {
                await updateBook({ id: editId, data }).unwrap();
                showToast("✅ Book updated!");
                setEditId(null);
            } else {
                await createBook(data).unwrap();
                showToast("✅ Book added!");
            }
            reset();
            refetch();
        } catch (err) {
            showToast("❌ Error performing action");
            console.error(err);
        }
    };

    const handleEdit = (book: BookType) => {
        setValue("title", book.title);
        setValue("publicationYear", book.publicationYear || 0);
        setValue("authorId", book.authorId);
        setValue("description", book.description || "");
        setValue("isbn", book.isbn || "");
        setEditId(book.bookId);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteBook(id).unwrap();
            showToast("🗑️ Book deleted!");
            refetch();
        } catch (err) {
            console.error(err);
            showToast("❌ Error deleting book");
        }
    };

    return (
        <div className="book-section">
            <div className="book-table-wrapper">
                <h3>📚 All Books</h3>
                {isLoading ? (
                    <p>Loading books...</p>
                ) : books.length > 0 ? (
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
                            {books.map((book, index) => (
                                <tr key={book.bookId}>
                                    <td>{index + 1}</td>
                                    <td>{book.title}</td>
                                    <td>{book.publicationYear}</td>
                                    <td>{book.author?.authorName || book.authorId}</td>
                                    <td>
                                        <button onClick={() => handleEdit(book)}>✏️ Update</button>
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
                    <p>No books found</p>
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
                    {errors.title && <span>Title is required</span>}

                    <input
                        type="number"
                        placeholder="Publication Year"
                        {...register("publicationYear", { required: true })}
                    />
                    {errors.publicationYear && <span>Year is required</span>}

                    <input
                        type="number"
                        placeholder="Author ID"
                        {...register("authorId", { required: true })}
                    />
                    {errors.authorId && <span>Author ID is required</span>}

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

                    <button type="submit">
                        {editId !== null ? "Update Book" : "Add Book"}
                    </button>
                </form>

                {toast && <div className="toast">{toast}</div>}
            </div>
        </div>
    );
};
