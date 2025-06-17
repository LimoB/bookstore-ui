import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Book {
  bookId: number;
  title: string;
  description?: string;
  isbn?: string;
  publicationYear?: number;
  authorId: number;
  createdAt?: string;
  updatedAt?: string;

  // Related author (optional)
  author?: {
    authorId: number;
    authorName: string;
    genreId: number;
  };

  // Related owners (optional)
  owners?: {
    bookOwnerId: number;
    ownerId: number;
    user?: {
      userId: number;
      fullName: string;
      email: string;
    };
  }[];
}

export interface CreateBookInput {
  title: string;
  description?: string;
  isbn?: string;
  publicationYear?: number;
  authorId: number;
}

export const bookApi = createApi({
  reducerPath: "bookApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Book"],
  endpoints: (builder) => ({
    getBooks: builder.query<Book[], void>({
      query: () => "/book",
      providesTags: ["Book"],
    }),

    getBookById: builder.query<Book, number>({
      query: (id) => `/book/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Book", id }],
    }),

    createBook: builder.mutation<Book, CreateBookInput>({
      query: (book) => ({
        url: "/book",
        method: "POST",
        body: book,
      }),
      invalidatesTags: ["Book"],
    }),

    updateBook: builder.mutation<Book, { id: number; data: CreateBookInput }>({
      query: ({ id, data }) => ({
        url: `/book/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Book", id }],
    }),

    deleteBook: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/book/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = bookApi;
