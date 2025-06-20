import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface AuthorFormInput {
  authorName: string;
  genreId: number;
}

interface Props {
  onSubmit: (author: AuthorFormInput) => void;
  onClose: () => void;
  initialData?: AuthorFormInput;
  isLoading?: boolean;
  genres: {
    genreId: number;
    genreName: string;
  }[];
  existingAuthors: { authorName: string }[]; // ✅ new prop for duplicate check
}

export default function AuthorForm({
  onSubmit,
  initialData,
  isLoading = false,
  genres,
  existingAuthors,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AuthorFormInput>();

  useEffect(() => {
    if (initialData) {
      reset({
        authorName: initialData.authorName,
        genreId: initialData.genreId,
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = (data: AuthorFormInput) => {
    const isDuplicate = existingAuthors.some(
      (a) =>
        a.authorName.trim().toLowerCase() === data.authorName.trim().toLowerCase()
    );

    if (!initialData && isDuplicate) {
      setError("authorName", {
        type: "manual",
        message: "Author already exists",
      });
      return;
    }

    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="w-full max-w-md bg-indigo-50 border border-indigo-200 p-6 rounded-xl shadow-md flex flex-col gap-4 animate-scaleIn"
    >
      <input
        type="text"
        placeholder="Author Name"
        {...register("authorName", { required: "Author name is required" })}
        aria-label="Author Name"
        className="p-3 text-base border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      {errors.authorName && (
        <p className="text-sm text-red-600">{errors.authorName.message}</p>
      )}

      <select
        {...register("genreId", {
          required: "Genre is required",
          valueAsNumber: true,
        })}
        aria-label="Genre"
        defaultValue=""
        className="p-3 text-base border border-indigo-300 rounded-md bg-white"
      >
        <option value="">Select Genre</option>
        {genres.length > 0 ? (
          genres.map((genre) => (
            <option key={genre.genreId} value={genre.genreId}>
              {genre.genreName}
            </option>
          ))
        ) : (
          <option disabled value="">
            ⚠️ No genres available
          </option>
        )}
      </select>
      {errors.genreId && (
        <p className="text-sm text-red-600">{errors.genreId.message}</p>
      )}

      <div className="flex justify-end gap-3 mt-4">
        {/* <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
        >
          Cancel
        </button> */}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
