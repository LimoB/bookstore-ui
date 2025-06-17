// src/features/authorApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Author {
  authorId: number;
  authorName: string;
  genreId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAuthorInput {
  authorName: string;
  genreId: number;
}

export interface UpdateAuthorInput {
  authorName?: string;
  genreId?: number;
}

export const authorApi = createApi({
  reducerPath: "authorApi",
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
  tagTypes: ["Author"],
  endpoints: (builder) => ({
    getAllAuthors: builder.query<Author[], void>({
      query: () => "/authors",
      providesTags: ["Author"],
    }),

    getAuthorById: builder.query<Author, number>({
      query: (id) => `/authors/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Author", id }],
    }),

    createAuthor: builder.mutation<Author, CreateAuthorInput>({
      query: (author) => ({
        url: "/authors",
        method: "POST",
        body: author,
      }),
      invalidatesTags: ["Author"],
    }),

    updateAuthor: builder.mutation<Author, { id: number; data: UpdateAuthorInput }>({
      query: ({ id, data }) => ({
        url: `/authors/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Author", id }],
    }),

    deleteAuthor: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/authors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Author"],
    }),
  }),
});

export const {
  useGetAllAuthorsQuery,
  useGetAuthorByIdQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
} = authorApi;

