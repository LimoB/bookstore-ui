import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { Author } from "../../../features/authorApi";

export type BookFormInput = {
  title: string;
  publicationYear: number;
  authorId: number;
  description?: string;
  isbn?: string;
  publishedDate: string;
};

interface Props {
  onSubmit: (data: BookFormInput) => void;
  initialData?: Partial<BookFormInput>;
  authors: Author[];
  isLoading?: boolean;
}

export default function BookForm({
  onSubmit,
  initialData,
  authors,
  isLoading = false,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookFormInput>();

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof BookFormInput, value);
        }
      });
    }
  }, [initialData, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md bg-white border border-indigo-100 shadow-md p-6 rounded-xl flex flex-col gap-4 animate-scaleIn"
    >
      <input
        type="text"
        placeholder="Book Title"
        {...register("title", { required: true })}
        className="px-4 py-2 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {errors.title && (
        <span className="text-sm text-red-600">Title is required.</span>
      )}

      <input
        type="number"
        placeholder="Publication Year"
        {...register("publicationYear", { required: true })}
        className="px-4 py-2 border border-indigo-300 rounded-md"
      />
      {errors.publicationYear && (
        <span className="text-sm text-red-600">Year is required.</span>
      )}

      <select
        {...register("authorId", { required: true })}
        className="px-4 py-2 border border-indigo-300 rounded-md bg-white"
      >
        <option value="">Select Author</option>
        {authors.map((author) => (
          <option key={author.authorId} value={author.authorId}>
            {author.authorName}
          </option>
        ))}
      </select>
      {errors.authorId && (
        <span className="text-sm text-red-600">Author is required.</span>
      )}

      <input
        type="text"
        placeholder="Description (optional)"
        {...register("description")}
        className="px-4 py-2 border border-indigo-300 rounded-md"
      />

      <input
        type="text"
        placeholder="ISBN (optional)"
        {...register("isbn")}
        className="px-4 py-2 border border-indigo-300 rounded-md"
      />

      <input
        type="date"
        {...register("publishedDate", { required: true })}
        className="px-4 py-2 border border-indigo-300 rounded-md"
      />
      {errors.publishedDate && (
        <span className="text-sm text-red-600">Published date is required.</span>
      )}

      <div className="mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition-all"
        >
          {isLoading ? "Saving..." : initialData ? "Update Book" : "Add Book"}
        </button>
      </div>
    </form>
  );
}
